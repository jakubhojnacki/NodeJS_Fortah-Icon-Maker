/**
 * @module "Profile" class
 * @description Represents a profile
 */

"use strict"

import FileSystem from "fs";
import Path from "path";

import { ProfilePages } from "../profiles/profilePages.mjs";
import { Validator } from "core-library";

export class Profile {
    get path() { return this.mPath; }
    set path(pValue) { this.mPath = String.verify(pValue); }
    get pages() { return this.mPages; }
    set pages(pValue) { this.mPages = pValue; }
    get symbolLibrary() { return this.mSymbolLibrary; }
    set symbolLibrary(pValue) { this.mSymbolLibrary = String.verify(pValue); }
    get outputFormat() { return this.mOutputFormat; }
    set outputFormat(pValue) { this.mOutputFormat = String.verify(pValue); }
    get outputPath() { return this.mOutputPath; }
    set outputPath(pValue) { this.mOutputPath = String.verify(pValue); }

    constructor(pPath, pName) {
        this.path = Path.join(pPath, pName);
        const dataPath = Path.join(this.path, "profile.json");
        const data = JSON.parse(FileSystem.readFileSync(dataPath));
        this.fromData(data);
    }

    fromData(pData) {
        if (pData != null) {
            this.pages = (new ProfilePages()).fromData(pData.pages);
            this.symbolLibrary = pData.symbolLibrary;
            this.outputFormat = pData.outputFormat;
            this.outputPath = pData.outputPath;
        }
    }

    validate() {
        const validator = new Validator();
        validator.setComponent(Profile.name);
        this.pages.validate(validator);
        validator.testNotEmpty("Symbol Library", this.symbolLibrary);
        validator.testNotEmpty("Output Format", this.outputFormat);
        validator.restoreComponent();
        return validator.require(true);
    }
}