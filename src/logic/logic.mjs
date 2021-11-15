/**
 * @module "Logic" class
 * @description Contains main logic of the application
 */

export class Logic {
    get application() { return this.mApplication; }
    set application(pValue) { this.mApplication = pValue; }
	
	constructor(pApplication) {
        this.application = pApplication;
    }

    run() {
	}
}
