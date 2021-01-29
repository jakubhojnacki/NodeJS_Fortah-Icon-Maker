const Application = require("./src/application");

(function () {
	const subfolder = "Files";
	const templatesFolderPath = `./res/${subfolder}/Templates`;
	const symbolsFolderPath = `./res/${subfolder}/Symbols`;
	const iconsFolderPath = `./res/${subfolder}/Icons`;
	const temporaryFolderPath = "./tmp";
	const globalSettingsPath = `./res/settings.json`;
	const localSettingsPath = `./res/${subfolder}/settings.json`;
	let application = new Application(templatesFolderPath, symbolsFolderPath, iconsFolderPath, temporaryFolderPath, globalSettingsPath, localSettingsPath);
	application.run();
})();
