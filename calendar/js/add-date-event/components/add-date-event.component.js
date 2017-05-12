;(function() {
  "use strict";

  angular.
    module("addDateEvent").
    component("addDateEvent", {
    	templateUrl: "js/add-date-event/template/add-date-event.html",
    	controller: addDateEventController
    });

    addDateEventController.$inject = ["$scope", "$location"];

    function addDateEventController($scope, $location) {
    	let vm = this;
        vm.addEvent = addEvent;
        vm.eventName = "";
        vm.eventStart = "";
        vm.eventStart1 = "";
        vm.eventEnd = "";
        vm.eventEnd1 = "";
        vm.eventDescription = "";
        vm.err = "";

        let user = firebase.auth().currentUser.uid;

        firebase.database().ref(`users/${user}/date/day`).once("value").then(snapshot => {
            vm.thisDay = snapshot.val();
            $scope.$apply();
        });

        function addEvent(ev) {
            ev.preventDefault();

            let event = {
                day: vm.thisDay,
                name: vm.eventName,
                from: vm.eventStart + ":" +vm.eventStart1,
                to: vm.eventEnd + ":" + vm.eventEnd1,
                descr: vm.eventDescription,
            }

            if (event.from.length !== 5 || event.to.length !== 5) {
                vm.err = 'Time should be like 00:00'
            } else if (event.to.length !== 5) {
                vm.err = 'Time "to" should be like 00:00'
            } else if (Number.parseInt(vm.eventStart) < 0 || Number.parseInt(vm.eventStart) > 24) {
                vm.err = 'Time "from" should be within 00-24 hours'
            } else if (Number.parseInt(vm.eventStart1) < 0 || Number.parseInt(vm.eventStart1) > 59) {
                vm.err = 'Time "from" should be within 00-59 minutes'
            } else if (Number.parseInt(vm.eventStart) === 24 && Number.parseInt(vm.eventStart1) > 0 || Number.parseInt(vm.eventEnd) === 24 && Number.parseInt(vm.eventEnd1)) {
                vm.err = 'Time should be within 00:00-24:00 hours'
            } else {

                firebase.database().ref(`users/${user}/events`).push(event, function(err) {
                    if(err) console.error(err);
                });

                $location.path("/")
            }       
        }
    };
})();