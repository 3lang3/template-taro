import request, { PromiseResponseType } from '@/utils/request';

export type Node = {
  id: number;
  ids: number;
  title: string;
  icon: string;
  sort: number;
  created_at: string;
  help_list: {
    id: string;
    ids: string;
    title: string;
  }[];
};

// 获取帮助分类列表
export function getCategoryList(data = {}): Promise<PromiseResponseType<Node[]>> {
  return request('/help/getCategoryList', {
    method: 'GET',
    data,
  });
}
