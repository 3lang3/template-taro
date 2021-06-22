import Flex from '@/components/Flex';
import { TabNavigationBar } from '@/components/CustomNavigation';
import Typography from '@/components/Typography';
import Image from '@/components/Image';
import { View } from '@tarojs/components';
import './index.less';

export default () => {
  return (
    <>
      <TabNavigationBar title="专辑" />

      <Image className="album-detail__cover" src="" />

      <View className="album-detail__wrapper">
        <Flex className="album-detail__p">
          <View className="album-detail__p-label">专辑:</View>
          <View className="album-detail__p-text">后座剧场</View>
        </Flex>
        <Flex className="album-detail__p">
          <View className="album-detail__p-label">语种:</View>
          <View className="album-detail__p-text">国语</View>
        </Flex>
        <Flex className="album-detail__p">
          <View className="album-detail__p-label">发行时间:</View>
          <View className="album-detail__p-text">2021.05.20</View>
        </Flex>
        <Flex className="album-detail__p">
          <View className="album-detail__p-label">唱片公司:</View>
          <View className="album-detail__p-text">一哥传媒有限公司</View>
        </Flex>
        <Flex className="album-detail__p">
          <View className="album-detail__p-label">流派:</View>
          <View className="album-detail__p-text">摇滚</View>
        </Flex>
        <Typography.Text type="light" className="mt50">
          人们难辩过去何时成为过去,却能牢记过去的样子——从北二环到昌平近40公里,10年后的他,将这个印象深刻的儿时交付,又从斑斓浩瀚的音乐光谱中,精选与自我共振频率最高的6首经单作品~
        </Typography.Text>
      </View>
    </>
  );
};
