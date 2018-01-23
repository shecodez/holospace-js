import api from './../api/api';
import {
	MESSAGE_CREATED,
	MESSAGE_UPDATED,
	SET_CHANNEL_MESSAGES
} from './../actionTypes';

export function messageCreated(message) {
	return {
		type: MESSAGE_CREATED,
		message
	};
}

export function setChannelMessages(channelMessages) {
	return {
		type: SET_CHANNEL_MESSAGES,
		channelMessages
	};
}

export function messageUpdated(message) {
	return {
		type: MESSAGE_UPDATED,
		message
	};
}

export const createMessage = data => dispatch =>
	api.message.create(data).then(message => {
		dispatch(messageCreated(message));
	});

export const fetchChannelMessages = channelId => dispatch =>
	api.message.fetchChannelMessages(channelId).then(data => {
		dispatch(setChannelMessages(data));
	});

export const updateMessage = data => dispatch =>
	api.message.update(data).then(message => {
		dispatch(messageUpdated(message));
	});
