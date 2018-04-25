var curHorizontalSection = 1;
var horizontalSections = 10;
var verticalSections = 25;
var nextHorizontalSection = 1;
var inSection = false;
var inNextSection = false;

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
var solutionPos = [];

var solution_obj = new Solution()

var all_solutions = []
var fut_notepoints = {}
var fut_notenums= {}
var wrongNote = -1

var accidentals = {}
var writing_acc = 0

var submitted = false

function render_exercise() {
    var canvas = document.getElementById('myCanvas');   
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    if (nextHorizontalSection > Exercise.cantus_firmus.length || 
            (is_complete() && wrongNote==-1) 
            && submitted) {
        var alert = document.getElementById('success')
        alert.style.visibility = 'visible'
    } else {
        var alert = document.getElementById('success')
        alert.style.visibility = 'hidden'
    }

    var roomForClef = canvas.width * .03;
    leftMargin = canvas.width * .1 + roomForClef;
    topMargin = canvas.height * .6;
    lineSpacing = canvas.height * .02;
    
    drawClef(canvas, bass_clef_image)
    if (!Exercise.upper_cp) {
        drawNotes(solutionPoints, solutionNums, true);
        drawSolutionLine()
    }
    drawSharps('bass')
    drawStaffLines(canvas);
    topMargin = canvas.height * .45;
    drawClef(canvas, alto_clef_image)
    drawCantusFirmus()
    drawSharps('alto')
    drawStaffLines(canvas);
    topMargin = canvas.height * .3;
    drawClef(canvas, treble_clef_image)
    if (Exercise.upper_cp) {
        drawNotes(solutionPoints, solutionNums, true);
        drawSolutionLine()
    }
    drawSharps('treble')
    drawStaffLines(canvas);
    drawBarLines()
    drawBrace(canvas, brace_image)

    drawWrongCircle()

    if (Exercise.upper_cp) {
        topMargin = canvas.height * .3;
    } else {
        topMargin = canvas.height * .6;
    }
    
}

function drawStaffLines(canvas) {
    var ctx = canvas.getContext("2d")
    var roomForClef = canvas.width * .03;

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

function drawBrace(canvas, brace_image) {
    var c = canvas.getContext("2d");
    var braceWidth = canvas.width * .015;
    var roomForClef = canvas.width * .03;

    c.drawImage(brace_image, leftMargin - roomForClef - braceWidth * 2, 
        canvas.height * 0.3 - lineSpacing/2, braceWidth, canvas.height * 0.3 + lineSpacing*5); 
}

function drawBarLines() {
    var canvas = document.getElementById('myCanvas'); 
    var c = canvas.getContext("2d");
    var roomForClef = canvas.width * .03;
    var lineLength = canvas.width - 2 * leftMargin - roomForClef; 
    var sectionLength = lineLength / horizontalSections;

    c.beginPath()
    for (var i = 1; i <= Exercise.cantus_firmus.length; i++) {
        var cur_x = leftMargin + sectionLength*i + roomForClef
        c.moveTo(cur_x, topMargin)
        c.lineTo(cur_x, canvas.height * .6 + lineSpacing*4)
    }
    c.moveTo(cur_x - canvas.width * .005, topMargin)
    c.lineTo(cur_x - canvas.width * .005, canvas.height * .6 + lineSpacing*4)
    c.stroke()
    c.closePath()


}

function drawNotes(noteArray, numArray, solutionLine) {
    var canvas = document.getElementById('myCanvas');  
    var c = canvas.getContext("2d");
    var noteSpace = lineSpacing / 2;
    for (var i = 0; i < noteArray.length; i++) {
        if (noteArray[i] == undefined)
            continue
        c.beginPath();
        var xPos = noteArray[i].x;
        var yPos = noteArray[i].y;
        
	    var radius = noteSpace * (2/3);
        //c.arc(xPos, yPos, radius, 0, 2*Math.PI);
        c.ellipse(xPos, yPos,radius*1.2, radius, 0, 0, 2*Math.PI, false)
        c.fillStyle = "black";
        if (solutionLine && accidentals[solutionPos[i]] == 1) {
            c.font = "15px Arial";
            c.fillText('♯',xPos - noteSpace*2.5,yPos+noteSpace/2);
        }
        if (solutionLine && accidentals[solutionPos[i]] == -1) {
            c.font = "15px Arial";
            c.fillText('♭',xPos - noteSpace*2.5,yPos+noteSpace/2);
        }
        if (solutionLine && accidentals[solutionPos[i]] == 2) {
            c.font = "15px Arial";
            c.fillText('♮',xPos - noteSpace*2.5,yPos+noteSpace/2);
        }

        //c.lineWidth = 3
        c.fill();
        c.closePath();
        c.beginPath();
        c.ellipse(xPos, yPos,radius*0.5, radius*0.9, 0, 0, 2*Math.PI, false)
        c.fillStyle = "white";
        c.fill()
        //c.lineWidth = 1
        c.closePath();
        // c.beginPath();
        // if (solutionLine) {
        //     c.moveTo(xPos + radius, yPos);
        //     c.lineTo(xPos + radius, yPos - lineSpacing * 2);
        // } else {
        //     c.moveTo(xPos - radius, yPos);
        //     c.lineTo(xPos - radius, yPos + lineSpacing * 2);
        // }
        // c.stroke();
        // c.closePath(); 
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

function add_from_dict() {
    solutionPoints.push(fut_notepoints[nextHorizontalSection-1]);
    solutionNums.push(fut_notenums[nextHorizontalSection-1]);
    delete fut_notepoints[nextHorizontalSection-1]
    delete fut_notenums[nextHorizontalSection-1]
}

function staff_click(event) {
    if (!startClick) { return; }
    startClick = false;
    submitted = false;

    var alert = document.getElementById('alert')
    alert.style.visibility = 'hidden'

    wrongNote = -1

    if (Exercise.checking) {
        if (inNextSection && inSection) {
            inSection = false;
            solutionPoints.push(currentNotePoint);
            solutionNums.push(currentNoteNum);
            if (check_note()) {
                state_stack_nums.pop()
                state_stack_notes.pop()
                state_stack_points.pop()
                render_exercise()
                nextHorizontalSection++;
                while ((nextHorizontalSection-1) in fut_notenums) {
                    add_from_dict()
                    if (check_note())
                        nextHorizontalSection++
                }
                render_exercise()
                persist()            
            }
        } else if (inSection) {
            fut_notenums[curHorizontalSection-1] = currentNoteNum
            fut_notepoints[curHorizontalSection-1] = currentNotePoint
            render_exercise()
        }
    } else {
        fut_notenums[curHorizontalSection-1] = currentNoteNum
        fut_notepoints[curHorizontalSection-1] = currentNotePoint
        solutionPos.push(curHorizontalSection-1)
        accidentals[curHorizontalSection-1] = writing_acc
        render_exercise()
        if (is_complete()) {
            showSubmitButton()
            // check_answer()
        }
    }
    
    startClick = true;
}

function is_complete() {
    var complete = true
    if (Exercise.entire) {
        complete = (get_fut_notenums().length == Exercise.cantus_firmus.length)
    } else if (Exercise.beginning) {
        for (var i = 0; i < 3; i++) {
            if (!(i in fut_notenums))
                complete = false
        }
        if (get_fut_notenums().length != 3) complete = false
    } else if (Exercise.climax) {
        var sorted = []
        for (var key in fut_notenums) {
            sorted.push(parseInt(key))
        }
        sorted.sort(function(a, b){return a - b})
        for (var i = 1; i < sorted.length; i++) {
            if (sorted[i] != sorted[i-1] + 1)
                complete = false
        }
        if (get_fut_notenums().length != 3) complete = false
    } else if (Exercise.end) {
        var l = Exercise.cantus_firmus.length
        for (var i = l - 1; i > l - 4; i--) {
            if (!(i in fut_notenums))
                complete = false
        }
        if (get_fut_notenums().length != 3) complete = false
    }
    return complete
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
    curHorizontalSection = Math.ceil((x- leftMargin) / sectionLength);
    if (curHorizontalSection > Exercise.cantus_firmus.length)
        curHorizontalSection = Exercise.cantus_firmus.length
    if (curHorizontalSection < 1)
        curHorizontalSection = 1
    
    // inSection = (x - leftMargin  > (nextHorizontalSection - 1) * sectionLength) 
    //         && (x - leftMargin < nextHorizontalSection * sectionLength)
        
    inNextSection = (x - leftMargin  > (nextHorizontalSection - 1) * sectionLength) 
            && (x - leftMargin < nextHorizontalSection * sectionLength)
    inSection = (x - leftMargin  > (curHorizontalSection - 1) * sectionLength) 
            && (x - leftMargin < curHorizontalSection * sectionLength)
    // console.log(inNextSection)
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

    var lineLength = canvas.width - 2 * leftMargin - 0.03*canvas.width; 
    var sectionLength = lineLength / horizontalSections;    
    // var centerX = leftMargin + 0.03*canvas.width + (nextHorizontalSection * sectionLength) - (sectionLength * 8 / 10);
    var centerX = leftMargin + 0.03*canvas.width + (curHorizontalSection * sectionLength) - (sectionLength * 8 / 10);
    var centerY = noteNumberFromTop * noteSpace + (topMargin - noteSpace); 

    currentNotePoint = {x: centerX, y: centerY};
    var ctx = canvas.getContext("2d");

    drawOffStaffLines(noteNumberFromTop, ctx, centerX, centerY);

    ctx.beginPath();
    ctx.arc(centerX, centerY,noteSpace/2,0,2*Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.font = "15px Arial";
    if (writing_acc == 1)
        ctx.fillText('♯',centerX - noteSpace*2.5,centerY+noteSpace/2);
    else if (writing_acc == -1)
        ctx.fillText('♭',centerX - noteSpace*2.5,centerY+noteSpace/2);
    else if (writing_acc == 2)
        ctx.fillText('♮',centerX - noteSpace*2.5,centerY+noteSpace/2);
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

function get_fut_notenums() {
    var sorted = []
    for (var key in fut_notenums) {
        sorted.push(parseInt(key))
    }
    sorted.sort(function(a, b){return a - b})
    solutionPos = sorted
    result = []
    for (var i =0; i < sorted.length; i++) {
        result.push(fut_notenums[sorted[i]])
    }
    return result
}

function get_fut_notepoints() {
    var sorted = []
    for (var key in fut_notenums) {
        sorted.push(parseInt(key))
    }
    sorted.sort(function(a, b){return a - b})
    result = []
    for (var i =0; i < sorted.length; i++) {
        result.push(fut_notepoints[sorted[i]])
    }
    return result
}


function getNotePoint(noteNumberFromTop, index) {
    var noteSpace = lineSpacing / 2;
    var canvas = document.getElementById('myCanvas');

    var lineLength = canvas.width - 2 * leftMargin - 0.03*canvas.width; 
    var sectionLength = lineLength / horizontalSections;    
    var centerX = leftMargin +0.03*canvas.width + ((index + 1) * sectionLength) - (sectionLength * 8 / 10);
    var centerY = noteNumberFromTop * noteSpace + (topMargin - noteSpace); 
    return {x: centerX, y: centerY};
}

function drawCantusFirmus() {
    notes = Exercise.cantus_firmus
    horizontalSections = notes.length
    points = [];
    var staff_nums = convertToTopAlto(notes);
    for (var i = 0; i < staff_nums.length; i++) {
        points.push(getNotePoint(staff_nums[i], i));
    }
    noteNums = staff_nums
    notePoints = points
    drawNotes(points, staff_nums, false); 
}

function drawSolutionLine() {
    for (var pos in fut_notenums) {
        pos = parseInt(pos)
        var tuple = getNotePoint(fut_notenums[pos], pos)
        fut_notepoints[pos] = tuple
    }
    drawNotes(get_fut_notepoints(), get_fut_notenums(), true)
    return true
}

function convertToTopAlto(note_list) {
    var converted = [];
    for (var i = 0; i < note_list.length; i++) {
        var num = note_list[i].note_number + Exercise.key_center;
        num = reverseHelper(num)
        switch (num) {
            case 77: converted.push(-5); break;
            case 76: converted.push(-4); break;
            case 74: converted.push(-3); break;
            case 72: converted.push(-2); break;
            case 71: converted.push(-1); break;
            case 69: converted.push(0); break;
            case 67: converted.push(1); break;
            case 65: converted.push(2); break;
            case 64: converted.push(3); break;
            case 62: converted.push(4); break;
            case 60: converted.push(5); break;
            case 59: converted.push(6); break;
            case 57: converted.push(7); break;
            case 55: converted.push(8); break; 
            case 53: converted.push(9); break;
            case 52: converted.push(10); break;
            case 50: converted.push(11); break;
            case 48: converted.push(12); break;
            case 47: converted.push(13); break;
            case 45: converted.push(14); break;
        }
    }
    return converted;
}

function convertToTop(note_list) {
    var converted = [];
    for (var i = 0; i < note_list.length; i++) {
        var num = note_list[i].note_number + Exercise.key_center;
        num = reverseHelper(num)
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
    for (var i = 0; i < solutionNums.length; i++) {
        var num = solutionNums[i];
        if (num == undefined) {
            converted.push(num)
            continue
        }
        var midi_num;
        switch (num) {
            case -5: midi_num = 87; break;
	        case -4: midi_num = 86; break;
            case -3: midi_num = 84; break;
            case -2: midi_num = 83; break;
            case -1: midi_num = 81; break;
            case 0: midi_num = 79; break;
            case 1: midi_num = 77; break;
            case 2: midi_num = 76; break;
            case 3: midi_num = 74; break;
            case 4: midi_num = 72; break;
            case 5: midi_num = 71; break;
            case 6: midi_num = 69; break;
            case 7: midi_num = 67; break;
            case 8: midi_num = 65; break; 
            case 9: midi_num = 64; break;
            case 10: midi_num = 62; break;
            case 11: midi_num = 60; break;
            case 12: midi_num = 59; break;
            case 13: midi_num = 57; break;
            case 14: midi_num = 55; break;
            case 15: midi_num = 53; break;
            case 16: midi_num = 52; break;
            case 17: midi_num = 50; break;
        }
        if (accidentals[i] != 2) {
            midi_num += accidentals[i]
            converted.push(topToNumHelper(midi_num))
        } else {
            converted.push(midi_num)
        }
    }
    return converted;
}
function convertNumFromTopBass() {
    var converted = [];
    for (var i = 0; i < solutionNums.length; i++) {
        var num = solutionNums[i];
        if (num == undefined) {
            converted.push(num)
            continue
        }
        var midi_num;
        switch (num) {
            case -5: midi_num = 67; break;
	        case -4: midi_num = 65; break;
            case -3: midi_num = 64; break;
            case -2: midi_num = 62; break;
            case -1: midi_num = 60; break;
            case 0: midi_num = 59; break;
            case 1: midi_num = 57; break;
            case 2: midi_num = 55; break;
            case 3: midi_num = 53; break;
            case 4: midi_num = 52; break;
            case 5: midi_num = 50; break;
            case 6: midi_num = 48; break;
            case 7: midi_num = 47; break;
            case 8: midi_num = 45; break; 
            case 9: midi_num = 43; break;
            case 10: midi_num = 41; break;
            case 11: midi_num = 40; break;
            case 12: midi_num = 38; break;
            case 13: midi_num = 36; break;
            case 14: midi_num = 35; break;
            case 15: midi_num = 33; break;
            case 16: midi_num = 31; break;
            case 17: midi_num = 29; break;
        }
        if (accidentals[i] != 2) {
            midi_num += accidentals[i]
            converted.push(topToNumHelper(midi_num))
        } else {
            converted.push(midi_num)
        } 
    }

    return converted;
}

function check_note(note) {
    var solution
    if (Exercise.upper_cp) {
        solution = convertNumFromTop()
    } else {
        solution  = convertNumFromTopBass()
    }

    if (solution_obj.notes.length == 0 && solution.length > 0) {
        for (var i = 0; i < solution.length - 1; i++) {
            solution_obj.notes.push(undefined)
        }
    }
     
    var idx = solution.length - 1
    var note = solution[idx]
    var first = solution.length === 1
    var next = new RelativeNote(note - Exercise.key_center , first)
    next.harmonic_interval = next.note_number - Exercise.cantus_firmus[idx].note_number
    if (!first && solution_obj.notes[idx - 1] != undefined) {
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
        sol_copy = new Solution()
        sol_copy.copy_prev(solution_obj)
        // search(all_solutions, Exercise.cantus_firmus.length - solution.length, Exercise.cantus_firmus, sol_copy)
        //console.log(all_solutions.length)
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
    if (solution_obj.notes.length > 0) {
        if (last.note_number == solution_obj.notes[solution_obj.notes.length - 1].note_number) {
            solution_obj.obliques--
        }
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
        persist()
        render_exercise()
    }
}

function reset() {
    var state_stack_nums = []
    var state_stack_points = []
    var state_stack_notes = []
    nextHorizontalSection = 1
    solutionNums = []
    solution_obj = new Solution()
    solutionPoints = []
    solutionPos = []
    fut_notenums = {}
    fut_notepoints = {}
    persist()
    render_exercise()
    document.getElementById('submit').style.visibility = 'hidden'
    document.getElementById('alert').style.visibility = 'hidden'
}

function toggle_top(link) {
    if (link.innerHTML == 'upper') {
        Exercise.setLower()
        reset()
        link.innerHTML = 'lower'
    } else {
        Exercise.setUpper()
        reset()
        link.innerHTML = 'upper'
    }
    var alert = document.getElementById('alert')
    alert.style.visibility = 'hidden'
}

function showSubmitButton() {
    var submitButton = document.getElementById('submit')
    submitButton.style.visibility = 'visible'
}

function submit() {
    if (Exercise.entire)
        check_answer()
    else 
        check_three_notes()
}

function check_answer() {
    submitted = true;
    document.getElementById('submit').style.visibility = 'hidden'
    if (get_fut_notenums().length < Exercise.cantus_firmus.length) {
        return false
    }
    solutionPoints = []
    solutionNums = []
    solution_obj = new Solution()
    var solPoints = get_fut_notepoints()
    var solNums = get_fut_notenums()
    for (var i = 0; i < solNums.length; i++) {
        solutionPoints.push(solPoints[i])
        solutionNums.push(solNums[i])
        console.log(solutionPoints)
        console.log(solutionNums)
        if (!check_note()) {
            wrongNote = i;
            solutionPoints = []
            solutionNums = []
            solution_obj = new Solution()
            render_exercise()
            return false
        }
    }
    wrongNote = -1
    return true
}

function check_three_notes() {
    submitted = true
    document.getElementById('submit').style.visibility = 'hidden'
    if (!is_complete()) {
        return false
    }
    solutionPoints = []
    solutionNums = []
    solution_obj = new Solution()
    var solPoints = get_fut_notepoints_three()
    var solNums = get_fut_notenums_three()
    for (var i = 0; i < Exercise.cantus_firmus.length; i++) {
        solutionPoints.push(solPoints[i])
        solutionNums.push(solNums[i])
        
        if (solutionPos.includes(i)) {
            if (!check_note()) {
                wrongNote = i;
                solutionPoints = []
                solutionNums = []
                solution_obj = new Solution()
                render_exercise()
                return false
            }
        }
    }
    solutionPoints = []
    solutionNums = []
    solution_obj = new Solution()
    wrongNote = -1
    render_exercise()
    return true
}

function get_fut_notenums_three() {
    result = []
    for (var i =0; i < Exercise.cantus_firmus.length; i++) {
        result.push(fut_notenums[i])
    }
    return result
}

function get_fut_notepoints_three() {
    result = []
    for (var i =0; i < Exercise.cantus_firmus.length; i++) {
        result.push(fut_notepoints[i])
    }
    return result
}


function drawWrongCircle() {
    if (wrongNote > -1 && is_complete()) {
        var canvas = document.getElementById('myCanvas');  
        var c = canvas.getContext("2d");
        c.beginPath()
        var noteSpace = lineSpacing / 2;
        if (Exercise.entire)
            var point = get_fut_notepoints()[wrongNote]
        else
            var point = get_fut_notepoints_three()[wrongNote]
        var radius = noteSpace * 5/3
        c.strokeStyle = "red"
        c.lineWidth = 3
        c.arc(point.x, point.y, radius, 0, 2*Math.PI)
        c.stroke()
        c.strokeStyle = "black"
        c.lineWidth = 1
        c.closePath()
    }
}

function topToNumHelper(midi_num) {
    var key_sig = Exercise.get_key_signature()
    var norm = midi_num % 12
    // sharps
    if (key_sig >= 1 && norm == 5)
        return midi_num+1
    if (key_sig >= 2 && norm == 0)
        return midi_num+1
    if (key_sig >= 3 && norm == 7)
        return midi_num+1
    if (key_sig >= 4 && norm == 2)
        return midi_num+1
    if (key_sig >= 5 && norm == 9)
        return midi_num+1
    
    // flats
    if (key_sig <= -1 && norm == 11)
        return midi_num-1
    if (key_sig <= -2 && norm == 4)
        return midi_num-1
    if (key_sig <= -3 && norm == 9)
        return midi_num-1
    if (key_sig <= -4 && norm == 2)
        return midi_num-1
    if (key_sig <= -5 && norm == 7)
        return midi_num-1
    if (key_sig <= -6 && norm == 0)
        return midi_num-1
    return midi_num
}

function reverseHelper(midi_num) {
    var key_sig = Exercise.get_key_signature()
    var norm = midi_num % 12
    // sharps
    if (key_sig >= 1 && norm == 6)
        return midi_num-1
    if (key_sig >= 2 && norm == 1)
        return midi_num-1
    if (key_sig >= 3 && norm == 8)
        return midi_num-1
    if (key_sig >= 4 && norm == 3)
        return midi_num-1
    if (key_sig >= 5 && norm == 10)
        return midi_num-1

    // flats
    if (key_sig <= -1 && norm == 10)
        return midi_num+1
    if (key_sig <= -2 && norm == 3)
        return midi_num+1
    if (key_sig <= -3 && norm == 8)
        return midi_num+1
    if (key_sig <= -4 && norm == 1)
        return midi_num+1
    if (key_sig <= -5 && norm == 6)
        return midi_num+1
    if (key_sig <= -6 && norm == 11)
        return midi_num+1
    return midi_num
}

function renderAccidental(clef, notenum, pos, image) {
    var canvas = document.getElementById('myCanvas');
    var c = canvas.getContext("2d")
    var noteSpace = lineSpacing / 2
    var acc_height = lineSpacing * 3/2
    var acc_width = acc_height * 1/2
    if (clef == 'bass') notenum += 2
    if (clef == 'alto') notenum += 1
    var centerY = notenum * noteSpace + (topMargin - noteSpace)
    c.drawImage(image, leftMargin + pos*acc_width/2, 
        centerY - acc_height/2, acc_width, acc_height)
}

function rendersharp(clef, notenum, pos) {
    renderAccidental(clef, notenum, pos, sharp_image)
}

function renderFlat(clef, notenum, pos) {
    renderAccidental(clef, notenum, pos, flat_image)
}

function drawSharps(clef) {
    var key_sig = Exercise.get_key_signature()
    if (key_sig >= 1) {
        rendersharp(clef, 1, 1)
    }
    if (key_sig >= 2) {
        rendersharp(clef, 4, 2)
    }
    if (key_sig >= 3) {
        rendersharp(clef, 0, 3)
    }
    if (key_sig >= 4) {
        rendersharp(clef, 3, 4)
    }
    if (key_sig >= 5) {
        rendersharp(clef, 6, 5)
    }
    if (key_sig <= -1) {
        renderFlat(clef, 5, 1)
    }
    if (key_sig <= -2) {
        renderFlat(clef, 2, 2)
    }
    if (key_sig <= -3) {
        renderFlat(clef, 6, 3)
    }
    if (key_sig <= -4) {
        renderFlat(clef, 3, 4)
    }
    if (key_sig <= -5) {
        renderFlat(clef, 7, 5)
    }
    if (key_sig <= -6) {
        renderFlat(clef, 4, 6)
    }
}