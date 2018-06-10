const pc = window.pc;

export const FpmControllerScript = () => {
	const FirstPersonMovement = pc.createScript("firstPersonMovement");
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
		camera.name = "First Person Camera";
		camera.addComponent("camera");
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
