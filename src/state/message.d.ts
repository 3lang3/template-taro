import type { MessageListResType } from '@/services/message';

export interface MessageStateType {
  list: MessageListResType['_list'];
  page: number;
  pageSize: number;
  totalPage: number;
}
