

window.onload = window.onresize = function() {

    exercise_setup()
    
    var canvas = document.getElementById('myCanvas') 
    var ctx = canvas.getContext("2d") 
    canvas.addEventListener('click', staff_click, false)
    canvas.addEventListener('mousemove', staff_hover, false)

    canvas.width = window.innerWidth * .95
    canvas.height = window.innerHeight * .95
    
    // draw staff
    var roomForClef = canvas.width * .03

    clef_image = new Image()
    clef_image.src = 'images/treble_clef.png'
    clef_image.onload = function() {
        drawStaffLines(canvas)
        drawClef(canvas, clef_image)
        drawCantusFirmus()        
    }

}

function exercise_setup() {
    var cf = [ 1, 5 , 6, 8,  5, 10, 8, 5, 6, 5, 3, 1 ]
    cf = [60, 62, 64, 65, 67, 64, 65, 62, 60]
    //cf = [ 1, 3, 5, 6, 3, 1]
    Exercise.setUpper()
    Exercise.inputCF(cf)
}

function play() {
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    if (solutionNums.length > 0) {
        playLine(solutionNums, noteNums);
    }
}