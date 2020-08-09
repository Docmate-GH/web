import * as React from 'react'
import Table, { TableHead, TableHeadCell, TableBody, TableRow, TableCell, } from '../../components/Table'
import { Text } from '@adobe/react-spectrum'
import { useQuery } from 'urql'
import { GetTeamDocsResult, GetTeamDocsParams, GetTeamDocs } from '../../gql'
import { TeamChildrenProps } from '.'

export default (props: TeamChildrenProps) => {

  const [getTeamDocsResult, getTeamDocs] = useQuery<GetTeamDocsResult, GetTeamDocsParams>({ query: GetTeamDocs, variables: { teamId: props.currentTeam.team.id }, pause: !props.currentTeam.team.id })

  const docs = getTeamDocsResult.data?.doc || []

  return (
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
          return (
            <TableRow key={doc.id} >
              <TableCell>{doc.title}</TableCell>
              <TableCell>{(new Date(doc.created_at).toLocaleString())}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>

    </Table>
  )
}