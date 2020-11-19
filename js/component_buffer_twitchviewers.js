class TwitchViewersComponent extends BaseBufferComponent {
    constructor(twitchInterface, userId) {
        super();

        this.userId = userId;
        this.twitchInterface = twitchInterface;

        this.updateViewerCount();
    }

    updateViewerCount() {
        this.twitchInterface.getViewersCount(
            this.userId,
            (streamsList) => {
                let viewersCount = 0;
                if (streamsList.length > 0) {
                    viewersCount = streamsList[0].viewer_count;
                }
                this.setBuffer("Viewers Count: " + viewersCount.toString())
            }
        )
    }

    draw(deltaTime) {
        this.buffer = this.rawBuffer;
        this.applyEffects();
    }
}
