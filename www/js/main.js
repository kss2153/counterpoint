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

function getSolutionPoints() {
    var result = []
    for (var i = 0; i < solutionNums.length; i++) {
        result.push(getNotePoint(solutionNums[i], i))
    }
    return result
} 

function exercise_setup() {
    var cf = [ 1, 5 , 6, 8,  5, 10, 8, 5, 6, 5, 3, 1 ]
    cf = [60, 62, 64, 65, 67, 64, 65, 62, 60]
    cf = [59, 61, 63, 64, 66, 63, 64, 61, 59]
    cf = [62, 64, 66, 67, 69, 66, 67, 64, 62]
    //cf = [ 1, 3, 5, 6, 3, 1]
    var t = document.getElementById('toggle')
    if (t.innerHTML == "upper")
        Exercise.setUpper()
    else
        Exercise.setLower()
    Exercise.inputCF(cf)
}

