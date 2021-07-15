import { View, Text } from '@tarojs/components';
import Icon from '@/components/Icon';
import Flex from '@/components/Flex';
import { Node } from '@/services/help';
import MyImage from '../Image';
import './index.less';

export type P = {
  data: Node;
  onLeft: (node: Node) => void;
};

export default ({ data, onLeft }: P) => {
  return (
    <>
      <Flex className="sort-list">
        <Flex align="center" justify="center" className="sort-list-left" direction="column">
          <MyImage className="icon-hot" src={data.icon} />
          <Flex onClick={() => onLeft(data)} align="center">
            <Text>{data.title}</Text>
            <Icon className="emptybox__icon" icon="icon-icon_jinru" />
          </Flex>
        </Flex>
        <Flex align="center" justify="center" className="sort-list-right">
          <View>
            {data.help_list.map((item) => (
              <Text>{item.title}</Text>
            ))}
          </View>
        </Flex>
      </Flex>
    </>
  );
};
