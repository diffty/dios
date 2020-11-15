class ShiftBufferEffect extends StepAnimable(BaseBufferEffect) {
    constructor() {
        super();
        this.stepNum = 0;
    }

    applyEffect(buffer) {
        if (buffer.length > 0)
            this.stepNum = this.stepNum % buffer.length;
        else
            this.stepNum = 0;

        let currShift = Math.floor(this.stepNum);
        let bufferArray = buffer.split("");
        let shiftedChar = bufferArray.splice(0, currShift);
        return bufferArray.join("") + shiftedChar.join("");
    }

    onStepEnd() {
        super.onStepEnd();
        this.stepNum++;
    }
}
