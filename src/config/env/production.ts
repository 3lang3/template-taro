import { makeUpApi } from './helper';

const DOMAIN = 'gygmall.com';

export default {
  api: {
    current: makeUpApi('testydjshopapi', DOMAIN),
    trade: makeUpApi('trade', DOMAIN),
    msg: makeUpApi('msgapi', DOMAIN),
  },
  cdn: makeUpApi('imgs', DOMAIN),
  plugin: makeUpApi('plugin', DOMAIN),
};
