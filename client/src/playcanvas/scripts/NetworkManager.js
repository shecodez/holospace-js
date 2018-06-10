import io from "socket.io-client";

const pc = window.pc;

export const NetworkManagerScript = channel => {
	const Network = pc.createScript("network");

	Network.id = null;
	Network.socket = null;

	// initialize code called once per entity
	Network.prototype.initialize = function() {
		this.holoSpace = this.app.root.findByName("HoloSpace").script.holoSpace;

		const socket = io.connect("https://ten-forward.glitch.me");
		Network.socket = socket;

		// get channel's terrain.json from server

		this.players = {};
		this.initialized = false;

		const network = this;
		socket.on("player:data", data => {
			network.initPlayers(data);
		});

		socket.on("player:joined", data => {
			network.spawnPlayer(data);
		});

		socket.on("move:player", data => {
			network.movePlayer(data);
		});

		socket.on("client:disconnected", data => {
			network.removePlayer(data);
		});
	};

	Network.prototype.join = function() {
		Network.socket.emit("player:init", channel);
	};

	Network.prototype.initPlayers = function(data) {
		// Create a player array and populate it with the currently connected players.
		this.players = data.others;

		// Keep track of this player ID.
		Network.id = data.player.id;
		if (!this.holoSpace.joined) {
			// console.log('PLAYER:', data.player);
			this.player = this.holoSpace.join(data.player);
			this.app.root.addChild(this.player);
		}

		// For every player already connected, spawn that player.
		for (var id in this.players) {
			if (id !== Network.id) {
				// console.log("initPlayer: ", holosmith);
				this.players[id].entity = this.holoSpace.spawnHolosmith(
					this.players[id],
					false
				);
				// this.app.root.findByName('Others').getParent().addChild(this.players[data.id].entity);
				this.app.root.addChild(this.players[id].entity);
			}
		}

		// The client has received data from the server.
		this.initialized = true;
		console.log("Initialized", this.initialized);
	};

	Network.prototype.spawnPlayer = function(data) {
		// console.log('spawnPlayer: ', data);
		if (this.initialized) {
			this.players[data.id] = data;
			this.players[data.id].entity = this.holoSpace.spawnHolosmith(
				data,
				false
			);
			// this.app.root.findByName('Others').getParent().addChild(this.players[data.id].entity);
			this.app.root.addChild(this.players[data.id].entity);
		}
	};

	Network.prototype.movePlayer = function(data) {
		if (!this.players[data.id] || this.players[data.id].deleted) return;

		if (this.initialized) {
			this.players[data.id].entity.rigidbody.teleport(
				data.x,
				data.y,
				data.z
			);
		}
	};

	Network.prototype.removePlayer = function(id) {
		if (!this.player[id]) return;
		if (this.players[id].entity && this.players[id].entity !== undefined) {
			this.players[id].entity.destroy();
		}
		delete this.players[id];
	};

	Network.prototype.exit = function() {
		for (var id in this.players) {
			if (id !== Network.id) {
				this.removePlayer(id);
			}
		}

		if (this.player) this.player.destroy();
		Network.socket.emit("player:exit", Network.id);
		this.initialized = false;
		console.log("Exiting HoloSpace");
		this.holoSpace.exit();
	};

	// update code called every frame
	Network.prototype.update = function(dt) {
		this.updatePosition();
	};

	Network.prototype.updatePosition = function() {
		if (this.initialized) {
			const pos = this.player.getPosition();
			Network.socket.emit("position:update", {
				id: Network.id,
				x: pos.x,
				y: pos.y,
				z: pos.z
			});
		}
	};
};
