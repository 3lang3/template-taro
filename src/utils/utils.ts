import config from '@/config';

/** 获取资源的http地址 */
export function getHttpPath(path: string): string {
  if (/https?:\/\//.test(path)) return path;
  return `${config.cdn}/${path}`;
}
