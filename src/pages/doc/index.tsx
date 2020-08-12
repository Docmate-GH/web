import * as React from 'react'
import { useQuery, useMutation } from 'urql'
import { nanoid } from 'nanoid'
import {
  Grid, View, Flex, ListBox, Section, Item, Button, Text, Heading, Link, ActionButton, Icon
} from '@adobe/react-spectrum'
import SideNav, { SideNavItem, SideNavItemLink, SideNavHead } from '../../components/SideNav'
import { GetDocByIdResult, GetDocById, CreatePageResult, CreatePage, batchResortMutation } from '../../gql'
import Footer from '../../components/Footer'
import Loading from '../../components/Loading'
import { DragDropContext, Droppable, DroppableProvidedProps, Draggable } from 'react-beautiful-dnd'
import { client } from '../../client'
import DragHandleIcon from '@spectrum-icons/workflow/DragHandle'

declare var HOST: string

function DocAdmin({
  match,
  history,
  children
}) {
  const { docId } = match.params

  const [getDocReuslt, getDoc] = useQuery<GetDocByIdResult>({
    query: GetDocById, variables: {
      docId,
    }
  })

  const [reOrderedPage, setReorderedPage] = React.useState(null as null | GetDocByIdResult['doc_by_pk']['pages'])

  const [createPageResult, createPage] = useMutation<CreatePageResult>(CreatePage)

  const [selectedSlug, setSelectedSlug] = React.useState(null as null | string)

  React.useEffect(() => {
    getDoc()
  }, [])

  React.useEffect(() => {
    setReorderedPage(null)
  }, [getDocReuslt.data])

  if (getDocReuslt.fetching) {
    return <Loading />
  }

  if (getDocReuslt.error) {
    return <div>Error</div>
  }

  const doc = getDocReuslt.data.doc_by_pk

  async function onCreateNewPage() {
    const res = await createPage({
      object: {
        doc_id: docId,
        slug: nanoid(8),
        content: ''
      }
    })
    if (res.data) {
      history.push(`/doc/${docId}/page/${res.data.insert_page_one.slug}`)
    }
  }

  function openDoc() {
    window.open(`${HOST}/docs/${doc.id}`)
  }

  function goSettings() {
    history.push(`/doc/${docId}`)
  }

  function onClickPage(page: GetDocByIdResult['doc_by_pk']['pages'][0]) {
    setSelectedSlug(page.slug)
    history.push(`/doc/${doc.id}/page/${page.slug}`)
  }

  async function onDragEnd(result) {
    if (!result.destination) {
      return
    }

    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      return
    }

    const pages = Array.from(doc.pages)
    const p = pages.find(page => page.id === result.draggableId)
    pages.splice(result.source.index, 1)
    pages.splice(result.destination.index, 0, p)

    const resortMutation = batchResortMutation(pages.map(page => page.id))

    setReorderedPage(pages)

    const resortResult = await client.mutation(resortMutation).toPromise()

    if (resortResult.error) {
      // TODO: resort error
    }
  }

  const pages = reOrderedPage || doc.pages

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>

        <Flex direction='column' height='100%'>
          <View backgroundColor='static-white'>
            <Flex justifyContent='center'>
              <Flex height='size-600' width='960px' justifyContent='space-between'>
                <Flex flex='1'>
                  <View alignSelf='center' paddingStart='size-200'>
                    <Heading level={3} UNSAFE_style={{ cursor: 'pointer' }}>
                      <div onClick={_ => history.push('/app')}>
                        Docmate
                  </div>
                    </Heading>
                  </View>
                </Flex>
                <Flex justifyContent='center' flex='1'>
                  <Heading level={3} alignSelf='center'>
                    {doc.team.title} / {doc.title}
                  </Heading>
                </Flex>

                <Flex justifyContent='end' marginEnd='size-100' flex='1'>
                  <Button alignSelf='center' variant='secondary' onPress={openDoc} >Open Doc</Button>
                </Flex>
              </Flex>
            </Flex>
          </View>

          <Flex justifyContent='center'>
            <Flex width='960px'>
              <View>
                <View UNSAFE_className='rounded' backgroundColor='static-white' width='size-3000' marginY='size-200' paddingX='size-200' paddingTop='size-100' paddingBottom='size-200' UNSAFE_style={{ boxSizing: 'border-box' }}>
                  <SideNav>
                    <SideNavItem>
                      <SideNavHead>
                        Doc
                    </SideNavHead>

                    </SideNavItem>

                    <SideNavItem>
                      <SideNavItemLink onClick={goSettings}>Settings</SideNavItemLink>
                    </SideNavItem>

                    <SideNavItem>
                      <SideNavHead>
                        Pages
                      </SideNavHead>

                    </SideNavItem>

                    {/* <View marginStart='size-150' marginBottom='size-150'>
                      <small style={{ color: 'GrayText' }}>Tips: Drag to re-order</small>
                    </View> */}
                    <Droppable droppableId={docId}>
                      {(provided) => {
                        return (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            {pages.map((page, index) => {
                              return (
                                <SideNavItem selected={selectedSlug === page.slug}>
                                  <DragablePage key={page.id} onClickPage={onClickPage} page={page} index={index} />
                                </SideNavItem>
                              )
                            })}
                            {provided.placeholder}
                          </div>
                        )
                      }}
                    </Droppable>

                  </SideNav>

                  <View UNSAFE_className='text-center' paddingY='size-100' >
                    <ActionButton onPress={onCreateNewPage} >New Page</ActionButton>
                  </View>
                </View>

              </View>


              <View overflow='scroll' flex='1' margin='size-200'>
                {React.cloneElement(children, { doc })}
              </View>
            </Flex>
          </Flex>

          <Footer />
        </Flex>
      </DragDropContext>

    </>
  )
}



enum DragType {
  Page = 'Page'
}

function DragablePage(props: {
  onClickPage?: (page: GetDocByIdResult['doc_by_pk']['pages'][0]) => void
  page: GetDocByIdResult['doc_by_pk']['pages'][0],
  index: number
}) {

  return (
    <Draggable draggableId={props.page.id} index={props.index}>
      {provided => (
        <Flex direction='row'>
          <SideNavItemLink onClick={_ => props.onClickPage(props.page)} ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
            <Text>
              {props.page.title}
            </Text>
          </SideNavItemLink>
        </Flex>
      )}
    </Draggable>
  )
}

export default DocAdmin
