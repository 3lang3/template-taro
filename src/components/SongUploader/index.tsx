import { useRef } from 'react';
import cls from 'classnames';
import { View, Text } from '@tarojs/components';
import Button from '@/components/Button';
import config from '@/config';
import { chooseMessageFile, getStorageSync, uploadFile } from '@tarojs/taro';
import { AtInput } from 'taro-ui';
import Flex from '../Flex';
import Typography from '../Typography';
import './index.less';
import Icon from '../Icon';

type SongUploaderProps = {
  value?: any;
  className?: string;
  webActionUrl?: string;
  name?: string;
  onChange?: (v: string | undefined, file?: chooseMessageFile.ChooseFile, response?: any) => void;
  chooseMessageFileType?: chooseMessageFile.Option['type'];
  disabled?: boolean;
};

export default (props: SongUploaderProps) => {
  const chooseFileRef = useRef<chooseMessageFile.ChooseFile>();

  const onDelete = () => {
    if (props.disabled) return;
    chooseFileRef.current = undefined;
    if (props.onChange) props.onChange(undefined);
  };

  const onUploadClick = async () => {
    if (props.disabled) return;
    const { errMsg, tempFiles } = await chooseMessageFile({
      count: 1,
      type: props.chooseMessageFileType || 'file',
    });
    if (errMsg !== 'chooseMessageFile:ok') throw Error(errMsg);
    const [file] = tempFiles;
    chooseFileRef.current = file;
    const u = await uploadFile({
      url: config.uploadFile,
      filePath: file.path,
      name: 'file',
      header: {
        [config.storage.tokenKey]: getStorageSync(config.storage.tokenKey),
      },
    });
    console.log(u);
    // @todo upload file pipe
    if (props.onChange) props.onChange(file.path, file, {});
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
            value={props.webActionUrl}
            onChange={() => false}
          />
          <Button openType="share" className="settlein-list-share" circle size="sm">
            发送
          </Button>
        </Flex>
      </View>
      <View className="p-default">
        {props.value ? (
          <Flex
            direction="column"
            justify="center"
            className="settlein-uploader__status settlein-uploader__status--success"
          >
            <Icon onClick={onDelete} className="settlein-uploader__delete" icon="icon-ashbin" />
            <Flex justify="center">
              <Icon className="settlein-uploader__icon mr10" icon="icon-icon_qupu" />
              <Typography.Title style={{ margin: 0 }} level={3} type="light">
                歌曲添加成功!
              </Typography.Title>
            </Flex>
            {chooseFileRef.current ? (
              <Typography.Text center type="light" size="sm">
                {chooseFileRef.current.name}
              </Typography.Text>
            ) : null}
          </Flex>
        ) : (
          <View onClick={onUploadClick} className="border--bolder p-default">
            <Flex justify="center">
              <Typography.Text type="secondary">添加歌曲</Typography.Text>
              <Icon className="settlein-uploader__icon" icon="icon-shouye_bofang" />
            </Flex>
            <Typography.Text center type="secondary" size="sm">
              选择一个上传音频的聊天对话窗口
            </Typography.Text>
          </View>
        )}
      </View>
    </View>
  );
};
