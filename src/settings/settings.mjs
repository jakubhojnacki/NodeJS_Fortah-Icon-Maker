/**
 * @module "Settings" class
 * @description Class representing application settings
 */

"use strict";

import { IconsSettings } from "../settings/iconsSettings.mjs";
import { ImageProcessorsSettings } from "../settings/imageProcessorsSettings.mjs";
import { ProfilesSettings } from "../settings/profilesSettings.mjs";
import { SettingsBase } from "core-library";

export class Settings extends SettingsBase {
    get icons() { return this.mIcons; }
    set icons(pValue) { this.mIcons = pValue ? pValue : new IconsSettings(); }
    get profiles() { return this.mProfiles; }
    set profiles(pValue) { this.mProfiles = pValue ? pValue : new ProfilesSettings(); }
    get imageProcessors() { return this.mImageProcessors; }
    set imageProcessors(pValue) { this.mImageProcessors = pValue ? pValue : new ImageProcessorsSettings(); }

    constructor(pIcons, pProfiles, pImageProcessors, pDiagnostics) {
        super(pDiagnostics);
        this.icons = pIcons;
        this.profiles = pProfiles;
        this.imageProcessors = pImageProcessors;
    }

    validate(pValidator) {
        pValidator.setComponent(Settings.name);
        this.icons.validate(pValidator);
        this.profiles.validate(pValidator);
        this.imageProcessors.validate(pValidator);
        pValidator.restoreComponent();
    }

    toData() {
        let data = super.toData();
        data.icons = this.icons.toData();
        data.profiles = this.profiles.toData();
        data.imageProcessors = this.imageProcessors.toData();
        return data;
    }

    fromData(pData) {
        super.fromData(pData);
        if (pData != null) {
            this.icons = (new IconsSettings()).fromData(pData.icons);
            this.profiles = ( new ProfilesSettings()).fromData(pData.profiles);
            this.imageProcessors = ( new ImageProcessorsSettings()).fromData(pData.imageProcessors);
        }
        return this;
    }    
}