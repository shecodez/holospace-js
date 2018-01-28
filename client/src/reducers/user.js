import {
	USER_LOGGED_IN,
	USER_LOGGED_OUT,
	CURRENT_USER_FETCHED,
	USER_UPDATED,
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

		default:
			return state;
	}
}
