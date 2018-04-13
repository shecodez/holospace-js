import db from './models';

// TODO: change userTag to holoTag
exports = module.exports = function(io) {
	let connections = {};

	let clients = {};
	let players = {};


	function Player (socket) {
		this.id = socket.id;
		this.holoTag = socket.userTag || socket.id;
		this.position = [0, 0, 0];
		this.rotation = [0, 0, 0];
		this.entity = null;
	};

	io.on('connection', socket => {
		console.log(`New client connected: ${socket.id}`);

		socket.on('disconnect', () => {
			console.log(`${socket.userTag} disconnected: ${socket.id}`);

			removeClientFromChannel(socket);

			delete players[socket.id];
			if (socket.channel)
			 	delete clients[socket.channel][socket.id]; // delete clients[socket.channel][socket.id]

			// Sends everyone except the connecting player data about the disconnected player.
			socket.broadcast.emit('player:disconnected', socket.id);

			io.sockets.emit('connections:update', connections);
			socket.broadcast.emit('user:left', `${socket.userTag} disconnected`);

			socket.leave(socket.channel);
		});

		socket.on('user:init', data => {
			setUserOnline(data.userTag, true);

			socket.iconURL = data.iconURL;
			socket.userTag = data.userTag;
			// socket.position = { x: data.position.x, y: data.position.y, z: data.position.z };
			// socket.rotation = { x: data.rotation.x, y: data.rotation.y, z: data.rotation.z };
		});

		//--------------------------------------------------------------------
		// Manage VoIP
		//--------------------------------------------------------------------
		socket.on('voip:init', data => {
			console.log(`${socket.userTag} init voice connection to channel ${socket.channel}`);
		});

		socket.on('voip:send', data => {
			socket.broadcast.to(data.channel).emit('voip:recv', data.blob);
		});

		//--------------------------------------------------------------------
		// Manage VR
		//--------------------------------------------------------------------
		socket.on('player:init', function (channel) {
				console.log(`${socket.userTag} init VR connection to channel ${socket.channel}`);

				let newPlayer = new Player(socket);
				players[socket.id] = newPlayer;

				socket.channel = channel || "DeepSpace";
				socket.join(channel);
				clients[socket.channel] = clients[socket.channel] || {};
				clients[socket.channel][socket.id] = clients[socket.channel][socket.id] || {};
				clients[socket.channel][socket.id] = newPlayer;

				console.log('-- vr clients -----------------------');
				console.log(JSON.stringify(clients));
				console.log('-------------------------------------');

				// send connecting client her username and data about the other connected players
				socket.emit('player:data', { player: new Player(socket), others: clients[socket.channel] });

				// Sends everyone except the connecting client data about the new player.
				socket.broadcast.to(socket.channel).emit('player:joined', newPlayer);
				//socket.broadcast.emit('player:joined', newPlayer);
    });

		socket.on('position:update', function (data) {
			if(!players[data.id]) return;
      players[data.id].position = [data.x, data.y, data.z];

      socket.broadcast.emit('player:moved', data);
    });

		socket.on('rotation:update', function (data) {
			if(!players[data.id]) return;
      players[data.id].rotation = [data.x, data.y, data.z];

      socket.broadcast.emit('player:turned', data);
    });

		socket.on('player:exit', function (data) {
				delete players[data];

				if (socket.channel)
				 	delete clients[socket.channel][socket.id];

				// Sends everyone except the connecting player data about the disconnected player.
        socket.broadcast.emit('player:disconnected', data);
    });

		//--------------------------------------------------------------------
		// Manage Channels
		//--------------------------------------------------------------------
		socket.on('channel:join', data => {
			/* const channel = io.sockets.adapter.rooms[data.channel];
			if (channel.length > 99)
				socket.emit('channel:full', data.channel); */

			console.log(`${socket.userTag} joined ${data.channel}`);

			// socket.server = data.server;
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

	const setUserOnline = (userTag, online) => {
		if (userTag) {
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
		}
	};
};

/* module.exports = (socket) => {
  var online = Object.keys(socket.engine.clients);
  socket.emit('init', JSON.stringify(online));
};*/
