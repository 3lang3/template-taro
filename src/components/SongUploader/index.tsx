import cls from 'classnames';
import { View, Text, Image } from '@tarojs/components';
import { chooseMessageFile, setClipboardData } from '@tarojs/taro';
import { AtInput } from 'taro-ui';
import Flex from '../Flex';
import Typography from '../Typography';
import './index.less';

type SongUploaderProps = {
  className?: string;
  webActionUrl?: string;
  name?: string;
  onChange?: (v: any) => void;
};

export default (props: SongUploaderProps) => {
  const copy = async () => {
    if (!props.webActionUrl) return;
    setClipboardData({ data: props.webActionUrl });
  };
  const onUploadClick = async () => {
    // @todo upload file pipe
    const { errMsg, tempFiles } = await chooseMessageFile({ count: 1 });
    if (errMsg !== 'chooseMessageFile:ok') throw Error(errMsg);
    const [file] = tempFiles;
    if (props.onChange) props.onChange(file);
  };
  return (
    <View className={cls('settlein-list', props.className)}>
      <Flex className="settlein-list__item border">
        <Typography.Text className="settlein-list__item-title">
          1、将歌曲上传到任一微信聊天中
        </Typography.Text>
      </Flex>
      <Flex className="settlein-list__item">
        <Typography.Text className="settlein-list__item-title">
          2、小程序-添加歌曲，选择微信聊天中的歌曲，确认上传。由于微信限制上传文件不能超过100M，
          <Text className="text-danger">超过100M的歌曲，请通过PC端上传。</Text>
        </Typography.Text>
      </Flex>
      <View className="settlein-list__wrapper">
        <Flex className="input--border">
          <Typography.Text>PC端链接：</Typography.Text>
          <AtInput
            name="webActionUrl"
            type="text"
            disabled
            placeholder={props.webActionUrl}
            onChange={() => false}
          />
          <Typography.Link onClick={copy}>复制</Typography.Link>
        </Flex>
      </View>
      <View className="p-default">
        <View onClick={onUploadClick} className="border--bolder p-default">
          <Flex justify="center">
            <Typography.Text type="secondary">添加歌曲</Typography.Text>
            <Image
              className="settlein-uploader__icon"
              src={require('@/assets/icon/play_thin_outline.svg')}
            />
          </Flex>
          <Typography.Text center type="secondary" size="sm">
            选择一个上传音频的聊天对话窗口
          </Typography.Text>
        </View>
      </View>
    </View>
  );
};
