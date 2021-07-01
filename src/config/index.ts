import development from './env/development';
import production from './env/production';

export type ConfigType = {
  api: {
    current: string;
    trade: string;
    msg: string;
  };
  cdn: string;
  plugin: string;
  storage: Record<string, string>;
};

const config = {
  development,
  production,
}[process.env.NODE_ENV as string] as ConfigType;

export default {
  ...config,
  storage: {
    // token
    tokenKey: 'authorization',
    // getUserProfile local storage key
    userInfo: 'userInfo',
    // wx.login return code value local storage key
    code: 'code',
  },
};
