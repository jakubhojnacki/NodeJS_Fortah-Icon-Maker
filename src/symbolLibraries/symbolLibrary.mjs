/**
 * @module "SymbolLibrary" class
 * @description Represents a library of symbols
 */

"use strict"

import FileSystem from "fs";
import Path from "path";

import { SymbolLibrarySymbols } from "../symbolLibraries/symbolLibrarySymbols.mjs";
import { SymbolLibraryPages } from "../symbolLibraries/symbolLibraryPages.mjs";
import { Validator } from "core-library";

export class SymbolLibrary {
    get path() { return this.mPath; }
    set path(pValue) { this.mPath = String.verify(pValue); }
    get pages() { return this.mPages; }
    set pages(pValue) { this.mPages = Object.verify(pValue, () => { return new SymbolLibraryPages(); }); }
    get symbols() { return this.mSymbols; }
    set symbols(pValue) { this.mSymbols = Object.verify(pValue, () => { return new SymbolLibrarySymbols(); }); }

    constructor(pPath, pName) {
        const dataPath = Path.join(pPath, `${pName}.json`);
        const data = JSON.parse(FileSystem.readFileSync(dataPath));
        this.fromData(data);
    }

    fromData(pData) {
        if (pData != null) {
            this.path = pData.path;
            this.pages = (new SymbolLibraryPages()).fromData(pData.pages);
            this.symbols = (new SymbolLibrarySymbols()).fromData(pData.symbols);
        }
        return this;
    }

    validate() {
        const validator = new Validator();
        validator.setComponent(SymbolLibrary.name);
        this.pages.validate(validator);
        this.symbols.validate(validator);
        validator.restoreComponent();
        return validator.require();
    }
}