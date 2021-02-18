export class TwitchInterface {
    constructor(clientId, secretId, bearerId) {
        this.clientId = clientId;
        this.secretId = secretId;
        this.bearerId = bearerId;

        this.scopeList = [
            "bits:read",
            "channel:read:redemptions",
            "channel:read:hype_train",
            "channel:read:subscriptions",
            "user:read:broadcast",
        ];

        this.watchUserId = -1; 
        this.watchUserFollowers = [];
    }

    generateHeader() {
        return {  
            "Authorization": "Bearer " + this.bearerId,
            "Client-ID": this.clientId,
        };
    }

    getAccessToken(callback) {
        $.ajax({
            type: "POST",
            url: "https://id.twitch.tv/oauth2/token?client_id=" + this.clientId + "&client_secret=" + this.secretId + "&grant_type=client_credentials&scope=" + this.scopeList.join(" "),
            dataType: "json",
            error: function(response) { console.log("Failed getAccessToken: status " + response.status) },
            success: function(response) {
                callback(response);
            }
        });
    }

    getUsersFromName(userNameList, callback) {
        $.ajax({
            type: "GET",
            url: "https://api.twitch.tv/helix/users?" + userNameList.map(uid => "login=" + uid.toString()).join(","),
            dataType: "json",
            headers: this.generateHeader(),
            error: function(response) { console.log("Failed getUsersFromName: status " + response.status) },
            success: function(response) {
                callback(response.data);
            }
        });

    }

    getUsersFromId(userIdList, callback) {
        $.ajax({
            type: "GET",
            url: "https://api.twitch.tv/helix/users?" + userIdList.map(uid => "id=" + uid.toString()).join("&"),
            dataType: "json",  
            headers: this.generateHeader(),
            error: function(response) { console.log("Failed getUsersFromId: status " + response.status) },
            success: function(response) {
                callback(response.data);
            }
        });
    }

    getFollowers(userId, callback) {
        $.ajax({
            type: "GET",
            url: "https://api.twitch.tv/helix/users/follows?to_id=" + userId.toString(),
            dataType: "json",
            headers: this.generateHeader(),
            error: function(response) { console.log("Failed getFollowers: status " + response.status) },
            success: function(response) {
                callback(response.data);
            }
        });
    }

    getViewersCount(userId, callback) {
        $.ajax({
            type: "GET",
            url: "https://api.twitch.tv/helix/streams?user_id=" + userId.toString(),
            dataType: "json",
            headers: this.generateHeader(),
            error: function(response) { console.log("Failed getViewersCount: status " + response.status) },
            success: function(response) {
                callback(response.data);
            }
        });
    }

    watchNewFollowers(userId, onNewFollowerCallback) {
        this.getFollowers(userId, (followersList) => {
            if (this.watchUserId != userId) {
                this.watchUserFollowers = followersList;
                this.watchUserId = userId;
            }
            else {
                if (this.watchUserFollowers[0].followed_at != followersList[0].followed_at) {
                    let newFollows = [];
                    let oldFollowersList = this.watchUserFollowers.map(u => u.from_name);
                    for (let i in followersList) {
                        let user = followersList[i];
                        if (!oldFollowersList.includes(user.from_name) && Date.parse(user.followed_at) > Date.parse(this.watchUserFollowers[0].followed_at)) {
                            newFollows.push(user);
                        }
                    }
                    this.watchUserFollowers = followersList;
                    if (oldFollowersList.length > 0) {
                        onNewFollowerCallback(newFollows);
                    }
                }
            }
        });
    }
}