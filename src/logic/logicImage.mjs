/**
 * @module "LogicImage" class
 * @description Keeps information about one image processed by logic
 */

"use strict";

import FileSystem from "fs";

import { FileSystemItem } from "file-system-library";
import { FileSystemItemType } from "file-system-library";
import { ImagePage } from "image-library";

export class LogicImage {
    get name() { return this.mName; }
    set name(pValue) { this.mName = String.verify(pValue); }
    get size() { return this.mSize; }
    set size(pValue) { this.mSize = Number.verifyAsInteger(pValue); }
    get back() { return this.mBackPath; }
    set back(pValue) { this.mBackPath = pValue; }
    get icon() { return this.mIconPath; }
    set icon(pValue) { this.mIconPath = String.verify(pValue); }
    get iconSize() { return this.mIconSize; }
    set iconSize(pValue) { this.mIconSize = pValue; }
    get iconXOffset() { return this.miconXOffset; }
    set iconXOffset(pValue) { this.miconXOffset = Number.verifyAsInteger(pValue); }
    get iconYOffset() { return this.mIconYOffset; }
    set iconYOffset(pValue) { this.mIconYOffset = Number.verifyAsInteger(pValue); }
    get fore() { return this.mForePath; }
    set fore(pValue) { this.mForePath = String.verify(pValue); }

    get imagePages() { return this.getImagePages(); }

    constructor(pName, pSize, pBackPath, pIconPath, pIconSize, pIconXOffset, pIconYOffset, pForePath) {
        this.name = pName;
        this.size = pSize;
        this.back = pBackPath ? new FileSystemItem(FileSystemItemType.file, pBackPath) : null;
        this.icon = pIconPath ? new FileSystemItem(FileSystemItemType.file, pIconPath) : null;
        this.iconSize = pIconSize;
        this.iconXOffset = pIconXOffset;
        this.iconYOffset = pIconYOffset;
        this.fore = pForePath ? new FileSystemItem(FileSystemItemType.file, pForePath) : null;
    }

    validate(pValidator) {
        pValidator.testNotEmpty("Name", this.name);
        pValidator.testNotEmpty("Size", this.size);
        if (this.back)
            if (!FileSystem.existsSync(this.back.path))
                pValidator.addError("Back Image", "can't be found");
        pValidator.testNotEmpty("Icon Path", this.icon);
        if (this.icon)
            if (!FileSystem.existsSync(this.icon.path))
                pValidator.addError("Icon Image", "can't be found");
        if (this.fore)
            if (!FileSystem.existsSync(this.fore.path))
                pValidator.addError("Fore Image", "can't be found");
    }

    getImagePages() {
        const imagePages = new Array();
        if (this.back)
            imagePages.push(new ImagePage(this.back));
        imagePages.push(this.icon, this.iconXOffset, this.iconYOffset);
        if (this.fore)
            imagePages.push(new ImagePage(this.fore));        
        return imagePages;
    }

    toString() {
        return `${this.name} (${this.size})`;
    }
}