import { makeUpApi } from "./helper";

const DOMAIN = "sijishows.com";

export default {
  api: {
    current: makeUpApi("devshopapi", DOMAIN),
    // current: 'http://192.168.1.143',
    trade: makeUpApi("devtrade", DOMAIN),
    msg: makeUpApi("devmsgapi", DOMAIN),
  },
  cdn: makeUpApi("imgs", DOMAIN),
  plugin: makeUpApi("devplugin", DOMAIN),
};
