// mixins implementation reference took from 
// https://dev.to/open-wc/using-javascript-mixins-the-good-parts-4l60
// https://www.codeheroes.fr/2017/12/23/javascript-heritage-multiple/

let Animable = function(superclass) {
    if (superclass === undefined) {
        superclass = Object;
    }
    
    return class extends superclass {
        constructor(...args) {
            super(args);

            this.animProgress = 0.0;    
            this.duration = 2.0;
            this.isPlaying = false;
            this.onAnimationEndCallback = null;
        }

        setDuration(duration) {
            this.duration = duration;
        }

        setOnAnimationEndCallback(onAnimationEndCallback) {
            this.onAnimationEndCallback = onAnimationEndCallback;
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

        update(deltaTime) {
            if (this.isPlaying) {
                var step = deltaTime / this.duration;
                this.animProgress += step;


                if (this.animProgress > 1.0) {
                    this.animProgress = 1.0;
                    this.isPlaying = false;

                    this.onAnimationEnd();
                }
            }
        }

        onAnimationEnd() {
            if (this.onAnimationEndCallback) {
                this.onAnimationEndCallback();
            }
        }

    };
};
