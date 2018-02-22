import api from './../api/api';
import { SERVER_CREATED, SERVER_FETCHED, SERVER_UPDATED } from './../actionTypes';

export function serverCreated(server) {
	return {
		type: SERVER_CREATED,
		server
	};
}

export function serverFetched(server) {
	return {
		type: SERVER_FETCHED,
		server
	};
}

export function serverUpdated(server) {
	return {
		type: SERVER_UPDATED,
		server
	};
}


// ---------------------------------------------------
export const createServer = data => dispatch =>
	api.server.create(data).then(server => {
		dispatch(serverCreated(server));
	});

export const fetchServer = byId => dispatch =>
	api.server.getOne(byId).then(server => {
		dispatch(serverFetched(server));
	});

export const updateServer = data => dispatch =>
	api.server.update(data).then(server => {
		dispatch(serverUpdated(server));
	});
