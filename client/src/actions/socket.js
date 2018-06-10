import { SOCKET_SET } from "./../actionTypes";

export const socketSet = socket => ({
	type: SOCKET_SET,
	socket
});

export const setSocket = socket => dispatch => {
	dispatch(socketSet(socket));
};
