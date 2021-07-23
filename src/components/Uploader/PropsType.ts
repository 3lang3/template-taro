type ChildrenPramas = {
  /** 可以直接渲染的文件路径 */
  filePath?: string;
  file?: { path: string; name: string } & Record<string, any>;
  /** 删除已上传的文件 */
  remove: () => void;
  upload: () => void;
};

export type BaseUploadProps<T = Record<string, any>> = {
  value?: any;
  className?: string;
  onChange?: (v: string | undefined, file?: T, response?: any) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 最大上传数量 */
  maxCount?: number;
};

export type BaseUploadWrapperProps = {
  children: React.ReactNode | ((params: ChildrenPramas) => React.ReactNode);
  /**
   * uploader 类型
   * - message 选择聊天记录文件上传
   * - image 选择相册上传
   */
  type: 'message' | 'image';
} & BaseUploadProps;
