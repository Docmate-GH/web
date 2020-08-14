import * as Cookies from 'js-cookie'
import axios from 'axios'

type UserInfo = {
  username: string,
  id: string,
  email: string,
  avatar: string
}
class UserService {
  getUserInfo(): UserInfo | null {
    const username = Cookies.get('__DOCMATE__USER_USERNAME__')
    const avatar = Cookies.get('__DOCMATE__USER_AVATAR__')
    const email = Cookies.get('__DOCMATE__USER_EMAIL__')
    const id = Cookies.get('__DOCMATE__USER_ID__')
    return {
      username,
      id,
      email,
      avatar
    }
  }

  getToken() {
    return Cookies.get('__DOCMATE__TOKEN__')
  }

  isLogin() {
    return this.getToken() !== undefined
  }

  async signOut() {
    await axios.post('/api/v1/signOut')
    location.href = '/'
  }
}

export const userService = new UserService()
