import * as React from 'react'
import { Flex, Picker, Item, View, Text, ProgressCircle } from '@adobe/react-spectrum'
import { userService } from '../../service'
import { useQuery } from 'urql'
import { GetUserTeams, GetUserTeamsResult, GetTeamDocs, GetTeamDocsResult, GetTeamDocsParams } from '../../gql'
import SideNav, { SideNavHead, SideNavItem, SideNavItemLink } from '../../components/SideNav'
import Loading from '../../components/Loading'

export type TeamChildrenProps = {
  currentTeam: GetUserTeamsResult['users'][0]['user_teams'][0],
  history: any
}

export default (props: {
  history: {
    location: {
      pathname: string
    },
    push: any
  },
  match: {
    params: {
      teamId: string
    }
  },
  children?: any
}) => {
  const [getUserTeamsResult, getUserTeams] = useQuery<GetUserTeamsResult>({ query: GetUserTeams, variables: { userId: userService.getUserInfo().id } })
  const currentTeamId = React.useRef(null as null | string)

  React.useEffect(() => {
    getUserTeams()
  }, [])

  if (getUserTeamsResult.fetching) {
    return <Loading />
  }

  if (getUserTeamsResult.data) {

    const teams = getUserTeamsResult.data.users_by_pk.user_teams

    const myTeam = teams.find(team => team.team.is_personal === true)

    console.log(teams)

    function onSelectTeam(teamId) {
      if (teamId === myTeam.team.id) {
        props.history.push('/app')
      } else {
        props.history.push(`/app/team/${teamId}`)
      }
    }

    let selectedTeamId: string

    if (props.history.location.pathname === '/app') {
      selectedTeamId = myTeam.team.id
    } else {
      selectedTeamId = props.match.params.teamId
    }

    if (!currentTeamId.current) {
      currentTeamId.current = selectedTeamId
    }

    const currentTeam = teams.find(team => team.team.id === selectedTeamId)

    const isOwner = currentTeam.team.master === userService.getUserInfo().id

    const currentView = (() => {
      const path = [...props.history.location.pathname.split('/')]
      path.shift()
      if (path.length === 3) {
        return 'all-docs'
      } else if (path[3] === 'settings') {
        return 'settings'
      }
    })();

    return (
      <Flex direction='column' gap='size-200'>
        <View marginY='size'>
          <Picker selectedKey={selectedTeamId} placeholder='Team' onSelectionChange={onSelectTeam}>
            {teams.map(team => {
              const isOwner = team.team.master === userService.getUserInfo().id
              return (
                <Item key={team.team.id}>{team.team.title}</Item>
              )
            })}
          </Picker>
        </View>

        {selectedTeamId && (
          <Flex direction='row' gap='size-200'>
            {isOwner && props.history.location.pathname !== '/app' && (
              <View width='size-2400'>
                <SideNav>
                  {/* <SideNavHead>
                    Team
                  </SideNavHead> */}
                  <SideNavItem selected={currentView === 'all-docs'}>
                    <SideNavItemLink onClick={_ => {
                      props.history.push(`/app/team/${selectedTeamId}`)
                    }}>Docs</SideNavItemLink>
                  </SideNavItem>

                  <SideNavItem selected={currentView === 'settings'}>
                    <SideNavItemLink onClick={_ => {
                      props.history.push(`/app/team/${selectedTeamId}/settings`)
                    }} >Settings</SideNavItemLink>
                  </SideNavItem>
                </SideNav>
              </View>
            )}
            <View flex='1'>
              {React.cloneElement(props.children, {
                currentTeam,
                history: props.history
              })}
            </View>
          </Flex>
        )}
      </Flex>

    )
  } else {
    return (
      <div>error..</div>
    )
  }
}
