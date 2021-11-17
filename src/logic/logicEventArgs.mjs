/**
 * @module "LogicEventArgs" class
 * @description Arguments for logic event
 */

"use strict"

export class LogicEventArgs {
    get logic() { return this.mLogic; }
    set logic(pValue) { this.mLogic = pValue; }
    get count() { return this.mCount; }
    set count(pValue) { this.mCount = Number.verifyAsInteger(pValue); }

    constructor(pLogic, pCount) {
        this.logic = pLogic;
        this.count = pCount;
    }
}