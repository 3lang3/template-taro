import { getMessageList } from '@/services/message';

// const
const SETMESSAGELIST = 'SETMESSAGELIST';

// action
export const setList = (payload) => {
  return {
    type: SETMESSAGELIST,
    payload,
  };
};

// async action
export const setListAsync = () => {
  return (dispatch, state) => {
    const { message } = state();
    if (!message.list.length) {
      getMessageList().then((res) => {
        dispatch(setList(res.data._list));
      });
    }
  };
};

// reducers
const INITIAL_STATE = {
  list: [],
};

export default function message(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case SETMESSAGELIST:
      return { ...state, list: payload };
    default:
      return state;
  }
}
