import { View } from '@tarojs/components';
import Flex from '../Flex';
import Typography from '../Typography';
import './index.less';

type CircleIndexListProps = {
  className?: string;
  data: { title: string; desc: string }[];
};

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
