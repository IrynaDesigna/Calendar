;(function() {
  "use strict";

  angular.
    module("eventList").
    component("eventList", {
    	templateUrl: "js/event-list/event-list.html",
    	controller: eventListCintroller
    });

    eventListCintroller.$inject = ["$scope", "$timeout", "$location"]

    function eventListCintroller($scope, $timeout, $location) {
    	let vm = this,
    		userId = firebase.auth().currentUser.uid;
    	vm.thisDay = "";
    	vm.events = [];
    	vm.eventDate = eventDate;
    	vm.delEvent = delEvent;

    	firebase.database().ref(`users/${userId}/date/day`).once("value").then(snapshot => {
            vm.thisDay = snapshot.val();

            firebase.database().ref(`users/${userId}/events`).on('value', function(snapshot) {
    		snapshot.forEach(function(childSnapshot) {
    			if(childSnapshot.val().day === vm.thisDay) vm.events.push(childSnapshot.val());

    			$scope.$apply()
            });
    	})

        });

        function eventDate(ev) {
        	let date = vm.thisDay;

        	function writeData(date) {
            
	            firebase.database().ref(`users/${userId}/date`).set({
	                day: date
	            });
	        }

	        writeData(date);

        }

		function delEvent(ev) {
			let eventStamp = ev.target.id,
				date = vm.thisDay,
				dates =[];

			firebase.database().ref(`users/${userId}/events`).once('value').then(snapshot => {
	    		snapshot.forEach(function(childSnapshot) {
	    			let qqq = childSnapshot.val().name + childSnapshot.val().from + childSnapshot.val().to;
	    			
	    			if(qqq === eventStamp) {
	    				vm.events = [];
	    				firebase.database().ref(`users/${userId}/events/${childSnapshot.key}`).remove();
                        $scope.$apply();
	    			}
				});

                firebase.database().ref(`users/${userId}/events`).on("value", function (snapshot) {
                    if(snapshot.val()) {
                        snapshot.forEach(function(childSnapshot) {
                            dates.push(childSnapshot.val().day);
                        });

                        let b = dates.find(e => e === date);

                        if(!b) {
                            $location.path("/");
                            $scope.$apply();
                        }

                    }
                })
	    	});
    	}
    }

})();