/**
 * @module "IconLibrarySize" class
 * @description Represents one icon library size
 */

"use strict"

export class IconLibrarySize {
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
}