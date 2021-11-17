/**
 * @module "IconLibraryIcon" class
 * @description Represents one icon library icon
 */

"use strict"

export class IconLibraryIcon {
    get name() { return this.mName; }
    set name(pValue) { this.mName = String.verify(pValue); }
    get path() { return this.mPath; }
    set path(pValue) { this.mPath = String.verify(pValue); }

    constructor(pName, pPath) {
        this.name = pName;
        this.path = pPath;
    }

    fromData(pData) {
        if (pData != null) {
            this.name = pData.name;
            this.path = pData.path;
        }
        return this;
    }

    toString() {
        return this.name;
    }
}