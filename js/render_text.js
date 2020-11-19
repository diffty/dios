import config from '../config.js'


let then = 0;

let twitchIfc = new TwitchInterface(config.TWITCH_CLIENT_ID, config.TWITCH_SECRET_ID, config.TWITCH_BEARER_TOKEN);
//console.log(twitchIfc.getUsersFromName(["diffty"], (res) => { console.log(res); }));

const tickerSystemInstance = new BaseTickerSystem(16)
//Object.freeze(tickerSystemInstance);
//export default tickerSystemInstance;

let followsTitleComponent = new TextBufferComponent("- Last Follows -");
let followsComponent = new TwitchFollowsComponent(twitchIfc, config.TWITCH_USER_ID, tickerSystemInstance.tickerSize);
let nowPlayingTitleComponent = new TextBufferComponent("- Now Playing -");
let nowPlayingComponent = new TextBufferComponent(config.NOW_PLAYING_TEXT);
let viewersComponent = new TwitchViewersComponent(twitchIfc, config.TWITCH_USER_ID);

//followsTitleComponent.setNextTransition(new SimpleTransitionComponent(3));

//let effect = new ShiftBufferEffect();
//effect.setSpeed(3);
//effect.reset();
//effect.play();

//followsComponent.addEffect(effect);
followsComponent.addEffect(new ShrinkBufferEffect(tickerSystemInstance.tickerSize));

tickerSystemInstance.transitionsStack.push(new CharClearTransitionComponent(1));

tickerSystemInstance.addComponent(followsTitleComponent);
tickerSystemInstance.addComponent(followsComponent);
tickerSystemInstance.addComponent(nowPlayingTitleComponent);
tickerSystemInstance.addComponent(nowPlayingComponent);
tickerSystemInstance.addComponent(viewersComponent);

let outputTest = document.getElementById("output");


const mainLoop = (now) => {
    now *= 0.001;
    
    const deltaTime = now - then;
    then = now;
    
    tickerSystemInstance.update(deltaTime);
    tickerSystemInstance.draw(deltaTime);

    outputTest.innerHTML = tickerSystemInstance.getBuffer();

    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
