import { useEffect } from 'react';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { View } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { connect } from 'react-redux';
import { setListAsync } from '@/state/message';
import './index.less';

// eslint-disable-next-line @typescript-eslint/no-shadow
function Index({ setListAsync, list }) {
  useEffect(() => {
    setListAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <View className="p-default text-right">
        <Typography.Text type="secondary">全部已读</Typography.Text>
      </View>
      <View className="message-container">
        {list.map(({ content: { title, message }, created_at }, i) => (
          <View
            key={i}
            onClick={() => navigateTo({ url: '/pages/message/detail' })}
            className="message-item message-item--dot"
          >
            <Flex justify="between" className="mb20">
              <Typography.Title level={3} style={{ margin: 0 }}>
                {title}
              </Typography.Title>
              <Typography.Text size="sm" type="secondary">
                {created_at}
              </Typography.Text>
            </Flex>
            <Typography.Text type="secondary" ellipsis>
              {message}
            </Typography.Text>
          </View>
        ))}
      </View>
    </>
  );
}

export default connect(
  ({ message }: { message: any }) => {
    return message;
  },
  (dispatch) => ({
    setListAsync() {
      dispatch(setListAsync() as any);
    },
  }),
)(Index);
