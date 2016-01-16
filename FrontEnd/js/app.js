var app = angular.module('passwordManager', []).run(function ($rootScope) {
  $rootScope.token = null;
  $rootScope.connect = false;
  $rootScope.passwordsdiv = true;

  $rootScope.switchController = function () {
    $rootScope.connect = true;
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
        success: function (data) {
          $rootScope.token = data.token;
          $rootScope.switchController();
          $rootScope.init();
        },
        error: function (err) {
          console.log(err);
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
    console.log("test");
    $scope.getPasswords();
    $rootScope.passwordsdiv = false;
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
  
  $scope.swapPassword = function(id) {
    console.log(id);
    $scope[id] = !$scope[id];
  }
});