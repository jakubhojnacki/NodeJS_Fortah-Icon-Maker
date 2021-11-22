/**
 * @module "ProfilesSettings" class
 * @description Settings of profiles
 */

"use strict";

export class PathsSettings {
    get symbolLibraries() { return this.mSymbolLibraries; }
    set symbolLibraries(pValue) { this.mSymbolLibraries = String.verify(pValue); }
    get symbols() { return this.mSymbols; }
    set symbols(pValue) { this.mSymbols = String.verify(pValue); }
    get profiles() { return this.mProfiles; }
    set profiles(pValue) { this.mProfiles = String.verify(pValue); }
    get temporary() { return this.mTemporary; }
    set temporary(pValue) { this.mTemporary = String.verify(pValue); }

    constructor(pSymbolLibraries, pSymbols, pProfiles, pTemporary) {
        this.symbolLibraries = pSymbolLibraries;
        this.symbols = pSymbols;
        this.profiles = pProfiles;
        this.temporary = pTemporary;
    }

    validate(pValidator) {
        pValidator.setComponent(PathsSettings.name);
        pValidator.testNotEmpty("Symbol Libraries", this.symbolLibraries);
        pValidator.testNotEmpty("Profiles", this.profiles);
        pValidator.testNotEmpty("Temporary", this.temporary);
        pValidator.restoreComponent();
    }

    toData() {
        let data = {};
        data.symbolLibraries = this.symbolLibraries;
        data.symbols = this.symbols;
        data.profiles = this.profiles;
        data.temporary = this.temporary;
        return data;
    }

    fromData(pData) {
        if (pData != null) {
            this.symbolLibraries = pData.symbolLibraries;
            this.symbols = pData.symbols;
            this.profiles = pData.profiles;
            this.temporary = pData.temporary;
        }
        return this;
    }       
}