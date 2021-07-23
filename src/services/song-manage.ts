import request from '@/utils/request';

// 歌曲制作详情
export function getMusicSongManageList(data: { ids: number }) {
  return request('/song/getMusicSongManageList', {
    method: 'GET',
    data,
  });
}

export function delMusicSong(data: { ids: number }) {
  return request('/song/delMusicSong', {
    method: 'GET',
    data,
  });
}
