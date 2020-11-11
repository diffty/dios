class TextTickerComponent extends BaseTickerComponent {
    constructor(text) {
        super();

        if (text != undefined) {
            this.setText(text);
        }
    }

    setText(text) {
        this.setBuffer(text);
    }
}   
