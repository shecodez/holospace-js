import api from './../api/api';
import { userLoggedIn } from './auth';
import {
	USER_UPDATED,
	CURRENT_USER_FETCHED,
	LOCAL_MEDIA_STREAM_CREATED,
	LOCAL_MEDIA_STREAM_REMOVED
} from './../actionTypes';
import { getLocalUserMedia, stopLocalUserMedia } from './../utils/webRTC';

export const userUpdated = user => ({
	type: USER_UPDATED,
	user
});

export const currentUserFetched = user => ({
	type: CURRENT_USER_FETCHED,
	user
});

export const localMediaStreamCreated = stream => ({
	type: LOCAL_MEDIA_STREAM_CREATED,
	stream
});

export const localMediaStreamRemoved = () => ({
	type: LOCAL_MEDIA_STREAM_REMOVED
});

// ----------------------------------------------------

export const register = data => dispatch =>
	api.user.register(data).then(user => {
		localStorage.holospaceJWT = user.token;
		dispatch(userLoggedIn(user));
	});

export const fetchCurrentUser = () => dispatch =>
	api.user.fetchCurrentUser().then(user => {
		dispatch(currentUserFetched(user));
	});

export const updateUser = data => dispatch => dispatch(userUpdated(data));

export const createLocalMediaStream = () => dispatch =>
	getLocalUserMedia().then(stream => {
		window.stream = stream;
		console.log('createLocalMediaStream', window.stream);
		dispatch(localMediaStreamCreated(stream));
	});

export const removeLocalMediaStream = () => dispatch => {
	stopLocalUserMedia(window.stream);// .then(() => {});
	dispatch(localMediaStreamRemoved());
};
