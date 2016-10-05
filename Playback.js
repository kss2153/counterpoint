var d2 = new Audio('pianoSamples/d2.mp3');
var e2 = new Audio('pianoSamples/e2.mp3');
var f2 = new Audio('pianoSamples/f2.mp3');
var g2 = new Audio('pianoSamples/g2.mp3');
var a2 = new Audio('pianoSamples/a2.mp3');
var b2 = new Audio('pianoSamples/b2.mp3');
var c3 = new Audio('pianoSamples/c3.mp3');
var d3 = new Audio('pianoSamples/d3.mp3');
var e3 = new Audio('pianoSamples/e3.mp3');
var f3 = new Audio('pianoSamples/f3.mp3');
var g3 = new Audio('pianoSamples/g3.mp3');
var a3 = new Audio('pianoSamples/a3.mp3');
var b3 = new Audio('pianoSamples/b3.mp3');
var c4 = new Audio('pianoSamples/c4.mp3');
var d4 = new Audio('pianoSamples/d4.mp3');
var e4 = new Audio('pianoSamples/e4.mp3');
var f4 = new Audio('pianoSamples/f4.mp3');
var g4 = new Audio('pianoSamples/g4.mp3');
var a4 = new Audio('pianoSamples/a4.mp3');
var b4 = new Audio('pianoSamples/b4.mp3');
var c5 = new Audio('pianoSamples/c5.mp3');
var d5 = new Audio('pianoSamples/d5.mp3');
var e5 = new Audio('pianoSamples/e5.mp3');

var timeouts = [];
var currentAudio;

function playNote(num) {
    var tempo = 2.8;
    //window.alert("playing");    
    switch (num) {
        case -5: e5.playbackRate = tempo; e5.play(); break;
        case -4: d5.playbackRate = tempo; d5.play(); break;
        case -3: c5.playbackRate = tempo; c5.play(); break;
        case -2: b4.playbackRate = tempo; b4.play(); break;
        case -1: a4.playbackRate = tempo; a4.play(); break;
        case 0: g4.playbackRate = tempo; g4.play(); break;
        case 1: f4.playbackRate = tempo; f4.play(); break;
        case 2: e4.playbackRate = tempo; e4.play(); break;
        case 3: d4.playbackRate = tempo; d4.play(); break;
        case 4: c4.playbackRate = tempo; c4.play(); break;
        case 5: b3.playbackRate = tempo; b3.play(); break;
        case 6: a3.playbackRate = tempo; a3.play(); break;
        case 7: g3.playbackRate = tempo; g3.play(); break;
        case 8: f3.playbackRate = tempo; f3.play(); break; 
        case 9: e3.playbackRate = tempo; e3.play(); break;
        case 10: d3.playbackRate = tempo; d3.play(); break;
        case 11: c3.playbackRate = tempo; c3.play(); break;
        case 12: b2.playbackRate = tempo; b2.play(); break;
        case 13: a2.playbackRate = tempo; a2.play(); break;
        case 14: g2.playbackRate = tempo; g2.play(); break;
        case 15: f2.playbackRate = tempo; f2.play(); break;
        case 16: e2.playbackRate = tempo; e2.play(); break;
        case 17: d2.playbackRate = tempo; d2.play(); break;
    }
}

function playTwoNotes(num1, num2) {
    playNote(num1);
    playNote(num2);
}

function playLine(noteArray1, noteArray2) {
    for (var i = 0; i < noteArray1.length; i++) {
        //alert(noteArray1.length, noteArray2.length);
        var delay = (i) * 1000;
        //setTimeout(window.alert(delay), delay);
        timeouts.push(setTimeout(playTwoNotes, delay, noteArray1[i], noteArray2[i]));
        //timeouts.push(setTimeout(playNote, delay, noteArray2[i]));
    }
}


