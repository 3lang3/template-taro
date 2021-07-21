import { WebView } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';

export default () => {
  const { params } = useRouter<{ src: string }>();
  return <WebView src={decodeURIComponent(params.src)} />;
};
