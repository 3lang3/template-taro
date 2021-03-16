import { View, Text } from "@tarojs/components";
import { useState } from "react";
import "./index.less";

export default () => {
  const [state, setState] = useState(0);
  const onClick = () => setState((v) => ++v);
  return (
    <View className="index">
      <Text onClick={onClick}>Hello world! {state}</Text>
    </View>
  );
};
