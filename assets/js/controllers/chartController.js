import {TimelineMax} from "gsap";

export default class ChartController {
	/*@ngInject*/
	constructor($scope, $stateParams, $state, $element, $timeout) {
		let getWidth = () => {
			let len = $scope.nexts.length - 1;
			let offset = 30 * len;
			let perc = len * 15;
			return `calc(${perc}% + ${offset}px`
		}

		$scope.nexts = $state.current.params.nexts;
    	$scope.bottomWidth = getWidth();

    	$scope.getHref = (next) =>
    		next.sref ? $state.href(next.sref) : next.href;

    	$scope.getTarget = (next) => next.sref ? "" : "_blank";

		$element.hide();
    	$timeout(()=> {
    		$element.show();
    		let bottomCells = $element.find(".bottom");
    		let prevHeight = bottomCells.height();

    		let tl = new TimelineMax();
    		let width = getWidth();
    		tl.set($element.find("#bottom"), {width: "calc(0% + 0px)"}, 0)
    		tl.set(bottomCells, {height: 0}, 0);
    		tl.set($element.find(".info"), {display: "none"})

    		tl.to($element.find("#bottom"), 0.3, {width});
    		tl.to(bottomCells, 1, {height: prevHeight});
    		tl.set($element.find(".info"), {display: ""})
    		tl.staggerFrom($element.find(".info"), 0.3, {opacity: 0}, 0.2)
    	})
	}
}
