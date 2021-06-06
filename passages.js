
var app = angular.module('passagesApp', []);
app.controller('biblePassagesCtrl', function($scope, $http) {
    

$http.get("data/biblePassagesSearch.json").then(function (response) {
  $scope.bookNames = Object.values(response.data.books);
  for(i = 0; i < 66; i++) {
    $scope.bookNames[i].passages = Object.values($scope.bookNames[i].passages);
    // console.log($scope.books[i].passages);
  }
});

$http.get("bible.json").then(function (response) {
  $scope.books = Object.values(response.data.books);
  books = $scope.books;

  var selected = getUrlVars();

  var toEnd = false;

  if (selected.book) { //if passage submitted

    selected.book = decodeURI(selected.book.replace("+", " "));
    // disp(selected.book);
    if(!isNaN(selected.book)) selected.book =  books[selected.book-1].name;
    var passage = indicator = "";

    for (b = 0; b < 66; b++) {
      if (selected.book == books[b].name) {

        indicator = selected.book + " " + selected.chapter + ":" + selected.v_start;

        if (!selected.v_end) {
          selected.v_end = selected.v_start;
        } else if (selected.v_end.toLowerCase() == "end" || selected.v_end == 999) {
          selected.v_end = 999;
          toEnd = true;
        } else {
          indicator += "-" + selected.v_end
        }

        for (v = Number(selected.v_start); v <= Number(selected.v_end); v++) {
          if (books[b].chapters[selected.chapter].verses[v]) {
            passage += books[b].chapters[selected.chapter].verses[v] + " ";
          } else {
            selected.v_end = v - 1;
            if (toEnd) indicator += "-" + selected.v_end
            continue;
          }
        }

        $scope.book = selected.book;
        $scope.chapter = selected.chapter;
        $scope.v_prev = selected.v_start == 1 ? selected.v_start : selected.v_start - 1;
        $scope.v_start = selected.v_start;
        $scope.v_end = selected.v_end;
        $scope.v_next = parseInt(selected.v_end) + 1;
        $scope.passageTextarea = ">**" + indicator + "** - " + passage;
        $scope.indicator = indicator;
        $scope.passage = passage;

        continue;
      }
    }

    disp(passage);
  }

});



});