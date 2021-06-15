import { useSelector, useDispatch } from 'react-redux';
import { View, Button, Text } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { add, minus } from '@/state/counter';
import { getUser } from '@/state/user';
import CustomTabBar from '@/components/CustomTabBar';

import './index.less';

const Index = () => {
  const router = useRouter();
  const counter = useSelector((state: any) => state.counter);
  const dispatch = useDispatch();
  console.log(router);
  const addHandle = () => {
    dispatch(add());
  };
  const desHandle = () => {
    dispatch(minus());
  };
  const asyncAddHandle = () => {
    dispatch(getUser());
  };

  return (
    <>
      <View className="index">
        <Button className="add_btn" onClick={addHandle}>
          +
        </Button>
        <Button className="dec_btn" onClick={desHandle}>
          -
        </Button>
        <Button className="dec_btn" onClick={asyncAddHandle}>
          获取用户信息
        </Button>
        <View>
          <Text>{counter.num}</Text>
        </View>
        <View>
          <Text>我的页面</Text>
        </View>
      </View>
      <CustomTabBar />
    </>
  );
};

export default Index;
