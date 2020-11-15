const TWITCH_USER_ID = 27497503; // 64670756: kitcate / 27497503: diffty
const TWITCH_CLIENT_ID = "ulv1v7toq6fwfps9pmcrnlg6r6t7ex";

let then = 0;

let twitchIfc = new TwitchInterface(TWITCH_CLIENT_ID);
console.log(twitchIfc.getUsersFromName(["diffty"], (res) => { console.log(res); }));

const tickerSystemInstance = new BaseTickerSystem(16)
//Object.freeze(tickerSystemInstance);
//export default tickerSystemInstance;

let followsTitleComponent = new TextBufferComponent("- Last Follows -");
let followsComponent = new TwitchFollowsComponent(TWITCH_USER_ID, TWITCH_CLIENT_ID, tickerSystemInstance.tickerSize);
let nowPlayingTitleComponent = new TextBufferComponent("- Now Playing -");
let nowPlayingComponent = new TextBufferComponent("XIII");
let viewersComponent = new TwitchViewersComponent(TWITCH_USER_ID, TWITCH_CLIENT_ID);

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
