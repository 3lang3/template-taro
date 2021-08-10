import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IDENTITY } from '@/config/constant';
import AreaPicker from '@/components/CustomPicker/AreaPicker';
import CaptchaBtn from '@/components/CaptchaBtn';
import Button from '@/components/Button';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { eventCenter, navigateTo, reLaunch, showToast, useRouter } from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { AtInput, AtForm, AtCheckbox } from 'taro-ui';
import { singerApply, applyDetail, sendSettleCodeSms } from '@/services/settlein';
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
  stage_name: {
    label: '艺名',
    rules: [
      { required: true },
      {
        pattern: /^[\u4e00-\u9fa5a-z]{1,20}$/i,
        message: '艺名只接收中英文，最多20个字符',
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
  const { data: userData } = useSelector((state) => state.common);
  const { params } = useRouter<SettleInPageParams>();
  // 区域文本值
  const areaRef = useRef<string[]>([]);
  // 
  // 审核状态
  const isAudit = params.status === 'audit';
  // 歌手认证
  const isSinger = +params.identity === IDENTITY.SINGER;
  // 当前身份为词曲作者申请为歌手
  const isAuthToSinger = isSinger && userData.identity === IDENTITY.AUTHOR;

  const [payload, set] = useState({
    real_name: '',
    idcard: '',
    email: '',
    stage_name: '',
    area: undefined,
    mobile: '',
    code: '',
    checked: [],
  });

  // 认证信息详情
  const { data: { data: _detail } = { data: {} }, ...detailReq } = useRequest(applyDetail, {
    manual: true,
  });
  const detail = _detail || {};

  useEffect(() => {
    // 审核状态填入初始值
    const getDetail = async () => {
      showToast({ icon: 'loading', title: '数据获取中...' });
      const { data } = await detailReq.run();
      if (!data) {
        return;
      }

      const { province, city, district, idcard, real_name, email, mobile, stage_name } = data;
      set(
        (v) =>
          ({
            ...v,
            area: [province, city, district],
            mobile,
            stage_name,
            idcard,
            real_name,
            email,
          } as any),
      );
    };
    getDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData.is_authentication) {
      set((v) => ({ ...v, mobile: userData.mobile }));
    }
  }, [userData]);

  // 发送验证码
  const onCodeClick = async () => {
    try {
      showToast({ icon: 'loading', title: '发送中...', mask: true });
      const { msg } = await sendSettleCodeSms({ mobile: userData.mobile });
      showToast({ icon: 'none', title: msg });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const onSubmit = async () => {
    // 词曲申请审核状态
    if (isAudit && !isSinger) return;
    const { checked, code, ...values } = payload;
    const hasInvalidField = validateFields(isAudit ? values : { ...values, code }, fields);
    if (hasInvalidField) return;
    // 协议勾选
    if ((!checked || !checked.length) && !isAudit && !isSinger) {
      showToast({ title: '请勾选平台协议', icon: 'none' });
      return;
    }
    const { area, ...restValues } = values;
    const [province, city, district] = area as unknown as any[];
    const postValues = {
      province,
      city,
      district,
      province_name: areaRef.current[0],
      city_name: areaRef.current[1],
      district_name: areaRef.current[2],
      identity: params.identity,
      code,
      ...restValues,
    };
    if (isSinger) {
      // 歌手入驻 进入下一步
      navigateTo({
        url: `/pages/settlein/next${isAudit ? '?status=audit' : ''}`,
        success: () => {
          // 通过eventCenter向被打开页面传送数据
          // @hack
          eventCenter.once('page:init:settle', () => {
            eventCenter.trigger('page:message:settle-next', { detail, payload: postValues });
          });
        },
      });
      return;
    }
    showToast({ icon: 'loading', title: '请求中...' });
    const { msg } = await singerApply(postValues);
    await showToast({ title: msg, icon: 'success' });
    // 词曲作者 返回个人中心
    // @summry 需要刷新个人中心页面 不能用back只能relaunch
    reLaunch({ url: '/pages/me/index' });
    return;
  };

  function onProtocol(e) {
    e.stopPropagation();
    navigateTo({ url: '/pages/protocol/index' });
  }

  return (
    <>
      {detail.reason && !isAuthToSinger && !isAudit && (
        <Flex className="settlein-reason" align="start">
          <Typography.Text style={{ flex: '1 0 auto' }}>驳回原因：</Typography.Text>
          <Typography.Text type="danger">{detail.reason}</Typography.Text>
        </Flex>
      )}

      <Typography.Text className="settlein-title">
        申请入驻{isSinger ? '歌手' : '词曲作者'}
      </Typography.Text>
      <AtForm className="custom-form settlein-form">
        <AtInput
          name="real_name"
          title="真实姓名"
          type="text"
          disabled={isAudit || isAuthToSinger}
          value={payload.real_name}
          onChange={(value) => set((v: any) => ({ ...v, real_name: value }))}
        />
        <AtInput
          name="idcard"
          title="身份证号码"
          type="idcard"
          disabled={isAudit || isAuthToSinger}
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
        <AtInput
          name="stage_name"
          title="艺名"
          type="text"
          disabled={isAudit}
          value={payload.stage_name}
          onChange={(value) => set((v: any) => ({ ...v, stage_name: value }))}
        />
        <AreaPicker
          value={payload.area}
          disabled={isAudit}
          onChange={(value, titleStr) => {
            set((v: any) => ({ ...v, area: value }));
            areaRef.current = titleStr;
          }}
        />
        <AtInput
          name="mobile"
          title="手机号"
          type="phone"
          disabled
          value={payload.mobile}
          onChange={(value) => set((v: any) => ({ ...v, mobile: value }))}
        />
        {!isAudit && (
          <AtInput
            name="code"
            title="验证码"
            type="number"
            className="captcha-input"
            value={payload.code}
            onChange={(value) => set((v: any) => ({ ...v, code: value }))}
          >
            <CaptchaBtn onNodeClick={onCodeClick} />
          </AtInput>
        )}
        {!isAudit && !isSinger && (
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
                    <Typography.Link onClick={onProtocol.bind(this)} size="sm">
                      《平台协议》
                    </Typography.Link>
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
          type={isAudit && !isSinger ? 'disabled' : 'primary'}
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
