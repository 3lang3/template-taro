// 改价modal
import { View } from '@tarojs/components';
import Button from '@/components/Button';
import Radio from '@/components/Radio';
import { showToast } from '@tarojs/taro';
import { forwardRef, useRef, useState, useImperativeHandle } from 'react';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui';
import { CounterOfferInput } from '../Chore';
import Flex from '../Flex';

type ChangePriceModalProps = {
  /** modal title */
  title?: string;
  /** 展示还价radio选项 */
  showChangePriceRadio?: boolean;
  /** 提交事件 */
  onConfirm?: (values: any) => void;
};
export type ChangePriceModalType = {
  /** 打开还价modal */
  show: (info: { composer_price: string | number; lyricist_price: string | number }) => void;
  /** 关闭还价modal */
  close: () => void;
  /** 获取modal state值 */
  getValue: () => any;
};

export default forwardRef<ChangePriceModalType, ChangePriceModalProps>(
  ({ onConfirm, title = '还价', showChangePriceRadio }, ref) => {
    const staticInfoRef = useRef<any>({});
    const [payload, setPayload] = useState<any>({
      composer_price: '',
      lyricist_price: '',
      is_change_price: false,
    });
    const [visible, set] = useState(false);

    // 将组件内方法挂在传入的ref上
    useImperativeHandle<any, ChangePriceModalType>(ref, () => ({
      show: (record) => {
        staticInfoRef.current = record;
        set(true);
      },
      close: closeModal,
      getValue: () => payload,
    }));

    const closeModal = () => {
      setPayload({
        composer_price: '',
        lyricist_price: '',
        is_change_price: false,
      });
      set(false);
    };

    const _onConfirm = async () => {
      const { is_change_price, ...rest } = payload;
      if (!rest.composer_price || !rest.lyricist_price) {
        showToast({ icon: 'none', title: '请输入词曲价格' });
        return;
      }
      onConfirm?.(showChangePriceRadio ? payload : rest);
    };

    return (
      <>
        <AtModal isOpened={visible} onClose={closeModal}>
          <AtModalHeader>{title}</AtModalHeader>
          <AtModalContent>
            {/* @hack */}
            {visible && (
              <>
                <CounterOfferInput
                  title="曲"
                  price={staticInfoRef.current.composer_price}
                  name="composer_price"
                  value={payload.composer_price}
                  placeholder="修改后曲价格"
                  onChange={(value) => {
                    setPayload((v) => ({ ...v, composer_price: value }));
                    return value;
                  }}
                />
                <CounterOfferInput
                  title="词"
                  price={staticInfoRef.current.lyricist_price}
                  placeholder="修改后词价格"
                  name="lyricist_price"
                  value={payload.lyricist_price}
                  onChange={(value) => setPayload((v) => ({ ...v, lyricist_price: value }))}
                />
              </>
            )}
            {showChangePriceRadio && (
              <View className="ml30">
                <Radio
                  label="接受还价"
                  value={payload.is_change_price}
                  onChange={(value) => setPayload((v) => ({ ...v, is_change_price: value }))}
                />
              </View>
            )}
          </AtModalContent>
          <AtModalAction>
            <Flex justify="between" className="p-default pb40">
              <Button onClick={closeModal} outline circle>
                取消
              </Button>
              <Button onClick={_onConfirm} type="primary" circle>
                确定
              </Button>
            </Flex>
          </AtModalAction>
        </AtModal>
      </>
    );
  },
);
