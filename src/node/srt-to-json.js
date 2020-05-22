var fs = require('fs');

fs.readFile('../../public/video/subtitle.srt', function(error, data) {
    if(error)
        throw error;

    var text = data.toString();
    var lines = text.split('\n');

    var output = [];
    var buffer = {
        content: []
    };

    lines.forEach(function(line) {

        if(!buffer.id)
            buffer.id = line;
        else if(!buffer.start && line !== '' && line.indexOf('-->') > -1) {
            var range = line.split(' --> ');
            buffer.start = hmsToSecondsOnly( range[0] );
            buffer.end = hmsToSecondsOnly( range[1] );
        }
        else if(line !== '')
            buffer.content.push(line);
        else {
            output.push(buffer);
            buffer = {
                content: []
            };
        }
    });

    fs.writeFile('../../public/video/subtitle.json', JSON.stringify(output), (err) => {
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