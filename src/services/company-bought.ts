import request, { PromiseResponseType } from '@/utils/request';
import type { listParams, ListResType } from './common.d';

export type BuySongResType = ListResType<{
  content: any;
  show_created_at: string;
  is_read: number;
  id: number;
  created_at: string;
}>;

// 已购列表
export function getBuySongList(data: listParams): Promise<PromiseResponseType<BuySongResType>> {
  return request('/song/getBuySongList', {
    method: 'GET',
    data,
  });
}
