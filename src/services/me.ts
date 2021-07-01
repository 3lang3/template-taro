import request from '@/utils/request';
import type { PromiseResponseType } from '@/utils/request';

export type MePageResType = {
  /**
   * 用户身份
   * - 0 普通用户
   * - 1 词曲作者
   * - 2 歌手
   * - 3 机构
   */
  identity: 0 | 1 | 2 | 3;
  /**
   * 手机号
   */
  mobile?: number;
  audit_info?: {
    /**
     * 认证身份
     * - 1 词曲作者
     * - 2 歌手
     */
    identity: 1 | 2;
    id: number;
  };
};
export function getHomePageDetail(): Promise<PromiseResponseType<MePageResType>> {
  return request('/member/getHomePageDetail', {
    method: 'POST',
  });
}
