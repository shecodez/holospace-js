const pc = window.pc;

export const CharacterSelectScript = () => {
	const CharacterSelect = pc.createScript("characterSelect");

	// initialize code called once per entity
	CharacterSelect.prototype.initialize = function() {
		var characterModel = this.app.root.findByName("Character Model");
		var X_BOT = characterModel.findByName("xbot");
		var Y_BOT = characterModel.findByName("ybot");

		this.isMale = false;
		this.player = X_BOT;

		var genderMenu = this.entity.findByName("Gender Menu");
		genderMenu.findByName("Female").element.height = 48;
		genderMenu.findByName("Female").element.width = 48;

		var self = this;
		genderMenu.findByName("Female").element.on("click", function() {
			self.setIsMale(false, X_BOT);
			Y_BOT.enabled = false;
		});

		genderMenu.findByName("Male").element.on("click", function() {
			self.setIsMale(true, Y_BOT);
			X_BOT.enabled = false;
		});
	};

	CharacterSelect.prototype.setIsMale = function(value, model) {
		this.isMale = value;

		this.player = model;
		this.player.enabled = true;
		this.setIconSize();
	};

	CharacterSelect.prototype.setIconSize = function() {
		var genderMenu = this.entity.findByName("Gender Menu");
		if (this.isMale) {
			genderMenu.findByName("Male").element.height = 48;
			genderMenu.findByName("Male").element.width = 48;
			genderMenu.findByName("Female").element.height = 32;
			genderMenu.findByName("Female").element.width = 32;
		} else {
			genderMenu.findByName("Female").element.height = 48;
			genderMenu.findByName("Female").element.width = 48;
			genderMenu.findByName("Male").element.height = 32;
			genderMenu.findByName("Male").element.width = 32;
		}
	};

	// update code called every frame
	CharacterSelect.prototype.update = function(dt) {};
};
