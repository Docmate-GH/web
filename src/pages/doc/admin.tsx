import * as React from 'react'
import { useQuery } from 'urql'


type GetDocByIdResult = {
  getDocById: {
    id: string,
    slug: string,
    pages: {
      id: string, title: string, index: number, slug: string
    }[]
  }
}
const GetDocById = `
query($docId: String!, $withPages: Boolean!) {
  getDocById(docId: $docId, withPages: $withPages) {
    id, slug, pages {
      id, title, index, slug
    }
  }
}
`

function DocAdmin({
  match,
  history
}) {
  const { id } = match.params

  const [getDocReuslt, getDoc] = useQuery<GetDocByIdResult>({
    query: GetDocById, variables: {
      docId: id,
      withPages: true
    }
  })

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

  const doc = getDocReuslt.data.getDocById

  return (
    <div>
      {doc.slug}
      <div>
        <a onClick={_ => window.open(`http://localhost:3000/docs/${doc.slug}`, '_blank')}>open</a>

      </div>

      <div>
        {doc.pages.map(page => {
          function goPageEdit() {
            history.push(`/doc/${doc.id}/${page.slug}`)
          }
          return (
            <div key={page.id}>
              <a onClick={goPageEdit}>{page.title}</a>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DocAdmin
