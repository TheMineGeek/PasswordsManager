var apiPath = 'http://localhost:8080/';

var app = angular.module('passwordManager', []).run(function ($rootScope) {
  $rootScope.token = null;
  $rootScope.connectDiv = false;
  $rootScope.passwordsDiv = true;
  $rootScope.newPasswordDiv = true;
  $rootScope.signupDiv = true;

  $rootScope.switchController = function () {
    $rootScope.connectDiv = true;
  };

  $rootScope.showConnect = function () {
    $rootScope.signupDiv = true;
    $rootScope.connectDiv = false;
  }

  $rootScope.showSignup = function () {
    $rootScope.signupDiv = false;
    $rootScope.connectDiv = true;
  }


  $rootScope.init = null;
});

app.controller('ConnectController', function ($scope, $rootScope) {
  $scope.connection = function () {
    if ($scope.username && $scope.password) {
      var data = {
        username: $scope.username,
        password: $scope.password
      };

      $.ajax({
        url: apiPath + 'connect',
        type: 'POST',
        crossDomain: true,
        data: data,
        success: function (data, status) {
          console.log(status);
          $rootScope.token = data.token;
          $rootScope.switchController();
          $rootScope.init();
        },
        error: function (err) {
          if (err.statusText == "Unauthorized") {
            Materialize.toast('Informations incorrectes', 3000, 'rounded');
          }
        }
      });
    }
  };

  $scope.switchController = function () {
    $scope.connect = true;
  };
});

app.controller('SignupController', function ($scope, $rootScope) {
  $scope.signup = function () {
    if ($scope.username && $scope.password) {
      var data = {
        username: $scope.username,
        password: $scope.password
      };

      $.ajax({
        url: apiPath + 'user',
        type: 'PUT',
        crossDomain: true,
        data: data,
        success: function (data) {
          console.log($scope);
          $scope.username = '';
          $scope.password = '';
          $rootScope.showConnect();
          Materialize.toast('Vous êtes bien inscrit !', 3000, 'rounded');
        },
        error: function (err) {
          if (err.statusText == "Conflict") {
            Materialize.toast('Nom d\'utilisateur déjà utilisé', 3000, 'rounded');
          }
        }
      });
    }
    else {
      Materialize.toast('Veuillez remplir correctement les champs', 3000, 'rounded');
    }
  }
});

app.controller('PasswordController', function ($scope, $rootScope) {
  $scope.init = function () {
    $scope.getPasswords();
    $rootScope.passwordsDiv = false;
    $rootScope.newPasswordDiv = false;
  };

  $rootScope.init = $scope.init;
  $scope.getPasswords = function () {
    $.ajax({
      url: apiPath + 'password',
      type: 'GET',
      data: $rootScope.token,
      success: function (data) {
        console.log(data);
        $scope.passwords = data;
        $scope.$apply();
      },
      error: function (err) {
        console.log(err);
      }
    });
  };

  $scope.passwords = [];

  $scope.swapPassword = function (id) {
    console.log(id);
    $scope[id] = !$scope[id];
  }

  $scope.remove = function (id) {
    console.log(id);
    $.ajax({
      url: apiPath + 'password',
      type: 'DELETE',
      crossDomain: true,
      data: { token: $rootScope.token, objectId: id },
      success: function (data) {
        console.log(data);
        $scope.getPasswords();
      },
      error: function (err) {
        console.log(err);
      }
    });
  };

  $scope.edit = function (id) {
    console.log(id);
  };
});

app.controller('newPasswordController', function ($scope, $rootScope) {
  $scope.addPassword = function () {
    if ($scope.username && $scope.password && $scope.website) {
      var data = {
        username: $scope.username,
        password: $scope.password,
        website: $scope.website,
        token: $rootScope.token
      };

      $.ajax({
        url: apiPath + 'password',
        type: 'PUT',
        crossDomain: true,
        data: data,
        success: function (data) {
          $scope.getPasswords();
          $scope.username = '';
          $scope.password = '';
          $scope.website = '';
        },
        error: function (err) {
          console.log(err);
        }
      });
    }
    else {
      Materialize.toast('Il manque des informations', 3000, 'rounded');
    }
  };
});