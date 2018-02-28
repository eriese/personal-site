import {TweenMax} from "gsap";

const infoComponent = {
	bindings: {
		$transition$: '<'
	},


	controller: class InfoController {
		/*@ngInject*/
		constructor($element, $timeout, rootTlService) {
			this._$element = $element;
			this._$timeout = $timeout;
			this._rootTlService = rootTlService;
		}

		$onInit() {
			this.data = this.$transition$.params();
			this._$element.hide()
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

		$postLink() {
			this._$timeout(() => {
				this._$element.show();
				this.tl = new TimelineMax();
				this.tl.from(this._$element.find(">.top>.divider"), 0.4, {height: 0, ease: Linear.easeIn})
				this.tl.from(this._$element.find(".label"), 0.5, {height: 0, 'padding-top': 0, 'padding-bottom': 0, ease: Power4.easeIn});
				this.tl.set(this._$element.find(".label"), {clearProps: "all"});

				this._rootTlService.addToTl(this.tl);
			});
		}
    },

    templateUrl: "_info.html"
}

export default infoComponent;
