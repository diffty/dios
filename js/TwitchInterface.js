class TwitchInterface {
    constructor(clientId) {
        this.clientId = clientId;

        this.watchUserId = -1; 
        this.watchUserFollowers = [];
    }

    getUsersFromName(userNameList, callback) {
        $.ajax({
            type: "GET",
            url: "https://api.twitch.tv/helix/users?" + userNameList.map(uid => "login=" + uid.toString()).join(","),
            dataType: "json",
            headers: {  
                "Authorization": "Bearer ar4mit1ahvlil3tx10fawz0qynbdo0",
                "Client-ID": "gp762nuuoqcoxypju8c569th9wz7q5", //this.clientId,
            },
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
            headers:  {  
                "Authorization": "Bearer ar4mit1ahvlil3tx10fawz0qynbdo0",
                "Client-ID": "gp762nuuoqcoxypju8c569th9wz7q5", //this.clientId,
            },
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
            headers:  {
                "Authorization": "Bearer ar4mit1ahvlil3tx10fawz0qynbdo0",
                "Client-ID": "gp762nuuoqcoxypju8c569th9wz7q5", //this.clientId,
            },
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
            headers:  {
                "Authorization": "Bearer ar4mit1ahvlil3tx10fawz0qynbdo0",
                "Client-ID": "gp762nuuoqcoxypju8c569th9wz7q5", //this.clientId,
            },
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
                if (this.watchUserFollowers[0].from_id != followersList[0].from_id) {
                    this.watchUserFollowers = followersList;
                    onNewFollowerCallback(followersList[0]);
                }
            }
        });
    }
}
