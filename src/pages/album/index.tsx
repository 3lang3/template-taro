import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { TabNavigationBar } from '@/components/CustomNavigation';
import Image from '@/components/Image';
import { navigateTo } from '@tarojs/taro';
import { View, Image as TaroImage } from '@tarojs/components';
import './index.less';

const demoData = [
  { author: '易烊千玺', title: '39km' },
  { author: '野花', title: '39km' },
  { author: '38.7km', title: '39km' },
  { author: '爱情鸟', title: '39km' },
  { author: '亲密爱人', title: '39km' },
  { author: 'PingFangSC', title: '39km' },
  { author: '易烊千玺', title: '39km' },
];

export default () => {
  return (
    <>
      <TabNavigationBar title="专辑" />

      <Flex className="album-header" align="start">
        <Image className="album-header__cover" src="" />
        <Flex direction="column" align="start" justify="between" className="album-header__content">
          <TaroImage
            src={require('@/assets/icon/album_share.svg')}
            className="album-header__share"
          />
          <View>
            <Typography.Text className="mb15" strong size="lg" type="light">
              后座剧场
            </Typography.Text>
            <Typography.Text type="light">易烊千玺</Typography.Text>
          </View>
          <View style={{ width: '100%', overflow: 'hidden' }}>
            <Typography.Text className="mb15" size="sm" type="light">
              发行时间:2021.05.20
            </Typography.Text>
            <Flex
              onClick={() => navigateTo({ url: '/pages/album-detail/index' })}
              style={{ width: '100%', overflow: 'hidden' }}
              justify="between"
            >
              <Typography.Text size="sm" type="light" ellipsis>
                人们难辩过去何时成为过去,却能牢记过去的样子——从北二环到昌平近40公里,10年后的他,将这个印象深刻的儿时交付,又从斑斓浩瀚的音乐光谱中,精选与自我共振频率最高的6首经单作品~
              </Typography.Text>
              <View className="album-header__right at-icon at-icon-chevron-right" />
            </Flex>
          </View>
        </Flex>
      </Flex>
      <View className="album-body">
        {demoData.map((item, i) => (
          <Flex key={i} className="album-body__item">
            <View className="album-body__item-index">{i + 1}</View>
            <View className="album-body__item-content">
              <Typography.Title level={3}>{item.title}</Typography.Title>
              <Typography.Text size="sm" type="secondary">
                {item.author}
              </Typography.Text>
            </View>
          </Flex>
        ))}
      </View>
    </>
  );
};
