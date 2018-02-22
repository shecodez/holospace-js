import api from './../api/api';
import { SET_MEMBER_SERVERS, SET_SERVER_MEMBERS, MEMBER_UPDATED, MEMBERSHIP_CREATED } from './../actionTypes';

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

export const memberUpdated = member => ({
	type: MEMBER_UPDATED,
	member
});

export function membershipCreated(membership) {
	return {
		type: MEMBERSHIP_CREATED,
		membership
	};
}

// -----------------------------------------------------------

export const fetchMemberServers = () => dispatch =>
	api.membership.fetchMemberServers().then(data => {
		dispatch(setMemberServers(data.data.servers));
	});

export const fetchServerMembers = serverId => dispatch =>
	api.membership.fetchServerMembers(serverId).then(data => {
		dispatch(setServerMembers(data.data.members));
	});

export const updateMember = data => dispatch =>
	dispatch(memberUpdated(data));

export const createMembership = invitation => dispatch =>
	api.membership.create(invitation).then(membership => {
		dispatch(membershipCreated(membership));
		return membership;
	});
