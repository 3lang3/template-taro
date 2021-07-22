import request from '@/utils/request';
import type { PromiseResponseType } from '@/utils/request';

export type UserIdentityType = {
  /**
   * 用户身份标识
   * - 0 普通身份
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
  /** 艺名 */
  stage_name: string;
  /** 头像 */
  avatar: string;
  /** 手机号 */
  mobile: string;
  /**
   * 是否实名认证
   */
  is_authentication: 0 | 1;
  /**
   * 用户真实姓名
   */
  real_name: string;
  /**
   * 微信推送模版数据
   */
  template: { template_id: string; template_name: string }[];
  /** 静态资源信息 */
  config: {
    /** 默认专辑图 */
    default_album_img: string;
    /** 默认音乐播放图 */
    default_music_img: string;
    /** 热门歌曲排行榜背景图 */
    popular_board_bg: string;
  };
} & UserIdentityType &
  Record<string, any>;
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

// 音乐网站列表
export function getWebsiteType() {
  return request('/other/getWebsiteType');
}

// 银行列表
export function getBankList() {
  return request('/other/getBankList');
}

// 获取大文件上传信息
export function getPcSongUrl(data: { memberIds: string | number }) {
  return request(
    '/pc/getSongUrl',
    {
      method: 'GET',
      data,
    },
    false,
  );
}
// 获取签署用户的银行卡信息
export function getSingerBankInfo(data: { ids: string | number }) {
  return request(
    '/song/getSingerBankInfo',
    {
      method: 'GET',
      data,
    },
    false,
  );
}
// 获取入驻娱当家文案设置
export function getCopyWriting() {
  return request(
    '/other/getCopyWriting',
    {
      method: 'GET',
    },
    false,
  );
}
