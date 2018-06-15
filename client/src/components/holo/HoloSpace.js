import React from "react";
import PropTypes from "prop-types";
import {
	BillboardScript,
	FpmControllerScript,
	HoloSpaceManagerScript,
	NetworkManagerScript,
	TextManagerScript,
	UserInterfaceScript
} from "../../playcanvas/scripts";

const pc = window.pc;

// Load Asset(name, type, file, [data])
// https://developer.playcanvas.com/en/api/pc.Asset.html#Asset
const assets = [
	new pc.Asset("Montserrat-Black.json", "font", {
		url: "/assets/fonts/Montserrat-Black/Montserrat-Black.json"
	}),
	new pc.Asset("help.png", "texture", { url: "/assets/textures/help.png" }),
	new pc.Asset("gear.png", "texture", { url: "/assets/textures/gear.png" })
];

class HoloSpace extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 0,
			height: 0
		};
	}

	componentDidMount() {
		this.createApp();
	}

	/* componentWillReceiveProps(nextProps) {
		const { width, height } = this.state;

		if (nextProps.width !== width || nextProps.height !== height) {
			this.setState(
				{ width: nextProps.width, height: nextProps.height },
				() => pc.app.resizeCanvas(width, height)
			);
		}
	} */

	/* componentWillUnmount() {
		window.removeEventListener("resize");
	} */

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
		app.setCanvasFillMode(pc.FILLMODE_NONE); // FILLMODE_FILL_WINDOW
		app.setCanvasResolution(pc.RESOLUTION_AUTO);

		const { width, height, channel, socket } = this.props;
		app.resizeCanvas(width, height);
		// ensure canvas is resized when window changes size
		/* window.addEventListener("resize", () => {
			app.resizeCanvas();
		}); */

		// Load app Assets
		let count = 0;
		const onLoadComplete = this.onLoadComplete;
		app.assets.on("load", () => {
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

		// create camera entity
		const camera = new pc.Entity("Scene Camera");
		camera.addComponent("camera", {
			clearColor: new pc.Color(0.1, 0.1, 0.1)
		});

		// create directional light entity
		const light = new pc.Entity("Directional Light");
		light.addComponent("light");

		const holoSpace = new pc.Entity("HoloSpace");
		const network = new pc.Entity("Network");
		const bounds = this.createInvisibleBoundary();

		// add to hierarchy
		app.root.addChild(camera);
		app.root.addChild(light);
		app.root.addChild(bounds.floor);
		app.root.addChild(holoSpace);
		app.root.addChild(network);

		// Create Scripts
		BillboardScript();
		FpmControllerScript();
		HoloSpaceManagerScript();
		NetworkManagerScript(channel, socket);
		TextManagerScript();
		UserInterfaceScript();

		// set up camera and light initial positions and orientations
		camera.setPosition(0, 3, 10);
		light.setPosition(0, 14.75, 0);
		light.setEulerAngles(-45, 0, -45);

		// Add holoSpaceManager to holospace entity
		holoSpace.addComponent("script");
		holoSpace.script.create("holoSpace");

		// Add NetworkManager to network entity
		network.addComponent("script");
		network.script.create("network");
	};

	onLoadComplete = () => {
		// use nearest filtering on pixelized textures to prevent leaks
		for (let i = 0; i < assets.length; i += 1) {
			if (assets[i].type === "texture") {
				assets[i].resource.minFilter = pc.FILTER_NEAREST;
				assets[i].resource.magFilter = pc.FILTER_NEAREST;
			}
		}

		const { owner, channel } = this.props;
		const UI = this.createHoloSpaceUI(`${owner.username}'s ${channel.name}`);
		pc.app.root.addChild(UI);
	};

	createLabel = (name, text, size) => {
		const label = new pc.Entity(name);
		label.addComponent("element", {
			anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
			pivot: new pc.Vec2(0.5, 0.5),
			type: pc.ELEMENTTYPE_TEXT,
			text,
			fontSize: size || 32,
			fontAsset: assets[0],
			color: new pc.Color(0.65, 0.65, 0.65),
			opacity: 1
		});
		return label;
	};

	createButton = (name, text, size) => {
		const button = new pc.Entity(name);
		button.addComponent("element", {
			anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
			pivot: new pc.Vec2(0.5, 0.5),
			type: pc.ELEMENTTYPE_TEXT,
			text,
			fontSize: size || 32,
			fontAsset: assets[0],
			useInput: true,
			color: new pc.Color(1, 1, 1),
			opacity: 1
		});
		return button;
	};

	createIcon = (name, asset) => {
		const icon = new pc.Entity(name);
		icon.addComponent("element", {
			anchor: new pc.Vec4(1, 0, 1, 0),
			pivot: new pc.Vec2(1, 0),
			width: 64,
			height: 64,
			type: pc.ELEMENTTYPE_IMAGE,
			rect: [0, 0, 1, 1],
			textureAsset: asset,
			useInput: true
		});
		return icon;
	};

	createHoloSpaceUI = (channel) => {
		const UI = new pc.Entity();
		UI.name = "UI";
		UI.addComponent("script");
		UI.script.create("userInterface");

		// Join Menu ------------------------------------------------
		const joinMenu = new pc.Entity();
		joinMenu.name = "Join Screen";
		joinMenu.addComponent("screen", {
			resolution: new pc.Vec2(640, 480),
			screenSpace: true
		});
		joinMenu.screen.scaleMode = "blend";
		joinMenu.screen.referenceResolution = new pc.Vec2(1280, 720);

		// Welcome to
		const welcome = this.createLabel("Welcome", "Welcome to");
		welcome.setLocalPosition(0, 100, 0);
		joinMenu.addChild(welcome);

		const programme = this.createLabel("Programme", channel);
		programme.setLocalPosition(0, 50, 0);
		joinMenu.addChild(programme);

		const join = this.createButton("Join", "Join this HoloSpace", 48);
		join.setLocalPosition(0, -50, 0);
		joinMenu.addChild(join);

		const helpIcon = this.createIcon("Help Btn", assets[1]);
		helpIcon.element.rect = [0, 0, 1, 1];
		helpIcon.setLocalPosition(-125, 50, 0);
		joinMenu.addChild(helpIcon);

		const gearIcon = this.createIcon("Settings", assets[2]);
		gearIcon.element.rect = [0, 0, 1, 1];
		gearIcon.setLocalPosition(-50, 50, 0);
		joinMenu.addChild(gearIcon);

		joinMenu.enabled = false;
		UI.addChild(joinMenu);

		// InGame Menu ----------------------------------------------
		const inGameUI = new pc.Entity();
		inGameUI.name = "InGame UI Screen";
		inGameUI.addComponent("screen", {
			resolution: new pc.Vec2(640, 480),
			screenSpace: true
		});
		inGameUI.screen.scaleMode = "blend";
		inGameUI.screen.referenceResolution = new pc.Vec2(1280, 720);

		const exit = new pc.Entity("Exit");
		exit.addComponent("element", {
			anchor: new pc.Vec4(0, 1, 0, 1),
			pivot: new pc.Vec2(0, 1),
			type: pc.ELEMENTTYPE_TEXT,
			text: "Exit this HoloSpace",
			fontSize: 32,
			fontAsset: assets[0],
			useInput: true,
			color: new pc.Color(1, 1, 1),
			opacity: 1
		});
		exit.setLocalPosition(10, -10, 0);
		inGameUI.addChild(exit);

		inGameUI.enabled = false;
		UI.addChild(inGameUI);

		// Help Menu ------------------------------------------------
		const helpMenu = new pc.Entity();
		helpMenu.name = "Help Screen";
		helpMenu.addComponent("screen", {
			resolution: new pc.Vec2(640, 480),
			screenSpace: true
		});
		helpMenu.screen.scaleMode = "blend";
		helpMenu.screen.referenceResolution = new pc.Vec2(1280, 720);

		const controls = this.createLabel("Controls", "Controls");
		controls.setLocalPosition(0, 100, 0);
		helpMenu.addChild(controls);

		const line1 = this.createLabel("Line1", "W-A-S-D to Move");
		line1.setLocalPosition(0, 0, 0);
		helpMenu.addChild(line1);

		const line2 = this.createLabel("Line2", "SPACE to Jump");
		line2.setLocalPosition(0, -50, 0);
		helpMenu.addChild(line2);

		const back = this.createButton("Back", "Back");
		back.setLocalPosition(0, -150, 0);
		helpMenu.addChild(back);

		helpMenu.enabled = false;
		UI.addChild(helpMenu);

		// Settings Menu --------------------------------------------
		const settingsMenu = new pc.Entity();
		settingsMenu.name = "Channel Settings";
		settingsMenu.addComponent("screen", {
			resolution: new pc.Vec2(640, 480),
			screenSpace: true
		});
		settingsMenu.screen.scaleMode = "blend";
		settingsMenu.screen.referenceResolution = new pc.Vec2(1280, 720);

		const settings = this.createLabel("Settings", "Settings");
		settings.setLocalPosition(0, 100, 0);
		settingsMenu.addChild(settings);

		const back2 = this.createButton("Back", "Back");
		back2.setLocalPosition(0, -150, 0);
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

	createInvisibleBoundary = () => {
		const bounds = {};
		// name, type, position, rotation, scale
		const floor = this.createInvisibleWall(
			"Floor",
			"box",
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
		const wall = new pc.Entity(name);
		wall.addComponent("model", {
			type
		});
		wall.setPosition(position.x, position.y, position.z);
		wall.setEulerAngles(rotation.x, rotation.y, rotation.z);
		wall.setLocalScale(scale.x, scale.y, scale.z);

		// add collision
		wall.addComponent("collision", {
			type,
			halfExtents: new pc.Vec3(scale.x / 2, scale.y / 2, scale.z / 2)
		});
		// add rigidbody
		wall.addComponent("rigidbody", {
			type: pc.BODYTYPE_STATIC,
			restitution: 0.5
		});
		return wall;
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

HoloSpace.defaultProps = {
	owner: { username: "???", pin: 0 },
};

HoloSpace.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	owner: PropTypes.shape({
		username: PropTypes.string
	}),
	channel: PropTypes.shape({
		name: PropTypes.string
	}).isRequired,
	socket: PropTypes.shape({}).isRequired
};

export default HoloSpace;

// TODO: add skybox
/*
app.assets.loadFromUrl("skybox.dds", "cubemap", function (err, asset) {
    app.scene.skyboxMip = 2;
    app.scene.setSkybox(asset.resources);
});
*/
