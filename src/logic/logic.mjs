/**
 * @module "Logic" class
 * @description Contains main logic of the application
 */

import Path from "path";

import { ArgName } from "../application/argName.mjs";
import { FileSystemItem } from "file-system-library";
import { FileSystemItemType } from "file-system-library";
import { IconLibrary } from "../iconLibraries/iconLibrary.mjs";
import { ImagePage } from "image-library";
import { ImageProcessorFactory } from "image-library";
import { LogicEventArgs } from "../logic/logicEventArgs.mjs";
import { LogicIconEventArgs } from "../logic/logicIconEventArgs.mjs";
import { LogicIconPageEventArgs } from "../logic/logicIconPageEventArgs.mjs";
import { Profile } from "../profiles/profile.mjs";

export class Logic {
    get application() { return this.mApplication; }
    set application(pValue) { this.mApplication = pValue; }

    get profile() { return this.mProfile; }
    set profile(pValue) { this.mProfile = pValue; }
    get iconLibrary() { return this.mIconLibrary; }
    set iconLibrary(pValue) { this.mIconLibrary = pValue; }
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

        this.profile = null;
        this.iconLibrary = null;
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
        this.initialiseProfile();
        this.initialiseIconLibrary();
        this.initialiseImageProcessor();
        this.triggerOnInitialise();
    }

    initialiseProfile() {
        const profileName = this.application.args.get(ArgName.profile);
        const profilesPath = this.application.settings.paths.profiles.trim();
        this.profile = new Profile(profilesPath, profileName);
    }

    initialiseIconLibrary() {
        const iconLibrariesPath = this.application.settings.paths.iconLibraries;
        this.iconLibrary = new IconLibrary(iconLibrariesPath, this.profile.iconLibrary);
    }

    initialiseImageProcessor() {
        const imageProcessorSettings = this.application.settings.imageProcessors.get(this.application.settings.imageProcessor, null);
        this.imageProcessor = (new ImageProcessorFactory()).create(imageProcessorSettings.type, imageProcessorSettings.path);
    }

    triggerOnInitialise() {
        if (this.onInitialise) {
            const count = this.iconLibrary.icons.length * this.profile.pages.length; 
            this.onInitialise(new LogicEventArgs(this, count));
        }
    }

    process() {
        for (const icon of this.iconLibrary.icons) {
            this.triggerOnIcon(icon);
            for (const page of this.iconLibrary.pages) {
                this.triggerOnPage(icon, page);
                this.createIconPage(icon, page);
            }
            this.mergeIconPages();
        }
    }

    triggerOnIcon(pIcon) {
        if (this.onIcon)
            this.onIcon(new LogicIconEventArgs(this, pIcon));
    }
    
    triggerOnPage(pIcon, pPage) {
        if (this.onPage)
            this.onPage(new LogicIconPageEventArgs(this, pIcon, pPage));
    }

    createIconPage(pIcon, pPage) {
        const profilePage = this.profile.pages.get(pPage.size);
        if (profilePage) {
            const imagePages = [];
            this.appendProfileImagePage(profilePage, profilePage.template.back, imagePages);
            this.appendIconImagePage(pIcon, pPage, profilePage, imagePages);
            this.appendProfileImagePage(profilePage, profilePage.template.fore, imagePages);
            //TODO - Not implemented
        }
    }

    appendProfileImagePage(pProfilePage, pImage, pImagePages) {
        let result = false;
        if (pImage) {
            const path = Path.join(this.profile.path, pProfilePage.template.back);
            const file = new FileSystemItem(FileSystemItemType.file, path);
            pImagePages.push(new ImagePage(file, pProfilePage.symbol.xOffset, pProfilePage.symbol.yOffset));
            result = true;
        }
        return result;
    }

    appendIconImagePage(pIcon, pPage, pProfilePage, pImagePages) {
        let result = false;
        let path = null;
        if (pProfilePage.size != pProfilePage.symbol.size) {
            const largestPage = this.iconLibrary.pages.getLargest();
            if (largestPage) {
                const sourcePath = Path.join(this.iconLibrary.path, largestPage.path, pIcon.path); //TODO - Optimise
                const path = "???"; //TODO - Not implemented
                this.imageProcessor.resize(sourcePath, destinationPath);
                result = true;
            }
        }
        if (!result) {
            path = Path.join(this.iconLibrary.path, pPage.path, pIcon.path); //TODO - Optimise
            result = true;
        }
        if (result) {
            const file = new FileSystemItem(FileSystemItemType.file, path);
            pImagePages.push(new ImagePage(file, pProfilePage.symbol.xOffset, pProfilePage.symbol.yOffset));
        }
        return result;
    }

    mergeIconPages() {
        //TODO - Not implemented
    }

    finalise() {
        if (this.onFinalise)
            this.onFinalise(new LogicEventArgs(this));
    }
}
