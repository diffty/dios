class TwitchViewersComponent extends BaseBufferComponent {
    constructor(userId, clientId) {
        super();

        this.userId = userId;
        this.clientId = clientId;

        this.twitchInterface = new TwitchInterface(clientId);

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
