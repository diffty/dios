class BounceBufferEffect extends Animable(BaseBufferEffect) {
    constructor(sliceSize) {
        super();
        
        this.setAnimDuration(8);
        this.stayTime = 2;

        this.sliceSize = sliceSize;

        this.transitionTime = (this.animDuration - (this.stayTime * 2)) / 2;

        this.stage1Time = (this.stayTime                          ) / this.animDuration;
        this.stage2Time = (this.stayTime     + this.transitionTime) / this.animDuration;
        this.stage3Time = (this.stayTime * 2 + this.transitionTime) / this.animDuration;

        console.log(this.stage1Time, this.stage2Time, this.stage3Time)
    }

    applyEffect(buffer) {
        let overflow = Math.max(buffer.length - this.sliceSize, 0);

        if (overflow > 0) {
            let partProgress = -1;

            if (this.animProgress >= this.stage3Time) {
                partProgress = (this.animProgress - this.stage3Time) / (1.0 - this.stage3Time);
                buffer = buffer.slice(
                    Math.floor((1.0 - partProgress) * overflow),
                    Math.floor((1.0 - partProgress) * overflow + this.sliceSize+1)
                );
            }
            else if (this.animProgress >= this.stage2Time) {
                partProgress = (this.animProgress - this.stage2Time) / (this.stage3Time - this.stage2Time);
                buffer = buffer.slice(
                    Math.floor(overflow),
                    Math.floor(overflow + this.sliceSize+1)
                );
            }
            else if (this.animProgress >= this.stage1Time) {
                partProgress = (this.animProgress - this.stage1Time) / (this.stage2Time - this.stage1Time);
                buffer = buffer.slice(
                    Math.floor(partProgress * overflow),
                    Math.floor(partProgress * overflow + this.sliceSize+1)
                );
            }
            else if (this.animProgress < this.stage1Time) {
                partProgress = this.animProgress / (this.stage1Time);
            }
        }

        return buffer;
    }
}
