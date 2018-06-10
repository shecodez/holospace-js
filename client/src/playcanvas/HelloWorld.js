import React from "react";

const pc = window.pc;

class HelloWorld extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		this.createApp();
	}

	componentWillUnmount() {
		window.removeEventListener("resize");
	}

	createApp = () => {
		const canvas = this.canvas;
		canvas.focus(); // focus the canvas for kb input

		// create a PlayCanvas application
		const app = new pc.Application(canvas, {
			elementInput: new pc.ElementInput(canvas),
			mouse: new pc.Mouse(canvas),
			keyboard: new pc.Keyboard(window)
		});
		app.start();

		// fill the available space at full resolution
		app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
		app.setCanvasResolution(pc.RESOLUTION_AUTO);

		// ensure canvas is resized when window changes size
		window.addEventListener("resize", () => {
			app.resizeCanvas();
		});

		// Load app Assets

		// Set the gravity for our rigid bodies
		app.systems.rigidbody.setGravity(0, -9.8, 0);

		// create box entity
		var cube = new pc.Entity("cube");
		cube.addComponent("model", {
			type: "box"
		});

		// create camera entity
		var camera = new pc.Entity("Scene Camera");
		camera.addComponent("camera", {
			clearColor: new pc.Color(0.1, 0.1, 0.1)
		});

		// create directional light entity
		var light = new pc.Entity("Directional Light");
		light.addComponent("light");

		// add to hierarchy
		app.root.addChild(cube);
		app.root.addChild(camera);
		app.root.addChild(light);

		// set up initial positions and orientations
		camera.setPosition(0, 0, 3);
		light.setEulerAngles(45, 0, 0);

		// register a global update event
		app.on("update", function(deltaTime) {
			cube.rotate(10 * deltaTime, 20 * deltaTime, 30 * deltaTime);
		});
	};

	render() {
		return (
			<canvas
				id="application-canvas"
				ref={element => {
					this.canvas = element;
				}}
			/>
		);
	}
}

export default HelloWorld;
