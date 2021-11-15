/**
 * @module "Application" class
 * @description Main application class
 */

import { ArgName } from "../application/argName.mjs";
import { ArgTemplateFactory } from "../application/argTemplateFactory.mjs";
import { ConsoleApplication } from "console-library";
import { Logic } from "../logic/logic.mjs";

export class Application extends ConsoleApplication {
    constructor() {
        super();
        this.argTemplates = ( new ArgTemplateFactory()).create();
    }    

    async runLogic() {
        const templatesDirectoryPath = this.args.get(ArgName.templatesDirectoryPath);
        const symbolsDirectoryPath = this.args.get(ArgName.symbolsDirectoryPath, false);
        const iconsDirectoryPath = this.args.get(ArgName.iconsDirectoryPath, false);
        const temporaryDirectoryPath = this.args.get(ArgName.temporaryDirectoryPath, false); 
        const logic = new Logic(this, templatesDirectoryPath, symbolsDirectoryPath, iconsDirectoryPath, temporaryDirectoryPath);
        logic.run();
    }
}