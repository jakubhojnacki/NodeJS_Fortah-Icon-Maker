(function () {
	const templatesFolderPath = ".\\Templates";
	const symbolsFolderPath = ".\\Symbols";
	const iconsFolderPath = ".\\Icons";
	const temporaryFolderPath = ".\\Temp";
	const settingsPath = ".\\iconMakerSettings.json";
	process.argv = [process.argv[0], process.argv[1], templatesFolderPath, symbolsFolderPath, iconsFolderPath, temporaryFolderPath, settingsPath];
	require(".\\iconMaker.js");
})();
