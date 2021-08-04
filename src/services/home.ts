import request from '@/utils/request';
import type { PromiseResponseType } from '@/utils/request';
import { stringify } from 'querystring';

export type HomeResType = {
  banner: any[];
  album: any[];
  hotSongList: any[];
  trends: any[];
  back_images: string;
  is_show_trends: number;
};

export function getHomeData(): Promise<PromiseResponseType<HomeResType>> {
  return request('/home/index');
}

// 获取动态列表
export function getTrends(data) {
  return request(
    `/home/getTrendsList`,
    {
      data,
    },
    false,
  );
}

// 获取动态详情
export function getTrendsDetail(data) {
  return request(`/home/getTrendsDetail`, { data });
}
