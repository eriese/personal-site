import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngSanitize from "angular-sanitize";

import pages from "./pages";
import ChartContrller from "./controllers/chartController";
import InfoController from "./controllers/InfoController";

let app = angular.module("main", ["ngSanitize", "ui.router"]);

/*@ngInject*/
app.config(function ($uiRouterProvider, $locationProvider) {
  $uiRouterProvider.urlService.rules.otherwise({state: "mainState"});
  // $locationProvider.html5Mode(true);
  let makeView = (page)  => {
    let {type} = page;
    return {
      "@" : {
        templateUrl: `_${type}.html`,
        controller: `${type}Controller`
      }
    }
  };

  const $stateRegistry = $uiRouterProvider.stateRegistry;
  for (let page of pages) {
    let {href: url, scope: params, state: name} = page;
    let views = makeView(page);

    $stateRegistry.register({name, url, params, views});
  };
})

/*@ngInject*/
app.run(function($rootScope, $state, $transitions, $window) {

  let onStateChange = (transition) => {
    let toState = transition.to().name;
    let toParams = transition.params();
    $rootScope.upHref = $state.href("^");
    $rootScope.title = toParams.title;
    $rootScope.category = toState.split(".")[1] || "enoch";
    $rootScope.color = toParams.color;
  }

  $transitions.onSuccess({}, onStateChange);

  $transitions.onStart({}, (transition) => {
    let toState = transition.to().name;
    let fromState = transition.from().name;

    if (toState.includes(fromState)) {
      console.log("down");
    } else if (fromState.includes(toState)) {
      console.log("up");
    }
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

app.controller("chartController", ChartContrller);

app.controller("infoController", InfoController);
