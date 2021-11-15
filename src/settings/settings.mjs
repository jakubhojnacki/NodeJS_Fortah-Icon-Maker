/**
 * @module "Settings" class
 * @description Class representing application settings
 */

"use strict";

import { IconLibrarySettings } from "../settings/iconsLibrarySettings.mjs";
import { ImageProcessorsSettings } from "../settings/imageProcessorsSettings.mjs";
import { ProfilesSettings } from "../settings/profilesSettings.mjs";
import { SettingsBase } from "core-library";

export class Settings extends SettingsBase {
    get iconLibrary() { return this.mIconLibrary; }
    set iconLibrary(pValue) { this.mIconLibrary = pValue ? pValue : new IconLibrarySettings(); }
    get profiles() { return this.mProfiles; }
    set profiles(pValue) { this.mProfiles = pValue ? pValue : new ProfilesSettings(); }
    get imageProcessors() { return this.mImageProcessors; }
    set imageProcessors(pValue) { this.mImageProcessors = pValue ? pValue : new ImageProcessorsSettings(); }

    constructor(pIconLibrary, pProfiles, pImageProcessors, pDiagnostics) {
        super(pDiagnostics);
        this.iconLibrary = pIconLibrary;
        this.profiles = pProfiles;
        this.imageProcessors = pImageProcessors;
    }

    validate(pValidator) {
        pValidator.setComponent(Settings.name);
        this.iconLibrary.validate(pValidator);
        this.profiles.validate(pValidator);
        this.imageProcessors.validate(pValidator);
        pValidator.restoreComponent();
    }

    toData() {
        let data = super.toData();
        data.iconLibrary = this.iconLibrary.toData();
        data.profiles = this.profiles.toData();
        data.imageProcessors = this.imageProcessors.toData();
        return data;
    }

    fromData(pData) {
        super.fromData(pData);
        if (pData != null) {
            this.iconLibrary = (new IconLibrarySettings()).fromData(pData.iconLibrary);
            this.profiles = ( new ProfilesSettings()).fromData(pData.profiles);
            this.imageProcessors = ( new ImageProcessorsSettings()).fromData(pData.imageProcessors);
        }
        return this;
    }    
}