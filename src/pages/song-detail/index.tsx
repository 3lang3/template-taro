import cls from 'classnames';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { View } from '@tarojs/components';
import { getMakeSongDetail, Node } from '@/services/song-detail';
import { FullPageLoader, FullPageError, Empty } from '@/components/Chore';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import './index.less';

export default () => {
  const ids = 527875806;
  const [list, setList] = useState<Node[]>([]);

  const { loading, error, refresh } = useRequest(getMakeSongDetail, {
    defaultParams: [{ ids }],
    onSuccess: ({ data, type, msg }) => {
      if (type === 1) throw Error(msg);
      setList([...list, ...data]);
    },
  });
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  if (!list.length) return <Empty className="mt60" message="暂无消息" />;
  return (
    <>
      <Flex className="px24 py30">
        <Typography.Text className="mr20">{list[0].node}</Typography.Text>
        <Typography.Text type="primary">{list[0].complete_at}</Typography.Text>
      </Flex>
      <View className="make-steps">
        {list.slice(1).map((step, i) => (
          <Flex key={i} justify="between" className="make-step">
            <Flex>
              <Flex
                justify="center"
                className={cls('make-step__idx', { 'make-step__idx--active': step.status === 1 })}
              >
                {i + 1}
              </Flex>
              <Typography.Text type={step.status === 1 ? 'primary' : 'secondary'}>
                {step.node}
              </Typography.Text>
            </Flex>
            {step.status === 1 ? (
              <Typography.Text type="secondary">{step.complete_at}</Typography.Text>
            ) : null}
          </Flex>
        ))}
      </View>
    </>
  );
};
