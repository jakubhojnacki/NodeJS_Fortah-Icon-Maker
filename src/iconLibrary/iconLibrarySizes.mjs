/**
 * @module "IconLibrarySizes" class
 * @description An array of sizes of icon library
 */

"use strict"

import { IconLibrarySize } from "../iconLibrary/iconLibrarySize.mjs";

export class IconLibrarySizes extends Array {
    constructor(pSettings) {
        super();
        for (const settingsItem of pSettings)
            this.push(new IconLibrarySize(settingsItem));
    }

    static validate(pValue) {
        if ((pValue) && (pValue instanceof IconLibrarySizes))
            return pValue
        else
            return new IconLibrarySizes();
    }
}