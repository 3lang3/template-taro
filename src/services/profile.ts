import request, { PromiseResponseType } from '@/utils/request';

export type Node = {
  member_ids: Number;
  avatar: String;
  real_name: String;
  idcard: String;
  mobile: String;
  province: String;
  city: String;
  district: String;
  email: String;
};

// 歌曲制作列表
export function getMusicsongmakeList(): Promise<PromiseResponseType<any>> {
  return request('/member/getEditInfo', {
    method: 'GET',
  });
}
