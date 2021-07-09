import { View, Text, Image } from '@tarojs/components';
import { chooseImage } from '@tarojs/taro';
import removePng from '@/assets/icon/icon_shanchu.png';
import './index.less';
import Flex from '../Flex';

export type P = {
  files: string[];
  onChange: (path: string[], files: chooseImage.ImageFile[]) => void;
  onRemove: (idx: number) => void;
};

export default ({ files, onChange, onRemove }) => {
  function onUpload() {
    chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        onChange(tempFilePaths, res);
      },
    });
  }
  return (
    <View className="image-picker">
      <Flex>
        {files.map((item: string, idx: number) => (
          <View key={'img-' + idx} className="image-picker--select">
            <Image src={removePng} onClick={() => onRemove(idx)} className="remove" />
            <Image mode="aspectFit" className="image-picker--img" src={item} />
          </View>
        ))}
        {files.length < 3 && (
          <Flex
            align="center"
            onClick={() => onUpload()}
            justify="center"
            direction="column"
            className="image-picker--select"
          >
            <Text>曲谱添加</Text>
            <Text>(选填)</Text>
          </Flex>
        )}
      </Flex>
    </View>
  );
};