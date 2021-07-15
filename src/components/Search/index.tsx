import { useState } from 'react';
import { Text, Input } from '@tarojs/components';
import Icon from '../Icon';
import Flex from '../Flex';
import './index.less';

export type P = {
  onSearch: (str: string) => void;
};

export default ({ onSearch }: P) => {
  const [isCancel, setIsCancel] = useState(false);
  const onSubmit = ({ detail: { value } }) => {
    onSearch(value);
    setIsCancel(!!value);
  };
  const onCancel = () => {
    onSearch('');
    setIsCancel(false);
  };
  return (
    <Flex align="center" className="search">
      <Icon className="custom-navi__btn" icon="icon-shenqing_icon_weigouxuan" />
      <Input
        confirmType="search"
        className={`search-input ${isCancel && 'search-cancel-input'}`}
        type="text"
        placeholder="请输入关键字词"
        onConfirm={onSubmit}
      />
      {isCancel && (
        <Text onClick={onCancel} className="cancel">
          取消
        </Text>
      )}
    </Flex>
  );
};
