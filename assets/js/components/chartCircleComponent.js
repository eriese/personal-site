/** get text alignment for the circle's chart lines */
let getTextAlign = (ctrl) => {
	let cls = "align-";
	// if the controller is in the first half of the list, align right
	if (ctrl.index < ctrl.chartCtrl.middleInd) {cls+="right";}
	// if it's in the second half, align left
	else if (ctrl.index > ctrl.chartCtrl.middleInd || ctrl.chartCtrl.isEven) {cls+="left";}
	// if it's the middle, align center
	else { cls+="center";}

	// add an end class if it's first or last
	if (ctrl.index == 0 || ctrl.index == ctrl.chartCtrl.lastInd) {cls+=" end";}
	return cls;
}

/** component for a chart circle and the lines leading to it */
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
		}

		$onInit() {
			// if it has an sref, it links internally, otherwise links should open in a new window
			let sref = this.info.sref;
			this.target = sref ? "" : "_blank";

			// get the text alignment
			this.textAlign = getTextAlign(this);
			// the background class is the oldest ancestor of the current state besides the base state
			this.bgClass = sref ? sref.split(".")[1] : "";
		}

		/** get the href for the node link */
		getHref(next) {
			return this.info.sref ? this._$state.href(this.info.sref) : this.info.href;
		}
	}

};

export default chartCircleComponent;
