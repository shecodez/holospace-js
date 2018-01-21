import api from './../api/api';
import { userLoggedIn } from './auth';
import { USER_UPDATED, CURRENT_USER_FETCHED } from './../actionTypes';

export function userUpdated(user) {
	return {
		type: USER_UPDATED,
		user
	};
}

export const currentUserFetched = user => ({
	type: CURRENT_USER_FETCHED,
	user
}); 

export const register = data => dispatch =>
	api.user.register(data).then(user => {
		localStorage.holospaceJWT = user.token;
		dispatch(userLoggedIn(user));
	});

export const updateOnlineStatus = data => dispatch =>
	api.user.update(data).then(user => {
		dispatch(userUpdated(user));
	});

export const fetchCurrentUser = () => dispatch =>
	api.user.fetchCurrentUser().then(user => {
		dispatch(currentUserFetched(user));
	});
