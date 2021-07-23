import type { MessageListResType } from '@/services/message';
import type { MessageStateType } from '@/state/message.d';

// const
const SETMESSAGELIST = 'SETMESSAGELIST';
const MESSAGEINITREFRESH = 'MESSAGEINITREFRESH';
const MESSAGETOTALPAGE = 'MESSAGETOTALPAGE';

// action
export const setList = (payload: MessageListResType['_list']) => {
  return {
    type: SETMESSAGELIST,
    payload,
  };
};

// 下拉刷新
export const msgRefresh = (payload: MessageListResType['_list']) => {
  return {
    type: MESSAGEINITREFRESH,
    payload,
  };
};

export const setTotalPage = (payload: number) => {
  return (dispath, state) => {
    const { message } = state();
    if (!message.totalPage) {
      dispath({ type: MESSAGETOTALPAGE, payload });
    }
  };
};

const INITIAL_STATE: MessageStateType = {
  list: [] as any,
  page: 1,
  pageSize: 10,
  totalPage: 0,
};

// reducers
export default function messageReducer(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case SETMESSAGELIST:
      return { ...state, list: payload, page: state.page + 1 };
    case MESSAGETOTALPAGE:
      return {
        ...state,
        totalPage: payload,
      };
    case MESSAGEINITREFRESH:
      return {
        ...state,
        page: 1,
        pageSize: 10,
        list: payload,
        totalPage: 0,
      };
    default:
      return state;
  }
}
