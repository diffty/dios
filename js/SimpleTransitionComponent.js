class SimpleTransitionComponent extends BaseTransitionComponent {
    constructor(duration, onTransitionEndCallback) {
        super(duration, onTransitionEndCallback);
    }

    draw(deltaTime) {
        this.componentA.draw();
        this.componentB.draw();
        
        if (this.animProgress < 0.5) {
            this.buffer = this.componentA.getBuffer();
        }
        else {
            this.buffer = this.componentB.getBuffer();
        }
    }
}
