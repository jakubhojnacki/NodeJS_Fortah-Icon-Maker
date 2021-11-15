/**
 * @module "Settings" class
 * @description Class representing application settings
 */

"use strict";

import { IconsSettings } from "../settings/iconsSettings.mjs";
import { ImageManipulatorSettings } from "../settings/imageManipulatorSettings.mjs";
import { ProfilesSettings } from "../settings/profilesSettings.mjs";
import { SettingsBase } from "core-library";

export class Settings extends SettingsBase {
    get icons() { return this.mIcons; }
    set icons(pValue) { this.mIcons = pValue ? pValue : new IconsSettings(); }
    get profiles() { return this.mProfiles; }
    set profiles(pValue) { this.mProfiles = pValue ? pValue : new ProfilesSettings(); }
    get imageManipulator() { return this.mImageManipulator; }
    set imageManipulator(pValue) { this.mImageManipulator = pValue ? pValue : new ImageManipulatorSettings(); }

    constructor(pIcons, pProfiles, pImageManipulator, pDiagnostics) {
        super(pDiagnostics);
        this.icons = pIcons;
        this.profiles = pProfiles;
        this.imageManipulator = pImageManipulator;
    }

    validate(pValidator) {
        pValidator.setComponent(Settings.name);
        this.icons.validate(pValidator);
        this.profiles.validate(pValidator);
        this.imageManipulator.validate(pValidator);
        pValidator.restoreComponent();
    }

    toData() {
        let data = super.toData();
        data.icons = this.icons.toData();
        data.profiles = this.profiles.toData();
        data.imageManipulators = this.imageManipulator.toData();
        return data;
    }

    fromData(pData) {
        super.fromData(pData);
        if (pData != null) {
            this.icons = (new IconsSettings()).fromData(pData.icons);
            this.profiles = ( new ProfilesSettings()).fromData(pData.profiles);
            this.imageManipulators = ( new ImageManipulatorsSettings()).fromData(pData.imageManipulators);
        }
        return this;
    }    
}