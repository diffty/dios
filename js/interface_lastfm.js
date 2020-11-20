class LastFmInterface {
    constructor(apiKey, secretKey) {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
    }

    getRecentTrack(username, callback) {
        $.ajax({
            type: "GET",
            url: "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=" + username + "&api_key=" + this.apiKey + "&format=json",
            dataType: "json",
            error: function(response) { console.log("Failed getRecentTrack: status " + response.status) },
            success: function(response) {
                callback(response);
            }
        });
    }
}
