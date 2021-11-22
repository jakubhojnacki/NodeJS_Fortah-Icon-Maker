/**
 * @module "ProfilePage" class
 * @description Represents one profile page
 */

"use strict"

import { ProfilePageSymbol } from "../profiles/profilePageSymbol.mjs";
import { ProfilePageTemplate } from "../profiles/profilePageTemplate.mjs";

export class ProfilePage {
    get size() { return this.mSize; }
    set size(pValue) { this.mSize = Number.verifyAsInteger(pValue); }
    get template() { return this.mTemplate; }
    set template(pValue) { this.mTemplate = Object.verify(pValue, () => { return new ProfilePageTemplate(); }); }
    get symbol() { return this.mSymbol; }
    set symbol(pValue) { this.mSymbol = Object.verify(pValue, () => { return new ProfilePageSymbol(); }); }

    constructor(pSize, pTemplate, pSymbol) {
        this.size = pSize;
        this.template = pTemplate;
        this.symbol = pSymbol;
    }

    fromData(pData) {
        if (pData != null) {
            this.size = pData.size;
            this.template = (new ProfilePageTemplate()).fromData(pData.template);
            this.symbol = (new ProfilePageSymbol()).fromData(pData.symbol);
        }
        return this;
    }
    
    validate(pValidator) {
        pValidator.setComponent(ProfilePage.name);
        pValidator.testNotEmpty("Size", this.size);
        this.template.validate(pValidator);
        this.symbol.validate(pValidator);
        pValidator.restoreComponent();
    }
}