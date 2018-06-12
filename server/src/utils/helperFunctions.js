//  this is an array of sockets connected to each
//  user so if the user opens another tab it will
//  be considered another socket of the same user
const addClientToChannel = socket => {
	const { channel, holoTag, iconURL } = socket;

	if (connections[channel]) {
		const i = connections[channel]
			.map(connection => {
				return connection.holoTag;
			})
			.indexOf(holoTag);

		if (i >= 0) {
			let sockets = connections[channel][i].sockets;
			if (!sockets.indexOf(socket.id))
				connections[channel][i].sockets.push(socket.id);
		} else {
			// holoTag is NOT yet in channel so push client
			connections[channel].push({
				holoTag: holoTag,
				iconURL: iconURL,
				sockets: [socket.id]
			});
			setUserOnline(holoTag, true);
		}
	} else {
		// connections[channel] does NOT exist so create it, and push client
		connections[channel] = [];
		connections[channel].push({
			holoTag: holoTag,
			iconURL: iconURL,
			sockets: [socket.id]
		});
		setUserOnline(holoTag, true);
	}
	console.log(JSON.stringify(connections, null, "\t"));
};

// if user has multiple sockets (multiple tabs open)
// dont remove the user from connections[channel]
// unless only one socket is left in their sockets array
// else just remove sockets[disconnectedSocketId].
const removeClientFromChannel = socket => {
	const { channel, holoTag } = socket;

	if (connections[channel]) {
		const i = connections[channel]
			.map(connection => {
				return connection.holoTag;
			})
			.indexOf(holoTag);

		if (i >= 0) {
			let sockets = connections[channel][i].sockets;
			if (sockets.length <= 1) {
				setUserOnline(connections[channel][i].holoTag, false);
				connections[channel].splice(i, 1);
			} else {
				sockets.splice(sockets.indexOf(socket.id), 1);
			}
		}
	}
	console.log(JSON.stringify(connections), null, "\t");
};

// mutating element removal
const remove = (array, element) => {
	const index = array.indexOf(element);

	if (index !== -1) {
		array.splice(index, 1);
	}
};

// non-mutating element removal
const filter = (array, element) => {
	return array.filter(e => e !== element);
};
