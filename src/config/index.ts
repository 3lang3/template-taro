import envConfig from './env';

export type ConfigType = {
  api: {
    current: string;
    msg: string;
  };
  /** boss后台地址 */
  boss: string;
  cdn: string;
  uploadFile: string;
  plugin: string;
  storage: Record<string, string>;
};

export default {
  ...envConfig,
  uploadFile: envConfig.api.current + '/other/UploadFile',
  storage: {
    // token
    tokenKey: 'authorization',
    // getUserProfile local storage key
    userInfo: 'userInfo',
    // wx.login return code value local storage key
    code: 'code',
  },
};
