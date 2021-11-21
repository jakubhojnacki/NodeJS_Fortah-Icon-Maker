/**
 * @module "LogicImageEventArgs" class
 * @description Arguments for logic image event
 */

"use strict"

import { LogicEventArgs } from "../logic/logicEventArgs.mjs";

export class LogicImageEventArgs extends LogicEventArgs {
    get image() { return this.mImage; }
    set image(pValue) { this.mImage = pValue; }

    constructor(pLogic, pImage) {
        super(pLogic);
        this.image = pImage;
    }
}