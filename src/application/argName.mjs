/**
 * @module "ArgName" class
 * @description Enumerator with arg names
 */

import { Enum } from "core-library";
import { EnumItem } from "core-library";

export class ArgName {
    static get templatesDirectoryPath() { return "TemplatesDirectoryPath"; }
    static get symbolsDirectoryPath() { return "SymbolsDirectoryPath"; }
    static get iconsDirectoryPath() { return "IconsDirectoryPath"; }
    static get temporaryDirectoryPath() { return "TemporaryDirectoryPath"; }

    static get values() { return [
        new EnumItem(ArgName.templatesDirectoryPath),
        new EnumItem(ArgName.symbolsDirectoryPath),
        new EnumItem(ArgName.iconsDirectoryPath),
        new EnumItem(ArgName.temporaryDirectoryPath)
    ]; }

    static parse(pText) {
        return Enum.parse(pText, ArgName.values, ArgName.name);
    }

    static toString(pValue) {
        return Enum.toString(pValue, ArgName.values, ArgName.name);
    }
}