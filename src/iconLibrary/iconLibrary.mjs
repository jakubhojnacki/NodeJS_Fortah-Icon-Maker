/**
 * @module "IconLibrary" class
 * @description Represents a library of icons
 */

"use strict"

import { IconLibrarySizes } from "../iconLibrary/iconLibrarySizes.mjs";

export class IconLibrary {
    get directoryPath() { return this.mDirectoryPath; }
    set directoryPath(pValue) { this.mDirectoryPath = String.validate(pValue); }
    get sizes() { return this.mSizes; }
    set sizes(pValue) { this.mSizes = IconLibrarySizes.validate(pValue); }

    constructor(pSettings) {
        this.directoryPath = pSettings.directoryPath;
        this.sizes = new IconLibrarySizes(pSettings.sizes);
    }
}