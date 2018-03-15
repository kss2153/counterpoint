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

var solutionPoints = [];
var solutionNums = [];

var solution_obj = new Solution()

var all_solutions = []

function render_exercise() {
    var canvas = document.getElementById('myCanvas');   
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    drawStaffLines(canvas);
    drawClef(canvas, clef_image)
    drawCantusFirmus()
    drawNotes(notePoints, noteNums, false); 
    drawNotes(solutionPoints, solutionNums, true);
}

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
    if (!startClick) { return; }
    startClick = false;

    var alert = document.getElementById('alert')
    alert.style.visibility = 'hidden'

    if (inSection) {
        inSection = false;
        solutionPoints.push(currentNotePoint);
        solutionNums.push(currentNoteNum);
        if (check_note()) {
            state_stack_nums.pop()
            state_stack_notes.pop()
            state_stack_points.pop()
            drawNotes(solutionPoints, solutionNums, true);
            nextHorizontalSection++;
            persist()            
        }
    }
    startClick = true;
}
    
function staff_hover(event) {

    if (nextHorizontalSection > horizontalSections) {
        return;
    }

    var canvas = document.getElementById('myCanvas');     
    var mousePos = getMousePos(canvas, event);
    var x = mousePos.x;
    var y = mousePos.y;

    // check horizontal location of mouse
    var lineLength = canvas.width - 2 * leftMargin; 
    var sectionLength = lineLength / horizontalSections;
    inSection = (x - leftMargin  > (nextHorizontalSection - 1) * sectionLength) 
            && (x - leftMargin < nextHorizontalSection * sectionLength)

    render_exercise()

    // check vertical location of mouse
    var noteSpace = lineSpacing / 2;
    if (inSection && y > topMargin - (noteSpace * 6)
            && y < topMargin + (4 * lineSpacing) + 9*noteSpace) {
        drawHoverNote(canvas, y);
    }
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
    var ctx = canvas.getContext("2d");

    drawOffStaffLines(noteNumberFromTop, ctx, centerX, centerY);

    ctx.beginPath();
    ctx.arc(centerX, centerY,noteSpace/2,0,2*Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
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
    centerX = leftMargin + ((index + 1) * sectionLength) - (sectionLength / 2);
    var centerY = noteNumberFromTop * noteSpace + (topMargin - noteSpace); 
    return {x: centerX, y: centerY};
}

function drawCantusFirmus() {
    notes = Exercise.cantus_firmus
    horizontalSections = notes.length
    points = [];
    staff_nums = convertToTop(notes);
    for (var i = 0; i < staff_nums.length; i++) {
        points.push(getNotePoint(staff_nums[i], i));
    }
    noteNums = staff_nums
    notePoints = points
    drawNotes(points, staff_nums, false); 
}

function convertToTop(note_list) {
    var converted = [];
    for (var i = 0; i < note_list.length; i++) {
        var num = note_list[i].note_number + Exercise.key_center;
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

function convertNumFromTop() {
    var converted = [];
    for (var i = 0; i < noteNums.length; i++) {
        var num = solutionNums[i];
        switch (num) {
            case -5: converted.push(88); break;
	        case -4: converted.push(86); break;
            case -3: converted.push(84); break;
            case -2: converted.push(83); break;
            case -1: converted.push(81); break;
            case 0: converted.push(79); break;
            case 1: converted.push(77); break;
            case 2: converted.push(76); break;
            case 3: converted.push(74); break;
            case 4: converted.push(72); break;
            case 5: converted.push(71); break;
            case 6: converted.push(69); break;
            case 7: converted.push(67); break;
            case 8: converted.push(65); break; 
            case 9: converted.push(64); break;
            case 10: converted.push(62); break;
            case 11: converted.push(60); break;
            case 12: converted.push(59); break;
            case 13: converted.push(57); break;
            case 14: converted.push(55); break;
            case 15: converted.push(53); break;
            case 16: converted.push(52); break;
            case 17: converted.push(50); break;
        }
    }
    return converted;
}

function check_note(note) {
    var solution = convertNumFromTop()
    var idx = solution.length - 1
    var note = solution[idx]
    var first = solution.length === 1
    var next = new RelativeNote(note - Exercise.key_center , first)
    next.harmonic_interval = next.note_number - Exercise.cantus_firmus[idx].note_number
    if (!first) {
        var prev = solution_obj.notes[idx - 1]
        next.melodic_interval = next.note_number - prev.note_number
    }

    verbose = true
    if (run_checks(next, Exercise.cantus_firmus, solution_obj)) {
        solution_obj.notes.push(next)
        if (next.harmonic_interval in solution_obj.perfects) {
            solution_obj.perfects[next.harmonic_interval]++
        } 
        verbose = false
        all_solutions = []
        search(all_solutions, Exercise.cantus_firmus.length - solution.length, Exercise.cantus_firmus, solution_obj)
        console.log(all_solutions.length)
        return true
    } else {
        solutionNums.pop()
        solutionPoints.pop()
        return false
    }
    
}

function persist() {
    state = {
        'solution': solution_obj,
        'nums': solutionNums,
        'points': solutionPoints,
        'next': nextHorizontalSection
    }
    localStorage.setItem('state', JSON.stringify(state))
}

var state_stack_nums = []
var state_stack_points = []
var state_stack_notes = []

function undo() {
    if (nextHorizontalSection == 1)
        return
    var last = solution_obj.notes.pop()
    state_stack_notes.push(last)
    if (last.harmonic_interval in solution_obj.perfects) {
        solution_obj.perfects[last.harmonic_interval]--
    } 
    state_stack_nums.push(solutionNums.pop())
    state_stack_points.push(solutionPoints.pop())
    nextHorizontalSection--
    persist()
    render_exercise()
}

function redo() {
    if (state_stack_notes.length > 0) {
        nextHorizontalSection++
        solutionNums.push(state_stack_nums.pop())
        solutionPoints.push(state_stack_points.pop())
        solution_obj.notes.push(state_stack_notes.pop())
        render_exercise()
    }
}