import * as React from 'react'
import '@spectrum-css/table'
import * as classnames from 'classnames'
import { View, Flex } from '@adobe/react-spectrum'
import { ViewProps } from '@react-types/view'

export default function Table(props: {
  children: any
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className='spectrum-Table' role="grid">
      {props.children}
    </div>
  )
}

export function TableHead(props: {
  children: any
}) {
  return (
    <Flex UNSAFE_className='spectrum-Table-head'>
      {props.children}
    </Flex>
  )
}

export function TableHeadCell(props: {
  flex?: string,
  children: any,
  sortable?: boolean,
  sortedDesc?: boolean,
  style?: any
}) {
  return (
    <View UNSAFE_style={props.style} flex={props.flex || '1'} UNSAFE_className={classnames('spectrum-Table-headCell', { 'is-sortable': props.sortable, 'is-sorted-desc': props.sortedDesc })}>
      {props.children}
    </View>
  )
}

export function TableBody(props: {
  children: any
}) {
  return (
    <div className='spectrum-Table-body'>
      {props.children}
    </div>
  )
}

export function TableRow(props: {
  children: any
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div style={{ display: 'flex' }} className='spectrum-Table-row' {...props}>
      {props.children}
    </div>
  )
}

export function TableCell(props: {
  children: any,
  flex?: string,
  style?: any
}) {
  return (
    <View UNSAFE_style={props.style} flex={props.flex || '1'} UNSAFE_className='spectrum-Table-cell' {...props}>
      {props.children}
    </View>
  )
}