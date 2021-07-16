import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import cls from 'classnames';
import { View, Text } from '@tarojs/components';
import Button from '@/components/Button';
import { chooseMessageFile, setClipboardData } from '@tarojs/taro';
import config from '@/config';
import { AtInput } from 'taro-ui';
import { useRequest } from 'ahooks';
import { getPcSongUrl } from '@/services/common';
import Icon from '@/components/Icon';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { UploaderWrapper } from '../wrapper';
import type { BaseUploadProps } from '../PropsType';
import './index.less';

// 大文件上传地址
const WEB_UPLOAD_URL = config.boss + '/user/file';

export default (props: BaseUploadProps<chooseMessageFile.ChooseFile>) => {
  const userData = useSelector((state) => state.common.data);
  // 轮询获取pc上传信息
  const pcReq = useRequest(getPcSongUrl, {
    manual: true,
    pollingInterval: 5000,
    onSuccess: ({ data }) => {
      if (props.onChange && data.url) props.onChange(data.url, undefined, data);
    },
  });

  useEffect(() => {
    if (props.disabled) return;
    if (userData.ids) {
      pcReq.run({ memberIds: userData.ids });
    }
    return () => pcReq.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.ids]);

  return (
    <UploaderWrapper
      type="message"
      disabled={props.disabled}
      className={cls('settlein-list', props.className)}
      value={props.value}
      onChange={props.onChange}
    >
      {({ file, remove }) => {
        return (
          <>
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
                  value={WEB_UPLOAD_URL}
                  onChange={() => false}
                />
                <Button
                  disabled={props.disabled}
                  className="settlein-list-share"
                  circle
                  size="sm"
                  onClick={() => setClipboardData({ data: WEB_UPLOAD_URL })}
                >
                  复制
                </Button>
              </Flex>
            </View>
            <View className="p-default">
              {props.value ? (
                <Flex
                  direction="column"
                  justify="center"
                  className={cls(
                    'settlein-uploader__status',
                    'settlein-uploader__status--success',
                    {
                      'settlein-uploader__status--disabled': props.disabled,
                    },
                  )}
                >
                  {!props.disabled && (
                    <Icon
                      onClick={remove}
                      className="settlein-uploader__delete"
                      icon="icon-ashbin"
                    />
                  )}
                  <Flex justify="center">
                    <Icon className="settlein-uploader__icon mr10" icon="icon-icon_qupu" />
                    <Typography.Title style={{ margin: 0 }} level={3} type="light">
                      歌曲添加成功!
                    </Typography.Title>
                  </Flex>
                  {file ? (
                    <Typography.Text center type="light" size="sm">
                      {file.name}
                    </Typography.Text>
                  ) : null}
                </Flex>
              ) : (
                <View className="border--bolder p-default">
                  <Flex justify="center">
                    <Typography.Text type="secondary">添加歌曲</Typography.Text>
                    <Icon className="settlein-uploader__icon" icon="icon-quku_bofang" />
                  </Flex>
                  <Typography.Text center type="secondary" size="sm">
                    选择一个上传音频的聊天对话窗口
                  </Typography.Text>
                </View>
              )}
            </View>
          </>
        );
      }}
    </UploaderWrapper>
  );
};
