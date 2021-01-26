class ImageMagickShell {
	get path() { return this.mPath; }
	set path(value) { this.mPath = value; }

	get diagnosticMode() { return this.mDiagnosticMode; }
	set diagnosticMode(value) { this.mDiagnosticMode = value; }

	constructor(pPath, pDiagnosticMode) {
		this.mPath = pPath;
		this.mDiagnosticMode = pDiagnosticMode;
	}
	
	extract(pSourcePath, pSourceIndex, pDestinationPath) {
		this.run(["convert", `${pSourcePath}[${pSourceIndex}]`, pDestinationPath]);
	}

	resize(pSourcePath, pNewWidth, pNewHeight, pDestinationPath) {
		this.run(["convert", pSourcePath, "-resize", `${pNewWidth}x${pNewHeight}`, pDestinationPath]);
	}

	merge(pPages, pDestinationPath) {
		let parameters = ["convert"];
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
		this.run(parameters);
	}

	combine(pSourcePaths, pDestinationPath) {
		let parameters = ["convert"];
		for (const sourcePath of pSourcePaths)
			parameters.push(sourcePath);
		parameters.push(pDestinationPath);
		this.run(parameters);
	}

	run(pParameters) {
		if (this.diagnosticMode)
			this.showCommand(pParameters);
		const childProcess = require("child_process");
		const result = childProcess.spawnSync(this.path, pParameters);
		if (result.error)
			throw result.error.message;
	}

	showCommand(pParameters) {
		let text =`"${this.path}"`;
		for (const parameter of pParameters) {
			if (text.length > 0)
				text += " ";
			text += `"${parameter}"`;
		}
		console.log(text);
	}
}

module.exports = ImageMagickShell;