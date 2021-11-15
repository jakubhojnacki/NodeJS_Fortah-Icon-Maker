/**
 * @module "ProfileIcon" class
 * @description Represents one profile icon
 */

"use strict"

export class ProfileIcon {
    get name() { return this.mName; }
    set name(pValue) { this.mName = String.validate(pValue); }
    get image() { return this.mImage; }
    set image(pValue) { this.mImage = String.validate(pValue); }

    constructor(pName, pImage) {
        this.name = pName;
        this.image = pImage;
    }

    fromData(pData) {
        if (pData != null) {
            this.name = pData.name;
            this.image = pData.image;
        }
        return this;
    }
}