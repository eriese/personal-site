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

		$element.hide();
    	$timeout(()=> {
    		$element.show();

			let animLength = 0.3;
			let containerWidth = `${Math.min(25*numNexts, 100)}%`;

    		let tl = new TimelineMax();
    		tl.fromTo($element.find(".chart-container"), animLength, {width: 0}, {width: containerWidth});
    		tl.from($element.find(".grid-container"), animLength, {height: 2});
    		tl.staggerFrom($element.find(".info"), animLength, {opacity: 0}, animLength / 2)
    	})
	}
}
