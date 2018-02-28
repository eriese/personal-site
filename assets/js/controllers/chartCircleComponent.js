import {TimelineMax} from "gsap";

let getTextAlign = (ctrl) => {
	let cls = "align-";
	if (ctrl.index < ctrl.chartCtrl.middleInd) {cls+="right";}
	else if (ctrl.index > ctrl.chartCtrl.middleInd || ctrl.chartCtrl.isEven) {cls+="left";}
	else { cls+="center";}

	if (ctrl.index == 0 || ctrl.index == ctrl.chartCtrl.lastInd) {cls+=" end";}
	return cls;
}

const chartCircleComponent = {
	bindings: {
		info: "<",
		index: "<",
		onClick: "&"
	},
	require: {
		chartCtrl: "^^chartComponent"
	},
	templateUrl: "_chart-circle.html",
	controller: class ChartCircleController {
		constructor($state, $element, $scope) {
			this._$state = $state;
			this._$element = $element;
			this._$scope = $scope;

			this.setup = false;
		}

		getHref(next) {
			if (!this.chartCtrl.setup) {return;}
			return this.info.sref ? this._$state.href(this.info.sref) : this.info.href;
		}

		$onInit() {
			let sref = this.info.sref;
			this.target = sref ? "" : "_blank";
			this.textAlign = getTextAlign(this);
			// this.viewClass = sref ? sref.split(".").join("") : "";

			if (sref && this._$state.includes(sref)) {
				this.onClick({element: this._$element, index: this.index});
			}
		}

		click() {
			this.onClick({element: this._$element, index: this.index});
		}

		// onClick($event) {
		// 	// if (this.target) {
		// 	// 	return;
		// 	// }

		// 	// $event.preventDefault();
		// 	// let infEl = this._$element.find(".info");
		// 	// let infPos = infEl.position();
		// 	// infPos.position = "absolute";
		// 	// infPos.width = infEl.width();
		// 	// infEl.css(infPos);

		// 	// angular.element(".name").after(infEl);
		// 	// infEl.addClass("name");

		// }
	}

};

export default chartCircleComponent;

/*
const animLength = 0.4;


let animIn = (ctrl) => {
	ctrl._$element.show();
	let $el = ctrl.$element;

	let isMiddle = ctrl._$scope.$index == ctrl.chartCtrl.middleInd && !ctrl.chartCtrl.isEven;

	let absInd = Math.abs(ctrl.$scope.$index - ctrl.chartCtrl.middleInd);

	// let nextCols = ctrl._$element.find(".next-col");

	// first, hide all the borders
	let tl = new TimelineMax({
		delay: absInd * animLength;
		onComplete: ()=>{ctrl.setup = true; ctrl._$scope.$apply()}
	});
	tl.set($el.find(".grid-container>div"), {'border-width': "0px 0px 0px 0px"})

	// set a marker for the beginning of the timeline
	let curMarker = "first";

	// // start in the middle of the array of next objects
	// for (let i = ctrl.middleInd; i < ctrl.nexts.length; i++) {
	// 	// get the column at this index
	// 	let curCols = angular.element(nextCols.get(i));
		// it's the middle if they're the same index


		// if it's not the middle, add the column at the symmetrical index to the DOM objects being animated
		// if (!isMiddle) {
		// 	// get the symmetrical index on the other side of the center of the array
		// 	let symmInd = ctrl.lastInd - i;
		// 	curCols = curCols.add(nextCols.get(symmInd));
		// }

		// simultaneously reset border widths for these objects
		tl.set($el.find(".grid-container>div"), {clearProps: "border-width"}, curMarker);
		// and scroll out the width
		tl.from($el.find(".grid-container"), animLength, {width: "0%", ease: Linear.easeIn}, curMarker);

		// if it's not the middle one
		if (!isMiddle) {
			// we're going to be manipulating the outside half
			let outside = $el.find(".outside-half");
			// also simultaneously set the outside half of the grid lines to have no width so that only the inside half scrolls out
			tl.set(outside, {width: "0%"}, curMarker);

			// make a new marker for after all that simultaneous action
			curMarker = `pos${i}`;
			// restore the width of the outside half at the new marker, to happen at the same time as the height
			tl.to(outside, animLength, {width: "50%", ease: Linear.easeIn}, curMarker);
		}

		// scroll out the height at whatever marker is current
		tl.from($el.find(".grid-container"), animLength, {height: 2}, curMarker);

		// make a new marker to be used by the last actions and the first actions of the next set
		curMarker = `pos${i}b`
		// fade in the info simultaenously with the beginning of the next set
		tl.from($el.find(".info"), animLength, {opacity: 0}, curMarker);
	}
}
*/
