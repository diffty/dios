// Liste des topics dispo là : https://dev.twitch.tv/docs/pubsub#topics
var TOPIC_TO_LISTEN = "channel-points-channel-v1.27497503"


// Source: https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
function nonce(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


class TwitchPubSubInterface {
    constructor(auth_token, onmessage_callback) {
        this.auth_token = auth_token;
        this.onmessage_callback = onmessage_callback;
        this.heartbeatInterval = 1000 * 60; //ms between PING's
        this.reconnectInterval = 1000 * 3; //ms to wait before reconnect

        this.ws = null;
    }

    heartbeat() {
        let message = {
            type: 'PING'
        };
        console.log('SENT: ' + JSON.stringify(message));
        this.ws.send(JSON.stringify(message));
    }

    listen(topic) {
        let message = {
            type: 'LISTEN',
            nonce: nonce(15),
            data: {
                topics: [topic],
                auth_token: this.auth_token
            }
        };
        console.log('SENT: ' + JSON.stringify(message));
        this.ws.send(JSON.stringify(message));
    }

    connect() {
        this.ws = new WebSocket('wss://pubsub-edge.twitch.tv');

        this.ws.onopen = (event) => {
            console.log('INFO: Socket Opened');
            this.heartbeat();
            this.heartbeatHandle = setInterval(() => { this.heartbeat(); }, this.heartbeatInterval);
            this.listen(TOPIC_TO_LISTEN);
        };

        this.ws.onerror = (error) => {
            console.log('ERR:  ' + JSON.stringify(error));
        };

        this.ws.onmessage = (event) => {
            let message = JSON.parse(event.data);
            console.log('RECV: ' + JSON.stringify(message));
            
            if (this.onmessage_callback) {
                this.onmessage_callback(message);
            }

            if (message.type == 'RECONNECT') {
                console.log('INFO: Reconnecting...');
                setTimeout(() => { this.connect(); }, this.reconnectInterval);
            }
        };
        
        this.ws.onclose = function() {
            console.log('INFO: Socket Closed');
            clearInterval(this.heartbeatHandle);
            console.log('INFO: Reconnecting...');
            setTimeout(() => { this.connect(); }, this.reconnectInterval);
        };
    }
}
