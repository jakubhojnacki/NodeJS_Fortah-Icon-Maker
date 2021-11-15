/**
 * @module "IconLibrarySizesSettings" class
 * @description Settings of icon library sizes (array of sizes)
 */

"use strict"

import { IconLibrarySizeSettings } from "../settings/iconLibrarySizeSettings.mjs";

export class IconLibrarySizesSettings extends Array {
    constructor() {
        super();
    }

    static validate(pValue) {
        if ((pValue) && (pValue instanceof IconLibrarySizesSettings))
            return pValue
        else
            return new IconLibrarySizesSettings();
    }

    validate(pValidator) {
        pValidator.setComponent(IconLibrarySizesSettings.name);
        for (const item of this)
            item.validate(pValidator);
        pValidator.restoreComponent();
    }

    toData() {
        let data = [];
        for (const item of this)
            data.push(item.toData());
        return data;
    }

    fromData(pData) {
        if (Array.isArray(pData))
            for (const dataItem of pData) {
                const item = ( new IconLibrarySizeSettings()).fromData(dataItem);
                this.push(item);
            }
        return this;
    }       
}