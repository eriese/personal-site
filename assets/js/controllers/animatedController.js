import {TweenMax} from "gsap";

/** the default animation length */
const animLength = 0.3

/** default bindings for animated controllers */
const defaultAnimatedBindings = {
	pageInfo: "<",
	pageState: "<",
	parentCtrl: "<",
	$transition$: "<"
}

export {animLength, defaultAnimatedBindings};

/** get functions to find the positions to animate to based on the element position */
let getPosDifs = (el) => {
	/** get the top position */
	let getPosDifTop = () => {
		// if there's no element, return 0
		if (!el) {return 0;}

		// get the position of the info element
		let elOff = el.find(".info").position();
		return -elOff.top;
	}

	/** get the left position */
	let getPosDifLeft = () => {
		// if there's no element, return 0
		if (!el) {return 0;}

		// get the position of the info element
		let elOff = el.find(".info").position();
		// get the width of the element
		let elWidth = el.width();
		// get the width of the main page container
		let contWidth = angular.element("#page-container").width();

		// get the position of the center of the element
		let elCenter = elOff.left + elWidth/2;
		// the left position is half of the main container width minus the element center position as a percentage of the main container width
		return (contWidth/2 - elCenter) * 100 / contWidth + "%";
	}

	return {top: getPosDifTop, left: getPosDifLeft}
}

/** get the properties of the parent */
let getParentProps = (ctrl) => {
	// if it doesn't have a parent, skip this part
	if (ctrl.parentCtrl == undefined) {return;}

	// find the parent element, the node that linked to this page
	let useUrl = ctrl._$state.href(ctrl.pageState);
	ctrl.parentInd = angular.element(`chart-component a[href='${useUrl}']`).parents("chart-circle");

	// get the index of the parent element among its siblings
	let index = ctrl.parentInd.parent().prevAll().length;

	// find the offset
	let pCtrl = ctrl.parentCtrl;
	let numShift = pCtrl.itemWidth * (index - pCtrl.middleInd);
	if (pCtrl.isEven) numShift *= 0.5;
	ctrl.parentMargin = pCtrl.perc(numShift * pCtrl.containerWidth  / 100);
}

/** Controller class for animated components */
export default class AnimatedController {
	constructor($element, $timeout, rootTlService, isMobileWidth, $state) {
		// add injected services, etc. to the controller
		this._$element = $element;
		this._$timeout = $timeout;
		this._rootTlService = rootTlService;
		this._isMobileWidth = isMobileWidth;
		this._$state = $state;
	}

	$onInit() {
		// immediately hide the element
		this._$element.hide();
	}

	$postLink() {
		// once everything's linked up and rendered
		this._$timeout(() => {
			// get the parent properties
			getParentProps(this);

			// show the element
			this._$element.show();
			// generate the timeline
			this.generateTl();
			// center the parent
			this.centerParent();
			// do the component-specific animations
			this.doAnim(this._isMobileWidth());

			// add the timeline to the timeline service
			this._rootTlService.addToTl(this.tl);
		})
	}

	generateTl() {
		// make a new timeline and add the beginning marker
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

	/** center the parent node of this component */
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

	/** override this to add component-specific animations */
	doAnim(isMobile) {}
}
