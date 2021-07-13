import request, { PromiseResponseType } from '@/utils/request';
import type { ListResType } from './common.d';

export type Node = {
  ids: number;
  song_name: string; //	词曲名称
  sect: string; // 曲风
  language: string; // 语种
  lyricist_content: string; // 歌词
};

// 曲库列表
export function getMusicSongList(data = {}): Promise<PromiseResponseType<ListResType<Node[]>>> {
  return request('/song/getMusicSongList', {
    method: 'GET',
    data,
  });
}
