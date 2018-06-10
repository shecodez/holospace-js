import { SOCKET_SET } from "./../actionTypes";

export default function socket(state = {}, action = {}) {
	switch (action.type) {
		case SOCKET_SET:
			return { socket: action.socket };
		default:
			return state;
	}
}
