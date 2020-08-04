import * as React from 'react'
import { Provider, useMutation } from 'urql'
import client from '../../client'


const CreateDoc = `
mutation($title: String!) {
  createDoc(title: $title) {
    slug, id
  }
}
`

function CreateDocPage() {

  const [createDocResult, createDoc] = useMutation(CreateDoc)

  async function onCreate() {
    const result = await createDoc({
      title: 'foo'
    })
    console.log(result)
  }

  return (
    <Provider value={client}>
      <div>

        <div>
          <label htmlFor="title">Doc title</label>
          <input id="title" type="text" />

        </div>

        <div>
          <button onClick={onCreate} >create</button>
        </div>
      </div>
    </Provider>
  )
}

export default CreateDocPage