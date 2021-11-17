/**
 * @module "LogicIconPageEventArgs" class
 * @description Arguments for logic-icon-page event
 */

"use strict"

import { LogicIconEventArgs } from "../logic/logicIconEventArgs.mjs";

export class LogicIconPageEventArgs extends LogicIconEventArgs {
    get iconPage() { return this.mIconPage; }
    set iconPage(pValue) { this.mIconPage = pValue; }

    constructor(pLogic, pIcon, pIconPage) {
        super(pLogic, pIcon);
        this.iconPage = pIconPage;
    }
}