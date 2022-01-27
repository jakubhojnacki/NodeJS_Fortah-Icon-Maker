/**
 * @module "Settings" class
 * @description Class representing application settings
 */

"use strict";

import { PathsSettings } from "../settings/pathsSettings.mjs";
import { ImageProcessorSettings } from "../settings/imageProcessorSettings.mjs";
import { SettingsBase } from "fortah-core-library";

export class Settings extends SettingsBase {
    get paths() { return this.mPaths; }
    set paths(pValue) { this.mPaths = Object.verify(pValue, () => { return new PathsSettings(); }); }
    get imageProcessor() { return this.mImageProcessor; }
    set imageProcessor(pValue) { this.mImageProcessor = Object.verify(pValue, () => { return new ImageProcessorSettings(); }); }

    constructor(pPaths, pImageProcessors, pDiagnostics) {
        super(pDiagnostics);
        this.paths = pPaths;
        this.imageProcessor = pImageProcessors;
    }

    validate(pValidator) {
        pValidator.setComponent(Settings.name);
        this.paths.validate(pValidator);
        this.imageProcessor.validate(pValidator);
        pValidator.restoreComponent();
    }

    toData() {
        let data = super.toData();
        data.paths = this.paths.toData();
        data.imageProcessor = this.imageProcessor.toData();
        return data;
    }

    fromData(pData) {
        super.fromData(pData);
        if (pData != null) {
            this.paths = ( new PathsSettings()).fromData(pData.paths);
            this.imageProcessor = ( new ImageProcessorSettings()).fromData(pData.imageProcessor);
        }
        return this;
    }    
}