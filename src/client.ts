import { createClient, Provider } from 'urql'
import * as React from 'react'
import { userService } from './service'


export const client = createClient({
  url: 'http://localhost:8080/v1/graphql',
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
