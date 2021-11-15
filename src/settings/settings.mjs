/**
 * @module "Settings" class
 * @description Class representing application settings
 */

"use strict";

import { ImageManipulatorsSettings } from "../settings/imageManipulatorsSettings.mjs";
import { ProfilesSettings } from "../settings/profilesSettings.mjs";
import { SettingsBase } from "core-library";

export class Settings extends SettingsBase {
    get imageManipulators() { return this.mImageManipulators; }
    set imageManipulators(pValue) { this.mImageManipulators = pValue ? pValue : new ImageManipulatorsSettings(); }
    get profiles() { return this.mProfiles; }
    set profiles(pValue) { this.mProfiles = pValue ? pValue : new ProfilesSettings(); }

    constructor(pImageManipulators, pProfiles, pDiagnostics) {
        super(pDiagnostics);
        this.imageManipulators = pImageManipulators;
        this.profiles = pProfiles;
    }

    validate(pValidator) {
        pValidator.setComponent(Settings.name);
        this.imageManipulators.validate(pValidator);
        this.profiles.validate(pValidator);
        pValidator.restoreComponent();
    }

    toData() {
        let data = super.toData();
        data.imageManipulators = this.imageManipulators.toData();
        data.profiles = this.profiles.toData();
        return data;
    }

    fromData(pData) {
        super.fromData(pData);
        if (pData != null) {
            this.imageManipulators = ( new ImageManipulatorsSettings()).fromData(pData.imageManipulators);
            this.profiles = ( new ProfilesSettings()).fromData(pData.profiles);
        }
        return this;
    }    
}