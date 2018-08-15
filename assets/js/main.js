import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngSanitize from "angular-sanitize";

import pages from "./pages";
import chartComponent from "./controllers/chartController";
import infoComponent from "./controllers/InfoController";
import chartCircleComponent from "./controllers/chartCircleComponent";

let app = angular.module("main", ["ngSanitize", "ui.router"]);

app.value("isMobileWidth", function() {return angular.element("body").width() < 740});

/*@ngInject*/
app.config(function ($uiRouterProvider, $locationProvider) {
  $uiRouterProvider.urlService.rules.otherwise({state: "enoch"});
  // $locationProvider.html5Mode(true);
  let makeView = (page)  => `${page.type}Component`

  let makeResolves = (page) => {
    return {
      pageInfo: () => page.scope
    };
  }

  const $stateRegistry = $uiRouterProvider.stateRegistry;
  for (let page of pages) {
    let {href: url, scope: params, state: name} = page;
    let component = makeView(page);
    let resolve = makeResolves(page);

    $stateRegistry.register({name,
      url,
      params,
      resolve,
      component
    });
  };
})

/*@ngInject*/
app.run(function($rootScope, $state, $transitions, $window, $q, rootTlService, $timeout) {

  let onStateChange = (transition) => {
    let toState = transition.to().name;
    let toParams = transition.params();
    $rootScope.upHref = $state.href("^");
  }

  $transitions.onSuccess({}, onStateChange);

  $transitions.onExit({}, function(transition, state) {
    rootTlService.cancelAnimating();

    // pop the last timeline from the stack
    let exitTl = rootTlService.getLastTl();
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

    exitTl.eventCallback("onReverseComplete", callback);
    exitTl.reverse();

    return deferred.promise;
  })

  let keyedup = false;
  let checkKey = (event) => !event.defaultPrevented && event.key == "ArrowUp" && angular.element("body").scrollTop() === 0 && $state.get("^").name !== "";

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

app.component("chartComponent", chartComponent);

app.component("infoComponent", infoComponent);

app.component("chartCircle", chartCircleComponent);

app.service("rootTlService", class RootTlService {
  constructor() {
    this.currentTls = [];
    this.animating = [];
  }

  addToTl(tl) {
    let numTls = this.currentTls.length;
    if (numTls > 0) {
      let lastTl = this.currentTls[numTls -1];
      if (lastTl.progress() < 1) {
        let lastLabel = lastTl.getLabelBefore(lastTl.endTime());
        let lastTime = lastTl.getLabelTime(lastLabel);

        tl.delay(lastTime + lastTl.delay());
      }
    }

    this.currentTls.push(tl);
    // this.printTls("tl added. current list:")
    this.addAnimating(tl);
  }

  getLastTl() {
    let last = this.currentTls.pop();
    // this.printTls("tl removed. current list:");
    return last;
  }

  addAnimating(tl) {
    if (tl.isActive()) {
      this.animating.push(tl);
    }
  }

  cancelAnimating() {
    for (let tl of this.animating) {
      let prog = tl.reversed() ? 0 : 1;
      tl.progress(prog);
    }

    this.animating = [];
  }

  printTls(msg) {
    console.log(msg, this.currentTls);
  }
})
