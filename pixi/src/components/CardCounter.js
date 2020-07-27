import { Container, Text, TextStyle, ticker } from "pixi.js";

class CardCounter extends Container {
    constructor(props) {
        super(props);
        this.props = props;

        this.setup();
    }

    setup() {
        this.createCardView();
        this
            .on('setCard', (point) => {
                this.text.text = "Cards: " +point;
            });
    }

    createCardView() {
        var text = this.text = new Text('Card: 0', new TextStyle({
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
        Object.assign(text, {
            anchor: { x: 1, y: 0 },
            x: 460,
            y: 20
        })
        this.addChild(text);
    }
}

export default CardCounter;