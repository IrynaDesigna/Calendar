;(function() {
    "use strict";

    angular.
        module("myCalendar").
        component("myCalendar", {
            templateUrl: "js/my-calendar/template/my-calendar.html",
            controller: myCalendarController
    });

    myCalendarController.$inject = ["$scope", "$timeout", "$location"];

    function myCalendarController($scope, $timeout, $location) {
        document.getElementsByClassName("preview")[0].style.display = "block";
        
        let vm = this;
        vm.renderPrevMonth = renderPrevMonth;
        vm.renderNextMonth = renderNextMonth;
        vm.month = [];
        vm.renderMonth = renderMonth;
        vm.eventDate = eventDate;
        vm.dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sut"];

        $timeout(function() {
            // console.log(firebase.auth().currentUser);
            let currentUser = firebase.auth().currentUser

            $scope.$apply(currentUser);

            let user = {
                name: currentUser.displayName,
                email: currentUser.email,
                uid: currentUser.uid
            }
            // console.log(currentUser.displayName);

            firebase.database().ref(`users/${currentUser.uid}`).once("value").then(snapshot => {
                let userIf = snapshot.val();

                if (!userIf) {
                    function writeUserData(userId, name, email) {
                        firebase.database().ref('users/' + userId).set({
                            username: name,
                            email: email,
                            userId: userId
                        });
                     }

                    writeUserData(user.uid, user.name, user.email);

                    firebase.database().ref(`users/${user.uid}`).once("value").then(snapshot => {
                        console.log(snapshot.val().username);
                    })
                }
            })



            firebase.database().ref(`users/${user.uid}/date/day`).once("value").then(snapshot => {
                vm.thisDay = snapshot.val();                

                if(vm.thisDay) {
                    vm.currentYear = new Date(vm.thisDay).getFullYear();
                    vm.currentMonth = new Date(vm.thisDay).getMonth();
                    vm.currentDay = new Date(vm.thisDay).getDate();

                    vm.month = [];
                    renderMonth();

                    firebase.database().ref(`users/${user.uid}/date/day`).remove();
                } else {
                    vm.currentYear = new Date().getFullYear();
                    vm.currentMonth = new Date().getMonth();
                    vm.currentDay = new Date().getDate();

                    renderMonth();
                }

                $scope.$apply();
            });
        }, 1000);

        function renderMonth() {
            let firstMonthDay = new Date(vm.currentYear,vm.currentMonth,1),
                firstDisplayDay = firstMonthDay.getDay();

            if(firstDisplayDay !== 0) {
                let prevMDays = firstDisplayDay,
                    prevMonth;

                if(vm.currentMonth !== 0) prevMonth = vm.currentMonth - 1
                else prevMonth = new Date(vm.currentYear - 1, 11).getMonth();

                let prevMDaysLength = new Date(vm.currentYear, (vm.currentMonth - 1) + 1,0).getDate();
                for(let i = 1; i <= prevMDays; i++, prevMDaysLength--) {

                    let day = new Date(vm.currentYear, prevMonth, prevMDaysLength);

                    vm.month.unshift({ day: Date.parse(day) });
                }
            };


            let monthLength = new Date(vm.currentYear, vm.currentMonth + 1,0).getDate();
                for(let i = 1; i <= monthLength; i++) {
                let day = new Date(vm.currentYear, vm.currentMonth, i);

                vm.month.push({ day: Date.parse(day) , currentMonth: true });
            } 

            if (vm.month.length < 35) {
                let nextMDays = 35 - vm.month.length,
                    nextMonth;

                if(vm.currentMonth !== 11) nextMonth = vm.currentMonth + 1
                else nextMonth = new Date(vm.currentYear + 1, 0).getMonth();
            
                for(let i = 1; i <= nextMDays; i++) {
                    let day = new Date(vm.currentYear, vm.currentMonth + 1, i);

                    vm.month.push({ day: Date.parse(day) });
                }

            } else if (vm.month.length > 35) {
                let nextMDays = 42 - vm.month.length,
                    nextMonth;

                if(vm.currentMonth !== 11) nextMonth = vm.currentMonth + 1
                else nextMonth = new Date(vm.currentYear + 1, 0).getMonth();
            
                for(let i = 1; i <= nextMDays; i++) {
                    let day = new Date(vm.currentYear, vm.currentMonth + 1, i);

                    vm.month.push({ day: Date.parse(day) });
                }
            }

            $timeout(function() {
                let user = firebase.auth().currentUser

                firebase.database().ref(`users/${user.uid}/events`).on("value", function (snapshot) {
                    if(snapshot.val()) {
                        snapshot.forEach(function(childSnapshot) {
                            vm.month.forEach(e => {if(e.day === childSnapshot.val().day) e.hasEvent = true});
                        });
                        $scope.$apply();
                    }
                })
            }, 1000);

            if (vm.month.length > 35) vm.month.forEach(e => {e.lessSize = true})

            vm.month.forEach(e => { if(e.day === Date.parse(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))) e.isToday = true});
            document.getElementsByClassName("preview")[0].style.display = "none";

        }




        function renderPrevMonth(ev) {
            vm.currentMonth = vm.currentMonth - 1;
            vm.month = [];

            renderMonth();
            // console.log(vm.currentMonth);
        }

        function renderNextMonth(ev) {
            vm.currentMonth = vm.currentMonth + 1;
            vm.month = [];

            renderMonth();
            // console.log(vm.currentMonth);
        };



        //sending date of event to firebase

        function eventDate(ev) {
            let userId = firebase.auth().currentUser.uid,
                dateTarget = ev.target.id;

            let monthes = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                date = Number.parseInt(dateTarget);

            function writeData(date) {
                
                firebase.database().ref(`users/${userId}/date`).set({
                    day: date
                });
            }

            writeData(date);


            $timeout(function(){
                firebase.database().ref(`users/${userId}/events`).on("value", function (snapshot) {
                    if(snapshot.val()) {
                        snapshot.forEach(function(childSnapshot) {
                            if (childSnapshot.val().day === date) {
                                $location.path("/event-list")
                            }
                        });
                    } else $location.path("/add-date-event")
                })
            })
        }
    };
})();
