
var app = angular.module('passagesApp', []);

app.filter("filterall",function($filter) {

  return function(arr,t){ 
    (t?t.split(/\s+/):[]).forEach(function(v){ 
      arr = $filter('filter')(arr,v); 
    });
    return arr;
  };

});

app.filter("tagFilter", function ($filter) {
  
  return function(inputArray = "", searchText = "") {
    var searchTerms = (searchText).toLowerCase().split(/\s+/);
    var result = inputArray;
    searchTerms.forEach(function(searchTerm) {
        result = $filter('filter')(result, searchTerm);
    });

    return result;
  };  

  // return function(inputArray = "", searchText = ""){
  //   var wordArray = searchText ? searchText.toLowerCase().split(/\s+/) : [];
  //   var wordCount = wordArray.length;
  //   for(var i=0;i<wordCount;i++){
  //       inputArray = $filter('filter')(inputArray, wordArray[i]);
  //   }
  //   // disp(inputArray);
  //   return inputArray;
  // }
  
  // return function (input = "", searchText = "", AND_OR = "AND") {
  //   var returnArray = [],
  //       splitext = searchText.toLowerCase().split(/\s+/),
  //       regexp_and = "(?=.*" + splitext.join(")(?=.*") + ")",
  //       regexp_or = searchText.toLowerCase().replace(/\s+/g, "|"),
  //       re = new RegExp((AND_OR == "AND") ? regexp_and : regexp_or, "i");
  //   for (var x = 0; x < input.length; x++) { 
  //     
  //     if (re.test(input[x])) returnArray.push(input[x]);
  //   }     
  //   return returnArray;
  // } 

});


app.controller('biblePassagesCtrl', function($scope, $http) {
    

$http.get("data/biblePassagesSearch.json").then(function (response) {
  $scope.bookNames = Object.values(response.data.books);
  for(i = 0; i < 66; i++) {
    $scope.bookNames[i].passages = Object.values($scope.bookNames[i].passages);
    // // disp($scope.books[i].passages);
  }
});

$http.get("bible.json").then(function (response) {
  $scope.books = Object.values(response.data.books);
  books = $scope.books;

  var url = getUrlVars();

  var toEnd = false;

  if (url.book) { //if passage submitted

    url.book = decodeURI(url.book.replace("+", " "));
    // // disp(url.book);
    if(!isNaN(url.book)) url.book =  books[url.book-1].name;
    var passage = indicator = "";

    for (b = 0; b < 66; b++) {
      if (url.book == books[b].name) {

        indicator = url.book + " " + url.sc + ":" + url.sv;

        if (!url.ev) {
          url.ev = url.sv;
        } else if (url.ev.toLowerCase() == "end" || url.ev == 999) {
          url.ev = 999;
          toEnd = true;
        } else {
          if (url.ec && url.ec != url.sc) {
            indicator += "-" + url.ec + ":" + url.ev
          }
          else indicator += "-" + url.ev
        }
        
        for(c = Number(url.sc); c <= Number(url.ec); c++) {
          
          if(c == Number(url.sc)) {
            
            for (v = Number(url.sv); v <= 150; v++) {
              if (books[b].chapters[c].verses[v]) {
                passage += books[b].chapters[c].verses[v] + " ";
                // disp("bgn")
                // disp(url.ev)
                // disp(c);
                // disp(v);
              } else {
                // url.ev = v - 1;
                if (toEnd) indicator += "-" + url.ev
                continue;
              }
            }

          } else if (c == Number(url.ec)){
            for (v = 1; v <= Number(url.ev); v++) {
              if (books[b].chapters[c].verses[v]) {
                passage += books[b].chapters[c].verses[v] + " ";
                // disp("end", url.ev, c, v);
              } else {
                // url.ev = v - 1;
                if (toEnd) indicator += "-" + url.ev
                continue;
              }
            }
          } else {
            for (v = 1; v <= 150; v++) {
              if (books[b].chapters[c].verses[v]) {
                passage += books[b].chapters[c].verses[v] + " ";
                // disp("mid", url.ev, c, v);
              } else {
                // url.ev = v - 1;
                if (toEnd) indicator += "-" + url.ev
                continue;
              }
            }
          }
        }

        // for (v = Number(url.sv); v <= Number(url.ev); v++) {
        //   if (books[b].chapters[url.sc].verses[v]) {
        //     passage += books[b].chapters[url.sc].verses[v] + " ";
        //   } else {
        //     url.ev = v - 1;
        //     if (toEnd) indicator += "-" + url.ev
        //     continue;
        //   }
        // }

        $scope.book = url.book;
        $scope.chapter = url.sc;
        $scope.v_prev = url.sv == 1 ? url.sv : url.sv - 1;
        $scope.sv = url.sv;
        $scope.ev = url.ev;
        $scope.v_next = parseInt(url.ev) + 1;
        $scope.passageTextarea = ">**" + indicator + "** - " + passage;
        $scope.indicator = indicator;
        $scope.passage = passage;

        continue;
      }
    }
  }

});



});