/**
 * @module "AvailableImageManipulatorPathsSettings" class
 * @description Available image manipulator path settings
 */

"use strict";

export class AvailableImageManipulatorPathSettings {
    get system() { return this.mSystem; }
    set system(pValue) { this.mSystem = pValue; }
    get path() { return this.mPath; }
    set path(pValue) { this.mPath = String.validate(pValue); }

    constructor() {
    }
}