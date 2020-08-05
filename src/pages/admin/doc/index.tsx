import * as React from 'react'
import { useQuery, useMutation } from 'urql'
import { nanoid } from 'nanoid'
import {
  Grid, View, Flex, ListBox, Section, Item, Button
} from '@adobe/react-spectrum'
import SideNav, { SideNavItem, SideNavItemLink, SideNavHead } from '../../../components/SideNav'
type GetDocByIdResult = {
  doc_by_pk: {
    id: string
    title: string,
    pages: {
      id: string,
      slug: string,
      title
    }[]
  }
}
const GetDocBySlug = `
query($docId: uuid!) {
  doc_by_pk(id: $docId) {
    id, title, pages(
      where: {
        deleted_at: { _is_null: true }
      }
    ) {
      slug, title
    }
  }
}
`

type CreatePageResult = {
  insert_page_one: {
    id: string,
    slug: string,
  }
}
const CreatePage = `
mutation ($object: page_insert_input!) {
  insert_page_one(object: $object) {
    id, slug
  }
}
`

function DocAdmin({
  match,
  history,
  children
}) {
  const { docId } = match.params

  const [getDocReuslt, getDoc] = useQuery<GetDocByIdResult>({
    query: GetDocBySlug, variables: {
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

  return (

    <Flex direction='row' minHeight='100%'>
      <View backgroundColor='static-white' padding='size-200' width='size-3000'>
        <SideNav>
          <SideNavItem>
            <SideNavHead>
              Doc
            </SideNavHead>
            <SideNavItem>
              <SideNavItemLink onClick={_ => window.open(`http://localhost:3000/docs/${doc.id}`)}>Open Doc</SideNavItemLink>
            </SideNavItem>
            <SideNavItem>
              <SideNavItemLink>Settings</SideNavItemLink>
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
          <Button variant='cta' onPress={onCreateNewPage} >New Page</Button>
        </View>
      </View>


      <View flex margin='0 auto'>
        {children}
      </View>

      {/* <div>
        <a onClick={_ => window.open(`http://localhost:3000/docs/${doc.slug}`, '_blank')}>open</a>

      </div>

      <div>
        {doc.pages.map(page => {
          function goPageEdit() {
            history.push(`/doc/${doc.slug}/${page.slug}`)
          }
          return (
            <div key={page.id}>
              <a onClick={goPageEdit}>{page.title}</a>
            </div>
          )
        })}
      </div>

      <div>
        <button onClick={onCreateNewPage}>
          create new page

        </button>
      </div> */}
    </Flex>
  )
}

export default DocAdmin
