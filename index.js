let then = 0;

let tickerSystem = new BaseTickerSystem()

let textComponent1 = new TextBufferComponent("Danny");
let textComponent2 = new TextBufferComponent("tu es");
let textComponent3 = new TextBufferComponent("le meilleur");

let effect = new ShiftBufferEffect();
textComponent1.addEffect(effect);

effect.setDuration(3);
effect.setLooped(true);
effect.reset();
effect.play();

tickerSystem.transitionsStack.push(new CharClearTransitionComponent(1));

tickerSystem.addComponent(textComponent1);
tickerSystem.addComponent(textComponent2);
tickerSystem.addComponent(textComponent3);

let outputTest = document.getElementById("output");


function mainLoop(now) {
    now *= 0.001;
    
    const deltaTime = now - then;
    then = now;
    
    tickerSystem.update(deltaTime);
    tickerSystem.draw(deltaTime);

    outputTest.innerHTML = tickerSystem.getBuffer();

    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
