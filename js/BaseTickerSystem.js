const ECycleMode = {
	Forward: "forward",
	Backward: "backward",
	NoCycle: "nocycle"
}


class BaseTickerSystem {
	constructor(tickerSize) {
		this.componentsStack = [];
        this.transitionsStack = [];
        
        this.defaultComponent = new TextBufferComponent("");
        this.defaultTransition = new SimpleTransitionComponent(2);

		this.defaultComponentDuration = 3000.;  // milliseconds
		this.defaultTransitionDuration = 3000.;

		this.currentComponent = this.defaultComponent;
		this.currentTransition = null;

 		this.cycleMode = ECycleMode.Forward;

        this.lastComponentSwitchTime = -1;
        
        this.tickerSize = tickerSize;
		 
		this.buffer = "";
	}

	getBuffer() {
		return this.buffer;
	}

    // Que faire si on switch depuis rien ? Transition ou pas transition ?
	switchToComponent(nextComponent, transition) {
        //console.log("<i> Switching to component", nextComponent);

        if (this.currentComponent) {
            if (!transition) {
                transition = this.popNextTransition();
            }
            
            transition.onTransitionEndCallback = () => { this.onTransitionEnd() };

            this.currentTransition = transition;
            this.currentTransition.setComponents(this.currentComponent, nextComponent);
            this.currentTransition.play();
        }
        else {
            this.currentComponent = nextComponent;
            this.lastComponentSwitchTime = Date.now();
        }
    }
    
	switchToNextComponent() {
        let nextComponent = this.popNextComponent();
        this.switchToComponent(nextComponent)
	}

	addComponent(newComponent) {
        this.componentsStack.push(newComponent);
        if (this.componentsStack.length == 1) {
            this.switchToComponent(this.componentsStack[0]);
        }
	}

	popNextComponent() {
		// TODO: tester si component à usage unique, auquel cas faut pas le remettre
		// au cul de la pile
		let nextComponent = this.componentsStack.shift();
		this.componentsStack.push(nextComponent);
		return nextComponent;
	}

	popNextTransition() {
        if (this.transitionsStack.length > 0) {
            let nextTransition = this.transitionsStack.shift();
            if (!nextTransition.isOneShot) {
                this.transitionsStack.push(nextTransition);
            }
            return nextTransition;
        }
        else {
            return this.defaultTransition;
        }
	}

    onTransitionEnd() {
        this.currentComponent = this.currentTransition.componentB;
        this.currentTransition.reset();
        this.currentTransition = null;
        this.lastComponentSwitchTime = Date.now();
        this.currentComponent.onActive();
    }

	isComponentTimeOver() {
		let componentDuration = 0;

		if (!this.currentComponent) {
			return null;
		}

		if (!this.currentComponent.duration) {
			componentDuration = this.defaultComponentDuration;
		}
		else {
			componentDuration = this.currentComponent.duration;
		}

		return (Date.now() - this.lastComponentSwitchTime) > componentDuration;
	}

	update(deltaTime) {
		if ((!this.currentTransition || !this.currentTransition.isPlaying) && this.isComponentTimeOver()) {
            //console.log("<i> Auto-switching to next component");
			this.switchToNextComponent();
        }
        
        if (this.currentTransition) {
            this.currentTransition.update(deltaTime);
        }

        if (this.currentComponent) {
            this.currentComponent.update(deltaTime);
        }
	}

    draw(deltaTime) {
        if (this.currentTransition) {
            this.currentTransition.draw(deltaTime);
            this.buffer = this.currentTransition.getBuffer();
        }
        else if (this.currentComponent) {
            this.currentComponent.draw(deltaTime);
            this.buffer = this.currentComponent.getBuffer();
        }
	}
}
