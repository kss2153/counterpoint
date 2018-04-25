/*
    Counterpoint logic and rules
*/

// singelton
var Exercise = new function() {
    this.key_center = null
    this.lower_cp = false
    this.upper_cp = false
    this.cantus_firmus = []
    this.mode = 1
    this.checking = false

    this.beginning = false
    this.climax = false
    this.end = false
    this.entire = true

    this.setUpper = function () {
        this.lower_cp = false
        this.upper_cp = true
    }

    this.setLower = function () {
        this.lower_cp = true
        this.upper_cp = false
    }

    this.setMode = function (new_mode) {
        if (new_mode < 1 || new_mode > 7) return
        this.mode = new_mode
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

    this.get_mode_name = function() {
        var name = ''
        switch (this.mode) {
            case 1: name = 'major'; break;
            case 2: name = 'dorian'; break;
            case 3: name = 'phrygian'; break;
            case 4: name = 'lydian'; break;
            case 5: name = 'mixolydian'; break;
            case 6: name = 'minor'; break;
            case 7: name = 'locrian'; break;
        }
        return name
    }

    this.get_key_signature = function() {
        var center_norm = this.key_center
        if (this.mode == 2) center_norm -= 2
        if (this.mode == 3) center_norm -= 4
        if (this.mode == 4) center_norm -= 5
        if (this.mode == 5) center_norm += 5
        if (this.mode == 6) center_norm += 3
        if (this.mode == 7) center_norm += 1
        center_norm = center_norm % 12
        switch (center_norm) {
            case 6: return -6; break;
            case 1: return -5; break;
            case 8: return -4; break;
            case 3: return -3; break;
            case 10: return -2; break;
            case 5: return -1; break;
            case 0: return 0; break;
            case 7: return 1; break;
            case 2: return 2; break;
            case 9: return 3; break;
            case 4: return 4; break;
            case 11: return 5; break;
        }
    }

    this.set_range = function(part) {
        this.entire = false
        this.beginning = false
        this.climax = false
        this.end = false
        switch (part) {
            case 0: this.entire = true; break;
            case 1: this.beginning = true; break;
            case 2: this.climax = true; break;
            case 3: this.end = true; break;
            default: this.entire = true; break;
        }
    }

}

class Example {
    constructor(cf, mode) {
        this.cf = cf
        this.mode = mode
    }

    transpose(steps) {
        var new_cf = []
        for (var i = 0; i < this.cf.length; i++) {
            new_cf.push(this.cf[i] + steps)
        }
        return new Example(new_cf, this.mode)
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
        var norm = this.harmonic_interval % 12
        if (norm < 0) 
            return norm + 12
        return norm
    }

    norm_note() {
        var norm = this.note_number % 12
        if (norm < 0) 
            return norm + 12
        return norm
    }
}

function generate_major(note_number, first_note) {
    // key center: 0
    var upper = Exercise.upper_cp
    var possible_notes = [ 0, 2, 4, 5, 7, 9, 11 ]
    if (Exercise.mode == 6)
        possible_notes = [0, 2, 3, 5, 7, 8, 10]
    else if (Exercise.mode == 2)
        possible_notes = [0, 2, 3, 5, 6, 7, 9, 10]
    else if (Exercise.mode == 3)
        possible_notes = [0, 1, 3, 5, 7, 8, 10]
    else if (Exercise.mode == 4)
        possible_notes = [0, 2, 4, 6, 7, 9, 11]
    else if (Exercise.mode == 5)
        possible_notes = [0, 2, 4, 5, 7, 9, 10]
    else if (Exercise.mode == 7)
        possible_notes = [0, 1, 3, 5, 6, 8, 10]

    


    // if (!upper)
    //     possible_notes = [ 0, -2, -4, -5, -7, -9, -11 ]

    if (first_note && upper) {
        return [0, 7, 12]
    }
    if (first_note && !upper) {
        return [0, -12]
    }

    var result = [];
    // P1, P5, P8, ^P5
    var dir = 1
    if (!upper) {
        dir = -1
    }
    result.push(note_number)
    result.push(note_number + 7*dir)
    result.push(note_number + 12*dir)
    result.push(note_number + 19*dir)

    // major 3rd, 6th, 10th
    var rest = [4, 9, 16]
    rest.forEach(function(steps) {
        var raw = note_number + steps*dir
        var norm = raw % 12
        if (norm < 0)
            norm += 12
        if (possible_notes.includes(norm)) {
            result.push(raw)
        } else {
            // push minor 3rd/6th/10th
            result.push(raw - 1*dir)
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