import AnimatedController, {defaultAnimatedBindings} from "./AnimatedController";

const infoComponent = {
	bindings: defaultAnimatedBindings,
	templateUrl: "_info.html",

	controller: class InfoController extends AnimatedController {
		/*@ngInject*/
		constructor($element, $timeout, rootTlService) {
			super($element, $timeout, rootTlService)
		}

		vidClick($event) {
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

		doAnim() {
			this.tl.from(this._$element.find(".label"), 0.5, {height: 0, 'padding-top': 0, 'padding-bottom': 0, ease: Power4.easeIn});
			this.tl.set(this._$element.find(".label"), {clearProps: "all"});
		}
    }
}

export default infoComponent;
