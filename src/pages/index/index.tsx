import { useSelector, useDispatch } from "react-redux";
import { View, Button, Text, Swiper, SwiperItem } from "@tarojs/components";
import { add, minus, asyncAdd } from "@/state/counter";
import CustomTabBar from "@/components/CustomTabBar";

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
    <>
      <View className="index">
        <Swiper
          className="test-h"
          indicatorColor="#999"
          indicatorActiveColor="#333"
          circular
          indicatorDots
          autoplay
        >
          <SwiperItem>
            <View className="demo-text-1">1</View>
          </SwiperItem>
          <SwiperItem>
            <View className="demo-text-2">2</View>
          </SwiperItem>
          <SwiperItem>
            <View className="demo-text-3">3</View>
          </SwiperItem>
        </Swiper>
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
      <CustomTabBar />
    </>
  );
};

export default Index;
