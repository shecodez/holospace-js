import {
	SET_CHANNEL_MESSAGES,
	MESSAGE_CREATED,
	MESSAGE_UPDATED,
	MESSAGE_RECEIVED
} from "../actionTypes";

export default function messages(state = [], action = {}) {
	switch (action.type) {
		case SET_CHANNEL_MESSAGES:
			return action.channelMessages;

		case MESSAGE_CREATED:
		case MESSAGE_RECEIVED:
			return [...state, action.message];

		case MESSAGE_UPDATED:
			return state.map(item => {
				if (item._id === action.message._id) return action.message;
				return item;
			});

		default:
			return state;
	}
}
