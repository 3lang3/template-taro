import config from '@/config';

/** 获取资源的http地址 */
export function getHttpPath(path: string): string {
  if (/https?:\/\//.test(path)) return path;
  return `${config.cdn}/${path}`;
}

export function isDef<T>(val: T): val is NonNullable<T> {
  return val !== undefined && val !== null;
}

/**
 * 字符串换行符替换成<br />
 */
export const stringToHtml = (content: string) => {
  return content.replace(/(\r\n|\n)/g, '<br>');
};
