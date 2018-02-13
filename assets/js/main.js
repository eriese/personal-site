import pages from "./pages";
import ChartContrller from "./controllers/chartController";
import InfoController from "./controllers/InfoController";

let app = angular.module("main", ["ngSanitize", "ui.router"]);

/*@ngInject*/
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise("/");
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

  for (let page of pages) {
    let {href: url, scope: params} = page;
    let views = makeView(page);

    $stateProvider.state(page.state, {url, params, views});
  };
})

/*@ngInject*/
app.run(function($rootScope, $state) {
  let getUpState = (toState) => {
    let {name} = toState;
    if (name == "mainState") {return;}
    let upState = name.includes(".") ? "^" : "mainState";
    return $state.href(upState);
  }

  let onStateChange = (event, toState, toParams, fromState, fromParams) => {
    $rootScope.upHref = getUpState(toState);
    $rootScope.title = toParams.title;
    $rootScope.category = toState.name == "mainState" ? "enoch" : toState.name.split(".")[0];
    $rootScope.color = toParams.color;
  }

  $rootScope.$on("$stateChangeSuccess", onStateChange);
})

app.controller("chartController", ChartContrller);

app.controller("infoController", InfoController);
