/*
    Counterpoint logic and rules
*/

// singelton
var Exercise = new function() {
    this.key_center = null
    this.lower_cp = false
    this.upper_cp = false
    this.cantus_firmus = []
    this.major = true

    this.setUpper = function () {
        this.lower_cp = false
        this.upper_cp = true
    }

    this.setLower = function () {
        this.lower_cp = true
        this.upper_cp = false
    }

    this.inputCF = function(input_note_numbers) {
        this.cantus_firmus = 
            this.convert_cf_to_notes(input_note_numbers)
    }

    this.convert_cf_to_notes = function(note_numbers) {
        var result = []
        if (note_numbers.length === 0) {
            return result
        }
    
        var center = note_numbers[0]
        this.key_center = center
        for (var i = 0; i < note_numbers.length; i++) {
            var relative_num = note_numbers[i] - this.key_center
            var converted_note = new RelativeNote(relative_num, false)
            result.push(converted_note);
        }
    
        return result
    }

}

class Solution {
    constructor() {
        this.notes = []
        this.perfects = {
            7: 0,
            12: 0
        }
        this.obliques = 0
        this.climax = 0
        this.repeats = new Map()
    }

    copy_prev(prev) {
        for (var interval in prev.perfects) {
            this.perfects[interval] = prev.perfects[interval]
        }
        this.notes = prev.notes.slice()
        this.obliques = prev.obliques
    }
    
}

function calc_smoothness(notes) {
    var total = 0
    for (var i = 1; i < notes.length; i++) {
        total += notes[i].melodic_interval
    }
    return (total / notes.length)
}

class RelativeNote {
    constructor(note_number, first_note) {
        this.note_number = note_number;
        this.first_note = first_note;
        this.harmonic_interval = -1;
        this.melodic_interval = -1;
    }

    norm_harmonic() {
        return this.harmonic_interval % 12
    }

    norm_note() {
        return this.note_number % 12
    }
}

function generate_major(note_number, first_note) {
    // key center: 0
    var possible_notes = [ 0, 2, 4, 5, 7, 9, 11 ]

    if (first_note) {
        return [0, 7, 12]
    }

    var result = [];
    // P1, P5, P8, ^P5
    result.push(note_number)
    result.push(note_number + 7)
    result.push(note_number + 12)
    result.push(note_number + 19)

    // major 3rd, 6th, 10th
    var rest = [4, 9, 16]
    rest.forEach(function(steps) {
        var raw = note_number + steps
        var norm = raw % 12
        if (possible_notes.includes(norm)) {
            result.push(raw)
        } else {
            // push minor 3rd/6th/10th
            result.push(raw - 1)
        }
    })

    return result
}

function passes_checks(note, cantus_firmus, solution) {
    return run_checks(note, cantus_firmus, solution)
}

/*
    @param cantus_firmus: Note[]
    @param solution: Note[] 
    @return result: Note[] - list of possible next notes
*/
function get_next_notes(cantus_firmus, solution) {
    var result = []
    if (solution.length >= cantus_firmus.length) {
        return result
    }

    var position = solution.length
    var first = (position === 0)
    note_numbers = generate_major(cantus_firmus[position].note_number, first)
    for (var i = 0; i < note_numbers.length; i++) {
        var next = new RelativeNote(note_numbers[i], first)
        next.harmonic_interval = next.note_number - cantus_firmus[position].note_number
        if (!first) {
            var prev = solution[position - 1]
            next.melodic_interval = next.note_number - prev.note_number
        }
        result.push(next)
    }
    return result
}

function search(all, length, cantus_firmus, solution) {
    if (length === 0) {
        all.push(solution.notes.slice())
        return
    }

    var next_notes = get_next_notes(cantus_firmus, solution.notes)
    for (var i = 0; i < next_notes.length; i++) {
        var note = next_notes[i]

        if (passes_checks(note, cantus_firmus, solution)) {
            var copy = new Solution()
            copy.copy_prev(solution)
            copy.notes.push(note)
            if (note.harmonic_interval in copy.perfects) {
                copy.perfects[note.harmonic_interval]++
            } 
            search(all, length - 1, cantus_firmus, copy)
        }
    }
}


function main() {
    var cf = [ 1, 5 , 6, 8,  5, 10, 8, 5, 6, 5, 3, 1 ]
    cf = [1, 3, 5, 6, 8, 5, 6, 3, 1]
    //cf = [ 1, 3, 5, 6, 3, 1]
    Exercise.setUpper()
    Exercise.inputCF(cf)

    console.log(Exercise.cantus_firmus)
    all = []
    search(all, Exercise.cantus_firmus.length, Exercise.cantus_firmus, new Solution())
    console.log('done')
    all.sort(function(a, b) {
        console.log(a)
        return calc_smoothness(b) - calc_smoothness(a)
    })
    console.log(all)
}