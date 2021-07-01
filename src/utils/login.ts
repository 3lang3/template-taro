import config from '@/config';
import { login, getUserProfile, checkSession, getStorageSync, setStorageSync } from '@tarojs/taro';
import store from '@/state/config/store';
import { getProfile, getUser } from '@/state/common';
import { wxMiniProgramLogin } from '@/services/common';

// 静默登录
export async function silentLogin() {
  try {
    // 获取code
    let { available } = await getCode();
    // 获取token
    let token = available ? getStorageSync(config.storage.tokenKey) : undefined;
    if (!token) throw new Error('需用调用getUserProfile获取用户的个人信息');
    const userInfo = getStorageSync(config.storage.userInfo);
    if (userInfo) {
      store.dispatch(getProfile(userInfo));
      return;
    }
    store.dispatch(getUser());
  } catch (error) {
    console.warn('静默登录失败:', error);
  }
}

// 主动登录(用户授权)
export async function userLogin(opts: getUserProfile.Option) {
  const { userInfo } = await getUserProfile(opts);
  setStorageSync(config.storage.userInfo, userInfo);
  const code = getStorageSync(config.storage.code);
  const { type, msg, data } = await wxMiniProgramLogin({ userInfo, code, mobile: '123' });
  if (type === 1) throw Error(msg);
  // token写入本地
  setStorageSync(config.storage.tokenKey, data.token);
  store.dispatch(getProfile(userInfo));
}

// 获取可用code
async function getCode() {
  // 获取缓存code
  let code = getStorageSync(config.storage.code);
  let available = await checkCodeSession();
  if (code) {
    // 检查缓存code是否过期
    if (available) {
      return { code, available };
    }
  }
  // 本地没有缓存code 重新获取code
  code = await generateCode();
  return { available, code };
}
// 检查用户登录状态
async function checkCodeSession() {
  try {
    await checkSession();
    return true;
  } catch (error) {
    return false;
  }
}

// wx.login 获取微信用户code
async function generateCode(): Promise<string> {
  const res = await login();
  const { code, errMsg } = res;
  if (!code) throw new Error(`wx.login调用失败${errMsg}`);
  setStorageSync('code', code);
  return code;
}
