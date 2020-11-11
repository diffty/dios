class BaseTransitionComponent {
    constructor(duration, onTransitionEndCallback) {
        if (duration == undefined) {
            duration = 5.0;
        }
        
        this.buffer = "";
        this.componentA = null;
        this.componentB = null;
        this.animProgress = 0.0;
        this.duration = duration;
        this.isPlaying = false;
        this.onTransitionEndCallback = onTransitionEndCallback;
    }

    getBuffer() {
        return this.buffer;
    }

    play() {
        if (this.componentA == undefined || this.componentB == undefined) {
            throw "<!!> Missing one or both of the components to transition.";
        }

        this.isPlaying = true;
        console.log("<i> Starting transition between", this.componentA, "and", this.componentB);
    }

    reset() {
        this.animProgress = 0.0;
        this.componentA = null;
        this.componentB = null;
        this.isPlaying = false;
    }

    setComponents(componentA, componentB) {
        this.componentA = componentA;
        this.componentB = componentB;
    }

    update(deltaTime) {
        if (this.isPlaying) {
            var step = deltaTime / this.duration;
            this.animProgress += step;


            if (this.animProgress > 1.0) {
                this.animProgress = 1.0;
                this.isPlaying = false;

                this.onTransitionEnd();
            }
        }
    }

    draw(deltaTime) {
        
    }

    onTransitionEnd() {
        console.log("<i> Finished transition between", this.componentA, "and", this.componentB, "!");

        if (this.onTransitionEndCallback) {
            this.onTransitionEndCallback();
        }
    }
}
