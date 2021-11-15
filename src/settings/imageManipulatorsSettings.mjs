/**
 * @module "ImageManipulatorsSettings" class
 * @description Settings describing image manipulators
 */

"use strict";

import { AvailableImageManipulatorsSettings } from "../settings/availableImageManipulatorsSettings.mjs";

export class ImageManipulatorsSettings {
    get current() { return this.mCurrent; }
    set current(pValue) { this.mCurrent = String.validate(pValue); }
    get available() { return this.mAvailable; }
    set available(pValue) { this.mAvailable = pValue ? pValue : new AvailableImageManipulatorsSettings(); }

    constructor(pCurrent, pAvailable) {
        this.current = pCurrent;
        this.available = pAvailable;
    }
}