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

export const login = credentials => dispatch =>
	api.user.login(credentials).then(user => {
		localStorage.holospaceJWT = user.token;
		// setAuthorizationHeader(user.token);
		dispatch(userLoggedIn(user));
	});

export const logout = () => dispatch => {
	localStorage.removeItem('holospaceJWT');
	// setAuthorizationHeader();
	dispatch(userLoggedOut());
};

export const confirm = token => dispatch =>
	api.user.confirm(token).then(user => {
		localStorage.holospaceJWT = user.token;
		dispatch(userLoggedIn(user));
	});

export const resendConfirmation = email => () =>
	api.user.resendConfirmation(email);

export const resetPasswordRequest = email => () =>
	api.user.resetPasswordRequest(email);

export const resetPassword = data => () => api.user.resetPassword(data);

export const validateToken = token => () => api.user.validateToken(token);
