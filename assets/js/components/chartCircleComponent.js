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
			this.bgClass = sref ? sref.split(".")[1] : "";
		}
	}

};

export default chartCircleComponent;
