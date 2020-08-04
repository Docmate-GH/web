import * as React from 'react'
import { useQuery, useMutation } from 'urql'
import { nanoid } from 'nanoid'
import {
  Grid, View, Flex, ListBox, Section, Item, Button
} from '@adobe/react-spectrum'
import SideNav, { SideNavItem, SideNavItemLink, SideNavHead } from '../../components/SideNav'
type GetDocByIdResult = {
  doc_by_pk: {
    title: string,
    slug: string,
    pages: {
      id: string,
      slug: string,
      title
    }[]
  }
}
const GetDocBySlug = `
query($docSlug: String!) {
  doc_by_pk(slug: $docSlug) {
    title, slug, pages {
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
  history
}) {
  const { docSlug } = match.params

  const [getDocReuslt, getDoc] = useQuery<GetDocByIdResult>({
    query: GetDocBySlug, variables: {
      docSlug,
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
        doc_slug: docSlug,
        slug: nanoid(8),
        content: ''
      }
    })
    if (res.data) {
      history.push(`/doc/${docSlug}/${res.data.insert_page_one.slug}`)
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
              <SideNavItemLink>Open Doc</SideNavItemLink>
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
                  <SideNavItemLink>{page.title}</SideNavItemLink>
                </SideNavItem>
              )
            })}
          </SideNavItem>

        </SideNav>

        <View UNSAFE_className='text-center' paddingY='size-100' >
          <Button variant='cta'>New Page</Button>
        </View>
      </View>


      <View backgroundColor='static-white' width='100%'>
        Hello
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
