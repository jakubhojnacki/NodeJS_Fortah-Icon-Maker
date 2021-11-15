/**
 * @module "Application" class
 * @description Main application class
 */

import { ArgName } from "../application/argName.mjs";
import { ArgTemplateFactory } from "../application/argTemplateFactory.mjs";
import { ConsoleApplication } from "console-library";
import { Logic } from "../logic/logic.mjs";
import { Settings } from "../settings/settings.mjs";

export class Application extends ConsoleApplication {
    constructor(pRootDirectoryPath) {
        super(pRootDirectoryPath, ( new ArgTemplateFactory()).create(), new Settings());
    }    

    async runLogic() {
        const logic = new Logic(this);
        const __this = this;
        logic.onInitialise() = (lEventArgs) => { __this.onLogicInitialise(lEventArgs); }
        logic.onIcon() = (lEventArgs) => { __this.onLogicIcon(lEventArgs); }
        logic.onPage() = (lEventArgs) => { __this.onLogicPage(lEventArgs); }
        logic.run();
    }

    onLogicInitialise(pEventArgs) {
        //TODO - Initialise progress here
    }

    onLogicIcon(pEventArgs) {
        //TODO - Update progress
    }

    onLogicPage(pEventArgs) {
        //TODO - Update progress
    }
}