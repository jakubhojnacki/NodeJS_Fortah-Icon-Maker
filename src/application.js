const fs = require("fs");
const path = require("path");
const FileInfo = require("./fileInfo");
const ImageMagick = require("./imageMagick");
const ImageMagickShell = require("./imageMagickShell");
const ImagePage = require("./imagePage");
const SystemToolkit = require("./systemToolkit");
const { Terminal, TerminalLine, TerminalLabel, TerminalField } = require("./terminal");

class Application {
	static get info() { 
		return {
			name: "Icon Maker",
			version: "3.1.0.0",
			publisher: "JHJ (R)",
			date: "January 2021" 
		}; 
	}

	get templatesFolderPath() { return this.mTemplatesFolderPath; }
	get symbolsFolderPath() { return this.mSymbolsFolderPath; }
	get iconsFolderPath() { return this.mIconsFolderPath; }
	get temporaryFolderPath() { return this.mTemporaryFolderPath; }
	get globalSettingsPath() { return this.mGlobalSettingsPath; }
	get globalSettings() { return this.mGlobalSettings; }
	set globalSettings(value) { this.mGlobalSettings = value; }
	get localSettingsPath() { return this.mLocalSettingsPath; }
	get localSettings() { return this.mLocalSettings; }
	set localSettings(pValue) { this.mLocalSettings = pValue; }
	get imageManipulator() { return this.mImageManipulator; }
	set imageManipulator(value) { this.mImageManipulator = value; }
	get terminal() { return this.mTerminal; }
	get iconsCreatedField() { return this.mIconsCreatedField; }
	set iconsCreatedField(pValue) { this.mIconsCreatedField = pValue; }
	get iconsOmittedField() { return this.mIconsOmittedField; }
	set iconsOmittedField(pValue) { this.mIconsOmittedField = pValue; }
	get operatingSystem() { return this.mOperatingSystem; }
	get diagnosticMode() { return this.mDiagnosticMode; }

	constructor(pTemplatesFolderPath, pSymbolsFolderPath, pIconsFolderPath, pTemporaryFolderPath, pGlobalSettingsPath, pLocalSettingsPath) {
		this.mTemplatesFolderPath = pTemplatesFolderPath;
		this.mSymbolsFolderPath = pSymbolsFolderPath;
		this.mIconsFolderPath = pIconsFolderPath;
		this.mTemporaryFolderPath = pTemporaryFolderPath;
		this.mGlobalSettingsPath = pGlobalSettingsPath;
		this.mGlobalSettings = null;
		this.mLocalSettingsPath = pLocalSettingsPath;
		this.mLocalSettings = null;
		this.mImageManipulator = null;
		this.mTerminal = new Terminal(null, 25);
		this.mIconsCreatedField = null;
		this.mIconsOmittedField = null;
		this.mOperatingSystem = SystemToolkit.getOperatingSystem();
		this.mDiagnosticMode = false;
	}

	async run() {
		try {
			this.initialise();
			this.check();
			this.readAndCheckGlobalSettings();
			this.readAndCheckLocalSettings();
			this.createImageManipulator();
			await this.processSymbols();
			this.finalise();
		} catch (error) {
			console.error(`ERROR!!! ${error}`);
		}
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
        this.terminal.addControl(new TerminalField("Global Settings Path", this.globalSettingsPath));
        this.terminal.addControl(new TerminalField("Local Settings Path", this.localSettingsPath));
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
		if (!this.globalSettingsPath)
			throw "Empty global settings path";
		if (!this.localSettingsPath)
			throw "Empty local settings path";
	}

	readAndCheckGlobalSettings() {
		const globalSettingsData = fs.readFileSync(this.globalSettingsPath);
		this.globalSettings = JSON.parse(globalSettingsData);
		this.checkGlobalSettings();
	}

	checkGlobalSettings() {
		if (!this.globalSettings.imageManipulatorType)
			throw "Image manipulator type is empty";
	}

	readAndCheckLocalSettings() {
		const localSettingsData = fs.readFileSync(this.localSettingsPath);
		this.localSettings = JSON.parse(localSettingsData);
		this.checkLocalSettings();
	}

	checkLocalSettings() {
		if (!this.localSettings.pages)
			throw "Pages settings are empty";
		let pageIndex = 0;
		for (const page of this.localSettings.pages) {
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
		const imageManipulatorType = this.globalSettings.imageManipulatorType.trim().toLowerCase();
		switch (imageManipulatorType) {
			case "imagemagick":
				this.imageManipulator = this.createImageMagick(imageManipulatorType);
				break;
			case "imagemagickshell":
				this.imageManipulator = this.createImageMagickShell(imageManipulatorType);
				break;
			default:
				throw `Unknown image manipulator type: ${imageManipulatorType}`;
		}
	}

	createImageMagick(pImageManipulatorType) {
		return new ImageMagick();
	}

	createImageMagickShell(pImageManipulatorType) {
		if (!this.globalSettings.imageManipulators)
			throw "Image manipulators settigns are empty";
		const settings = this.globalSettings.imageManipulators.find(element => element.type.trim().toLowerCase() === pImageManipulatorType);
		if (!settings)
			throw `Image manipulator "${pImageManipulatorType}" settigns are empty`;
		if (!settings.paths)
			throw `Image manipulator "${pImageManipulatorType}" settigns paths are empty`;
		const pathSettings = settings.paths.find(element => element.operatingSystem.trim().toLowerCase() === this.operatingSystem);
		if (!pathSettings)
			throw `Image manipulator "${pImageManipulatorType}" paths for "${this.operatingSystem}" are empty`;
		const path = pathSettings.path;
		if (!path)
			throw `Image manipulator "${pImageManipulatorType}" path for "${this.operatingSystem}" is empty`;
		return new ImageMagickShell(path, this.diagnosticMode);
	}

	async processSymbols() {
		const folderEntries = fs.readdirSync(this.symbolsFolderPath, { withFileTypes: true });
		for (const folderEntry of folderEntries)
			if (folderEntry.isFile())
				if (this.fileIsASymbol(folderEntry.name)) {
					const symbolFileInfo = FileInfo.fromFolderPathAndFileName(this.symbolsFolderPath, folderEntry.name);
					await this.processSymbol(symbolFileInfo); 
				}
	}

	fileIsASymbol(pFileName) {
		let extension = path.extname(pFileName).trim().toLowerCase();
		return extension === ".ico";
	}

	async processSymbol(pSymbolFileInfo) {
		this.iconField.update(pSymbolFileInfo.name);
		let created = false;
		if (!this.symbolHasBeenProcessed(pSymbolFileInfo)) {
			let mergedFileInfos = [];
			for (const page of this.localSettings.pages) {
				const pageFileInfo = await this.extract(pSymbolFileInfo, page);
				const resizedFileInfo = await this.resize(pageFileInfo, page);
				const mergedFileInfo = await this.merge(resizedFileInfo, page);
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

	symbolHasBeenProcessed(pSymbolFileInfo) {
		const iconFileInfo = FileInfo.fromFolderPathAndFileName(this.iconsFolderPath, pSymbolFileInfo.name);
		return fs.existsSync(iconFileInfo.path);
	}

	async extract(pSymbolFileInfo, pPage) {
		const pageFileName = `Page${pPage.index}.${pPage.symbol.extension}`;
		const pageFileInfo = FileInfo.fromFolderPathAndFileName(this.temporaryFolderPath, pageFileName);
		if (fs.existsSync(pageFileInfo.path))
			fs.unlinkSync(pageFileInfo.path);
		await this.imageManipulator.extract(pSymbolFileInfo.path, pPage.index, pageFileInfo.path);
		return pageFileInfo;
	}

	async resize(pPageFileInfo, pPage) {
		const resizedFileName = `${pPageFileInfo.baseName}R.${pPageFileInfo.extension}`;
		const resizedFileInfo = FileInfo.fromFolderPathAndFileName(this.temporaryFolderPath, resizedFileName);
		if (fs.existsSync(resizedFileInfo.path))
			fs.unlinkSync(resizedFileInfo.path);
		if (pPage.symbol.resizeTo)
			await this.imageManipulator.resize(pPageFileInfo.path, pPage.symbol.resizeTo, pPage.symbol.resizeTo, resizedFileInfo.path);
		else
			fs.renameSync(pPageFileInfo.path, resizedFileInfo.path);
		return resizedFileInfo;
	}

	async merge(pResizedFileInfo, pPage) {
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
		await this.imageManipulator.merge(imagePages, mergedFileInfo.path);
		return mergedFileInfo;
	}

	async combine(pMergedFileInfos, pSymbolFileInfo) {
		let mergedFilePaths = [];
		for (const mergedFileInfo of pMergedFileInfos)
			mergedFilePaths.push(mergedFileInfo.path);
		const iconFileInfo = FileInfo.fromFolderPathAndFileName(this.iconsFolderPath, pSymbolFileInfo.name);
		if (fs.existsSync(iconFileInfo.path))
			fs.unlinkSync(iconFileInfo.path);
		await this.imageManipulator.combine(mergedFilePaths, iconFileInfo.path);
	}

	finalise() {
		this.iconField.update("");
		this.terminal.drawText("Completed.");
	}		
}

module.exports = Application;