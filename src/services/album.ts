import request from '@/utils/request'
import { stringify } from 'querystring'

export function getMusicAlbumDetail(data) {
  return request(`/album/getMusicAlbumDetail?${stringify(data)}`)
}
