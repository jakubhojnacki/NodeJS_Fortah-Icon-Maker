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

    getLargest() {
        const reversedItems = this.sort((lItem1, lItem2) => { return lItem1 > lItem2 ? -1 : (lItem1 < lItem2 ? 1 : 0); });
        return reversedItems.length > 0 ? reversedItems[0] : null;
    }    
}