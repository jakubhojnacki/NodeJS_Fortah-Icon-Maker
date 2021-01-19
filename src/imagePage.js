class ImagePage {
	get fileInfo() { return this.mFileInfo; }
	get xOffset() { return this.mXOffset; }
	get yOffset() { return this.mYOffset; }

	constructor(pFileInfo, pXOffset, pYOffset) {
		this.mFileInfo = pFileInfo;
		this.mXOffset = pXOffset;
		this.mYOffset = pYOffset;
	}
}

module.exports = ImagePage;