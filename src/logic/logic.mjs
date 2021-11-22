/**
 * @module "Logic" class
 * @description Contains main logic of the application
 */

import FileSystem from "fs";
import Path from "path";

import { FileSystemItem } from "file-system-library";
import { FileSystemItemType } from "file-system-library";
import { FileSystemToolkit } from "file-system-library";
import { SymbolLibrary } from "../symbolLibraries/symbolLibrary.mjs";
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
    
    get symbolLibrariesPath() { return this.mSymbolLibrariesPath; }
    set symbolLibrariesPath(pValue) { this.mSymbolLibrariesPath = String.verify(pValue); }
    get symbolLibrary() { return this.mSymbolLibrary; }
    set symbolLibrary(pValue) { this.mSymbolLibrary = pValue; }
    get symbolsPath() { return this.mSymbolsPath; }
    set symbolsPath(pValue) { this.mSymbolsPath = String.verify(pValue); }

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

	constructor(pApplication, pSymbolLibrariesPath, pSymbolsPath, pProfileName, pProfilesPath, pImageProcessor, pTemporaryPath, pOutputPath) {
        this.application = pApplication;
        
        this.symbolLibrariesPath = pSymbolLibrariesPath;
        this.symbolLibrary = null;
        this.symbolsPath = pSymbolsPath;
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
        validator.testNotEmpty("Symbol Libraries Path", this.symbolLibrariesPath);
        validator.testNotEmpty("Profile Name", this.profileName);
        validator.testNotEmpty("Profiles Path", this.profilesPath);
        validator.testNotEmpty("Image Processor", this.imageProcessor);
        validator.testNotEmpty("Temporary Path", this.temporaryPath);
        validator.testNotEmpty("Output Path", this.outputPath);
        validator.restoreComponent();
        const success = validator.success;
        if (!success)
            for (const errorMessage of validator.errorMessages)
                this.application.console.writeLine(errorMessage.toString());
        return success;
    }

    initialise() {
        this.profile = new Profile(this.profilesPath, this.profileName);
        this.symbolLibrary = new SymbolLibrary(this.symbolLibrariesPath, this.profile.symbolLibrary);
        if (this.onInitialise) {
            const count = this.symbolLibrary.symbols.length * this.profile.pages.length; 
            this.onInitialise(new LogicEventArgs(this, count));
        }
    }

    prepareImages() {
        const symbolsPath = this.symbolLibrary.path ? this.symbolLibrary.path : this.symbolsPath;
        this.images = new Array();
        for (const symbol of this.symbolLibrary.symbols)
            for (const symbolPage of this.symbolLibrary.pages) {
                const profilePage = this.profile.pages.get(symbolPage.size);
                if (profilePage) {
                    const image = new LogicImage(symbol.name, symbolPage.size);
                    if (profilePage.template.back)
                        image.backPath = Path.join(this.profile.path, profilePage.template.back);
                    if (profilePage.template.fore)
                        image.forePath = Path.join(this.profile.path, profilePage.template.fore);
                    let symbolPageToUse = symbolPage;
                    if (profilePage.size != profilePage.symbol.size) {
                        const symbolPageFound = this.findSymbolPage(symbol, symbolsPath);
                        if (symbolPageFound) {
                            symbolPageToUse = symbolPageFound;
                            image.symbolSize = profilePage.symbol.size;
                            image.symbolXOffset = profilePage.symbol.xOffset;
                            image.symbolYOffset = profilePage.symbol.yOffset;
                        }
                    }
                    image.symbolPath = Path.join(symbolsPath, symbolPageToUse.path, symbol.path);
                    image.outputPath = Path.join(this.outputPath, symbolPage.path, symbol.path);
                    this.images.push(image);
                }
            }
    }

    findSymbolPage(pSymbol, pSymbolsPath) {
        let symbolPageFound = null;
        const symbolPages = this.symbolLibrary.pages.sort((lItem1, lItem2) => { return lItem1 > lItem2 ? -1 : (lItem1 < lItem2 ? 1 : 0); });
        for (const symbolPage of symbolPages) {
            const symbolPath = Path.join(pSymbolsPath, symbolPage.path, pSymbol.path);
            if (FileSystem.existsSync(symbolPath)) {
                symbolPageFound = symbolPage;
                break;
            }
        }
        return symbolPageFound;
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
            await this.resizeSymbolIfNecessary(image);
            await this.createImage(image);
        }
    }

    async resizeSymbolIfNecessary(pImage) {
        if (pImage.symbolSize != pImage.size) {
            const symbol = new FileSystemItem(FileSystemItemType.flie, pImage.symbolPath);
            const temporarySymbolPath = Path.join(this.temporaryPath, symbol.name);
            await this.imageProcessor.resize(pImage.symbolPath, temporarySymbolPath, pImage.symbolSize, pImage.symbolSize);
            pImage.symbolPath = temporarySymbolPath;
        }
    }

    async createImage(pImage) {
        const outputDirectoryPath = Path.dirname(pImage.outputPath);
        FileSystemToolkit.createDirectoryIfDoesntExist(outputDirectoryPath);
        const imagePages = pImage.imagePages;
        await this.imageProcessor.merge(imagePages, pImage.outputPath);
        /*TODO - Uncomment
        if (this.temporaryImagePath)
            FileSystemToolkit.deleteFileIfExists(this.temporaryImagePath);
        */
    }

    finalise() {
        if (this.onFinalise)
            this.onFinalise(new LogicEventArgs(this));
    }
}
