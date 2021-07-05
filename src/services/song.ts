// 词曲相关services

import request from '@/utils/request';
import { stringify } from 'querystring';

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
};
// 修改词曲价格接口
export function operationMusicSongPrice(data: OperationMusicSongPriceParams) {
  return request('/song/operationMusicSongPrice', {
    method: 'POST',
    data,
  });
}
