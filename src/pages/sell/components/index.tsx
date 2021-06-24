import cls from 'classnames';
import Flex from '@/components/Flex';
import { View } from '@tarojs/components';
import './index.less';

const sellStepData = [{ text: '作品信息' }, { text: '词曲材料' }];

export const SellSteps = ({ current = 0 }) => {
  return (
    <Flex
      className={cls('sell-steps', {
        'sell-steps--active': current === sellStepData.length - 1,
      })}
      justify="between"
    >
      {sellStepData.map((step, i) => (
        <Flex
          key={i}
          justify="center"
          direction="column"
          className={cls('sell-steps__item', {
            'sell-steps__item--active': current >= i,
          })}
        >
          <Flex justify="center" className="sell-steps__item-index">
            {i+1}
          </Flex>
          <View className="sell-steps__item-text">{step.text}</View>
        </Flex>
      ))}
    </Flex>
  );
};
