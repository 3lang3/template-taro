export type listParams = {
  page: number; // 页码
  pageSize: number;
};

export type ListResType<T> = {
  _page: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPage: number;
  };
  _list: T[];
  type: number;
  msg: string;
};
