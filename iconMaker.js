(function () {
	const fs = require("fs");
	const path = require("path");
	
	class main {
		static run() {
			if (process.argv.length >= 7) {
				const templatesFolderPath = process.argv[2];
				const symbolsFolderPath = process.argv[3];
				const iconsFolderPath = process.argv[4];
				const temporaryFolderPath = process.argv[5];
				const settingsPath = proces.argv[6];
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

		constructor(pTemplatesFolderPath, pSymbolsFolderPath, pIconsFolderPath, pTemporaryFolderPath, pSettingsPath) {
			this.templatesFolderPath = pTemplatesFolderPath;
			this.symbolsFolderPath = pSymbolsFolderPath;
			this.iconsFolderPath = pIconsFolderPath;
			this.temporaryFolderPath = pTemporaryFolderPath;
			this.settingsPath = pSettingsPath;
			this.settings = null;
			this.noOfIconsProcessed = 0;
		}

		run() {
			this.showHeader();
			this.readSettings();
			this.processSymbols();
			this.showFooter();
		}

		showHeader() {
			console.log(`${iconMaker.info.name}, version ${iconMaker.info.version}, by ${iconMaker.info.publisher}, ${iconMaker.info.date}`)
			console.log('-'.repeat(79));
		}		

		readSettings() {
			const settingsData = fs.readFileSync(this.settingsPath);
			this.settings = JSON.parse(settingsData);
		}

		processSymbols() {
			const folderEntries = fs.readdirSync(this.symbolsFolderPath, { withFileTypes: true });
			for (const folderEntry of folderEntries) {
				const folderEntryPath = path.join(pFolderPath, folderEntry.name);
				if (folderEntry.isFile())
					if (this.fileIsASymbol(folderEntry.name)) {
						const symbolFileInfo = fileInfo.fromFolderPathAndFileName(this.symbolsFolderPath, folderEntry.name);
						this.processSymbol(symbolFileInfo); 
					}
			};
		}

		fileIsASymbol(pFileName) {
			let extension = path.extname(pFileName).trim().toLowerCase();
			return extension === ".ico";
		}

		processSymbol(pSymbolFileInfo) {
			let mergedFileInfos = [];
			for (const page of this.settings.pages) {
				const pageFileInfo = this.extractPage(pSymbolFileInfo, page);
				const resizedFileInfo = this.resize(pageFileInfo, page);
				const mergedFileInfo = this.merge(resizedFileInfo, page);
				mergedFileInfos.push(mergedFileInfo);
			}
			this.combine(mergedFileInfos, pSymbolFileInfo);
		}

		extractPage(pSymbolFileInfo, pPage) {
			const pageFileName = `${pSymbolFileInfo.baseName}${pPage.index}${pPage.symbol.extension}`;
			const pageFileInfo = fileInfo.fromFolderPathAndFileName(this.temporaryFolderPath, pageFileName);
			if (fs.existsSync(pageFileInfo.path))
				fs.unlinkSync(pageFileInfo.path);
			imageManipulator.extract(pSymbolFileInfo.path, pPage.index, pageFileInfo.path);
			return pageFileInfo;
		}

		resize(pPageFileInfo, pPage) {
			const resizedFileName = `${pPageFileInfo.baseName}R${pPageFileInfo.extension}`;
			const resizedFileInfo = fileInfo.fromFolderPathAndFileName(this.temporaryFolderPath, resizedFileName);
			if (fs.existsSync(resizedFileInfo.path))
				fs.unlinkSync(resizedFileInfo.path);
			imageManipulator.extract(pPageFileInfo.path, pPage.symbol.resizeTo, pPage.symbol.resizeTo, resizedFileInfo.path);
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
			if (fs.existsSync(mergedFileInfo.path))
				fs.unlinkSync(mergedFileInfo.path);
			imageManipulator.merge(imagePages, mergedFileInfo.path);
			return mergedFileInfo;
		}

		combine(pMergedFileInfos, pSymbolFileInfo) {
			let mergedFilePaths = [];

			const iconFileInfo = fileInfo.fromFolderPathAndFileName(this.iconsFolderPath, pSymbolFileInfo.name);
			if (fs.existsSync(iconFileInfo.path))
				fs.unlinkSync(iconFileInfo.path);
			imageManipulator.combine()
		}

		/*
        var lFolderPath = pFolder.path;
        var lImageFormatIndex = 0;
        var lImageFormat = null;
        var lMergedImagePath = "";
        var lImagePaths = [];
        for (lImageFormatIndex = 0; lImageFormatIndex < this.ImageFormats.length; lImageFormatIndex++) {
            lImageFormat = this.ImageFormats[lImageFormatIndex];
            lSourceFilePath = FileSystem.Combine(lFolderPath, lImageFormat.SourceFileName);
            lDestinationFilePath = FileSystem.Combine(lFolderPath, lImageFormat.DestinationFileName);
            this.ImageProcessor.ExtractImage(lSourceFilePath, lImageFormat.Index, lDestinationFilePath);
            this.ImageProcessor.ResizeImage(lDestinationFilePath, lDestinationFilePath, lImageFormat.ResizeTo, lImageFormat.ResizeTo);
            this.MergeImages(lImageFormat, lDestinationFilePath);
            lMergedImagePath = FileSystem.Combine(lFolderPath, lImageFormat.MergedFileName);
            lImagePaths.push(lMergedImagePath);
        }
        this.CombineImages(lImagePaths, pFolder);
        this.Cleanup(pFolder.path);
		this.CopyToFinalFolder(pFolder);
		*/

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

	class imageManipulator {
		static resize(pSourcePath, pNewWidth, pNewHeight, pDestinationPath) {

		}

		static extract(pSourcePath, pSourceIndex, pDestinationPath) {

		}

		static merge(pPages, pDestinationPath) {

		}

		static combine(pSourcePaths, pDestinationPath) {

		}
	}

	main.run();
})();