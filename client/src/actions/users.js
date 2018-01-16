import api from './../api/api';
import { userLoggedIn } from './auth';
import { USER_UPDATED } from './../actionTypes';

export function userUpdated(user) {
	return {
		type: USER_UPDATED,
		user
	};
}

export const register = data => dispatch =>
	api.user.register(data).then(user => {
		localStorage.holospaceJWT = user.token;
		dispatch(userLoggedIn(user));
	});

export const updateOnlineStatus = data => dispatch =>
	api.user.update(data).then(user => {
		dispatch(userUpdated(user));
	});
