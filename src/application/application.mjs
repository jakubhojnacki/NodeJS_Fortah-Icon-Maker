/**
 * @module "Application" class
 * @description Main application class
 */

import { ArgName } from "../application/argName.mjs";
import { ArgTemplateFactory } from "../application/argTemplateFactory.mjs";
import { ConsoleApplication } from "console-library";
import { ConsoleProgress } from "console-library";
import { ImageProcessorFactory } from "image-library";
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
        const symbolLibrariesPath = this.applyRootDirectoryPathToPath(this.settings.paths.symbolLibraries.trim());
        const symbolsPath = this.applyRootDirectoryPathToPath(this.settings.paths.symbols.trim());
        const profileName = this.args.get(ArgName.profile).trim();
        const profilesPath = this.applyRootDirectoryPathToPath(this.settings.paths.profiles.trim());
        const imageProcessor = (new ImageProcessorFactory()).create(this.settings.imageProcessor.type, this.settings.imageProcessor.path, this.rootDirectoryPath);
        const temporaryPath = this.applyRootDirectoryPathToPath(this.settings.paths.temporary);
        const outputPath = this.args.get(ArgName.outputDirectoryPath);

        this.console.writeLine(`Profile Name: "${profileName}"`, 1);
        this.console.writeLine(`Output Path: "${outputPath}"`, 1);

        const logic = new Logic(this, symbolLibrariesPath, symbolsPath, profileName, profilesPath, imageProcessor, temporaryPath, outputPath);

        const __this = this;
        logic.onInitialise = (lEventArgs) => { __this.onLogicInitialise(lEventArgs); }
        logic.onImage = (lEventArgs) => { __this.onLogicImage(lEventArgs); }
        logic.onFinalise = (lEventArgs) => { __this.onLogicFinalise(lEventArgs); }

        await logic.run();
    }

    applyRootDirectoryPathToPath(pPath) {
        return pPath.replace("{0}", this.rootDirectoryPath);
    }

    onLogicInitialise(pEventArgs) {
        const __this = this;
        this.progress = new ConsoleProgress(null, null, (lProgress) => { __this.onProgressUpdate(lProgress); }, "[", "#", "]", 20, this.console.width);
        this.progress.reset(pEventArgs.count, "Creating icons...");
        this.newLineOnError = true;
    }

    onLogicImage(pEventArgs) {
        this.progress.move(1, pEventArgs.image.toString());
    }

    onLogicFinalise(pProgres) {
        this.progress.complete("Done");        
        this.console.newLine();
    }

    onProgressUpdate(pProgres) {
        pProgres.render(this.console);
    }
}