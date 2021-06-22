import AreaPicker from '@/components/AreaPicker';
import CaptchaBtn from '@/components/CaptchaBtn';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { showToast } from '@tarojs/taro';
import { useState } from 'react';
import { AtInput, AtForm, AtButton, AtCheckbox } from 'taro-ui';
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
  const [payload, set] = useState({
    name: '',
    idcard: '',
    email: '',
    area: undefined,
    mobile: '',
    code: '',
    checked: [],
  });

  const onSubmit = () => {
    const { checked, ...params } = payload;
    const hasInvalidField = validateFields(params, fields);
    if (hasInvalidField) return;
    // 协议勾选
    if (!checked.length) {
      showToast({ title: '请勾选平台协议', icon: 'none' });
      return true;
    }
    console.log(params);
  };

  return (
    <>
      <Flex className="settlein-reason" align="start">
        <Typography.Text style={{ flex: '1 0 auto' }}>驳回原因：</Typography.Text>
        <Typography.Text type="danger">该身份已被占用，如有疑问请联系客服解决！</Typography.Text>
      </Flex>

      <Typography.Text className="settlein-title">申请入驻词曲作者</Typography.Text>
      <AtForm className="custom-form settlein-form">
        <AtInput
          name="name"
          title="真实姓名"
          type="text"
          value={payload.name}
          onChange={(value) => set((v: any) => ({ ...v, name: value }))}
        />
        <AtInput
          name="idcard"
          title="身份证号码"
          type="idcard"
          value={payload.idcard}
          onChange={(value) => set((v: any) => ({ ...v, idcard: value }))}
        />
        <AtInput
          name="email"
          title="邮箱"
          type="text"
          value={payload.email}
          onChange={(value) => set((v: any) => ({ ...v, email: value }))}
        />
        <AreaPicker
          value={payload.area}
          onChange={(value) => set((v: any) => ({ ...v, area: value }))}
        />
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
        <AtButton className="settlein-form__submit settlein-form__submit--fixed" onClick={onSubmit} circle type="primary">
          提交审核
        </AtButton>
      </AtForm>
    </>
  );
};
