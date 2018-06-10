const pc = window.pc;

export const BillboardScript = () => {
	const Billboard = pc.createScript("billboard");

	// initialize code called once per entity
	Billboard.prototype.initialize = function() {
		this.camera = this.app.root.findByName("First Person Camera");
	};

	// update code called every frame
	Billboard.prototype.update = function(dt) {
		if (this.camera) {
			this.entity.setRotation(this.camera.getRotation());
			this.entity.rotateLocal(90, 0, 0);
		}
	};
};
