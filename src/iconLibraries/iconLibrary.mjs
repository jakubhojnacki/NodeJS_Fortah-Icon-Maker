/**
 * @module "IconLibrary" class
 * @description Represents a library of icons
 */

"use strict"

import { IconLibraryIcons } from "../iconLibraries/iconLibraryIcons.mjs";
import { IconLibrarySizes } from "../iconLibraries/iconLibrarySizes.mjs";

export class IconLibrary {
    get path() { return this.mPath; }
    set path(pValue) { this.mPath = String.verify(pValue); }
    get sizes() { return this.mSizes; }
    set sizes(pValue) { this.mSizes = Object.verify(pValue, () => { return new IconLibrarySizes(); }); }
    get icons() { return this.mIcons; }
    set icons(pValue) { this.mIcons = Object.verify(pValue, () => { return new IconLibraryIcons(); }); }

    constructor(pPath, pName) {
        const dataPath = Path.join(pPath, `${pName}.json`);
        const data = JSON.parse(FileSystem.readFileSync(dataPath));
        this.fromData(data);
    }

    fromData(pData) {
        if (pData != null) {
            this.path = data.path;
            this.sizes = (new IconLibrarySizes()).fromData(data.sizes);
            this.icons = (new IconLibraryIcons()).fromData(data.icons);
        }
    }
}