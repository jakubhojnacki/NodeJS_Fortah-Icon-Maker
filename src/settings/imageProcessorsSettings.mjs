/**
 * @module "ImageProcessorsSettings" class
 * @description Class representing an array of image processors settings
 */

"use strict"

import { ImageProcessorSettings } from "../settings/imageProcessorSettings.mjs";

export class ImageProcessorsSettings extends Array {
    constructor() {
        super();
    }

    static validate(pValue) {
        if ((pValue) && (pValue instanceof ImageProcessorsSettings))
            return pValue
        else
            return new IconsSizesSettings();
    }

    validate(pValidator) {
        pValidator.setComponent(ImageProcessorsSettings.name);
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
                const item = ( new ImageProcessorSettings()).fromData(dataItem);
                this.push(item);
            }
        return this;
    }       

    get(pType) {
        const type = String.verify(pType);
        let result = this.find((lItem) => { return lItem.type === type; });
        return result ? result : new ImageProcessorSettings();
    }
}