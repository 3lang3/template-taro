// const
const SETMESSAGELIST = 'SETMESSAGELIST'

// action
export const setList = (payload) => {
  return {
    type: SETMESSAGELIST,
    payload,
  }
}

// reducers
const INITIAL_STATE = {
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
