(function () {
	const fileSystem = require("fs");
	const path = require("path");	
	
	class main {
		static run() {
			if (process.argv.length >= 7) {
				const templatesFolderPath = process.argv[2];
				const symbolsFolderPath = process.argv[3];
				const iconsFolderPath = process.argv[4];
				const temporaryFolderPath = process.argv[5];
				const settingsPath = process.argv[6];
				let maker = new iconMaker(templatesFolderPath, symbolsFolderPath, iconsFolderPath, temporaryFolderPath, settingsPath);
				maker.run();
			} else
				throw "Please, pass templates folder path, symbols folder path, icons folder path, temporary folder path and settings path as parameters.";
		}
	}

	class iconMaker {
		static get info() { 
			return {
				name: "Icon Maker",
				version: "2.0.0.0",
				publisher: "JHJ (R)",
				date: "June 2020" 
			}; 
		}

		get templatesFolderPath() { return this.mTemplatesFolderPath; }
		set templatesFolderPath(value) { this.mTemplatesFolderPath = value; }

		get symbolsFolderPath() { return this.mSymbolsFolderPath; }
		set symbolsFolderPath(value) { this.mSymbolsFolderPath = value; }

		get iconsFolderPath() { return this.mIconsFolderPath; }
		set iconsFolderPath(value) { this.mIconsFolderPath = value; }

		get temporaryFolderPath() { return this.mTemporaryFolderPath; }
		set temporaryFolderPath(value) { this.mTemporaryFolderPath = value; }

		get settingsPath() { return this.mSettingsPath; }
		set settingsPath(value) { this.mSettingsPath = value; }

		get settings() { return this.mSettings; }
		set settings(value) { this.mSettings = value; }

		get imageManipulator() { return this.mImageManipulator; }
		set imageManipulator(value) { this.mImageManipulator = value; }

		get noOfIconsProcessed() { return this.mNoOfIconsProcessed; }
		set noOfIconsProcessed(value) { this.mNoOfIconsProcessed = value; }

		constructor(pTemplatesFolderPath, pSymbolsFolderPath, pIconsFolderPath, pTemporaryFolderPath, pSettingsPath) {
			this.templatesFolderPath = pTemplatesFolderPath;
			this.symbolsFolderPath = pSymbolsFolderPath;
			this.iconsFolderPath = pIconsFolderPath;
			this.temporaryFolderPath = pTemporaryFolderPath;
			this.settingsPath = pSettingsPath;
			this.settings = null;
			this.imageManipulator = null;
			this.noOfIconsProcessed = 0;
		}

		run() {
			this.showHeader();
			this.readSettings();
			this.createImageManipulator();
			this.processSymbols();
			this.showFooter();
		}

		showHeader() {
			console.log(`${iconMaker.info.name}, version ${iconMaker.info.version}, by ${iconMaker.info.publisher}, ${iconMaker.info.date}`)
			console.log('-'.repeat(79));
		}		

		readSettings() {
			const settingsData = fileSystem.readFileSync(this.settingsPath);
			this.settings = JSON.parse(settingsData);
		}

		createImageManipulator() {
			const imageManipulatorType = this.settings.imageManipulator.type.trim().toLowerCase();
			switch (imageManipulatorType) {
				case "imagemagick": 
					this.imageManipulator = new imageMagick();
					break;
				default:
					throw `Unknown image manipulator type: ${this.settings.imageManipulator.type}`;
			}
		}

		processSymbols() {
			const folderEntries = fileSystem.readdirSync(this.symbolsFolderPath, { withFileTypes: true });
			for (const folderEntry of folderEntries)
				if (folderEntry.isFile())
					if (this.fileIsASymbol(folderEntry.name)) {
						const symbolFileInfo = fileInfo.fromFolderPathAndFileName(this.symbolsFolderPath, folderEntry.name);
						this.processSymbol(symbolFileInfo); 
					}
		}

		fileIsASymbol(pFileName) {
			let extension = path.extname(pFileName).trim().toLowerCase();
			return extension === ".ico";
		}

		processSymbol(pSymbolFileInfo) {
			console.log(`${pSymbolFileInfo.name}`);
			let mergedFileInfos = [];
			for (const page of this.settings.pages) {
			/*^^^
				const pageFileInfo = this.extract(pSymbolFileInfo, page);
				const resizedFileInfo = this.resize(pageFileInfo, page);
				const mergedFileInfo = this.merge(resizedFileInfo, page);
				mergedFileInfos.push(mergedFileInfo);
			^^^*/
			}
			this.combine(mergedFileInfos, pSymbolFileInfo);
		}

		extract(pSymbolFileInfo, pPage) {
			const pageFileName = `${pSymbolFileInfo.baseName}${pPage.index}${pPage.symbol.extension}`;
			const pageFileInfo = fileInfo.fromFolderPathAndFileName(this.temporaryFolderPath, pageFileName);
			if (fileSystem.existsSync(pageFileInfo.path))
				fileSystem.unlinkSync(pageFileInfo.path);
			this.imageManipulator.extract(pSymbolFileInfo.path, pPage.index, pageFileInfo.path);
			return pageFileInfo;
		}

		resize(pPageFileInfo, pPage) {
			const resizedFileName = `${pPageFileInfo.baseName}R${pPageFileInfo.extension}`;
			const resizedFileInfo = fileInfo.fromFolderPathAndFileName(this.temporaryFolderPath, resizedFileName);
			if (fileSystem.existsSync(resizedFileInfo.path))
				fileSystem.unlinkSync(resizedFileInfo.path);
			this.imageManipulator.extract(pPageFileInfo.path, pPage.symbol.resizeTo, pPage.symbol.resizeTo, resizedFileInfo.path);
			return resizedFileInfo;
		}

		merge(pResizedFileInfo, pPage) {
			const backgroundFileInfo = fileInfo.fromFolderPathAndFileName(this.templatesFolderPath, pPage.template.background);
			const foregroundFileInfo = fileInfo.fromFolderPathAndFileName(this.templatesFolderPath, pPage.template.foreground);
			const mergedFileName = `${pResizedFileInfo.baseName}M${pResizedFileInfo.extension}`;
			const mergedFileInfo = fileInfo.fromFolderPathAndFileName(this.temporaryFolderPath, mergedFileName);
			const imagePages = [
				new imagePage(backgroundFileInfo, 0, 0),
				new imagePage(pResizedFileInfo, pPage.symbol.xOffset, pPage.symbol.yOffset),
				new imagePage(foregroundFileInfo, 0, 0)
			];
			if (fileSystem.existsSync(mergedFileInfo.path))
				fileSystem.unlinkSync(mergedFileInfo.path);
			this.imageManipulator.merge(imagePages, mergedFileInfo.path);
			return mergedFileInfo;
		}

		combine(pMergedFileInfos, pSymbolFileInfo) {
			let mergedFilePaths = [];
			for (const mergedFileInfo of pMergedFileInfos)
				mergedFilePaths.push(mergedFileInfo.path);
			const iconFileInfo = fileInfo.fromFolderPathAndFileName(this.iconsFolderPath, pSymbolFileInfo.name);
			if (fileSystem.existsSync(iconFileInfo.path))
				fileSystem.unlinkSync(iconFileInfo.path);
			this.imageManipulator.combine(mergedFilePaths, iconFileInfo.path);
		}

		showFooter() {
			console.log('-'.repeat(79));
			console.log(`Completed. ${this.noOfIconsProcessed} icons processed.`);
		}		
	}

	class fileInfo {
		get path() { return this.mPath; }
		set path(pValue) { 
			this.mPath = pValue; 
			this.name = path.basename(this.path);
		}		

		get name() { return this.mName; }
		set name(pValue) {
			this.mName = pValue;
			this.extension = path.extname(this.name);
			this.baseName = path.basename(this.name, this.extension);
		}

		get extension() { return this.mExtension; }
		set extension(pValue) { this.mExtension = pValue; }

		get baseName() { return this.mBaseName; }
		set baseName(pValue) { this.mBaseName = pValue; }

		constructor() {
			this.path = "";
			this.name = "";
			this.extension = "";
			this.baseName = "";
		}

		static fromPath(pPath) {
			let newFileInfo = new fileInfo();
			newFileInfo.path = pPath;
			return newFileInfo;
		}

		static fromFolderPathAndFileName(pFolderPath, pFileName) {
			return fileInfo.fromPath(path.join(pFolderPath, pFileName));
		}
	}

	class imagePage {
		get fileInfo() { return this.mFileInfo; }
		set fileInfo(pValue) { this.mFileInfo = pValue; }

		get xOffset() { return this.mXOffset; }
		set xOffset(pValue) { this.mXOffset = pValue; }

		get yOffset() { return this.mYOffset; }
		set yOffset(pValue) { this.mYOffset = pValue; }

		constructor(pFileInfo, pXOffset, pYOffset) {
			this.fileInfo = pFileInfo;
			this.xOffset = pXOffset;
			this.yOffset = pYOffset;
		}
	}

	class imageMagick {
		get executablesPath() { return this.mPath; }
		set executablesPath(value) { this.mPath = value; }

		get convertPath() { return path.join(this.executablesPath, "convert"); }

		constructor(pExecutablesPath) {
			this.executablesPath = pExecutablesPath;
		}
		
		extract(pSourcePath, pSourceIndex, pDestinationPath) {
			this.convert([pSourcePath, `[${pSourceIndex}]`, pDestinationPath]);
		}

		resize(pSourcePath, pNewWidth, pNewHeight, pDestinationPath) {
			this.convert([pSourcePath], "-resize", `${pNewWidth}x${pNewHeight}`, pDestinationPath);
		}

		merge(pPages, pDestinationPath) {
			let parameters = [];
			for (const page of pPages) {
				parameters.push("-page");
				parameters.push(`+${page.xOffset}+${page.yOffset}`);
				parameters.push(page.fileInfo.path);
			}
			parameters.push("-layers");
			parameters.push("coalesce");
			parameters.push(pDestinationPath);
			this.convert(parameters);
		}

		combine(pSourcePaths, pDestinationPath) {
			let parameters = [];
			for (const sourcePath of pSourcePaths)
				parameters.push(sourcePath);
			parameters.push(pDestinationPath);
			this.convert(parameters);
		}

		convert(pParameters) {
			this.run(this.convertPath, pParameters);
		}

		run(pCommand, pParameters) {
			this.showCommand(pCommand, pParameters);
			/*^^^
			const childProcess = require("child_process");
			const result = childProcess.spawnSync(pCommand, pArguments);
			if (result.error)
				throw result.error.message;
			^^^*/
			//^^^console.log( `stderr: ${ls.stderr.toString()}` );
			//^^^console.log( `stdout: ${ls.stdout.toString()}` );
		}

		showCommand(pCommand, pParameters) {
			let text = pCommand;
			for (const parameter of pParameters) {
				if (text.length > 0)
					text += " ";
				text += `"${parameter}"`;
			}
			console.log(text);
		}
	}

	main.run();
})();