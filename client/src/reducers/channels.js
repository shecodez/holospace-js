import {
	SET_SERVER_CHANNELS,
	CHANNEL_CREATED,
	CHANNEL_FETCHED,
	CHANNEL_UPDATED
} from './../actionTypes';

export default function channels(state = [], action = {}) {
	switch (action.type) {
		case SET_SERVER_CHANNELS:
			return action.serverChannels;

		case CHANNEL_CREATED:
			return [...state, action.channel];

		case CHANNEL_FETCHED: {
			const index = state.findIndex(item => item._id === action.channel._id);
			if (index > -1) {
				return state.map(item => {
					if (item._id === action.channel._id) return action.channel;
					return item;
				});
			}
			return [...state, action.channel];
		}

		case CHANNEL_UPDATED:
			return state.map(item => {
				if (item._id === action.channel._id) return action.channel;
				return item;
			});

		default:
			return state;
	}
}
