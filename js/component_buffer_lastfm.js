class LastFmComponent extends BaseBufferComponent {
    constructor(lastFmIfc, userId) {
        super();

        this.duration = 8000;
        
        this.refreshFrequency = 20000;
        this.lastRefreshTime = -1;

        this.userId = userId;
        this.lastFmIfc = lastFmIfc;
        this.trackPlaying = null;

        this.updateLastTrack();
    }

    doShow() {
        return this.trackPlaying != null;
    }

    updateLastTrack() {
        this.trackPlaying = null;
        this.lastFmIfc.getRecentTrack(
            this.userId,
            (recentTracks) => {
                let trackList = recentTracks.recenttracks.track;
                if (trackList.length > 0) {
                    this.lastTrack = trackList[0];
                    if (this.lastTrack["@attr"] != undefined && this.lastTrack["@attr"].nowplaying) {
                        this.trackPlaying = this.lastTrack;
                    }
                }
                this.updateNowPlaying();
            }
        )
    }

    updateNowPlaying() {
        if (this.trackPlaying) {
            var artistName = this.lastTrack.artist["#text"];
            var trackName = this.lastTrack.name;
            this.setBuffer(artistName + " - " + trackName);
        }
        else {
            this.setBuffer("");
        }
    }

    refresh() {
        this.updateLastTrack();
    }

    draw(deltaTime) {
        this.buffer = this.rawBuffer;
        this.applyEffects();
    }
}
