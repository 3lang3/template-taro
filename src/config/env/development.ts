import { makeUpApi } from "./helper";

const DOMAIN = "sijishows.com";

export default {
  api: {
    current: makeUpApi("devshopapi", DOMAIN),
    trade: makeUpApi("devtrade", DOMAIN),
    msg: makeUpApi("devmsgapi", DOMAIN),
  },
  cdn: makeUpApi("imgs", DOMAIN),
  plugin: makeUpApi("devplugin", DOMAIN),
};
