import * as React from 'react'
import { useQuery, useMutation } from 'urql'
import { useFormik } from 'formik'
import { View, Button, Form, Flex, MenuTrigger, ActionButton, Menu, Item, Text, TextField, ProgressCircle, Breadcrumbs } from '@adobe/react-spectrum'

import More from '@spectrum-icons/workflow/More'
import Delete from '@spectrum-icons/workflow/Delete'

const GetPage = `
query($docId: uuid!, $pageSlug: String!) {
  page(
    where: {
      doc_id: { _eq: $docId },
      slug:{_eq: $pageSlug },
      deleted_at: {_is_null: true}
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
  update_page_by_pk (_set:{
    deleted_at: "now()"
  }, pk_columns:{id: $pageId}) {
    id
  }
}
`

export default ({
  match,
  history
}) => {
  const { docId, pageSlug } = match.params

  const [getPageResult, getPage] = useQuery<GetPageResult>({ query: GetPage, variables: { docId, pageSlug } })
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
      console.log(values)
      const res = await editPage({
        pageId: getPageResult.data.page[0].id,
        input: {
          title: values.title,
          content: values.content
        }
      })
    }
  })

  if (getPageResult.error) {
    console.log(getPageResult.error)
    return <div></div>
  }

  if (getPageResult.fetching) {
    return <div></div>
  }

  if (!getPageResult.data.page[0]) {
    return <div>404</div>
  }

  async function onClickDelete(page: GetPageResult['page'][0]) {
    const res = await deletePage({
      pageId: page.id
    })
    console.log(res)
    history.push(`/admin/doc/${docId}`)
  }

  const page = getPageResult.data.page[0]!

  async function onClickSave() {
    const values = await mainForm.submitForm()
    console.log(values)
  }

  return (
    <View>
      <View>
        <View padding='size-200' backgroundColor='static-white' UNSAFE_style={{ boxSizing: 'border-box' }}>
          <Flex direction='row' justifyContent='space-between'>
            <View flex='1'>
            </View>
            <View>
              <Flex gap='size-100'>
                <View>
                  <Button variant='cta' onPress={onClickSave} isDisabled={editPageResult.fetching}>
                    {editPageResult.fetching && <ProgressCircle size='S' isIndeterminate aria-label='saving' marginEnd='size-100' />}
                    <Text>Save</Text>
                  </Button>
                </View>

                <View>
                  <MenuTrigger align='start'>
                    <ActionButton>
                      <More />
                    </ActionButton>
                    <Menu onAction={key => {
                      if (key === 'delete') {
                        onClickDelete(page)
                      }
                    }}>
                      <Item key='delete' >
                        <Delete size='S' />
                        <Text>Delete</Text>
                      </Item>
                    </Menu>
                  </MenuTrigger>
                </View>
              </Flex>

            </View>
          </Flex>
        </View>
      </View>

      <View backgroundColor='static-white' paddingX='size-200'>
        <Form>
          <TextField onChange={content => mainForm.setFieldValue('title', content)} value={mainForm.values.title} label='Title' isQuiet width='100%' />
        </Form>
      </View>


      <View padding='size-200' backgroundColor='static-white'>
        <Editor id={page.id} onChange={content => mainForm.setFieldValue('content', content)} value={page.content} />
      </View>
    </View>
  )
}


declare var CodeMirror: any
function Editor(props: {
  id: string,
  value: string,
  onChange?: (content: string) => void
}) {

  const container = React.useRef(null as HTMLDivElement | null)

  const cm = React.useRef(null as any)

  React.useLayoutEffect(() => {
    const $container = container.current!

    const codeMirror = CodeMirror((elt) => {
      console.log(elt)
      $container.parentNode.replaceChild(elt, $container)
    }, {
      value: props.value || '',
      lineWrapping: true,
      mode: 'markdown'
    })

    codeMirror.on('change', () => {
      if (props.onChange) {
        props.onChange(codeMirror.getValue())
      }
    })

    codeMirror.setSize('100%', '600px')

    cm.current = codeMirror
  }, [])

  React.useEffect(() => {
    if (cm.current) {
      cm.current.setValue(props.value)
      cm.current.clearHistory()
    }
  }, [props.id])

  // React.useEffect(() => {
  //   if (cm.current && props.value) {
  //     cm.current.setValue(props.value)
  //   }
  // }, [props.value])

  return (
    <div>
      <div style={{ minHeight: '600px' }} ref={container}></div>
    </div>
  )
}