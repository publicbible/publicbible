function disp(a){
  // console.trace;
  console.log(a)
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
  msg = msg.replaceAll("*", "");
  msg = msg.replaceAll(">", "");
  msg = msg.replaceAll(" - ", ", ");
  msg = new SpeechSynthesisUtterance(msg);
  var voicesList = speechSynthesis.getVoices();
  msg.voice = voicesList.find((voice) => voice.lang === 'en-us');
  speechSynthesis.speak(msg);
}

function idToVerse(id) {
  var verse = {};
  verse.v_num = Number(id.substring(id.length - 3, id.length));
  verse.c_num = Number(id.substring(id.length - 5, id.length - 3));
  verse.b_num = Number(id.substring(id.length - 8, id.length - 6));

  return verse;
}

function getHTTP(url) {
  fetch(url)
  .then(r => r.json())
  .then(data = function(data){
    console.log(data);
    return data;
  })
  .catch(e => console.log("Booo"));
};