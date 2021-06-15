import development from "./env/development";
import production from "./env/production";

export type ConfigType = {
  api: {
    current: string;
    trade: string;
    msg: string;
  };
  cdn: string;
  plugin: string;
  tokenKey: string;
};

const config: ConfigType = {
  development,
  production,
}[process.env.NODE_ENV];

export default {
  ...config,
  tokenKey: 'authorization'
};
