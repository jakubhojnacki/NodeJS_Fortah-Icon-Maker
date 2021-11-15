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
    get icons() { return this.mIcons; }
    set icons(pValue) { this.mIcons = pValue; }

    constructor(pSettings, pName) {
        const dataFilePath = Path.join(pSettings.directoryPath, pName, "profile.json");
        const data = JSON.parse(FileSystem.readFileSync(dataFilePath));
        this.pages = (new ProfilePages()).fromData(pData.pages);
        this.icons = (new ProfileIcons()).fromData(pData.icons);
    }
}