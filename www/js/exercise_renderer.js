var horizontalSections = 10;
var verticalSections = 25;
var nextHorizontalSection = 1;
var inSection = false;

var currentNotePoint;
var currentNoteNum;

var startClick = true;

var leftMargin;
var topMargin;
var lineSpacing;

var notePoints = [];
var noteNums = [];

function drawStaffLines(canvas) {
    var ctx = canvas.getContext("2d")
    var roomForClef = canvas.width * .03;
    leftMargin = canvas.width * .1;
    topMargin = canvas.height * .4;
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
}

function drawClef(canvas, clef_image) {
    var c = canvas.getContext("2d");
    var roomForClef = canvas.width * .03;
    c.drawImage(clef_image, leftMargin - roomForClef, 
        topMargin - lineSpacing, roomForClef, lineSpacing * 6.5); 
}

function drawNotes(noteArray, numArray, solutionLine) {
    console.log(numArray)
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

function staff_click(event) {
    
}
    
function staff_hover(event) {
    
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
    console.log(leftMargin)
    centerX = leftMargin + ((index + 1) * sectionLength) - (sectionLength / 2);
    var centerY = noteNumberFromTop * noteSpace + (topMargin - noteSpace); 

    return {x: centerX, y: centerY};
}

function drawCantusFirmus() {
    console.log(Exercise)
    notes = Exercise.cantus_firmus
    console.log(notes)
    horizontalSections = notes.length
    points = [];
    staff_nums = convertToTop(notes);
    console.log(staff_nums)
    for (var i = 0; i < staff_nums.length; i++) {
        points.push(getNotePoint(staff_nums[i], i));
    }
    console.log(points)
    drawNotes(points, staff_nums, false); 
}

function convertToTop(note_list) {
    var converted = [];
    for (var i = 0; i < note_list.length; i++) {
        var num = note_list[i].note_number + Exercise.key_center;
        console.log(num)
        switch (num) {
            case 88: converted.push(-5); break;
            case 86: converted.push(-4); break;
            case 84: converted.push(-3); break;
            case 83: converted.push(-2); break;
            case 81: converted.push(-1); break;
            case 79: converted.push(0); break;
            case 77: converted.push(1); break;
            case 76: converted.push(2); break;
            case 74: converted.push(3); break;
            case 72: converted.push(4); break;
            case 71: converted.push(5); break;
            case 69: converted.push(6); break;
            case 67: converted.push(7); break;
            case 65: converted.push(8); break; 
            case 64: converted.push(9); break;
            case 62: converted.push(10); break;
            case 60: converted.push(11); break;
            case 59: converted.push(12); break;
            case 57: converted.push(13); break;
            case 55: converted.push(14); break;
            case 53: converted.push(15); break;
            case 52: converted.push(16); break;
            case 50: converted.push(17); break;
        }
    }
    return converted;
}

