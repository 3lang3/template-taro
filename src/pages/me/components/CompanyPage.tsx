import Button from '@/components/Button';
import { ManageSongItem } from '@/components/Chore';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { Image, View } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import './company.less';

const songsData = [
  { title: '告白气球', price1: 2000, price2: 3000 },
  { title: '手心里的蔷薇', price1: 2000, price2: 3000 },
  { title: '原来如此', price1: 2000, price2: 3000 },
  { title: '我们都一样', price1: 2000, price2: 3000 },
];

export default () => {
  return (
    <View className="page-company">
      <Flex className="company-header" justify="between">
        <Image
          className="company-header__avatar"
          src={require('@/assets/icon/avatar_default.svg')}
        />
        <Typography.Text className="company-header__name" type="light" size="xl" ellipsis>
          杭州一哥传媒有限公司杭州一哥传媒有限公司
        </Typography.Text>
        <Button circle type="light">
          已购词曲
        </Button>
      </Flex>
      <View className="company-body">
        {songsData.map((song, i) => (
          <ManageSongItem
            key={i}
            {...song}
            onClick={() => navigateTo({ url: '/pages/play-detail/index' })}
            actionRender={() => (
              <Button circle size="xs" type="primary">
                查看
              </Button>
            )}
          />
        ))}
      </View>
    </View>
  );
};
