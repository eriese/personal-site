import {TweenMax} from "gsap";

const animLength = 0.3;

const defaultAnimatedBindings = {
	pageInfo: "<",
	parentInd: "<",
	parentMargin: "<"
}

export {animLength, defaultAnimatedBindings};

let getPosDif = (el) => {
	let elOff = el.find(".info").position();
	let width = angular.element(window).width();

	let top = -elOff.top;
	let left = (width/2 - elOff.left) * 100 / width + "%";

	return {top, left};
}

export default class AnimatedController {
	constructor($element, $timeout, rootTlService) {
		this._$element = $element;
		this._$timeout = $timeout;
		this._rootTlService = rootTlService;
	}

	$onInit() {
		this._$element.hide()
	}

	$postLink() {
		this._$timeout(() => {
			this._$element.show();
			this.generateTl();
			this.centerParent();
			this.doAnim();

			this._rootTlService.addToTl(this.tl);
		})
	}

	generateTl() {
		this.tl = new TimelineMax();
		this.tl.add("beginning");
	}

	centerParent() {
		// first blow up the parent circle and center it
		if (this.parentInd !== undefined) {
			this.tl.add("centerParent");
			this.tl.to(angular.element("#page-container"), animLength, getPosDif(this.parentInd), "centerParent");
			this.tl.set(this._$element.parent(), {'margin-left': this.parentMargin}, "centerParent");
		}

		this.tl.add("afterCenterParent");
		this.tl.from(this._$element.find(">.top"), animLength, {height: 0, ease: Linear.easeIn}, "afterCenterParent");
	}

	doAnim() {}
}
