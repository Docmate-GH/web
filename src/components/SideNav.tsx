// https://opensource.adobe.com/spectrum-css/sidenav.html

import * as React from 'react'
import '@spectrum-css/sidenav'
import * as classnames from 'classnames'

export default function SideNav(props: {
  children: any,
}) {
  return (
    <nav>
      <ul className='spectrum-SideNav'>
        {props.children}
      </ul>
    </nav>
  )
}



export const SideNavItem = React.forwardRef((props: {
  selected?: boolean,
  children?: any,
  onClick?: any
}, ref: any) => {
  return (
    <li ref={ref} {...props} className={classnames('spectrum-SideNav-item', { 'is-selected': props.selected === true })} >
      {props.children}
    </li>
  )
})

export function SideNavHead(props: {
  children: any,
  id?: string
}) {
  return (
    <h2 className='spectrum-SideNav-heading'>{props.children}</h2>
  )
}



export const SideNavItemLink = React.forwardRef((props: {
  onClick?: any,
  children?: any
}, ref: any) => {
  return <a ref={ref} {...props} onClick={props.onClick} className='spectrum-SideNav-itemLink'>{props.children}</a>
})