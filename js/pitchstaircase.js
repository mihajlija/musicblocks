

function PitchStairCase() {

    this.Stairs = [];

    this.makeStairs = function (start) {

        if(start === -1) {
            start = 0;
        } else {
            for (var j = start; j < this.Stairs.length-1; j++) {
                console.log(j);
                console.log(docById("playStairTable" + j));
                 docById("playStairTable" + j).remove();
                docById("stairTable"+ j).remove();  
            }
        }
        var thisStair = this;
        var iconSize = Math.floor(this.cellScale * 24);
        
        var StairDiv = docById('pitchstaircase');
        var StairDivPosition = StairDiv.getBoundingClientRect();

        var playPitchDiv = docById('playPitch');
        var playPitchDivPosition = playPitchDiv.getBoundingClientRect();

        for (var i = start; i < thisStair.Stairs.length; i++) {

            var playTable = document.createElement('TABLE');
            playTable.setAttribute('id', 'playStairTable' + i);
            playTable.style.textAlign = 'center';
            playTable.style.borderCollapse = 'collapse';
            playTable.cellSpacing = 0;
            playTable.cellPadding = 0;
            playPitchDiv.appendChild(playTable);

            var header = playTable.createTHead();
            var playrow = header.insertRow(-1);
            playrow.style.left = Math.floor(playPitchDivPosition.left) + 'px';
            playrow.style.top = Math.floor(MATRIXBUTTONHEIGHT * this.cellScale) + 'px';
            playrow.setAttribute('id', "playStair" + i);

            var playcell = playrow.insertCell(-1);
            playcell.style.width = Math.floor(MATRIXBUTTONHEIGHT * this.cellScale) + 'px';
            playcell.innerHTML = '&nbsp;&nbsp;<img src="header-icons/play-button.svg" title="' + _('play') + '" alt="' + _('play') + '" height="' + iconSize + '" width="' + iconSize + '" vertical-align="middle">&nbsp;&nbsp;';
            playcell.style.minWidth = playcell.style.width;
            playcell.style.maxWidth = playcell.style.width;
            playcell.style.height = Math.floor(RHYTHMRULERHEIGHT * this.cellScale) + 'px';
            playcell.style.backgroundColor = MATRIXBUTTONCOLOR;

            playcell.onclick = function() {
                console.log(playcell.parentNode.id);
                thisStair.PlayOne(playcell.parentNode.id[9]);
            };


            var StairTable = document.createElement('TABLE');
            StairTable.setAttribute('id', 'stairTable' + i);
            StairTable.style.textAlign = 'center';
            StairTable.style.borderCollapse = 'collapse';
            StairTable.cellSpacing = 0;
            StairTable.cellPadding = 0;
            StairDiv.appendChild(StairTable);

            var header = StairTable.createTHead();          
            var row = header.insertRow(-1);
            row.style.left = Math.floor(StairDivPosition.left) + 'px';
            row.style.top = Math.floor(MATRIXBUTTONHEIGHT * this.cellScale) + 'px';
            row.setAttribute('id','stair' + i)
            


            var solfege = this.Stairs[i][0];
            var octave = this.Stairs[i][1];

            var solfegetonote = this.logo.getNote(solfege, octave, 0, this.logo.keySignature[this.logoturtle])[0];

            var cell = row.insertCell(-1);
            cell.style.width = (StairDivPosition.width)* parseFloat(this.Stairs[i][2]/this.Stairs[0][2]) + 'px';
            cell.innerHTML = thisStair.Stairs[i][0] + thisStair.Stairs[i][1] + " "  + Math.floor(thisStair.Stairs[i][2]);
            cell.style.minWidth = cell.style.width;
            cell.style.maxWidth = cell.style.width;
            cell.style.height = Math.floor(RHYTHMRULERHEIGHT * this.cellScale) + 'px';
            cell.style.lineHeight = 60 + '%';
            cell.style.backgroundColor = MATRIXNOTECELLCOLOR;

            cell.addEventListener('click', function(event) {
                thisStair.dissectStair(event);
            });
        }
    }

    this.dissectStair = function(event) {
        var that = this;

        var inputNum = prompt(_('Divide By:'), "2:3");

      //  if(!isInt(inputNum)) {
     //       alert(_('Please Input a Integer'));
     //       inputNum = prompt(_('Divide By:'), 2);
     //   }

        var arr = inputNum.split(":");
        console.log(arr);

        inputNum = parseFloat(arr[0]/arr[1]);


        if(inputNum === null) {
            return ;
        }
        var oldcell = event.target;
        var frequency = that.Stairs[oldcell.parentNode.id[5]][2];
        var obj = frequencyToPitch(parseFloat(frequency)/inputNum);

        var flag = 0;

        for (var i=0 ; i < this.Stairs.length; i++) {

            if (this.Stairs[i][2] < parseFloat(frequency)/inputNum) {
                this.Stairs.splice(i, 0, [obj[0], obj[1], parseFloat(frequency)/inputNum]);
                flag = 1;
                break;
            }
        }
        if(flag === 0) {
            this.Stairs.push([obj[0], obj[1], parseFloat(frequency)/inputNum]);
        }
        this.makeStairs(i);
    };

    this.PlayOne = function(stairno) {
        var pitchnotes = [];
        console.log(this.Stairs[stairno]);
        var note = this.Stairs[stairno][0] + this.Stairs[stairno][1];
        pitchnotes.push(note.replace(/♭/g, 'b').replace(/♯/g, '#'));
        console.log(pitchnotes);
        this.logo.synth.trigger(pitchnotes, 0.125, 'poly');
    }

    this.playAll = function() {
        var pitchnotes = [];
        var note = this.Stairs[this.Stairs.length-1][0] + this.Stairs[this.Stairs.length-1][1];
        pitchnotes.push(note.replace(/♭/g, 'b').replace(/♯/g, '#'));
        var laststair = this.Stairs.length - 1;
        console.log("Playing stair " + laststair);     
        var row = docById('stair' + laststair);
        console.log(row.cells[0]);
        row.cells[0].style.backgroundColor = MATRIXBUTTONCOLOR;
        console.log(row.cells[0]);
        this.logo.synth.trigger(pitchnotes, 1, 'poly');
        this.playAllStairs(this.Stairs.length-2);
    }

    this.playAllStairs = function(stairno) {
        var that = this;
        setTimeout(function () {
            if(stairno > -1) {
                var pitchnotes = [];
                console.log("Playing stair " + stairno);
                var note = that.Stairs[stairno][0] + that.Stairs[stairno][1];
                pitchnotes.push(note.replace(/♭/g, 'b').replace(/♯/g, '#'));
                var row = docById('stair' + stairno);
                console.log(row.cells[0]);
                row.cells[0].style.backgroundColor = MATRIXBUTTONCOLOR;
                console.log(row.cells[0]);
                that.logo.synth.trigger(pitchnotes, 1, 'poly');
                that.playAllStairs(stairno-1);
            } else {
                for(var i = 0; i < that.Stairs.length; i++) {
                    var row = docById('stair' + i);
                    row.cells[0].style.backgroundColor = MATRIXNOTECELLCOLOR;
                }
            }
        }, 1000 + that.logo.turtleDelay);
    }

	this.init = function(logo) {

        console.log(this.Stairs);

		console.log("init PitchStairCase");
		this.logo = logo;

		docById('pitchstaircase').style.display = 'inline';
        console.log('setting PitchStairCase visible');
        docById('pitchstaircase').style.visibility = 'visible';
        docById('pitchstaircase').style.border = 2;

        docById('playPitch').style.display = 'inline';
        docById('playPitch').style.visibility = 'visible';
        docById('playPitch').style.border = 2;

        var w = window.innerWidth;
        this.cellScale = w / 1200;
        docById('pitchstaircase').style.width = Math.floor(w / 2) + 'px';
        docById('pitchstaircase').style.overflowX = 'auto';
		
    		var thisStair = this;

        var tables = document.getElementsByTagName('TABLE');

      //  console.log(tables);

        var noofTables = tables.length

        for (var i = 0; i < noofTables; i++) {
                tables[0].parentNode.removeChild(tables[0]);
        }

        var iconSize = Math.floor(this.cellScale * 24);

        var x = document.createElement('TABLE');
        x.setAttribute('id', 'buttonTable');
        x.style.textAlign = 'center';
        x.style.borderCollapse = 'collapse';
        x.cellSpacing = 0;
        x.cellPadding = 0;

        var StairDiv = docById('pitchstaircase');
        StairDiv.style.paddingTop = 0 + 'px';
        StairDiv.style.paddingLeft = 0 + 'px';
        StairDiv.appendChild(x);
        StairDivPosition = StairDiv.getBoundingClientRect();

        var x = document.createElement('TABLE');
        x.setAttribute('id', 'playAllStairTable');
        x.style.textAlign = 'center';
        x.style.borderCollapse = 'collapse';
        x.cellSpacing = 0;
        x.cellPadding = 0;

        var playPitchDiv = docById('playPitch');
        playPitchDiv.style.paddingTop = 0 + 'px';
        playPitchDiv.style.paddingLeft = 0 + 'px';
        playPitchDiv.appendChild(x);
        playPitchDivPosition = playPitchDiv.getBoundingClientRect();

        var table = docById('playAllStairTable');
        var header = table.createTHead();
        var row = header.insertRow(-1);
        row.style.left = Math.floor(playPitchDivPosition.left) + 'px';
        row.style.top = Math.floor(playPitchDivPosition.top) + 'px';
        row.setAttribute('id', 'playAllStair');

        var cell = row.insertCell(-1);
        cell.innerHTML = '&nbsp;&nbsp;<img src="header-icons/play-button.svg" title="' + _('play') + '" alt="' + _('play') + '" height="' + iconSize + '" width="' + iconSize + '" vertical-align="middle">&nbsp;&nbsp;';
        cell.style.width = Math.floor(MATRIXBUTTONHEIGHT * this.cellScale) + 'px';
        cell.style.minWidth = cell.style.width;
        cell.style.maxWidth = cell.style.width;
        cell.style.height = Math.floor(MATRIXBUTTONHEIGHT * this.cellScale) + 'px';
        cell.style.backgroundColor = MATRIXBUTTONCOLOR;
        cell.onclick = function() {
            thisStair.playAll();
        }


        var table = docById('buttonTable');
        var header = table.createTHead();
        var row = header.insertRow(0);
        row.style.left = Math.floor(StairDivPosition.left) + 'px';
        row.style.top = Math.floor(StairDivPosition.top) + 'px';

        var cell = row.insertCell(-1);
        cell.innerHTML = '&nbsp;&nbsp;<img src="header-icons/close-button.svg" title="' + _('close') + '" alt="' + _('close') + '" height="' + iconSize + '" width="' + iconSize + '" vertical-align="middle">&nbsp;&nbsp;';
        cell.style.width = Math.floor(MATRIXBUTTONHEIGHT * this.cellScale) + 'px';
        cell.style.minWidth = cell.style.width;
        cell.style.maxWidth = cell.style.width;
        cell.style.height = Math.floor(MATRIXBUTTONHEIGHT * this.cellScale) + 'px';
        cell.style.backgroundColor = MATRIXBUTTONCOLOR;


        cell.onclick=function() {
            docById('pitchstaircase').style.visibility = 'hidden';
            docById('playPitch').style.visibility = 'hidden';
        };

        cell.onmouseover=function() {
            this.style.backgroundColor = MATRIXBUTTONCOLORHOVER;
        };

        cell.onmouseout=function() {
            this.style.backgroundColor = MATRIXBUTTONCOLOR;
        };

        this.makeStairs(-1);
	};

};