import type { MessageListResType } from '@/services/message'

export interface MessageState {
  message: {
    list: MessageListResType['_list']
  }
}
