import {TimelineMax} from "gsap";
const animLength = 2;

let getPosDif = (el) => {
	let mainPos = angular.element("#page-container > div.name").position();
	let elOff = el.find(".info").offset();
	let width = angular.element(window).width();

	let top = mainPos.top - elOff.top;
	let left = (mainPos.left - elOff.left) * 100 / width + "%";

	return {top, left};
}

let animIn = (ctrl) => {
	ctrl._$element.show();

	let nextCols = ctrl._$element.find(">.chart-page>.chart-container>chart-circle>.next-col");

	let tl = new TimelineMax({onComplete: ()=>{ctrl.setup = true; ctrl._$scope.$apply()}});

	// first blow up the parent circle and center it
	if (ctrl.parentInd !== undefined) {
		// let itEl = ctrl._$element.parent().siblings(".chart-page").find(".info").get(ctrl.parentInd);
		// itEl = angular.element(itEl);
		// tl.set(ctrl._$element, {marginLeft: -(itEl.position().left)});
		// tl.to(itEl, animLength, {width: 200, 'max-width': 200}, "endEl");
		tl.to(angular.element("#page-container"), animLength, getPosDif(ctrl.parentInd), "endEl");
	}

	// first, hide all the borders
	tl.set(nextCols.find(">.grid-container>div"), {'border-width': "0px 0px 0px 0px"})
	tl.from(ctrl._$element.find(">.top"), animLength, {height: 0, ease: Linear.easeIn})

	// set a marker for the beginning of the timeline
	let curMarker = `first`;
	tl.add(curMarker);

	// start in the middle of the array of next objects
	for (let i = ctrl.middleInd; i < ctrl.nexts.length; i++) {
		// get the column at this index
		let curCols = angular.element(nextCols.get(i));
		// it's the middle if they're the same index
		let isMiddle = i == ctrl.middleInd && !ctrl.isEven;

		// if it's not the middle, add the column at the symmetrical index to the DOM objects being animated
		if (!isMiddle) {
			// get the symmetrical index on the other side of the center of the array
			let symmInd = ctrl.lastInd - i;
			curCols = curCols.add(nextCols.get(symmInd));
		}

		// // simultaneously reset border widths for these objects
		tl.set(curCols.find(">.grid-container>div"), {clearProps: "border-width"}, curMarker);
		// and scroll out the width
		tl.from(curCols.find(">.grid-container"), animLength, {width: "0%", ease: Linear.easeIn}, curMarker);

		// if it's not the middle one
		if (!isMiddle) {
			// we're going to be manipulating the outside half
			let outside = curCols.find(">.grid-container>.outside-half");
			// also simultaneously set the outside half of the grid lines to have no width so that only the inside half scrolls out
			tl.set(outside, {width: "0%"}, curMarker);

			// make a new marker for after all that simultaneous action
			curMarker = `pos${i}`;
			// restore the width of the outside half at the new marker, to happen at the same time as the height
			tl.to(outside, animLength, {width: "50%", ease: Linear.easeIn}, curMarker);
		}

		// scroll out the height at whatever marker is current
		tl.from(curCols.find(">.grid-container"), animLength, {height: 3, ease: Linear.easeIn}, curMarker);

		// make a new marker to be used by the last actions and the first actions of the next set
		curMarker = `pos${i}b`
		// fade in the info simultaneously with the beginning of the next set
		tl.from(curCols.find(">.info"), animLength, {opacity: 0}, curMarker);
	}

	return tl;
}


const chartComponent = {
	bindings: {
		$transition$: '<',
		pageInfo: "<",
		parentInd: "<"
	},
	templateUrl: "_chart.html",
	controller: class ChartController {
		/*@ngInject*/
		constructor($scope, $state, $element, $timeout, rootTlService) {
			this._$state = $state;
			this._$element = $element;
			this._$timeout = $timeout;
			this._$scope = $scope;
			this._rootTlService = rootTlService;
		}

		$onInit() {
			this._$element.hide();
			this.setup = true;

			this.nexts = this.pageInfo.nexts;
			this.color = this.pageInfo.color;

			let numNexts = this.nexts.length;
			this.itemWidth = `${100/numNexts}%`;
			this.containerWidth = `${Math.min(25*numNexts, 100)}%`;

			this.middleInd = Math.floor(numNexts / 2);
			this.lastInd = numNexts - 1;
			this.isEven = numNexts % 2 === 0;

			// for (let i=0; i < this.nexts.length; i++) {
			// 	let item = this.nexts[i];
			// 	if (item.sref && this._$state.includes(item.sref)) {
			// 		this.clicked = i;
			// 		break;
			// 	}
			// }

			console.log(this.parentInd);
		}

		$postLink() {
			this._$timeout(() => {
				this.tl = animIn(this);
				this._rootTlService.addToTl(this.tl);
			});
		}

		viewClass(next) {
			return next.sref ? next.sref.split(".").join("") : "";
		}

		setClicked(el) {
			this.clicked = el;
		}
	}
}

export default chartComponent;
