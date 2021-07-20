import { View, Text } from '@tarojs/components';
import Icon from '@/components/Icon';
import Flex from '@/components/Flex';
import { Node } from '@/services/help';
import MyImage from '../Image';
import './index.less';

export type P = {
  data: Node;
  onLeft: (node: Node) => void;
  onRight: (node: any) => void;
};

export default ({ data, onLeft, onRight }: P) => {
  return (
    <>
      <Flex className="sort-list">
        <Flex align="center" justify="center" className="sort-list-left" direction="column">
          <MyImage className="sort-list__icon" src={data.icon} />
          <Flex onClick={() => onLeft(data)} align="center">
            <Text>{data.title}</Text>
            <Icon className="emptybox__icon" icon="icon-icon_jinru" />
          </Flex>
        </Flex>
        <Flex align="center" justify="center" className="sort-list-right">
          <View>
            {data.help_list.map((item) => (
              <Text key={item.ids} onClick={() => onRight(item)}>
                {item.title}
              </Text>
            ))}
          </View>
        </Flex>
      </Flex>
    </>
  );
};
