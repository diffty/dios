class BaseBufferComponent {
    constructor() {
        this.rawBuffer = "";
        this.buffer = "";
        this.effects = [];
    }

    setRawBuffer(newBuffer) {
        this.rawBuffer = newBuffer;
        this.buffer = newBuffer;
    }

    getBuffer() {
        return this.buffer;
    }

    addEffect(effect) {
        this.effects.push(effect);
    }

    applyEffects() {
        for (var i in this.effects) {
            this.buffer = this.effects[i].applyEffect(this.buffer);
        }
    }
    
    update(deltaTime) {
        for (var i in this.effects) {
            this.effects[i].update(deltaTime);
        }
    }

    draw(deltaTime) {
        
    }
}
