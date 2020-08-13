
type UserInfo = {
  username: string,
  id: string,
  email: string,
  avatar: string
}
class UserService {
  saveToken(token: string) {
    localStorage.setItem('__TOKEN', token)
  }

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
    return localStorage.getItem('__TOKEN')
  }

  isLogin() {
    return this.getToken() !== null
  }

  signOut() {
    localStorage.removeItem('__USER')
    localStorage.removeItem('__TOKEN')
    location.href = '/'
  }
}

export const userService = new UserService()
