/**
 * @module "ProfilesSettings" class
 * @description Settings of profiles
 */

"use strict";

export class ProfilesSettings {
    get directoryPath() { return this.mDirectoryPath; }
    set directoryPath(pValue) { this.mDirectoryPath = String.validate(pValue); }

    constructor(pDirectoryPath, pName) {
        this.directoryPath = pDirectoryPath;
    }

    validate(pValidator) {
        pValidator.setComponent(ProfilesSettings.name);
        pValidator.testNotEmpty("directoryPath", this.directoryPath);
        pValidator.restoreComponent();
    }

    toData() {
        let data = super.toData();
        data.directoryPath = this.directoryPath;
        return data;
    }

    fromData(pData) {
        if (pData != null)
            this.directoryPath = pData.directoryPath;
        return this;
    }       
}