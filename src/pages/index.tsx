import * as React from 'react'
import { Provider, useMutation, useQuery } from 'urql'
import client from '../client'
// @ts-expect-error
import { history } from 'umi'
import * as utils from '../utils'

type GetAllDocsResult = {
  allDocs: {
    id: string,
    slug: string,
    title: string
  }[]
}
const GetAllDocs = `
query {
  allDocs {
    id, slug, title
  }
}
`

function Page({
  history
}) {

  const [allDocsResult, getAllDocs] = useQuery<GetAllDocsResult>({ query: GetAllDocs })

  React.useEffect(() => {
    getAllDocs()
  }, [])

  if (allDocsResult.fetching) {
    return <div>Fetching...</div>
  }

  if (allDocsResult.error) {
    console.log(allDocsResult.error)
    return <div>Error...</div>
  }

  function onClickDoc(doc: GetAllDocsResult['allDocs'][0]) {
    history.push(`/doc/${doc.id}`)
  }

  return (
    <div>
      <Docs docs={allDocsResult.data.allDocs} onClickDoc={onClickDoc} />
    </div>
  )
}


function Docs({
  docs,
  onClickDoc
}: {
  docs: GetAllDocsResult['allDocs'],
  onClickDoc?: (doc: GetAllDocsResult['allDocs'][0]) => void
}) {

  return (
    <div>
      {docs.map(doc => {

        function goDocAdmin() {
          history.push(`/`)
        }

        return (
          <div key={doc.id}>
            <div onClick={onClickDoc ? _ => onClickDoc(doc) : utils.noop}>{doc.title}</div>
          </div>
        )
      })}
    </div>
  )
}

export default Page