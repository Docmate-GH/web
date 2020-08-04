import * as React from 'react'
import { useQuery, useMutation } from 'urql'
import { useFormik } from 'formik'

const GetPage = `
query($docId: String!, $pageSlug: String!) {
  getPage(docId: $docId, pageSlug: $pageSlug) {
    title, content, id
  }
}
`
type GetPageResult = {
  getPage: {
    title: string,
    content: string,
    id: string
  }
}

type EditPageResult = {
  editPage: {
    id: string
  }
}
const EditPage = `
mutation($docId: String!, $pageSlug: String!, $input: EditPageInput!) {
  editPage(docId: $docId, pageSlug: $pageSlug, input: $input) {
    id
  }
}
`

export default ({
  match
}) => {
  const { docId, pageSlug } = match.params

  const [getPageResult, getPage] = useQuery<GetPageResult>({ query: GetPage, variables: { docId, pageSlug } })
  const [ editPageResult, editPage ] = useMutation<EditPageResult>(EditPage)

  React.useEffect(() => {
    getPage()
  }, [])

  const mainForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: getPageResult.data?.getPage.title,
      content: getPageResult.data?.getPage.content
    },
    async onSubmit(values) {
      const res = await editPage({
        docId, pageSlug,
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

  const page = getPageResult.data.getPage

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
    </div>
  )
}