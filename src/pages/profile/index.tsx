import { useState } from 'react';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { Image, View } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { AtList, AtListItem, AtIcon } from 'taro-ui';
import { getMusicsongmakeList, Node, editInfo } from '@/services/profile';
import AreaPicker from '@/components/CustomPicker/AreaPicker';
import { useRequest } from 'ahooks';
import { FullPageLoader, FullPageError } from '@/components/Chore';
import './index.less';

export default () => {
  const [memberInfo, setMemberInfo] = useState<Node>({} as any);
  const { loading, error, refresh } = useRequest(getMusicsongmakeList, {
    onSuccess: ({ data, type, msg }) => {
      if (type === 1) throw Error(msg);
      setMemberInfo(data);
    },
  });
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  return (
    <View className="page-profile">
      <Flex className="profile-header" justify="between">
        <Image className="profile-header__avatar" src={memberInfo.avatar} />
        <Typography.Title className="profile-header__name" type="light" level={1} ellipsis>
          Hi音乐人
        </Typography.Title>
      </Flex>
      <AtList className="custom-list custom-form">
        <AtListItem title={memberInfo.real_name} disabled />
        <AtListItem title={memberInfo.idcard} disabled />
        <AtListItem
          title={memberInfo.email}
          onClick={() => navigateTo({ url: `/pages/profile/email?email=${memberInfo.email}` })}
        />
        <View className="custom-form-picker">
          <AreaPicker
            value={[memberInfo.province, memberInfo.city, memberInfo.district]}
            onChange={(value) => {
              editInfo(value);
            }}
          />
          <AtIcon className="item-extra__icon" value="chevron-right" />
        </View>
        <AtListItem
          title={memberInfo.mobile}
          onClick={() => navigateTo({ url: `/pages/profile/mobile?mobile=${memberInfo.mobile}` })}
        />
      </AtList>
    </View>
  );
};
