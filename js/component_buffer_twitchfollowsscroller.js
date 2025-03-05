class TwitchFollowsScrollerComponent extends BaseBufferComponent {
    constructor(twitchInterface, userId) {
        super();

        this.userId = userId;

        this.twitchInterface = twitchInterface;
        
        this.followers = [];

        this.updateFollows();
    }

    updateFollows() {
        this.twitchInterface.getFollowers(
            this.userId,
            (followersList) => {
                this.twitchInterface.getUsersFromId(
                    followersList.map(f => f.user_id),
                    (userList) => {
                        this.followers = userList;
                        this.setBuffer(userList.map(u => u.display_name).join(" — "));
                    }
                );
            }
        )
    }

    draw(deltaTime) {
        this.buffer = this.rawBuffer;
        this.applyEffects();
    }
}