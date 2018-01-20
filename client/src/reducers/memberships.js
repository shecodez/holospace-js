import { SET_SERVER_MEMBERS } from './../actionTypes';

export default function memberships(state = [], action = {}) {
	switch (action.type) {
		case SET_SERVER_MEMBERS:
			return action.serverMembers;

		default:
			return state;
	}
}
