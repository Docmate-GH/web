import * as React from 'react'
import { Provider, useMutation, useQuery } from 'urql'
import client from '../client'
// @ts-expect-error
import { history } from 'umi'
import * as utils from '../utils'
import { useFormik } from 'formik'

import { View, Flex, Button, Text, IllustratedMessage, Heading, Content, DialogTrigger, ActionButton, Dialog, Divider, ButtonGroup, Form, TextField, RadioGroup, Radio } from '@adobe/react-spectrum'
import Table, { TableHead, TableBody, TableHeadCell, TableRow, TableCell } from '../components/Table'

type GetAllDocsResult = {
  doc: {
    id: string,
    title: string,
    created_at: string
  }[]
}
const GetAllDocs = `
query {
  doc {
    id, title, created_at
  }
}
`

type CreateDocResult = {
  insert_doc_one: {
    id: string
  }
}
const CreateDoc = `
mutation($title: String!) {
  insert_doc_one(object: {
    title:$title
  }) {
    id
  }
}
`

function CreateDocForm(props: {
  onChange: (values: { title: string }) => void
}) {

  const [ title, setTitle ] = React.useState('')

  React.useEffect(() => {
    props.onChange({ title })
  }, [title])

  return (
    <Form isQuiet>
      <TextField value={title} onChange={value => setTitle(value)} label='Doc Title' isRequired />

      <RadioGroup label='Template' orientation='horizontal' defaultValue='docute'>
        <Radio value='docute'>Docute</Radio>
        <Radio isDisabled value='docsify'>Docsify (comming soon...)</Radio>
      </RadioGroup>
    </Form>
  )
}

function Page({
  history
}) {

  const [allDocsResult, getAllDocs] = useQuery<GetAllDocsResult>({ query: GetAllDocs })
  const [createDocResult, createDoc] = useMutation<CreateDocResult>(CreateDoc)

  const createDocFormValues = React.useRef({} as { title: string })

  const CreateDocTrigger = React.useCallback(() => {
    return (
      <DialogTrigger>
        <Button variant='overBackground' >Create doc</Button >

        {close => {
          return (
            <Dialog>
              <Heading>Create a doc</Heading>
              <Divider />
              <Content>
                <View>
                  <CreateDocForm onChange={values => { createDocFormValues.current = values }} />
                </View>
              </Content>

              <ButtonGroup>
                <Button variant='secondary' onPress={close}>Cancel</Button>
                <Button variant='cta' onPress={async _ => {
                  const createDocResult = await createDoc({
                    title: createDocFormValues.current.title
                  })
                  if (createDocResult.data?.insert_doc_one.id) {
                    history.push(`/admin/doc/${createDocResult.data.insert_doc_one.id}`)
                  } else {
                    // TODO: create page error
                  }
                }}>Create</Button>
              </ButtonGroup>
            </Dialog>
          )
        }}
      </DialogTrigger>
    )
  }, [])

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
    history.push(`/admin/doc/${doc.id}`)
  }

  return (
    <div>
      <View backgroundColor='gray-900' paddingY='size-150'>
        <Flex direction='row' justifyContent='center'>
          <Flex direction='row' width='960px' justifyContent='space-between'>
            <View>

            </View>

            <View>
              <CreateDocTrigger />
            </View>

          </Flex>
        </Flex>
      </View>


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
      <Flex justifyContent='center'>
        <View width='960px' paddingY='size-500'>

          {docs.length === 0 && (
            <View paddingY='size-500'>
              <IllustratedMessage>
                <Button variant='cta'>Create Doc</Button>
              </IllustratedMessage>
            </View>
          )
          }

          {docs.length > 0 && <Table>
            <TableHead>
              <TableHeadCell>
                <Text>Doc</Text>
              </TableHeadCell>

              <TableHeadCell>
                <Text>Created Date</Text>
              </TableHeadCell>

            </TableHead>

            <TableBody>
              {docs.map(doc => {

                function goDocAdmin() {
                  history.push(`/`)
                }

                return (
                  <TableRow key={doc.id} onClick={onClickDoc ? _ => onClickDoc(doc) : utils.noop}>
                    <TableCell>{doc.title}</TableCell>
                    <TableCell>{(new Date(doc.created_at).toLocaleString())}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>

          </Table>}
        </View>
      </Flex>

    </div>
  )
}

export default Page