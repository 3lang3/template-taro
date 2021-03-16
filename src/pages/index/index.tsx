import { View, Text } from "@tarojs/components";
import { useState } from "react";
import "./index.less";

export default () => {
  const [state, setState] = useState("bobobo");
  return (
    <View className="index">
      <Text>Hello world! {state}</Text>
    </View>
  );
};
