import request, { PromiseResponseType } from '@/utils/request';

export type Node = {
  ids: number;
  song_name: string;
  sect: string;
  language: string;
  make_status: number;
};

// 歌曲制作列表
export function getMakeSongList(): Promise<PromiseResponseType<Node[]>> {
  return request('/song/getMakeSongList', {
    method: 'GET',
  });
}
