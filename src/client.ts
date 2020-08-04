import { createClient, Provider } from 'urql'
import * as React from 'react'

export const client = createClient({
  url: 'http://localhost:8080/v1/graphql'
})

export default (props) => React.createElement(Provider, { value: client }, props.children)
