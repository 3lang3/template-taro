import request from '@/utils/request';
import type { PromiseResponseType } from '@/utils/request';
import { stringify } from 'querystring';

export type AlbumDetailResType = {
  album_name: string;
  song: { ids: string; song_name: string; singer: string }[];
} & Record<string, any>;

export type AlbumDetailParams = {
  album_ids: string;
};

export function getMusicAlbumDetail(
  data: AlbumDetailParams,
): Promise<PromiseResponseType<AlbumDetailResType>> {
  return request(`/album/getMusicAlbumDetail?${stringify(data)}`);
}
