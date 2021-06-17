// const
export const SET = 'NAVIGATION/SET';

// actions
export const set = (payload) => {
  return {
    type: SET,
    payload,
  };
};
// reducers
const INITIAL_STATE = {};

export default function navigation(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case SET:
      return payload;
    default:
      return state;
  }
}
