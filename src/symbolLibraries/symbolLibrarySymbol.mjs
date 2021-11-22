/**
 * @module "SymbolLibrarySymbol" class
 * @description Represents one symbol from symbol library
 */

"use strict"

export class SymbolLibrarySymbol {
    get name() { return this.mName; }
    set name(pValue) { this.mName = String.verify(pValue); }
    get path() { return this.mPath; }
    set path(pValue) { this.mPath = String.verify(pValue); }

    constructor(pName, pPath) {
        this.name = pName;
        this.path = pPath;
    }

    fromData(pData) {
        if (pData != null) {
            this.name = pData.name;
            this.path = pData.path;
        }
        return this;
    }
    
    validate(pValidator) {
        pValidator.setComponent(SymbolLibrarySymbol.name);
        pValidator.testNotEmpty("Name", this.name);
        pValidator.testNotEmpty("Path", this.path);
        pValidator.restoreComponent();
    }

    toString() {
        return this.name;
    }
}