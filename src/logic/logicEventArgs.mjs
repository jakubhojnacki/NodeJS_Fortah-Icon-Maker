/**
 * @module "LogicEventArgs" class
 * @description Arguments for logic event
 */

"use strict"

export class LogicEventArgs {
    get logic() { return this.mLogic; }
    set logic(pValue) { this.mLogic = pValue; }

    constructor(pLogic) {
        this.logic = pLogic;
    }
}