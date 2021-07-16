/* 用户数据持久化 */

import config from '@/config';
import {
  getCurrentUser,
  getTagType,
  getLanguageList,
  getSongStyleList,
  getWebsiteType,
} from '@/services/common';
import { getUnreadMessage } from '@/services/message';
import type { CurrentUserType } from '@/services/common';
import type { TagType, LanguageVersion, SongStyle, MusicSiteItem } from '@/services/common.d';
import { getStorageSync, removeStorageSync } from '@tarojs/taro';
import type { UserInfo } from '@tarojs/taro';

// const
export const LOADING = 'COMMON/LOADING';
export const DONE = 'COMMON/DONE';
export const ERROR = 'COMMON/ERROR';
export const LOGOUT = 'COMMON/LOGOUT';
export const UPDATE_USER_DATA = 'COMMON/UPDATE_USER_DATA';
export const INIT = 'COMMON/INIT';
export const ISREADALL = 'COMMON/ISREADALL';

// actions
export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const updateUserData = (payload) => {
  return {
    type: UPDATE_USER_DATA,
    payload,
  };
};

// 获取消息已读
export function setIsReadAll() {
  return async (dispatch) => {
    const result = await getUnreadMessage();
    dispatch({ type: ISREADALL, payload: result.data.is_show });
  };
}

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
      Promise.all([
        getTagType(),
        getLanguageList(),
        getSongStyleList(),
        getWebsiteType(),
        getUnreadMessage(),
      ]).then((res) => {
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
  musicSiteList: MusicSiteItem[];
  token?: string;
  isReadAll: boolean;
};

const INITIAL_STATE: CommonStateType = {
  token: getStorageSync(config.storage.tokenKey),
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
  musicSiteList: [],
  isReadAll: false,
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
    case UPDATE_USER_DATA:
      return {
        ...state,
        loading: false,
        error: false,
        done: true,
        data: payload,
      };
    case ISREADALL:
      return {
        ...state,
        isReadAll: payload,
      };
    case INIT:
      return {
        ...state,
        tagType: payload[0].data,
        languageVersion: payload[1].data,
        songStyle: payload[2].data,
        musicSiteList: payload[3].data,
        isReadAll: !!payload[4].data.is_show,
      };
    default:
      return state;
  }
}
