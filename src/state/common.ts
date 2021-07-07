/* 用户数据持久化 */

import config from '@/config';
import { getCurrentUser, getTagType, getLanguageList, getSongStyleList } from '@/services/common';
import type { CurrentUserType } from '@/services/common';
import type { TagType, LanguageVersion, SongStyle } from '@/services/common.d';
import type { UserInfo } from '@tarojs/taro';
import { removeStorageSync } from '@tarojs/taro';

// const
export const LOADING = 'COMMON/LOADING';
export const DONE = 'COMMON/DONE';
export const ERROR = 'COMMON/ERROR';
export const LOGOUT = 'USER/LOGOUT';
export const GET_USER_PROFILE = 'COMMON/GET_USER_PROFILE';
export const INIT = 'COMMON/INIT';

// actions
export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const getProfile = (payload) => {
  return {
    type: GET_USER_PROFILE,
    payload,
  };
};

export function getUser(localUserInfo?): any {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING });
      const { data } = await getCurrentUser();
      const userInfo = { ...localUserInfo, avatarUrl: data.avatar, nickName: data.nickname };
      dispatch({ type: DONE, payload: { data, userInfo } });
    } catch (error) {
      dispatch({ type: ERROR, payload: error.message });
    }
  };
}

export const initCommonReducer = () => {
  return (dispath, state) => {
    const { common: commonReducer } = state();
    if (!commonReducer.tagType.length) {
      Promise.all([getTagType(), getLanguageList(), getSongStyleList()]).then((res) => {
        dispath({ type: INIT, payload: res });
      });
    }
  };
};

// reducers
export type CommonStateType = {
  loading: boolean;
  error: boolean;
  done: boolean;
  userInfo: UserInfo;
  data: CurrentUserType;
  tagType: TagType[];
  languageVersion: LanguageVersion[];
  songStyle: SongStyle[];
};

const INITIAL_STATE: CommonStateType = {
  loading: true,
  error: false,
  done: false,
  // wx.getUserProfile获取到的用户数据
  userInfo: {} as UserInfo,
  // 服务端返回的用户数据
  data: {} as CurrentUserType,
  tagType: [],
  languageVersion: [],
  songStyle: [],
};

export default function common(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case LOGOUT:
      // rm storage values
      Object.values(config.storage).forEach((key) => removeStorageSync(key));
      return INITIAL_STATE;
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case DONE:
      return {
        ...state,
        loading: false,
        error: false,
        done: true,
        data: payload.data,
        userInfo: payload?.userInfo,
      };
    case ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
        done: false,
      };
    case GET_USER_PROFILE:
      return {
        ...state,
        loading: false,
        error: false,
        done: true,
        userInfo: payload,
      };
    case INIT:
      return {
        ...state,
        tagType: payload[0].data,
        languageVersion: payload[1].data,
        songStyle: payload[2].data,
      };
    default:
      return state;
  }
}
