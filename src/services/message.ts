import request, { PromiseResponseType } from '@/utils/request';
import type { listParams } from './common.d';

export type MessageListResType = {
  _page: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPage: number;
  };
  _list: {
    content: any;
    show_created_at: string;
    is_read: number;
    id: number;
    created_at: string;
  }[];
};

// 消息列表
export function getMessageList(data: listParams): Promise<PromiseResponseType<MessageListResType>> {
  return request('/message/getMessageList', {
    method: 'GET',
    data,
  });
}

// 清除所有消息红点提醒
export function clearMessageRemind(): Promise<PromiseResponseType<MessageListResType>> {
  return request('/message/clearMessageRemind', {
    method: 'POST',
  });
}

// 已读消息
export function readMessageRemind(data: {
  id: number;
}): Promise<PromiseResponseType<MessageListResType>> {
  return request(
    '/message/readMessageRemind',
    {
      method: 'POST',
      data,
    },
    false,
  );
}
