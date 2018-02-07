import db from './models';

exports = module.exports = function(io) {
	let connections = {};

	io.on('connection', socket => {
		console.log(`New client connected: ${socket.id}`);

		socket.on('disconnect', () => {
			console.log(`${socket.userTag} disconnected: ${socket.id}`);

			removeClientFromChannel(socket);

			io.sockets.emit('connections:update', connections);
			socket.broadcast.emit('user:left', `${socket.userTag} disconnected`);

			socket.leave(socket.channel);
		});

		socket.on('user:init', data => {
			setUserOnline(data.userTag, true);

			socket.iconURL = data.iconURL;
			socket.userTag = data.userTag;
		});

		socket.on('voip:init', data => {
			console.log(`${socket.userTag} init p2p connection for channel ${socket.channel}`);
			// socket.broadcast.to(socket.channel).emit('voip:init', data);
		});

		socket.on('channel:join', data => {
			console.log(`${socket.userTag} joined ${data.channel}`);

			socket.channel = data.channel;

			addClientToChannel(socket);

			socket.join(data.channel);

			socket.broadcast
				.to(socket.channel)
				.emit('user:join', `${socket.userTag} joined your channel`);

			// TODO: only need to emit to the server the channel belongs to
			//socket.emit('connections:update', connections);
			io.sockets.emit('connections:update', connections);
		});

		socket.on('channel:switch', newChannel => {
			if (socket.channel) {
				removeClientFromChannel(socket);
				socket.leave(socket.channel);
			}

			socket.join(newChannel);
			console.log(`${socket.username} switched to ${newChannel}`);

			socket.broadcast
				.to(socket.channel)
				.emit('user:left', `${socket.username} left your channel`);

			socket.channel = newChannel;
			addClientToChannel(socket);
			socket.broadcast
				.to(newChannel)
				.emit('user:join', `${socket.username} joined your channel`);

			//socket.emit('connections:update', connections);
			io.sockets.emit('connections:update', connections);
		});

		socket.on('channel:left', channel => {
			if (socket.channel) {
				console.log(`${socket.username} left ${channel}`);
				removeClientFromChannel(socket);

				socket.broadcast
					.to(socket.channel)
					.emit('user:left', `${socket.username} left your channel`);

				socket.leave(channel);

				io.sockets.emit('connections:update', connections);
			}
		});

		socket.on('message:send', (message) => {
			socket.broadcast.to(message.channel_id).emit('message:recv', message);
		});

		socket.on('user:typing', (data) => {
      socket.broadcast.to(data.channel).emit('user:typing', data);
    });

    socket.on('stop:typing', (data) => {
      socket.broadcast.to(data.channel).emit('stop:typing', data);
    });
	});

	//  this is an array of sockets connected to each
	//  user so if the user opens another tab it will
	//  be considered another socket of the same user
	const addClientToChannel = socket => {

		const { channel, userTag, iconURL } = socket;

		if (connections[channel]) {
			const i = connections[channel]
				.map(connection => {
					return connection.userTag;
				})
				.indexOf(userTag);

			if (i >= 0) {
				let sockets = connections[channel][i].sockets;
				if (!sockets.indexOf(socket.id))
					connections[channel][i].sockets.push(socket.id);
			} else {
				// userTag is NOT yet in channel so push client
				connections[channel].push({
					userTag: userTag,
					iconURL: iconURL,
					sockets: [socket.id]
				});
				setUserOnline(userTag, true);
			}
		} else {
			// connections[channel] does NOT exist so create it, and push client
			connections[channel] = [];
			connections[channel].push({
				userTag: userTag,
				iconURL: iconURL,
				sockets: [socket.id]
			});
			setUserOnline(userTag, true);
		}
		console.log(JSON.stringify(connections, null, '\t'));
	};

	// if user has multiple sockets (multiple tabs open)
	// dont remove the user from connections[channel]
	// unless only one socket is left in their sockets array
	// else just remove sockets[disconnectedSocketId].
	const removeClientFromChannel = socket => {

		const { channel, userTag } = socket;

		if (connections[channel]) {
			const i = connections[channel]
				.map(connection => {
					return connection.userTag;
				})
				.indexOf(userTag);

			if (i >= 0) {
				let sockets = connections[channel][i].sockets;
				if (sockets.length <= 1) {
					setUserOnline(connections[channel][i].userTag, false);
					connections[channel].splice(i, 1);
				} else {
					sockets.splice(sockets.indexOf(socket.id), 1);
				}
			}
		}
		console.log(JSON.stringify(connections), null, '\t');
	};

	const setUserOnline = (userTag, online) => {
		const username = userTag.slice(0, -5);
		const pin = userTag.slice(-4);
		db.User.findOneAndUpdate(
			{ username, pin },
			{
				$set: { online }
			},
			{ new: true }
		)
			.then(user => {
				io.sockets.emit('user:update', {
      		user: {
      			avatar: user.avatar,
      			email: user.email,
      			username: user.username,
      			pin: user.pin,
      			online: user.online,
      			status: user.status,
      			confirmed: user.confirmed,
						joined: user.createdAt
      		}
      	});
				console.log(`${userTag}: ${online}`);
			})
			.catch(err => {
				console.log(err);
			});
	};
};

/* module.exports = (socket) => {
  var online = Object.keys(socket.engine.clients);
  socket.emit('init', JSON.stringify(online));
};*/
