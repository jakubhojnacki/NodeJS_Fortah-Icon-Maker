(function () {
	const subfolder = "Files";
	const templatesFolderPath = `.\\${subfolder}\\Templates`;
	const symbolsFolderPath = ".\\Symbols";
	const iconsFolderPath = `.\\${subfolder}\\Icons`;
	const temporaryFolderPath = ".\\Temp";
	const settingsPath = `.\\${subfolder}\\iconMakerSettings.json`;
	process.argv = [process.argv[0], process.argv[1], templatesFolderPath, symbolsFolderPath, iconsFolderPath, temporaryFolderPath, settingsPath];
	require(".\\iconMaker.js");
})();
