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

export type GetUserTeamsResult = {
  user_team: {
    team: {
      id: string, title: string
    }
  }[]
}
export const GetUserTeams = `
query {
  user_team {
    team {
      id, title
    }
  }
}
`

export type GetTeamDocsResult = {
  doc: {
    id: string,
    title: string,
    created_at: string
  }[]
}
export const GetTeamDocs = `
query($teamId: uuid!) {
  doc(where: {
    team_id: { _eq: $teamId }
  }) {
    id, title, created_at
  }
}
`

export type CreateDocResult = {
  insert_doc_one: {
    id: string
  }
}
export const CreateDoc = `
mutation($teamId: uuid!, $title: String!) {
  insert_doc_one(object: {
    team_id: $teamId,
    title: $title
  }) {
    id
  }
}
`

export type GetDocByIdResult = {
  doc_by_pk: {
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
    team {
      title, id
    }, default_page, 
    id, title, pages(
      where: {
        deleted_at: { _is_null: true }
      }
    ) {
      slug, title
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
    default_page?: string
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