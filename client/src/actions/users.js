import api from './../api/api';
import { userLoggedIn } from "./auth";
import { USER_CONNECTED, USER_DISCONNECTED } from './../actionTypes';

export function addUser(user) {
  return {
    type: USER_CONNECTED,
    user
  }
}

export function removeUser(user) {
  return {
    type: USER_DISCONNECTED,
    user
  }
}

export const register = data => (dispatch) =>
  api.user.register(data).then(user => {
    localStorage.holospaceJWT = user.token;
    dispatch(userLoggedIn(user));
  });

export const userConnected = data => (dispatch) =>
  dispatch(addUser(data));

export const userDisconnected = data => (dispatch) =>
  dispatch(removeUser(data));
