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
  _list: T;
  type: number;
  msg: string;
};

export type SuccessResType<T> = {
  data: T;
  type: number;
  msg: string;
};

// 歌曲标签结构
export type TagType = {
  tag_type: number;
  tag_type_name: string;
  value: {
    tag: number;
    tag_name: string;
  }[];
};

// 语种设置
export type LanguageVersion = {
  language: number;
  name: string;
};

// 语种设置
export type SongStyle = {
  song_style: number;
  name: string;
};
