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
app.run(function($rootScope, $state, $transitions, $trace) {
  let getUpState = (toState) => {
    let {name} = toState;
    if (name == "mainState") {return;}
    let upState = name.includes(".") ? "^" : "mainState";
    return $state.href(upState);
  }

  let onStateChange = (transition) => {
    let toState = transition.to();
    let toParams = transition.params();
    $rootScope.upHref = getUpState(toState);
    $rootScope.title = toParams.title;
    $rootScope.category = toState.name == "mainState" ? "enoch" : toState.name.split(".")[0];
    $rootScope.color = toParams.color;
  }

  $transitions.onSuccess({}, onStateChange);
})

app.controller("chartController", ChartContrller);

app.controller("infoController", InfoController);
