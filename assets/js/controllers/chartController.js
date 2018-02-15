import {TimelineMax} from "gsap";

export default class ChartController {
	/*@ngInject*/
	constructor($scope, $stateParams, $state, $element, $timeout) {
		$scope.nexts = $state.current.params.nexts;

    	let numNexts = $scope.nexts.length;
    	$scope.itemWidth = `${100/numNexts}%`;
    	$scope.containerWidth = `${Math.min(25*numNexts, 100)}%`;

    	let middleInd = Math.floor(numNexts / 2);
    	let lastInd = numNexts - 1;
    	let isEven = numNexts % 2 === 0;
    	$scope.textAlign = (index) => {
    		let cls = "align-";
    		if (index < middleInd) {cls+="right";}
    		else if (index > middleInd || isEven) {cls+="left";}
    		else { cls+="center";}

    		if (index == 0 || index == lastInd) {cls+=" end";}

    		return cls;
    	}

    	$scope.getHref = (next) => next.sref ? $state.href(next.sref) : next.href;

    	$scope.getTarget = (next) => next.sref ? "" : "_blank";

    	let animIn = () => {
    		$element.show();

			let animLength = 0.4;
    		let nextCols = $element.find(".next-col");

    		// first, hide all the borders
    		let tl = new TimelineMax();
    		tl.set(nextCols.find(".grid-container>div"), {'border-width': "0px 0px 0px 0px"})

			// set a marker for the beginning of the timeline
			let curMarker = "first";

			// start in the middle of the array of next objects
			for (let i = middleInd; i < numNexts; i++) {
				// get the column at this index
				let curCols = angular.element(nextCols.get(i));
				// it's the middle if they're the same index
				let isMiddle = i == middleInd && !isEven;

				// if it's not the middle, add the column at the symmetrical index to the DOM objects being animated
				if (!isMiddle) {
					// get the symmetrical index on the other side of the center of the array
					let symmInd = lastInd - i;
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

		$element.hide();
    	$timeout(animIn);
	}
}
