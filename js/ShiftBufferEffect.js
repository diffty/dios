class ShiftBufferEffect extends Animable(BaseBufferEffect) {
    constructor() {
        super();
    }

    applyEffect(buffer) {
        let currShift = Math.floor(this.animProgress * buffer.length);
        let bufferArray = buffer.split("");
        let shiftedChar = bufferArray.splice(0, currShift);
        return bufferArray.join("") + shiftedChar.join("");
    }
}
