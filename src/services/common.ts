import request from '@/utils/request';

export function getCurrentUser() {
  return request('/getMDPBaseInfo', {
    method: 'POST',
  });
}

export type wxMiniProgramLoginPayload = {
  code: string | number;
  userInfo: any;
  mobile?: string | number;
};

export function wxMiniProgramLogin(data: wxMiniProgramLoginPayload) {
  return request(
    '/login/wxMiniProgramLogin',
    {
      method: 'POST',
      data,
    },
    false,
  );
}
