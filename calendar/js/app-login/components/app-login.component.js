;(function() {
  "use strict";

  angular.
    module("appLogin").
    component("appLogin", {
      template: `
        <div class="login-form-container">
          <h1>myCalendar</h1>
          <form action="/" ng-submit="$ctrl.onLogin($event)">
            <button>Login with Google</button>
          </form>
          <p ng-show="$ctrl.error.isError">{{$ctrl.error.errorText}}</p>
        </div>
      `,
      controller: AppLoginController
    });

  AppLoginController.$inject = ["$location", "$scope"];
  function AppLoginController($location, $scope) {

    let vm = this;
    vm.onLogin = onLogin;
    vm.auth = firebase.auth();

    vm.provider = new firebase.auth.GoogleAuthProvider();
    // console.log(vm.provider)
    vm.provider.addScope('profile');
    vm.provider.addScope('email');


    function onLogin(ev) {
      ev.preventDefault();

      firebase.auth().signInWithRedirect(vm.provider);

      firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
          // This gives you a Google Access Token.
          var token = result.credential.accessToken;
        }
        var user = result.user;

        var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
        firebase.auth().signInWithCredential(credential)
      });
    };
  };
})();