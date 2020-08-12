import * as React from 'react'
import { View, Flex, Form, TextField, RadioGroup, Radio, Button, Picker, Item, ProgressCircle, ListBox } from '@adobe/react-spectrum'
import { useQuery, useMutation } from 'urql'
import { GetDocByIdResult, UpdateDoc, UpdateDocResult, UpdateDocParams } from '../../../gql'
import { useFormik } from 'formik'
import { setFieldValue, alert, highlights } from '../../../utils'

function Container(props) {
  return (
    <Flex height='100%' justifyContent='center'>
      <View UNSAFE_className='rounded' width="960px" backgroundColor='static-white' padding='size-200' UNSAFE_style={{ boxSizing: 'border-box' }}>
        {props.children}
      </View>
    </Flex>
  )
}

function Loading() {
  return (
    <ProgressCircle isIndeterminate />
  )
}


function DocSettings({
  doc
}: {
  doc: GetDocByIdResult['doc_by_pk']
}) {

  const [udpateDocResult, updateDoc] = useMutation<UpdateDocResult, UpdateDocParams>(UpdateDoc)
  const form = useFormik({
    initialValues: {
      title: doc.title,
      default_page: doc.default_page,
      highlights: doc.code_highlights
    },
    async onSubmit(values) {
      const updateResult = await updateDoc({
        docId: doc.id,
        input: {
          default_page: values.default_page,
          title: values.title,
          code_highlights: values.highlights
        }
      })
      if (!updateResult.error) {
        alert('Settings saved', { type: 'success' })
      } else {
        // TODO: update error
      }
    }
  })

  return (
    <Container>
      <Form isQuiet>
        <TextField value={form.values.title} onChange={setFieldValue(form, 'title')} label='Doc Title' />

        <Flex>
          <RadioGroup isDisabled label='Template' orientation='horizontal' value='docute'>
            <Radio value='docute'>Docute</Radio>
            <Radio value='docsify'>Docsify (comming soon...)</Radio>
          </RadioGroup>

          <Picker selectedKey={form.values.default_page} label='Home Page' onSelectionChange={setFieldValue(form, 'default_page')}>
            {doc.pages.map(page => {
              return (
                <Item key={page.slug}>
                  {page.title}
                </Item>
              )
            })}
          </Picker>
        </Flex>

        <View>
          <small>Syntax Highlight</small>
          <ListBox onSelectionChange={(selected) => form.setFieldValue('highlights', selected === 'all' ? highlights : Array.from(selected))} maxWidth='size-3000' selectionMode='multiple' selectedKeys={form.values.highlights} maxHeight='size-3000' >
            {highlights.map(h => {
              return (
                <Item key={h}>{h}</Item>
              )
            })}
          </ListBox>
        </View>

        <View marginTop='size-500'>
          <Button isDisabled={udpateDocResult.fetching} onPress={form.submitForm} variant='cta'>Save</Button>
        </View>
      </Form>
    </Container>
  )
}

export default DocSettings