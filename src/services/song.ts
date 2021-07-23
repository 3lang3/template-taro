// 词曲相关services

import request from '@/utils/request';
import { stringify } from 'querystring';

// 热门歌曲列表
export function getHotSongList() {
  return request(`/music/getHotSongList`);
}

// 词曲详情
export function getSaleSongDetail(data: { ids: string | number }) {
  return request(`/song/getSaleSongDetail?${stringify(data)}`);
}

// 曲库词曲详情
export function getMusicSongDetail(data: { ids: string | number }) {
  return request(`/song/getMusicSongDetail?${stringify(data)}`);
}

// 歌曲详情
export function getSongDetail(data: { ids: string | number }) {
  return request(`/music/getSongDetail?${stringify(data)}`);
}

export type OperationMusicSongPriceParams = {
  ids: number | string;
  /**
   * 操作类型：
   *  - 1 改价
   *  - 2 还价
   */
  operation_type: number | string;
  lyricist_price: string;
  composer_price: string;
  /** 是否接受还价 */
  is_change_price?: number | string;
};
// 修改词曲价格接口
export function operationMusicSongPrice(data: OperationMusicSongPriceParams) {
  return request('/song/operationMusicSongPrice', {
    method: 'POST',
    data,
  });
}
// 放弃收购词曲
export function abandonMusicSong(data: { ids: string | number }) {
  return request(`/song/abandonMusicSong?${stringify(data)}`);
}
// 我要唱
export function applyWantSong(data: { ids: string | number }) {
  return request(`/song/applyWantSong?${stringify(data)}`);
}
// 删除我要唱
export function delWantSong(data: { ids: string | number }) {
  return request(`/song/delWantSong?${stringify(data)}`);
}
