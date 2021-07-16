// 仅开发用 实际已经在me页面中渲染了

import CustomPicker from '@/components/CustomPicker';
import { useState } from 'react';
import { AtForm, AtInput } from 'taro-ui';

export default () => {
  const [payload, set] = useState({
    bank_name: undefined,
    bank_card: '',
    bank_branch_name: '',
  });
  return (
    <>
      <AtForm className="custom-form settlein-form">
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
          type="text"
          value={payload.bank_branch_name}
          onChange={(value) => set((v: any) => ({ ...v, bank_branch_name: value }))}
        />
        <AtInput
          name="bank_card"
          title="银行卡号"
          type="text"
          value={payload.bank_card}
          onChange={(value) => set((v: any) => ({ ...v, bank_card: value }))}
        />
      </AtForm>
    </>
  );
};
