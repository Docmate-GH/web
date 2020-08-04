import { createClient, Provider } from 'urql'
import * as React from 'react'

export const client = createClient({
  url: '/graphql'
})

export default (props) => React.createElement(Provider, { value: client }, props.children)
