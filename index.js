let then = 0;

var tickerSystem = new BaseTickerSystem()

var textComponent1 = new TextTickerComponent("TestText");
var textComponent2 = new TextTickerComponent("Kikiki");
var textComponent3 = new TextTickerComponent("Kakaka");

tickerSystem.transitionsStack.push(new CharClearTransitionComponent(1))

tickerSystem.addComponent(textComponent1);
tickerSystem.addComponent(textComponent2);
tickerSystem.addComponent(textComponent3);

var outputTest = document.getElementById("output");


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
