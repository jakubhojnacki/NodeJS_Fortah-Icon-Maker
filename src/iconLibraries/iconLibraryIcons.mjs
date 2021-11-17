/**
 * @module "IconLibraryIcons" class
 * @description An array of icons of icon library
 */

"use strict"

import { IconLibraryIcon } from "../iconLibraries/iconLibraryIcon.mjs";

export class IconLibraryIcons extends Array {
    constructor() {
        super();
    }

    fromData(pData) {
        if (Array.isArray(pData))
            for (const dataItem of pData) {
                const item = (new IconLibraryIcon()).fromData(dataItem);
                this.push(item);
            }        
        return this;
    }
}