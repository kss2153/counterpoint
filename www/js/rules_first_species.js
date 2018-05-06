/*
    1.	Consonances only: P1, M/m3, P5, Mm6, P8, M/m10, P12. 10ths and 12ths only temporarily
    2.	No similar or parallel motion to a perfect interval – referred to as ‘direct,’ ‘hidden,’ or ‘exposed,’ fifths or octaves
    3.	No consecutive fifths or octaves by contrary motion.
    4.	Begin on a unison or octave – or fifth when the CF is in the lower voice; end on a unison or octave; in between there may be imperfect or perfect consonances 
            – except unisons, but imperfect consonances – thirds, sixths, 10ths – should predominate.
    5.	Contrary motion is good: it promotes independence of voices.
    6.	The Penultimate measure will consist of the second scale degree in the CF and the seventh scale degree in the counterpoint, or vice versa – raised seventh scale degree in minor.
    7.	In minor, generally use the natural form of the scale except for the cadence at the end.
    8.	Avoid excessive use of simultaneous leaps in both voices, especially in the same direction – worse for larger leaps.
    9.	No more than three thirds in a row, same for sixths.
    10.	No voice crossing or overlap
    11.	The counterpoint should generally adhere to guidelines for the CF – an exception: may tie or repeat a note once or twice.
    12.	Independence of voices promoted if the climax of the counterpoint does not occur at the same time as the climax of the CF.
*/


class Rule {
    constructor(rule, msg, code) {
        this.check = rule
        this.msg = msg
        this.code = code
    }
}

var rule_1 = new Rule(function(note, cantus_firmus, solution) {
    
    pos = solution.notes.length
    if (pos == 0 || solution.notes[pos - 1] == undefined) {
        return true
    }

    var perfects = [0, 7]
    console.log(note.norm_harmonic())

    if (!perfects.includes(note.norm_harmonic())) {
        return true
    }

    var dir_sol = (note.note_number - solution.notes[pos - 1].note_number)
    var dir_cf = (cantus_firmus[pos].note_number - 
        cantus_firmus[pos - 1].note_number)

    if (dir_sol === 0) {
        return true
    } else {
        dir_sol = dir_sol > 0
        dir_cf = dir_cf > 0
    }
    
    if ((dir_cf && dir_sol) || (!dir_cf && !dir_sol)) {
        return false
    }

    return true

}, 'No similar or parallel motion to a perfect interval', 12)

// to be checked after rule 1
var rule_2 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos === 0 || solution.notes[pos - 1] == undefined) {
        return true
    }

    var perfects = [0, 7, -7]

    var interval = note.norm_harmonic()
    if (perfects.includes(interval) 
            && solution.notes[pos - 1].norm_harmonic() === interval) {
        return false
    } 

    return true

}, 'No consecutive fifths or octaves by contrary motion', 2)

var rule_3 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    // check for penultimate note
    if (pos != cantus_firmus.length - 2) {
        return true
    }
    var seven = 11
    if (Exercise.mode == 2 || Exercise.mode == 3 || Exercise.mode == 5 || Exercise.mode == 7)
        seven = 10
    
    var two = 2
    if (Exercise.mode == 3 || Exercise.mode == 7)
        two = 1

    var cf_note = cantus_firmus[pos].norm_note()
    var sol_note = note.norm_note()

    if (cf_note === seven && sol_note === two) {
        return true
    }

    if (cf_note === two && sol_note === seven) {
        return true
    }

    return false

}, 'Penultimate measure must have both scale degree 2 and 7', 3)

var rule_4 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    // check for last note
    if (pos != cantus_firmus.length - 1) {
        return true
    }

    var sol_note = note.norm_note()
    if (sol_note != 0) {
        return false
    }

    // check smoothness - probably will become unnecessary with later rules
    // var prev_note = solution.notes[pos - 1].note_number
    // if (note.note_number - 1 != prev_note && note.note_number + 2 != prev_note) {
    //     return false
    // }

    return true

}, 'Final measure be a unison or octave', 4)

var rule_5 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos === 0 || pos === cantus_firmus.length - 1) {
        return true
    }

    if (note.harmonic_interval === 0) {
        return false
    }

    return true
}, 'Avoid unisons beyond the first and final notes', 5)

var rule_6 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos < 3 || !Exercise.entire) {
        return true
    }
    var dir = 1
    if (!Exercise.upper_cp){
        dir = -1
    }
    var prev1 = solution.notes[pos - 1].harmonic_interval * dir
    var third1 = (prev1 === 3 || prev1 === 4)
    var sixth1 = (prev1 === 8 || prev1 === 9)
    var tenth1 = (prev1 === 15 || prev1 === 16)

    var prev2 = solution.notes[pos - 2].harmonic_interval * dir
    var third2 = (prev2 === 3 || prev2 === 4)
    var sixth2 = (prev2 === 8 || prev2 === 9)
    var tenth2 = (prev2 === 15 || prev2 === 16)

    var prev3 = solution.notes[pos - 3].harmonic_interval * dir
    var third3 = (prev3 === 3 || prev3 === 4)
    var sixth3 = (prev3 === 8 || prev3 === 9)
    var tenth3 = (prev3 === 15 || prev3 === 16)

    var next = note.harmonic_interval * dir
    var next3 = (next === 3 || next === 4)
    var next6 = (next === 8 || next === 9)
    var next10 = (next === 15 || next === 16)
    if ((third1 && third2 && third3 && next3) || 
            (sixth1 && sixth2 && sixth3 && next6) || 
            (tenth1 && tenth2 && tenth3 && next10))  {
        return false
    }

    return true

}, 'No more than three 3rds or 6ths in a row', 6)

var rule_7 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos === 0 || solution.notes[pos - 1] == undefined) {
        return true
    }

    var prev_sol = solution.notes[pos - 1].note_number
    var prev_cf = cantus_firmus[pos - 1].note_number
    var cur_sol = note.note_number
    var cur_cf = cantus_firmus[pos].note_number

    if (Exercise.upper_cp) {
        if (prev_cf > cur_sol || prev_sol < cur_cf) {
            return false
        } 
    } else {
        if (prev_cf < cur_sol || prev_sol > cur_cf) {
            return false
        } 
    }

    return true
    
}, 'No voice crossing or overlap', 7)

var rule_8 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos < 2 || solution.notes[pos - 1] == undefined) {
        return true
    }

    var prev = solution.notes[pos - 1]
    if (prev.melodic_interval < 0) {
        if (prev.melodic_interval < -4 && note.note_number <= prev.note_number) {
             return false
        }

        if (prev.melodic_interval < -4 && note.note_number > prev.note_number + 4) {
            return false
       }
    } else {
        if (prev.melodic_interval > 4 && note.note_number >= prev.note_number) {
            return false
        } 

        if (prev.melodic_interval > 4 && note.note_number < prev.note_number - 4) {
            return false
        } 
    }

    return true

}, 'Follow any skip larger than a 3rd with motion in the opposite direction (at most a 3rd)', 8)

var rule_9 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos < 4 || solution.notes[pos - 2] == undefined) {
        return true
    }

    var prev1 = solution.notes[pos - 1].melodic_interval
    var prev2 = solution.notes[pos - 2].melodic_interval

    if (prev1 > 2 && prev2 > 2 && note.melodic_interval > 2) {
        return false
    }

    if (prev1 < -2 && prev2 < -2 && note.melodic_interval < -2) {
        return false
    }

    return true

}, 'Avoid using three skips in a row', 9)

var rule_10 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos < 6 || !Exercise.entire) {
        return true
    }

    if (note.melodic_interval === 0) {
        return true
    }

    var up = note.melodic_interval > 0
    for (var i = pos - 1; i > pos - 6; i--) {
        var dir = -1
        if (up) {
            dir = 1
        }
        if (dir * solution.notes[i].melodic_interval < 0) {
            return true
        }
    }
    return false

}, 'No more than 5 notes in the same direction', 10)

var rule_11 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos === 0 || solution.notes[pos - 2] == undefined) {
        return true
    }

    prev = solution.notes[pos - 1]
    if (note.note_number == prev.note_number) {
        if (pos > 1) {
            if (solution.notes[pos - 2].note_number == note.note_number) {
                return false
            }
        }
        solution.obliques++
        if (solution.obliques > 1) {
            return false
        }
    }
    return true

}, 'Allow tied notes only once throughout', 11)

var rule_12 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos === 0) {
        var choices = generate_major(cantus_firmus[pos].note_number, true)
        if (choices.includes(note.note_number)) {
            return true
        } 
        return false
    }
    return true 
}, 'The first interval must be a unison, fifth (only when cf is below), or octave', 12)

var rule_13 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos == cantus_firmus.length - 2)
        return true
    
    var choices = generate_major(cantus_firmus[pos].note_number, false)
    // console.log(choices + ', ' + note.note_number)
    if (choices.includes(note.note_number)) {
        return true
    }
    return false 
  
    
}, 'This interval is a dissonance or out of range', 13)

var rule_14 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos == 0 || solution.notes[pos - 1] == undefined) {
        return true
    }
    if (note.melodic_interval == 6 || note.melodic_interval == -6) {
        return false
    }
    return true

}, 'Avoid melodic tritones', 14)

var rule_15 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (solution.notes[pos - 2] == undefined && solution.notes[pos - 1] != undefined) {
        if (solution.notes[pos - 1].note_number >= note.note_number)
            return false
    }
    if (solution.notes[pos - 3] == undefined && solution.notes[pos - 2] != undefined && solution.notes[pos - 1] != undefined) {
        if (solution.notes[pos - 1].note_number <= note.note_number)
            return false
    }
    return true

}, 'climax must be highest note', 15)

var rule_16 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (solution.notes[pos - 2] == undefined && solution.notes[pos - 1] != undefined) {
        if (note.norm_note == 11) {
            return false
        }
    }
    return true

}, 'climax cannot be a leading tone', 16)

function run_checks(note, cantus_firmus, solution) {
    if (Exercise.climax && (!check_helper(rule_15, note, cantus_firmus, solution)
            || !check_helper(rule_16, note, cantus_firmus, solution)))
        return false
    
    if (check_helper(rule_1, note, cantus_firmus, solution) &&
            check_helper(rule_2, note, cantus_firmus, solution) &&
            check_helper(rule_3, note, cantus_firmus, solution) &&
            check_helper(rule_4, note, cantus_firmus, solution) &&
            check_helper(rule_5, note, cantus_firmus, solution) &&
            check_helper(rule_6, note, cantus_firmus, solution) &&
            check_helper(rule_7, note, cantus_firmus, solution) &&
            check_helper(rule_8, note, cantus_firmus, solution) &&
            check_helper(rule_9, note, cantus_firmus, solution) &&
            check_helper(rule_10, note, cantus_firmus, solution) &&
            check_helper(rule_11, note, cantus_firmus, solution) &&
            check_helper(rule_12, note, cantus_firmus, solution) &&
            check_helper(rule_13, note, cantus_firmus, solution) &&
            check_helper(rule_14, note, cantus_firmus, solution))
        return true
    
    return false
}

function check_helper(rule, note, cantus_firmus, solution) {
    if (!rule.check(note, cantus_firmus, solution)) {
        var alert = document.getElementById('alert')
        alert.innerHTML = rule.msg
        alert.style.visibility = 'visible'
        // console.log(rule.msg + " error: " + rule.code)
        return false
    }
    return true
}