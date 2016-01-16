var app = angular.module('passwordManager', []).run(function ($rootScope) {
  $rootScope.token = null;
  $rootScope.connectDiv = false;
  $rootScope.passwordsDiv = true;
  $rootScope.newPasswordDiv = true;

  $rootScope.switchController = function () {
    $rootScope.connectDiv = true;
  };

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
        url: 'http://localhost:8080/connect',
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

app.controller('PasswordController', function ($scope, $rootScope) {
  $scope.init = function () {
    $scope.getPasswords();
    $rootScope.passwordsDiv = false;
    $rootScope.newPasswordDiv = false;
  };

  $rootScope.init = $scope.init;
  $scope.getPasswords = function () {
    $.ajax({
      url: 'http://localhost:8080/password',
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
      url: 'http://localhost:8080/password',
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
        ownerID: $scope._id,
        token: $rootScope.token
      };

      $.ajax({
        url: 'http://localhost:8080/password',
        type: 'PUT',
        crossDomain: true,
        data: data,
        success: function (data) {
          $scope.getPasswords();
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