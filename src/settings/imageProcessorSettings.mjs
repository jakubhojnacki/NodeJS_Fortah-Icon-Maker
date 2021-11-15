/**
 * @module "ImageProcessorSettings" class
 * @description Settings describing one image processor
 */

"use strict";

export class ImageProcessorSettings {
    get type() { return this.mType; }
    set type(pValue) { this.mType = String.validate(pValue); }
    get directoryPath() { return this.mDirectoryPath; }
    set directoryPath(pValue) { this.mDirectoryPath = String.validate(pValue); }

    constructor(pType, pDirectoryPath) {
        this.type = pType;
        this.directoryPath = pDirectoryPath;
    }

    validate(pValidator) {
        pValidator.setComponent(ImageProcessorSettings.name);
        pValidator.testNotEmpty("type", this.type);
        pValidator.restoreComponent();
    }

    toData() {
        let data = super.toData();
        data.type = this.type;
        data.directoryPath = this.directoryPath;
        return data;
    }

    fromData(pData) {
        if (pData != null) {
            this.type = pData.type;
            this.directoryPath = pData.directoryPath;
        }
        return this;
    }       
}