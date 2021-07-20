import cls from 'classnames';
import { useSelector } from 'react-redux';
import Flex from '@/components/Flex';
import Icon from '@/components/Icon';
import Image from '@/components/Image';
import Typography from '@/components/Typography';
import { BaseUploadProps } from '@/components/Uploader/PropsType';
import { UploaderWrapper } from '@/components/Uploader/wrapper';
import { View } from '@tarojs/components';
import { useEffect, useRef, useState } from 'react';
import { AtIndexes, AtListItem } from 'taro-ui';

// 身份证上传
export const IDCardUploader = (props: BaseUploadProps) => {
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

// 银行选择
export const BankPicker = ({ value, onChange }) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState<any>();
  const list = useSelector((state) => state.common.bankList);
  const innerEffect = useRef(false);

  useEffect(() => {
    if (innerEffect.current) {
      innerEffect.current = false;
      return;
    }
    if (!value) {
      setTitle(undefined);
      return;
    }

    const current = getTitleFromValue(list, value);
    if (current.ids) {
      setTitle(current.bank_name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onClick = (item) => {
    innerEffect.current = true;
    if (onChange) onChange(item.ids);
    setTitle(item.bank_name);
    setShow(false);
  };

  return (
    <>
      <AtListItem
        title="选择银行"
        extraText={title}
        arrow={!title ? 'right' : undefined}
        onClick={() => setShow(true)}
      />
      <View
        className={cls('bank-list__wrapper', {
          'bank-list__wrapper--active': show,
        })}
      >
        <AtIndexes list={list as any} onClick={onClick}>
          <Flex justify="between" className="bank-list__title">
            <Typography.Title style={{ margin: 0 }} level={3}>
              选择银行
            </Typography.Title>
            <Flex onClick={() => setShow(false)} className="bank-list__close" justify="end">
              <Icon icon="icon-pop_icon_shanchu" />
            </Flex>
          </Flex>
          <View className="bank-list__title--placeholder" />
        </AtIndexes>
        ;
      </View>
    </>
  );
};

// 通过value获取银行名称
function getTitleFromValue(data, value) {
  const _data = data.reduce((a, v) => {
    a.push(...v.items);
    return a;
  }, []);
  return _data.find((el) => +el.ids === value);
}
