import { useSelector } from 'react-redux';
import Typography from '@/components/Typography';
import { useState, useRef } from 'react';
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
import { getCurrentInstance, switchTab, useShareAppMessage } from '@tarojs/taro';
import { validateFields } from '@/utils/form';
import { View } from '@tarojs/components';
import SongUploader from '@/components/SongUploader';
import CustomPicker from '@/components/CustomPicker';
import ImagePicker from '@/components/image-picker';
import Button from '@/components/Button';
import { CircleIndexList } from '@/components/Chore';
import Icon from '@/components/Icon';
import Radio from '@/components/Radio';
import { songSale } from '@/services/sell';
import { SellSteps } from './components';

import './index.less';

const inviteStepsData = [
  { title: '邀请作者入驻', desc: '上传词曲并给词曲定价' },
  { title: '作者入驻成功', desc: '平台审核通过后为您匹配合作机会' },
  { title: '作者确认词曲归属', desc: '词曲作者签署协议' },
];

const priceData = [
  { name: '1000元', id: 1 },
  { name: '2000元', id: 2 },
  { name: '3000元', id: 3 },
  { name: '4000元', id: 4 },
  { name: '5000元', id: 5 },
  { name: '5000元以上', id: 6 },
];

const fields = {
  composer: {
    label: '作曲人姓名',
    rules: [{ required: true }],
  },
  lyricist_original_price: {
    label: '歌词期望价格',
    rules: [{ required: true }],
  },
  composer_original_price: {
    label: '歌曲期望价格',
    rules: [{ required: true }],
  },
  composer_url: {
    label: '曲连接',
  },
  lyricist_content: {
    label: '歌词',
    rules: [{ required: true }],
  },
};

export default () => {
  const userData = useSelector((state) => state.common.data);
  const [visible, setVisible] = useState(false);
  const radioDisabledRef = useRef({ composer: false, lyricist: false });
  const [payload, set] = useState({
    composer: '', // 作曲人姓名
    is_composer: false, // 是否是作曲人
    composer_original_price: 0, // 曲期望价格
    is_lyricist: false, // 是否作词人
    lyricist: '', // 作词人
    lyricist_original_price: 0, // 词期望价格
    idcard: '', // 身份证
    lyricist_content: '', // 歌词
    composer_content: [], // 曲谱照片
    composer_url: '',
  });

  useShareAppMessage((res) => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: '自定义转发标题',
      path: 'pages/index/index',
    };
  });

  const onSubmit = async () => {
    const hasInvalidField = validateFields(payload, fields);
    if (hasInvalidField) return;
    const { router } = getCurrentInstance();
    const { params } = (router as any).params;
    await songSale({ ...payload, ...JSON.parse(params) });
    setVisible(true);
  };

  const closeModal = () => setVisible(false);

  // 上传的谱曲
  const onSongUploader = (path) => {
    set((v: any) => ({ ...v, composer_url: path }));
  };

  // 上传谱曲照片
  const onImagePickerChange = (filesPath) => {
    set((v: any) => ({ ...v, composer_content: [...v.composer_content, filesPath] }));
  };

  // 删除图片
  const onImgRemove = (index: number) => {
    payload.composer_content.splice(index, 1);
    set((v: any) => ({ ...v, composer_content: [...v.composer_content] }));
  };

  // 我是作曲人点击
  const radioClick = (value, type) => {
    // 勾选“我是作曲人”则将用户实名姓名替换已有书写内容，且不可更改
    // 取消勾选则恢复成默认样式
    const _payload = { ...payload, [`is_${type}`]: value };
    if (value) {
      _payload[type] = userData.real_name;
      radioDisabledRef.current[type] = true;
    } else {
      _payload[type] = '';
      radioDisabledRef.current[type] = false;
    }
    set(_payload);
  };

  return (
    <>
      <SellSteps current={1} />
      <AtForm className="custom-form">
        <Flex justify="between" className="bg-white">
          <AtInput
            name="composer"
            title={fields.composer.label}
            type="text"
            disabled={radioDisabledRef.current.composer}
            value={payload.composer}
            onChange={(value) => set((v: any) => ({ ...v, composer: value }))}
          />
          <Radio
            style={{ flex: '1 0 auto' }}
            className="px24"
            value={payload.is_composer}
            onChange={(v) => radioClick(v, 'composer')}
            label="我是作曲人"
          />
        </Flex>

        <CustomPicker
          title="请选择期望的曲价格（最终以实际成功为准）"
          arrow
          data={priceData}
          mode="selector"
          value={payload.composer_original_price}
          onChange={(value) => set((v: any) => ({ ...v, composer_original_price: value }))}
        />
        <SongUploader
          value={payload.composer_url}
          onChange={onSongUploader}
          webActionUrl="测试地址啦啦"
        />
        <ImagePicker
          onRemove={onImgRemove}
          files={payload.composer_content}
          onChange={onImagePickerChange}
        />
        <View className="h24 bg-light" />
        <Flex justify="between" className="bg-white">
          <AtInput
            name="lyricist"
            title="作词人姓名"
            type="text"
            value={payload.lyricist}
            disabled={radioDisabledRef.current.lyricist}
            onChange={(value) => set((v: any) => ({ ...v, lyricist: value }))}
          />
          <Radio
            style={{ flex: '1 0 auto' }}
            className="px24"
            value={payload.is_lyricist}
            onChange={(v) => radioClick(v, 'lyricist')}
            label="我是作词人"
          />
        </Flex>
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
              name="idcard"
              type="text"
              placeholder="请输入该作者身份证号"
              value={payload.idcard}
              onChange={(value) => set((v: any) => ({ ...v, idcard: value }))}
            />
          </View>
        </View>
        <CustomPicker
          title="请选择期望的词价格（最终以实际成功为准）"
          arrow
          data={priceData}
          mode="selector"
          value={payload.lyricist_original_price}
          onChange={(value) => set((v: any) => ({ ...v, lyricist_original_price: value }))}
        />
        <AtListItem title="上传歌词" />
        <View className="board bg-white px24 pb20">
          <AtTextarea
            className="border--bolder"
            count={false}
            placeholder="上传歌词，请输入80-1000字"
            value={payload.lyricist_content}
            onChange={(value) => set((v: any) => ({ ...v, lyricist_content: value }))}
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
            <Button
              onClick={() => {
                closeModal();
                switchTab({ url: '/pages/song-manage/index' });
              }}
              circle
              className="mt40"
              type="primary"
              inline
            >
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
      <Button openType="share" onClick={() => setVisible(true)} type="primary" circle size="sm">
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
