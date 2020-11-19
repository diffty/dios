class TwitchFollowsComponent extends Animable(BaseBufferComponent) {
    constructor(twitchInterface, userId, tickerSize) {
        super();

        this.userId = userId;

        this.twitchInterface = twitchInterface;
        
        this.followers = [];
        this.currentFollower = null;

        this.currUserNum = 0;
        this.tickerSize = tickerSize;
        
        this.duration = 10000;

        this.stayTime = 2000;
        this.nbItemsToShow = 3;
        this.singleUserTime = this.duration / this.nbItemsToShow;
        this.transitionTime = (this.duration / this.nbItemsToShow) - this.stayTime;
        this.currUserTime = 0.;

        this.updateFollows();
    }

    updateFollows() {
        this.twitchInterface.getFollowers(
            this.userId,
            (followersList) => {
                this.twitchInterface.getUsersFromId(
                    followersList.map(f => f.from_id),
                    (userList) => {
                        let buffer = "";
                        this.followers = [];

                        for (var u in userList) {
                            let user = userList[u];
                            let followerInfo = {
                                name: user.display_name,
                                size: user.display_name.length,
                                bufferSize: Math.max(user.display_name.length + 1, this.tickerSize),
                                bufferPos: buffer.length,
                            }
                            this.followers.push(followerInfo)
                            buffer += followerInfo.name + " ".repeat(followerInfo.bufferSize - followerInfo.size);
                        }

                        this.currentFollower = this.followers[0];

                        this.setBuffer(buffer);
                    }
                );
            }
        )
    }

    update(deltaTime) {

    }

    draw(deltaTime) {
        if (this.currentFollower) {
            this.currUserTime += deltaTime * 1000;

            if (this.currUserTime > this.singleUserTime) {
                this.currUserNum++;

                if (this.currUserNum >= this.followers.length) {
                    this.currUserNum = 0;
                }
                this.currUserTime = 0;

                this.currentFollower = this.followers[this.currUserNum];

                this.buffer = this.rawBuffer.slice(
                    this.currentFollower.bufferPos,
                    this.currentFollower.bufferPos + this.tickerSize
                );
            }
            else if (this.currUserTime > this.stayTime) {
                let transitionProgress = (this.currUserTime - this.stayTime) / this.transitionTime;
                
                let posStart = this.currentFollower.bufferPos + transitionProgress * this.currentFollower.bufferSize;
                
                this.buffer = this.rawBuffer.slice(
                    posStart,
                    posStart + this.tickerSize
                );
            }
        }

        this.applyEffects();
    }

    onStepEnd() {
        super.onStepEnd();
        this.currPos++;
    }
}