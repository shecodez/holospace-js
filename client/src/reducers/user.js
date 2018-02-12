import {
	USER_LOGGED_IN,
	USER_LOGGED_OUT,
	CURRENT_USER_FETCHED,
	USER_UPDATED,
	LOCAL_MEDIA_STREAM_CREATED,
	LOCAL_MEDIA_STREAM_REMOVED
} from './../actionTypes';

export default function user(state = { loaded: false }, action = {}) {

	switch (action.type) {
		case USER_LOGGED_IN:
			return action.user;

		case CURRENT_USER_FETCHED:
			return { ...state, ...action.user, loaded: true };

		case USER_LOGGED_OUT:
			return { loaded: true };

		case USER_UPDATED:
			return { ...state, ...action.user, loaded: true };

		case LOCAL_MEDIA_STREAM_CREATED:
			return { ...state, stream: action.stream };

		case LOCAL_MEDIA_STREAM_REMOVED:
			return { ...state, stream: null };

		default:
			return state;
	}
}
