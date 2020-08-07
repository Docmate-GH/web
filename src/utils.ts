export const noop = () => {}

export const setFieldValue = (form, fieldName) => value => {
  form.setFieldValue(fieldName, value)
}