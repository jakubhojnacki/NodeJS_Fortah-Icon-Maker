/**
 * @module "ProfilePageSymbol" class
 * @description Represents symbol of profile page
 */

"use strict";

export class ProfilePageSymbol {
    get size() { return this.mSize; }
    set size(pValue) { this.mSize = Number.verifyAsInteger(pValue); }
    get xOffset() { return this.mXOffset; }
    set xOffset(pValue) { this.mXOffset = Number.verifyAsInteger(pValue); }
    get yOffset() { return this.mYOffset; }
    set yOffset(pValue) { this.mYOffset = Number.verifyAsInteger(pValue); }

    constructor(pSize, pXOffset, pYOffset) {
        this.size = pSize;
        this.xOffset = pXOffset;
        this.yOffset = pYOffset;
    }

    fromData(pData) {
        if (pData != null) {
            this.size = pData.size;
            this.xOffset = pData.xOffset;
            this.yOffset = pData.yOffset;
        }
        return this;
    }
}