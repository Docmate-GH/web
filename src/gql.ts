export type SignUpResult = {
  signUp: {
    id: string
  }
}
export const SignUp = `
mutation($email: String!, $password: String!, $password_confirm: String!) {
  signUp(input: {email: $email, password: $password, password_confirm: $password_confirm}) {
    id
  }
}
`

export type SignInResult = {
  signIn: {
    token: string,
    username: string,
    email: string,
    id: string,
    avatar: string
  }
}
export const SignIn = `
mutation($email: String!, $password: String!) {
  signIn(input: { email: $email, password: $password }) {
    token, username, email, id, avatar
  }
}
`
export type GetUserTeamParams = {
  userId: string
}
export type GetUserTeamsResult = {
  users_by_pk: {
    id: string,
    user_teams: {
      team: {
        id: string,
        title: string,
        master: string,
        is_personal: boolean
      }
    }[]
  },
}
export const GetUserTeams = `
query($userId: uuid!) {
  users_by_pk(id: $userId) {
    id, user_teams {
      team {
      id, title, master, is_personal
      }
    }
  }
}
`

export type GetTeamDocsParams = {
  teamId: string
}
export type GetTeamDocsResult = {
  doc: {
    id: string,
    title: string,
    created_at: string,
    visibility: string
  }[]
}
export const GetTeamDocs = `
query($teamId: uuid!) {
  doc(where: {
    team_id: { _eq: $teamId }
  }, order_by: {
    created_at: desc
  }) {
    id, title, created_at, visibility
  }
}
`

export type CreateDocResult = {
  insert_doc_one: {
    id: string
  }
}
export const CreateDoc = `
mutation($teamId: uuid!, $title: String!, $visibility: String!) {
  insert_doc_one(object: {
    team_id: $teamId,
    visibility: $visibility,
    title: $title
  }) {
    id
  }
}
`

export type GetDocByIdResult = {
  doc_by_pk: {
    visibility: 'public' | 'private',
    code_highlights: string[]
    id: string
    title: string,
    team: {
      title: string,
      id: string
    },
    default_page?: string
    pages: {
      id: string,
      slug: string,
      title
    }[]
  }
}
export const GetDocById = `
query($docId: uuid!) {
  doc_by_pk(id: $docId) {
    visibility,
    code_highlights,
    team {
      title, id
    }, default_page, 
    id, title, pages(
      order_by: [
        {
          index: asc
        },
        {
          created_at: asc
        }
      ],
      where: {
        deleted_at: { _is_null: true }
      }
    ) {
      slug, title, id
    }
  }
}
`

export type CreatePageResult = {
  insert_page_one: {
    id: string,
    slug: string,
  }
}
export const CreatePage = `
mutation ($object: page_insert_input!) {
  insert_page_one(object: $object) {
    id, slug
  }
}
`

export type UpdateDocParams = {
  docId: string,
  input: {
    title?: string,
    default_page?: string,
    code_highlights?: string[],
    visibility: 'private' | 'public'
  }
}
export type UpdateDocResult = {
  update_doc_by_pk: {
    id: string
  }
}
export const UpdateDoc = `
mutation ($docId: uuid!, $input: doc_set_input!) {
  update_doc_by_pk(_set: $input, pk_columns: {
    id: $docId
  }) {
    id
  }
}
`

export type CreateTeamParams = {
  title: string
}
export type CreateTeamResult = {
  createTeam: {
    teamId: string
  }
}
export const CreateTeam = `
mutation ($title: String!) {
  createTeam(input: {title: $title}) {
    teamId
  }
}
`


export type GetTeamFullInfoParams = {
  teamId: string
}
export type GetTeamFullInfoResult = {
  teams_by_pk: {
    invite_id: string,
    team_users: {
      user: {
        id: string,
        email: string,
        username: string,
        avatar: string
      }
    }[]
  }
}
export const GetTeamFullInfo = `
query($teamId:uuid!) {
  teams_by_pk(id:$teamId) {
    invite_id,
    team_users {
      user {
        id, email, username, avatar
      }
    }
  }
}
`

export type JoinTeamResult = {
  joinTeam: {
    teamId: string
  }
}
export type JoinTeamParasm = {
  inviteId: string
}
export const JoinTeam = `
mutation($inviteId: uuid!) {
  joinTeam(inviteId: $inviteId) {
    teamId
  }
}
`

export type RemoveMemberReuslt = {
  delete_user_team: {
    affected_rows: number
  }
}
export type RemoveMemberParams = {
  teamId: string,
  userId: string
}
export const RemoveMember = `
mutation($teamId: uuid!, $userId: uuid!) {
  delete_user_team(where:{
    team_id: { _eq: $teamId },
    user_id: { _eq: $userId }
  }) {
    affected_rows
  }
}
`

export type RevokeInviteIdParams = {
  teamId: string
}
export type RevokeInviteIdResult = {
  revokeInviteId: {
    code: string
  }
}
export const RevokeInviteId = `
mutation($teamId: uuid!) {
  revokeInviteId(teamId: $teamId) {
    code
  }
}
`

export type UpdateTeamInfoParams = {
  teamId: string,
  input: {
    title: string
  }
}
export type UpdateTeamInfoResult = {
  update_teams_by_pk: {
    id: string
  }
}
export const UpdateTeamInfo = `
mutation($teamId: uuid!, $input: teams_set_input) {
  update_teams_by_pk(_set: $input, pk_columns: {
    id: $teamId
  }) {
    id
  }
}
`

export const batchResortMutation = (ids: Array<string>) => {

  return `
      mutation {
        ${ids.map((id, index) => {
          return `
            update_${index}: update_page_by_pk(pk_columns: {id: "${id}"}, _set:{
              index: ${index}
            }) {
              index
            }
          `
        }).join('\n')}
      }      
      `
}