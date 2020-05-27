import videoCtm from '../../public/video/videoCtm.json';

class CustomSegmentMarker {
    constructor(options) {
        this._options = options;
    }

    init(group) {
        this._group = group;

        this._label = new Konva.Label({
            x: 0.5,
            y: 0.5
        });

        var color = this._options.segment.color;

        this._tag = new Konva.Tag({
            fill:             color,
            stroke:           color,
            strokeWidth:      1,
            pointerDirection: 'down',
            pointerWidth:     10,
            pointerHeight:    10,
            lineJoin:         'round',
            shadowColor:      'black',
            shadowBlur:       10,
            shadowOffsetX:    3,
            shadowOffsetY:    3,
            shadowOpacity:    0.3
        });

        this._label.add(this._tag);

        var labelText = this._options.segment.labelText +
            (this._options.startMarker ? ' start' : ' end');
        if ( this._options.segment.id.indexOf('CTM') === -1 ) {
            this._text = new Konva.Text({
                text: labelText,
                fontFamily: 'Calibri',
                fontSize: 14,
                padding: 5,
                fill: 'white'
            });
            // Vertical Line - create with default y and points, the real values
            // are set in fitToView().
            this._line = new Konva.Line({
                x: 0,
                y: 0,
                stroke: color,
                strokeWidth: 1
            });
            this._label.add(this._text);
            group.add(this._label);
            group.add(this._line);
        } else if ( this._options.startMarker ) {
            const id = this._options.segment.id.replace('CTM:', '');
            let ctm = videoCtm.find((ctm)=> ctm.id == id );

            this._rect1 = new Konva.Rect({
                x: 0,
                y: 5,
                width: ctm.duration * 175,
                height: 30,
                fill: 'rgba(23,49,186,0.90)',
                strokeWidth: 4
            });

            this._text1 = new Konva.Text({
                text: ctm.word,
                fontFamily: 'Calibri',
                fontSize: 14,
                padding: 1,
                fill: 'white'
            });
            this._label1 = new Konva.Label({
                x: 0,
                y: 5
            });
            this._label1.add(this._text1);



            group.add(this._rect1);
            group.add(this._label1);
        }

        this.fitToView();
        this.bindEventHandlers();
    }

    fitToView() {
        var offsetTop = 30;
        var offsetBottom = 26;
        var height = this._options.layer.getHeight();
        if ( this._options.segment.id.indexOf('CTM') === -1 ) {
            var labelHeight = this._text.height() + 2 * this._text.padding();


            this._group.y(offsetTop + labelHeight + 0.5);
            this._line.points([0.5, 0, 0.5, height - labelHeight - offsetTop - offsetBottom]);
        } else {
            this._group.y(offsetTop + height/2);
        }
    }

    bindEventHandlers (arg) {
        var container = document.getElementById('zoomview-container');

        this._group.on('mouseenter', function() {
            container.style.cursor = 'move';
        });

        this._group.on('drag', function(e) {
            debugger
            e.preventDefault();
            return false;
        });

        this._group.on('mouseleave', function() {
            container.style.cursor = 'default';
        });
    };
};

export default CustomSegmentMarker;