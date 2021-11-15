/**
 * @module "LogicIconEventArgs" class
 * @description Arguments for logic-icon event
 */

"use strict"

export class LogicIconEventArgs extends LogicEventArgs {
    get icon() { return this.mIcon; }
    set icon(pValue) { this.mIcon = pValue; }

    constructor(pLogic, pIcon) {
        super(pLogic);
        this.icon = pIcon;
    }
}