class CharClearTransitionComponent extends BaseTransitionComponent {
    constructor(duration, onTransitionEndCallback) {
        super(duration, onTransitionEndCallback);
    }

    draw(deltaTime) {
        this.componentA.draw(deltaTime);
        this.componentB.draw(deltaTime);
        
        let bufferA = this.componentA.getBuffer();
        let bufferB = this.componentB.getBuffer();

        let maxBufferSize = Math.max(bufferA.length, bufferB.length);

        let v = (0.5 - Math.abs(this.animProgress - 0.5))*2;

        let hiddenCharNum = maxBufferSize * v;
        
        if (this.animProgress <= 0.5) {
            this.buffer = ['*'.repeat(hiddenCharNum), bufferA.slice(hiddenCharNum, Math.max(0, bufferA.length))].join('');
        }
        else {
            this.buffer = [bufferB.slice(0, Math.max(0, bufferB.length-hiddenCharNum+1)), '*'.repeat(hiddenCharNum)].join('');
        }
    }
}
