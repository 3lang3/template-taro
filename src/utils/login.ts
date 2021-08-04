import config from '@/config';
import {
  login,
  getUserProfile,
  checkSession,
  getStorageSync,
  setStorageSync,
  showToast,
} from '@tarojs/taro';
import store from '@/state/config/store';
import { wxMiniProgramLogin } from '@/services/common';
import { initCommonReducer, getUser } from '@/state/common';

// 静默登录
export async function silentLogin() {
  try {
    const storageToken = getStorageSync(config.storage.tokenKey);
    // 本地未缓存token 退出静默登录
    if (!storageToken) throw new Error('本地未缓存token 退出静默登录');
    // 检查wx.login登录态
    const available = await checkCodeSession();
    if (!available) throw new Error('wx.login登录态过期, 需重新登录');
    const localUserInfo = getStorageSync(config.storage.userInfo);
    store.dispatch(getUser(localUserInfo));
    store.dispatch(initCommonReducer() as any);
  } catch (error) {
    console.warn('静默登录失败:', error);
  }
}

/**
 * 主动登录(用户授权)
 * @summary 调用`getUserProfile`前不能有**异步**操作
 * @param {getUserProfile.Option} opts
 */
export async function userLogin(opts: getUserProfile.Option) {
  const payload = {} as any;
  const localUserInfo = getStorageSync(config.storage.userInfo);
  // 复用本地userInfo 避免调用getUserProfile接口
  let toastTitle = '登录中...';
  if (localUserInfo) {
    payload.userInfo = localUserInfo;
  } else {
    const { userInfo } = await getUserProfile(opts);
    setStorageSync(config.storage.userInfo, userInfo);
    payload.userInfo = userInfo;
  }
  showToast({ icon: 'loading', title: toastTitle });
  const code = await generateCode();
  payload.code = code;
  const { data } = await wxMiniProgramLogin({ ...payload });
  // token写入本地缓存
  setStorageSync(config.storage.tokenKey, data.token);
  store.dispatch(getUser(payload.userInfo));
  store.dispatch(initCommonReducer() as any);
}

// 检查用户登录状态
export async function checkCodeSession() {
  try {
    await checkSession();
    return true;
  } catch (error) {
    return false;
  }
}

// wx.login 获取微信用户code
export async function generateCode(): Promise<string> {
  const res = await login();
  const { code, errMsg } = res;
  if (!code) throw new Error(`wx.login调用失败${errMsg}`);
  setStorageSync(config.storage.code, code);
  return code;
}
