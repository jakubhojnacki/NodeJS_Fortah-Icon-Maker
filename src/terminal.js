const console = require("console");

class Terminal {
    get width() { return this.mWidth; }
    set width(pValue) { this.mWidth = pValue; }
    get currentRow() { return this.mCurrentRow; }
    set currentRow(pValue) { this.mCurrentRow = pValue; }
    get controls() { return this.mControls; }
    get controlCaptionWidth() { return this.mControlCaptionWidth; }
    get buffer() { return this.mBuffer; }
    set buffer(pValue) { this.mBuffer = pValue; }

    constructor(pWidth, pControlCaptionWidth) {
        this.mWidth = pWidth != null ? pWidth : 79; 
        this.mCurrentRow = 1;
        this.mControls = [];
        this.mControlCaptionWidth = pControlCaptionWidth != null ? pControlCaptionWidth : 20;
        this.mBuffer = "";
    }

    addControl(pControl) {
        pControl.terminal = this;
        pControl.column = 1;
        pControl.row = this.currentRow;
        this.controls.push(pControl);
        this.currentRow++;
        return pControl;
    }

    draw() {
        for (const control of this.controls)
            control.draw();
        this.moveToTheEnd();
    }

    clearLine(pFlush) {
        this.clear('K', "2", pFlush);
    }

    clearLineToTheEnd(pFlush) {
        this.clear('K', "0", pFlush);
    }

    clear(pCode, pType, pFlush) {
        this.buffer += this.escape(`${pType}${pCode}`);
        this.flush(pFlush, false);
    }

    moveTo(pColumn, pRow, pFlush) {
        this.buffer += this.escape(`${pRow};${pColumn}H`);
        this.flush(pFlush, false);
    }

    moveToTheEnd() {
        this.moveTo(1, this.currentRow);
    }

    drawText(pText, pFlush) {
        this.buffer += pText;
        this.flush(pFlush, true);
    }

    escape(pCommand) {
        return "\u001b[" + pCommand;
    }

    flush(pFlush, pNewLine) {
        if ((pFlush != null ? pFlush : true) && (this.buffer)) {
            if (pNewLine) {
                console.log(this.buffer);
                this.currentRow++;
            } else
                process.stdout.write(this.buffer);
            this.buffer = "";
        }
    }
}

class TerminalControl {
    get terminal() { return this.mTerminal; }
    set terminal(pValue) { this.mTerminal = pValue; }
    get column() { return this.mColumn; }
    set column(pValue) { this.mColumn = pValue; }
    get row() { return this.mRow; }
    set row(pValue) { this.mRow = pValue; }

    constructor() {
        this.mTerminal = null;
        this.mColumn = null;
        this.mRow = null;
    }

    beginDrawing() {
        this.terminal.moveTo(this.column, this.row, false);
        this.terminal.clearLine();
    }
}

class TerminalLine extends TerminalControl {
    get width() { return this.mWidth; }
    
    constructor(pWidth) {
        super();
        this.mWidth = pWidth;
    }

    draw() {
        super.beginDrawing();
        this.terminal.drawText("-".repeat(this.width != null ? this.width : this.terminal.width));
    }
}

class TerminalLabel extends TerminalControl {
    get caption() { return this.mCaption; }

    constructor(pCaption) {
        super();
        this.mCaption = pCaption;
    }

    draw() {
        super.beginDrawing();
        this.terminal.drawText(this.caption.padEnd(this.terminal.width));
    }
}

class TerminalField extends TerminalControl {
    get caption() { return this.mCaption; }
    get value() { return this.mValue; }
    set value(pValue) { this.mValue = pValue; }

    constructor(pCaption, pValue) {
        super();
        this.mCaption = pCaption;
        this.mValue = pValue != null ? pValue : "";
    }

    draw() {
        super.beginDrawing();
        this.terminal.drawText(`${this.caption.padEnd(this.terminal.controlCaptionWidth)}${this.value}`, false);
    }

    update(pValue) {
        this.value = pValue;
        this.draw();
        this.terminal.moveToTheEnd();
    }
}

module.exports = { Terminal, TerminalLine, TerminalLabel, TerminalField }