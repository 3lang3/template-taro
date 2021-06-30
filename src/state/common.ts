/* 用户数据持久化 */

import config from '@/config'
import { getCurrentUser } from '@/services/common'
import { removeStorageSync } from '@tarojs/taro'

// const
export const LOADING = 'USER/LOADING'
export const DONE = 'USER/DONE'
export const ERROR = 'USER/ERROR'
export const LOGOUT = 'USER/LOGOUT'
export const GET_USER_PROFILE = 'USER/GET_USER_PROFILE'

// actions
export const logout = () => {
  return {
    type: LOGOUT,
  }
}

export const getProfile = (payload) => {
  return {
    type: GET_USER_PROFILE,
    payload,
  }
}

export function getUser(): any {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING })
      const { data } = await getCurrentUser()
      dispatch({ type: DONE, payload: data })
    } catch (error) {
      dispatch({ type: ERROR, payload: error.message })
    }
  }
}

// reducers
export type UserStateType = {
  loading: boolean
  error: boolean
  done: boolean
  userInfo: boolean
  data: any
}
const INITIAL_STATE: UserStateType = {
  loading: false,
  error: false,
  done: false,
  // wx.getUserProfile获取到的用户数据
  userInfo: false,
  // 服务端返回的用户数据
  data: {},
}

export default function user(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case LOGOUT:
      removeStorageSync(config.tokenKey)
      return INITIAL_STATE
    case LOADING:
      return {
        ...state,
        loading: true,
      }
    case DONE:
      return {
        ...state,
        loading: false,
        error: false,
        done: true,
        data: payload,
      }
    case ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
        done: false,
      }
    case GET_USER_PROFILE:
      return {
        ...state,
        loading: false,
        error: false,
        done: true,
        userInfo: payload,
      }
    default:
      return state
  }
}
