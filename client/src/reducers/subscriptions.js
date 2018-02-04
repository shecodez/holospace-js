import { SET_CHANNEL_SUBSCRIBERS } from './../actionTypes';

export default function subscriptions(state = [], action = {}) {
	switch (action.type) {
		case SET_CHANNEL_SUBSCRIBERS:
			return action.channelSubscribers;

		default:
			return state;
	}
}
