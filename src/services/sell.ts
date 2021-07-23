import request from '@/utils/request';

// 词曲出售
export function songSale(data) {
  return request('/song/songSale', {
    method: 'POST',
    data,
  });
}

// 词曲认领
export function claimMusicSong(data) {
  return request('/song/claimMusicSong', {
    method: 'GET',
    data,
  });
}
