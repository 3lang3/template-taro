import { getStorageSync, request, removeStorageSync } from '@tarojs/taro';
import config from '@/config';

type ResponseType = { data: any; type: number; msg: string; server_time: number };

/**
 * @link https://taro-docs.jd.com/taro/docs/next/apis/network/request/request
 */
const generateRequest = (prefix: string) => {
  let header;
  const tk = getStorageSync(config.tokenKey);
  if (tk) {
    header.authorization = tk;
  }
  return (url: string, opts: Omit<request.Option, 'url' | 'success' | 'fail'>) => {
    opts = opts || {};
    opts.header = { ...header, ...opts.header };
    return new Promise<ResponseType>((resolve, reject) => {
      request({
        url: `${prefix}${url}`,
        header,
        success: ({ data, statusCode }: { data: ResponseType; statusCode: number }) => {
          if (statusCode === 401 || statusCode === 403) {
            removeStorageSync(config.tokenKey)
            reject(new Error(data.msg))
          }
          if (statusCode >= 400 || statusCode < 200 || data.type === 1) {
            reject(new Error(data.msg));
          }
          resolve(data);
        },
        fail: (err) => {
          reject(new Error(err.errMsg));
        },
        ...opts,
      });
    });
  };
};

export default generateRequest(config.api.current);
