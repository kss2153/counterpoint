var times = 0;

function Note(input, x) {
    this.noteNumber = input;
    this.firstNote = x;
    this.hInterval = -1;
    this.mInterval = -1;

    // N is note number of bottom note, fNote = first top note?
    this.generate = function (N, fNote) {
        // possible notes: B, C, D, E, F, G, A
        var pNotes = [ 0, 1, 3, 5, 6, 8, 10 ];

        if (fNote) {
            var k = [1, 8, 13];
            return k;
        } else {
            var k = [];
            var z = N + 4;
            var z1 = z % 12;
            if (this.contains(pNotes, z1)) {
                k[0] = z;
            } else {
                k[0] = z - 1;
            }
        }

        z = N + 7;
        k[1] = z;
        z = N + 9;
        z1 = z % 12;
        if (this.contains(pNotes, z1)) {
            k[2] = z;
        } else {
            k[2] = z - 1;
        }

        z = N + 12;
        k[3] = z;
        z = N + 16;
        z1 = z % 12;

        if (this.contains(pNotes, z1)) {
            k[4] = z;
        }  else {
            k[4] = z - 1;
        }

        k[5] = N;


        return k;
    };

    this.contains = function(a, b) {
        for (var i = 0; i < a.length; i++) {
            if (b === a[i]) {
                return true;
            }
        }
        return false;
    };

    /*  methods return true if valid, false if invalid
        rule 7
        valid leaps up: 2nd, 3rd, 4th, 5th, m6th, 8th
        valid leaps down: 2nd, 3rd, 4th, 5th, 8th
        input is the melodic interval of the note
    */
    this.check1 = function (melInt) {
        var pIntervals = [ 1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 7, -7, 8, 12, -12 ];
        var ret = this.contains(pIntervals, melInt);
        return ret;
    };

    /*  guide 1
        skips are jumps of third, leaps are jumps of fourths or more
        change direction and move by step after leap
        input are the 2 melodic intervals
        ONLY RUN WHEN THERE ARE 3 OR MORE ELEMENTS GENERATED
        a-->b-->c
        melodic 1 == b - a==melInt1
        melodic 2 == c - b==melInt2
        melodic interval 1 is the leap/step and melodic interval 2
        should be step-wise in opposite direction if leap
        run guide 6 only if there are at least two actual melodic intervals
    */

    this.check2 = function (mInt1, mInt2) {
        var a = mInt2 > 0 && mInt1 < 0;
        var b = mInt2 < 0 && mInt1 > 0;
        var step = [ 1, -1, 2, -2 ];
        var skip = [ 3, -3, 4, -4 ];
        var leap = [ 5, -5, 7, -7, 8, 12, -12 ];

        if (this.contains(step, mInt1)) {
            return true;
        }

        if (this.contains(skip, mInt1)) {
            return true;
        }

        if (this.contains(leap, mInt1)) {
            if (a || b) {
                if (this.contains(step, mInt1)) {
                    return true;
                }
            }
        }
        return false;
    };

    /*  rule 2
        no parallel (repeated) perfect intervals (1, 5th, 8th)
        input is the hInterval(new) and hInterval(old)
        a-->b
        hInt new is hInt of b, hInt old is hInt of a
    */

    this.check3 = function (intervalNew, intervalOld) {
        if (intervalNew === intervalOld) {
            var perfect = [ 0, 7, 12 ];
            if (this.contains(perfect, intervalOld)) {
                return false;
            }
        }
        return true;
    };

    /*  rule 4, rule 8
        begin on 1, 5th, or 8th (already built in, don't need to check)
        end on 1
        RUN CHECK AFTER FULL ARRAY GENERATED
    */

    this.check7 = function (k) {
        if (k[k.length - 2].hInterval % 12 === 9) {
            if (k[k.length - 1].hInterval % 12 === 0) {
                return true;
            }
        }
        return false;
    };

    /*  rule 9
        input are the 3 harmonic intervals
        a-->b-->c-->d
        harmonic 1 == a-->b==harInt1
        harmonic 2 == b-->c==harInt2
        harmonic 3 == c-->d==harInt3
    */
    // considering changing to four thirds in a row

    this.check4 = function (harInt1, harInt2, harInt3) {
        if ((harInt3 === 4 || harInt3 === 3) && (harInt2 === 4 || harInt2 === 3)
                && (harInt1 === 4 || harInt1 === 3)) {
            return false;
        } else if ((harInt3 === 8 || harInt3 === 9)
                && (harInt2 === 8 || harInt2 === 9)
                && (harInt1 === 8 || harInt1 === 9)) {
            return false;            
        } else if ((harInt3 === 16 || harInt3 === 15)
                && (harInt2 === 16 || harInt2 === 15)
                && (harInt1 === 16 || harInt1 === 15)) {
            return false;
        } else {
            return true;
        }
    };

    /*  rule 3
        top: a-->b
        bot(Original): c-->d
        melint1 is a-->b
        melint(original) is c-->d
        hint = b.hInterval
    */

    this.check5 = function (melInt1, melInt0, hInt) {
        var perfectInterval = [ 0, 7, 12 ];
        var step = [ 1, -1, 2, -2 ];
        var a = melInt1 > 0 && melInt0 > 0;
        var b = melInt1 < 0 && melInt0 < 0;
        if (this.contains(step, melInt1) && (this.contains(perfectInterval, hInt))) {
            return true;
        } else if (this.contains(perfectInterval, hInt)) {
            if (a || b) {
                return false;
            }
        }
        return true;
    };

    /*  guide 1
        input is an array of melodic intervals (first term is 0)
        We still need to write a method for generating an array of melodic
        intervals (ints)
        from the array of notes

        public boolean guide1(int[] k) {

                return false;

        }
    */

    /*  rule 11
        input are the 3 melodic intervals
        a -->b-->c-->d
        melodic 1 == a-->b==melInt1
        melodic 2 == b-->c==melInt2
        melodic 3 == c-->d==melInt3
        checks for 3 skips in a row
        run only if there are at least four actual melodic intervals
    */

    this.check6 = function (mInt1, mInt2, mInt3) {
        var skip = [ 3, -3, 4, -4 ];
        if ((this.contains(skip, mInt1)) && (this.contains(skip, mInt2))
                && (this.contains(skip, mInt3))) {
            return false;
        } else {
            return true;
        }
    };

}

// creates Note objects from integer representations (i.e. 1,3,5...)
// takes any starting integer and makes that 1
function intToNote(k) {
    var l1 = [];
    if (k.length === 0) {
        return l1;
    } else {
        var x = k[0];
        for (var i = 0; i < k.length; i++) {
            var r = new Note(k[i] - x + 1, false);
            l1.push(r);
        }
        return l1;
    }
}

function isGood(input, current, next) {
    if (current.length > 0) {
        if (!next.check1(next.mInterval)) {
            return false;
        }
    }
    
    if (current.length > 1) {
        if (!next.check2(current[current.length - 1].mInterval, 
                next.mInterval)) {
            return false;
        }
    }
    
    if (current.length > 0) {
        if (!next.check3(current[current.length - 1].hInterval,
                next.hInterval)) {
            return false;
        }
    }
    
    if (current.length > 2) {
        if (!next.check4(current[current.length - 2].hInterval,
                current[current.length - 1].hInterval,
                next.hInterval)) {
            return false;                        
        }
    }
    
    if (current.length > 1) {
        if (!next.check5(next.mInterval, input[current.length - 1].noteNumber 
                - input[current.length - 2].noteNumber, next.hInterval)){
            return false;    
        }
    }
    
    if (current.length > 2) {
        if (!next.check6(current[current.length - 2].mInterval,
                current[current.length - 1].mInterval, next.mInterval)) {
            return false;       
        }
    }

    if (current.length == input.length - 2) {
        if (next.noteNumber != 3 && next.noteNumber != 12 && next.noteNumber != 15) {
            return false;
        }
    }

    if (current.length == input.length - 1) {
        if (next.noteNumber != 1 && next.noteNumber != 13) {
            return false;
        }
    }
    
    return true;
}

function allNextNotes(input, current) {
    var l1 = [];
    if (current.length === 0) {
        // l2 is the array of possible harmonic intervals converted to note numbers
        var l2 = input[0].generate(input[0].noteNumber, true);
        for (var i = 0; i < l2.length; i++) {
            var a = new Note(l2[i], true);
            a.hInterval = a.noteNumber - input[0].noteNumber;
            l1.push(a);
        }
    } else if (current.length >= input.length) {
        return l1;
    } else {
        var l2 = input[0].generate(input[current.length].noteNumber, false);
        for (var i = 0; i < l2.length; i++) {
            var a = new Note(l2[i], false);
            a.hInterval = a.noteNumber - input[current.length].noteNumber;
            a.mInterval = a.noteNumber - current[current.length - 1].noteNumber;
            l1.push(a);
        }
    }
    return l1;
}


// length: number of notes in complete line
// a is final solution?
// noteList: solution so far
// input: the Note objects that make up the cf
function search(length, a, noteList, input) {
    times++;
    if (length === 0) {
        a.push(noteList);
        return;
    } else {
        for (var i = 0; i < allNextNotes(input, noteList).length; i++) {
            
            var note = allNextNotes(input, noteList)[i];
            
            if (isGood(input, noteList, allNextNotes(input, noteList)[i])) {
                var copy = [];
                for (var j = 0; j < noteList.length; j++) {
                    var data = noteList[j];
                    copy.push(data);
                }
                copy.push(note);
                search(length - 1, a, copy, input);
            }
        }
    }
}

function test() {
    document.getElementById("demo").innerHTML = "testing?";

    var cf = [ 1, 5 , 6, 8,  5, 10, 8, 5, 6, 5, 3, 1 ];
    //var cf = [ 1, 5 , 6, 1];
    var cf2 = [];
    var l1 = intToNote(cf);
    var l2 = intToNote(cf2);
    var a = [];
    
    search(l1.length, a, l2, l1);
    
    document.getElementById("demo").innerHTML = ""+times;
        document.getElementById("demo").innerHTML = ""+a.length;
        
    var res = "";
    for (var i = 0; i < a[1].length; i++) {
        res += a[1][i].noteNumber + ", ";
    }
}

