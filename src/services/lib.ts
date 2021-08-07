import request, { PromiseResponseType } from '@/utils/request';
import type { ListResType } from './common.d';

export type Node = {
  ids: number;
  song_name: string; //	词曲名称
  sect: string; // 曲风
  language: string; // 语种
  lyricist_content: string; // 歌词
  is_read: 0 | 1; // 是否已读 0未读，1已读
};

// 曲库列表
export function getMusicSongList(data = {}): Promise<PromiseResponseType<ListResType<Node[]>>> {
  return request('/song/getMusicSongList', {
    method: 'GET',
    data,
  });
}
