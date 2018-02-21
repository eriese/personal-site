import {TweenMax} from "gsap";

const infoComponent = {
	bindings: {
		$transition$: '<'
	},


	controller: class InfoController {
		/*@ngInject*/
		constructor($element, $timeout) {
			this._element = $element;
			this._timeout = $timeout;
		}

		$onInit() {
			this.data = this.$transition$.params();
			this._element.hide()
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
			this._timeout(() => {
				this._element.show();
				let tl = new TimelineMax();
				tl.from(this._element.find(".label"), 0.5, {height: 0, ease: Power4.easeIn});
				tl.set(this._element.find(".label"), {clearProps: "all"});
			});
		}
    },

    templateUrl: "_info.html"
}

export default infoComponent;
