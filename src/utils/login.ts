import config from '@/config';
import { getAuthorization } from '@/services/global';
import { login, checkSession, getStorageSync } from '@tarojs/taro';

// login logic
export async function loginLogic() {
  try {
    // 获取本地token
    const locakToken = getStorageSync(config.tokenKey);
    if (locakToken) return;
    // 获取本地code
    let code = getStorageSync('code');
    if (code) {
      // 检查code是否过期
      const { errMsg } = await checkSession();
      // code过期 重新调用login获取code
      if (errMsg) {
        const { code: newCode, errMsg: loginErrMsg } = await login();
        if (loginErrMsg) throw new Error(errMsg);
        code = newCode;
      }
    }
    // code获取用户信息
    const { data } = await getAuthorization({ code });
    console.log(data)
  } catch (error) {}
}
