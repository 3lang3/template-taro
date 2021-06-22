import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { chooseMessageFile, showToast } from '@tarojs/taro';
import { Image, Text, View } from '@tarojs/components';
import { useState } from 'react';
import { AtInput, AtForm, AtButton, AtCheckbox, AtModal, AtModalContent } from 'taro-ui';
import { validateFields } from '@/utils/form';
import './index.less';

const fields = {
  name: {
    label: '真实姓名',
    rules: [{ required: true }],
  },
  idcard: {
    label: '身份证号码',
    rules: [{ required: true }],
  },
  email: {
    label: '邮箱',
    rules: [
      { required: true },
      {
        pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/,
        message: '请输入正确的邮箱格式',
      },
    ],
  },
  area: {
    label: '请选择所在地区',
    rules: [
      {
        validator: (value: any) => {
          if (!Array.isArray(value)) return false;
          if (value.length < 2) return false;
          return true;
        },
        message: '请选择所在地区',
      },
    ],
  },
  mobile: {
    label: '手机号',
    rules: [{ required: true }, { pattern: /^\d{11}$/, message: '手机号码格式不正确' }],
  },
  code: {
    label: '验证码',
    rules: [{ required: true }, { pattern: /^\d{5}$/, message: '验证码只接受5位数字' }],
  },
};

export default () => {
  const [visible, setVisible] = useState(false);
  const [payload, set] = useState({
    name: '',
    idcard: '',
    email: '',
    area: undefined,
    mobile: '',
    code: '',
    checked: [],
  });

  const closeModal = () => {
    setVisible(false);
  };
  const onSubmit = () => {
    const { checked, ...params } = payload;
    const hasInvalidField = validateFields(params, fields);
    if (hasInvalidField) return;
    // 协议勾选
    if (!checked.length) {
      showToast({ title: '请勾选平台协议', icon: 'none' });
      return true;
    }
    setVisible(true);
    console.log(params);
  };

  const onUploadClick = async () => {
    // @todo upload file pipe
    const { errMsg, tempFiles } = await chooseMessageFile({ count: 1 });
    if (errMsg !== 'chooseMessageFile:ok') throw Error(errMsg);
    const [file] = tempFiles;
    console.log(file);
  };

  return (
    <>
      <Flex className="settlein-reason" align="start">
        <Typography.Text type="primary">您可选择其中一种方式，以便于我们审核！</Typography.Text>
      </Flex>
      <AtForm className="settlein-form">
        <Typography.Text className="settlein-title">一、填写站外信息</Typography.Text>
        <View className="settlein-list">
          <Flex className="settlein-list__item border" justify="between">
            <Typography.Text className="settlein-list__item-title" type="secondary">
              填写站外信息
            </Typography.Text>
            <Image
              className="settlein-list__item-icon"
              src={require('@/assets/icon/right_thin.svg')}
            />
          </Flex>
          <Flex className="settlein-list__item">
            <Typography.Text className="settlein-list__item-title" type="secondary">
              请输入平台个人链接
            </Typography.Text>
          </Flex>
          <View className="settlein-list__wrapper">
            <Flex className="settlein-list__input settlein-box-border">
              <AtInput
                name="name"
                type="text"
                placeholder="https://www.tapd.cn/38927421/prong/stories11"
                value={payload.name}
                onChange={(value) => set((v: any) => ({ ...v, name: value }))}
              />
            </Flex>
          </View>
        </View>
        <Typography.Text className="settlein-title">二、上传歌曲</Typography.Text>
        <View className="settlein-list">
          <Flex className="settlein-list__item border">
            <Typography.Text className="settlein-list__item-title">
              1、将歌曲上传到任一微信聊天中
            </Typography.Text>
          </Flex>
          <Flex className="settlein-list__item">
            <Typography.Text className="settlein-list__item-title">
              2、小程序-添加歌曲，选择微信聊天中的歌曲，确认上传。由于微信限制上传文件不能超过100M，
              <Text className="text-danger">超过100M的歌曲，请通过PC端上传。</Text>
            </Typography.Text>
          </Flex>
          <View className="settlein-list__wrapper">
            <Flex className="settlein-list__input settlein-box-border">
              <Typography.Text>PC端链接：</Typography.Text>
              <AtInput
                name="name"
                type="text"
                placeholder="https://www.tapd.cn/"
                value={payload.name}
                onChange={(value) => set((v: any) => ({ ...v, name: value }))}
              />
              <Typography.Link>复制</Typography.Link>
            </Flex>
          </View>
          <View onClick={onUploadClick} className="settlein-uploader settlein-box-border">
            <Flex justify="center">
              <Typography.Text type="secondary">添加歌曲</Typography.Text>
              <Image
                className="settlein-uploader__icon"
                src={require('@/assets/icon/play_thin_outline.svg')}
              />
            </Flex>
            <Typography.Text type="secondary" size="sm">
              选择一个上传音频的聊天对话窗口
            </Typography.Text>
          </View>
          <View className="settlein-list__wrapper mt20">
            <Typography.Text type="secondary" size="sm">
              1、歌曲需是本人原创/翻唱作品，且不可借用他人歌曲元素，如经发现平台将追究相关责任。
            </Typography.Text>
            <Typography.Text type="secondary" size="sm">
              2、歌曲必须为mp3、wav、音质{'>'}320KBps,大小{'<'}100M
            </Typography.Text>
          </View>
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

        <AtButton className="settlein-form__submit" onClick={onSubmit} circle type="primary">
          提交
        </AtButton>
      </AtForm>
      <AtModal isOpened={visible} onClose={closeModal} className="settlein-form__modal">
        <AtModalContent>
          <Image
            className="settlein-form__modal-icon"
            src={require('@/assets/icon/success_primary.svg')}
          />
          <Typography.Title level={2}>提交成功，请耐心等待审核结果</Typography.Title>
          <Typography.Text>
            审核结果将在48小时内通过系统消息 通知，如有疑问请联系在线客服
          </Typography.Text>
          <AtButton
            onClick={closeModal}
            circle
            className="settlein-form__modal-btn"
            type="primary"
            size="small"
          >
            知道了
          </AtButton>
        </AtModalContent>
      </AtModal>
    </>
  );
};
