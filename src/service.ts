import * as Cookies from 'js-cookie'
import axios from 'axios'

type UserInfo = {
  username: string,
  id: string,
  email: string,
  avatar: string
}
class UserService {
  saveUserInfo(userInfo: UserInfo) {
    localStorage.setItem('__USER', JSON.stringify(userInfo))
  }

  getUserInfo(): UserInfo | null {
    const savedInfo = localStorage.getItem('__USER')
    if (savedInfo) {
      return JSON.parse(savedInfo) as UserInfo
    } else {
      return null
    }
  }

  getToken() {
    return Cookies.get('__DOCMATE__TOKEN__')
  }

  isLogin() {
    return this.getToken() !== undefined
  }

  async signOut() {
    localStorage.removeItem('__USER')
    await axios.post('/api/v1/signOut')
    location.href = '/'
  }
}

export const userService = new UserService()
