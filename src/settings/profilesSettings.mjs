/**
 * @module "ProfilesSettings" class
 * @description Settings of profiles
 */

"use strict";

export class ProfilesSettings {
    get directoryPath() { return this.mDirectoryPath; }
    set directoryPath(pValue) { this.mDirectoryPath = String.validate(pValue); }
    get iconsSubDirectory() { return this.mIconsSubDirectory; }
    set iconsSubDirectory(pValue) { this.mIconsSubDirectory = String.validate(pValue); }
    get symbolsSubDirectory() { return this.mSymbolsSubDirectory; }
    set symbolsSubDirectory(pValue) { this.mSymbolsSubDirectory = String.validate(pValue); }
    get templatesSubDirectory() { return this.mTemplatesSubDirectory; }
    set templatesSubDirectory(pValue) { this.mTemplatesSubDirectory = String.validate(pValue); }

    constructor(pDirectoryPath, pIconsSubDirectory, pSymbolsSubDirectory, pTemplatesSubDirectory) {
        this.directoryPath = pDirectoryPath;
        this.iconsSubDirectory = pIconsSubDirectory;
        this.symbolsSubDirectory = pSymbolsSubDirectory;
        this.templatesSubDirectory = pTemplatesSubDirectory;
    }

    validate(pValidator) {
        pValidator.setComponent(ProfilesSettings.name);
        pValidator.testNotEmpty("directoryPath", this.directoryPath);
        pValidator.testNotEmpty("iconsSubDirectory", this.iconsSubDirectory);
        pValidator.testNotEmpty("symbolsSubDirectory", this.symbolsSubDirectory);
        pValidator.testNotEmpty("templatesSubDirectory", this.templatesSubDirectory);
        pValidator.restoreComponent();
    }

    toData() {
        let data = super.toData();
        data.directoryPath = this.directoryPath;
        data.iconsSubDirectory = this.iconsSubDirectory;
        data.symbolsSubDirectory = this.symbolsSubDirectory;
        data.templatesSubDirectory = this.templatesSubDirectory;
        return data;
    }

    fromData(pData) {
        super.fromData(pData);
        if (pData != null) {
            this.directoryPath = pData.directoryPath;
            this.iconsSubDirectory = pData.iconsSubDirectory;
            this.symbolsSubDirectory = pData.symbolsSubDirectory;
            this.templatesSubDirectory = pData.templatesSubDirectory;
        }
        return this;
    }       
}