import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { eventCenter, hideToast, showToast, useRouter } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { AtInput, AtForm, AtCheckbox, AtModal, AtModalContent } from 'taro-ui';
import SongUploader from '@/components/SongUploader';
import CustomPicker from '@/components/CustomPicker';
import { validateFields } from '@/utils/form';
import { singerApply } from '@/services/settlein';
import './index.less';

const siteData = [
  { name: 'QQ音乐', id: 1 },
  { name: '酷狗音乐', id: 2 },
  { name: '网易云音乐', id: 3 },
  { name: '5sing', id: 4 },
  { name: 'B站', id: 5 },
  { name: '微博', id: 6 },
  { name: '其他', id: 7 },
];

const fields = {
  website_type: {
    label: '站外信息',
    rules: [{ required: true }],
  },
  song_url: {
    label: '真实姓名',
    rules: [{ required: true }],
  },
};

type SettleNextPageParams = {
  status: 'audit';
};

export default () => {
  const router: { params: SettleNextPageParams } = useRouter();
  const { params } = router;
  console.log(router);
  // 审核状态
  const isAudit = params.status === 'audit';

  const [visible, setVisible] = useState(false);
  const [payload, set] = useState({
    song_url: '',
    website_type: undefined,
    idcard: '',
    email: '',
    area: undefined,
    mobile: '',
    code: '',
    checked: [],
  });

  useEffect(() => {
    // @hack
    if (isAudit) {
      eventCenter.once('page:message:settle-next', (response) => console.log(response));
      eventCenter.trigger('page:init:settle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => {
    setVisible(false);
  };
  const onSubmit = async () => {
    const { checked, ...values } = payload;
    const hasInvalidField = validateFields(values, fields);
    if (hasInvalidField) return;
    // 协议勾选
    if (!checked.length) {
      showToast({ title: '请勾选平台协议', icon: 'none' });
      return true;
    }

    showToast({ icon: 'loading', title: '请求中...' });
    await singerApply({ ...values, identity: 2 });
    hideToast();
    setVisible(true);
  };

  const onSongUpload = async (file) => {
    console.log(file);
  };

  return (
    <>
      <Flex className="settlein-reason" align="start">
        <Typography.Text type="primary">您可选择其中一种方式，以便于我们审核！</Typography.Text>
      </Flex>
      <AtForm className="settlein-form custom-form">
        <Typography.Text className="settlein-title">一、填写站外信息</Typography.Text>
        <View className="settlein-list">
          <CustomPicker
            title="填写站外信息"
            arrow
            data={siteData}
            mode="selector"
            value={payload.website_type}
            onChange={(value) => set((v: any) => ({ ...v, website_type: value }))}
          />
          <Flex className="settlein-list__item">
            <Typography.Text className="settlein-list__item-title" type="secondary">
              请输入平台个人链接
            </Typography.Text>
          </Flex>
          <View className="settlein-list__wrapper">
            <Flex className="input--border">
              <AtInput
                name="song_url"
                type="text"
                placeholder="https://www.tapd.cn/38927421/prong/stories11"
                value={payload.song_url}
                onChange={(value) => set((v: any) => ({ ...v, song_url: value }))}
              />
            </Flex>
          </View>
        </View>
        <Typography.Text className="settlein-title">二、上传歌曲</Typography.Text>
        <SongUploader webActionUrl="https://www.tapd.cn/" onChange={onSongUpload} />
        <View className="p-default bg-white">
          <Typography.Text type="secondary" size="sm">
            1、歌曲需是本人原创/翻唱作品，且不可借用他人歌曲元素，如经发现平台将追究相关责任。
          </Typography.Text>
          <Typography.Text type="secondary" size="sm">
            2、歌曲必须为mp3、wav、音质{'>'}320KBps,大小{'<'}100M
          </Typography.Text>
        </View>
        <View className="custom-checkbox">
          <AtCheckbox
            onChange={(value) => set((v: any) => ({ ...v, checked: value }))}
            selectedList={payload.checked}
            options={[
              {
                value: 'checked',
                label: (
                  <Flex>
                    <Typography.Text size="sm" type="secondary">
                      我已阅读
                    </Typography.Text>
                    <Typography.Link size="sm">《平台协议》</Typography.Link>
                  </Flex>
                ) as unknown as string,
              },
            ]}
          />
        </View>

        <Button
          size="lg"
          className="settlein-form__submit"
          onClick={onSubmit}
          circle
          type="primary"
        >
          提交
        </Button>
      </AtForm>
      <AtModal isOpened={visible} onClose={closeModal}>
        <AtModalContent>
          <View className="mt60 mb50 text-center">
            <Icon icon="icon-popup_icon_chenggong" size={64} color="#6236ff" />
          </View>
          <Typography.Title center level={2}>
            提交成功，请耐心等待审核结果
          </Typography.Title>
          <Typography.Text center>
            审核结果将在48小时内通过系统消息 通知，如有疑问请联系在线客服
          </Typography.Text>
          <View className="text-center">
            <Button onClick={closeModal} circle className="mt40" type="primary" inline>
              知道了
            </Button>
          </View>
        </AtModalContent>
      </AtModal>
    </>
  );
};
