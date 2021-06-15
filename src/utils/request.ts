import { request } from "@tarojs/taro";
import config from "@/config";

/**
 * @link https://taro-docs.jd.com/taro/docs/next/apis/network/request/request
 */
const generateRequest = (prefix: string) => {
  return (url: string, opts: Omit<request.Option, "url">) =>
    request({ url: `${prefix}${url}`, ...opts });
};

export default generateRequest(config.api.current);
