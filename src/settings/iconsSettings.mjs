/**
 * @module "IconsSettings" class
 * @description Icons settings
 */

"use strict"

import { IconsSizesSettings } from "../settings/iconsSizesSettings.mjs";

export class IconsSettings {
    get directoryPath() { return this.mDirectoryPath; }
    set directoryPath(pValue) { this.mDirectoryPath = String.validate(pValue); }
    get sizes() { return this.mSizes; }
    set sizes(pValue) { this.mSizes = IconsSizesSettings.validate(pValue); }

    constructor(pDirectoryPath, pSizes) {
        this.directoryPath = pDirectoryPath;
        this.sizes = pSizes;
    }

    validate(pValidator) {
        pValidator.setComponent(IconsSettings.name);
        pValidator.testNotEmpty("directoryPath", this.directoryPath);
        this.sizes.validate(pValidator);
        pValidator.restoreComponent();
    }

    toData() {
        let data = {};
        data.directoryPath = this.directoryPath;
        data.sizes = this.sizes.toData();
        return data;
    }

    fromData(pData) {
        if (pData != null) {
            this.directoryPath = pData.directoryPath;
            this.sizes = ( new IconsSizesSettings()).fromData(pData.sizes);
        }
        return this;
    }      
}