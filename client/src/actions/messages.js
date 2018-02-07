import api from './../api/api';
import {
	MESSAGE_CREATED,
	MESSAGE_RECEIVED,
	MESSAGE_UPDATED,
	SET_CHANNEL_MESSAGES
} from './../actionTypes';

export function messageCreated(message) {
	return {
		type: MESSAGE_CREATED,
		message
	};
}

export function messageReceived(message) {
	return {
		type: MESSAGE_RECEIVED,
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

export const createMessage = (data, socket) => dispatch =>
	api.message.create(data).then(message => {
		socket.emit('message:send', (message));
		dispatch(messageCreated(message));
	});

export const updateChatsHistory = (message) => dispatch =>
	dispatch(messageReceived(message));

export const fetchChannelMessages = channelId => dispatch =>
	api.message.fetchChannelMessages(channelId).then(data => {
		dispatch(setChannelMessages(data));
	});

export const updateMessage = (data, socket) => dispatch =>
	api.message.update(data).then(message => {
		socket.emit('message:send', (message));
		dispatch(messageUpdated(message));
	});
