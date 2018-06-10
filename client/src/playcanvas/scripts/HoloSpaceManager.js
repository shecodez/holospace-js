const pc = window.pc;

export const HoloSpaceManagerScript = () => {
	const HoloSpace = pc.createScript("holoSpace");

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
		this.app.root.findByName("Scene Camera").enabled = false;

		return this.player;
	};

	HoloSpace.prototype.spawnHolosmith = function(playerData, isLocal) {
		const position = new pc.Vec3(
			playerData.position[0],
			playerData.position[1],
			playerData.position[2]
		);
		const rotation = new pc.Vec3(
			playerData.rotation[0],
			playerData.rotation[1],
			playerData.rotation[2]
		);

		const player = new pc.Entity();
		player.name = playerData.id;
		player.addComponent("model", {
			type: "capsule",
			castShadows: true
		});
		player.setPosition(position.x, position.y, position.z);
		player.setEulerAngles(rotation.x, rotation.y, rotation.z);

		// add rigidbody
		player.addComponent("rigidbody", {
			type: pc.BODYTYPE_DYNAMIC,
			mass: 100,
			linearDamping: 0.99,
			angularFactor: new pc.Vec3(0, 0, 0),
			friction: 0.75,
			restitution: 0.5
		});

		// add collision
		player.addComponent("collision", {
			type: "capsule",
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
			player.addComponent("script");
			player.script.create("firstPersonMovement");
		} else {
			player.addChild(
				this.displayUsername(playerData.holoTag.slice(0, -5))
			);
		}

		return player;
	};

	HoloSpace.prototype.displayUsername = function(username) {
		// add username label above player model
		const label = new pc.Entity();
		label.name = "Username Label";
		label.addComponent("model", {
			type: "plane",
			castShadows: false
		});
		label.setPosition(0, 1.28, 0);
		label.setEulerAngles(90, 0, 0);
		label.setLocalScale(1, 1, 0.24);

		label.model.material = new pc.StandardMaterial();
		label.model.material.name = "Username Material";
		label.model.material.diffuse.set(0, 0, 0);
		label.model.material.specular.set(0, 0, 0);
		label.model.material.update();

		label.addComponent("script");
		label.script.create("billboard");
		label.script.create("text");
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
		if (this.player) this.player.destroy();

		// enable Scene Camera
		this.app.root.findByName("Scene Camera").enabled = true;
	};
};
