import request from '@/utils/request';

export function getMessageList() {
  return request('/message/getMessageList', {
    method: 'GET',
  });
}
