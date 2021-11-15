/**
 * @module "ProfileIcons" class
 * @description Represents an array of profile icons
 */

"use strict"

import { ProfileIcon } from "../profiles/profileIcon.mjs";

export class ProfileIcons extends Array {
    constructor() {
        super();
    }

    fromData(pData) {
        if (Array.isArray(pData))
            for (const dataItem of pData) {
                const item = (new ProfileIcon()).fromData(dataItem);
                this.push(item);
            }
        return this;
    }
}