import { View, Image as TaroImage } from '@tarojs/components';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { useRouter } from '@tarojs/taro';
import { getTrendsDetail } from '@/services/home';
import { useRequest } from 'ahooks';
import { FullPageError, FullPageLoader } from '@/components/Chore';

import './index.less';

export default () => {
  const { params } = useRouter();
  const {
    data: { data } = { data: {} },
    loading,
    error,
    refresh,
  } = useRequest(getTrendsDetail, {
    defaultParams: [{ id: params.id }],
  });

  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  return (
    <>
      <View className="latest-news-item">
        <Typography.Title className="latest-news-item__title" level={3}>
          {data.title}
        </Typography.Title>
        <Flex className="latest-news-item__footer" justify="between">
          <Flex>
            <TaroImage
              mode="aspectFit"
              className="latest-news-item__icon"
              src={require('@/assets/icon/clock_outline.svg')}
            />
            <Typography.Text size="sm" type="secondary">
              {data.publish_time}
            </Typography.Text>
          </Flex>
          <Flex>
            <TaroImage
              mode="aspectFit"
              className="latest-news-item__icon"
              src={require('@/assets/icon/eye_outline.svg')}
            />
            <Typography.Text size="sm" type="secondary">
              {data.read_number}
            </Typography.Text>
          </Flex>
        </Flex>

        <View>{data.content}</View>
      </View>
    </>
  );
};
