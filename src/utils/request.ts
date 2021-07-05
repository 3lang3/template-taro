import Taro, { getStorageSync, request } from '@tarojs/taro';
import config from '@/config';
import store from '@/state/config/store';
import { logout } from '@/state/common';

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
  server_time: number;
};

/** 弹窗
 * @param title 弹窗内容
 * @param visible 是否显示
 */
function myToast(title: string = '系统异常，请稍后重试', visible: boolean = true) {
  if (visible) {
    Taro.showToast({
      title,
      icon: 'none',
      duration: 1500,
    });
  }
}

/**
 * @link https://taro-docs.jd.com/taro/docs/next/apis/network/request/request
 */
const generateRequest = (prefix: string) => {
  let header = {} as any;
  return (
    url: string,
    opts?: Omit<request.Option, 'url' | 'success' | 'fail'>,
    isToast: boolean = true,
  ) => {
    const tk = getStorageSync(config.storage.tokenKey);
    if (tk) {
      header.authorization = tk;
    }
    opts = opts || {};
    opts.header = { ...header, ...opts.header };
    return new Promise<PromiseResponseType<any>>((resolve, reject) => {
      request({
        url: `${prefix}${url}`,
        header,
        success: ({ data, statusCode }: { data: PromiseResponseType<any>; statusCode: number }) => {
          // @todo logout logic
          if (statusCode === 401 || statusCode === 403) {
            store.dispatch(logout());
            reject(new Error(data.msg));
          }
          if (statusCode >= 400 || statusCode < 200) {
            myToast(data.msg, isToast);
            reject(new Error(`request error: ${statusCode}`));
          }
          // 对于type=1的请求统一处理
          if (data.type === 1) {
            myToast(data.msg, isToast);
            reject(new Error(data.msg));
          }
          resolve(data);
        },
        fail: (err) => {
          myToast(err.errMsg, isToast);
          reject(new Error(err.errMsg));
        },
        ...opts,
      });
    });
  };
};

export default generateRequest(config.api.current);
// 消息调用方法
export const msgRequest = generateRequest(config.api.msg);
