import * as React from 'react'
import { Provider, useMutation, useQuery } from 'urql'
import client from '../client'
// @ts-expect-error
import { history } from 'umi'
import * as utils from '../utils'

type GetAllDocsResult = {
  doc: {
    slug: string,
    title: string
  }[]
}
const GetAllDocs = `
query {
  doc {
    slug, title
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

  function onClickDoc(doc: GetAllDocsResult['doc'][0]) {
    history.push(`/doc/${doc.slug}`)
  }

  return (
    <div>
      <Docs docs={allDocsResult.data.doc} onClickDoc={onClickDoc} />
    </div>
  )
}


function Docs({
  docs,
  onClickDoc
}: {
  docs: GetAllDocsResult['doc'],
  onClickDoc?: (doc: GetAllDocsResult['doc'][0]) => void
}) {

  return (
    <div>
      {docs.map(doc => {

        function goDocAdmin() {
          history.push(`/`)
        }

        return (
          <div key={doc.slug}>
            <div onClick={onClickDoc ? _ => onClickDoc(doc) : utils.noop}>{doc.title}</div>
          </div>
        )
      })}
    </div>
  )
}

export default Page