import * as React from 'react'
import { View, Flex, Form, TextField, RadioGroup, Radio, Button, Picker, Item, ProgressCircle, ListBox, Text } from '@adobe/react-spectrum'
import { useQuery, useMutation } from 'urql'
import { GetDocByIdResult, UpdateDoc, UpdateDocResult, UpdateDocParams } from '../../../gql'
import { useFormik } from 'formik'
import { setFieldValue, alert, highlights } from '../../../utils'
import Select from 'react-select'

function Container(props) {
  return (
    <Flex justifyContent='center'>
      <View UNSAFE_className='rounded' width="640px" backgroundColor='static-white' padding='size-200' UNSAFE_style={{ boxSizing: 'border-box' }}>
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
      highlights: doc.code_highlights.map(o => ({ value: o, label: o })),
      visibility: doc.visibility
    },
    async onSubmit(values) {
      const updateResult = await updateDoc({
        docId: doc.id,
        input: {
          default_page: values.default_page,
          title: values.title,
          code_highlights: values.highlights.map(o => o.value),
          visibility: values.visibility
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


        <View marginBottom='size-100'>
          <View marginBottom='size-100'>
            <small>Syntax Highlight</small>
          </View>
          <Select value={form.values.highlights} onChange={setFieldValue(form, 'highlights')} isMulti options={highlights} />
        </View>


        <Picker selectedKey={form.values.visibility} label='Visibility' onSelectionChange={setFieldValue(form, 'visibility')}>
          <Item key='public'>
            Public
          </Item>
          <Item key='private'>
            Only team members
          </Item>
        </Picker>

        <View marginTop='size-100'>
          <Button isDisabled={udpateDocResult.fetching} onPress={form.submitForm} variant='cta'>Save</Button>
        </View>
      </Form>
    </Container>
  )
}

export default DocSettings