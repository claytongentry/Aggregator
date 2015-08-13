(function() {
  var app = angular.module('Aggregator', []);
  app.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

    $http.get('/articlelist')
      .success(function(response) {
        $scope.articlelist = response;
      });

  }]);
})();
