/**
 * @module "IconLibrarySizes" class
 * @description An array of sizes of icon library
 */

"use strict"

import { IconLibrarySize } from "../iconLibraries/iconLibrarySize.mjs";

export class IconLibrarySizes extends Array {
    constructor() {
        super();
    }

    fromData(pData) {
        if (Array.isArray(pData))
            for (const dataItem of pData) {
                const item = (new IconLibrarySize()).fromData(dataItem);
                this.push(item);
            }        
    }
}