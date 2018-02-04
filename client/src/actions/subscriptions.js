import api from './../api/api';
import { SET_CHANNEL_SUBSCRIBERS } from './../actionTypes';

export const setChannelSubscibers = channelSubscribers => ({
	type: SET_CHANNEL_SUBSCRIBERS,
	channelSubscribers
});

// -----------------------------------------------------------

export const fetchChannelSubscribers = channelId => dispatch =>
	api.subscription.fetchChannelSubscribers(channelId).then(data => {
		dispatch(setChannelSubscibers(data));
	});
