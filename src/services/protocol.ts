import request, { PromiseResponseType } from '@/utils/request';

export type Node = {
  content: string;
  id: number;
  title: string;
};

// 获取平台协议接口
export function getProtocol(): Promise<PromiseResponseType<Node>> {
  return request('/other/getProtocol', {
    method: 'GET',
  });
}
