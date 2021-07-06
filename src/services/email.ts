import request from '@/utils/request';

// 发送老的邮箱验证码
export function sendVerifyOldEmailCode() {
  return request('/member/sendVerifyOldEmailCode', {
    method: 'POST',
  });
}

// 发送老的邮箱验证码
export function verifyOldEmail(data: { code: string }) {
  return request('/member/verifyOldEmail', {
    method: 'POST',
    data,
  });
}

// 发送新的的邮箱验证码
export function sendBindNewEmailCode(data: { email: string }) {
  return request('/member/sendBindNewEmailCode', {
    method: 'POST',
    data,
  });
}

// 绑定新的邮箱
export function bindNewEmail(data: { code: string; email: string }) {
  return request('/member/bindNewEmail', {
    method: 'POST',
    data,
  });
}
