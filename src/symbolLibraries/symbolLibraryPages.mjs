/**
 * @module "SymbolLibraryPages" class
 * @description An array of pages of symbol library
 */

"use strict"

import { SymbolLibraryPage } from "../symbolLibraries/symbolLibraryPage.mjs";

export class SymbolLibraryPages extends Array {
    constructor() {
        super();
    }

    fromData(pData) {
        if (Array.isArray(pData))
            for (const dataItem of pData) {
                const item = (new SymbolLibraryPage()).fromData(dataItem);
                this.push(item);
            }        
        return this;
    }

    validate(pValidator) {
        for (const item of this)
            item.validate(pValidator);
    }
}