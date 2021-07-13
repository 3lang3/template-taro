// const
// 存储省市区数据
export const SET_REGION = 'OTHER/REGION';

// actions
export const setRegion = (payload) => {
  return {
    type: SET_REGION,
    payload,
  };
};

// reducers
export type OtherStateType = {
  region: any[];
};

const INITIAL_STATE: OtherStateType = {
  region: [],
};

export default function other(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case SET_REGION:
      return { ...state, region: payload };
    default:
      return state;
  }
}
