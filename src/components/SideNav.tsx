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


export function SideNavItem(props: {
  children: any,
  selected?: boolean
}) {
  return (
    <li className={classnames('spectrum-SideNav-item', { 'is-selected': props.selected === true })} >
      {props.children}
    </li>
  )
}

export function SideNavHead(props: {
  children: any,
  id?: string
}) {
  return (
    <h2 className='spectrum-SideNav-heading'>{props.children}</h2>
  )
}

export function SideNavItemLink(props) {
  return (
    <a onClick={props.onClick} className='spectrum-SideNav-itemLink'>{props.children}</a>
  )
}