export default class InfoController {
	/*@ngInject*/
	constructor($scope, $stateParams) {
		$scope.data = $stateParams;

		$scope.vidClick = ($event) => {
			let video = $event.target;
			if (video.paused) {
				$(".img").css("width", "95%");
				$("video").css({"width": "90%"});
				video.play();
			}
			else {
				video.pause();
				$(".img").css("width", "");
				$("video").css({"width": "100%"});
			}
		}
    }
}
