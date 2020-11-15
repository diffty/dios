const TWITCH_USER_ID = 27497503; // 64670756: kitcate / 27497503: diffty
const TWITCH_CLIENT_ID = "ulv1v7toq6fwfps9pmcrnlg6r6t7ex";

let then = 0;

let twitchIfc = new TwitchInterface(TWITCH_CLIENT_ID);
console.log(twitchIfc.getUsersFromName(["diffty"], (res) => { console.log(res); }));

const tickerSystemInstance = new BaseTickerSystem()
//Object.freeze(tickerSystemInstance);
//export default tickerSystemInstance;

let textComponent1 = new TextBufferComponent("- Last Follows -");
let twitchComponent = new TwitchFollowsComponent(TWITCH_USER_ID, TWITCH_CLIENT_ID);
let textComponent2 = new TextBufferComponent("- Now Playing -");
let textComponent3 = new TextBufferComponent("XIII");
let twitchViewersComponent = new TwitchViewersComponent(TWITCH_USER_ID, TWITCH_CLIENT_ID);

textComponent1.setNextTransition(new SimpleTransitionComponent(3));

let effect = new ShiftBufferEffect();
effect.setSpeed(5);
effect.reset();
effect.play();

twitchComponent.addEffect(effect);
twitchComponent.addEffect(new ShrinkBufferEffect(16));

tickerSystemInstance.transitionsStack.push(new CharClearTransitionComponent(1));

tickerSystemInstance.addComponent(textComponent1);
tickerSystemInstance.addComponent(twitchComponent);
tickerSystemInstance.addComponent(textComponent2);
tickerSystemInstance.addComponent(textComponent3);
tickerSystemInstance.addComponent(twitchViewersComponent);

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
