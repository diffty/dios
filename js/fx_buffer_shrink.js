class ShrinkBufferEffect extends BaseBufferEffect {
    constructor(lineSize) {
        super();
        this.lineSize = lineSize;
    }

    applyEffect(buffer) {
        return buffer.slice(0, this.lineSize);
    }
}
