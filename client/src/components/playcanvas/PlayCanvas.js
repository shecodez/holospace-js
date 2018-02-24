import React from 'react';
import PropTypes from 'prop-types';

const pc = window.pc;

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

		const ctx = this.canvas;
    ctx.width = width;
    ctx.height = height;

		const app = new pc.Application(ctx, {});
    app.start();

    // Fill the available space at full resolution
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    const cube = this.createBoxEntity();
    const camera = this.createCameraEntity();
    const light = this.createDirectionalLightEntity();

    // add to hierachy
    app.root.addChild(cube);
    app.root.addChild(camera);
    app.root.addChild(light);

    // Set up initial positions and orientations
    camera.setPosition(0, 0, 3);
    light.setEulerAngles(45, 0, 0);

    this.createRotationScript();

    // add rotation script to cube
    cube.addComponent('script');
    cube.script.create('rotate');

    // Resize the canvas when the window is resized
    app.resizeCanvas(width, height);
	};

  createBoxEntity = () => {
    const cube = new pc.Entity();
    cube.addComponent('model', {
        type: "box"
    });
    return cube;
  }

  createCameraEntity = () => {
    const camera = new pc.Entity();
    camera.addComponent('camera', {
        clearColor: new pc.Color(0.1, 0.2, 0.3)
    });
    return camera;
  }

  createDirectionalLightEntity = () => {
    const light = new pc.Entity();
    light.addComponent('light');
    return light;
  }

  createRotationScript = () => {
    const Rotate = pc.createScript('rotate');
    Rotate.prototype.update = function (dt) {
        this.entity.rotate(10 * dt, 20 * dt, 30 * dt);
    }
  }

	render() {
    const { width, height } = this.props;

		return (
      <canvas
				id="application-canvas"
				ref={element => {
					this.canvas = element;
				}}
        width={width} height={height}
        style={ { display: "block", width:`${width}px`, height:`${height}px` } }
			/>
		);
	}
}

PlayCanvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
}

export default PlayCanvas;
