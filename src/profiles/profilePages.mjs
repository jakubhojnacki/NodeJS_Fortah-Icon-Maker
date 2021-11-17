/**
 * @module "ProfilePages" class
 * @description An array of profile pages
 */

"use strict"

import { ProfilePage } from "../profiles/profilePage.mjs";

export class ProfilePages extends Array {
    constructor() {
        super();
    }

    fromData(pData) {
        if (Array.isArray(pData))
            for (const dataItem of pData) {
                const item = (new ProfilePage()).fromData(dataItem);
                this.push(item);
            }
        return this;
    }

    get(pSize) {
        return this.find((lItem) => { return lItem.size === pSize; });
    }
}