/**
 * @module "IconLibrarySettings" class
 * @description Settings of icon library
 */

"use strict"

import { IconLibrarySizesSettings } from "../settings/iconLibrarySizesSettings.mjs";

export class IconLibrarySettings {
    get directoryPath() { return this.mDirectoryPath; }
    set directoryPath(pValue) { this.mDirectoryPath = String.validate(pValue); }
    get sizes() { return this.mSizes; }
    set sizes(pValue) { this.mSizes = IconLibrarySizesSettings.validate(pValue); }

    constructor(pDirectoryPath, pSizes) {
        this.directoryPath = pDirectoryPath;
        this.sizes = pSizes;
    }

    validate(pValidator) {
        pValidator.setComponent(IconLibrarySettings.name);
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
            this.sizes = ( new IconLibrarySizesSettings()).fromData(pData.sizes);
        }
        return this;
    }      
}