/**
 * @module "Profile" class
 * @description Represents a profile
 */

"use strict"

import FileSystem from "fs";
import Path from "path";

import { ProfilePages } from "../profiles/profilePages.mjs";

export class Profile {
    get path() { return this.mPath; }
    set path(pValue) { this.mPath = String.verify(pValue); }
    get pages() { return this.mPages; }
    set pages(pValue) { this.mPages = pValue; }
    get symbolLibrary() { return this.mSymbolLibrary; }
    set symbolLibrary(pValue) { this.mSymbolLibrary = String.verify(pValue); }

    constructor(pPath, pName) {
        this.path = Path.join(pPath, pName);
        const dataPath = Path.join(this.path, "profile.json");
        const data = JSON.parse(FileSystem.readFileSync(dataPath));
        this.pages = (new ProfilePages()).fromData(data.pages);
        this.symbolLibrary = data.symbolLibrary;
    }
}