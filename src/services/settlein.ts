import request from '@/utils/request';

// 获取用户实名认证信息
export function getCertificationInfo() {
  return request('/apply/getCertificationInfo', {}, false);
}

// 认证信息详情接口
export function applyDetail() {
  return request('/apply/applyDetail');
}

// 入驻申请接口
export function singerApply(data) {
  return request('/apply/singerApply', {
    method: 'POST',
    data,
  });
}

// 验证码接口
export function sendSettleCodeSms(data: { mobile: string | number }) {
  return request('/song/sendApplyCodeSms', {
    method: 'POST',
    data,
  });
}
