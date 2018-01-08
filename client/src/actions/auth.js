import { USER_LOGGED_IN, USER_LOGGED_OUT } from './../actionTypes';
import api from './../api/api';
// import setAuthorizationHeader from '../utils/setAuthorizationHeader';

export const userLoggedIn = user => ({
  type: USER_LOGGED_IN,
  user
});

export const userLoggedOut = () => ({
  type: USER_LOGGED_OUT
});

export const login = credentials => (dispatch) =>
  api.user.login(credentials).then(user => {
    localStorage.holospaceJWT = user.token;
    // setAuthorizationHeader(user.token);
    dispatch(userLoggedIn(user));
  });

export const logout = () => (dispatch) => {
  localStorage.removeItem("holospaceJWT");
  // setAuthorizationHeader();
  dispatch(userLoggedOut());
};
