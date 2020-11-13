class TextBufferComponent extends BaseBufferComponent {
    constructor(text) {
        super();

        if (text != undefined) {
            this.setText(text);
        }
    }

    setText(text) {
        this.setRawBuffer(text);
    }

    draw(deltaTime) {
        this.buffer = this.rawBuffer;
        this.applyEffects();
    }
}   
