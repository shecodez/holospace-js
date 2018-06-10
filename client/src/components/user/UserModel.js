import React from "react";
import { CharacterSelectScript } from "../../playcanvas/scripts";

const pc = window.pc;

// Load Asset(name, type, file, [data])
// https://developer.playcanvas.com/en/api/pc.Asset.html#Asset
const assets = [
	new pc.Asset("Montserrat-Black.json", "font", {
		url: "/assets/fonts/Montserrat-Black/Montserrat-Black.json"
	}),
	new pc.Asset("female.png", "texture", {
		url: "/assets/textures/female.png"
	}),
	new pc.Asset("male.png", "texture", {
		url: "/assets/textures/male.png"
	}),
	new pc.Asset("xbot.json", "model", {
		url: "/assets/models/xbot/xbot.json"
	}),
	new pc.Asset("ybot.json", "model", {
		url: "/assets/models/ybot/ybot.json"
	}),
	new pc.Asset("idle.json", "animation", {
		url: "/assets/animations/idle.json"
	})
];

class UserModel extends React.Component {
	componentDidMount() {
		this.createApp();
	}

	componentWillUnmount() {
		window.removeEventListener("resize");
	}

	createApp = () => {
		const canvas = this.canvas;
		canvas.focus(); // focus the canvas for keyboard input

		// create a PlayCanvas application
		const app = new pc.Application(canvas, {
			elementInput: new pc.ElementInput(canvas),
			mouse: new pc.Mouse(canvas),
			keyboard: new pc.Keyboard(window)
		});
		app.start();

		// fill the available space at full resolution
		app.setCanvasFillMode(pc.FILLMODE_NONE); // FILLMODE_FILL_WINDOW
		app.setCanvasResolution(pc.RESOLUTION_AUTO);
		
		const { width, height } = this.props;
		app.resizeCanvas(width, height);
		// ensure canvas is resized when window changes size
		/* window.addEventListener("resize", () => {
			app.resizeCanvas(width, height);
		}); */

		// Load app Assets
		let count = 0;
		// TODO: display loading bar
		const onLoadComplete = this.onLoadComplete;
		app.assets.on("load", function() {
			count += 1;
			if (count === assets.length) {
				onLoadComplete();
			}
		});

		for (let i = 0; i < assets.length; i += 1) {
			app.assets.add(assets[i]);
			app.assets.load(assets[i]);
		}

		// create camera entity
		const camera = new pc.Entity("Scene Camera");
		camera.addComponent("camera", {
			clearColor: new pc.Color(0.1, 0.1, 0.1)
		});

		// create directional light entity
		const light = new pc.Entity("Directional Light");
		light.addComponent("light");

		/* const background = this.createPrimitiveEntity(
			"Background",
			"plane",
			[0, 1, 1],
			[90, 0, 0],
			[8, 1, 4]
		); */
		const platform = this.createPrimitiveEntity(
			"Platform",
			"cylinder",
			[0, -0.25, 0],
			[0, 0, 0],
			[2, 0.5, 2]
		);
		const charModel = this.addChracterGenderModels();

		// add to hierarchy
		app.root.addChild(camera);
		app.root.addChild(light);
		//app.root.addChild(background);
		app.root.addChild(platform);
		app.root.addChild(charModel);

		// Create Scripts
		CharacterSelectScript();

		// set up camera and light initial positions and orientations
		camera.setPosition(0, 1, 3);
		light.setPosition(-0.5, 3, 0.5);
		light.setEulerAngles(90, 30, 0);
	};

	onLoadComplete = () => {
		// use nearest filtering on pixelized textures to prevent leaks
		for (let i = 0; i < assets.length; i += 1) {
			if (assets[i].type === "texture") {
				assets[i].resource.minFilter = pc.FILTER_NEAREST;
				assets[i].resource.magFilter = pc.FILTER_NEAREST;
			}
		}

		const UI = this.createCharacterSelectUI();
		pc.app.root.addChild(UI);
	};

	createPrimitiveEntity = (name, type, position, rotation, scale) => {
		const primitive = new pc.Entity(name);
		primitive.addComponent("model", {
			type: type
		});
		primitive.setPosition(position[0], position[1], position[2]);
		primitive.setEulerAngles(rotation[0], rotation[1], rotation[2]);
		primitive.setLocalScale(scale[0], scale[1], scale[2]);
		return primitive;
	};

	createIcon = (name, asset) => {
		const icon = new pc.Entity(name);
		icon.addComponent("element", {
			anchor: new pc.Vec4(1, 0, 1, 0),
			pivot: new pc.Vec2(0.5, 0.5),
			width: 32,
			height: 32,
			type: pc.ELEMENTTYPE_IMAGE,
			rect: [0, 0, 1, 1],
			textureAsset: asset,
			useInput: true
		});
		return icon;
	};

	createCharacterSelectUI = () => {
		const UI = new pc.Entity("Character Model UI");
		UI.addComponent("script");
		UI.script.create("characterSelect");

		// gender selection menu ------------------------------
		const genderMenu = new pc.Entity("Gender Menu");
		genderMenu.addComponent("screen", {
			resolution: new pc.Vec2(640, 480),
			screenSpace: true
		});
		genderMenu.screen.scaleMode = "blend";
		genderMenu.screen.referenceResolution = new pc.Vec2(1280, 720);

		const femaleIcon = this.createIcon("Female", assets[1]);
		femaleIcon.element.rect = [0, 0, 1, 1];
		femaleIcon.setLocalPosition(-75, 75, 0);
		genderMenu.addChild(femaleIcon);

		const maleIcon = this.createIcon("Male", assets[2]);
		maleIcon.element.rect = [0, 0, 1, 1];
		maleIcon.setLocalPosition(-132, 75, 0);
		genderMenu.addChild(maleIcon);

		genderMenu.enabled = true;
		UI.addChild(genderMenu);

		return UI;
	};

	addChracterGenderModels = () => {
		const charModels = new pc.Entity("Character Model");

		//-- X-BOT -----------------------------------------------
		const xbot = new pc.Entity("xbot");
		xbot.addComponent("model", {
			type: "asset",
			castShadows: true,
			asset: assets[3]
		});
		xbot.addComponent("animation", {
			assets: [assets[5]],
			speed: 1
		});
		//xbot.animation.play(assets[5], 1.0);
		charModels.addChild(xbot);

		//-- Y-YBOT -----------------------------------------------
		const ybot = new pc.Entity("ybot");
		ybot.addComponent("model", {
			type: "asset",
			castShadows: true,
			asset: assets[4]
		});
		ybot.addComponent("animation", {
			assets: [assets[5]],
			speed: 1
		});
		//ybot.animation.play(assets[5], 1.0);
		ybot.enabled = false;
		charModels.addChild(ybot);

		return charModels;
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
				style={{
					width: `${width}px`,
					height: `${height}px`
				}}
			/>
		);
	}
}

export default UserModel;
