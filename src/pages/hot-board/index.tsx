import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { TabNavigationBar } from '@/components/CustomNavigation';
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
      <TabNavigationBar />

      <Flex className="hot-board-header" align="end" justify="between">
        <TaroImage src={require('@/assets/hot-board/hot_board_title.svg')} className="hot-board-header__title" />
        <Typography.Text type="light" size="sm">2021.05.20更新</Typography.Text>
      </Flex>
      <View className="hot-board-body">
        {demoData.map((item, i) => (
          <Flex key={i} className="hot-board-body__item">
            <View className="hot-board-body__item-index">{i + 1}</View>
            <View className="hot-board-body__item-content">
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
