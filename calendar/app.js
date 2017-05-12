;(function() {
  "use strict";

  angular.
    module("myCalendar", [
      "ngRoute",
      "appLogin",
      "addDateEvent",
      "addEvent",
      "eventList"
    ]).
    config(AppConfig).
    run(appRun);

    AppConfig.$inject = ["$routeProvider", "$locationProvider"];
    appRun.$inject = ["$location", "$timeout"];

    function AppConfig($routeProvider, $locationProvider) {
      var config = {
        apiKey: "AIzaSyCiv2inacqWuJupvs2KiX16wWzKl2vdd_s",
        authDomain: "calendar-e0553.firebaseapp.com",
        databaseURL: "https://calendar-e0553.firebaseio.com",
        storageBucket: "calendar-e0553.appspot.com"
      };
      firebase.initializeApp(config);

      // console.log($routeProvider);
      $routeProvider.
        when("/login", {
          template: "<app-login></app-login>"
        }).
        when("/add-date-event", {
          template: "<add-date-event></add-date-event>"
        }).
        when("/add-event", {
          template: "<add-event></add-event>"
        }).
        when("/event-list", {
          template: "<event-list></event-list>"
        }).
        when("/", {
          template: "<my-calendar></my-calendar>"
        });

      $locationProvider.html5Mode(true);
    }

    function appRun($location, $timeout) {
      firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
          $timeout(function() {
            $location.path("/");
          });
        } else $location.path("/login");
      });
    }

})();
