import { createClient, Provider } from 'urql'
import * as React from 'react'
import { userService } from './service'

declare const GRAPHQL_URL: string

export const client = createClient({
  url: GRAPHQL_URL,
  requestPolicy: 'cache-first',
  fetchOptions() {

    const headers = {}

    if (userService.isLogin()) {
      headers['Authorization'] = `Bearer ${userService.getToken()}`
    }

    return {
      headers
    }
  }
})

export default (props) => React.createElement(Provider, { value: client }, props.children)
