import { USER_LOGIN_SUCCESS, USER_LOGOUT } from '../actions/types';

const initialState = {
  token: null,
  user_Id: null,
  role: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user_Id: action.payload.user_Id,
        role: action.payload.role,
      };
    case USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}
