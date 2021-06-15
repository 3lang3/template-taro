import { getCurrentUser } from '@/services/global';

// const
export const LOADING = 'USER/LOADING';
export const DONE = 'USER/DONE';
export const ERROR = 'USER/ERROR';
export const LOGOUT = 'USER/LOGOUT';

// actions
export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export function getUser() {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING });
      const { data } = await getCurrentUser();
      dispatch({ type: DONE, payload: data });
    } catch (error) {
      dispatch({ type: ERROR, payload: error.message });
    }
  };
}

// reducers
const INITIAL_STATE = {
  loading: false,
  error: false,
  done: false,
  data: {},
};

export default function user(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case LOGOUT:
      return INITIAL_STATE;
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case DONE:
      return {
        ...state,
        loading: false,
        error: false,
        done: true,
      };
    case ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
        done: true,
      };
    default:
      return state;
  }
}
