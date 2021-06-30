import config from '@/config'
import { login, getUserProfile, checkSession, getStorageSync, setStorageSync } from '@tarojs/taro'
import store from '@/state/config/store'
import { getProfile, getUser } from '@/state/common'

// 静默登录
export async function silentLogin() {
  try {
    // 获取缓存token
    let token = getStorageSync(config.tokenKey)
    // 获取缓存code
    let code = getStorageSync('code') as string
    if (code) {
      // 检查缓存code是否过期
      try {
        await checkSession()
      } catch (error) {
        // 缓存code过期
        // 重新调用login获取新code
        // 缓存token失效
        token = undefined
        code = await getCode()
      }
    } else {
      // 本地没有缓存code 重新获取code
      // 缓存token失效
      token = undefined
      code = await getCode()
    }

    if (!token) throw new Error('需用调用getUserProfile获取用户的个人信息')
    store.dispatch(getUser())
  } catch (error) {
    console.warn('静默登录失败:', error)
  }
}

// 主动登录(用户授权)
export async function userLogin(opts: getUserProfile.Option) {
  try {
    const { userInfo, ...getUserProfileRes } = await getUserProfile(opts)
    console.log(getUserProfileRes)
    store.dispatch(getProfile(userInfo))
  } catch (error) {
    console.log(error)
  }
}

// wx.login 获取微信用户code
async function getCode(): Promise<string> {
  const res = await login()
  const { code, errMsg } = res
  if (!code) throw new Error(`wx.login调用失败${errMsg}`)
  setStorageSync('code', code)
  return code
}
