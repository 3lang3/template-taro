import { View, Image as TaroImage } from '@tarojs/components';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import './index.less';

export default () => {
  return (
    <>
      <View className="latest-news-item">
        <Typography.Title className="latest-news-item__title" level={3}>
          有台时光机,开往快乐星球,请尽快入座,一起追忆那些儿时让我们痴迷的音乐吧~
        </Typography.Title>
        <Flex className="latest-news-item__footer" justify="between">
          <Flex>
            <TaroImage
              mode="aspectFit"
              className="latest-news-item__icon"
              src={require('@/assets/icon/clock_outline.svg')}
            />
            <Typography.Text size="sm" type="secondary">
              2020.05.20 16:00
            </Typography.Text>
          </Flex>
          <Flex>
            <TaroImage
              mode="aspectFit"
              className="latest-news-item__icon"
              src={require('@/assets/icon/eye_outline.svg')}
            />
            <Typography.Text size="sm" type="secondary">
              6666
            </Typography.Text>
          </Flex>
        </Flex>

        <View>富文本内容</View>
      </View>
    </>
  );
};
