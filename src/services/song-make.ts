import request, { PromiseResponseType } from '@/utils/request';
import type { listParams, ListResType } from './common.d';

export type MakeNode = {
  ids: Number;
  number_ids: Number;
  nickname: String;
  singer: String;
};

// 歌曲制作列表
export function getMusicsongmakeList(
  data: listParams,
): Promise<PromiseResponseType<ListResType<Node[]>>> {
  return request('/index.php?_url=/music/Musicsongmake/getLists', {
    method: 'GET',
    data,
  });
}
