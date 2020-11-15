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
            this.animDuration = 2.0;
            this.isPlaying = false;
            this.onAnimationEndCallback = null;
            this.isLooped = false;
        }

        setLooped(isLooped) {
            this.isLooped = isLooped;
        }

        setAnimDuration(animDuration) {
            this.animDuration = animDuration;
        }

        setOnAnimationEndCallback(onAnimationEndCallback) {
            this.onAnimationEndCallback = onAnimationEndCallback;
        }

        play() {
            this.isPlaying = true;
        }

        reset() {
            this.animProgress = 0.0;
            this.isPlaying = false;
        }

        update(deltaTime) {
            if (this.isPlaying) {
                let step = deltaTime / this.animDuration;
                this.animProgress += step;

                if (this.animProgress > 1.0) {
                    if (this.isLooped) {
                        this.animProgress = 0.0;
                    }
                    else {
                        this.animProgress = 1.0;
                        this.isPlaying = false;

                        this.onAnimationEnd();
                    }
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
