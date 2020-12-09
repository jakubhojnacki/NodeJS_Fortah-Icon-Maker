(function () {
	const subfolder = "Folders";
	const templatesFolderPath = `./${subfolder}/Templates`;
	const symbolsFolderPath = `./${subfolder}/Symbols`;
	const iconsFolderPath = `./${subfolder}/Icons`;
	const temporaryFolderPath = "./Temp";
	const settingsPath = `./${subfolder}/settings.json`;
	process.argv = [process.argv[0], process.argv[1], templatesFolderPath, symbolsFolderPath, iconsFolderPath, temporaryFolderPath, settingsPath];
	require("./main.js");
})();
