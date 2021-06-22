import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { Image, View } from '@tarojs/components';
import './index.less';

export default () => {
  return (
    <View className="page-profile">
      <Flex className="profile-header" justify="between">
        <Image
          className="profile-header__avatar"
          src={require('@/assets/icon/avatar_default.svg')}
        />
        <Typography.Title className="profile-header__name" type="light" level={1} ellipsis>
          Hi音乐人
        </Typography.Title>
      </Flex>
    </View>
  );
};
