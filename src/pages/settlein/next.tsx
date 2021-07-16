import { useSelector } from 'react-redux';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { eventCenter, hideToast, reLaunch, showToast, useRouter } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { AtInput, AtForm, AtCheckbox, AtModal, AtModalContent } from 'taro-ui';
import SongUploader from '@/components/SongUploader';
import CustomPicker from '@/components/CustomPicker';
import { singerApply } from '@/services/settlein';
import './index.less';

const MusicSitePicker = (props) => {
  const musicSiteList = useSelector((state) => state.common.musicSiteList);
  return <CustomPicker data={musicSiteList} valueKey="website_type" {...props} />;
};

type SettleNextPageParams = {
  status?: 'audit';
};

export default () => {
  const { params } = useRouter<SettleNextPageParams>();
  // 上一步提交信息
  const prevStepPayloadRef = useRef<any>();
  // 审核状态
  const isAudit = params.status === 'audit';

  const [visible, setVisible] = useState(false);
  const [payload, set] = useState({
    song_url: '',
    website_type: undefined,
    website_url: '',
    checked: [],
  });

  useEffect(() => {
    // @hack 获取上一个页面传递的数据
    eventCenter.once('page:message:settle-next', (response) => {
      prevStepPayloadRef.current = response.payload;
      if (isAudit) {
        set((v) => ({
          ...v,
          song_url: response.detail.song_url,
          website_url: response.detail.website_url,
          website_type: response.detail.website_type,
        }));
      }
    });
    eventCenter.trigger('page:init:settle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => {
    setVisible(false);
  };
  const onSubmit = async () => {
    if (isAudit) return;
    const { checked, ...values } = payload;
    // 表单校验
    try {
      if (values.website_type && !values.website_url) {
        throw new Error('请输入平台个人链接');
      }
      if (values.website_url && !values.website_type) {
        throw new Error('请选择站外信息');
      }

      if (!values.song_url && !values.website_url) {
        throw new Error('平台个人链接、上传音频聊天记录至少填写一项');
      }
      // 协议勾选
      if (!checked.length) {
        throw new Error('请勾选平台协议');
      }
    } catch (error) {
      showToast({ title: error.message, icon: 'none' });
      return;
    }

    showToast({ icon: 'loading', title: '请求中...' });
    await singerApply({ ...values, ...prevStepPayloadRef.current, identity: 2 });
    hideToast();
    setVisible(true);
  };

  const onSongUpload = async (value) => {
    set((v) => ({ ...v, song_url: value }));
  };

  const onSubmitAfter = () => {
    closeModal();
    reLaunch({ url: '/pages/me/index' });
  };
  return (
    <>
      <Flex className="settlein-reason" align="start">
        <Typography.Text type="primary">您可选择其中一种方式，以便于我们审核！</Typography.Text>
      </Flex>
      <AtForm className="settlein-form custom-form">
        <Typography.Text className="settlein-title">一、填写站外信息</Typography.Text>
        <View className="settlein-list">
          <MusicSitePicker
            arrow
            title="填写站外信息"
            mode="selector"
            disabled={isAudit}
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
                disabled={isAudit}
                name="website_url"
                type="text"
                placeholder="请输入平台个人链接"
                value={payload.website_url}
                onChange={(value) => set((v: any) => ({ ...v, website_url: value }))}
              />
            </Flex>
          </View>
        </View>
        <Typography.Text className="settlein-title">二、上传歌曲</Typography.Text>
        <SongUploader disabled={isAudit} value={payload.song_url} onChange={onSongUpload} />
        <View className="p-default bg-white">
          <Typography.Text type="secondary" size="sm">
            1、歌曲需是本人原创/翻唱作品，且不可借用他人歌曲元素，如经发现平台将追究相关责任。
          </Typography.Text>
          <Typography.Text type="secondary" size="sm">
            2、歌曲必须为mp3、wav、音质{'>'}320KBps,大小{'<'}100M
          </Typography.Text>
        </View>
        {!isAudit && (
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
        )}

        <Button
          size="lg"
          className="settlein-form__submit"
          onClick={onSubmit}
          circle
          disabled={isAudit}
          type={isAudit ? 'disabled' : 'primary'}
        >
          {isAudit ? '审核中' : '提交'}
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
            <Button onClick={onSubmitAfter} circle className="mt40" type="primary" inline>
              知道了
            </Button>
          </View>
        </AtModalContent>
      </AtModal>
    </>
  );
};
