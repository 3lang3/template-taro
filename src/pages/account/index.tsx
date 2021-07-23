import { useSelector } from 'react-redux';
import Button from '@/components/Button';
import Flex from '@/components/Flex';
import Image from '@/components/Image';
import Typography from '@/components/Typography';
import { MP_E_SIGN_APPID } from '@/config/constant';
import { getSingerBankInfo } from '@/services/common';
import { FullPageError, FullPageLoader } from '@/components/Chore';
import { createSchemeUrl, describeFlowBriefs } from '@/services/song-manage';
import { View } from '@tarojs/components';
import {
  showToast,
  hideLoading,
  navigateToMiniProgram,
  showLoading,
  useRouter,
  useDidShow,
  showModal,
  navigateBack,
  hideToast,
} from '@tarojs/taro';
import ContentPop from '@/components/ContentPop';
import { useRequest } from 'ahooks';
import { useRef, useState } from 'react';
import { AtForm, AtInput } from 'taro-ui';
import { IDCardUploader, BankPicker } from './components';
import './index.less';

export default () => {
  const { params } = useRouter<{ ids: string }>();
  const userData = useSelector((state) => state.common.data);
  const [payload, set] = useState<any>({
    id_card_image: undefined,
    bank_name: undefined,
    bank_card: '',
    bank_branch_name: '',
  });

  const {
    data: { data: detail } = { data: {} },
    loading,
    error,
    refresh,
  } = useRequest(getSingerBankInfo, {
    defaultParams: [{ ids: params.ids }],
    onSuccess: ({ data }) => {
      // 写入默认值
      set((v) => ({
        ...v,
        bank_name: data.bank_name || undefined,
        bank_card: data.bank_card,
        bank_branch_name: data.bank_branch_name,
      }));
    },
  });
  const resultReq = useRequest(describeFlowBriefs, {
    manual: true,
    onSuccess: ({ data, type }) => {
      if (type === 1) return;
      showModal({
        title: '签约结果',
        content: `${+data.status ? '签署成功' : '签署失败'}`,
        success: ({ confirm }) => {
          if (confirm) navigateBack();
        },
      });
    },
  });

  const firstRenderRef = useRef(false);
  const schemaDataRef = useRef<any>({});

  useDidShow(() => {
    if (!firstRenderRef.current) {
      firstRenderRef.current = true;
      return;
    }
    // 获取签署结果
    const getResult = async () => {
      showToast({ icon: 'loading', title: '签约结果查询中' });
      await resultReq.run({ ids: params.ids, flow_id: schemaDataRef.current.flow_id });
      hideToast();
    };
    getResult();
  });

  // 签约
  const onSignClick = async () => {
    if (+detail.is_upload && !payload.id_card_image)
      return showToast({ icon: 'none', title: '请上传身份证照片' });
    if (!payload.bank_name) return showToast({ icon: 'none', title: '请输入银行名称' });
    if (!payload.bank_card) return showToast({ icon: 'none', title: '请输银行卡号' });
    if (!payload.bank_branch_name) return showToast({ icon: 'none', title: '请输开户银行支行' });
    try {
      showLoading({ title: '请稍后...' });
      const { data } = await createSchemeUrl({ ids: params.ids, ...payload });
      schemaDataRef.current = data;
      hideLoading();
      navigateToMiniProgram({
        appId: MP_E_SIGN_APPID,
        path: `pages/guide?from=miniprogram&id=${data.flow_id}`,
        extraData: { name: userData.real_name, phone: userData.mobile },
        success: () => {},
      });
    } catch (e) {
      hideLoading();
    }
  };

  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;

  return (
    <>
      {+detail.is_upload === 1 && (
        <>
          <View className="bg-white mb20 p-default">
            <Typography.Text type="danger">1.该身份证信息仅用于词曲交易环节使用</Typography.Text>
            <Typography.Text type="danger">
              2.请上传实名该账户实名姓名的身份证正反面
            </Typography.Text>
          </View>

          <Flex className="bg-white p-default" align="start">
            <IDCardUploader
              value={payload.id_card_image}
              onChange={(value) => set((v) => ({ ...v, id_card_image: value }))}
            />
            <ContentPop
              title="例图查看"
              footer={false}
              content={
                <View className="idcard-simple">
                  <Image className="idcard-simple__img" src="idcard-uploader__simple" />
                </View>
              }
            >
              <Typography.Link className="ml20">例图查看</Typography.Link>
            </ContentPop>
          </Flex>
        </>
      )}
      <AtForm className="custom-form settlein-form">
        <View className="bg-white p-default">
          <Typography.Text type="primary">{detail.show_price}</Typography.Text>
        </View>
        <BankPicker
          value={payload.bank_name}
          onChange={(value) => set((v) => ({ ...v, bank_name: value }))}
        />
        <AtInput
          name="bank_branch_name"
          title="支行名称"
          placeholder="请输入支行名称"
          type="text"
          value={payload.bank_branch_name}
          onChange={(value) => set((v: any) => ({ ...v, bank_branch_name: value }))}
        />
        <AtInput
          name="bank_card"
          title="银行卡号"
          placeholder="请输入银行卡号"
          type="text"
          value={payload.bank_card}
          onChange={(value) => set((v: any) => ({ ...v, bank_card: value }))}
        />
      </AtForm>
      <View className="p-lg mt50">
        <Button onClick={onSignClick} size="lg" type="primary" circle>
          签署协议
        </Button>
      </View>
      <Typography.Text center>即将前往“腾讯电子签”签署协议</Typography.Text>
    </>
  );
};
