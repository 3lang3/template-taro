import { View } from '@tarojs/components';
import { memo } from 'react';
import { AtInput } from 'taro-ui';
import Flex from '../Flex';
import Tag from '../Tag';
import Typography from '../Typography';
import './index.less';

type CircleIndexListProps = {
  className?: string;
  data: { title: string; desc: string }[];
};

// 圆形步骤列表
export const CircleIndexList = ({ className, data }: CircleIndexListProps) => {
  return (
    <View className={className}>
      {data.map((step, i) => (
        <Flex className="mb50" key={i}>
          <Flex className="circle-index--primary" justify="center">
            {i + 1}
          </Flex>
          <Flex direction="column" justify="between" align="start">
            <Typography.Title level={3}>{step.title}</Typography.Title>
            <Typography.Text size="sm">{step.desc}</Typography.Text>
          </Flex>
        </Flex>
      ))}
    </View>
  );
};

type LibSongItemProps = {
  title: string;
  tags?: string[];
  actionRender?: () => React.ReactNode | string;
  onClick?: () => void;
};
// 曲库歌曲子项
export const LibSongItem = ({ title, tags, actionRender, ...props }: LibSongItemProps) => {
  return (
    <Flex justify="between" className="lib-song-item" {...props}>
      <View className="lib-song-item__content">
        <Typography.Title className="lib-song-item__title" level={3} ellipsis>
          {title}
        </Typography.Title>
        {Array.isArray(tags) && (
          <Flex>
            {tags.map((el, i) => (
              <Tag key={i}>{el}</Tag>
            ))}
          </Flex>
        )}
      </View>
      {actionRender ? actionRender() : null}
    </Flex>
  );
};

type ManageSongItemProps = {
  title: string;
  price1: string | number;
  price2: string | number;
  actionRender?: () => React.ReactNode | string;
  onClick?: () => void;
};
// 词曲管理子项
export const ManageSongItem = ({
  title,
  price1,
  price2,
  actionRender,
  ...props
}: ManageSongItemProps) => {
  return (
    <Flex justify="between" className="manage-song-item" {...props}>
      <View className="manage-song-item__content">
        <Typography.Text className="mb20" size="lg">
          {title}
        </Typography.Text>
        <Flex>
          <Typography.Text className="mr20" type="secondary">
            曲{price1}元
          </Typography.Text>
          <Typography.Text type="secondary">词{price2}元</Typography.Text>
        </Flex>
      </View>
      {actionRender ? actionRender() : null}
    </Flex>
  );
};

type CounterOfferInputProps = {
  /** 曲或者词 */
  title: string;
  /** input name */
  name: string;
  value: string;
  /** 价格值 */
  price: string | number;
  onChange: (value: string, event) => void;
};
// 还价输入框
export const CounterOfferInput = memo<CounterOfferInputProps>(
  ({ title, name, value, onChange, price }) => {
    return (
      <Flex className="offer-modal-item" justify="between">
        <Typography.Text size="lg">{title}</Typography.Text>
        <Typography.Text size="lg" type="secondary" className="mr20">
          当前: {price}元
        </Typography.Text>
        <Flex className="input--border">
          <AtInput name={name} value={value} onChange={onChange} />
        </Flex>
      </Flex>
    );
  },
  counterOfferInputeQualfn,
);
function counterOfferInputeQualfn(prev, next) {
  if (prev.value === next.value) return true;
  return false;
}
