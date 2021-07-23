import request, { PromiseResponseType } from '@/utils/request';

export type Node = {
  ids: number;
  song_name: string; //	词曲名称
  sect: string; // 曲风
  language: string; // 语种
  is_appoint: number; // 是否指派：0否，1是
  lyricist_content: string; // 歌词
};

// 我要唱词曲列表
export function getWantSongList(): Promise<PromiseResponseType<Node[]>> {
  return request('/song/getWantSongList', {
    method: 'GET',
  });
}
