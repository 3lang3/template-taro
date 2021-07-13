import request from '@/utils/request';

// 入驻申请接口
export function songSale(data) {
  return request('/song/songSale', {
    method: 'POST',
    data,
  });
}
