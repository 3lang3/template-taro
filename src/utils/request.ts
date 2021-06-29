import { getStorageSync, request } from '@tarojs/taro';
import config from '@/config';
import store from '@/state/config/store';
import { logout } from '@/state/user';

export type PromiseResponseType<T> = {
  /** 返回的数据主体 */
  data: T;
  /**
   * 请求状态值
   * - 1 非正常状态
   * - 0 正常状态
   */
  type: 0 | 1;
  /** 响应消息 */
  msg: string;
  /** 服务器时间戳 */
  server_time: number
};

/**
 * @link https://taro-docs.jd.com/taro/docs/next/apis/network/request/request
 */
const generateRequest = (prefix: string) => {
  let header = {} as any;
  const tk = getStorageSync(config.tokenKey);
  if (tk) {
    header.authorization = tk;
  }
  return (url: string, opts?: Omit<request.Option, 'url' | 'success' | 'fail'>) => {
    opts = opts || {};
    opts.header = { ...header, ...opts.header };
    return new Promise<PromiseResponseType<any>>((resolve, reject) => {
      request({
        url: `${prefix}${url}`,
        header,
        success: ({ data, statusCode }: { data: PromiseResponseType<any>; statusCode: number }) => {
          // @todo logout logic
          if (statusCode === 401 || statusCode === 403) {
            store.dispatch(logout())
            reject(new Error(data.msg))
          }
          if (statusCode >= 400 || statusCode < 200) {
            reject(new Error(`request error: ${statusCode}`));
          }
          if (data.type === 1) {
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
