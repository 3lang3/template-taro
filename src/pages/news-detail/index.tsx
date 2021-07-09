import { View } from '@tarojs/components';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { useRouter } from '@tarojs/taro';
import { getTrendsDetail } from '@/services/home';
import { useRequest } from 'ahooks';
import { FullPageError, FullPageLoader } from '@/components/Chore';
import Image from '@/components/Image';
import Icon from '@/components/Icon';

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
            <Icon icon="icon-shouye_shijian" className="latest-news-item__icon" />
            <Typography.Text size="sm" type="secondary">
              {data.publish_time}
            </Typography.Text>
          </Flex>
          <Flex>
            <Icon icon="icon-shouye_chakan" className="latest-news-item__icon" />
            <Typography.Text size="sm" type="secondary">
              {data.read_number}
            </Typography.Text>
          </Flex>
        </Flex>
        <Image style={{ width: '100%' }} src={data.image} />
        <View dangerouslySetInnerHTML={{ __html: data.content }} />
      </View>
    </>
  );
};
