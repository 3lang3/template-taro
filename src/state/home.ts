/* 首页数据持久化 */
import type { HomeResType } from '@/services/home';

// const
const SET = 'HOME/SET';

// actions
export const set = (payload) => {
  return {
    type: SET,
    payload,
  };
};

// reducers
export type HomeStateType = {
  home: {
    data: HomeResType;
  };
};
const INITIAL_STATE: HomeStateType['home'] = {
  data: {} as HomeResType,
};

export default function home(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET:
      return {
        data: action.payload,
      };
    default:
      return state;
  }
}
