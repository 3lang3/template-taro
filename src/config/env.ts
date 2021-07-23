export default {
  api: {
    current: process.env.CURRENT_API_HOST,
    msg: process.env.MSG_API_HOST,
  },
  boss: process.env.ADMIN_PATH,
  cdn: process.env.STATIC_PATH,
  plugin: process.env.PLUGIN_PATH,
};
