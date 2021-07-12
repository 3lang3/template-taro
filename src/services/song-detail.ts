import request, { PromiseResponseType } from '@/utils/request';

export type Node = {
  node: string;
  complete_at: string;
  status: number;
};

// 歌曲制作详情
export function getMakeSongDetail(data: { ids: number }): Promise<PromiseResponseType<Node[]>> {
  return request('/song/getMakeSongDetail', {
    method: 'GET',
    data,
  });
}
