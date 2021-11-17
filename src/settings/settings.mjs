/**
 * @module "Settings" class
 * @description Class representing application settings
 */

"use strict";

import { PathsSettings } from "../settings/pathsSettings.mjs";
import { ImageProcessorsSettings } from "../settings/imageProcessorsSettings.mjs";
import { SettingsBase } from "core-library";

export class Settings extends SettingsBase {
    get paths() { return this.mPaths; }
    set paths(pValue) { this.mPaths = Object.verify(pValue, () => { return new PathsSettings(); }); }
    get imageProcessors() { return this.mImageProcessors; }
    set imageProcessors(pValue) { this.mImageProcessors = Object.verify(pValue, () => { return new ImageProcessorsSettings(); }); }

    constructor(pPaths, pImageProcessors, pDiagnostics) {
        super(pDiagnostics);
        this.paths = pPaths;
        this.imageProcessors = pImageProcessors;
    }

    validate(pValidator) {
        pValidator.setComponent(Settings.name);
        this.paths.validate(pValidator);
        this.imageProcessors.validate(pValidator);
        pValidator.restoreComponent();
    }

    toData() {
        let data = super.toData();
        data.paths = this.paths.toData();
        data.imageProcessors = this.imageProcessors.toData();
        return data;
    }

    fromData(pData) {
        super.fromData(pData);
        if (pData != null) {
            this.paths = ( new PathsSettings()).fromData(pData.paths);
            this.imageProcessors = ( new ImageProcessorsSettings()).fromData(pData.imageProcessors);
        }
        return this;
    }    
}