/**
 * @module "Application" class
 * @description Main application class
 */

import { ArgTemplateFactory } from "../application/argTemplateFactory.mjs";
import { ConsoleApplication } from "console-library";
import { ConsoleProgress } from "console-library";
import { Logic } from "../logic/logic.mjs";
import { Settings } from "../settings/settings.mjs";

export class Application extends ConsoleApplication {
    get progress() { return this.mProgress; }
    set progress(pValue) { this.mProgress = pValue; }

    constructor(pRootDirectoryPath) {
        super(pRootDirectoryPath, ( new ArgTemplateFactory()).create(), new Settings());
        this.progress = null;
    }    

    async runLogic() {
        const logic = new Logic(this);
        const __this = this;
        logic.onInitialise = (lEventArgs) => { __this.onLogicInitialise(lEventArgs); }
        logic.onIcon = (lEventArgs) => { __this.onLogicIcon(lEventArgs); }
        logic.onPage = (lEventArgs) => { __this.onLogicPage(lEventArgs); }
        logic.onFinalise = (lEventArgs) => { __this.onLogicFinalise(lEventArgs); }
        logic.run();
    }

    onLogicInitialise(pEventArgs) {
        const __this = this;
        this.progress = new ConsoleProgress(null, null, (lProgress) => { __this.onProgressUpdate(lProgress); }, "[", "#", "]", 20, this.console.width);
        this.progress.reset(pEventArgs.count, "Creating icons...");
    }

    onLogicIcon(pEventArgs) {
        this.progress.move(0, pEventArgs.icon.toString());
    }

    onLogicPage(pEventArgs) {
        this.progress.move(1, `${pEventArgs.icon.toString()} ${pEventArgs.page.size}x${pEventArgs.page.size}`);
    }

    onLogicFinalise(pProgres) {
        this.progress.complete("Done");        
        this.console.newLine();
    }

    onProgressUpdate(pProgres) {
        pProgres.render(this.console);
    }
}