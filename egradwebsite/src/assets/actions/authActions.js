import axios from 'axios';
import { USER_LOGIN_SUCCESS, USER_LOGOUT } from './types';

export const loginUser = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:5001/Login/login', { email, password });
    const { token, user_Id, role } = response.data;

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: { token, user_Id, role },
    });

    return { user_Id, role }; // Return user_Id and role for further navigation
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Invalid email or password');
  }
};

export const logoutUser = () => ({
  type: USER_LOGOUT,
});
