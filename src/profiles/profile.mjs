/**
 * @module "Profile" class
 * @description Represents a profile
 */

"use strict"

import FileSystem from "fs";
import Path from "path";

import { ProfilePages } from "../profiles/profilePages.mjs";

export class Profile {
    get pages() { return this.mPages; }
    set pages(pValue) { this.mPages = pValue; }
    get iconLibrary() { return this.mIconLibrary; }
    set iconLibrary(pValue) { this.mIconLibrary = String.verify(pValue); }

    constructor(pPath, pName) {
        const dataPath = Path.join(pPath, pName, "profile.json");
        const data = JSON.parse(FileSystem.readFileSync(dataPath));
        this.pages = (new ProfilePages()).fromData(data.pages);
        this.iconLibrary = data.iconLibrary;
    }
}