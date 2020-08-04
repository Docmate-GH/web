import * as React from 'react'
import { useQuery, useMutation } from 'urql'
import { useFormik } from 'formik'

const GetPage = `
query($docSlug: String!, $pageSlug: String!) {
  page(
    where: {
      doc_slug: { _eq: $docSlug },
      slug:{_eq: $pageSlug }
    }
  ) {
    id, slug, title, content
  }
}
`
type GetPageResult = {
  page: {
    id: string,
    slug: string,
    title: string,
    content: string
  }[]
}

type EditPageResult = {
  editPage: {
    id: string
  }
}
const EditPage = `
mutation($pageId: uuid!, $input: page_set_input!) {
  update_page_by_pk(pk_columns: {id: $pageId}, _set: $input) {
    id
  }
}
`

const DeletePage = `
mutation($pageId: uuid!) {
  delete_page_by_pk(id: $pageId) {
    id, slug
  }
}
`

export default ({
  match,
  history
}) => {
  const { docSlug, pageSlug } = match.params

  const [getPageResult, getPage] = useQuery<GetPageResult>({ query: GetPage, variables: { docSlug, pageSlug } })
  const [editPageResult, editPage] = useMutation<EditPageResult>(EditPage)
  const [deletePageResult, deletePage] = useMutation<EditPageResult>(DeletePage)


  React.useEffect(() => {
    getPage()
  }, [])

  const mainForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: getPageResult.data?.page[0]?.title,
      content: getPageResult.data?.page[0]?.content
    },
    async onSubmit(values) {
      const res = await editPage({
        pageId: getPageResult.data.page[0].id,
        input: {
          title: values.title,
          content: values.content
        }
      })

      console.log(res)
    }
  })

  if (getPageResult.error) {
    console.log(getPageResult.error)
    return <div>Error...</div>
  }

  if (getPageResult.fetching) {
    return <div>Loading...</div>
  }

  if (!getPageResult.data.page[0]) {
    return <div>404</div>
  }

  async function onClickDelete(page: GetPageResult['page'][0]) {
    const res = await deletePage({
      pageId: page.id
    })
    console.log(res)
    history.push(`/doc/${docSlug}`)
  }

  const page = getPageResult.data.page[0]!

  return (
    <div>
      <form onSubmit={mainForm.handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input onChange={mainForm.handleChange} name="title" type="text" value={mainForm.values.title} />
        </div>

        <div>
          <textarea onChange={mainForm.handleChange} name="content" id="content" value={mainForm.values.content}></textarea>
        </div>

        <div>
          <button type='submit'>save</button>
        </div>
      </form>

      <div>
        <button onClick={_ => onClickDelete(page)}>delete</button>
      </div>
    </div>
  )
}