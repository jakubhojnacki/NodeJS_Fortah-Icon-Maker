/**
 * @module "Logic" class
 * @description Contains main logic of the application
 */

import FileSystem from "fs";
import Path from "path";

import { FileSystemItem } from "file-system-library";
import { FileSystemItemType } from "file-system-library";
import { FileSystemToolkit } from "file-system-library";
import { IconLibrary } from "../iconLibraries/iconLibrary.mjs";
import { ImagePage } from "image-library";
import { LogicEventArgs } from "../logic/logicEventArgs.mjs";
import { LogicIconEventArgs } from "../logic/logicIconEventArgs.mjs";
import { LogicIconPageEventArgs } from "../logic/logicIconPageEventArgs.mjs";
import { Profile } from "../profiles/profile.mjs";
import { Validator } from "core-library";

export class Logic {
    get application() { return this.mApplication; }
    set application(pValue) { this.mApplication = pValue; }
    
    get iconLibrariesPath() { return this.mIconLibrariesPath; }
    set iconLibrariesPath(pValue) { this.mIconLibrariesPath = String.verify(pValue); }
    get iconLibrary() { return this.mIconLibrary; }
    set iconLibrary(pValue) { this.mIconLibrary = pValue; }
    get icon() { return this.mIcon; }
    set icon(pValue) { this.mIcon = pValue; }
    get iconPage() { return this.mIconPage; }
    set iconPage(pValue) { this.mIconPage = pValue; }

	get profileName() { return this.mProfileName; }
    set profileName(pValue) { this.mProfileName = String.verify(pValue); }
    get profilesPath() { return this.mProfilesPath; }
    set profilesPath(pValue) { this.mProfilesPath = String.verify(pValue); }
    get profile() { return this.mProfile; }
    set profile(pValue) { this.mProfile = pValue; }
    get profilePage() { return this.mProfilePage; }
    set profilePage(pValue) { this.mProfilePage = pValue; }

    get imageProcessor() { return this.mImageProcessor; }
    set imageProcessor(pValue) { this.mImageProcessor = pValue; }
    get imagePages() { return this.mImagePages; }
    set imagePages(pValue) { this.mImagePages = pValue; }
    
    get temporaryPath() { return this.mTemporaryPath; }
    set temporaryPath(pValue) { this.mTemporaryPath = String.verify(pValue); }
    get temporaryImagePath() { return this.mTemporaryImagePath; }
    set temporaryImagePath(pValue) { this.mTemporaryImagePath = pValue; }
    
    get outputPath() { return this.mOutputPath; }
    set outputPath(pValue) { this.mOutputPath = String.verify(pValue); }

    get onInitialise() { return this.mOnInitialise; }
    set onInitialise(pValue) { this.mOnInitialise = pValue; }
    get onIcon() { return this.mOnIcon; }
    set onIcon(pValue) { this.mOnIcon = pValue; }
    get onIconPage() { return this.mOnPage; }
    set onIconPage(pValue) { this.mOnPage = pValue; }
    get onFinalise() { return this.mOnFinalise; }
    set onFinalise(pValue) { this.mOnFinalise = pValue; }

	constructor(pApplication, pIconLibrariesPath, pProfileName, pProfilesPath, pImageProcessor, pTemporaryPath, pOutputPath) {
        this.application = pApplication;
        
        this.iconLibrariesPath = pIconLibrariesPath;
        this.iconLibrary = null;
        this.icon = null;
        this.iconPage = null;

        this.profileName = pProfileName;
        this.profilesPath = pProfilesPath;
        this.profile = null;
        this.profilePage = null;

        this.imageProcessor = pImageProcessor;
        this.imagePages = null;

        this.temporaryPath = pTemporaryPath;
        this.temporaryImagePath = null;

        this.outputPath = pOutputPath;

        this.onInitialise = null;
        this.onIcon = null;
        this.onIconPage = null;
        this.onFinalise = null;
    }

    async run() {
        if (this.validate()) {
            this.initialise();
            await this.process();
            this.finalise();
        }
	}

    validate() {
        const validator = new Validator();
        validator.setComponent(Logic.name);
        validator.testNotEmpty("iconLibrariesPath", this.iconLibrariesPath);
        validator.testNotEmpty("profileName", this.profileName);
        validator.testNotEmpty("profilesPath", this.profilesPath);
        validator.testNotEmpty("imageProcessor", this.imageProcessor);
        validator.testNotEmpty("temporaryPath", this.temporaryPath);
        validator.testNotEmpty("outputPath", this.outputPath);
        validator.restoreComponent();
        const success = validator.success;
        if (!success)
            for (const errorMessage of validator.errorMessages)
                this.application.console.writeLine(errorMessage.toString());
        return success;
    }

    initialise() {
        this.profile = new Profile(this.profilesPath, this.profileName);
        this.iconLibrary = new IconLibrary(this.iconLibrariesPath, this.profile.iconLibrary);
        this.triggerOnInitialise();
    }

    triggerOnInitialise() {
        if (this.onInitialise) {
            const count = this.iconLibrary.icons.length * this.profile.pages.length; 
            this.onInitialise(new LogicEventArgs(this, count));
        }
    }

    async process() {
        for (const icon of this.iconLibrary.icons) {
            this.icon = icon;
            this.triggerOnIcon();            
            for (const iconPage of this.iconLibrary.pages) {
                this.iconPage = iconPage;
                this.triggerOnIconPage();
                await this.createImage();
                break; //TODO - Remove
            }
            break; //TODO - Remove           
        }
    }

    triggerOnIcon() {
        if (this.onIcon)
            this.onIcon(new LogicIconEventArgs(this, this.icon));
    }
    
    triggerOnIconPage() {
        if (this.onIconPage)
            this.onIconPage(new LogicIconPageEventArgs(this, this.icon, this.iconPage));
    }

    async createImage() {
        this.profilePage = this.profile.pages.get(this.iconPage.size);
        if (this.profilePage) {
            this.initialiseImage();
            this.createProfileImagePage(this.profilePage.template.back);
            await this.createIconImagePage();
            this.createProfileImagePage(this.profilePage.template.fore);
            await this.finaliseImage();
        }
    }

    initialiseImage() {
        this.imagePages = [];
        this.temporaryImagePath = null;
    }

    createProfileImagePage(pImage) {
        let result = false;
        if (pImage) {
            const path = Path.join(this.profile.path, this.profilePage.template.back);
            const file = new FileSystemItem(FileSystemItemType.file, path);
            this.imagePages.push(new ImagePage(file, this.profilePage.symbol.xOffset, this.profilePage.symbol.yOffset));
            result = true;
        }
        return result;
    }

    async createIconImagePage() {
        let result = false;
        let path = null;
        if (this.profilePage.size != this.profilePage.symbol.size) {
            const largestPage = this.iconLibrary.pages.getLargest();
            if (largestPage) {
                const sourcePath = Path.join(this.iconLibrary.path, largestPage.path, this.icon.path);
                const iconName = FileSystemToolkit.getFileName(this.icon.path);
                this.temporaryImagePath = Path.join(this.temporaryPath, iconName);
                await this.imageProcessor.resize(sourcePath, this.temporaryImagePath, this.profilePage.symbol.size, this.profilePage.symbol.size);
                path = this.temporaryImagePath;
                result = true;
            }
        }
        if (!result) {
            path = Path.join(this.iconLibrary.path, this.iconPage.path, this.icon.path);
            result = true;
        }
        if (result) {
            const file = new FileSystemItem(FileSystemItemType.file, path);
            this.imagePages.push(new ImagePage(file, this.profilePage.symbol.xOffset, this.profilePage.symbol.yOffset));
        }
        return result;
    }

    async finaliseImage() {
        const directoryPath = Path.join(this.outputPath, this.iconPage.path);
        FileSystemToolkit.createDirectoryIfDoesntExist(directoryPath);
        const filePath = Path.join(directoryPath, this.icon.path);
        await this.imageProcessor.merge(this.imagePages, filePath);
        if (this.temporaryImagePath)
            FileSystemToolkit.deleteFileIfExists(this.temporaryImagePath);
    }

    finalise() {
        if (this.onFinalise)
            this.onFinalise(new LogicEventArgs(this));
    }
}
