if ("serviceWorker" in navigator) {
  if (navigator.serviceWorker.controller) {
    console.log("[PWA Builder] active service worker found, no need to register");
  } else {
    navigator.serviceWorker
      .register("pwabuilder-sw.js", {
        scope: "./"
      })
      .then(function(reg) {
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

        myObject.book = selected.book;
        myObject.chapter = selected.chapter;
        myObject.v_prev = selected.v_start == 1 ? selected.v_start : selected.v_start - 1;
        myObject.v_start = selected.v_start;
        myObject.v_end = selected.v_end;
        myObject.v_next = parseInt(selected.v_end) + 1;
        myObject.passageTextarea = ">**" + indicator + "** - " + passage;
        myObject.passage = "<b>" + indicator + "</b> - " + passage;

        continue;
      }
    }
  }

  if (selected.search) {
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
    document.getElementById("search-field").value = searchTerm;
    if(results.length > 0) w3.show("#display-search-results");
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



function summ(id) {
  var text = document.getElementById(id).innerText;
  text = text.replaceAll("\n\n", "\n");
  text = text.replaceAll("\n\n", "\n");
  text = text.replaceAll("\n\n", "\n");
  text = text.replaceAll("\n", "||");
  text = text.replaceAll(". ", ".||");
  text = text.replaceAll(".\n", ".||\n");
  text = text.replaceAll("\n", "");

  var sentences = text.split("||");
  sentences = getLongMembers(sentences, 5);

  disable('summarize-button');
  var copyBtn = document.getElementById('summarize-button');
  copyBtn.innerText = "Summ'd!"
  document.getElementById(id).innerText = sentences.join("\n\n");;
  sentences = null;
}

function getRandomMembers(arr, n) {
  // console.log(arr, n);
  const shuffled = arr.sort(() => 0.5 - Math.random());
  let result = shuffled.slice(0, n);
  return result;
}

function getLongMembers(arr, n) {
  // console.log(arr, n);
  const ordered = arr.sort((a, b) => b.length - a.length);
  let result = ordered.slice(0, n);
  return result;
}


hide('md');
hide('copy-button');

function reload() {
  location.reload();
}

function toHTML(inId, outId) {
  var input = document.getElementById(inId);
  var output = document.getElementById(outId);
  var html = input.innerHTML;
  input.innerText = html;
  output.value = html;
  // hide('tohtml-button');
  hide('tomd-button');
  show('copy-button');
  hide(inId);
  show(outId);
}

function toMD(inId, outId) {
  var input = document.getElementById(inId);
  var inputHeight = input.offsetHeight;
  var output = document.getElementById(outId);
  output.style.height = inputHeight+"px";
  console.log(inputHeight);
  var turndownService = new window.TurndownService({
    "headingStyle": "atx",
    "hr": "- - -",
    "bulletListMarker": "-",
    "codeBlockStyle": "indented",
    "fence": "```",
    "emDelimiter": "*",
    "strongDelimiter": "**",
    "linkStyle": "inlined",
    "linkReferenceStyle": "full"
  });

  var tables = turndownPluginGfm.tables
  turndownService.use([tables])
  markdown = turndownService.turndown(input.innerHTML)
  input.innerText = markdown;
  output.value = markdown;
  // hide('tohtml-button');
  hide('tomd-button');
  show('copy-button');
  hide(inId);
  show(outId);
}

function copyContent(id) {
  let elem = document.getElementById(id);
  elem.select();
  document.execCommand("copy");
  disable('copy-button');
  var copyBtn = document.getElementById('copy-button');
  copyBtn.innerText = "Copied!"
}

function copyInnerHTML(e) {
  //TODO: get the new bible json with proper verse ids
  var textToCopy = document.querySelector(e);
  var textBox = document.querySelector(".clipboard");
  textBox.setAttribute('value', textToCopy.innerHTML);

  textBox.select();
  document.execCommand('copy');
}

function show(id) {
  document.getElementById(id).style.display = '';
}
function hide(id) {
  document.getElementById(id).style.display = 'none';
}
function enable(id) {
  document.getElementById(id).disabled = false;
}
function disable(id) {
  document.getElementById(id).disabled = true;
}
