import api from './../api/api';
import { SET_MEMBER_SERVERS, SET_SERVER_MEMBERS } from '../actionTypes';

export function setMemberServers(memberServers) {
	return {
		type: SET_MEMBER_SERVERS,
		memberServers
	};
}

export function setServerMembers(serverMembers) {
	return {
		type: SET_SERVER_MEMBERS,
		serverMembers
	};
}

export const fetchMemberServers = () => dispatch =>
	api.membership.fetchMemberServers().then(data => {
		dispatch(setMemberServers(data.data.servers));
	});

export const fetchServerMembers = serverId => dispatch =>
	api.membership.fetchServerMembers(serverId).then(data => {
		dispatch(setServerMembers(data.data.members));
	});

/* export const joinServer = data => () =>
    api.membership.create(data); */
