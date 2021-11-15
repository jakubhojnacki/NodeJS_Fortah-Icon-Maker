/**
 * @module "Logic" class
 * @description Contains main logic of the application
 */

export class Logic {
    get application() { return this.mApplication; }
    set application(pValue) { this.mApplication = pValue; }
    get templatesDirectoryPath() { return this.mTemplatesDirectoryPath; }
    set templatesDirectoryPath(pValue) { this.mTemplatesDirectoryPath = String.validate(pValue); }
    get symbolsDirectoryPath() { return this.mSymbolsDirectoryPath; }
    set symbolsDirectoryPath(pValue) { this.mSymbolsDirectoryPath = String.validate(pValue); }
    get iconsDirectoryPath() { return this.mIconsDirectoryPath; }
    set iconsDirectoryPath(pValue) { this.mIconsDirectoryPath = String.validate(pValue); }
    get temporaryDirectoryPath() { return this.mTemporaryDirectoryPath; }
    set temporaryDirectoryPath(pValue) { this.mTemporaryDirectoryPath = String.validate(pValue); }
	
	constructor(pApplication, pTemplatesDirectoryPath, pSymbolsDirectoryPath, pIconsDirectoryPath, pTemporaryDirectoryPath) {
        this.application = pApplication;
		this.templatesDirectoryPath = pTemplatesDirectoryPath;
        this.symbolsDirectoryPath = pSymbolsDirectoryPath;
		this.iconsDirectoryPath = pIconsDirectoryPath;        
        this.temporaryDirectoryPath = pTemporaryDirectoryPath;
    }

    run() {
	}
}
