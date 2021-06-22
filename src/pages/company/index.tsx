import Button from '@/components/Button';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { Image, View } from '@tarojs/components';
import './index.less';

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
        <Flex className="company-body__item">
          <View className="company-body__item-content">
            <Typography.Text className="mb20" size="lg">
              告白气球
            </Typography.Text>
            <Flex>
              <Typography.Text className="mr20" type="secondary">
                曲2000元
              </Typography.Text>
              <Typography.Text type="secondary">词3000元</Typography.Text>
            </Flex>
          </View>
          <Button circle size="xs" type="primary" outline>
            查看
          </Button>
        </Flex>
        <Flex className="company-body__item">
          <View className="company-body__item-content">
            <Typography.Text className="mb20" size="lg">
              手心里的蔷薇
            </Typography.Text>
            <Flex>
              <Typography.Text className="mr20" type="secondary">
                曲2000元
              </Typography.Text>
              <Typography.Text type="secondary">词3000元</Typography.Text>
            </Flex>
          </View>
          <Button circle size="xs" type="primary">
            查看
          </Button>
        </Flex>
      </View>
    </View>
  );
};
