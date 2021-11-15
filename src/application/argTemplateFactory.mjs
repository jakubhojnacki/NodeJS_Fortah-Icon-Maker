/**
 * @module "ArgTemplateFactory" class
 * @description Creates arg templates
 */

import { ArgName } from "./argName.mjs";
import { ArgTemplateFactoryBase } from "core-library";
import { ArgTemplate } from "core-library";
import { DataType } from "core-library";

export class ArgTemplateFactory extends ArgTemplateFactoryBase {
    constructor() {
        super();
    }

    create() {
        const argTemplateArray = [
            new ArgTemplate(["t", "templatesDirectoryPath"], ArgName.templatesDirectoryPath, "Templates directory path", DataType.string, true, true),
            new ArgTemplate(["s", "symbolsDirectoryPath"], ArgName.symbolsDirectoryPath, "Symbols directory path", DataType.string, true, true),
            new ArgTemplate(["i", "iconsDirectoryPath"], ArgName.iconsDirectoryPath, "Icons directory path", DataType.string, true, true),
            new ArgTemplate(["m", "temporaryDirectoryPath"], ArgName.temporaryDirectoryPath, "Temporary directory path", DataType.string, true, true)
        ];

        let argTemplates = super.create();
        argTemplates.insert(argTemplateArray);
        return argTemplates;
    }
}