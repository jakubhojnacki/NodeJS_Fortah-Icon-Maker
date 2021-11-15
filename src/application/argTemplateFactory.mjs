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
            new ArgTemplate(["p", "profile"], ArgName.profile, "Name of a profile", DataType.string, true, true),
            new ArgTemplate(["i", "imageProcessor"], ArgName.imageProcessor, "Type of image processor", DataType.string, true, true),
            new ArgTemplate(["o", "outputDirectoryPath"], ArgName.outputDirectoryPath, "Output directory path", DataType.string, true, true)
        ];

        let argTemplates = super.create();
        argTemplates.insert(argTemplateArray);
        return argTemplates;
    }
}