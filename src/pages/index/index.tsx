import { useSelector, useDispatch } from "react-redux";
import { View, Button, Text } from "@tarojs/components";

import { add, minus, asyncAdd } from "@/state/counter";

import "./index.less";

const Index = () => {
  const counter = useSelector((state: any) => state.counter);
  const dispatch = useDispatch();

  const addHandle = () => {
    dispatch(add());
  };
  const desHandle = () => {
    dispatch(minus());
  };
  const asyncAddHandle = () => {
    dispatch(asyncAdd());
  };

  return (
    <View className="index">
      <Button className="add_btn" onClick={addHandle}>
        +
      </Button>
      <Button className="dec_btn" onClick={desHandle}>
        -
      </Button>
      <Button className="dec_btn" onClick={asyncAddHandle}>
        async
      </Button>
      <View>
        <Text>{counter.num}</Text>
      </View>
      <View>
        <Text>Hello, World</Text>
      </View>
    </View>
  );
};

export default Index;
