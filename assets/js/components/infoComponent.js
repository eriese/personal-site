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

		doAnim(isMobileWidth) {
			// scroll in the label
			this.tl.from(this._$element.find(".label"), 0.5, {height: 0, 'padding-top': 0, 'padding-bottom': 0, ease: Power4.easeIn});
			// clear the animation properties
			this.tl.set(this._$element.find(".label"), {clearProps: "all"});
		}

		/** when the video or image is clicked */
		vidClick($event) {
			// toggle the playing
			this.playing = !this.playing;

			// get the click target
			let target = $event.target;
			// if there's a video, stop or start the playing
			if (this.pageInfo.video) {
				this.playing ? target.play() : target.pause();
				// proportions take care of themselves, so we're done her
				return;
			}

			// if it's an image that is currently "playing"
			if (this.playing && this.pageInfo.img) {
				// get the screen size so that the height doesn't overtake
				this.getScreenPos(target);
				// listen for screen resize so it'll stay in the right proportions
				angular.element(window).on("resize.imgOpen", () => {
					this.getScreenPos(target);
					this._$scope.$apply();
				});
			}
			// otherwise
			else {
				// reset the styling
				this.containerStyle = {};
				// stop listening for resize
				angular.element(window).off("resize.imgOpen");
			}
		}

		/** get the screen position of the image */
		getScreenPos(el) {
			el = angular.element(el);
			// get the proportions of the element
			let elProportion = el.width() / el.height();

			// get the proportions of the image
			let win = angular.element(window);
			let winProportion = win.width() / win.height();

			// if the window is wider than the image, we want full height rather than width
			this.containerStyle = winProportion > elProportion ? {height: "100%", width: "auto"} : {}
		}
    }
}

export default infoComponent;
