/**
 * @module "ProfilesSettings" class
 * @description Settings of profiles
 */

"use strict";

export class ProfilesSettings {
    get directoryPath() { return this.mDirectoryPath; }
    set directoryPath(pValue) { this.mDirectoryPath = String.validate(pValue); }
    get name() { return this.mName; }
    set name(pValue) { this.mName = String.validate(pValue); }

    constructor(pDirectoryPath, pName) {
        this.directoryPath = pDirectoryPath;
        this.name = pName;
    }

    validate(pValidator) {
        pValidator.setComponent(ProfilesSettings.name);
        pValidator.testNotEmpty("directoryPath", this.directoryPath);
        pValidator.testNotEmpty("name", this.name);
        pValidator.restoreComponent();
    }

    toData() {
        let data = super.toData();
        data.directoryPath = this.directoryPath;
        data.name = this.name;
        return data;
    }

    fromData(pData) {
        if (pData != null) {
            this.directoryPath = pData.directoryPath;
            this.name = pData.name;
        }
        return this;
    }       
}