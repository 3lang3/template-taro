import request from '@/utils/request';

// 发送老的手机号验证码
export function sendVerifyOldMobileCode() {
  return request('/member/sendVerifyOldMobileCode', {
    method: 'POST',
  });
}

// 验证老的手机号验证码
export function verifyOldMobile(data: { code: string }) {
  return request('/member/verifyOldMobile', {
    method: 'POST',
    data,
  });
}

// 发送新的的手机号验证码
export function sendBindNewMobileCode(data: { mobile: string }) {
  return request('/member/sendBindNewMobileCode', {
    method: 'POST',
    data,
  });
}

// 绑定新的邮箱
export function bindNewMobile(data: { code: string; mobile: string }) {
  return request('/member/bindNewMobile', {
    method: 'POST',
    data,
  });
}
