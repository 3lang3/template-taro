import { useState } from 'react';
import { Text, Input } from '@tarojs/components';
import Icon from '@/components/Icon';
import Flex from '@/components/Flex';
import './index.less';

export type P = {
  onSearch: (str: string) => void;
};

export default ({ onSearch }: P) => {
  const [str, setStr] = useState('');
  const onSubmit = ({ detail: { value } }) => {
    setStr(value);
    onSearch(value);
  };
  const onCancel = () => {
    setStr('');
    onSearch('');
  };
  return (
    <Flex align="center" className="search">
      <Icon className="custom-navi__btn" icon="icon-sousuo" />
      <Input
        confirmType="search"
        className={`search-input ${str && 'search-cancel-input'}`}
        type="text"
        value={str}
        placeholder="请输入关键字词"
        onConfirm={onSubmit}
      />
      {str && (
        <Text onClick={onCancel} className="cancel">
          取消
        </Text>
      )}
    </Flex>
  );
};
