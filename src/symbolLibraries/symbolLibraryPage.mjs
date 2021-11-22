/**
 * @module "SymbolLibraryPage" class
 * @description Represents one symbol library page
 */

"use strict"

export class SymbolLibraryPage {
    get size() { return this.mSize; }
    set size(pValue) { this.mSize = Number.verifyAsInteger(pValue); }
    get path() { return this.mPath; }
    set path(pValue) { this.mPath = String.verify(pValue); }

    constructor(pSize, pPath) {
        this.size = pSize;
        this.path = pPath;
    }

    fromData(pData) {
        if (pData != null) {
            this.size = pData.size;
            this.path = pData.path;
        }
        return this;
    }

    validate(pValidator) {
        pValidator.setComponent(SymbolLibraryPage.name);
        pValidator.testNotEmpty("Size", this.size);
        pValidator.testNotEmpty("Path", this.path);
        pValidator.restoreComponent();
    }
}