/**
 * @module "ImageManipulatorSettings" class
 * @description Settings describing one image manipulator
 */

"use strict";

export class ImageManipulatorSettings {
    get type() { return this.mType; }
    set type(pValue) { this.mType = String.validate(pValue); }
    get linuxPath() { return this.mLinuxPath; }
    set linuxPath(pValue) { this.mLinuxPath = String.validate(pValue); }
    get windowsPath() { return this.mWindowsPath; }
    set windowsPath(pValue) { this.mWindowsPath = String.validate(pValue); }

    constructor(pType, pLinuxPath, pWindowsPath) {
        this.type = pType;
        this.linuxPath = pLinuxPath;
        this.windowsPath = pWindowsPath;
    }
}