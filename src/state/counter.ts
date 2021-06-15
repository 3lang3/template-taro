// const
export const ADD = "COUNTER/ADD";
export const MINUS = "COUNTER/MINUS";

// actions
export const add = () => {
  return {
    type: ADD,
  };
};
export const minus = () => {
  return {
    type: MINUS,
  };
};

// async action
export function asyncAdd() {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(add());
    }, 2000);
  };
}

// reducers
const INITIAL_STATE = {
  num: 0,
};

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        num: state.num + 1,
      };
    case MINUS:
      return {
        ...state,
        num: state.num - 1,
      };
    default:
      return state;
  }
}
