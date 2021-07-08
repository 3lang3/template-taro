import request from '@/utils/request';
import type { PromiseResponseType } from '@/utils/request';

export type UserIdentityType = 0 | 1 | 2 | 3;
export type CurrentUserType = {
  /** 会员ids */
  ids: string;
  /** 微信号 */
  weixin_number: string;
  /** 昵称 */
  nickname: string;
  /** 头像 */
  avatar: string;
  /** 手机号 */
  mobile: string;
  /** 用户身份 */
  identity: UserIdentityType;
  /**
   * 是否实名认证
   */
  is_authentication: 0 | 1;
  /**
   * 微信推送模版数据
   */
  template: { template_id: string; template_name: string }[];
} & Record<string, any>;
// 根据token获取用户信息
export function getCurrentUser(): Promise<PromiseResponseType<CurrentUserType>> {
  return request('/member/getBaseInfo');
}

export type WxMiniProgramLoginParams = {
  code: string | number;
  userInfo: any;
  mobile?: string | number;
};
// 小程序登录
export function wxMiniProgramLogin(data: WxMiniProgramLoginParams) {
  return request(
    '/login/wxMiniProgramLogin',
    {
      method: 'POST',
      data,
    },
    false,
  );
}

// 省市县三级联动接口
export function getRegionList() {
  return request('/other/getRegionList');
}

// 获取歌曲标签
export function getTagType() {
  return request('/other/getTagType');
}

// 获取语种设置
export function getLanguageList() {
  return request('/other/getLanguageList');
}

// 获取曲风\流派接口
export function getSongStyleList() {
  return request('/other/getSongStyleList');
}

type GetDecryptedDataParams = {
  code: string;
  encryptedData: string;
  iv: string;
};

// 解密敏感信息接口 (微信授权绑定手机号)
export function getDecryptedData(data: GetDecryptedDataParams) {
  return request(
    '/login/getDecryptedData',
    {
      method: 'POST',
      data,
    },
    false,
  );
}
