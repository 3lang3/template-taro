import request from '@/utils/request';

export function getCurrentUser() {
  return request('/getMDPBaseInfo', {
    method: 'POST',
  });
}

export function getAuthorization(data) {
  return request('/getAuthorization', {
    method: 'POST',
    data
  });
}
