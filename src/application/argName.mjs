/**
 * @module "ArgName" class
 * @description Enumerator with arg names
 */

import { Enum } from "fortah-core-library";
import { EnumItem } from "fortah-core-library";

export class ArgName {
    static get profile() { return "Profile"; }
    static get outputDirectoryPath() { return "OutputDirectoryPath"; }

    static get values() { return [
        new EnumItem(ArgName.profile),
        new EnumItem(ArgName.outputDirectoryPath)
    ]; }

    static parse(pText) {
        return Enum.parse(pText, ArgName.values, ArgName.name);
    }

    static toString(pValue) {
        return Enum.toString(pValue, ArgName.values, ArgName.name);
    }
}