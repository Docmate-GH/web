import { createClient, Provider } from 'urql'
import * as React from 'react'
import { userService } from './service'
import axios from 'axios'

export const client = createClient({
  url: `${location.protocol}//${location.host}:8080/v1/graphql`,
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

export const httpClient = axios.create({
  headers: {
    'Authorization': `Bearer ${userService.getToken()}`
  }
})

export default (props) => React.createElement(Provider, { value: client }, props.children)
