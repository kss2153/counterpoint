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

var solution_obj = new Solution()

var all_solutions = []
var fut_notepoints = {}
var fut_notenums= {}
var wrongNote = -1

function render_exercise() {
    var canvas = document.getElementById('myCanvas');   
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    if (nextHorizontalSection > Exercise.cantus_firmus.length || (get_fut_notenums().length == Exercise.cantus_firmus.length && wrongNote==-1)) {
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
        c.beginPath();
        var xPos = noteArray[i].x;
        var yPos = noteArray[i].y;
        
	    var radius = noteSpace * (2/3);
        //c.arc(xPos, yPos, radius, 0, 2*Math.PI);
        c.ellipse(xPos, yPos,radius*1.2, radius, 0, 0, 2*Math.PI, false)
        c.fillStyle = "black";
        // if (solutionLine && i == wrongNote)
        //     c.fillStyle = "red"

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
        render_exercise()
        if (get_fut_notenums().length == Exercise.cantus_firmus.length) {
            check_answer()
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
    sorted = []
    for (var key in fut_notenums) {
        sorted.push(key)
    }
    sorted.sort()
    result = []
    for (var i =0; i < sorted.length; i++) {
        result.push(fut_notenums[sorted[i]])
    }
    return result
}

function get_fut_notepoints() {
    sorted = []
    for (var key in fut_notenums) {
        sorted.push(key)
    }
    sorted.sort()
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
    for (var i = 0; i < noteNums.length; i++) {
        var num = solutionNums[i];
        switch (num) {
            case -5: converted.push(topToNumHelper(88)); break;
	        case -4: converted.push(topToNumHelper(86)); break;
            case -3: converted.push(topToNumHelper(84)); break;
            case -2: converted.push(topToNumHelper(83)); break;
            case -1: converted.push(topToNumHelper(81)); break;
            case 0: converted.push(topToNumHelper(79)); break;
            case 1: converted.push(topToNumHelper(77)); break;
            case 2: converted.push(topToNumHelper(76)); break;
            case 3: converted.push(topToNumHelper(74)); break;
            case 4: converted.push(topToNumHelper(72)); break;
            case 5: converted.push(topToNumHelper(71)); break;
            case 6: converted.push(topToNumHelper(69)); break;
            case 7: converted.push(topToNumHelper(67)); break;
            case 8: converted.push(topToNumHelper(65)); break; 
            case 9: converted.push(topToNumHelper(64)); break;
            case 10: converted.push(topToNumHelper(62)); break;
            case 11: converted.push(topToNumHelper(60)); break;
            case 12: converted.push(topToNumHelper(59)); break;
            case 13: converted.push(topToNumHelper(57)); break;
            case 14: converted.push(topToNumHelper(55)); break;
            case 15: converted.push(topToNumHelper(53)); break;
            case 16: converted.push(topToNumHelper(52)); break;
            case 17: converted.push(topToNumHelper(50)); break;
        }
    }
    return converted;
}
function convertNumFromTopBass() {
    var converted = [];
    for (var i = 0; i < noteNums.length; i++) {
        var num = solutionNums[i];
        switch (num) {
            case -5: converted.push(topToNumHelper(67)); break;
	        case -4: converted.push(topToNumHelper(65)); break;
            case -3: converted.push(topToNumHelper(64)); break;
            case -2: converted.push(topToNumHelper(62)); break;
            case -1: converted.push(topToNumHelper(60)); break;
            case 0: converted.push(topToNumHelper(59)); break;
            case 1: converted.push(topToNumHelper(57)); break;
            case 2: converted.push(topToNumHelper(55)); break;
            case 3: converted.push(topToNumHelper(53)); break;
            case 4: converted.push(topToNumHelper(52)); break;
            case 5: converted.push(topToNumHelper(50)); break;
            case 6: converted.push(topToNumHelper(48)); break;
            case 7: converted.push(topToNumHelper(47)); break;
            case 8: converted.push(topToNumHelper(45)); break; 
            case 9: converted.push(topToNumHelper(43)); break;
            case 10: converted.push(topToNumHelper(41)); break;
            case 11: converted.push(topToNumHelper(40)); break;
            case 12: converted.push(topToNumHelper(38)); break;
            case 13: converted.push(topToNumHelper(36)); break;
            case 14: converted.push(topToNumHelper(35)); break;
            case 15: converted.push(topToNumHelper(33)); break;
            case 16: converted.push(topToNumHelper(31)); break;
            case 17: converted.push(topToNumHelper(29)); break;
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
        sol_copy = new Solution()
        sol_copy.copy_prev(solution_obj)
        // search(all_solutions, Exercise.cantus_firmus.length - solution.length, Exercise.cantus_firmus, sol_copy)
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
    fut_notenums = {}
    fut_notepoints = {}
    persist()
    render_exercise()
    
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

function check_answer() {
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
            render_exercise()
            return false
        }
    }
    wrongNote = -1
    return true
}

function drawWrongCircle() {
    if (wrongNote > -1 && get_fut_notenums().length == Exercise.cantus_firmus.length) {
        var canvas = document.getElementById('myCanvas');  
        var c = canvas.getContext("2d");
        c.beginPath()
        var noteSpace = lineSpacing / 2;
        var point = get_fut_notepoints()[wrongNote]
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
    return midi_num
}

function reverseHelper(midi_num) {
    var key_sig = Exercise.get_key_signature()
    var norm = midi_num % 12
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
    return midi_num
}

function rendersharp(clef, notenum, pos) {
    var canvas = document.getElementById('myCanvas');
    var c = canvas.getContext("2d")
    var noteSpace = lineSpacing / 2
    var acc_height = lineSpacing * 3/2
    var acc_width = acc_height * 1/2
    if (clef == 'bass') notenum += 2
    if (clef == 'alto') notenum += 1
    var centerY = notenum * noteSpace + (topMargin - noteSpace)
    c.drawImage(sharp_image, leftMargin + pos*acc_width/2, 
        centerY - acc_height/2, acc_width, acc_height)
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
}