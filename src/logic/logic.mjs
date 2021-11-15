/**
 * @module "Logic" class
 * @description Contains main logic of the application
 */

import { IconLibrary } from "../iconLibrary/iconLibrary.mjs";
import { ImageProcessorFactory } from "image-library";
import { LogicEventArgs } from "../logic/logicEventArgs.mjs";
import { LogicIconEventArgs } from "../logic/logicIconEventArgs.mjs";
import { LogicIconPageEventArgs } from "../logic/logicIconPageEventArgs.mjs";
import { Profile } from "../profiles/profile.mjs";

export class Logic {
    get application() { return this.mApplication; }
    set application(pValue) { this.mApplication = pValue; }
    get iconLibrary() { return this.mIconLibrary; }
    set iconLibrary(pValue) { this.mIconLibrary = pValue; }
    get profile() { return this.mProfile; }
    set profile(pValue) { this.mProfile = pValue; }
    get imageProcessor() { return this.mImageProcessor; }
    set imageProcessor(pValue) { this.mImageProcessor = pValue; }
	
    get onInitialise() { return this.mOnInitialise; }
    set onInitialise(pValue) { this.mOnInitialise = pValue; }
    get onIcon() { return this.mOnIcon; }
    set onIcon(pValue) { this.mOnIcon = pValue; }
    get onPage() { return this.mOnPage; }
    set onPage(pValue) { this.mOnPage = pValue; }
    get onFinalise() { return this.mOnFinalise; }
    set onFinalise(pValue) { this.mOnFinalise = pValue; }

	constructor(pApplication) {
        this.application = pApplication;

        this.iconLibrary = null;
        this.profile = null;
        this.imageProcessor = null;

        this.onInitialise = null;
        this.onIcon = null;
        this.onPage = null;
        this.onFinalise = null;
    }

    run() {
        this.initialise();
        this.process();
        this.finalise();
	}

    initialise() {
        this.iconLibrary = new IconLibrary(this.application.settings.iconLibrary);
        this.profile = new Profile(this.application.settings.profiles);
        const imageProcessorSettings = settings.imageProcessors.get(this.application.settings.imageProcessor, null);
        this.imageProcessor = (new ImageProcessorFactory()).create(imageProcessorSettings.type, imageProcessorSettings.path);
        if (this.onInitialise)
            this.onInitialise(new LogicEventArgs(this));
    }

    process() {
        for (const icon of this.profile.icons) {
            if (this.onIcon)
                this.onIcon(new LogicIconEventArgs(this, icon));
            for (const page of this.profile.pages) {
                if (this.onPage)
                    this.onPage(new LogicIconPageEventArgs(his, icon, page));
                this.createIcon();
                this.merge();
            }
        }
    }

    createIcon() {
        //TODO - Not implemented
    }

    merge() {
        //TODO - Not implemented
    }

    finalise() {
        if (this.onFinalise)
            this.onFinalise(new LogicEventArgs(this));
    }
}
