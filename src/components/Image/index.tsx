import config from '@/config';
import { Image } from '@tarojs/components';
import type { ImageProps } from '@tarojs/components/types/Image';

export default ({ src, mode = 'aspectFill', ...props }: ImageProps) => {
  let finallySrc = src;
  if (/^(data:image|\/\/)/.test(src) || (src && src.includes('://'))) {
    finallySrc = src;
  } else if (!/^https?:\/\//.test(src)) {
    finallySrc = `${config.cdn}/${src}`;
  }

  return <Image src={finallySrc} mode={mode} {...props} />;
};
