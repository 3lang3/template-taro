import development from "./env/development";
import production from "./env/production";

const { envVersion } = process.env.NODE_ENV;

export type ConfigType = {
  api: {
    current: string;
    trade: string;
    msg: string;
  };
  cdn: string;
  plugin: string;
};

const config: ConfigType = {
  development,
  production,
}[envVersion];

export default config;
