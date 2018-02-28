import {TweenMax} from "gsap";

let getPosDif = (el) => {
	let elOff = el.find(".info").position();
	let width = angular.element(window).width();

	let top = -elOff.top;
	let left = (width/2 - elOff.left) * 100 / width + "%";

	return {top, left};
}

const infoComponent = {
	bindings: {
		data: '<pageInfo',
		parentInd: "<",
		parentMargin: "<"
	},


	controller: class InfoController {
		/*@ngInject*/
		constructor($element, $timeout, rootTlService) {
			this._$element = $element;
			this._$timeout = $timeout;
			this._rootTlService = rootTlService;
		}

		$onInit() {
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
				// first blow up the parent circle and center it
				if (this.parentInd !== undefined) {
					this.tl.add("endEl");
					this.tl.to(angular.element("#page-container"), 0.4, getPosDif(this.parentInd), "endEl");
					this.tl.set(this._$element.parent(), {'margin-left': this.parentMargin}, "endEl");
				}
				this.tl.add("afterEndEl");
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
