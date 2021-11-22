/**
 * @module "ImageProcessorSettings" class
 * @description Settings describing one image processor
 */

"use strict";

export class ImageProcessorSettings {
    get type() { return this.mType; }
    set type(pValue) { this.mType = String.verify(pValue); }
    get path() { return this.mPath; }
    set path(pValue) { this.mPath = String.verify(pValue); }

    constructor(pType, pPath) {
        this.type = pType;
        this.path = pPath;
    }

    validate(pValidator) {
        pValidator.setComponent(ImageProcessorSettings.name);
        pValidator.testNotEmpty("Type", this.type);
        pValidator.restoreComponent();
    }

    toData() {
        let data = super.toData();
        data.type = this.type;
        data.path = this.path;
        return data;
    }

    fromData(pData) {
        if (pData != null) {
            this.type = pData.type;
            this.path = pData.path;
        }
        return this;
    }       
}