const imagemagick = include("imagemagick");

class ImageMagick {
    constructor() {
    }

	extract(pSourcePath, pSourceIndex, pDestinationPath) {
		imagemagick.convert([`${pSourcePath}[${pSourceIndex}]`, pDestinationPath]);
	}

	resize(pSourcePath, pNewWidth, pNewHeight, pDestinationPath) {
		imagemagick.convert([pSourcePath, "-resize", `${pNewWidth}x${pNewHeight}`, pDestinationPath]);
	}

	merge(pPages, pDestinationPath) {
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
		imagemagick.convert(parameters);
	}

	combine(pSourcePaths, pDestinationPath) {
		let parameters = [];
		for (const sourcePath of pSourcePaths)
			parameters.push(sourcePath);
		parameters.push(pDestinationPath);
		imagemagick.convert(parameters);
	}
}

module.exports = GraphicsMagick;