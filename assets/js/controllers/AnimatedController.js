import {TweenMax} from "gsap";

const animLength = 0.3

const defaultAnimatedBindings = {
	pageInfo: "<",
	parentInd: "<",
	parentCtrl: "<",
	parentMargin: "<",
	$transition$: "<"
}

export {animLength, defaultAnimatedBindings};

let getPosDifs = (el) => {
	let getPosDifTop = () => {
		if (!el) {return 0;}

		let elOff = el.find(".info").position();
		return -elOff.top;
	}

	let getPosDifLeft = () => {
		if (!el) {return 0;}
		let elOff = el.find(".info").position();
		let elWidth = el.width();
		let contWidth = angular.element("#page-container").width();
		return (contWidth/2 - (elOff.left + elWidth/2)) * 100 / contWidth + "%";
	}

	return {top: getPosDifTop, left: getPosDifLeft}
}

export default class AnimatedController {
	constructor($element, $timeout, rootTlService, isMobileWidth) {
		this._$element = $element;
		this._$timeout = $timeout;
		this._rootTlService = rootTlService;
		this._isMobileWidth = isMobileWidth;
	}

	$onInit() {
		this._$element.hide();
	}

	$postLink() {
		this._$timeout(() => {
			this._$element.show();
			this.generateTl();
			this.centerParent();
			this.doAnim(this._isMobileWidth());

			this._rootTlService.addToTl(this.tl);
		})
	}

	generateTl() {
		this.tl = new TimelineMax();
		this.tl.add("beginning");
	}

	/**
	* Add tweens to the timeline for centering the parent
	* @param parentTl the timeline the tweens will be added to
	* @param posDif the position the tween should end up at
	* @param isDummy is parentTl a dummy timeline?
	* @param dummyTl the dummy timeline to give to the callback on a non-dummy (can be null)
	*/
	makeParentTl(parentTl, posDif, isDummy, dummyTl) {
		// if there is no timeline, don't do anything
		if (!parentTl) {return;}

		// the timeline position, element the tween is acting up, and the tween length
		let pos ="centerParent";
		let tlEl = angular.element("#page-container");
		let len = animLength * 2;

		// add the marker
		parentTl.add(pos);

		// if this is the dummy
		if (isDummy) {
			let grandParent = getPosDif(this.parentCtrl.parentInd);
			// tween from the grandparent centered to the parent centered
			parentTl.fromTo(tlEl, len, grandParent, posDif, pos);
			// skip to the end
			parentTl.progress(1);
		} else {
			// tween from wherever we are to the parent being centered
			parentTl.to(tlEl, len, posDif, pos);
			// once this is complete, add tweens to the dummy if it exists
			parentTl.eventCallback("onComplete", this.makeParentTl, [dummyTl, posDif, true], this);
		}
	}

	centerParent() {
		if (this.parentInd !== undefined) {
			// make the timeline for centering the parent
			let pTl = new TimelineMax();
			// make a variable for a dummy timeline as well
			let dTl = null;

			// if it's transitioning from a sibling, we need to put a fake timeline in the sequence for reversing purposes
			if (this.pageInfo.fromSib) {
				dTl = new TimelineMax();
				this._rootTlService.addToTl(dTl);
			}
			// otherwise put the real timeline in
			else {
				this._rootTlService.addToTl(pTl);
			}

			// add tweens to the timeline
			let posDif = getPosDifs(this.parentInd);
			this.makeParentTl(pTl, posDif, false, dTl);

			// properly position the view
			this.tl.set(this._$element.parent(), {'margin-left': this.parentMargin}, "beginning");
			// add an active class to the parent
			this.tl.set(this.parentInd.parent(), {className: "+=active"}, "beginning");
			this.tl.set(this.parentInd.parent().siblings(), {className: "+=inactive"}, "beginning");
			// add a background to the parent
			this.tl.to(this.parentInd.find(".bg"), 0.01, {opacity: 1}, "afterCenterParent");
			this.tl.to(this.parentInd.find(".text"), 0.01, {color: "black", "font-weight": "bold"})
		}

		this.tl.from(this._$element.find(">.top"), animLength, {height: 0, ease: Linear.easeIn}, "afterCenterParent");
	}

	doAnim(isMobile) {}
}
