import * as React from 'react'
import { Provider, defaultTheme } from '@adobe/react-spectrum'


export default (props) => (
  <Provider theme={defaultTheme}>
    {props.children}
  </Provider>
)