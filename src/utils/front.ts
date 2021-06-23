import { loadFontFace } from '@tarojs/taro';

export function loadFont() {
  loadFontFace({
    global: true,
    family: 'iconfont',
    source: 'https://at.alicdn.com/t/font_2628823_u1sxljgevvi.woff?t=1624437871745',
  });
}
