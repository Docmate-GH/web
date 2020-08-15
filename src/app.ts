import './app.css'
import { userService } from './service'
// @ts-expect-error
import { history } from 'umi'

export function render(oldRender) {

  if (userService.isLogin() && history.location.pathname === '/sign') {
    location.href = '/'
  }

  if (userService.isLogin()) {
    oldRender()
  } else {
    history.push('/sign')
    oldRender()
  }
}