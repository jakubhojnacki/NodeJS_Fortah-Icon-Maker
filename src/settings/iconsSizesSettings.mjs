/**
 * @module "IconsSizesSettings" class
 * @description Class representing an array of icons sizes settings
 */

"use strict"

export class IconsSizesSettings extends Array {
    constructor() {
    }

    static validate(pValue) {
        if ((pValue) && (pValue instanceof IconsSizesSettings))
            return pValue
        else
            return new IconsSizesSettings();
    }

    validate(pValidator) {
        pValidator.setComponent(IconsSizesSettings.name);
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
                const item = ( new IconsSizeSettings()).fromData(dataItem);
                this.push(item);
            }
        return this;
    }       
}