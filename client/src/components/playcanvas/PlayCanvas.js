import React from 'react';
import PropTypes from 'prop-types';
// import io from 'socket.io-client';

const pc = window.pc;
// Load Asset(name, type, file, [data])
// https://developer.playcanvas.com/en/api/pc.Asset.html#Asset
const assets = [
	new pc.Asset('Montserrat-Black.json', 'font', {
		url: '/fonts/Montserrat-Black/Montserrat-Black.json'
	}),
	new pc.Asset('support.png', 'texture', { url: '/textures/support.png' }),
	new pc.Asset('gear.png', 'texture', { url: '/textures/gear.png' })
];

// TODO: this script will be HYYUUUUUGGGGEEEEEE without making playcanvas react friendly
class PlayCanvas extends React.Component {
	state = {};

	componentDidMount() {
		this.createHoloSpaceApp();
		// console.log(window.pc);
	}

	componentWillUnmount() {
		window.removeEventListener('resize');
	}

	createHoloSpaceApp = () => {
		const { width, height } = this.props;

		const canvas = this.canvas;
		canvas.focus(); // focus the canvas for keyboard input
		canvas.width = width;
		canvas.height = height;

		const app = new pc.Application(canvas, {
			elementInput: new pc.ElementInput(canvas),
			mouse: new pc.Mouse(canvas),
			keyboard: new pc.Keyboard(window)
		});

		// Fill the available space at full resolution
		app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
		app.setCanvasResolution(pc.RESOLUTION_AUTO);

		// use device pixel ratio
		// app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;

		app.start();

		let count = 0;
		const onLoadComplete = this.onLoadComplete;
		app.assets.on('load', function() {
			count += 1;
			if (count === assets.length) {
				onLoadComplete();
			}
		});

		for (let i = 0; i < assets.length; i += 1) {
			app.assets.add(assets[i]);
			app.assets.load(assets[i]);
		}

		// Set the gravity for our rigid bodies
		app.systems.rigidbody.setGravity(0, -9.8, 0);

		// Create Entities
		const camera = this.createCameraEntity(
			'Scene Camera',
			{ x: 0, y: 3, z: 10 },
			{ x: -3.5, y: 0, z: 0 }
		);
		// camera.translate(0, 10, 15);
		// camera.lookAt(0, 0, 0);
		const light = this.createLightEntity(
			'Directional Light',
			{ x: 0, y: 14.75, z: 0 },
			{ x: -45, y: 0, z: -45 }
		);

		const holoSpace = this.createHoloSpaceManager();
		const network = this.createNetworkManager();
		const bounds = this.createInvisibleBoundary();

		// Add to hierachy
		app.root.addChild(light);
		app.root.addChild(camera);
		app.root.addChild(bounds.floor);
		app.root.addChild(holoSpace);
		app.root.addChild(network);

		// Create Scripts
		this.createUserInterfaceScript();
		this.createFirstPersonMovementScript();
		this.createHoloSpaceManagerScript();
		this.createNetworkManagerScript(this.props.socket, this.props.channelId);
		this.createBillboardScript();
		this.createTextScript();

		// Add holoSpaceManager to holospace entity
		holoSpace.addComponent('script');
		holoSpace.script.create('holoSpace');

		// Add NetworkManager to network entity
		network.addComponent('script');
		network.script.create('network');

		// Resize the canvas when the window is resized
		app.resizeCanvas(width, height);
	};

	// called when all assets are loaded
	onLoadComplete = () => {
		// use nearest filtering on pixelized textures to prevent leaks
		for (let i = 0; i < assets.length; i += 1) {
			if (assets[i].type === 'texture') {
				assets[i].resource.minFilter = pc.FILTER_NEAREST;
				assets[i].resource.magFilter = pc.FILTER_NEAREST;
			}
		}

		const UI = this.createHoloSpaceUI();
		pc.app.root.addChild(UI);
	};

	createHoloSpaceManager = () => {
		const holoSpaceManager = new pc.Entity();
		holoSpaceManager.name = 'HoloSpace';

		return holoSpaceManager;
	};

	createNetworkManager = () => {
		const networkManager = new pc.Entity();
		networkManager.name = 'Network';

		return networkManager;
	};

	createHoloSpaceUI = () => {
		const UI = new pc.Entity();
		UI.name = 'UI';
		UI.addComponent('script');
		UI.script.create('userInterface');

		const joinMenu = new pc.Entity();
		joinMenu.name = 'Join Screen';
		joinMenu.addComponent('screen', {
			resolution: new pc.Vec2(640, 480),
			screenSpace: true
		});
		joinMenu.screen.scaleMode = 'blend';
		joinMenu.screen.referenceResolution = new pc.Vec2(1280, 720);

		const channelLabel = new pc.Entity();
		channelLabel.name = 'Channel Name';
		channelLabel.addComponent('element', {
			anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
			pivot: new pc.Vec2(0.5, 0.5),
			type: pc.ELEMENTTYPE_TEXT,
			text: 'Welcome!', // welcome to
			fontSize: 32,
			fontAsset: assets[0],
			color: new pc.Color(1, 1, 1),
			opacity: 1
		});
		channelLabel.translateLocal(0, 100, 0);
		joinMenu.addChild(channelLabel);

		const holoTag = new pc.Entity();
		holoTag.name = 'HoloTag';
		holoTag.addComponent('element', {
			anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
			pivot: new pc.Vec2(0.5, 0.5),
			type: pc.ELEMENTTYPE_TEXT,
			text: 'click below to', // server.owner_id.username's channel.name
			fontSize: 32,
			fontAsset: assets[0],
			color: new pc.Color(1, 1, 1),
			opacity: 1
		});
		holoTag.translateLocal(0, 50, 0);
		joinMenu.addChild(holoTag);

		const join = new pc.Entity();
		join.name = 'Join';
		join.addComponent('element', {
			anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
			pivot: new pc.Vec2(0.5, 0.5),
			type: pc.ELEMENTTYPE_TEXT,
			text: 'Join this HoloSpace',
			fontSize: 48,
			fontAsset: assets[0],
			useInput: true,
			color: new pc.Color(1, 1, 1),
			opacity: 1
		});
		join.translateLocal(0, -50, 0);
		joinMenu.addChild(join);

		const helpIcon = new pc.Entity();
		helpIcon.name = 'Help Btn';
		helpIcon.addComponent('element', {
			anchor: new pc.Vec4(1, 0, 1, 0),
			pivot: new pc.Vec2(1, 0),
			width: 64,
			height: 64,
			type: pc.ELEMENTTYPE_IMAGE,
			rect: [0, 0, 1, 1],
			textureAsset: assets[1],
			useInput: true
		});
		helpIcon.element.rect = [0, 0, 1, 1];
		helpIcon.setLocalPosition(-125, 50, 0);
		joinMenu.addChild(helpIcon);

		const settingsIcon = new pc.Entity();
		settingsIcon.name = 'Settings';
		settingsIcon.addComponent('element', {
			anchor: new pc.Vec4(1, 0, 1, 0),
			pivot: new pc.Vec2(1, 0),
			width: 64,
			height: 64,
			type: pc.ELEMENTTYPE_IMAGE,
			rect: [0, 0, 1, 1],
			textureAsset: assets[2],
			useInput: true
		});
		settingsIcon.element.rect = [0, 0, 1, 1];
		settingsIcon.setLocalPosition(-50, 50, 0);
		joinMenu.addChild(settingsIcon);

		joinMenu.enabled = false;
		UI.addChild(joinMenu);

		const inGameUI = new pc.Entity();
		inGameUI.name = 'InGame UI Screen';
		inGameUI.addComponent('screen', {
			resolution: new pc.Vec2(640, 480),
			screenSpace: true
		});
		inGameUI.screen.scaleMode = 'blend';
		inGameUI.screen.referenceResolution = new pc.Vec2(1280, 720);

		const exit = new pc.Entity();
		exit.name = 'Exit';
		exit.addComponent('element', {
			anchor: new pc.Vec4(0, 1, 0, 1),
			pivot: new pc.Vec2(0, 1),
			type: pc.ELEMENTTYPE_TEXT,
			text: 'Exit this HoloSpace',
			fontSize: 32,
			fontAsset: assets[0],
			useInput: true,
			color: new pc.Color(1, 1, 1),
			opacity: 1
		});
		exit.translateLocal(10, -10, 0);
		inGameUI.addChild(exit);

		inGameUI.enabled = false;
		UI.addChild(inGameUI);

		const helpMenu = new pc.Entity();
		helpMenu.name = 'Help Screen';
		helpMenu.addComponent('screen', {
			resolution: new pc.Vec2(640, 480),
			screenSpace: true
		});
		helpMenu.screen.scaleMode = 'blend';
		helpMenu.screen.referenceResolution = new pc.Vec2(1280, 720);

		const controls = new pc.Entity();
		controls.name = 'Controls';
		controls.addComponent('element', {
			anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
			pivot: new pc.Vec2(0.5, 0.5),
			type: pc.ELEMENTTYPE_TEXT,
			text: 'Controls',
			fontSize: 32,
			fontAsset: assets[0],
			useInput: true,
			color: new pc.Color(1, 1, 1),
			opacity: 1
		});
		controls.translateLocal(0, 100, 0);
		helpMenu.addChild(controls);

		const line1 = new pc.Entity();
		line1.name = 'Line1';
		line1.addComponent('element', {
			anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
			pivot: new pc.Vec2(0.5, 0.5),
			type: pc.ELEMENTTYPE_TEXT,
			text: 'W-A-S-D to Move',
			fontSize: 32,
			fontAsset: assets[0],
			color: new pc.Color(1, 1, 1),
			opacity: 1
		});
		line1.translateLocal(0, 0, 0);
		helpMenu.addChild(line1);

		const line2 = new pc.Entity();
		line2.name = 'Line2';
		line2.addComponent('element', {
			anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
			pivot: new pc.Vec2(0.5, 0.5),
			type: pc.ELEMENTTYPE_TEXT,
			text: 'SPACE to Jump',
			fontSize: 32,
			fontAsset: assets[0],
			color: new pc.Color(1, 1, 1),
			opacity: 1
		});
		line2.translateLocal(0, -50, 0);
		helpMenu.addChild(line2);

		const back = new pc.Entity();
		back.name = 'Back';
		back.addComponent('element', {
			anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
			pivot: new pc.Vec2(0.5, 0.5),
			type: pc.ELEMENTTYPE_TEXT,
			text: 'Back',
			fontSize: 32,
			fontAsset: assets[0],
			useInput: true,
			color: new pc.Color(1, 1, 1),
			opacity: 1
		});
		back.translateLocal(0, -150, 0);
		helpMenu.addChild(back);

		helpMenu.enabled = false;
		UI.addChild(helpMenu);

		const settingsMenu = new pc.Entity();
		settingsMenu.name = 'Channel Settings';
		settingsMenu.addComponent('screen', {
			resolution: new pc.Vec2(640, 480),
			screenSpace: true
		});
		settingsMenu.screen.scaleMode = 'blend';
		settingsMenu.screen.referenceResolution = new pc.Vec2(1280, 720);

		const settings = new pc.Entity();
		settings.name = 'Settings';
		settings.addComponent('element', {
			anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
			pivot: new pc.Vec2(0.5, 0.5),
			type: pc.ELEMENTTYPE_TEXT,
			text: 'Settings',
			fontSize: 32,
			fontAsset: assets[0],
			color: new pc.Color(1, 1, 1),
			opacity: 1
		});
		settings.translateLocal(0, 100, 0);
		settingsMenu.addChild(settings);

		const back2 = new pc.Entity();
		back2.name = 'Back';
		back2.addComponent('element', {
			anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
			pivot: new pc.Vec2(0.5, 0.5),
			type: pc.ELEMENTTYPE_TEXT,
			text: 'Back',
			fontSize: 32,
			fontAsset: assets[0],
			useInput: true,
			color: new pc.Color(1, 1, 1),
			opacity: 1
		});
		back2.translateLocal(0, -150, 0);
		settingsMenu.addChild(back2);

		settingsMenu.enabled = false;
		UI.addChild(settingsMenu);

		return UI;
	};

	createMaterial = color => {
		const material = new pc.PhongMaterial();
		material.diffuse = color;
		material.update();
		return material;
	};

	createCameraEntity = (name, position, rotation) => {
		const camera = new pc.Entity();
		camera.name = name;
		camera.addComponent('camera', {
			clearColor: new pc.Color(0, 0, 0)
		});
		camera.setPosition(position.x, position.y, position.z);
		camera.setEulerAngles(rotation.x, rotation.y, rotation.z);
		return camera;
	};

	createPrimitiveEntity = (name, type, position, rotation, scale) => {
		const primitive = new pc.Entity();
		primitive.addComponent('model', {
			type
		});
		primitive.setPosition(position.x, position.y, position.z);
		primitive.setEulerAngles(rotation.x, rotation.y, rotation.z);
		primitive.setLocalScale(scale.x, scale.y, scale.z);
		return primitive;
	};

	createLightEntity = (name, position, rotation) => {
		const light = new pc.Entity();
		light.addComponent('light');
		light.setPosition(position.x, position.y, position.z);
		light.setEulerAngles(rotation.x, rotation.y, rotation.z);
		return light;
	};

	createUserInterfaceScript = () => {
		const UserInterface = pc.createScript('userInterface');

		// initialize code called once per entity
		UserInterface.prototype.initialize = function() {
			const network = this.app.root.findByName('Network').script.network;

			// Grab the different screens
			const joinMenu = this.entity.findByName('Join Screen');
			const inGameUI = this.entity.findByName('InGame UI Screen');
			const helpMenu = this.entity.findByName('Help Screen');
			const settings = this.entity.findByName('Channel Settings');

			joinMenu.enabled = true;
			joinMenu.findByName('Join').element.on('click', function() {
				joinMenu.enabled = false;
				inGameUI.enabled = true;
				network.join();
			});
			joinMenu.findByName('Help Btn').element.on('click', function() {
				joinMenu.enabled = false;
				helpMenu.enabled = true;
			});
			joinMenu.findByName('Settings').element.on('click', function() {
				joinMenu.enabled = false;
				settings.enabled = true;
			});

			helpMenu.findByName('Back').element.on('click', function() {
				helpMenu.enabled = false;
				joinMenu.enabled = true;
			});

			settings.findByName('Back').element.on('click', function() {
				settings.enabled = false;
				joinMenu.enabled = true;
			});

			inGameUI.findByName('Exit').element.on('click', function() {
				inGameUI.enabled = false;
				network.exit();
				joinMenu.enabled = true;
			});
		};
	};

	createNetworkManagerScript = (socket, channel) => {
		const Network = pc.createScript('network');

		Network.id = null;
		Network.socket = null;

		// initialize code called once per entity
		Network.prototype.initialize = function() {
			this.holoSpace = this.app.root.findByName('HoloSpace').script.holoSpace;
			// const socket = io.connect('http://localhost:9001');
			Network.socket = socket;

			// get channel's terrain.json from server
			// get channel's holofacts (player placed artifacts/props) from server

			this.players = {};
			this.initialized = false;

			const network = this;
			socket.on('player:data', data => {
				network.initPlayers(data);
			});

			socket.on('player:joined', data => {
				network.spawnPlayer(data);
			});

			socket.on('player:moved', data => {
				network.movePlayer(data);
			});

			socket.on('player:disconnected', data => {
				network.removePlayer(data);
			});
		};

		Network.prototype.join = function() {
			Network.socket.emit('player:init', channel);
		};

		Network.prototype.initPlayers = function(data) {
			if (!this.initialized) {
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
			}
			console.log('Initialized', this.initialized);
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
			if (!this.players[data.id]) return;
			if (this.initialized && !this.players[data.id].deleted) {
				this.players[data.id].entity.rigidbody.teleport(data.x, data.y, data.z);
			}
		};

		Network.prototype.removePlayer = function(data) {
			if (this.players[data].entity)
				this.players[data].entity.destroy();
			this.players[data].deleted = true;
		};

		Network.prototype.exit = function() {
			for (var id in this.players) {
				if (id !== Network.id && this.players[id].entity) {
					this.players[id].entity.destroy();
				}
				this.players[id].deleted = true;
			}

			this.player.destroy();
			Network.socket.emit('player:exit', Network.id);
			this.initialized = false;
			console.log('Exit VR Channel');
			this.holoSpace.exit();
		};

		// update code called every frame
		Network.prototype.update = function(dt) {
			this.updatePosition();
		};

		Network.prototype.updatePosition = function() {
			if (this.initialized) {
				const pos = this.player.getPosition();
				Network.socket.emit('position:update', {
					id: Network.id,
					x: pos.x,
					y: pos.y,
					z: pos.z
				});
			}
		};
	};

	createFirstPersonMovementScript = () => {
		const FirstPersonMovement = pc.createScript('firstPersonMovement');
		// attributes ~ (camera:entity, moveSpeed:number, lookSpeed:number)
		FirstPersonMovement.prototype.initialize = function() {
			this.isGrounded = true;
			this.moveSpeed = 2500;
			this.lookSpeed = 0.25;
			this.jumpImpulse = 250;

			this.force = new pc.Vec3();
			this.camera = this.addCamera();
			this.euler = new pc.Vec3();

			// Check for required components
			if (!this.entity.collision) {
				console.error(
					"First Person Movement script needs to have a 'collision' component"
				);
			}

			if (
				!this.entity.rigidbody ||
				this.entity.rigidbody.type !== pc.BODYTYPE_DYNAMIC
			) {
				console.error(
					"First Person Movement script needs a DYNAMIC 'rigidbody' component"
				);
			}

			// Listen for mouse move events
			pc.app.mouse.disableContextMenu();
			pc.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);

			// this.entity.rigidbody.syncEntityToBody();
			// this.entity.rigidbody.teleport(pc.Vec3.ZERO);
		};

		FirstPersonMovement.prototype.addCamera = function() {
			const camera = new pc.Entity();
			camera.name = 'First Person Camera';
			camera.addComponent('camera');
			camera.translateLocal(0, 1, 0);
			this.entity.addChild(camera);
			return camera;
		};

		FirstPersonMovement.prototype.update = function(dt) {
			if (!this.camera) {
				this.camera = this.addCamera();
			}

			// Get camera directions to determine movement directions
			const forward = this.camera.forward;
			const right = this.camera.right;

			let x = 0;
			let y = 0;
			let z = 0;

			// Use W-A-S-D keys to move
			if (pc.app.keyboard.isPressed(pc.KEY_W)) {
				x += forward.x;
				z += forward.z;
			}
			if (pc.app.keyboard.isPressed(pc.KEY_A)) {
				x -= right.x;
				z -= right.z;
			}
			if (pc.app.keyboard.isPressed(pc.KEY_S)) {
				x -= forward.x;
				z -= forward.z;
			}
			if (pc.app.keyboard.isPressed(pc.KEY_D)) {
				x += right.x;
				z += right.z;
			}
			// Use SPACE to jump
			if (pc.app.keyboard.isPressed(pc.KEY_SPACE)) {
				y += 0.1;
			}

			// move
			if (x !== 0 || z !== 0) {
				x *= dt;
				z *= dt;

				this.force
					.set(x, 0, z)
					.normalize()
					.scale(this.moveSpeed);
				this.entity.rigidbody.applyForce(this.force);
			}

			// jump
			if (y !== 0 && this.isGrounded) {
				y *= dt;

				this.force
					.set(0, y, 0)
					.normalize()
					.scale(this.jumpImpulse);
				this.entity.rigidbody.applyImpulse(this.force);
			}
			this.checkGrounded();

			// update camera angle from mouse events
			this.camera.setLocalEulerAngles(this.euler.y, this.euler.x, 0);
		};

		FirstPersonMovement.prototype.onMouseMove = function(e) {
			// Update the current Euler angles, clamp the pitch.
			this.euler.y -= e.dy * this.lookSpeed;
			this.euler.y = pc.math.clamp(this.euler.y, -75, 75);
			this.euler.x -= e.dx * this.lookSpeed;
		};

		const rayEnd = new pc.Vec3();
		const groundCheckRay = new pc.Vec3(0, -1, 0);
		FirstPersonMovement.prototype.checkGrounded = function() {
			const self = this;
			const pos = this.entity.getPosition();
			rayEnd.add2(pos, groundCheckRay);
			self.isGrounded = false;

			// Fire a ray straight down to just below the bottom of the rigidbody,
			// if it hits something, then the character is standing on something.
			if (pc.app.systems.rigidbody.raycastFirst(pos, rayEnd))
				self.isGrounded = true;
		};
	};

	createHoloSpaceManagerScript = () => {
		const HoloSpace = pc.createScript('holoSpace');

		HoloSpace.prototype.initialize = function() {
			this.player = null;
		};

		HoloSpace.prototype.update = function(dt) {
			if (!this.joined) return;

			// send local holosmiths position & rotation to server
			// recv remote holosmiths position & rotation from server
		};

		HoloSpace.prototype.join = function(playerData) {
			this.joined = true;
	    this.player = this.spawnHolosmith(playerData, true);

	    // disable Scene Camera
	    this.app.root.findByName('Scene Camera').enabled = false;

	    return this.player;
		};

		HoloSpace.prototype.spawnHolosmith = function(playerData, isLocal) {
			const position = new pc.Vec3(playerData.position[0], playerData.position[1], playerData.position[2]);
			const rotation = new pc.Vec3(playerData.rotation[0], playerData.rotation[1], playerData.rotation[2]);

			const player = new pc.Entity();
			player.name = playerData.id;
			player.addComponent('model', {
				type: 'capsule',
				castShadows: true
			});
			player.setPosition(position.x, position.y, position.z);
			player.setEulerAngles(rotation.x, rotation.y, rotation.z);

			// add rigidbody
			player.addComponent('rigidbody', {
				type: pc.BODYTYPE_DYNAMIC,
				mass: 100,
				linearDamping: 0.99,
				angularFactor: new pc.Vec3(0, 0, 0),
				friction: 0.75,
				restitution: 0.5
			});

			// add collision
			player.addComponent('collision', {
				type: 'capsule',
				radius: 0.24,
				height: 1.8
			});

			const randomColor = new pc.Color(
				pc.math.random(20, 235) / 255,
				pc.math.random(20, 235) / 255,
				pc.math.random(20, 235) / 255
			);
			player.model.material = this.createMaterial(randomColor);

			// add movement scripts to local player
	    if (isLocal) {
        player.addComponent('script');
        player.script.create('firstPersonMovement');
	    } else {
        player.addChild(this.displayUsername(playerData.holoTag.slice(0, -5)));
	    }

	    return player;
		};

		HoloSpace.prototype.displayUsername = function(username) {
			// add username label above player model
			const label = new pc.Entity();
			label.name = 'Username Label';
			label.addComponent('model', {
				type: 'plane',
				castShadows: false
			});
			label.setPosition(0, 1.28, 0);
			label.setEulerAngles(90, 0, 0);
			label.setLocalScale(1, 1, 0.24);

			label.model.material = new pc.StandardMaterial();
	    label.model.material.name = 'Username Material';
	    label.model.material.diffuse.set(0, 0, 0);
	    label.model.material.specular.set(0, 0, 0);
	    label.model.material.update();

			label.addComponent('script');
			label.script.create('billboard');
			label.script.create('text');
			label.script.text.text = username;

			return label;
		};

		HoloSpace.prototype.createMaterial = color => {
			const material = new pc.PhongMaterial();
			material.diffuse = color;
			material.update();

			return material;
		};

		HoloSpace.prototype.exit = function() {
	    this.joined = false;
	    this.player.destroy();

	    // enable Scene Camera
	    this.app.root.findByName('Scene Camera').enabled = true;
		};
	};

	createTextScript = () => {
		const Text = pc.createScript('text');

		Text.attributes.add('text', { type: 'string', default: 'Unknown' });
		Text.attributes.add('fontsize', { type: 'number', default:70, title:"Font Size" });

		// initialize code called once per entity
		Text.prototype.initialize = function() {
			// Create a canvas to do the text rendering
			this.canvas = document.createElement('canvas');
			this.canvas.height = 128;
			this.canvas.width = 1024;
			this.context = this.canvas.getContext('2d');

			this.texture = new pc.Texture(this.app.graphicsDevice, {
				format: pc.PIXELFORMAT_R8_G8_B8_A8, // pc.PIXELFORMAT_R8_G8_B8,
				autoMipmap: true
			});
			this.texture.setSource(this.canvas);
			this.texture.minFilter = pc.FILTER_LINEAR_MIPMAP_LINEAR;
			this.texture.magFilter = pc.FILTER_LINEAR;
			this.texture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
			this.texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE;

			this.updateText();

			this.entity.model.material.emissiveMap = this.texture;
	    this.entity.model.material.opacityMap = this.texture;
	    this.entity.model.material.blendType = pc.BLEND_NORMAL;
	    this.entity.model.material.update();
		};

		Text.prototype.updateText = function() {
			const ctx = this.context;
			const w = ctx.canvas.width;
			const h = ctx.canvas.height;

			// Clear the context to transparent
			ctx.fillStyle = '#00000000';
			ctx.fillRect(0, 0, w, h);

			// Write white text
			ctx.fillStyle = 'white';
			ctx.save();
			ctx.font = 'bold 70px Verdana'; // `bold ${this.fontsize}px Verdana`
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';

			ctx.fillText(this.text, w / 2, h / 2);
			ctx.restore();

			// Copy the canvas into the texture
			this.texture.upload();
		};

		// update code called every frame
		Text.prototype.update = function(dt) {

		};
	};

	createBillboardScript = () => {
		const Billboard = pc.createScript('billboard');

		// initialize code called once per entity
		Billboard.prototype.initialize = function() {
			this.camera = this.app.root.findByName('First Person Camera');
		};

		// update code called every frame
		Billboard.prototype.update = function(dt) {
			if (this.camera) {
				this.entity.setRotation(this.camera.getRotation());
				this.entity.rotateLocal(90, 0, 0);
			}
		};
	};

	createInvisibleBoundary = () => {
		const bounds = {};
		// name, type, position, rotation, scale
		const floor = this.createInvisibleWall(
			'Floor',
			'box',
			{ x: 0, y: -1.5, z: 0 },
			{ x: 0, y: 0, z: 0 },
			{ x: 60, y: 1, z: 60 }
		);
		const blue = this.createMaterial(
			new pc.Color(38 / 255, 174 / 255, 220 / 255)
		);
		floor.model.material = blue;
		bounds.floor = floor;

		return bounds;
	};

	createInvisibleWall = (name, type, position, rotation, scale) => {
		// name, type, position, rotation, scale
		const iWall = this.createPrimitiveEntity(
			name,
			type,
			position,
			rotation,
			scale
		);
		iWall.setName(name);
		// add collision
		iWall.addComponent('collision', {
			type,
			halfExtents: new pc.Vec3(scale.x / 2, scale.y / 2, scale.z / 2)
		});
		// add rigidbody
		iWall.addComponent('rigidbody', {
			type: pc.BODYTYPE_STATIC,
			restitution: 0.5
		});
		return iWall;
	};

	render() {
		const { width, height } = this.props;

		return (
			<canvas
				id="application-canvas"
				ref={element => {
					this.canvas = element;
				}}
				width={width}
				height={height}
				style={{ display: 'block', width: `${width}px`, height: `${height}px` }}
			/>
		);
	}
}

PlayCanvas.defaultProps = {
	socket: null
};

PlayCanvas.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	socket: PropTypes.shape({
		id: PropTypes.string,
		on: PropTypes.func,
		emit: PropTypes.func
	})
};

export default PlayCanvas;
