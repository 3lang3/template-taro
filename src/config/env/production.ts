import { makeUpApi } from "./helper";

const DOMAIN = "yigeyougou.com";

export default {
  api: {
    current: makeUpApi("shopapi", DOMAIN),
    trade: makeUpApi("trade", DOMAIN),
    msg: makeUpApi("msgapi", DOMAIN),
  },
  cdn: makeUpApi("imgs", DOMAIN),
  plugin: makeUpApi("plugin", DOMAIN),
};
