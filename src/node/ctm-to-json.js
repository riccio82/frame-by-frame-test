var fs = require('fs');

fs.readFile('../../public/video/tedx.timed.txt', function(error, data) {
    if(error)
        throw error;

    var text = data.toString();
    var lines = text.split('\n');

    var output = [];
    var buffer = {
        content: []
    };
    var index = 1;
    lines.forEach(function(line) {
        var range = line.split(' ');
        buffer = {
            id: index,
            word: range[2].replace('\r', '')
        };
        buffer.start =  parseFloat(range[0]);
        buffer.end =  parseFloat(range[0]) + parseFloat(range[1]) ;
        buffer.duration = parseFloat(range[1]) ;
        console.log(buffer, range);
        output.push(buffer);
        index++;
    });

    fs.writeFile('../../public/video/videoCtm.json', JSON.stringify(output), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
});

function hmsToSecondsOnly(str) {
    str = str.replace(',', ':')
    var a = str.split(':'); // split it at the colons

// minutes are worth 60 seconds. Hours are worth 60 minutes.
    return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]) + (+a[3])/1000;

    console.log(seconds);
}