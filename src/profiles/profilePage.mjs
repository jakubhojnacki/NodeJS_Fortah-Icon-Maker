/**
 * @module "ProfilePage" class
 * @description Represents one profile page
 */

"use strict"

import { ProfilePageTemplate } from "../profiles/profilePageTemplate.mjs";

export class ProfilePage {
    get size() { return this.mSize; }
    set size(pValue) { this.mSize = Number.validateAsInteger(pValue); }
    get template() { return this.mTemplate; }
    set template(pValue) { this.mTemplate = pValue ? pValue : new ProfilePageTemplate(); }

    constructor(pSize, pTemplate) {
        this.size = pSize;
        this.template = pTemplate;
    }

    fromData(pData) {
        if (pData != null) {
            this.size = pData.size;
            this.template = (new ProfilePageTemplate()).fromData(pData.template);
        }
        return this;
    }
}