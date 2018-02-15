import {TweenMax} from "gsap";

export default class InfoController {
	/*@ngInject*/
	constructor($scope, $stateParams, $element, $timeout) {
		$scope.data = $stateParams;

		$scope.vidClick = ($event) => {
			let video = $event.target;
			if (video.paused) {
				angular.element(".img").css("width", "95%");
				angular.element("video").css({"width": "90%"});
				video.play();
			}
			else {
				video.pause();
				angular.element(".img").css("width", "");
				angular.element("video").css({"width": "100%"});
			}
		}

		// $element.hide();

    }
}
