/**
 * @module "SymbolLibrarySymbols" class
 * @description An array of symbols of symbol library
 */

"use strict"

import { SymbolLibrarySymbol } from "../symbolLibraries/symbolLibrarySymbol.mjs";

export class SymbolLibrarySymbols extends Array {
    constructor() {
        super();
    }

    fromData(pData) {
        if (Array.isArray(pData))
            for (const dataItem of pData) {
                const item = (new SymbolLibrarySymbol()).fromData(dataItem);
                this.push(item);
            }        
        return this;
    }

    validate(pValidator) {
        for (const item of this)
            item.validate(pValidator);
    }    
}