// const
const SET = 'HOTBOARD/SET';

// actions
export const set = (payload) => {
  return {
    type: SET,
    payload,
  };
};
// reducers
export type HotBoardStateType = {
  list: any[];
  publish_time: string;
};

const INITIAL_STATE: HotBoardStateType = {
  list: [],
  publish_time: '',
};

export default function list(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case SET:
      return payload;
    default:
      return state;
  }
}
