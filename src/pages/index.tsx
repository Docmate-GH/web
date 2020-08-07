import * as React from 'react'
import { Provider, useMutation, useQuery } from 'urql'
import client from '../client'
// @ts-expect-error
import { history } from 'umi'
import * as utils from '../utils'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { View, Flex, Button, Text, IllustratedMessage, Link, Heading, Content, DialogTrigger, Footer, ActionButton, Dialog, Divider, ButtonGroup, Form, TextField, RadioGroup, Radio, Header, MenuTrigger, Menu, Item, Picker } from '@adobe/react-spectrum'
import Table, { TableHead, TableBody, TableHeadCell, TableRow, TableCell } from '../components/Table'
import { userService } from '../service'
import { SignInResult, SignIn, SignUpResult, SignUp, GetUserTeams, GetUserTeamsResult, GetTeamDocsResult, GetTeamDocs, CreateDocResult, CreateDoc } from '../gql'
import AppFooter from '../components/Footer'

function CreateDocTrigger({
  teams
}: {
  teams: GetUserTeamsResult['user_team']
}) {
  const [createDocResult, createDoc] = useMutation<CreateDocResult>(CreateDoc)

  const form = useFormik({
    initialValues: {
      title: '',
      teamId: teams[0]?.team.id || ''
    },
    async onSubmit(values) {
      const result = await createDoc({
        title: values.title,
        teamId: values.teamId
      })

      if (result.data?.insert_doc_one.id) {
        history.push(`/admin/doc/${result.data.insert_doc_one.id}`)
      } else {
        // TODO: create page error
      }
    }
  })

  React.useEffect(() => {
    if (teams.length > 0 && !form.values.teamId) {
      form.setFieldValue('teamId', teams[0].team.id)
    }
  }, [teams])

  return (
    <DialogTrigger>
      <Button variant='primary' >Create doc</Button >

      {close => {
        return (
          <Dialog>
            <Heading>Create a doc</Heading>
            <Divider />
            <Content>


              <View>
                <Form isQuiet>
                  <Flex gap='size-100'>
                    <View flex={1}>
                      <Picker onSelectionChange={utils.setFieldValue(form, 'teamId')} selectedKey={form.values.teamId} label='Team' placeholder='Team' isQuiet={false} width='size-1700'>
                        {teams.map(team => {
                          return (
                            <Item key={team.team.id}>{team.team.title}</Item>
                          )
                        })}
                      </Picker>
                    </View>
                    <View flex={7}>
                      <TextField width='100%' value={form.values.title} onChange={utils.setFieldValue(form, 'title')} label='Doc Title' isRequired />
                    </View>
                  </Flex>

                  <RadioGroup label='Template' orientation='horizontal' defaultValue='docute'>
                    <Radio value='docute'>Docute</Radio>
                    <Radio isDisabled value='docsify'>Docsify (comming soon...)</Radio>
                  </RadioGroup>

                </Form>
              </View>
            </Content>

            <ButtonGroup>
              <Button variant='secondary' onPress={close}>Cancel</Button>
              <Button variant='cta' onPress={form.submitForm}>Create</Button>
            </ButtonGroup>
          </Dialog>
        )
      }}
    </DialogTrigger>
  )
}

function Docs({
  docs,
  onClickDoc
}: {
  docs: GetTeamDocsResult['doc'],
  onClickDoc?: (doc: GetTeamDocsResult['doc'][0]) => void
}) {

  return (
    <div>
      <Flex justifyContent='center'>
        <View width='960px' paddingY='size-100'>
          <Table>
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

          </Table>
        </View>
      </Flex>

    </div>
  )
}

function Layout({
  history
}) {

  const [isSignUpDialog, setIsSignupDialog] = React.useState(true)

  const [getUserTeamsResult, getUserTeams] = useQuery<GetUserTeamsResult>({ query: GetUserTeams })

  const teams = getUserTeamsResult.data ? getUserTeamsResult.data.user_team : []

  React.useEffect(() => {
    getUserTeams()
  }, [])

  function SignInDialog({ close }) {

    const [signInResult, signIn] = useMutation<SignInResult>(SignIn)

    const form = useFormik({
      initialValues: {
        email: '',
        password: ''
      },
      async onSubmit(values) {
        const result = await signIn({
          email: values.email,
          password: values.password
        })
        if (!result.error) {
          const signInData = result.data!.signIn
          userService.saveToken(signInData.token)
          userService.saveUserInfo({
            email: signInData.email,
            id: signInData.id,
            avatar: signInData.avatar,
            username: signInData.username
          })
          location.reload()
        }
      }
    })

    function onClickSignIn() {
      form.submitForm()
    }

    return (
      <Dialog>
        <Heading>
          Sign In
      </Heading>

        <Header>
          <Link onPress={_ => setIsSignupDialog(true)}>
            <a >Don't have account</a>
          </Link>
        </Header>

        <Divider />

        <Content>
          <Form isQuiet>
            <TextField value={form.values.email} onChange={utils.setFieldValue(form, 'email')} label='email' placeholder='john@example.com' />
            <TextField type='password' value={form.values.password} onChange={utils.setFieldValue(form, 'password')} label='password' />
          </Form>
        </Content>

        <ButtonGroup>
          <Button variant='secondary' onPress={close}>Cancel</Button>
          <Button variant='cta' onPress={onClickSignIn}>Sign In</Button>
        </ButtonGroup>
      </Dialog>
    )
  }

  function SignUpDialog({ close }) {

    const [signupResult, signUp] = useMutation<SignUpResult>(SignUp)

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
          close()
        }
      }
    })

    async function onClickSignUp() {
      await form.submitForm()
    }

    return (
      <Dialog>
        <Heading>
          Sign Up
      </Heading>

        <Header>
          <Link onPress={_ => setIsSignupDialog(false)}>
            <a>Already have account</a>
          </Link>
        </Header>

        <Divider />

        <Content>
          <Form isQuiet>
            <TextField validationState={form.errors.email ? 'invalid' : 'valid'} value={form.values.email} onChange={utils.setFieldValue(form, 'email')} label='email' placeholder='john@example.com' />
            <TextField validationState={form.errors.password ? 'invalid' : 'valid'} type='password' value={form.values.password} onChange={utils.setFieldValue(form, 'password')} label='password' />
            <TextField validationState={form.errors.password_confirm ? 'invalid' : 'valid'} type='password' value={form.values.password_confirm} onChange={utils.setFieldValue(form, 'password_confirm')} label='password confirm' />
          </Form>
        </Content>

        {signupResult.error && (
          <Footer>
            <Content>{signupResult.error.graphQLErrors[0].message}</Content>
          </Footer>
        )}

        <ButtonGroup>
          <Button variant='secondary' onPress={close}>Cancel</Button>
          <Button variant='cta' onPress={onClickSignUp} >Sign Up</Button>
        </ButtonGroup>
      </Dialog>
    )
  }

  return (
    <div>
      <View paddingY='size-150'>
        <Flex direction='row' justifyContent='center'>
          <Flex direction='row' width='960px' justifyContent='space-between'>
            <Flex justifyContent='center'>
              <Heading alignSelf='center' level={3}>
                Docmate
              </Heading>
              <small>Alpha</small>
            </Flex>

            <Flex justifyContent='center'>
              {!userService.isLogin() && (
                <Flex alignSelf='center' gap='size-100'>
                  <DialogTrigger>
                    <Button variant='cta'>Sign In / Sign Up</Button>

                    {close => {
                      if (isSignUpDialog) {
                        return <SignUpDialog close={close} />
                      } else {
                        return <SignInDialog close={close} />
                      }
                    }}
                  </DialogTrigger>

                </Flex>
              )}

              {userService.isLogin() && (
                <Flex alignSelf='center' gap='size-100'>
                  <CreateDocTrigger teams={teams} />

                  <Flex alignSelf='center'>
                    <MenuTrigger>
                      <ActionButton isQuiet UNSAFE_style={{ cursor: 'pointer' }}>
                        <img width='28px' style={{ borderRadius: '50%' }} src={`https://www.gravatar.com/avatar/${userService.getUserInfo().avatar}`} />
                      </ActionButton>
                      <Menu onAction={key => {
                        if (key === ' signout') {
                          userService.signOut()
                        }
                      }}>
                        <Item key='signout'>Sign Out</Item>
                      </Menu>
                    </MenuTrigger>
                  </Flex>

                </Flex>
              )}
            </Flex>

          </Flex>

        </Flex>

        <View>
          {userService.isLogin() && <DocsPannel teams={teams} />}
        </View>
      </View>

      <AppFooter />
    </div>
  )
}

function DocsPannel({
  teams
}: {
  teams: GetUserTeamsResult['user_team']
}) {

  const [selectedTeam, setSelectedTeam] = React.useState(null as null | string)
  const [getTeamDocsResult, getTeamDocs] = useQuery<GetTeamDocsResult>({ query: GetTeamDocs, variables: { teamId: selectedTeam } })

  React.useEffect(() => {
    if (!selectedTeam && teams.length > 0) {
      setSelectedTeam(teams[0].team.id)
    }
  }, [teams])

  function onSelectTeam(teamId: string) {
    setSelectedTeam(teamId)
    getTeamDocs()
  }

  return (
    <Flex justifyContent='center'>
      <View width='960px' marginTop='size-500'>
        <Flex>
          <Picker selectedKey={selectedTeam} placeholder='Team' onSelectionChange={onSelectTeam}>
            {teams.map(team => {
              return (
                <Item key={team.team.id}>{team.team.title}</Item>
              )
            })}
          </Picker>
        </Flex>

        <Docs onClickDoc={
          doc => {
            history.push(`/admin/doc/${doc.id}`)
          }
        } docs={getTeamDocsResult.data?.doc || []} />
      </View>
    </Flex>
  )
}

export default Layout