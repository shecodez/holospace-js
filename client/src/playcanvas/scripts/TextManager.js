const pc = window.pc;

export const TextManagerScript = () => {
	const Text = pc.createScript("text");

	Text.attributes.add("text", { type: "string", default: "Unknown" });
	Text.attributes.add("fontsize", {
		type: "number",
		default: 70,
		title: "Font Size"
	});

	// initialize code called once per entity
	Text.prototype.initialize = function() {
		// Create a canvas to do the text rendering
		this.canvas = document.createElement("canvas");
		this.canvas.height = 128;
		this.canvas.width = 1024;
		this.context = this.canvas.getContext("2d");

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
		ctx.fillStyle = "#00000000";
		ctx.fillRect(0, 0, w, h);

		// Write white text
		ctx.fillStyle = "white";
		ctx.save();
		ctx.font = "bold 70px Verdana"; // `bold ${this.fontsize}px Verdana`
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		ctx.fillText(this.text, w / 2, h / 2);
		ctx.restore();

		// Copy the canvas into the texture
		this.texture.upload();
	};

	// update code called every frame
	Text.prototype.update = function(dt) {};
};
