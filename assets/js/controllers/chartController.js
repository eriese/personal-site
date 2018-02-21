import {TimelineMax} from "gsap";
const animLength = 0.4;

let animIn = (ctrl) => {
	ctrl._$element.show();

	let nextCols = ctrl._$element.find(".next-col");

	// first, hide all the borders
	let tl = new TimelineMax({onComplete: ()=>{ctrl.setup = true; ctrl._$scope.$apply()}});
	tl.set(nextCols.find(".grid-container>div"), {'border-width': "0px 0px 0px 0px"})

	// set a marker for the beginning of the timeline
	let curMarker = "first";

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

		// simultaneously reset border widths for these objects
		tl.set(curCols.find(".grid-container>div"), {clearProps: "border-width"}, curMarker);
		// and scroll out the width
		tl.from(curCols.find(".grid-container"), animLength, {width: "0%", ease: Linear.easeIn}, curMarker);

		// if it's not the middle one
		if (!isMiddle) {
			// we're going to be manipulating the outside half
			let outside = curCols.find(".outside-half");
			// also simultaneously set the outside half of the grid lines to have no width so that only the inside half scrolls out
			tl.set(outside, {width: "0%"}, curMarker);

			// make a new marker for after all that simultaneous action
			curMarker = `pos${i}`;
			// restore the width of the outside half at the new marker, to happen at the same time as the height
			tl.to(outside, animLength, {width: "50%", ease: Linear.easeIn}, curMarker);
		}

		// scroll out the height at whatever marker is current
		tl.from(curCols.find(".grid-container"), animLength, {height: 2}, curMarker);

		// make a new marker to be used by the last actions and the first actions of the next set
		curMarker = `pos${i}b`
		// fade in the info simultaenously with the beginning of the next set
		tl.from(curCols.find(".info"), animLength, {opacity: 0}, curMarker);
	}
}


const chartComponent = {
	bindings: {
		$transition$: '<'
	},
	templateUrl: "_chart.html",
	controller: class ChartController {
		/*@ngInject*/
		constructor($scope, $stateParams, $state, $element, $timeout) {
			this._$stateParams = $stateParams;
			this._$state = $state;
			this._$element = $element;
			this._$timeout = $timeout;
			this._$scope = $scope;
		}

		$onInit() {
			this._$element.hide();
			this.setup = false;

			this.nexts = this._$state.current.params.nexts;

			let numNexts = this.nexts.length;
			this.itemWidth = `${100/numNexts}%`;
			this.containerWidth = `${Math.min(25*numNexts, 100)}%`;

			this.middleInd = Math.floor(numNexts / 2);
			this.lastInd = numNexts - 1;
			this.isEven = numNexts % 2 === 0;
		}

		getTarget(next) {
			return next.sref ? "" : "_blank";
		}

		textAlign(index) {
			let cls = "align-";
			if (index < this.middleInd) {cls+="right";}
			else if (index > this.middleInd || this.isEven) {cls+="left";}
			else { cls+="center";}

			if (index == 0 || index == this.lastInd) {cls+=" end";}

			return cls;
		}

		getHref(next) {
			if (!this.setup) {return;}
			return next.sref ? this._$state.href(next.sref) : next.href;
		}

		$postLink() {
			this._$timeout(() => {animIn(this)});
		}
	}
}

export default chartComponent;
