/**
 * @module "IconLibrarySize" class
 * @description Represents one icon library size
 */

"use strict"

export class IconLibrarySize {
    get size() { return this.mSize; }
    set size(pValue) { this.mSize = Number.validateAsInteger(pValue); }
    get directoryPath() { return this.mDirectoryPath; }
    set directoryPath(pValue) { this.mDirectoryPath = String.validate(pValue); }

    constructor(pSettings) {
        this.size = pSettings.size;
        this.directoryPath = pSettings.directoryPath;
    }
}