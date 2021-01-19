const Application = require("./src/application");

(function () {
	if (process.argv.length >= 7) {
		const templatesFolderPath = process.argv[2];
		const symbolsFolderPath = process.argv[3];
		const iconsFolderPath = process.argv[4];
		const temporaryFolderPath = process.argv[5];
		const settingsPath = process.argv[6];
		let application = new Application(templatesFolderPath, symbolsFolderPath, iconsFolderPath, temporaryFolderPath, settingsPath);
		application.run();
	} else
		throw "Please, pass templates folder path, symbols folder path, icons folder path, temporary folder path and settings path as parameters.";
})();