import request, { PromiseResponseType } from '@/utils/request';
import type { SuccessResType } from './common.d';

export type Node = {
  member_ids: number;
  avatar: string;
  real_name: string;
  idcard: string;
  mobile: string;
  province: string;
  city: string;
  district: string;
  email: string;
};

// 编辑资料信息
export function getEditInfo(): Promise<PromiseResponseType<Node>> {
  return request('/member/getEditInfo', {
    method: 'GET',
  });
}

// 歌曲制作列表
export function editInfo([province, city, district]: number[]): Promise<
  PromiseResponseType<SuccessResType<null>>
> {
  return request('/member/editInfo', {
    method: 'POST',
    data: {
      province,
      city,
      district,
    },
  });
}
