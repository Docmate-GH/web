import * as React from 'react'
import { View, Button, Text, Flex, ButtonGroup, Heading } from '@adobe/react-spectrum'
import { userService } from '../../service'
import { client } from '../../client'
import { JoinTeam, JoinTeamResult, JoinTeamParasm } from '../../gql'
import AppFooter from '../../components/Footer'
import { alert } from '../../utils'
export default (props: {
  match: {
    params: {
      inviteId: string
    }
  },
  history: any
}) => {

  if (userService.isLogin()) {

    const onClickJoin = async () => {
      const { inviteId } = props.match.params

      const joinTeamResult = await client.mutation<JoinTeamResult, JoinTeamParasm>(JoinTeam, { inviteId: inviteId }).toPromise()

      if (!joinTeamResult.error) {
        props.history.push(`/team/${joinTeamResult.data!.joinTeam.teamId}`)
      } else {
        // TODO:
        alert('Invalid invite link', { type: 'danger' })
      }
    }

    return (
      <>
        <Flex UNSAFE_style={{ textAlign: 'center' }} justifyContent='center'>
          <View backgroundColor='static-white' padding='size-400' margin='size-200' marginY='size-3000' width='300px'>
            <View>
              <Heading marginTop='0' marginBottom='0' level={1}>Invite you to join team</Heading>
              {/* <Heading level={3}>Are you sure to join this team?</Heading> */}
            </View>

            <View marginTop='size-200'>
              <ButtonGroup>
                <Button onPress={onClickJoin} variant='cta'>Join</Button>

              </ButtonGroup>
            </View>
          </View>
        </Flex>

        <AppFooter />
      </>
    )

  } else {
    return (
      <View>
        Please log in first.
      </View>
    )
  }

}