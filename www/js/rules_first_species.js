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
    if (pos == 0) {
        return true
    }

    var perfects = [0, 7]

    if (!perfects.includes(note.harmonic_interval % 12)) {
        return true
    }

    var dir_sol = (note.note_number - solution.notes[pos - 1].note_number) > 0
    var dir_cf = (cantus_firmus[pos].note_number - 
        cantus_firmus[pos - 1].note_number) > 0
    
    if ((dir_cf && dir_sol) || (!dir_cf && !dir_sol)) {
        return false
    }

    return true

}, 'No similar or parallel motion to a perfect interval', 12)

// to be checked after rule 1
var rule_2 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos === 0) {
        return true
    }

    var perfects = [0, 7]

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

    var cf_note = cantus_firmus[pos].norm_note()
    var sol_note = note.norm_note()

    if (cf_note === 11 && sol_note === 2) {
        return true
    }

    if (cf_note === 2 && sol_note === 11) {
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
    var prev_note = solution.notes[pos - 1].note_number
    if (note.note_number - 1 != prev_note && note.note_number + 2 != prev_note) {
        return false
    }

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
    if (pos < 3) {
        return true
    }
    var prev1 = solution.notes[pos - 1].harmonic_interval
    var third1 = (prev1 === 3 || prev1 === 4)
    var sixth1 = (prev1 === 8 || prev1 === 9)
    var tenth1 = (prev1 === 15 || prev1 === 16)

    var prev2 = solution.notes[pos - 2].harmonic_interval
    var third2 = (prev2 === 3 || prev2 === 4)
    var sixth2 = (prev2 === 8 || prev2 === 9)
    var tenth2 = (prev2 === 15 || prev2 === 16)

    var prev3 = solution.notes[pos - 3].harmonic_interval
    var third3 = (prev3 === 3 || prev3 === 4)
    var sixth3 = (prev3 === 8 || prev3 === 9)
    var tenth3 = (prev3 === 15 || prev3 === 16)

    var next = note.harmonic_interval
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
    if (pos === 0) {
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
        return false
    }

    return true
    
}, 'No voice crossing or overlap', 7)

var rule_8 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos < 2) {
        return true
    }

    var prev = solution.notes[pos - 1]
    if (prev.melodic_interval < 0) {
        if (prev.melodic_interval < -4 && note.note_number <= prev.note_number) {
             return false
        }

        if (prev.melodic_interval < -4 && note.note_number > prev.note_number + 3) {
            return false
       }
    } else {
        if (prev.melodic_interval > 4 && note.note_number >= prev.note_number) {
            return false
        } 

        if (prev.melodic_interval > 4 && note.note_number < prev.note_number - 3) {
            return false
        } 
    }

    return true

}, 'Follow any skip larger than a 3rd with motion in the opposite direction (at most a 3rd)', 8)

var rule_9 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos < 4) {
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
    if (pos < 6) {
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
    if (pos === 0) {
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
        if (solution.obliques > 2) {
            return false
        }
    }
    return true

}, 'Allow tied notes only once or twice throughout', 11)

var rule_12 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos !== 0) {
        var choices = generate_major(cantus_firmus[pos].note_number, false)
        if (choices.includes(note.note_number)) {
            return true
        } 
    }
    return false
}, 'This interval is a dissonance', 1)

var rule_13 = new Rule(function(note, cantus_firmus, solution) {
    pos = solution.notes.length
    if (pos === 0) {
        var choices = generate_major(cantus_firmus[pos].note_number, true)
        if (choices.includes(note.note_number)) {
            return true
        } 
    }
    return false 
}, 'The first interval must be a unison, fifth, or octave', 1)

function run_checks(note, cantus_firmus, solution) {
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
        check_helper(rule_11, note, cantus_firmus, solution))
    return true
}

function check_helper(rule, note, cantus_firmus, solution) {
    if (!rule.check(note, cantus_firmus, solution)) {
        // console.log(rule.msg + " error: " + rule.code)
        // console.log(solution)
        //console.log(note)
        return false
    }
    return true
}