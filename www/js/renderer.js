var horizontalSections = 10;
var verticalSections = 25;

var nextHorizontalSection = 1;
//var inSection = false;

var leftMargin;
var topMargin;
var lineSpacing;

var notePoints = [];
var noteNums = [];

var currentNotePoint;
var currentNoteNum;

var startClick = true;
var clef_image;

var solved = false;

var solutionPoints = [];
var solutionNums = [];

var solutionIndex = 1;
var numberOfSolutions = 0;
var allSolutions = [];

hideButtons();

window.onload = window.onresize = function() {

    var canvas = document.getElementById('myCanvas');  
    canvas.addEventListener('click', staffClick, false);
    canvas.addEventListener('mousemove', staffHover, false);

    canvas.width = window.innerWidth * .95;
    canvas.height = window.innerHeight * .95;
    
    // draw staff
    var roomForClef = canvas.width * .03;

    clef_image = new Image();
    clef_image.src = 'images/treble_clef.png';
    clef_image.onload = function() {
        drawStaffLines();
    }
    resetNotes();

}

function hideButtons() {
    var playButton = document.getElementById('playButton');
    playButton.style.visibility = "hidden";
    var newButton = document.getElementById('newButton');
    newButton.style.visibility = "hidden";
}

function showButtons() {
    var playButton = document.getElementById('playButton');
    playButton.style.visibility = "visible";
    var newButton = document.getElementById('newButton');
    newButton.style.visibility = "visible";
}

function drawStaffLines() {
    var canvas = document.getElementById('myCanvas');  
    var ctx = canvas.getContext("2d");
    var roomForClef = canvas.width * .03;
    leftMargin = canvas.width * .1;
    topMargin = canvas.height * .3;
    lineSpacing = canvas.height * .03;

    ctx.beginPath();
    var currentPos = topMargin;

    ctx.moveTo(leftMargin - roomForClef, currentPos);
    ctx.lineTo(canvas.width - leftMargin, currentPos);

    currentPos = currentPos + lineSpacing;;
    ctx.moveTo(leftMargin - roomForClef, currentPos);
    ctx.lineTo(canvas.width - leftMargin, currentPos);

    currentPos = currentPos + lineSpacing;;
    ctx.moveTo(leftMargin - roomForClef, currentPos);
    ctx.lineTo(canvas.width - leftMargin, currentPos);
    
    currentPos = currentPos + lineSpacing;;
    ctx.moveTo(leftMargin - roomForClef, currentPos);
    ctx.lineTo(canvas.width - leftMargin, currentPos);

    currentPos = currentPos + lineSpacing;;
    ctx.moveTo(leftMargin - roomForClef, currentPos);
    ctx.lineTo(canvas.width - leftMargin, currentPos);
    
    ctx.stroke();

    ctx.closePath();
    drawClef();
}

function drawClef() {
    var canvas = document.getElementById('myCanvas');  
    var c = canvas.getContext("2d");
    var roomForClef = canvas.width * .03;
    c.drawImage(clef_image, leftMargin - roomForClef, 
        topMargin - lineSpacing, roomForClef, lineSpacing * 6.5); 
}

function drawNotes(noteArray, numArray, solutionLine) {
    var canvas = document.getElementById('myCanvas');  
    var c = canvas.getContext("2d");
    var noteSpace = lineSpacing / 2;
    for (var i = 0; i < noteArray.length; i++) {
        c.beginPath();
        var xPos = noteArray[i].x;
        var yPos = noteArray[i].y;
	    var radius = noteSpace * (2/3);
        c.arc(xPos, yPos, radius, 0, 2*Math.PI);
        c.fillStyle = "black";
        c.fill();
        c.closePath();
        c.beginPath();
        if (solutionLine) {
            c.moveTo(xPos + radius, yPos);
            c.lineTo(xPos + radius, yPos - lineSpacing * 2);
        } else {
            c.moveTo(xPos - radius, yPos);
            c.lineTo(xPos - radius, yPos + lineSpacing * 2);
        }
        c.stroke();
        c.closePath(); 
        drawOffStaffLines(numArray[i], c, noteArray[i].x, noteArray[i].y);
    }
}

function staffClick(event) {
    
    if (!startClick) { return; }
    startClick = false;

    if (inSection) {
        solved = false;
        inSection = false;
        nextHorizontalSection++;
        notePoints.push(currentNotePoint);
        noteNums.push(currentNoteNum);
        if (nextHorizontalSection > horizontalSections) {
            shiftNotes();
        }
        drawNotes(notePoints, noteNums, false);
    }

    var canvas = document.getElementById('myCanvas');     
    var mousePos = getMousePos(canvas, event);

    var x = mousePos.x;
    var y = mousePos.y;
    startClick = true;
}

function staffHover(event) {

    var canvas = document.getElementById('myCanvas');     
    var mousePos = getMousePos(canvas, event);
    var x = mousePos.x;
    var y = mousePos.y;

    // check horizontal location of mouse
    var lineLength = canvas.width - 2 * leftMargin; 
    var sectionLength = lineLength / horizontalSections;
    if ((x - leftMargin  > (nextHorizontalSection - 1) * sectionLength) 
            && (x - leftMargin < nextHorizontalSection * sectionLength)) {
        //document.getElementById("test2").innerHTML = "IN SECTION";
        inSection = true;
    } else {
        //document.getElementById("test2").innerHTML = "NOT IN SECTION";
        inSection = false;
        return;
    }



    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    drawStaffLines();
    drawNotes(notePoints, noteNums, false); 
    if (solved) {
        drawNotes(solutionPoints, solutionNums, true);
    }

    // check vertical location of mouse
    var noteSpace = lineSpacing / 2;
    if (inSection && y > topMargin - (noteSpace * 6)
            && y < topMargin + (4 * lineSpacing) + 9*noteSpace) {
        //document.getElementById("test3").innerHTML = "AND WITHIN STAFF";
        drawHoverNote(canvas, y);
    } else {
        //document.getElementById("test3").innerHTML = "NOT WITHIN STAFF"; 
    }

}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    // translate screen coords to canvas coords
    return {
      x: Math.floor((evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width),
      y: Math.floor((evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height)
    };
}

function getNotePoint(noteNumberFromTop, index) {
    var noteSpace = lineSpacing / 2;
    var canvas = document.getElementById('myCanvas');

    var lineLength = canvas.width - 2 * leftMargin; 
    var sectionLength = lineLength / horizontalSections;    
    //var centerX = leftMargin + (nextHorizontalSection * sectionLength) - (sectionLength / 2);
    centerX = notePoints[index].x;
    var centerY = noteNumberFromTop * noteSpace + (topMargin - noteSpace); 

    return {x: centerX, y: centerY};
}

function drawHoverNote(canvas, y) {
    var noteSpace = lineSpacing / 2;
    // could change topmargin to the highest allowed note
    var dist = y - (topMargin - noteSpace);
    var noteNumberFromTop = Math.floor(dist / noteSpace); 
    currentNoteNum = noteNumberFromTop;    

    var lineLength = canvas.width - 2 * leftMargin; 
    var sectionLength = lineLength / horizontalSections;    
    var centerX = leftMargin + (nextHorizontalSection * sectionLength) - (sectionLength / 2);
    var centerY = noteNumberFromTop * noteSpace + (topMargin - noteSpace); 

    currentNotePoint = {x: centerX, y: centerY};
    //document.getElementById("demo").innerHTML = noteNumberFromTop;;

    //var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext("2d");

    drawOffStaffLines(noteNumberFromTop, ctx, centerX, centerY);

    ctx.beginPath();
    ctx.arc(centerX, centerY,noteSpace/2,0,2*Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

} 

function drawOffStaffLines(noteNumberFromTop, ctx, centerX, centerY) {
    var noteSpace = lineSpacing / 2;
    ctx.beginPath();
    if (noteNumberFromTop < 0 || noteNumberFromTop > 10) {
        var currentLine = noteNumberFromTop;
        if (noteNumberFromTop % 2 == 1) {
            var i = 0;
            while (currentLine > 10) {
                ctx.moveTo(centerX - noteSpace, centerY - (i * lineSpacing));
                ctx.lineTo(centerX + noteSpace, centerY - (i * lineSpacing));
                currentLine -= 2;
                i++;
            }
        } else if (noteNumberFromTop % 2 == -1) {
            var i = 0;
            while (currentLine < 0) {
                ctx.moveTo(centerX - noteSpace, centerY + (i * lineSpacing));
                ctx.lineTo(centerX + noteSpace, centerY + (i * lineSpacing));
                currentLine += 2;
                i++;
            }
        } else if (noteNumberFromTop % 2 == 0) {
            var dir;
            if (noteNumberFromTop < 0) {
                dir = 1;
                var i = 0;
                while (currentLine < -1) {
                    ctx.moveTo(centerX - noteSpace, centerY + dir * noteSpace + (i * lineSpacing));
                    ctx.lineTo(centerX + noteSpace, centerY + dir * noteSpace + (i * lineSpacing));
                    currentLine += 2;
                    i++;
                }

            } else {
                dir = -1;
		var i = 0;
                while (currentLine > 11) {
                    ctx.moveTo(centerX - noteSpace, centerY + dir * noteSpace - (i * lineSpacing));
                    ctx.lineTo(centerX + noteSpace, centerY + dir * noteSpace - (i * lineSpacing));
                    currentLine -= 2;
                    i++;
                }
            } 
        }
        ctx.stroke();
    }
    ctx.closePath();
}

function shiftNotes() {
    horizontalSections++;
    var canvas = document.getElementById('myCanvas');
    var lineLength = canvas.width - 2 * leftMargin; 
    var sectionLength = lineLength / horizontalSections;
    for (var i = 0; i < notePoints.length; i++) {
        notePoints[i].x = leftMargin + ((i + 1) * sectionLength) - (sectionLength / 2);
    }
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    drawStaffLines();
}

function resetNotes() {
    solved = false;

    horizontalSections = 10;
    nextHorizontalSection = 1;
    notePoints = [];
    noteNums = [];
    
    var canvas = document.getElementById('myCanvas');
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    drawStaffLines();

    hideButtons();
}

function solve() {
    //solved = true; 
    if (noteNums.length === 0) {
        return;
    } 
   
    //var cf = [ 1, 5 , 6, 8,  5, 10, 8, 5, 6, 5, 3, 1 ];
    //var cf = [ 1, 5 , 6, 1];
    var cf = convertNumFromTop();
    var cf2 = [];
    var l1 = intToNote(cf);
    var l2 = intToNote(cf2);
    var a = [];
    
    search(l1.length, a, l2, l1);
    numberOfSolutions = a.length;
    allSolutions = a;
    if (numberOfSolutions === 0) {
        return;
    }

/*  var res = "";
    for (var i = 0; i < a[1].length; i++) {
        res += a[1][i].noteNumber + ", ";
    }
    document.getElementById("demo").innerHTML = ""+res;
*/

    // arbitrarily chose a[1] -- need to insert optimization algorith
    // and get another solution button
    drawSolution();
    showButtons();
/*
    solutionPoints = [];
    solutionNums = convertToTop(a[solutionIndex]);
    for (var i = 0; i < solutionNums.length; i++) {
        solutionPoints.push(getNotePoint(solutionNums[i], i));
    }
    drawNotes(solutionPoints, solutionNums, true); 
    solved = true;
*/
}

function drawSolution() {
    if (numberOfSolutions === 0) {
        return;
    }
    solutionPoints = [];
    solutionNums = convertToTop(allSolutions[solutionIndex]);
    for (var i = 0; i < solutionNums.length; i++) {
        solutionPoints.push(getNotePoint(solutionNums[i], i));
    }
    //play();
    drawNotes(solutionPoints, solutionNums, true); 
    solved = true;
}

function next() {
    solutionIndex++;
    newSolution();    
}

function last() {
    solutionIndex--;
    newSolution();    
}

function newSolution() {
    if (!solved) {
        return;
    }

    if (solutionIndex + 1 === numberOfSolutions) {
        window.alert("no more solutions");
        return;
    }

    solutionIndex++;
    var canvas = document.getElementById('myCanvas');
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    drawStaffLines();
    drawNotes(notePoints, noteNums, false);
    //solve();
    drawSolution();
}

function convertNumFromTop() {
    var converted = [];
    for (var i = 0; i < noteNums.length; i++) {
        var num = noteNums[i];
        switch (num) {
            case -5: converted.push(29); break;
	    case -4: converted.push(27); break;
            case -3: converted.push(25); break;
            case -2: converted.push(24); break;
            case -1: converted.push(22); break;
            case 0: converted.push(20); break;
            case 1: converted.push(18); break;
            case 2: converted.push(17); break;
            case 3: converted.push(15); break;
            case 4: converted.push(13); break;
            case 5: converted.push(12); break;
            case 6: converted.push(10); break;
            case 7: converted.push(8); break;
            case 8: converted.push(6); break; 
            case 9: converted.push(5); break;
            case 10: converted.push(3); break;
            case 11: converted.push(1); break;
            case 12: converted.push(0); break;
            case 13: converted.push(-2); break;
            case 14: converted.push(-4); break;
            case 15: converted.push(-6); break;
            case 16: converted.push(-7); break;
            case 17: converted.push(-9); break;
        }
    }
    return converted;
}

function convertToTop(solution) {
    var converted = [];
    var times = 0;
    for (var i = 0; i < solution.length; i++) {
        times = i;
        var num = solution[i].noteNumber;
        switch (num) {
            case 29: converted.push(-5); break;
            case 27: converted.push(-4); break;
            case 25: converted.push(-3); break;
            case 24: converted.push(-2); break;
            case 22: converted.push(-1); break;
            case 20: converted.push(0); break;
            case 18: converted.push(1); break;
            case 17: converted.push(2); break;
            case 15: converted.push(3); break;
            case 13: converted.push(4); break;
            case 12: converted.push(5); break;
            case 10: converted.push(6); break;
            case 8: converted.push(7); break;
            case 6: converted.push(8); break; 
            case 5: converted.push(9); break;
            case 3: converted.push(10); break;
            case 1: converted.push(11); break;
            case 0: converted.push(12); break;
            case -2: converted.push(13); break;
            case -4: converted.push(14); break;
            case -6: converted.push(15); break;
            case -7: converted.push(16); break;
            case -9: converted.push(17); break;
        }
    }
    return converted;
}

function play() {
    
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    if (solutionNums.length > 0) {
        //window.alert("play function");
        playLine(solutionNums, noteNums);
    }
}