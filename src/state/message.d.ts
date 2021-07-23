import type { MessageListResType } from '@/services/message';

export interface MessageStateType {
  list: MessageListResType['_list'];
  page: number;
  pageSize: number;
  totalCount: number;
  isReadAll: boolean;
}
