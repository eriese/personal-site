import {TimelineMax} from "gsap";

export default class ChartController {
	/*@ngInject*/
	constructor($scope, $stateParams, $state, $element, $timeout) {
		$scope.nexts = $state.current.params.nexts;

    	$scope.getHref = (next) =>
    		next.sref ? $state.href(next.sref) : next.href;

    	$scope.getTarget = (next) => next.sref ? "" : "_blank";

    	let numNexts = $scope.nexts.length;
    	$scope.itemWidth = `${100/numNexts}%`;
    	$scope.containerWidth = `${Math.min(25*numNexts, 100)}%`;

    	let middleInd = Math.ceil(numNexts / 2) - 1;
    	let isEven = numNexts % 2 === 0;
    	$scope.textAlign = (index) => {
    		let cls = "align-";
    		if (index > middleInd) {cls+="left";}
    		else if (index < middleInd || isEven) {cls+="right";}
    		else { cls+="center";}

    		if (index == 0 || index == numNexts - 1) {cls+=" end";}

    		return cls;
    	}

    	let animIn = () => {
    		$element.show();

			let animLength = 0.3;
			let tl = new TimelineMax();
    		let nextCols = $element.find(".next-col");
    		tl.set(nextCols.find(".grid-container>div"), {'border-width': "0px 0px 0px 0px"})

			if (!isEven) {
				let firstCol = angular.element(nextCols.get(middleInd));
				tl.set(firstCol.find(".grid-container .right-half"), {clearProps: "border-width"});
				tl.from(firstCol.find(".grid-container"), animLength, {height: 2});
				tl.from(firstCol.find(".info"), animLength, {opacity: 0});
				tl.set(firstCol.find(".grid-container .left-half"), {clearProps: "border-width"});
				tl.from(firstCol.find(".grid-container"), animLength, {width: "3%", ease: Linear.easeIn});
			}

			let lastInd = numNexts - 1;
			for (let i = middleInd + 1; i < numNexts; i++) {
				let right = angular.element(nextCols.get(i));
				let left = angular.element(nextCols.get(lastInd - i));
				let curCols = right.add(left);
				let isLast = i == lastInd;

				// let startPoint = "-=" + (isEven || i != middleInd + 1 ? animLength : 0);

				if (!isLast) {
					tl.set(curCols.find(".left-half"), {width: "0%"});
				}

				tl.set(curCols.find(".grid-container>div"), {clearProps: "border-width"});
				tl.from(curCols.find(".grid-container"), animLength, {width: "0%", ease: Linear.easeIn});
				tl.from(curCols.find(".grid-container"), animLength, {height: 2});
				tl.from(curCols.find(".info"), animLength, {opacity: 0});

				if (!isLast) {
					tl.to(curCols.find(".left-half"), animLength, {width: "50%", ease: Linear.easeIn});
				}
			}
    	}

		$element.hide();
    	$timeout(animIn);
	}
}
