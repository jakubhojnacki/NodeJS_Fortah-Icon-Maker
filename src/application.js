const fs = require("fs");
const path = require("path");
const FileInfo = require("./fileInfo");
const GraphicsMagick = require("./imageMagick");
const ImageMagickShell = require("./imageMagickShell");
const ImagePage = require("./imagePage");
const { Terminal, TerminalLine, TerminalLabel, TerminalField } = require("./terminal");

class Application {
	static get info() { 
		return {
			name: "Icon Maker",
			version: "3.0.0.0",
			publisher: "JHJ (R)",
			date: "January 2021" 
		}; 
	}

	get templatesFolderPath() { return this.mTemplatesFolderPath; }
	get symbolsFolderPath() { return this.mSymbolsFolderPath; }
	get iconsFolderPath() { return this.mIconsFolderPath; }
	get temporaryFolderPath() { return this.mTemporaryFolderPath; }
	get settingsPath() { return this.mSettingsPath; }
	get settings() { return this.mSettings; }
	set settings(value) { this.mSettings = value; }
	get imageManipulator() { return this.mImageManipulator; }
	set imageManipulator(value) { this.mImageManipulator = value; }
	get terminal() { return this.mTerminal; }
	get iconsCreatedField() { return this.mIconsCreatedField; }
	set iconsCreatedField(pValue) { this.mIconsCreatedField = pValue; }
	get iconsOmittedField() { return this.mIconsOmittedField; }
	set iconsOmittedField(pValue) { this.mIconsOmittedField = pValue; }
	get diagnosticMode() { return this.mDiagnosticMode; }

	constructor(pTemplatesFolderPath, pSymbolsFolderPath, pIconsFolderPath, pTemporaryFolderPath, pSettingsPath) {
		this.mTemplatesFolderPath = pTemplatesFolderPath;
		this.mSymbolsFolderPath = pSymbolsFolderPath;
		this.mIconsFolderPath = pIconsFolderPath;
		this.mTemporaryFolderPath = pTemporaryFolderPath;
		this.mSettingsPath = pSettingsPath;
		this.mSettings = null;
		this.mImageManipulator = null;
		this.mTerminal = new Terminal(null, 25);
		this.mIconsCreatedField = null;
		this.mIconsOmittedField = null;
		this.mDiagnosticMode = false;
	}

	run() {
		this.initialise();
		this.check();
		this.readSettings();
		this.checkSettings();
		this.createImageManipulator();
		this.processSymbols();
		this.finalise();
	}

	initialise() {
		const info = `${Application.info.name}, version ${Application.info.version}, by ${Application.info.publisher}, ${Application.info.date}`;
		
		this.terminal.addControl(new TerminalLine());
        this.terminal.addControl(new TerminalLabel(info));
        this.terminal.addControl(new TerminalLine());
        this.terminal.addControl(new TerminalField("Templates Folder Path", this.templatesFolderPath));
        this.terminal.addControl(new TerminalField("Symbols Folder Path", this.symbolsFolderPath));
        this.terminal.addControl(new TerminalField("Icons Folder Path", this.iconsFolderPath));
        this.terminal.addControl(new TerminalField("Temporary Folder Path", this.temporaryFolderPath));
        this.terminal.addControl(new TerminalField("Settings Path", this.settingsPath));
        this.terminal.addControl(new TerminalLine());
        this.iconsCreatedField = this.terminal.addControl(new TerminalField("Icons Created", 0));
        this.iconsOmittedField = this.terminal.addControl(new TerminalField("Icons Omitted", 0));
        this.iconField = this.terminal.addControl(new TerminalField("Icon", ""));
        this.terminal.addControl(new TerminalLine());
        
        this.terminal.draw();
	}		

	check() {
		if (!this.templatesFolderPath)
			throw "Empty templates folder path";
		if (!this.symbolsFolderPath)
			throw "Empty symbols folder path";
		if (!this.iconsFolderPath)
			throw "Empty icons folder path";
		if (!this.temporaryFolderPath)
			throw "Empty temporary folder path";
		if (!this.settingsPath)
			throw "Empty settings path";
	}

	readSettings() {
		const settingsData = fs.readFileSync(this.settingsPath);
		this.settings = JSON.parse(settingsData);
	}

	checkSettings() {
		if (!this.settings.imageManipulator)
			throw "Image manipulator settings are empty";
		if (!this.settings.imageManipulator.type)
			throw "Image manipulator type is empty in settings";
		if (!this.settings.imageManipulator.path)
			throw "Image manipulator path is empty in settings";
		if (!this.settings.pages)
			throw "Pages settings are empty";
		let pageIndex = 0;
		for (const page of this.settings.pages) {
			if (!page.name)
				throw `Page ${pageIndex} name is empty in settings`;
			if (!page.template)
				throw `Page ${pageIndex} template is empty in settings`;
			if ((!page.template.foreground) && (!page.template.background))
				throw `Page ${pageIndex} template foreground and background are both empty in settings`;
			if (!page.symbol)
				throw `Page ${pageIndex} symbol is empty in settings`;
			if (!page.symbol.extension)
				throw `Page ${pageIndex} symbol extension is empty in settings`;
		}
	}

	createImageManipulator() {
		const imageManipulatorType = this.settings.imageManipulator.type.trim().toLowerCase();
		switch (imageManipulatorType) {
			case "imagemagicks":
				this.imageManipulator = new ImageMagick();
				break;
			case "imagemagickshell": 
				this.imageManipulator = new ImageMagickShell(this.settings.imageManipulator.path, this.diagnosticMode);
				break;
			default:
				throw `Unknown image manipulator type: ${this.settings.imageManipulator.type}`;
		}
	}

	processSymbols() {
		const folderEntries = fs.readdirSync(this.symbolsFolderPath, { withFileTypes: true });
		for (const folderEntry of folderEntries)
			if (folderEntry.isFile())
				if (this.fileIsASymbol(folderEntry.name)) {
					const symbolFileInfo = FileInfo.fromFolderPathAndFileName(this.symbolsFolderPath, folderEntry.name);
					this.processSymbol(symbolFileInfo); 
				}
	}

	fileIsASymbol(pFileName) {
		let extension = path.extname(pFileName).trim().toLowerCase();
		return extension === ".ico";
	}

	symbolHasBeenProcessed(pSymbolFileInfo) {
		const iconFileInfo = FileInfo.fromFolderPathAndFileName(this.iconsFolderPath, pSymbolFileInfo.name);
		return fs.existsSync(iconFileInfo.path);
	}

	processSymbol(pSymbolFileInfo) {
		this.iconField.update(pSymbolFileInfo.name);
		let created = false;
		if (!this.symbolHasBeenProcessed(pSymbolFileInfo)) {
			let mergedFileInfos = [];
			for (const page of this.settings.pages) {
				const pageFileInfo = this.extract(pSymbolFileInfo, page);
				const resizedFileInfo = this.resize(pageFileInfo, page);
				const mergedFileInfo = this.merge(resizedFileInfo, page);
				mergedFileInfos.push(mergedFileInfo);
			}
			this.combine(mergedFileInfos, pSymbolFileInfo);
			this.iconsCreated++;
			created = true;
		}
		if (created)
			this.iconsCreatedField.update(this.iconsCreatedField.value + 1);
		else
			this.iconsOmittedField.update(this.iconsOmittedField.value + 1);
	}

	extract(pSymbolFileInfo, pPage) {
		const pageFileName = `Page${pPage.index}.${pPage.symbol.extension}`;
		const pageFileInfo = FileInfo.fromFolderPathAndFileName(this.temporaryFolderPath, pageFileName);
		if (fs.existsSync(pageFileInfo.path))
			fs.unlinkSync(pageFileInfo.path);
		this.imageManipulator.extract(pSymbolFileInfo.path, pPage.index, pageFileInfo.path);
		return pageFileInfo;
	}

	resize(pPageFileInfo, pPage) {
		const resizedFileName = `${pPageFileInfo.baseName}R.${pPageFileInfo.extension}`;
		const resizedFileInfo = FileInfo.fromFolderPathAndFileName(this.temporaryFolderPath, resizedFileName);
		if (fs.existsSync(resizedFileInfo.path))
			fs.unlinkSync(resizedFileInfo.path);
		if (pPage.symbol.resizeTo)
			this.imageManipulator.resize(pPageFileInfo.path, pPage.symbol.resizeTo, pPage.symbol.resizeTo, resizedFileInfo.path);
		else
			fs.renameSync(pPageFileInfo.path, resizedFileInfo.path);
		return resizedFileInfo;
	}

	merge(pResizedFileInfo, pPage) {
		const mergedFileName = `${pResizedFileInfo.baseName}M.${pResizedFileInfo.extension}`;
		const mergedFileInfo = FileInfo.fromFolderPathAndFileName(this.temporaryFolderPath, mergedFileName);
		const imagePages = [];
		if (pPage.template.background) {
			const backgroundFileInfo = FileInfo.fromFolderPathAndFileName(this.templatesFolderPath, pPage.template.background);
			imagePages.push(new ImagePage(backgroundFileInfo, 0, 0));
		}
		imagePages.push(new ImagePage(pResizedFileInfo, pPage.symbol.xOffset, pPage.symbol.yOffset));	
		if (pPage.template.foreground) {
			const foregroundFileInfo = FileInfo.fromFolderPathAndFileName(this.templatesFolderPath, pPage.template.foreground);
			imagePages.push(new ImagePage(foregroundFileInfo, 0, 0));
		}
		if (fs.existsSync(mergedFileInfo.path))
			fs.unlinkSync(mergedFileInfo.path);
		this.imageManipulator.merge(imagePages, mergedFileInfo.path);
		return mergedFileInfo;
	}

	combine(pMergedFileInfos, pSymbolFileInfo) {
		let mergedFilePaths = [];
		for (const mergedFileInfo of pMergedFileInfos)
			mergedFilePaths.push(mergedFileInfo.path);
		const iconFileInfo = FileInfo.fromFolderPathAndFileName(this.iconsFolderPath, pSymbolFileInfo.name);
		if (fs.existsSync(iconFileInfo.path))
			fs.unlinkSync(iconFileInfo.path);
		this.imageManipulator.combine(mergedFilePaths, iconFileInfo.path);
	}

	finalise() {
		this.iconField.update("");
		this.terminal.drawText("Completed.");
	}		
}

module.exports = Application;