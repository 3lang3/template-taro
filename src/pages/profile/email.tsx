import CaptchaBtn from '@/components/CaptchaBtn';
import { showToast, navigateBack, getCurrentInstance } from '@tarojs/taro';
import { useState } from 'react';
import { AtInput, AtForm } from 'taro-ui';
import {
  sendVerifyOldEmailCode,
  sendBindNewEmailCode,
  verifyOldEmail,
  bindNewEmail,
} from '@/services/email';
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
  const { router } = getCurrentInstance();
  const [payload, set] = useState({
    email: (router as any).params.email,
    code: '',
  });
  const [step, setStep] = useState<number>(1);

  const onSubmit = () => {
    const hasInvalidField = validateFields(
      payload,
      step === 1
        ? {
            email: { label: '邮箱', rules: [] },
            code: fields.code,
          }
        : fields,
    );
    if (hasInvalidField) return;
    // 协议勾选
    console.log(payload);
    if (step === 1) {
      verifyOldEmail(payload).then(({ type, msg }) => {
        if (type === 1) throw Error(msg);
        setStep(2);
        set({ email: '', code: '' });
      });
    } else {
      bindNewEmail(payload).then(({ type, msg }) => {
        if (type === 1) throw Error(msg);
        navigateBack();
        showToast({ title: '修改成功!', icon: 'success' });
      });
    }
  };

  const onCode = () => {
    if (step === 1) {
      sendVerifyOldEmailCode();
    } else {
      sendBindNewEmailCode(payload);
    }
  };

  return (
    <>
      <AtForm className="custom-form">
        <AtInput
          className="custom-form-left"
          name="email"
          placeholder="请输入邮箱"
          disabled={step === 1}
          value={payload.email}
          onChange={(value) => set((v: any) => ({ ...v, email: value }))}
        />
        <AtInput
          name="code"
          placeholder="请输入验证码"
          type="number"
          className="captcha-input custom-form-left"
          value={payload.code}
          onChange={(value) => set((v: any) => ({ ...v, code: value }))}
        >
          <CaptchaBtn onNodeClick={onCode} />
        </AtInput>
        <View className="p-default">
          <Button className="mt50" onClick={onSubmit} circle type="primary" size="lg">
            {step === 1 ? '下一步' : '绑定新邮箱'}
          </Button>
        </View>
      </AtForm>
    </>
  );
};
