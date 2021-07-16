// 仅开发用 实际已经在me页面中渲染了

import Button from '@/components/Button';
import CustomPicker from '@/components/CustomPicker';
import Flex from '@/components/Flex';
import Icon from '@/components/Icon';
import Image from '@/components/Image';
import Typography from '@/components/Typography';
import { BaseUploadProps } from '@/components/Uploader/PropsType';
import { UploaderWrapper } from '@/components/Uploader/wrapper';
import { View } from '@tarojs/components';
import { useState } from 'react';
import { AtForm, AtInput } from 'taro-ui';
import './index.less';

const IDCardUploader = (props: BaseUploadProps) => {
  return (
    <UploaderWrapper type="image" {...props}>
      {({ filePath, remove, upload }) => {
        return (
          <View className="idcard-uploader">
            {filePath ? (
              <Image
                mode="aspectFit"
                onClick={remove}
                src={filePath}
                className="idcard-uploader__image"
              />
            ) : (
              <Flex
                className="idcard-uploader__btn"
                direction="column"
                justify="center"
                onClick={upload}
              >
                <Icon icon="icon-tab_wode" className="idcard-uploader__icon" />
                <Typography.Text type="secondary" size="sm">
                  身份证正反面（附带签字）
                </Typography.Text>
              </Flex>
            )}
          </View>
        );
      }}
    </UploaderWrapper>
  );
};

export default () => {
  const [payload, set] = useState<any>({
    id_card_image: undefined,
    bank_name: undefined,
    bank_card: '',
    bank_branch_name: '',
  });
  return (
    <>
      <View className="bg-white mb20 p-default">
        <Typography.Text type="danger">1.该身份证信息仅用于词曲交易环节使用</Typography.Text>
        <Typography.Text type="danger">2.请上传实名该账户实名姓名的身份证正反面</Typography.Text>
      </View>

      <Flex className="bg-white p-default" align="start">
        <IDCardUploader
          value={payload.id_card_image}
          onChange={(value) => set((v) => ({ ...v, id_card_image: value }))}
        />
        <Typography.Link className="ml20">例图查看</Typography.Link>
      </Flex>
      <AtForm className="custom-form settlein-form">
        <View className="bg-white p-default">
          <Typography.Text type="primary">词（5000元）+曲（3000元）</Typography.Text>
        </View>

        <CustomPicker
          title="选择银行"
          arrow
          data={[
            { name: '建设银行', id: 0 },
            { name: '招商银行', id: 1 },
          ]}
          mode="selector"
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
        <Button size="lg" type="primary" circle>
          签署协议
        </Button>
      </View>
      <Typography.Text center>即将前往“腾讯电子签”签署协议</Typography.Text>
    </>
  );
};
