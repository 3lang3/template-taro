import request, { PromiseResponseType } from '@/utils/request'

export type MessageListResType = {
  _page: {
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
  }
  _list: {
    content: any
    show_created_at: string
    is_read: number
    id: number
    created_at: string
  }[]
}

export function getMessageList(): Promise<PromiseResponseType<MessageListResType>> {
  return request('/message/getMessageList', {
    method: 'GET',
  })
}
