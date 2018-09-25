import {
	SET_SERVER_MEMBERS,
	MEMBER_UPDATED,
	MEMBERSHIP_CREATED
} from "./../actionTypes";

export default function memberships(state = [], action = {}) {
	switch (action.type) {
		case SET_SERVER_MEMBERS:
			return action.serverMembers;

		case MEMBER_UPDATED:
			return state.map(item => {
				if (item.email === action.member.email)
					return Object.assign({}, item, action.member);
				return item;
			});

		case MEMBERSHIP_CREATED:
			return [...state, action.membership.member_id];

		default:
			return state;
	}
}
