import cls from 'classnames';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { View } from '@tarojs/components';
import { useState } from 'react';
import './index.less';

const makeStepsData = [
  { text: '词曲投稿' },
  { text: '歌手中意词曲' },
  { text: '编曲中' },
  { text: '音乐分轨' },
  { text: '录音棚录制' },
  { text: '歌手人声录制' },
  { text: '混音师混音' },
  { text: '母带师处理' },
];

export default () => {
  const [steps] = useState(makeStepsData);
  return (
    <>
      <Flex className="px24 py30">
        <Typography.Text className="mr20">预计完成完成时间:</Typography.Text>
        <Typography.Text type="primary">2020.05.20</Typography.Text>
      </Flex>
      <View className="make-steps">
        {steps.map((step, i) => (
          <Flex key={i} justify="between" className="make-step">
            <Flex>
              <Flex
                justify="center"
                className={cls('make-step__idx', { 'make-step__idx--active': i < 3 })}
              >
                {i + 1}
              </Flex>
              <Typography.Text type={i < 3 ? 'primary' : 'secondary'}>{step.text}</Typography.Text>
            </Flex>
            {i < 3 ? <Typography.Text type="secondary">2020.05.20</Typography.Text> : null}
          </Flex>
        ))}
      </View>
    </>
  );
};
