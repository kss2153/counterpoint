var state = null

window.onload = window.onresize = function() {
    document.body.addEventListener('keydown', function (e) {
        if (e.keyCode == 8)
            undo()
    })
 
    exercise_setup()
    
    var canvas = document.getElementById('myCanvas') 
    var ctx = canvas.getContext("2d") 
    canvas.addEventListener('click', staff_click, false)
    canvas.addEventListener('mousemove', staff_hover, false)

    canvas.width = window.innerWidth * .95
    canvas.height = window.innerHeight * .95
    
    // draw staff
    var roomForClef = canvas.width * .03

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
cf_major = [59, 61, 63, 64, 66, 63, 64, 61, 59]
cf_minor = [57, 60, 59, 62, 60, 64, 65, 64, 62, 60, 59, 57]
cf_3 = [57, 59, 60, 59, 57]
ex1 = new Example(cf_3, 6)
ex2 = new Example(cf_major, 1)
ex = ex1
function exercise_setup() {
    var cf = [ 1, 5 , 6, 8,  5, 10, 8, 5, 6, 5, 3, 1 ]
    cf = [60, 62, 64, 65, 67, 64, 65, 62, 60]
    
    // cf = [65, 67, 69, 70, 72, 69, 70, 67, 65]
    //cf = [ 1, 3, 5, 6, 3, 1]
    var t = document.getElementById('toggle')
    if (t.innerHTML == "upper")
        Exercise.setUpper()
    else
        Exercise.setLower()
    Exercise.inputCF(ex.cf)
    Exercise.setMode(ex.mode)
}

