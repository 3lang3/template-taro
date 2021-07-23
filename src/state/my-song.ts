import type { MySongStateType } from '@/state/mySong.d';

// const
const SETMYSONGLIST = 'MYSONG/LIST';

// action
export const setList = (payload: MySongStateType['list']) => {
  return {
    type: SETMYSONGLIST,
    payload,
  };
};

const INITIAL_STATE: MySongStateType = {
  list: [] as MySongStateType['list'],
};

// reducers
export default function mySongReducer(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case SETMYSONGLIST:
      return { ...state, list: payload };
    default:
      return state;
  }
}
