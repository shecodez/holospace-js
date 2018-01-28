import { SET_SERVER_MEMBERS, MEMBER_UPDATED } from './../actionTypes';

export default function memberships(state = [], action = {}) {
	switch (action.type) {
		case SET_SERVER_MEMBERS:
			return action.serverMembers;

		case MEMBER_UPDATED:
      return state.map(item => {
        if (item.email === action.member.email) return action.member;
        return item;
      });

		default:
			return state;
	}
}
