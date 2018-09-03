import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngSanitize from "angular-sanitize";

import pages from "./pages";
import chartComponent from "./components/chartComponent";
import infoComponent from "./components/infoComponent";
import chartCircleComponent from "./components/chartCircleComponent";

let app = angular.module("main", ["ngSanitize", "ui.router"]);

/** function for determining whether the screen is smaller than the width used for mobile styling */
app.value("isMobileWidth", function() {return angular.element(window).width() < 740});

/*@ngInject*/
app.config(function ($uiRouterProvider, $locationProvider) {
  $uiRouterProvider.urlService.rules.otherwise({state: "enoch"});
  // $locationProvider.html5Mode(true)
  /** string interpolation for component name */
  let makeView = (page)  => `${page.type}Component`

  /** make the resolves for the page */
  let makeResolves = (page) => {
    return {
      pageInfo: () => page.scope,
      pageState: () => page.state
    };
  }

  // make each page in the state registry
  for (let page of pages) {
    let {href: url, scope: params, state: name} = page;
    let component = makeView(page);
    let resolve = makeResolves(page);

    $uiRouterProvider.stateRegistry.register({name,
      url,
      params,
      resolve,
      component
    });
  };
})

/*@ngInject*/
app.run(function($rootScope, $state, $transitions, $window, $q, rootTlService, $timeout) {
  // show the up button if we're not in the root state
  $rootScope.showUp = () => $state.getCurrentPath().length > 2;

  // when a state is exiting
  $transitions.onExit({}, function(transition, state) {
    // cancel any running animations
    rootTlService.cancelAnimating();

    // pop the last timeline from the stack
    let exitTl = rootTlService.getLastTl();
    // if there isn't anything in the stack, we're done here
    if (!exitTl) {return;}

    // pop the timeline before that, which is what centered the parent
    let centerTl = rootTlService.getLastTl();

    // get a promise to resolve after all animation is done
    let deferred = $q.defer();
    // default callback after reversing the timeline is resolving the promise
    let callback = deferred.resolve

    // if it's not entering a sibling state
    if (transition.entering().length == 0 && centerTl) {
      // the callback recenters the parent, then resolves
      callback = () => {
        centerTl.eventCallback("onReverseComplete", deferred.resolve);
        centerTl.reverse();
      }
    }
    // if it's entering a sibling state. it needs a dummy timeline added INSTEAD of the real one
    else {
      transition.to().params.fromSib = true;
    }

    // add the callback to the timeline, then reverse
    exitTl.eventCallback("onReverseComplete", callback);
    exitTl.reverse();

    return deferred.promise;
  })

  // up key handling for going up the chart
  let keyedup = false;
  let checkKey = (event) => !event.defaultPrevented && event.key == "ArrowUp" && angular.element("body").scrollTop() === 0 && $state.get("^").name !== "";

  // listen for the key event
  angular.element($window)
    .keydown((event) => {
      keyedup = checkKey(event);
    })
    .keyup((event) => {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }
      if (keyedup && checkKey(event)) {
        event.preventDefault();
        $state.go("^");
      }
    })
})

/** a service for holding gsap timelines that animate the charts, allowing animation around the history */
app.service("rootTlService", class RootTlService {
  constructor() {
    // make a list of timelines in the current history
    this.currentTls = [];
    // make a list of timelines that may be animating
    this.animating = [];
  }

  /** add a timeline to the list of current timelines */
  addToTl(tl) {
    // check how many are currently in the list
    let numTls = this.currentTls.length;
    // if there are any
    if (numTls > 0) {
      // get the last one
      let lastTl = this.currentTls[numTls -1];
      // if it's currently animating
      if (lastTl.progress() < 1) {
        // get the time of its last label
        let lastLabel = lastTl.getLabelBefore(lastTl.endTime());
        let lastTime = lastTl.getLabelTime(lastLabel);

        // add that as the delay of the new timeline so that its first animation coincides with the last animation of the previous timeline
        tl.delay(lastTime + lastTl.delay());
      }
    }

    // add it to both lists
    this.currentTls.push(tl);
    // this.printTls("tl added. current list:")
    this.addAnimating(tl);
  }

  /** pop the last added timeline out of the list and return it */
  getLastTl() {
    let last = this.currentTls.pop();
    // this.printTls("tl removed. current list:");
    return last;
  }

  /** add a timeline to the list of currently animating timelines */
  addAnimating(tl) {
    // only add if it's still active
    if (tl.isActive()) {
      this.animating.push(tl);
    }
  }

  /** cancel animation on all currently animating timelines */
  cancelAnimating() {
    // for each timeline
    for (let tl of this.animating) {
      // the progress should be 0 if the timeline is currently reversing, or 1 if it's playing forward
      let prog = tl.reversed() ? 0 : 1;
      // skip to the right progress
      tl.progress(prog);
    }

    // clear the list
    this.animating = [];
  }

  /** print the current list of timelines */
  printTls(msg) {
    console.log(msg, this.currentTls);
  }
})

// set up the components
app.component("chartComponent", chartComponent);
app.component("infoComponent", infoComponent);
app.component("chartCircle", chartCircleComponent);
