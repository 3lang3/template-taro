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

// 获取跳转电子签小程序地址接口
export function createSchemeUrl(data: { ids: number | string }) {
  return request('/ess/CreateSchemeUrl', {
    method: 'GET',
    data,
  });
}
