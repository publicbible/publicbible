
var app = angular.module('passagesApp', []);
app.controller('biblePassagesCtrl', function($scope, $http) {
    
$http.get("data/biblePassagesSearch.json").then(function (response) {
  $scope.books = response.data.books;
  for(i = 1; i <= 66; i++) {
    // console.log($scope.books[i].passages);
  }

});

// $http.get("data/biblePassageSearcj.json").then(function (response) {
//   $scope.tags = response.data;


//   // console.log($scope.tags);
// });

});

