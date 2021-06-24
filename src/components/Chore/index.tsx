import { View } from '@tarojs/components';
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
// 曲库歌曲
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
