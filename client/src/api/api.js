import axios from "axios";

export default {
	user: {
		login: credentials =>
			axios.post("/api/auth", { credentials }).then(res => res.data.user),
		register: user =>
			axios.post("/api/users", { user }).then(res => res.data.user),
		confirm: token =>
			axios
				.post("/api/auth/confirmation", { token })
				.then(res => res.data.user),
		resendConfirmation: email =>
			axios.post("/api/auth/resend_confirmation", { email }),
		resetPasswordRequest: email =>
			axios.post("/api/auth/reset_password_request", { email }),
		validateToken: token =>
			axios.post("/api/auth/validate_token", { token }),
		resetPassword: data => axios.post("/api/auth/reset_password", { data }),
		fetchCurrentUser: () =>
			axios.get("/api/users/@me").then(res => res.data.user)
	},
	server: {
		create: server =>
			axios.post("/api/servers", { server }).then(res => res.data.server),
		getOne: serverId =>
			axios.get(`/api/servers/${serverId}`).then(res => res.data.server),
		update: server =>
			axios
				.put(`/api/servers/${server._id}`, { server })
				.then(res => res.data.server),
		delete: serverId =>
			axios
				.delete(`/api/servers/${serverId}`)
				.then(res => res.data.server),
		invite: serverId =>
			axios
				.get(`/api/servers/${serverId}/invite`)
				.then(res => res.data.invitation)
	},
	channel: {
		create: channel =>
			axios
				.post("/api/channels", { channel })
				.then(res => res.data.channel),
		getOne: channelId =>
			axios
				.get(`/api/channels/${channelId}`)
				.then(res => res.data.channel),
		update: channel =>
			axios
				.put(`/api/channels/${channel._id}`, { channel })
				.then(res => res.data.channel),
		delete: channelId =>
			axios
				.delete(`/api/channels/${channelId}`)
				.then(res => res.data.channel),
		// TODO:  `/api/servers/${serverId}/channels`
		fetchServerChannels: serverId =>
			axios
				.get(`/api/channels/server/${serverId}`)
				.then(res => res.data.channels)
	},
	message: {
		create: message =>
			axios
				.post("/api/messages", { message })
				.then(res => res.data.message),
		update: message =>
			axios
				.put(`/api/messages/${message._id}`, { message })
				.then(res => res.data.message),
		delete: messageId =>
			axios
				.delete(`/api/messages/${messageId}`)
				.then(res => res.data.message),
		// TODO: `/api/channels/${channelId}/messages`
		fetchChannelMessages: channelId =>
			axios
				.get(`/api/messages/channel/${channelId}`)
				.then(res => res.data.messages)
	},
	membership: {
		create: invitation =>
			axios
				.post("/api/memberships", { invitation })
				.then(res => res.data.membership),
		fetchMemberServers: () => axios.get("/api/memberships/@me/servers"),
		fetchServerMembers: serverId =>
			axios.get(`/api/memberships/${serverId}/members`)
	},
	subscription: {
		fetchDirectChannels: () =>
			axios
				.get(`/api/subscriptions/@me/channels`)
				.then(res => res.data.channels),
		fetchChannelSubscribers: channelId =>
			axios
				.get(`/api/subscriptions/${channelId}/subscribers`)
				.then(res => res.data.subscribers)
	}
};
