var speechResult = document.getElementById('speechResult');
var answer = document.getElementById('answer');

var lastResult = '';

var recognition = new webkitSpeechRecognition();
recognition.lang = 'ar';
recognition.interimResults = true;
recognition.continuous = true;

recognition.onresult = function(event) {
  var final = "";
  var interim = "";
  for (var i = 0; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final += event.results[i][0].transcript;
    } else {
      interim += event.results[i][0].transcript;
    }
  }
  if (final != "") {
    lastResult = final;
  } else {
    speechResult.innerHTML = interim;
  }
}

recognition.onspeechend = function() {
  
}

recognition.onerror = function(event) {
  document.getElementById('btnMicStop').style.display = 'none';
  document.getElementById('btnMicStart').style.display = 'block';
  speechResult.innerHTML = 'Прочитай еще раз! Ошибка:' + event.error;
  answer.innerHTML = "";
}

// recognition.onaudiostart = function(event) {}

// recognition.onaudioend = function(event) {}

recognition.onend = function(event) {
  document.getElementById('btnMicStop').style.display = 'none';
  document.getElementById('btnMicStart').style.display = 'block';
  speechResult.innerHTML = "Читай ещё!";
}

// recognition.onnomatch = function(event) {}

// recognition.onspeechstart = function (event) {}

recognition.onstart = function(event) {
  speechResult.innerHTML = "Слушаю!";
  answer.innerHTML = "Ищу ответ!";
  document.getElementById('btnMicStart').style.display = 'none';
  document.getElementById('btnMicStop').style.display = 'block';
}


function recStart() {  
  recognition.start();
}

function recStop() { 
  recognition.stop();
}
