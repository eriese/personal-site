export default class ChartController {
	/*@ngInject*/
	constructor($scope, $stateParams, $state) {
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
	}
}
