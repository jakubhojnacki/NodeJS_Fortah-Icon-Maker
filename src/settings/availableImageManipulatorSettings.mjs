/**
 * @module "AvailableImageManipulatorSettings" class
 * @description One available mimage manipulator settings
 */

"use strict";

import { AvailableImageManipulatorPathsSettings } from "./availableImageManipulatorPathsSettings.mjs";

export class AvailableImageManipulatorSettings {
    get type() { return this.mType; }
    set type(pValue) { this.mType = String.validate(pValue); }
    get paths() { return this.mPaths; }
    set paths(pValue) { this.mPaths = pValue ? pValue : new AvailableImageManipulatorPathsSettings(); }

    constructor(pType, pPaths) {
        this.type = pType;
        this.paths = pPaths;
    }
}