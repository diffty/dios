// mixins implementation reference took from 
// https://dev.to/open-wc/using-javascript-mixins-the-good-parts-4l60
// https://www.codeheroes.fr/2017/12/23/javascript-heritage-multiple/

let StepAnimable = function(superclass) {
    if (superclass === undefined) {
        superclass = Object;
    }
    
    return class extends superclass {
        constructor(...args) {
            super(args);

            this.stepProgress = 0.0;    
            this.speed = 2.0;
            this.isPlaying = false;
            this.onStepEndCallback = null;
        }

        setSpeed(speed) {
            this.speed = speed;
        }

        setOnStepEndCallback(onStepEndCallback) {
            this.onStepEndCallback = onStepEndCallback;
        }

        play() {
            this.isPlaying = true;
        }

        reset() {
            this.stepProgress = 0.0;
            this.isPlaying = false;
        }

        update(deltaTime) {
            if (this.isPlaying) {
                let step = deltaTime * this.speed;
                this.stepProgress += step;

                if (this.stepProgress > 1.0) {
                    this.stepProgress = 0.0;

                    this.onStepEnd();
                }
            }
        }

        onStepEnd() {
            if (this.onStepEndCallback) {
                this.onStepEndCallback();
            }
        }
    };
};
