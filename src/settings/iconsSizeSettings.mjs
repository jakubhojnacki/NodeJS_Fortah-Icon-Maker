/**
 * @module "IconsSizeSettings" class
 * @description Class representing one icons size settings
 */

"use strict"

export class IconsSizeSettings {
    get size() { return this.mSize; }
    set size(pValue) { this.mSize = Number.validateAsInteger(pValue); }
    get directoryPath() { return this.mDirectoryPath; }
    set directoryPath(pValue) { this.mDirectoryPath = String.validate(pValue); }

    constructor(pSize, pDirectoryPath) {
        this.size = pSize;
        this.directoryPath = pDirectoryPath;
    }

    validate(pValidator) {
        pValidator.setComponent(IconsSizeSettings.name);
        pValidator.testNotEmpty("size", this.size);
        pValidator.testNotEmpty("directoryPath", this.directoryPath);
        pValidator.restoreComponent();
    }

    toData() {
        let data = {}
        data.size = this.size;
        data.directoryPath = this.directoryPath;
        return data;
    }

    fromData(pData) {
        if (pData != null) {
            this.size = pData.size;
            this.directoryPath = pData.directoryPath;
        }
        return this;
    }        
}