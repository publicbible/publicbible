if ("serviceWorker" in navigator) {
  if (navigator.serviceWorker.controller) {
    console.log("[PWA Builder] active service worker found, no need to register");
  } else {
    navigator.serviceWorker
      .register("pwabuilder-sw.js", {
        scope: "./"
      })
      .then(function (reg) {
        console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
      });
  }
}

w3.hide("#display-passage");
w3.hide("#display-search-results");


w3.getHttpObject("bible.json", myFunction);

function myFunction(myObject) {

  var b, c, v, ot = [], nt = [];
  var books = myObject.books;
  var booksNum = Object.size(books); //number of books

  for (b = 1; b <= booksNum; b++) {
    var bk = [];
    bk.id = b;
    bk.name = books[b].name;
    if(b <= 39) {
      ot.push(bk);
    }
    if(b >= 40) {
      nt.push(bk);
    }

    myObject.ot = ot;
    myObject.nt = nt;
    
  }

  var selected = getUrlVars();
  var toEnd = false;

  if (selected.book) { //if passage submitted

    w3.show("#display-passage");
    selected.book = decodeURI(selected.book.replace("+", " "));
    if(!isNaN(selected.book)) selected.book =  books[selected.book].name;
    var passage = indicator = "";

    for (b = 1; b <= booksNum; b++) {
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

        myObject.book = selected.book,
        myObject.chapter = selected.chapter,
        myObject.v_prev = selected.v_start == 1 ? selected.v_start : selected.v_start - 1,
        myObject.v_start = selected.v_start,
        myObject.v_end = selected.v_end,
        myObject.v_next = parseInt(selected.v_end) + 1,
        myObject.passage = ">**" + indicator + "** - " + passage;

        continue;
      }
    }
  }

  if (selected.search) {
    w3.show("#display-search-results");
    searchTerm = decodeURI(selected.search.replaceAll("+", " ")).toLowerCase();
    var result = [];
    var results = [];
    for (b = 1; b <= booksNum; b++) {
      for (c = 1; c <= Object.keys(books[b].chapters).length; c++) {
        for (v = 1; v <= Object.keys(books[b].chapters[c].verses).length; v++) {
          verseText = books[b].chapters[c].verses[v];
          if (verseText.toLowerCase().indexOf(searchTerm) >= 0) {
            result = {
              book: books[b].name,
              chapter: c,
              verse: v,
              text: verseText
            }
            results.push(result);
          }
        }
      }
    }
    myObject.searchResults = results;
  }

  //TODO: add search results for each word, when there are multiple words

  w3.displayObject("passage-selector", myObject);
}

Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

function copyText(id) {
  var txt = document.getElementById(id);

  txt.select();
  txt.setSelectionRange(0, 99999); /* For mobile devices */

  document.execCommand("copy");
}

function copyInnerHTML(e) {
  //TODO: get the new bible json with proper verse ids
  var textToCopy = document.querySelector(e);
  var textBox = document.querySelector(".clipboard");
  textBox.setAttribute('value', textToCopy.innerHTML);

  textBox.select();
  document.execCommand('copy');
}

function listen(id) {
  var msg = document.getElementById(id).value;
  msg = msg.replaceAll("*","");
  msg = msg.replaceAll(">","");
  msg = msg.replaceAll(" - ",", ");
  msg = new SpeechSynthesisUtterance(msg);
  var voicesList = speechSynthesis.getVoices();
  msg.voice = voicesList.find((voice) => voice.lang === 'en-us');
  speechSynthesis.speak(msg);
}