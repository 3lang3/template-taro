import AreaPicker from '@/components/CustomPicker/AreaPicker';
import CaptchaBtn from '@/components/CaptchaBtn';
import Button from '@/components/Button';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { eventCenter, navigateBack, navigateTo, showToast, useRouter } from '@tarojs/taro';
import { useEffect, useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { AtInput, AtForm, AtCheckbox } from 'taro-ui';
import { singerApply, getCertificationInfo, applyDetail } from '@/services/settlein';
import { validateFields } from '@/utils/form';
import './index.less';

const fields = {
  real_name: {
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

type SettleInPageParams = {
  /**
   * 认证身份
   *  - 1 作曲作者
   *  - 2 歌手
   */
  identity: '1' | '2';
  /**
   * 审核中
   */
  status: 'audit';
};

export default () => {
  const { params } = useRouter<SettleInPageParams>();
  console.log(params);
  // 是否已实名
  const hasCert = useRef(false);
  // 审核状态
  const isAudit = params.status === 'audit';
  // 歌手认证
  const isSinger = params.identity === '2';

  const [payload, set] = useState({
    real_name: '12312',
    idcard: '33313131',
    email: '123112@qq.com',
    area: undefined,
    mobile: '13333333333',
    code: '12333',
    checked: [true],
  });

  // 认证信息详情
  const detailReq = useRequest(applyDetail, { manual: true });
  // 实名信息
  const certificaReq = useRequest(getCertificationInfo, { manual: true });

  useEffect(() => {
    const getCertifica = async () => {
      const { data } = await certificaReq.run();
      hasCert.current = true;
      set(data);
    };
    const getDetail = async () => {
      showToast({ icon: 'loading', title: '数据获取中...' });
      const { data } = await detailReq.run();
      hasCert.current = true;
      set(data);
    };
    if (isAudit) {
      getDetail();
      return;
    }
    getCertifica();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async () => {
    const { checked, code, ...values } = payload;
    // 已实名 则不校验验证码
    const hasInvalidField = validateFields(hasCert.current ? values : { code, ...values }, fields);
    if (hasInvalidField) return;
    // 协议勾选
    if (!checked.length && !isAudit) {
      showToast({ title: '请勾选平台协议', icon: 'none' });
      return;
    }
    if (isSinger) {
      // 歌手入驻 进入下一步
      navigateTo({
        url: `/pages/settlein/next${isAudit ? '?status=audit' : ''}`,
        success: () => {
          // 通过eventCenter向被打开页面传送数据
          // @hack
          eventCenter.once('page:init:settle', () => {
            eventCenter.trigger('page:message:settle-next', { data: 'test' });
          });
        },
      });
      return;
    }
    showToast({ icon: 'loading', title: '请求中...' });
    const { msg } = await singerApply({ ...values, identity: params.identity });
    await showToast({ title: msg, icon: 'success' });
    // 词曲作者 返回个人中心
    navigateBack();
    return;
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
          name="real_name"
          title="真实姓名"
          type="text"
          disabled={hasCert.current || isAudit}
          value={payload.real_name}
          onChange={(value) => set((v: any) => ({ ...v, real_name: value }))}
        />
        <AtInput
          name="idcard"
          title="身份证号码"
          type="idcard"
          disabled={hasCert.current || isAudit}
          value={payload.idcard}
          onChange={(value) => set((v: any) => ({ ...v, idcard: value }))}
        />
        <AtInput
          name="email"
          title="邮箱"
          type="text"
          value={payload.email}
          disabled={isAudit}
          onChange={(value) => set((v: any) => ({ ...v, email: value }))}
        />
        <AreaPicker
          value={payload.area}
          disabled={isAudit}
          onChange={(value) => set((v: any) => ({ ...v, area: value }))}
        />
        <AtInput
          name="mobile"
          title="手机号"
          type="phone"
          disabled={hasCert.current || isAudit}
          value={payload.mobile}
          onChange={(value) => set((v: any) => ({ ...v, mobile: value }))}
        />
        {!(hasCert.current || isAudit) && (
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
        )}
        {!isAudit && (
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
        )}

        <Button
          className="settlein-form__submit settlein-form__submit--fixed"
          onClick={onSubmit}
          circle
          type={isAudit ? 'disabled' : 'primary'}
          size="lg"
          disabled={isAudit && !isSinger}
        >
          {(() => {
            if (isSinger) return '下一步';
            if (isAudit) return '审核中';
            return '提交审核';
          })()}
        </Button>
      </AtForm>
    </>
  );
};
