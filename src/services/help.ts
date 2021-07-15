import request, { PromiseResponseType } from '@/utils/request';
import type { ListResType } from './common.d';

export type Node = {
  id: number;
  ids: number;
  title: string;
  icon: string;
  sort: number;
  created_at: string;
  help_list: {
    id: number;
    ids: number;
    title: string;
  }[];
};

export type ListNode = {
  id: string;
  ids: string;
  question: string;
  answer: string;
  sort: number;
  created_at: string;
};

export type GetListResType = ListResType<ListNode[]>;

// 获取帮助分类列表
export function getCategoryList(data = {}): Promise<PromiseResponseType<Node[]>> {
  return request('/help/getCategoryList', {
    method: 'GET',
    data,
  });
}

// 获取帮助列表
export function getList(data = {}): Promise<PromiseResponseType<GetListResType>> {
  return request('/help/getList', {
    method: 'GET',
    data,
  });
}

// 获取帮助详情
export function getDetail(data = {}): Promise<PromiseResponseType<ListNode>> {
  return request('/help/getDetail', {
    method: 'GET',
    data,
  });
}
