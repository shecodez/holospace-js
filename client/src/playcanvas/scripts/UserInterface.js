const pc = window.pc;

export const UserInterfaceScript = () => {
	const UserInterface = pc.createScript("userInterface");

	// initialize code called once per entity
	UserInterface.prototype.initialize = function() {
		const network = this.app.root.findByName("Network").script.network;

		// Grab the different screens
		const joinMenu = this.entity.findByName("Join Screen");
		const inGameUI = this.entity.findByName("InGame UI Screen");
		const helpMenu = this.entity.findByName("Help Screen");
		const settings = this.entity.findByName("Channel Settings");

		joinMenu.enabled = true;
		joinMenu.findByName("Join").element.on("click", function() {
			joinMenu.enabled = false;
			inGameUI.enabled = true;
			network.join();
		});
		joinMenu.findByName("Help Btn").element.on("click", function() {
			joinMenu.enabled = false;
			helpMenu.enabled = true;
		});
		joinMenu.findByName("Settings").element.on("click", function() {
			joinMenu.enabled = false;
			settings.enabled = true;
		});

		helpMenu.findByName("Back").element.on("click", function() {
			helpMenu.enabled = false;
			joinMenu.enabled = true;
		});

		settings.findByName("Back").element.on("click", function() {
			settings.enabled = false;
			joinMenu.enabled = true;
		});

		inGameUI.findByName("Exit").element.on("click", function() {
			inGameUI.enabled = false;
			network.exit();
			joinMenu.enabled = true;
		});
	};
};
