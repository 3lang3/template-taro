import request from '@/utils/request';
import type { PromiseResponseType } from '@/utils/request';

/**
 * 用户身份
 * - 0 普通用户
 * - 1 词曲作者
 * - 2 歌手
 * - 3 机构
 */
export type UserIdentityType = {
  /**
   * 用户身份
   * - 0 普通用户
   * - 1 词曲作者
   * - 2 歌手
   * - 3 机构
   */
  identity: 0 | 1 | 2 | 3;
};
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
} & UserIdentityType &
  Record<string, any>;

export function getCurrentUser(): Promise<PromiseResponseType<CurrentUserType>> {
  return request('/member/getBaseInfo');
}

export type wxMiniProgramLoginPayload = {
  code: string | number;
  userInfo: any;
  mobile?: string | number;
};

export function wxMiniProgramLogin(data: wxMiniProgramLoginPayload) {
  return request(
    '/login/wxMiniProgramLogin',
    {
      method: 'POST',
      data,
    },
    false,
  );
}
