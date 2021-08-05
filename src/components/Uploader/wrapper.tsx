import { useState, forwardRef, useImperativeHandle } from 'react';
import { View } from '@tarojs/components';
import { chooseImage, chooseMessageFile, showToast } from '@tarojs/taro';
import { uploadSingleFile } from '@/utils/upload';
import type { BaseUploadWrapperProps } from './PropsType';

export const UploaderWrapper = forwardRef<{}, BaseUploadWrapperProps>(
  ({ children, type, ...props }, ref) => {
    const [chooseFile, setChooseFile] = useState<any>();
    const typeApi = type === 'message' ? 'chooseMessageFile' : 'chooseImage';
    const remove = () => {
      if (props.disabled) return;
      setChooseFile(undefined);
      props.onChange?.(undefined);
    };

    const upload = async () => {
      if (props.disabled) return;
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
      if (errMsg !== `${typeApi}:ok`) throw Error(errMsg);
      // 获取文件
      const [file] = tempFiles;
      // 选择聊天文件
      setChooseFile(file);
      try {
        const { data, msg } = await uploadSingleFile({ filePath: file.path });
        showToast({ icon: 'success', title: msg });
        props.onChange?.(data.path, file, data);
      } catch (error) {
        showToast({ icon: 'none', title: error.message });
      }
    };
    const filePath = chooseFile?.path || props.value;

    useImperativeHandle(ref, () => ({
      upload,
      remove,
      value: filePath,
    }));

    return (
      <View className={props.className}>
        {(() => {
          if (children && typeof children === 'function') {
            return children({ file: chooseFile, filePath, remove, upload });
          }
          return children;
        })()}
      </View>
    );
  },
);
