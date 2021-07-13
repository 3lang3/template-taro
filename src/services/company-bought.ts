import request, { PromiseResponseType } from '@/utils/request';
import type { listParams, ListResType, SuccessResType } from './common.d';

export type Node = {
  ids: number;
  song_name: string;
  composer_final_price: string;
  lyricist_final_price: string;
  show_created_at: string;
  singer: string[];
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

export function appointMusicSong(
  data: AppointNode,
): Promise<PromiseResponseType<SuccessResType<null>>> {
  return request('/song/appointMusicSong', {
    method: 'POST',
    data,
  });
}
