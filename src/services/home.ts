import request, { PromiseResponseType } from '@/utils/request';
import { stringify } from 'querystring';

export type HomeResType = {
  banner: any[];
  album: any[];
  hotSongList: any[];
  trends: any[];
};

export function getHomeData(): Promise<PromiseResponseType<HomeResType>> {
  return request('/home/index');
}

// 获取动态详情
export function getTrendsDetail(data) {
  return request(`/home/getTrendsDetail?${stringify(data)}`);
}
