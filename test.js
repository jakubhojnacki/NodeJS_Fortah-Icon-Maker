const Application = require("./src/application");

(function () {
	const subfolder = "Stop";
	const templatesFolderPath = `./res/${subfolder}/Templates`;
	const symbolsFolderPath = `./res/${subfolder}/Symbols`;
	const iconsFolderPath = `./res/${subfolder}/Icons`;
	const temporaryFolderPath = "./tmp";
	const settingsPath = `./res/${subfolder}/settings.json`;
	let application = new Application(templatesFolderPath, symbolsFolderPath, iconsFolderPath, temporaryFolderPath, settingsPath);
	application.run();
})();
