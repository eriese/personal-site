import {TweenMax} from "gsap";

const animLength = 0.3

const defaultAnimatedBindings = {
	pageInfo: "<",
	pageState: "<",
	parentCtrl: "<",
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

let getParentProps = (ctrl) => {
	// if it doesn't have a parent, skip this part
	if (ctrl.parentCtrl == undefined) {return;}

	// find the parent element, the node that linked to this page
	let useUrl = ctrl._$state.href(ctrl.pageState);
	ctrl.parentInd = angular.element(`chart-component a[href='${useUrl}']`).parents("chart-circle");

	// get the index of the parent element
	let index = ctrl.parentInd.parent().prevAll().length;

	// find the offset
	let pCtrl = ctrl.parentCtrl;
	let numShift = pCtrl.itemWidth * (index - pCtrl.middleInd);
	if (pCtrl.isEven) numShift *= 0.5;
	ctrl.parentMargin = pCtrl.perc(numShift * pCtrl.containerWidth  / 100);
}

export default class AnimatedController {
	constructor($element, $timeout, rootTlService, isMobileWidth, $state) {
		this._$element = $element;
		this._$timeout = $timeout;
		this._rootTlService = rootTlService;
		this._isMobileWidth = isMobileWidth;
		this._$state = $state;
	}

	$onInit() {
		this._$element.hide();
	}

	$postLink() {
		this._$timeout(() => {
			getParentProps(this);

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

		// add a dummy beginning marker
		parentTl.add("dummyBeginning")
		// add the real beginning slightly later so that nothing will be missed on reverse
		parentTl.add("beginning", "+=0.001");

		// get the parent
		let parent = this.parentInd.parent();
		// these tweens should be essentially skipped if we're not mobile
		let classAnimLength = this._isMobileWidth() ? animLength * 1.5 : 0;

		// add active class to the selected info
		parentTl.set(parent.find("div.info"), {className: "+=active"}, "beginning");
		parentTl.to(parent.find("div.info a.tint"), classAnimLength, {className: "+=active"}, "beginning");

		// add inactive class to the siblings
		parentTl.to(parent.siblings(), classAnimLength, {className: "+=inactive"}, "second");

		// the timeline position, element the tween is acting upon, and the tween length
		let pos ="centerParent";
		let tlEl = angular.element("#page-container");
		let len = animLength * 2;

		// add the marker
		parentTl.add(pos);

		// if this is the dummy
		if (isDummy) {
			let grandParent = getPosDifs(this.parentCtrl.parentInd);
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

			// add a background to the parent
			this.tl.to(this.parentInd.find(".bg"), 0.01, {opacity: 1}, "afterCenterParent");
			this.tl.to(this.parentInd.find(".text"), 0.01, {color: "black", "font-weight": "bold"})
		} else {
			console.log("No parentInd. Skipping centering parent");
		}

		this.tl.from(this._$element.find(">.top"), animLength, {height: 0, ease: Linear.easeIn}, "afterCenterParent");
	}

	doAnim(isMobile) {}
}
