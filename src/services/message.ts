import { PromiseResponseType, msgRequest } from '@/utils/request';
import type { listParams, ListResType, SuccessResType } from './common.d';

export type MessageListResType = ListResType<
  {
    content: any;
    show_created_at: string;
    is_read: number;
    id: number;
    created_at: string;
  }[]
>;

// 消息列表
export function getMessageList(data: listParams): Promise<PromiseResponseType<MessageListResType>> {
  return msgRequest(
    '/message/getMessageList',
    {
      method: 'GET',
      data,
    },
    true,
  );
}

// 清除所有消息红点提醒
export function clearMessageRemind(): Promise<PromiseResponseType<MessageListResType>> {
  return msgRequest(
    '/message/clearMessageRemind',
    {
      method: 'POST',
    },
    true,
  );
}

// 已读消息
export function readMessageRemind(data: {
  id: number;
}): Promise<PromiseResponseType<MessageListResType>> {
  return msgRequest(
    '/message/readMessageRemind',
    {
      method: 'POST',
      data,
    },
    false,
  );
}

// 是否有未读消息接口
export function getUnreadMessage(): Promise<PromiseResponseType<{ is_show: 0 | 1 }>> {
  return msgRequest(
    '/message/getUnreadMessage',
    {
      method: 'GET',
    },
    false,
  );
}
