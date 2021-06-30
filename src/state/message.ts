import type { MessageListResType } from '@/services/message'
import type { MessageState } from '@/state/message.d'

// const
const SETMESSAGELIST = 'SETMESSAGELIST'

// action
export const setList = (payload: MessageListResType['_list']) => {
  return {
    type: SETMESSAGELIST,
    payload,
  }
}

// reducers
const INITIAL_STATE: MessageState['message'] = {
  list: [],
}

export default function message(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case SETMESSAGELIST:
      return { ...state, list: payload }
    default:
      return state
  }
}
