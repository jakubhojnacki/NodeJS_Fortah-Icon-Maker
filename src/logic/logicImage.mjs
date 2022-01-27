/**
 * @module "LogicImage" class
 * @description Keeps information about one image processed by logic
 */

"use strict";

import FileSystem from "fs";

import { FileSystemItem } from "fortah-file-system-library";
import { FileSystemItemType } from "fortah-file-system-library";
import { ImagePage } from "fortah-image-library";

export class LogicImage {
    get name() { return this.mName; }
    set name(pValue) { this.mName = String.verify(pValue); }
    get size() { return this.mSize; }
    set size(pValue) { this.mSize = Number.verifyAsInteger(pValue); }
    get backPath() { return this.mBackPath; }
    set backPath(pValue) { this.mBackPath = String.verify(pValue); }
    get symbolPath() { return this.mSymbolPath; }
    set symbolPath(pValue) { this.mSymbolPath = String.verify(pValue); }
    get symbolSize() { return this.mSymbolSize; }
    set symbolSize(pValue) { this.mSymbolSize = String.verify(pValue); }
    get symbolXOffset() { return this.mSymbolXOffset; }
    set symbolXOffset(pValue) { this.mSymbolXOffset = Number.verifyAsInteger(pValue); }
    get symbolYOffset() { return this.mSymbolYOffset; }
    set symbolYOffset(pValue) { this.mSymbolYOffset = Number.verifyAsInteger(pValue); }
    get forePath() { return this.mForePath; }
    set forePath(pValue) { this.mForePath = String.verify(pValue); }
    get outputPath() { return this.mOutputPath; }
    set outputPath(pValue) { this.mOutputPath = String.verify(pValue); }

    get imagePages() { return this.getImagePages(); }

    constructor(pName, pSize, pBackPath, pSymbolPath, pSymbolSize, pSymbolXOffset, pSymbolYOffset, pForePath, pOutputPath) {
        this.name = pName;
        this.size = pSize;
        this.backPath = pBackPath;
        this.symbolPath = pSymbolPath;
        this.symbolSize = pSymbolSize;
        this.symbolXOffset = pSymbolXOffset;
        this.symbolYOffset = pSymbolYOffset;
        this.forePath = pForePath;
        this.outputPath = pOutputPath;
    }

    validate(pValidator) {
        pValidator.testNotEmpty("Name", this.name);
        pValidator.testNotEmpty("Size", this.size);
        if (this.backPath)
            if (!FileSystem.existsSync(this.backPath))
                pValidator.addError("Back Image", `"${this.backPath}" can't be found`);
        pValidator.testNotEmpty("Symbol Path", this.symbolPath);
        if (this.symbolPath)
            if (!FileSystem.existsSync(this.symbolPath))
                pValidator.addError("Symbol Image", `"${this.symbolPath}" can't be found`);
        if (this.forePath)
            if (!FileSystem.existsSync(this.forePath))
                pValidator.addError("Fore Image", `"${this.forePath}" can't be found`);
        pValidator.testNotEmpty("Output Path", this.symbolPath);
    }

    getImagePages() {
        const imagePages = new Array();
        if (this.backPath)
            imagePages.push(new ImagePage(new FileSystemItem(FileSystemItemType.file, this.backPath)));
        imagePages.push(new ImagePage(new FileSystemItem(FileSystemItemType.file, this.symbolPath), this.symbolXOffset, this.symbolYOffset));
        if (this.forePath)
            imagePages.push(new ImagePage(new FileSystemItem(FileSystemItemType.file, this.forePath)));        
        return imagePages;
    }

    toString() {
        return `${this.name} (${this.size})`;
    }
}