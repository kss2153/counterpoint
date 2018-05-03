var state = null
var roomForClef = 0

window.onload = window.onresize = function() {

    document.body.addEventListener('keydown', function (e) {
        if (e.keyCode == 8)
            undo()
    })
 
    document.getElementById('0').style.color = "black"
    
    var canvas = document.getElementById('myCanvas') 
    var ctx = canvas.getContext("2d") 
    canvas.addEventListener('click', staff_click, false)
    canvas.addEventListener('mousemove', staff_hover, false)

    canvas.width = window.innerWidth * .95
    canvas.height = window.innerHeight * .95
    roomForClef = canvas.width * 0.04;
    exercise_setup()
    
    // draw staff
    // var roomForClef = canvas.width * .03

    sharp_image = new Image()
    treble_clef_image = new Image()
    alto_clef_image = new Image()
    bass_clef_image = new Image()
    brace_image = new Image()
    flat_image = new Image()
    loadImages()

    var load = JSON.parse(localStorage.getItem('state'));
    if (load) {
        render_exercise()
        solution_obj = load['solution']
        solutionNums = load['nums']
        solutionPoints = getSolutionPoints()
        nextHorizontalSection = load['next']
        render_exercise()
    }

    

}

function loadImages() {
    treble_clef_image.src = 'images/treble_clef.png'
    treble_clef_image.onload = function() {
        render_exercise()
    }
    alto_clef_image.src = 'images/alto_clef.png'
    alto_clef_image.onload = function() {
        render_exercise()
    }
    bass_clef_image.src = 'images/bass_clef.png'
    bass_clef_image.onload = function() {
        render_exercise()
    }
    brace_image.src = 'images/brace.png'
    brace_image.onload = function() {
        render_exercise()
    }
    sharp_image.src = 'images/sharp.png'
    sharp_image.onload = function() {
        render_exercise()
    }
    flat_image.src = 'images/flat.png'
    flat_image.onload = function() {
        render_exercise()
    }
}

function getSolutionPoints() {
    var result = []
    for (var i = 0; i < solutionNums.length; i++) {
        result.push(getNotePoint(solutionNums[i], i))
    }
    return result
} 

cur_example = 0
function exercise_setup() {
    var t = document.getElementById('toggle')
    if (t.innerHTML == "upper")
        Exercise.setUpper()
    else
        Exercise.setLower()

    ex = examples[cur_example]

    Exercise.inputCF(ex.cf)
    Exercise.setMode(ex.mode)
    Exercise.example = ex
    states = []
    pushState()
}

CANTUS_FIRMI = [

    new Example([60, 62, 65, 64, 65, 67, 69, 67, 64, 62, 60], 1, 'Schenker'), // SCHENKER 1
    new Example([60, 62, 64, 65, 67, 62, 65, 64, 62, 60], 1, 'Schenker'), // SCHENKER 1
    new Example([62, 67, 66, 71, 69, 66, 67, 66, 64, 62], 1, 'Salzer and Schachter'), // S&S 1
    new Example([58, 62, 60, 67, 65, 62, 63, 62, 60, 58], 1, 'Salzer and Schachter'), // S&S 1
    new Example([65, 67, 69, 65, 62, 64, 65, 72, 69, 65, 67, 65], 1, 'Fux'), // FUX 1
    new Example([57, 59, 61, 66, 64, 57, 59, 62, 61, 59, 57], 1, 'Salzer and Schachter'), // S&S 1

    new Example([62, 69, 67, 65, 64, 62, 65, 64, 62], 2, 'Salzer and Schachter'), // S&S

    new Example([64, 60, 62, 60, 57, 69, 67, 64, 65, 64], 3, 'Salzer and Schachter'), // S&S


    new Example([55, 62, 60, 57, 59, 60, 59, 57, 55], 5, 'Salzer and Schachter'), // S&S

    new Example([62, 65, 64, 62, 67, 65, 69, 67, 65, 64, 62], 6, 'Fux'), // FUX 6
    new Example([62, 69, 67, 65, 64, 62, 65, 64, 62], 6, 'Jeppesen'), // JEPPESEN 6
    new Example([55, 62, 60, 63, 62, 58, 60, 58, 57, 55], 6, 'Salzer and Schachter'), // S&S 6
    new Example([57, 60, 59, 60, 62, 64, 60, 59, 57], 6, 'Salzer and Schachter'), // S&S 6
    new Example([59, 54, 57, 55, 54, 62, 61, 59], 6, 'Salzer and Schachter'), // S&S 6
    new Example([60, 62, 65, 63, 68, 67, 65, 62, 63, 62, 60], 6, 'Salzer and Schachter'), // S&S 6


]




examples = []
for (var i = 0; i < CANTUS_FIRMI.length; i++) {
    var e = CANTUS_FIRMI[i]
    for (var j = -6; j < 6; j++) {
        examples.push(e.transpose(j))
    }
}

function nextCF(num) {
    if (num == 1 && cur_example > 0)
        cur_example -= 1
    if (num == 2 && cur_example < examples.length-1)
        cur_example += 1

    ex = examples[cur_example]
    
    reset()
    exercise_setup()
    render_exercise()
}

function setExerciseRange(num) {
    for (var i = 0; i < 4; i++)
        document.getElementById(i+'').style.color = 'white'
    document.getElementById(num+'').style.color = 'black'

    var instr = document.getElementById('instruction')
    switch (num) {
        case 0: instr.innerHTML = 'complete the entire exercise'; break;
        case 1: instr.innerHTML = 'complete the first three notes'; break;
        case 2: instr.innerHTML = 'complete three notes with the climax in the middle'; break;
        case 3: instr.innerHTML = 'complete the final three notes'; break;
    }
    Exercise.set_range(num)
    reset()
    exercise_setup()
    render_exercise()
}

function switchAccButton(num) {
    var button = document.getElementById('acc_'+num)
    var active = button.classList.contains('active')
    nums = [1, -1, 2]
    for (var i = 0; i < nums.length; i++) {
        document.getElementById('acc_'+nums[i]).classList.remove('active')
        button.style.color = "white"
    }
    if (!active) {
        button.classList.add('active')
        button.style.color = "black"
    }
}

function shuffle(arra1) {
    let ctr = arra1.length;
    let temp;
    let index;

    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}
examples = shuffle(examples)

