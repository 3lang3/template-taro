import { useRef } from 'react';
import { View } from '@tarojs/components';
import { chooseImage, chooseMessageFile, showToast } from '@tarojs/taro';
import { uploadSingleFile } from '@/utils/upload';
import type { BaseUploadWrapperProps } from './PropsType';

export const UploaderWrapper = ({ children, type, ...props }: BaseUploadWrapperProps) => {
  const chooseFileRef = useRef<any>();

  const remove = () => {
    if (props.disabled) return;
    chooseFileRef.current = undefined;
    props.onChange?.(undefined);
  };

  const onUploadClick = async () => {
    if (props.disabled || props.value) return;
    // 选择聊天文件
    const { errMsg, tempFiles } =
      type === 'message'
        ? await chooseMessageFile({
            count: 1,
            type: 'file',
          })
        : await chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
          });
    // 选择失败 退出
    if (errMsg !== 'chooseMessageFile:ok') throw Error(errMsg);
    // 获取文件
    const [file] = tempFiles;
    // 选择聊天文件
    chooseFileRef.current = file;
    try {
      const { data, msg } = await uploadSingleFile({ filePath: file.path });
      showToast({ icon: 'success', title: msg });
      props.onChange?.(data.path, file, data);
    } catch (error) {
      showToast({ icon: 'none', title: error.message });
    }
  };
  const file = chooseFileRef.current;
  return (
    <View className={props.className} onClick={onUploadClick}>
      {(() => {
        if (children && typeof children === 'function') {
          return children({ file, remove });
        }
        return children;
      })()}
    </View>
  );
};
