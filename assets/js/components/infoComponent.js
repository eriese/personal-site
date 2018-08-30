import AnimatedController, {defaultAnimatedBindings} from "../controllers/animatedController";

const infoComponent = {
	bindings: defaultAnimatedBindings,
	templateUrl: "_info.html",

	controller: class InfoController extends AnimatedController {
		/*@ngInject*/
		constructor($element, $timeout, rootTlService, isMobileWidth, $state, $scope) {
			super($element, $timeout, rootTlService, isMobileWidth, $state);
			this._$scope = $scope;
		}

		vidClick($event) {
			this.playing = !this.playing;

			let target = $event.target;
			if (this.pageInfo.video) {
				this.playing ? target.play() : target.pause();
				return;
			}

			if (this.playing && this.pageInfo.img) {
				// get the screen size so that the height doesn't overtake
				this.getScreenPos(target);
				angular.element(window).on("resize.imgOpen", () => {
					this.getScreenPos(target);
					this._$scope.$apply();
				});
			} else {
				this.containerStyle = {};
				angular.element(window).off("resize.imgOpen");
			}
		}

		getScreenPos(el) {
			el = angular.element(el);
			let elProportion = el.width() / el.height();

			let win = angular.element(window);
			let winProportion = win.width() / win.height();

			// if the window is wider than the image, we want full height rather than width
			this.containerStyle = winProportion > elProportion ? {height: "100%", width: "auto"} : {}
		}

		doAnim(isMobileWidth) {
			this.tl.from(this._$element.find(".label"), 0.5, {height: 0, 'padding-top': 0, 'padding-bottom': 0, ease: Power4.easeIn});
			this.tl.set(this._$element.find(".label"), {clearProps: "all"});
		}
    }
}

export default infoComponent;
