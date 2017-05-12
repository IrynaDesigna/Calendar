;(function() {
  "use strict";

  angular.
    module("addEvent").
    component("addEvent", {
    	templateUrl: "js/add-event/template/add-event.html",
    	controller: addEventController
    });

    addEventController.$inject = ["$scope", "$location"];

    function addEventController($scope, $location) {
    	let vm = this,
            userId = firebase.auth().currentUser.uid;;
    	vm.addEvent = addEvent;
        vm.thisDay = "";
        vm.dateYear = "";
        vm.dateMonth = "";
        vm.dateDay = "";
        vm.eventName = "";
        vm.eventStart = "";
        vm.eventStart1 = "";
        vm.eventEnd = "";
        vm.eventEnd1 = "";
        vm.eventDescription = "";
        vm.err = "";




        firebase.database().ref(`users/${userId}/date/day`).once("value").then(snapshot => {
            vm.thisDay = snapshot.val();
                $scope.$apply()
        })

        function addEvent(ev) {
            ev.preventDefault();

            let eventDay = Date.parse(new Date(Number.parseInt(vm.dateYear),Number.parseInt(vm.dateMonth)-1,Number.parseInt(vm.dateDay)));

            let event = {
                day: eventDay,
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
            } else if (!Number.parseInt(vm.dateYear)) {
                vm.err = 'Year should be number'
            } else if (vm.dateYear.length !== 4) {
                vm.err = 'Year should consist of 4 symbols'
            } else {

                firebase.database().ref(`users/${userId}/events`).push(event, function(err) {
                    if(err) console.error(err);
                });

                $location.path("/")
            }       
        }
    };

})();