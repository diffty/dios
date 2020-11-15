class TwitchFollowsComponent extends BaseBufferComponent {
    constructor(userId, clientId) {
        super();

        this.userId = userId;
        this.clientId = clientId;

        this.twitchInterface = new TwitchInterface(clientId);

        this.updateFollows();
    }

    updateFollows() {
        this.twitchInterface.getFollowers(
            this.userId,
            (followersList) => {
                this.twitchInterface.getUsersFromId(
                    followersList.map(f => f.from_id),
                    (userList) => {
                        this.setBuffer(userList.map(u => u.display_name).join(" — "));
                    }
                );
            }
        )
    }

    draw(deltaTime) {
        this.buffer = this.rawBuffer;
        //this.applyEffects();
    }
}