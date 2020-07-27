import { Container, Text, TextStyle, ticker } from "pixi.js";

class TimeCounter extends Container {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
        this.createText();
        this.reset();
        this.ticker = this.update.bind(this);
    }

    createText() {
        this.text = new Text('0', new TextStyle({
            fontFamily: 'Arial',
            fontSize: 30,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440
        }));
        Object.assign(this.text, {
            anchor: { x: 0, y: 0 },
            x: this.props.width / 2 - this.text.width / 2,
            y: 20
        });
        this.addChild(this.text);

    }

    now() { return new Date().getTime(); }

    start() {
        this.state.start = this.now();
        ticker.shared.add(this.ticker);
    }
    pause() {
        var now = this.now();
        this.state.limit -= now - this.state.start;
        delete this.state.start

        ticker.shared.remove(this.ticker);
    }
    reset() {
        this.state.limit = 0;
        this.text.text = 0;
        delete this.state.start;
        ticker.shared.remove(this.ticker);
    }

    addTime(second) {
        this.state.limit += second * 1000;
        this.update();
    }

    update() {
        var time = (this.state.limit - (this.now() - (this.state.start || this.now()))) / 1000;
        if (time <= 0) {
            this.emit('overtime');
            time = 0;
            this.reset();
        }

        this.text.text = time.toFixed(0);
    }
}

export default TimeCounter;