//const { default: tickerSystemInstance } = require("..");

class BaseBufferComponent {
    constructor() {
        this.rawBuffer = "";
        this.buffer = "";
        this.effects = [];
        this.nextTransition = null;
        this.refreshFrequency = -1;
        this.lastRefreshTime = -1;
        this.isOneShot = false;
    }

    setIsOneShot(isOneShot) {
        this.isOneShot = isOneShot;
    }

    setBuffer(newBuffer) {
        this.rawBuffer = newBuffer;
        this.buffer = newBuffer;
    }

    getBuffer() {
        return this.buffer;
    }

    doShow() {
        return true;
    }

    addEffect(effect) {
        this.effects.push(effect);
    }

    applyEffects() {
        for (let i in this.effects) {
            this.buffer = this.effects[i].applyEffect(this.buffer);
        }
    }

    setNextTransition(nextTransition) {
        this.nextTransition = nextTransition;
        this.nextTransition.setIsOneShot(true);
    }

    refresh() {
        
    }
    
    update(deltaTime) {
        for (let i in this.effects) {
            this.effects[i].update(deltaTime);
        }
    }

    draw(deltaTime) {
        
    }

    onActive() {
        if (this.nextTransition) {
            tickerSystemInstance.transitionsStack.unshift(this.nextTransition);
        }
    }
}
