import request, { PromiseResponseType } from '@/utils/request';
import type { listParams, ListResType } from './common.d';

export type Node = {
  ids: number;
  song_name: string;
  composer_final_price: string;
  lyricist_final_price: string;
  show_created_at: string;
  singer: string[];
};

export type appointNode = {
  ids: number;
  nickname: string;
  real_name: string;
};

type AppointNode = { ids: string; memberIds: string[] };

export type BuySongResType = ListResType<Node[]>;

// 已购列表
export function getBuySongList(data: listParams): Promise<PromiseResponseType<BuySongResType>> {
  return request('/song/getBuySongList', {
    method: 'GET',
    data,
  });
}

// 通过名称查找歌手名称
export function getSingerByName(data: AppointNode): Promise<PromiseResponseType<appointNode>> {
  return request(
    '/song/getSingerByName',
    {
      method: 'POST',
      data,
    },
    false,
  );
}

// 获取指定歌手列表
export function getAppointSongList(data: {
  ids: string;
}): Promise<PromiseResponseType<appointNode>> {
  return request(
    '/song/getAppointSongList',
    {
      method: 'GET',
      data,
    },
    false,
  );
}

// 指定歌手接口
export function appointMusicSong(data: AppointNode): Promise<PromiseResponseType<appointNode>> {
  return request(
    '/song/appointMusicSong',
    {
      method: 'POST',
      data,
    },
    false,
  );
}
