import CaptchaBtn from '@/components/CaptchaBtn';
import { showToast } from '@tarojs/taro';
import { useState } from 'react';
import { AtInput, AtForm } from 'taro-ui';
import Button from '@/components/Button';
import { View } from '@tarojs/components';
import { validateFields } from '@/utils/form';
import './index.less';

const fields = {
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
  const [payload, set] = useState({
    mobile: '',
    code: '',
  });

  const onSubmit = () => {
    const hasInvalidField = validateFields(payload, fields);
    if (hasInvalidField) return;
    // 协议勾选
    console.log(payload);
    showToast({ title: '提交成功!', icon: 'success' });
  };

  return (
    <>
      <AtForm className="custom-form">
        <AtInput
          name="mobile"
          title="手机号"
          type="phone"
          value={payload.mobile}
          onChange={(value) => set((v: any) => ({ ...v, mobile: value }))}
        />
        <AtInput
          name="code"
          title="验证码"
          type="number"
          className="captcha-input"
          value={payload.code}
          onChange={(value) => set((v: any) => ({ ...v, code: value }))}
        >
          <CaptchaBtn num={3} />
        </AtInput>
        <View className="p-default">
          <Button className="mt50" onClick={onSubmit} circle type="primary" size="lg">
            绑定新手机号
          </Button>
        </View>
      </AtForm>
    </>
  );
};
