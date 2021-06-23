import cls from 'classnames';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { useState } from 'react';
import { AtInput, AtForm, AtListItem, AtTextarea, AtModal, AtModalContent } from 'taro-ui';
import { validateFields } from '@/utils/form';
import { View } from '@tarojs/components';
import { setClipboardData } from '@tarojs/taro';
import Button from '@/components/Button';
import CustomPicker from '@/components/CustomPicker';
import './index.less';

const simpleText =
  '创作目的：提高自己知名度，售卖版权取得收益 创作完成时间：2016年5月20日 创作完成地点：北京市 作品独创性：使用了民风和电子结合的曲风 创作灵感：讲述男女分手后，单方面思念以前一起做过的任何事情，当听到他们喜欢的歌曲的时候，身边却只有自己了，虽然分开那么久却还是不能习惯';

const typeData = [
  { name: '流行', id: 2 },
  { name: '电子', id: 3 },
];
const langData = [
  { name: '中文', id: 1 },
  { name: '粤语', id: 6 },
  { name: '英语', id: 9 },
];

const sellStepData = [{ text: '作品信息' }, { text: '词曲材料' }];

const SellSteps = ({ current = 0 }) => {
  return (
    <Flex className="sell-steps" justify="between">
      {sellStepData.map((step, i) => (
        <Flex
          key={i}
          justify="center"
          direction="column"
          className={cls('sell-steps__item', {
            'sell-steps__item--active': current === i,
          })}
        >
          <Flex justify="center" className="sell-steps__item-index">
            1
          </Flex>
          <View className="sell-steps__item-text">{step.text}</View>
        </Flex>
      ))}
    </Flex>
  );
};

const fields = {
  name: {
    label: '作品名',
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
    name: '风往北吹',
    type: 2,
    lang: 1,
    label: [3, 6],
    intro: '简单的介绍',
    desc: '简单的说明',
  });

  const onSubmit = () => {
    const hasInvalidField = validateFields(payload, fields);
    if (hasInvalidField) return;
    console.log(payload);
  };

  const closeModal = () => setVisible(false);

  const onModalConfirm = async () => {
    await setClipboardData({ data: simpleText });
    closeModal();
  };

  return (
    <>
      <SellSteps />
      <AtForm className="custom-form">
        <AtInput
          name="name"
          title={fields.name.label}
          type="text"
          value={payload.name}
          onChange={(value) => set((v: any) => ({ ...v, name: value }))}
        />
        <CustomPicker
          title={fields.type.label}
          arrow
          data={typeData}
          mode="selector"
          value={payload.type}
          onChange={(value) => set((v: any) => ({ ...v, type: value }))}
        />
        <CustomPicker
          title={fields.lang.label}
          arrow
          data={langData}
          mode="selector"
          value={payload.lang}
          onChange={(value) => set((v: any) => ({ ...v, lang: value }))}
        />
        <CustomPicker
          title={`${fields.label.label}(每种最多2个)`}
          arrow
          data={[typeData, langData]}
          mode="multiSelector"
          value={payload.label}
          onChange={(value) => set((v: any) => ({ ...v, label: value }))}
        />
        <AtListItem title={`${fields.intro.label}(选填)`} />
        <View className="board bg-white">
          <AtTextarea
            count={false}
            placeholder={fields.intro.label}
            value={payload.intro}
            onChange={(value) => set((v: any) => ({ ...v, intro: value }))}
          />
        </View>
        <AtListItem title={`${fields.desc.label}(选填)`} />
        <View className="board bg-white">
          <AtTextarea
            count={false}
            placeholder={fields.desc.label}
            value={payload.desc}
            onChange={(value) => set((v: any) => ({ ...v, desc: value }))}
          />
        </View>
        <View onClick={() => setVisible(true)} className="p-default bg-white">
          <Typography.Link>样例参考</Typography.Link>
        </View>
        <View className="p-default">
          <Button className="mt50" onClick={onSubmit} circle type="primary" size="lg">
            下一步
          </Button>
        </View>
      </AtForm>
      <AtModal isOpened={visible} onClose={closeModal} className="bought-modal">
        <AtModalContent>
          <Typography.Title center level={3}>
            样例参考
          </Typography.Title>
          <View className="board bg-white">
            <AtTextarea value={simpleText} count={false} onChange={() => false} />
          </View>
          <Button onClick={onModalConfirm} className="mt30" type="primary" circle>
            复制到输入框
          </Button>
        </AtModalContent>
      </AtModal>
    </>
  );
};
