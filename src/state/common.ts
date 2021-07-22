/* 用户数据持久化 */

import config from '@/config';
import {
  getCurrentUser,
  getTagType,
  getLanguageList,
  getSongStyleList,
  getWebsiteType,
  getBankList,
} from '@/services/common';
import type { CurrentUserType } from '@/services/common';
import type {
  TagType,
  LanguageVersion,
  SongStyle,
  MusicSiteItem,
  BankItem,
} from '@/services/common.d';
import { getStorageSync, removeStorageSync } from '@tarojs/taro';
import type { UserInfo } from '@tarojs/taro';

// const
export const LOADING = 'COMMON/LOADING';
export const DONE = 'COMMON/DONE';
export const ERROR = 'COMMON/ERROR';
export const LOGOUT = 'COMMON/LOGOUT';
export const UPDATE_USER_DATA = 'COMMON/UPDATE_USER_DATA';
export const INIT = 'COMMON/INIT';

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
  return (dispath) => {
    Promise.all([
      getTagType(),
      getLanguageList(),
      getSongStyleList(),
      getWebsiteType(),
      getBankList(),
    ]).then((res) => {
      dispath({ type: INIT, payload: res });
    });
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
  bankList: BankItem[];
  token?: string;
};

const INITIAL_STATE: CommonStateType = {
  token: getStorageSync(config.storage.tokenKey),
  loading: false,
  error: false,
  done: false,
  // wx.getUserProfile获取到的用户数据
  userInfo: {} as UserInfo,
  // 服务端返回的用户数据
  data: {
    config: {},
  } as CurrentUserType,
  tagType: [],
  languageVersion: [],
  songStyle: [],
  musicSiteList: [],
  bankList: [],
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
    case INIT:
      return {
        ...state,
        tagType: payload[0].data,
        languageVersion: payload[1].data,
        songStyle: payload[2].data,
        musicSiteList: payload[3].data,
        bankList: processBankList(payload[4].data),
      };
    default:
      return state;
  }
}

// process bank list data
function processBankList(data: BankItem[]) {
  return data.reduce((a: any, v: BankItem) => {
    const idx = a.findIndex((el: any) => el.key === v.name_initial);
    if (idx > -1) {
      a[idx].items.push({ name: v.bank_name, ...v });
    } else {
      a.push({ title: v.name_initial, key: v.name_initial, items: [] });
    }
    return a;
  }, []);
}
