import { getUnreadMessage, MessageListResType } from '@/services/message';
import type { MessageStateType } from '@/state/message.d';

// const
const SETMESSAGELIST = 'SETMESSAGELIST';
const MESSAGEINITREFRESH = 'MESSAGEINITREFRESH';
const MESSAGETOTALPAGE = 'MESSAGETOTALPAGE';
const ISREADALL = 'MESSAGE/ISREADALL';

// action
export const setList = (payload: MessageListResType['_list']) => {
  return {
    type: SETMESSAGELIST,
    payload,
  };
};

// 获取消息已读
export function setIsReadAll() {
  return async (dispatch) => {
    const result = await getUnreadMessage();
    dispatch({ type: ISREADALL, payload: result.data.is_show });
  };
}

// 下拉刷新
export const msgRefresh = (payload: MessageListResType['_list']) => {
  return {
    type: MESSAGEINITREFRESH,
    payload,
  };
};

export const setTotalCount = (payload: number) => {
  return (dispath) => {
    dispath({ type: MESSAGETOTALPAGE, payload });
  };
};

const INITIAL_STATE: MessageStateType = {
  list: [] as any,
  page: 1,
  pageSize: 10,
  totalCount: 0,
  isReadAll: false,
};

// reducers
export default function messageReducer(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case SETMESSAGELIST:
      console.log(state.page);
      return { ...state, list: payload, page: state.page + 1 };
    case MESSAGETOTALPAGE:
      return {
        ...state,
        totalCount: payload,
      };
    case MESSAGEINITREFRESH:
      return {
        ...state,
        page: 1,
        pageSize: 10,
        list: payload,
      };
    case ISREADALL:
      return {
        ...state,
        isReadAll: payload,
      };
    default:
      return state;
  }
}
