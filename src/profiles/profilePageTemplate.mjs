/**
 * @module "ProfilePageTemplate" class
 * @description Represents a template of profile page
 */

"use strict"

export class ProfilePageTemplate {
    get back() { return this.mBack; }
    set back(pValue) { this.mBack = String.verify(pValue); }
    get fore() { return this.mFore; }
    set fore(pValue) { this.mFore = String.verify(pValue); }

    constructor(pBack, pFore) {
        this.back = pBack;
        this.fore = pFore;
    }

    fromData(pData) {
        if (pData != null) {
            this.back = pData.back;
            this.fore = pData.fore;
        }
        return this;
    }    
}