import Typography from '@/components/Typography';
import { useState } from 'react';
import {
  AtInput,
  AtForm,
  AtListItem,
  AtTextarea,
  AtModal,
  AtModalContent,
  AtModalHeader,
  AtModalAction,
} from 'taro-ui';
import Flex from '@/components/Flex';
import { validateFields } from '@/utils/form';
import { View } from '@tarojs/components';
import SongUploader from '@/components/SongUploader';
import CustomPicker from '@/components/CustomPicker';
import Button from '@/components/Button';
import { CircleIndexList } from '@/components/Chore';
import Icon from '@/components/Icon';
import Radio from '@/components/Radio';
import { SellSteps } from './components';

import './index.less';

const inviteStepsData = [
  { title: '邀请作者入驻', desc: '上传词曲并给词曲定价' },
  { title: '作者入驻成功', desc: '平台审核通过后为您匹配合作机会' },
  { title: '作者确认词曲归属', desc: '词曲作者签署协议' },
];

const langData = [
  { name: '1000元', id: 1 },
  { name: '2000元', id: 2 },
  { name: '3000元', id: 3 },
  { name: '4000元', id: 4 },
  { name: '5000元', id: 5 },
  { name: '5000元以上', id: 6 },
];

const fields = {
  name: {
    label: '作曲人姓名',
    rules: [{ required: true }],
  },
  type: {
    label: '流派',
    rules: [{ required: true }],
  },
  lang: {
    label: '语种',
    rules: [{ required: true }],
  },
  label: {
    label: '标签',
    rules: [{ required: true }],
  },
  intro: {
    label: '作品简介',
    rules: [{ required: true }],
  },
  desc: {
    label: '创作说明',
    rules: [{ required: true }],
  },
};

export default () => {
  const [visible, setVisible] = useState(false);

  const [payload, set] = useState({
    name: '',
    check1: false,
    check2: false,
    type: '',
    lang: '',
    label: [3, 6],
    intro: '简单的介绍',
    desc: '简单的说明',
  });

  const onSubmit = () => {
    setVisible(true);
    return;
    const hasInvalidField = validateFields(payload, fields);
    if (hasInvalidField) return;
    console.log(payload);
  };

  const closeModal = () => setVisible(false);

  return (
    <>
      <SellSteps current={1} />
      <AtForm className="custom-form">
        <AtInput
          name="name"
          title={fields.name.label}
          type="text"
          value={payload.name}
          onChange={(value) => set((v: any) => ({ ...v, name: value }))}
        >
          <Radio
            className="px24"
            value={payload.check1}
            onChange={(value) => set((v) => ({ ...v, check1: value }))}
            label="我是作曲人"
          />
        </AtInput>
        <CustomPicker
          title="请选择期望的曲价格（最终以实际成功为准）"
          arrow
          data={langData}
          mode="selector"
          value={payload.lang}
          onChange={(value) => set((v: any) => ({ ...v, lang: value }))}
        />
        <SongUploader />
        <View className="h24 bg-light" />
        <AtInput
          name="name"
          title="作词人姓名"
          type="text"
          value={payload.name}
          onChange={(value) => set((v: any) => ({ ...v, name: value }))}
        >
          <Radio
            className="px24"
            value={payload.check2}
            onChange={(value) => set((v) => ({ ...v, check2: value }))}
            label="我是作词人"
          />
        </AtInput>
        <Flex justify="between" className="cell-item bg-white">
          <Flex style={{ flex: 1 }}>
            <Typography.Text type="secondary">该词或曲作者尚未入驻，作者需认证</Typography.Text>
            <InviteHelpIcon />
          </Flex>
          <InviteButton />
        </Flex>
        <View className="px24 bg-white">
          <View className="input--border">
            <AtInput
              name="name1"
              type="text"
              placeholder="请输入该作者手机尾号后四位"
              value={payload.name}
              onChange={(value) => set((v: any) => ({ ...v, name: value }))}
            />
          </View>
        </View>
        <CustomPicker
          title="请选择期望的曲价格（最终以实际成功为准）"
          arrow
          data={langData}
          mode="selector"
          value={payload.lang}
          onChange={(value) => set((v: any) => ({ ...v, lang: value }))}
        />
        <AtListItem title="上传歌词" />
        <View className="board bg-white px24 pb20">
          <AtTextarea
            className="border--bolder"
            count={false}
            placeholder="上传歌词，请输入80-1000字"
            value=""
            onChange={(value) => set((v: any) => ({ ...v, intro: value }))}
          />
        </View>
        <View className="h24 bg-light" />
        <View className="p-default bg-white">
          <Typography.Text size="sm">1、目前仅支持上传未发行的词曲作品</Typography.Text>
          <Typography.Text size="sm">2、词曲只会上架词曲交易平台进行交易</Typography.Text>
          <Typography.Text size="sm">
            3、上传者本人需拥有词曲的完整权利。禁止盗用他人作品，一经发现娱当家将严厉追究相关法律责任，且永久冻结违规账号
          </Typography.Text>
        </View>
        <View className="p-default">
          <Button className="mt50 mb50" onClick={onSubmit} circle type="primary" size="lg">
            提交
          </Button>
        </View>
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

//
function InviteHelpIcon() {
  const [visible, setVisible] = useState(false);
  const onContinue = () => {
    setVisible(false);
  };
  return (
    <>
      <Icon onClick={() => setVisible(true)} icon="icon-help-filling ml10" className="text-blue" />
      <AtModal isOpened={visible} onClose={() => setVisible(false)}>
        <AtModalHeader>邀请作者认证</AtModalHeader>
        <AtModalContent>
          <CircleIndexList data={inviteStepsData} />
          <Button onClick={onContinue} className="mt30" type="primary" circle>
            继续
          </Button>
        </AtModalContent>
      </AtModal>
    </>
  );
}

function InviteButton() {
  const [visible, setVisible] = useState(false);
  const onConfirm = () => {
    setVisible(false);
  };
  return (
    <>
      <Button onClick={() => setVisible(true)} type="primary" circle size="sm">
        邀请作者
      </Button>
      <AtModal isOpened={visible} onClose={() => setVisible(false)}>
        <AtModalHeader>确认认领该词或曲为您原创</AtModalHeader>
        <AtModalAction>
          <Flex className="p-default" justify="between">
            <Button onClick={() => setVisible(false)} outline circle>
              取消
            </Button>
            <Button onClick={onConfirm} type="primary" circle>
              确认
            </Button>
          </Flex>
        </AtModalAction>
      </AtModal>
    </>
  );
}
