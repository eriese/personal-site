(function() {
  "use strict";

  var app = angular.module("main", ["ngSanitize"]);

  app.run(["$rootScope", "$location", "$http",function($rootScope, $location, $http) {
    $rootScope.topColor = "magenta";
    $rootScope.infoColor = "green";
    $rootScope.getWidth = function(numNexts) {
      var len = numNexts - 1;
      var offset = 30 * len;
      var perc = (len * 15);
      return "calc(" + perc + "% + " + offset + "px)"
    }
    $http.get("assets/json/pages.json").success(function(response) {
      $rootScope.pages = response;
      $rootScope.initPage();
    })
    // {
    //   "index": {
    //     "type": "chart",
    //     "category": "enoch",
    //     "title": "Enoch Riese",
    //     "nexts": [
    //     {
    //       "title": "coder",
    //       "href": "coding",
    //       "isOut": false
    //     },
    //     {
    //       "title": "puppeteer",
    //       "href": "puppetry",
    //       "isOut": false
    //     },
    //     {
    //       "title": "skill hoarder",
    //       "href": "skills",
    //       "isOut": false
    //     }
    //     ]
    //   },
    //   "coding": {
    //     "type": "chart",
    //     "category": "coder",
    //     "title": "coder",
    //     "up": "index",
    //     "nexts": [
    //     {
    //       "title": "Processing and Arduino",
    //       "href": "processing",
    //       "isOut": false
    //     },
    //     {
    //       "title": "gitHub",
    //       "href": "http://www.github.com/eriese",
    //       "isOut": true
    //     },
    //     {
    //       "title": "Web",
    //       "href": "web",
    //       "isOut": false
    //     }
    //     ]
    //   },
    //   "skills": {
    //     "type": "info",
    //     "category": "skills",
    //     "title": "Skill Hoarder",
    //     "up": "index",
    //     "text": "Managerial: " +
    //     "<strong>Conflict resolution</strong>, " +
    //     "<strong>Curriculum writing</strong>, " +
    //     "<strong>Workshop facilitation</strong>, " +

    //     "Languages: " +
    //     "<strong>English</strong>, " +
    //     "<strong>Spanish</strong>, " +

    //     "Editing: " +
    //     "<strong>Copy and content</strong>, " +
    //     "<strong>Sound (Garageband, Audacity)</strong>, " +

    //     "Technical: " +
    //     "<strong>Construction and carpentry</strong>, " +
    //     "<strong>Light and sound board</strong>, " +
    //     "<strong>Light hanging and focusing</strong>, " +
    //     "<strong>Puppet design and construction</strong>, " +
    //     "<strong>Basic circuitry</strong>, " +
    //     "<strong>Mechanical problem-solving</strong>, " +

    //     "Sewing: " +
    //     "<strong>Costume design</strong>, " +
    //     "<strong>Pattern-making</strong>, " +
    //     "<strong>Sewing</strong>, " +
    //     "<strong>Embroidery</strong>, " +
    //     "<strong>Basic tailoring</strong>."
    //   }
    // }

    $rootScope.setPage = function(pageName) {
      $rootScope.currentPage = $rootScope.pages[pageName];
      $location.path(pageName);
    }

    $rootScope.initPage = function() {
      var initLoc = $location.path().slice(1) || "index";
      $rootScope.setPage(initLoc);
    }
  }])
  // app.controller("PageController", ["$scope", function ($scope) {


  //   $scope.currentPage = $scope.pages["index"];
  // }
  // ])

app.directive("chartPage", function() {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "_chart.html"
  }
})

app.directive("infoPage", function() {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "_info.html"
  }
})
})();
