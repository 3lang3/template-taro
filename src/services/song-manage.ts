import request from '@/utils/request';

// 歌曲制作详情
export function getMusicSongManageList(data: { ids: number | string }) {
  return request('/song/getMusicSongManageList', {
    method: 'GET',
    data,
  });
}

export function delMusicSong(data: { ids: number | string }) {
  return request('/song/delMusicSong', {
    method: 'GET',
    data,
  });
}

type CreateSchemeUrlParams = {
  /** 签署协议的词曲ids */
  ids: number | string;
  /** 银行名称 */
  bank_name: string;
  /** 银行卡 */
  bank_card: string | number;
  /** 开户银行支行 */
  bank_branch_name: string;
};
// 获取跳转电子签小程序地址接口
export function createSchemeUrl(data: CreateSchemeUrlParams) {
  return request('/ess/CreateSchemeUrl', {
    method: 'POST',
    data,
  });
}

type DescribeFlowBriefsParams = {
  /** 流程ids, 从`createSchemeUrl`接口获取 */
  flow_id: string;
  /** 词曲ids */
  ids: string;
};
export function describeFlowBriefs(data: DescribeFlowBriefsParams) {
  return request(
    '/ess/DescribeFlowBriefs',
    {
      method: 'POST',
      data,
    },
    false,
  );
}
