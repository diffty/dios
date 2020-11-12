class BaseTransitionComponent extends Animable(BaseBufferComponent) {
    constructor(duration, onTransitionEndCallback) {
        super();

        if (duration == undefined) {
            duration = 5.0;
        }
        
        this.setDuration(duration);
        this.setOnAnimationEndCallback(onTransitionEndCallback);

        this.componentA = null;
        this.componentB = null;
    }

    play() {
        if (this.componentA == undefined || this.componentB == undefined) {
            throw "<!!> Missing one or both of the components to transition.";
        }

        console.log("<i> Starting transition between", this.componentA, "and", this.componentB);
        super.play();
    }

    reset() {
        this.componentA = null;
        this.componentB = null;
        super.reset()
    }

    setComponents(componentA, componentB) {
        this.componentA = componentA;
        this.componentB = componentB;
    }

    draw(deltaTime) {
        
    }

    onAnimationEnd() {
        console.log("<i> Finished transition between", this.componentA, "and", this.componentB, "!");

        if (this.onTransitionEndCallback) {
            this.onTransitionEndCallback();
        }
    }
}
