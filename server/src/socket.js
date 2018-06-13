import db from "./models";

exports = module.exports = function(io) {
	let clients = {};

	function Client(socket) {
		this.id = socket.id;
		this.holoTag = socket.holoTag || socket.id;
		this.icon = socket.icon;
	}

	function Player(socket) {
		this.id = socket.id;
		this.holoTag = socket.holoTag || socket.id;
		this.position = [0, 0, 0];
		this.rotation = [0, 0, 0];
		this.entity = null;
	}

	io.on("connection", socket => {
		console.log(`New client connected: ${socket.id}`);

		socket.on("disconnect", () => {
			console.log(`${socket.holoTag} client disconnected: ${socket.id}`);

			removeClient(socket);

			// delete players[socket.id];
			if (socket.channel) delete clients[socket.channel][socket.id];

			// Sends everyone except the connecting player data about the disconnected player.
			socket.broadcast.emit("client:disconnected", socket.id);

			io.sockets.emit("clients:update", clients);
			socket.broadcast.emit(
				"user:left",
				`${socket.holoTag} disconnected`
			);

			if (socket.channel) socket.leave(socket.channel);

			setUserOnline(socket.holoTag, false);
		});

		socket.on("user:init", data => {
			setUserOnline(data.holoTag, true);

			socket.icon = data.icon;
			socket.holoTag = data.holoTag;
			// socket.position = { x: data.position.x, y: data.position.y, z: data.position.z };
			// socket.rotation = { x: data.rotation.x, y: data.rotation.y, z: data.rotation.z };
		});

		//--------------------------------------------------------------------
		// Manage VoIP
		//--------------------------------------------------------------------
		socket.on("voip:init", data => {
			console.log(
				`${socket.holoTag} init voip channel: ${socket.channel}`
			);
		});

		socket.on("voip:send", data => {
			socket.broadcast.to(data.channel).emit("voip:recv", data.blob);
		});

		//--------------------------------------------------------------------
		// Manage HoloSpace
		//--------------------------------------------------------------------
		socket.on("player:init", function(channel) {
			console.log(
				`${socket.holoTag} init holo channel: ${socket.channel}`
			);

			const newPlayer = new Player(socket);
			// players[socket.id] = newPlayer;

			socket.channel = channel || "DeepSpace";
			socket.join(channel);
			newPlayer.channel = socket.channel;

			clients[socket.channel] = clients[socket.channel] || {};
			clients[socket.channel][socket.id] =
				clients[socket.channel][socket.id] || {};
			clients[socket.channel][socket.id] = { ...newPlayer };

			// Send the connecting player her unique ID,
			// and data about the other players already connected.
			socket.emit("player:data", {
				player: newPlayer,
				others: clients[socket.channel]
			});

			// Send everyone except the connecting player data about the new player.
			// io.to(socket.channel).emit('player:joined', newPlayer);
			socket.broadcast.emit("player:joined", newPlayer);
		});

		socket.on("position:update", function(data) {
			if (!clients[socket.channel][data.id]) return;
			clients[socket.channel][data.id].position = [
				data.x,
				data.y,
				data.z
			];

			// io.in(socket.channel).emit('move:player', data);
			socket.broadcast.emit("move:player", data);
		});

		socket.on("rotation:update", function(data) {
			if (!clients[socket.channel][data.id]) return;
			clients[socket.channel][data.id].rotation = [
				data.x,
				data.y,
				data.z
			];

			// io.in(socket.channel).emit('turn:player', data);
			socket.broadcast.emit("turn:player", data);
		});

		socket.on("player:exit", function(data) {
			console.log(
				`${socket.id} exiting holospace channel: ${socket.channel}`
			);

			// delete players[data];
			delete clients[socket.channel][data];

			// Sends everyone except the connecting player data about the disconnected player.
			socket.broadcast.emit("client:disconnected", data);
		});

		//--------------------------------------------------------------------
		// Manage Channels
		//--------------------------------------------------------------------
		socket.on("channel:join", channel => {
			/* if (clients[channel].length > 99)
				socket.emit('channel:full', channel); */

			console.log(`${socket.holoTag} joined channel: ${channel}`);

			socket.channel = channel; // socket.server = channel.server_id;
			addClient(socket);
			socket.join(channel);

			socket.broadcast
				.to(socket.channel)
				.emit("user:join", `${socket.holoTag} joined your channel`);

			// TODO: only need to emit to the server the channel belongs to
			io.sockets.emit("clients:update", clients);
		});

		socket.on("channel:switch", newChannel => {
			if (socket.channel) {
				socket.broadcast
					.to(socket.channel)
					.emit("user:left", `${socket.holoTag} left your channel`);

				removeClient(socket);
				socket.leave(socket.channel);
			}
			console.log(`${socket.holoTag} switched channel: ${newChannel}`);

			socket.channel = newChannel;
			addClient(socket);
			socket.join(newChannel);

			socket.broadcast
				.to(newChannel)
				.emit("user:join", `${socket.holoTag} joined your channel`);

			//socket.emit('clients:update', clients);
			io.sockets.emit("clients:update", clients);
		});

		socket.on("channel:left", channel => {
			if (socket.channel) {
				console.log(`${socket.holoTag} left channel: ${channel}`);
				removeClient(socket);

				socket.broadcast
					.to(socket.channel)
					.emit("user:left", `${socket.holoTag} left your channel`);

				socket.leave(channel);

				io.sockets.emit("clients:update", clients);
			}
		});

		socket.on("message:send", message => {
			socket.broadcast
				.to(message.channel_id)
				.emit("message:recv", message);
		});

		socket.on("user:typing", data => {
			socket.broadcast.to(data.channel).emit("user:typing", data);
		});

		socket.on("stop:typing", data => {
			socket.broadcast.to(data.channel).emit("stop:typing", data);
		});
	});

	const addClient = socket => {
		const newClient = new Client(socket);

		clients[socket.channel] = clients[socket.channel] || {};
		clients[socket.channel][socket.id] =
			clients[socket.channel][socket.id] || {};
		clients[socket.channel][socket.id] = { ...newClient };

		// setUserOnline(socket.holoTag, true);
		console.log("add", JSON.stringify(clients, null, "\t"));
	};

	const removeClient = socket => {
		if (socket.channel) delete clients[socket.channel][socket.id];
		console.log("remove", JSON.stringify(clients, null, "\t"));
	};

	/* TODO: io.sockets.emit("presence:update", { 
		user.email, online: user.online 
	}); */
	const setUserOnline = (holoTag, online) => {
		if (holoTag && holoTag !== undefined && holoTag !== null) {
			const username = holoTag.slice(0, -5);
			const pin = holoTag.slice(-4);
			db.User.findOneAndUpdate(
				{ username, pin },
				{
					$set: { online }
				},
				{ new: true }
			)
				.then(user => {
					io.sockets.emit("user:update", {
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
					console.log(`${holoTag}: online--${online}`);
				})
				.catch(err => {
					console.log(err);
				});
		} else {
			console.log("err @ setUserOnline holoTag: ", holoTag);
		}
	};
};

/* module.exports = (socket) => {
  var online = Object.keys(socket.engine.clients);
  socket.emit('init', JSON.stringify(online));
};*/
