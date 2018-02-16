import {TweenMax} from "gsap";

export default class InfoController {
	/*@ngInject*/
	constructor($scope, $transition$, $element, $timeout) {
		$scope.data = $transition$.params();
		console.log($transition$);

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

		let animIn = () => {
			$element.show();
			let tl = new TimelineMax();
			tl.from($element.find(".label"), 0.5, {height: 0, ease: Power4.easeIn});
			tl.set($element.find(".label"), {clearProps: "all"});
		}

		$element.hide();
		$timeout(animIn, 200);

    }
}
