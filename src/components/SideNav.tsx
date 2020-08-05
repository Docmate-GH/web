import * as React from 'react'
import '@spectrum-css/sidenav'

export default function SideNav(props) {
  return (
    <nav>
      <ul className='spectrum-SideNav'>
        {props.children}
      </ul>
    </nav>
  )
}

export function SideNavItem(props) {
  return (
    <li className='spectrum-SideNav-item'>
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