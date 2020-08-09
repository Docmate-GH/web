import * as React from 'react'
import { View, Button, Text } from '@adobe/react-spectrum'
import { userService } from '../../service'
import { client } from '../../client'
import { JoinTeam, JoinTeamResult, JoinTeamParasm } from '../../gql'


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
        props.history.push(`/app/team/${joinTeamResult.data!.joinTeam.teamId}`)
      } else {
        // TODO:

      }
    }

    return (
      <View>
        <Text>
          Join team?
        </Text>
        <Button onPress={onClickJoin} variant='cta'>Join</Button>
      </View>
    )

  } else {
    return (
      <View>
        Please log in first.
      </View>
    )
  }

}