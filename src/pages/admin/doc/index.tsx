import * as React from 'react'
import { useQuery, useMutation } from 'urql'
import { nanoid } from 'nanoid'
import {
  Grid, View, Flex, ListBox, Section, Item, Button, Text, Heading, Link, ActionButton
} from '@adobe/react-spectrum'
import SideNav, { SideNavItem, SideNavItemLink, SideNavHead } from '../../../components/SideNav'
import { GetDocByIdResult, GetDocById, CreatePageResult, CreatePage } from '../../../gql'
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
    return <div>Fetching...</div>
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
      history.push(`/admin/doc/${docId}/page/${res.data.insert_page_one.slug}`)
    }
  }

  function openDoc() {
    window.open(`http://localhost:3000/docs/${doc.id}`)
  }

  function goSettings() {
    history.push(`/admin/doc/${docId}`)
  }

  return (
    <>
      <Flex direction='column' height='100%'>
        <View backgroundColor='static-white'>
          <Flex height='size-600' justifyContent='space-between'>
            <Flex flex='1'>
              <View alignSelf='center' paddingStart='size-200'>
                <Heading level={3} UNSAFE_style={{ cursor: 'pointer' }}>
                  <div onClick={_ => history.push('/')}>
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
              <Button alignSelf='center' variant='cta' onPress={openDoc} >Open Doc</Button>
            </Flex>
          </Flex>
        </View>
        <Flex direction='row' flex='1' UNSAFE_style={{ overflow: 'scroll' }}>
          <View backgroundColor='static-white' paddingX='size-200' width='size-3000' UNSAFE_style={{ boxSizing: 'border-box' }}>
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
                      <SideNavItemLink onClick={_ => history.push(`/admin/doc/${doc.id}/page/${page.slug}`)}>{page.title}</SideNavItemLink>
                    </SideNavItem>
                  )
                })}
              </SideNavItem>

            </SideNav>

            <View UNSAFE_className='text-center' paddingY='size-100' >
              <ActionButton onPress={onCreateNewPage} >New Page</ActionButton>
            </View>
          </View>

          <View overflow='scroll' flex='1'>
            {children}
          </View>
        </Flex>
      </Flex>
    </>
  )
}

export default DocAdmin
