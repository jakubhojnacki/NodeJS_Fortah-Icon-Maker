const imagemagick = require("imagemagick");

class ImageMagick {
    constructor() {
    }

	async extract(pSourcePath, pSourceIndex, pDestinationPath) {
		await this.convert([`${pSourcePath}[${pSourceIndex}]`, pDestinationPath]);
	}

	async resize(pSourcePath, pNewWidth, pNewHeight, pDestinationPath) {
		await this.convert([pSourcePath, "-resize", `${pNewWidth}x${pNewHeight}`, pDestinationPath]);
	}

	async merge(pPages, pDestinationPath) {
		let parameters = [];
		for (const page of pPages) {
			parameters.push("-page");
			parameters.push(`+${page.xOffset}+${page.yOffset}`);
			parameters.push(page.fileInfo.path);
		}
		parameters.push("-layers");
		parameters.push("coalesce");
		parameters.push("-delete");
		parameters.push("0--2");
		parameters.push(pDestinationPath);
		await this.convert(parameters);
	}

	async combine(pSourcePaths, pDestinationPath) {
		let parameters = [];
		for (const sourcePath of pSourcePaths)
			parameters.push(sourcePath);
		parameters.push(pDestinationPath);
		await this.convert(parameters);
	}

	convert(pParameters) {
		return new Promise((resolve, reject) => {
			imagemagick.convert(pParameters, (error, stdout) => {
				if (error)
					reject();
				resolve(stdout);
			});
		});
	}
}

module.exports = ImageMagick;