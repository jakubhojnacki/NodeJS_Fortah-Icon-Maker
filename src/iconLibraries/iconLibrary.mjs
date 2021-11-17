/**
 * @module "IconLibrary" class
 * @description Represents a library of icons
 */

"use strict"

import FileSystem from "fs";
import Path from "path";

import { IconLibraryIcons } from "../iconLibraries/iconLibraryIcons.mjs";
import { IconLibraryPages } from "../iconLibraries/iconLibraryPages.mjs";

export class IconLibrary {
    get path() { return this.mPath; }
    set path(pValue) { this.mPath = String.verify(pValue); }
    get pages() { return this.mPages; }
    set pages(pValue) { this.mPages = Object.verify(pValue, () => { return new IconLibraryPages(); }); }
    get icons() { return this.mIcons; }
    set icons(pValue) { this.mIcons = Object.verify(pValue, () => { return new IconLibraryIcons(); }); }

    constructor(pPath, pName) {
        const dataPath = Path.join(pPath, `${pName}.json`);
        const data = JSON.parse(FileSystem.readFileSync(dataPath));
        this.fromData(data);
    }

    fromData(pData) {
        if (pData != null) {
            this.path = pData.path;
            this.pages = (new IconLibraryPages()).fromData(pData.pages);
            this.icons = (new IconLibraryIcons()).fromData(pData.icons);
        }
        return this;
    }
}