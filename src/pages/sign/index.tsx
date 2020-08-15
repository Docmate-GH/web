import * as React from 'react'
import { View, Flex, Heading, Form, TextField, Text, Button, Link } from '@adobe/react-spectrum'
import AppFooter from '../../components/Footer'
import { useMutation } from 'urql'
import { SignUpResult, SignUp, SignInResult, SignIn } from '../../gql'
import { useFormik } from 'formik'
import * as yup from 'yup'
import * as utils from '../../utils'
import { httpClient } from '../../client'
import { userService } from '../../service'

enum SignView {
  SignUp,
  SignIn,
  OAuth
}

function SignUpForm(props: {
  setView: any
}) {
  const [signupResult, signUp] = useMutation<SignUpResult>(SignUp)
  const [errorMessage, setErrorMessage] = React.useState(null as null | string)


  const form = useFormik({
    initialValues: {
      password: '',
      password_confirm: '',
      email: ''
    },
    validationSchema() {
      return yup.object().shape({
        password: yup.string().required(),
        password_confirm: yup.string().required(),
        email: yup.string().required()
      })
    },
    async onSubmit(values) {
      const result = await signUp({
        email: values.email,
        password: values.password.toString(),
        password_confirm: values.password_confirm.toString()
      })

      if (!result.error) {
        utils.alert('Account created! Please sign in now', { type: 'success' })
        props.setView(SignView.SignIn)
      } else {
        setErrorMessage(result.error.graphQLErrors[0].message)
      }
    }
  })

  async function onClickSignUp() {
    await form.submitForm()
  }

  return (
    <>
      <Heading marginTop='0' level={1}>Welcome to Docmate</Heading>
      <Heading marginTop='0' level={4}>Create a free account</Heading>

      <Form isQuiet isRequired>
        <Text UNSAFE_style={{ color: 'red' }}>{errorMessage}</Text>

        <TextField validationState={form.errors.email ? 'invalid' : 'valid'} value={form.values.email} onChange={utils.setFieldValue(form, 'email')} label='email' placeholder='john@example.com' />
        <TextField validationState={form.errors.password ? 'invalid' : 'valid'} type='password' value={form.values.password} onChange={utils.setFieldValue(form, 'password')} label='password' />
        <TextField validationState={form.errors.password_confirm ? 'invalid' : 'valid'} type='password' value={form.values.password_confirm} onChange={utils.setFieldValue(form, 'password_confirm')} label='password confirm' />

        <Button isDisabled={signupResult.fetching} onPress={onClickSignUp} marginTop='size-500' variant='cta'> Create Account</Button>
      </Form>
    </>
  )
}

function SignInForm() {
  const [signInResult, signIn] = useMutation<SignInResult>(SignIn)

  const [errorMessage, setErrorMessage] = React.useState(null as null | string)

  const form = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    async onSubmit(values) {
      try {
        const result = await httpClient.post<{
          message: string,
          id: string,
          email: string,
          avatar: string,
          username: string
        }>('/api/v1/signIn', {
          email: values.email,
          password: values.password
        })
        location.reload()
      } catch (e) {
        const errorMessage = e.response.data.message
        setErrorMessage(errorMessage)
      }
    }
  })

  function onClickSignIn() {
    form.submitForm()
  }

  return (
    <>
      <Heading marginTop='size-0' level={1}>Welcome to Docmate</Heading>
      <Form isQuiet>
        <Text UNSAFE_style={{ color: 'red' }}>{errorMessage}</Text>
        <TextField value={form.values.email} onChange={utils.setFieldValue(form, 'email')} label='email' placeholder='john@example.com' />
        <TextField type='password' value={form.values.password} onChange={utils.setFieldValue(form, 'password')} label='password' />

        <Button isDisabled={signInResult.fetching} onPress={onClickSignIn} marginTop='size-500' variant='cta'>Sign In</Button>
      </Form>
    </>
  )
}

declare var USE_OAUTH: string

export default function (props) {

  const [view, setView] = React.useState(USE_OAUTH === 'true' ? SignView.OAuth : SignView.SignIn)

  const viewMap = React.useMemo(() => {
    return {
      [SignView.SignIn]: <SignInForm />,
      [SignView.SignUp]: <SignUpForm setView={setView} />,
      [SignView.OAuth]: <OAuth />
    }
  }, [])

  return (
    <>
      <View paddingY='size-2000'>
        <Flex justifyContent='center'>
          <View width='320px' backgroundColor='static-white' padding='size-500' UNSAFE_style={{ boxSizing: 'border-box' }} UNSAFE_className='rounded'>
            {viewMap[view]}

            {USE_OAUTH !== 'true' && <Flex justifyContent='center'>
              <View marginTop='size-200'>
                {view === SignView.SignUp ? <Link onPress={_ => setView(SignView.SignIn)}>Already have account</Link> : <Link onPress={_ => setView(SignView.SignUp)}>Create account</Link>}
              </View>
            </Flex>}
          </View>
        </Flex>

      </View>
      <AppFooter />
    </>
  )
}

function OAuth() {
  return (
    <View>
      <Heading marginTop='size-0' level={1}>Welcome to Docmate</Heading>
      <a className='oauth-btn' href={`/login/github`}>Continue with GitHub</a>
    </View>
  )
}