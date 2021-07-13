/* 专辑数据持久化 */
import type { AlbumDetailResType, AlbumDetailParams } from '@/services/album';
import { getMusicAlbumDetail } from '@/services/album';

// const
const LOADING = 'ALBUM/LOADING';
const ERROR = 'ALBUM/ERROR';
const DONE = 'ALBUM/DONE';

// actions
export function getAlbumDetail(params: AlbumDetailParams): any {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: { album_ids: params.album_ids } });
      const { data } = await getMusicAlbumDetail(params);
      dispatch({ type: DONE, payload: { album_ids: params.album_ids, data } });
    } catch (error) {
      dispatch({ type: ERROR, payload: { album_ids: params.album_ids, message: error.message } });
    }
  };
}

// reducers
export type AlbumStateType = {
  albumEunm: Record<
    string,
    {
      data: AlbumDetailResType;
      done: boolean;
      error: boolean;
      loading: boolean;
    }
  >;
};
const INITIALalbumEunm: AlbumStateType = {
  albumEunm: {},
};

export default function album(state = INITIALalbumEunm, { type, payload }) {
  switch (type) {
    case LOADING:
      return {
        albumEunm: {
          ...state.albumEunm,
          [payload.album_ids]: {
            ...state.albumEunm[payload.album_ids],
            loading: true,
          },
        },
      };
    case DONE:
      return {
        albumEunm: {
          ...state.albumEunm,
          [payload.album_ids]: {
            loading: false,
            done: true,
            error: false,
            data: payload.data,
          },
        },
      };
    case ERROR:
      return {
        albumEunm: {
          ...state.albumEunm,
          [payload.album_ids]: {
            loading: false,
            done: false,
            error: payload.message,
          },
        },
      };
    default:
      return state;
  }
}
