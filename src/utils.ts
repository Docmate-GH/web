import 'biu.js/dist/biu.css'
import biu from 'biu.js'

export const noop = () => {}

export const setFieldValue = (form, fieldName) => value => {
  form.setFieldValue(fieldName, value)
}

export const alert = biu
