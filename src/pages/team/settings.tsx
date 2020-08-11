import * as React from 'react'
import { View, Heading, Text, Form, TextField, Button, Flex, Image, Divider } from '@adobe/react-spectrum'
import { TeamChildrenProps } from '.'
import { useFormik } from 'formik'
import { setFieldValue, alert } from '../../utils'
import { useQuery, useMutation } from 'urql'
import { GetTeamFullInfo, GetTeamFullInfoResult, GetTeamFullInfoParams, RemoveMember, RemoveMemberReuslt, RemoveMemberParams, RevokeInviteId, RevokeInviteIdResult, RevokeInviteIdParams, UpdateTeamInfoResult, UpdateTeamInfoParams, UpdateTeamInfo } from '../../gql'
import * as md5 from 'js-md5'
import { client } from '../../client'

export default (props: TeamChildrenProps) => {

  const [getTeamFullInfoResult] = useQuery<GetTeamFullInfoResult, GetTeamFullInfoParams>({ query: GetTeamFullInfo, variables: { teamId: props.currentTeam.team.id } })
  const [ updateTeamInfoResult, updateTeamInfo ] = useMutation<UpdateTeamInfoResult, UpdateTeamInfoParams>(UpdateTeamInfo)

  const form = useFormik({
    initialValues: {
      teamName: props.currentTeam.team.title
    },
    async onSubmit(values) {
      const res = await updateTeamInfo({
        teamId: props.currentTeam.team.id,
        input: {
          title: values.teamName
        }
      })

      if (!res.error) {
        alert('Saved!', { type: 'success' })
      } else {
        // TODO:
      }
    }
  })

  const teamInfo = getTeamFullInfoResult.data

  async function onClickRevokeInviteId() {
    const updateResult = await client.mutation<RevokeInviteIdResult, RevokeInviteIdParams>(RevokeInviteId, { teamId: props.currentTeam.team.id }).toPromise()
    if (!updateResult.error) {
      alert('Revoke success', { type: 'success' })
      location.reload()
    } else {
      // TODO:
    }
  }

  return (
    <View>
      <Heading marginTop='size-0'>Basic</Heading>
      <View backgroundColor='static-white' padding='size-200' UNSAFE_className='rounded'>
        <View>
          <Form isQuiet>
            <TextField marginBottom='size-200' value={form.values.teamName} onChange={setFieldValue(form, 'teamName')} label='Team Name' />
            <Button variant='cta' width='size-200' onPress={form.submitForm} >Save</Button>
          </Form>
          {/* <Heading level={1}>Settings</Heading> */}
        </View>
      </View>

      <Heading>Members</Heading>
      <View backgroundColor='static-white' padding='size-200' UNSAFE_className='rounded'>
        {teamInfo && (
          <>
            <Form isQuiet>
              <Flex gap='size-200'>
                <TextField flex='9' isDisabled label='Invite link' value={`${location.protocol}//${location.host}/join/${teamInfo.teams_by_pk.invite_id}`} />
                <Button marginTop='size-300' alignSelf='center' flex='1' variant='cta' onPress={onClickRevokeInviteId}>Revoke</Button>
              </Flex>
            </Form>
            <View marginTop='size-400' UNSAFE_className='rounded'>
              {teamInfo.teams_by_pk.team_users.map(user => {
                return (
                  <Member user={user} currentTeam={props.currentTeam} />
                )
              })}
            </View>
          </>
        )}
      </View>
    </View>
  )
}

function Member({
  currentTeam,
  user
}: {
  user: GetTeamFullInfoResult['teams_by_pk']['team_users'][0]
  currentTeam: TeamChildrenProps['currentTeam']
}) {
  const avatar = `https://gravatar.com/avatar/${md5(user.user.email)}?s=64`

  async function onClickRemoveMember(userId: string) {
    const removeMemberResult = await client.mutation<RemoveMemberReuslt, RemoveMemberParams>(RemoveMember, { teamId: currentTeam.team.id, userId: userId }).toPromise()

    if (!removeMemberResult.error) {
      alert('Remove member success', { type: 'success' })
      location.reload()
    } else {
      // TODO:
    }
  }

  return (
    <View key={user.user.id} backgroundColor='static-white' paddingX='size-100' paddingY='size-100'>
      <Flex gap='size-200'>
        <View>
          <Image alt='avatar' src={avatar} width='size-400' height='size-400' UNSAFE_style={{ borderRadius: '50%' }} />
        </View>

        <View alignSelf='center' flex='1'>
          <strong>{user.user.username}</strong>
        </View>
        <View>
          {user.user.id !== currentTeam.team.master &&
            <Button variant='negative' onPress={_ => onClickRemoveMember(user.user.id)}>Remove</Button>}
        </View>
      </Flex>
    </View>
  )
}