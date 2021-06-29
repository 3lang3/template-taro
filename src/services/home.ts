import request, { PromiseResponseType } from '@/utils/request';

export type HomeResType = {
  banner: any[];
  album: any[];
  hotSongList: any[];
  trends: any[];
};

export function getHomeData(): Promise<PromiseResponseType<HomeResType>> {
  return request('/home/index');
}
