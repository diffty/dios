
const ECycleMode = {
	Forward: "forward",
	Backward: "backward",
	NoCycle: "nocycle"
}


class BaseTickerSystem {
	constructor() {
		this.componentsStack = [];
		this.transitionsStack = [];

		this.defaultComponentDuration = 3.;
		this.defaultTransitionDuration = 3.;

		this.currentComponent = null;
		this.currentTransition = null;

 		this.cycleMode = ECycleMode.Forward;

 		this.lastComponentSwitchTime = -1;
	}

	switchToComponent(component, transition) {
		if (!transition) {
			transition = this.popNextTransition();
		}

		this.lastComponentSwitchTime = Date.now();

		// TODO: SwitchToComponent routine
	}

	switchToNextComponent() {

	}

	popNextTransition() {
		var nextTransition = this.transitionsStack.shift();
		this.transitionsStack.push(nextTransition);
		return nextTransition;
	}

	popNextComponent() {
		// TODO: tester si component à usage unique, auquel cas faut pas le remettre
		// au cul de la pile
		var nextComponent = this.componentsStack.shift();
		this.componentsStack.push(nextComponent);
		return nextComponent;
	}

	isComponentTimeOver() {
		var componentDuration = 0;

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

	draw() {
		
	}

	update() {
		if (this.isComponentTimeOver) {
			this.switchToNextComponent();
		}
	}
}
