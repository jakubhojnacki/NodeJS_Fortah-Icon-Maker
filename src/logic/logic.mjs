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
import { LogicImageEventArgs } from "../logic/logicImageEventArgs.mjs";
import { LogicImage } from "../logic/logicImage.mjs";
import { Profile } from "../profiles/profile.mjs";
import { Validator } from "core-library";
import { timeStamp } from "console";

export class Logic {
    get application() { return this.mApplication; }
    set application(pValue) { this.mApplication = pValue; }
    
    get iconLibrariesPath() { return this.mIconLibrariesPath; }
    set iconLibrariesPath(pValue) { this.mIconLibrariesPath = String.verify(pValue); }
    get iconLibrary() { return this.mIconLibrary; }
    set iconLibrary(pValue) { this.mIconLibrary = pValue; }
	get profileName() { return this.mProfileName; }
    set profileName(pValue) { this.mProfileName = String.verify(pValue); }
    get profilesPath() { return this.mProfilesPath; }
    set profilesPath(pValue) { this.mProfilesPath = String.verify(pValue); }
    get profile() { return this.mProfile; }
    set profile(pValue) { this.mProfile = pValue; }

    get images() { return this.mImages; }
    set images(pValue) { this.mImages = Array.verify(pValue); }
    get imageProcessor() { return this.mImageProcessor; }
    set imageProcessor(pValue) { this.mImageProcessor = pValue; }
    
    get temporaryPath() { return this.mTemporaryPath; }
    set temporaryPath(pValue) { this.mTemporaryPath = String.verify(pValue); }
    get temporaryImagePath() { return this.mTemporaryImagePath; }
    set temporaryImagePath(pValue) { this.mTemporaryImagePath = pValue; }
    
    get outputPath() { return this.mOutputPath; }
    set outputPath(pValue) { this.mOutputPath = String.verify(pValue); }

    get onInitialise() { return this.mOnInitialise; }
    set onInitialise(pValue) { this.mOnInitialise = pValue; }
    get onImage() { return this.mOnImage; }
    set onImage(pValue) { this.mOnImage = pValue; }
    get onFinalise() { return this.mOnFinalise; }
    set onFinalise(pValue) { this.mOnFinalise = pValue; }

	constructor(pApplication, pIconLibrariesPath, pProfileName, pProfilesPath, pImageProcessor, pTemporaryPath, pOutputPath) {
        this.application = pApplication;
        
        this.iconLibrariesPath = pIconLibrariesPath;
        this.iconLibrary = null;
        this.profileName = pProfileName;
        this.profilesPath = pProfilesPath;
        this.profile = null;

        this.images = null;
        this.imageProcessor = pImageProcessor;

        this.temporaryPath = pTemporaryPath;

        this.outputPath = pOutputPath;

        this.onInitialise = null;
        this.onImage = null;
        this.onFinalise = null;
    }

    async run() {
        if (this.validate()) {
            this.initialise();
            this.prepareImages();
            if (this.validateImages())
                await this.processImages();
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
        if (this.onInitialise) {
            const count = this.iconLibrary.icons.length * this.profile.pages.length; 
            this.onInitialise(new LogicEventArgs(this, count));
        }
    }

    prepareImages() {
        this.images = new Array();
        for (const icon of this.iconLibrary.icons)
            for (const iconPage of this.iconLibrary.pages) {
                const profilePage = this.profile.pages.get(iconPage.size);
                if (profilePage) {
                    const image = new LogicImage(icon.name, iconPage.size/*TODO -> this is wrong: , iconPage.path*/);
                    if (profilePage.template.back)
                        image.backPath = Path.join(this.profile.path, profilePage.template.back);
                    if (profilePage.template.fore)
                        image.forePath = Path.join(this.profile.path, profilePage.template.fore);
                    let iconPageToUse = iconPage;
                    if (profilePage.size != profilePage.symbol.size) {
                        const largestPage = this.iconLibrary.pages.getLargest();
                        if (largestPage) {
                            iconPageToUse = largestPage;
                            image.iconSize = profilePage.symbol.size;
                            image.iconXOffset = profilePage.symbol.xOffset;
                            image.iconYOffset = profilePage.symbol.yOffset;
                        }
                    }
                    image.iconPath = Path.join(this.iconLibrary.path, iconPageToUse.path, icon.path);
                    this.images.push(image);
                }
            }
    }

    validateImages() {
        const validator = new Validator();
        for (const image of this.images)
            image.validate(validator);
        return validator.require();
    }

    async processImages() {
        for (const image of this.images) {
            if (this.onImage)
                this.onImage(new LogicImageEventArgs(this, image));
            await this.resizeIconIfNecessary(image);
            await this.createImage(image);
        }
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

    async resizeIconIfNecessary(pImage) {
        if (pImage.iconSize != pImage.size) {
            const icon = new FileSystemItem(FileSystemItemType.flie, pImage.iconPath);
            const temporaryIconPath = Path.join(this.temporaryPath, icon.name);
            await this.imageProcessor.resize(pImage.iconPath, temporaryIconPath, pImage.iconSize, pImage.iconSize);
            pImage.iconPath = temporaryIconPath;
        }
    }

    async createImage(pImage) {
        //TODO - Review all of it
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
