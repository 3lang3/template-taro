/**
 * 杂项ui
 *
 * 放置部分页面可复用的ui组件
 */

import { Image as TaroImage, View } from '@tarojs/components';
import { memo } from 'react';
import { AtInput, AtActivityIndicator } from 'taro-ui';
import Button from '../Button';
import Flex from '../Flex';
import type { FlexProps } from '../Flex';
import Icon from '../Icon';
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
  /** 曲价格 */
  price1: string | number;
  /** 词价格 */
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
  placeholder?: string;
  /** input name */
  name: string;
  value: string;
  /** 价格值 */
  price: string | number;
  onChange: (value: string, event) => void;
};
// 还价输入框
export const CounterOfferInput = memo<CounterOfferInputProps>(
  ({ title, placeholder, name, value, onChange, price }) => {
    return (
      <Flex className="offer-modal-item" justify="between">
        <Flex>
          <Typography.Text size="lg" className="mr10">
            {title}
          </Typography.Text>
          <Typography.Text size="lg" type="secondary" className="mr20">
            当前: {price}元
          </Typography.Text>
        </Flex>
        <Flex className="input--border">
          <AtInput
            type="number"
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
          />
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

/**
 * 页面loading时UI
 */
type FullPageLoaderProps = {
  content?: string;
};
export const FullPageLoader = ({ content }: FullPageLoaderProps) => {
  return (
    <Flex justify="center" className="full-page--loader">
      <AtActivityIndicator size={38} mode={content ? 'center' : 'normal'} content={content} />
    </Flex>
  );
};

type FullPageErrorProps = {
  refresh?: () => void;
};
/**
 * 页面加载出错UI
 */
export const FullPageError = ({ refresh }: FullPageErrorProps) => {
  return (
    <Flex direction="column" justify="center" className="full-page--error">
      <Icon className="full-page--error__icon" icon="icon-space" />
      <Typography.Title>Sorry...页面请求失败</Typography.Title>
      {refresh ? (
        <Button type="primary" onClick={refresh}>
          刷新试试
        </Button>
      ) : null}
    </Flex>
  );
};

type EmptyProps = {
  /**
   * 提示标题
   * @default '暂无相关数据'
   */
  message?: string;
} & FlexProps;
export const Empty = ({ message = '暂无数据', ...props }: EmptyProps) => {
  return (
    <Flex className="emptybox" direction="column" justify="center" {...props}>
      <Flex justify="center" className="emptybox__icon__wrapper">
        <Icon className="emptybox__icon" icon="icon-logo" />
      </Flex>
      <Typography.Text className="emptybox__text">{message}</Typography.Text>
    </Flex>
  );
};

export const rankRender = (rank) => {
  if (+rank > 3) return <Typography.Text type="secondary">{rank}</Typography.Text>;
  return (
    <TaroImage
      mode="aspectFit"
      className="item-rank__img"
      src={require(`@/assets/home/rank_${rank}.png`)}
    />
  );
};
