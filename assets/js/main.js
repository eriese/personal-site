import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngSanitize from "angular-sanitize";

import pages from "./pages";
import chartComponent from "./controllers/chartController";
import infoComponent from "./controllers/InfoController";
import chartCircleComponent from "./controllers/chartCircleComponent";

let app = angular.module("main", ["ngSanitize", "ui.router"]);

/*@ngInject*/
app.config(function ($uiRouterProvider, $locationProvider) {
  $uiRouterProvider.urlService.rules.otherwise({state: "mainState"});
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
app.run(function($rootScope, $state, $transitions, $window, $q, rootTlService) {

  let onStateChange = (transition) => {
    let toState = transition.to().name;
    let toParams = transition.params();
    $rootScope.upHref = $state.href("^");
    // $rootScope.title = toParams.title;
    // $rootScope.category = toState.split(".")[1] || "enoch";
    // $rootScope.color = toParams.color;
  }

  $transitions.onSuccess({}, onStateChange);

  // $transitions.onStart({}, (transition) => {
  //   let toState = transition.to().name;
  //   let fromState = transition.from().name;

  //   if (toState.includes(fromState)) {
  //     console.log("down");
  //   } else if (fromState.includes(toState)) {
  //     console.log("up");
  //   }
  // })

  $transitions.onEnter({}, function(transition, state) {
    console.log('Transition #' + transition.$id + ' Entered ' + state.name);
    // return new Promise(resolve => setTimeout(resolve, 1000))

  })

  $transitions.onExit({}, function(transition, state) {
    let exitTl = rootTlService.getLastTl();
    let deferred = $q.defer();

    let ret = transition.retained();
    let to = transition.to();

    if (to == ret[ret.length -1]) {
      exitTl.eventCallback("onReverseComplete", deferred.resolve);
      exitTl.reverse();
    } else {
      exitTl.call(deferred.resolve, null, null, "afterEndEl");
      exitTl.tweenFromTo(exitTl.duration(), "afterEndEl");
    }

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
  }

  getLastTl() {
    return this.currentTls.pop();
  }
})
