import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { Image, View } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { AtList, AtListItem } from 'taro-ui';
import { getMusicsongmakeList } from '@/services/profile';
import { useRequest } from 'ahooks';
import { FullPageLoader, FullPageError } from '@/components/Chore';
import './index.less';

export default () => {
  const { loading, error, refresh, run } = useRequest(getMusicsongmakeList, {
    onSuccess: (res) => {
      if (res.type === 1) throw Error(res.msg);
      console.log(res);
    },
  });
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
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
      <AtList className="custom-list">
        <AtListItem title="张三" disabled />
        <AtListItem title="32323****44884" disabled />
        <AtListItem
          title="75****2@163.com"
          onClick={() => navigateTo({ url: '/pages/profile/email' })}
        />
        <AtListItem title="浙江省 杭州市 西湖区" arrow="right" />
        <AtListItem
          title="134****4332"
          onClick={() => navigateTo({ url: '/pages/profile/mobile' })}
        />
      </AtList>
    </View>
  );
};
