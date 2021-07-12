import config from '@/config';
import { getStorageSync, hideLoading, showLoading, uploadFile } from '@tarojs/taro';
import type { PromiseResponseType } from './request';

// 单文件上传
export const uploadSingleFile = ({
  filePath,
  name = 'file',
}): Promise<PromiseResponseType<any>> => {
  return new Promise((resolve, reject) => {
    const uploadTask = uploadFile({
      url: config.uploadFile,
      filePath: filePath,
      name,
      // header头添加token字段
      header: {
        [config.storage.tokenKey]: getStorageSync(config.storage.tokenKey),
      },
      success: ({ data, statusCode, errMsg: taskErrMsg }) => {
        hideLoading();
        if (statusCode !== 200) reject(new Error(taskErrMsg));
        const res = typeof data === 'string' ? JSON.parse(data) : data;
        if (res.type === 1) reject(new Error(res.msg));
        resolve(res);
      },
      fail: () => {
        reject(new Error('上传失败'));
      },
    });
    // 上传进度条
    uploadTask.progress(({ progress }) => {
      showLoading({ title: `已上传${progress}%` });
    });
  });
};

export const uploadMultipleFile = async ({ filePaths, name = 'file' }) => {
  const rs: any[] = [];
  for (const filePath of filePaths) {
    const res = await uploadSingleFile({ filePath, name });
    rs.push(res);
  }
  return rs;
};
