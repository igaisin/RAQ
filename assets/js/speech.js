var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;


// var phrasePara = document.querySelector('.phrase');
var speechResult = document.getElementById('speechResult');
var answer = document.getElementById('answer');

var lastResult = '';

var recognition = new SpeechRecognition();
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

// recognition.onaudiostart = function(event) {
//     //Fired when the user agent has started to capture audio.
//     console.log('SpeechRecognition.onaudiostart');
// }

// recognition.onaudioend = function(event) {
//     //Fired when the user agent has finished capturing audio.
//     console.log('SpeechRecognition.onaudioend');
// }

recognition.onend = function(event) {
  document.getElementById('btnMicStop').style.display = 'none';
  document.getElementById('btnMicStart').style.display = 'block';
  speechResult.innerHTML = "Читай ещё!";
}

// recognition.onnomatch = function(event) {
//     //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
//     console.log('SpeechRecognition.onnomatch');
// }

// recognition.onspeechstart = function (event) {
//     //Fired when sound that is recognised by the speech recognition service as speech has been detected.
//     console.log('SpeechRecognition.onspeechstart');
// }

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
