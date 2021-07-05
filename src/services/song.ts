// 词曲相关services

import request from '@/utils/request';
import { stringify } from 'querystring';

// 词曲详情
export function getSaleSongDetail(data: { ids: string | number }) {
  return request(`/music/getSaleSongDetail?${stringify(data)}`);
}

// 歌曲详情
export function getSongDetail(data: { ids: string | number }) {
  return request(`/music/getSongDetail?${stringify(data)}`);
}
