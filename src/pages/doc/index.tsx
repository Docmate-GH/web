import * as React from 'react'
import { useQuery, useMutation } from 'urql'
import { nanoid } from 'nanoid'
import {
  Grid, View, Flex, ListBox, Section, Item, Button, Text, Heading, Link, ActionButton
} from '@adobe/react-spectrum'
import SideNav, { SideNavItem, SideNavItemLink, SideNavHead } from '../../components/SideNav'
import { GetDocByIdResult, GetDocById, CreatePageResult, CreatePage } from '../../gql'
import Footer from '../../components/Footer'
import Loading from '../../components/Loading'
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

  const [createPageResult, createPage] = useMutation<CreatePageResult>(CreatePage)

  React.useEffect(() => {
    getDoc()
  }, [])

  if (getDocReuslt.fetching) {
    return <Loading />
  }

  if (getDocReuslt.error) {
    console.log(getDocReuslt.error)
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

  return (
    <>
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
                    <SideNavItem>
                      <SideNavItemLink onClick={goSettings}>Settings</SideNavItemLink>
                    </SideNavItem>
                  </SideNavItem>

                  <SideNavItem>
                    <SideNavHead>
                      Pages
            </SideNavHead>
                    {doc.pages.map(page => {
                      return (
                        <SideNavItem key={page.id}>
                          <SideNavItemLink onClick={_ => history.push(`/doc/${doc.id}/page/${page.slug}`)}>{page.title}</SideNavItemLink>
                        </SideNavItem>
                      )
                    })}
                  </SideNavItem>

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
    </>
  )
}

export default DocAdmin
