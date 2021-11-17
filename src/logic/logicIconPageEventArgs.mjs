/**
 * @module "LogicIconPageEventArgs" class
 * @description Arguments for logic-icon-page event
 */

"use strict"

import { LogicIconEventArgs } from "../logic/logicIconEventArgs.mjs";

export class LogicIconPageEventArgs extends LogicIconEventArgs {
    get page() { return this.mPage; }
    set page(pValue) { this.mPage = pValue; }

    constructor(pLogic, pIcon, pPage) {
        super(pLogic, pIcon);
        this.page = pPage;
    }
}