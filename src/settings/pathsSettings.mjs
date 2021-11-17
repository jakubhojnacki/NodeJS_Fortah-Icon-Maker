/**
 * @module "ProfilesSettings" class
 * @description Settings of profiles
 */

"use strict";

export class PathsSettings {
    get imageLibraries() { return this.mImageLibraries; }
    set imageLibraries(pValue) { this.mImageLibraries = String.verify(pValue); }
    get profiles() { return this.mProfiles; }
    set profiles(pValue) { this.mProfiles = String.verify(pValue); }

    constructor(pImageLibraries, pProfiles) {
        this.imageLibraries = pImageLibraries;
        this.profiles = pProfiles;
    }

    validate(pValidator) {
        pValidator.setComponent(PathsSettings.name);
        pValidator.testNotEmpty("imageLibraries", this.imageLibraries);
        pValidator.testNotEmpty("profiles", this.profiles);
        pValidator.restoreComponent();
    }

    toData() {
        let data = {};
        data.imageLibraries = this.imageLibraries;
        data.profiles = this.profiles;
        return data;
    }

    fromData(pData) {
        if (pData != null) {
            this.imageLibraries = pData.imageLibraries;
            this.profiles = pData.profiles;
        }
        return this;
    }       
}