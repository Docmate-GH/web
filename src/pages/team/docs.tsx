import * as React from 'react'
import Table, { TableHead, TableHeadCell, TableBody, TableRow, TableCell, } from '../../components/Table'
import { Text, View, Flex } from '@adobe/react-spectrum'
import { useQuery } from 'urql'
import { GetTeamDocsResult, GetTeamDocsParams, GetTeamDocs } from '../../gql'
import { TeamChildrenProps } from '.'
import LockIcon from '@spectrum-icons/workflow/LockClosed'
import LockClosed from '@spectrum-icons/workflow/LockClosed'

export default (props: TeamChildrenProps) => {

  const [getTeamDocsResult, getTeamDocs] = useQuery<GetTeamDocsResult, GetTeamDocsParams>({ query: GetTeamDocs, variables: { teamId: props.currentTeam.team.id }, pause: !props.currentTeam.team.id })

  const docs = getTeamDocsResult.data?.doc || []

  return (
    <Table>
      <TableHead>

        {/* <TableHeadCell>
          <Text> </Text>
        </TableHeadCell> */}

        <TableHeadCell flex='12'>
          <Text>Doc</Text>
        </TableHeadCell>

        <TableHeadCell style={{ textAlign: 'right' }} flex='3'>
          <Text>Created Date</Text>
        </TableHeadCell>

      </TableHead>

      <TableBody>
        {docs.map(doc => {
          return (
            <TableRow onClick={_ => {
              props.history.push(`/doc/${doc.id}`)
            }} key={doc.id} >
              {/* <TableCell style={{ textAlign: 'right' }}>

              </TableCell> */}

              <TableCell flex='12'>
                <Flex>
                  <View width='size-500' marginTop='size-10'>
                    {doc.visibility === 'private' && <LockClosed marginStart="size-100" size='XS' />}
                  </View>
                  <Text>{doc.title}</Text>
                </Flex>
              </TableCell>
              <TableCell flex='3' style={{ textAlign: 'right' }}>{(new Date(doc.created_at).toLocaleString())}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>

    </Table>
  )
}