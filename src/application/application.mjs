/**
 * @module "Application" class
 * @description Main application class
 */

import { ArgName } from "../application/argName.mjs";
import { ArgTemplateFactory } from "../application/argTemplateFactory.mjs";
import { ConsoleApplication } from "console-library";
import { ConsoleProgress } from "console-library";
import { ImageProcessorFactory } from "image-library";
import { ImageProcessorType } from "image-library";
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
        const iconLibrariesPath = this.settings.paths.iconLibraries.trim();
        const profileName = this.args.get(ArgName.profile).trim();
        const profilesPath = this.settings.paths.profiles.trim();
        const imageProcessorType = ImageProcessorType.parse(this.args.get(ArgName.imageProcessor));
        const imageProcessorSettings = this.settings.imageProcessors.get(imageProcessorType);
        const imageProcessor = (new ImageProcessorFactory()).create(imageProcessorSettings.type, imageProcessorSettings.path);
        const temporaryPath = this.settings.paths.temporary;
        const outputPath = this.args.get(ArgName.outputDirectoryPath);

        const logic = new Logic(this, iconLibrariesPath, profileName, profilesPath, imageProcessor, temporaryPath, outputPath);

        const __this = this;
        logic.onInitialise = (lEventArgs) => { __this.onLogicInitialise(lEventArgs); }
        logic.onIcon = (lEventArgs) => { __this.onLogicIcon(lEventArgs); }
        logic.onIconPage = (lEventArgs) => { __this.onLogicIconPage(lEventArgs); }
        logic.onFinalise = (lEventArgs) => { __this.onLogicFinalise(lEventArgs); }

        await logic.run();
    }

    onLogicInitialise(pEventArgs) {
        const __this = this;
        this.progress = new ConsoleProgress(null, null, (lProgress) => { __this.onProgressUpdate(lProgress); }, "[", "#", "]", 20, this.console.width);
        this.progress.reset(pEventArgs.count, "Creating icons...");
    }

    onLogicIcon(pEventArgs) {
        this.progress.move(0, pEventArgs.logic.icon.toString());
    }

    onLogicIconPage(pEventArgs) {
        this.progress.move(1, `${pEventArgs.logic.icon.toString()} ${pEventArgs.logic.iconPage.size}x${pEventArgs.logic.iconPage.size}`);
    }

    onLogicFinalise(pProgres) {
        this.progress.complete("Done");        
        this.console.newLine();
    }

    onProgressUpdate(pProgres) {
        pProgres.render(this.console);
    }
}