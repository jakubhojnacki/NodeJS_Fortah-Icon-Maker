const path = require("path");

class FileInfo {
	get path() { return this.mPath; }
	set path(pValue) { 
		this.mPath = pValue; 
		this.name = path.basename(this.path);
	}		

	get name() { return this.mName; }
	set name(pValue) {
		this.mName = pValue;
		this.extension = path.extname(this.name);
		this.baseName = path.basename(this.name, "." + this.extension);
	}

	get extension() { return this.mExtension; }
	set extension(pValue) { 
		if (pValue.length > 0)
			if (pValue.charAt(0) === ".")
				if (pValue.length > 1)
					pValue = pValue.substr(1);
				else
					pValue = "";
		this.mExtension = pValue; 
	}

	get baseName() { return this.mBaseName; }
	set baseName(pValue) { this.mBaseName = pValue; }

	constructor() {
		this.path = "";
		this.name = "";
		this.extension = "";
		this.baseName = "";
	}

	static fromPath(pPath) {
		let newFileInfo = new FileInfo();
		newFileInfo.path = pPath;
		return newFileInfo;
	}

	static fromFolderPathAndFileName(pFolderPath, pFileName) {
		return FileInfo.fromPath(path.join(pFolderPath, pFileName));
	}
}

module.exports = FileInfo;