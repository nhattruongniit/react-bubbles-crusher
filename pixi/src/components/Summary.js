import { Application, Container, Graphics, Sprite, loader, utils, Text, TextStyle, ticker, sound } from 'pixi.js';
import { TweenMax, Power2, TimelineLite } from "gsap";
import Sound from 'pixi-sound';

export class Summary extends Container {
    constructor(props) {
        super(props);
        this.props = props;
        this.setup();
    }

    setup() {
        this.textures = loader.resources.backgrounds.textures;
        this
            .on('added', () => {
                sound.play('bg');
                var bg = new Sprite(this.textures['background']);
                this.addChild(bg);
                bg.setSize('cover', this.props);
                //set text
                var text = this.text = new Text('Summary', new TextStyle({
                    fontFamily: 'Arial',
                    fontSize: 50,
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
                    anchor: { x: .5, y: 0 },
                    x: this.width / 2 - text.width,
                    y: 100
                })
                this.addChild(text);

                var point = this.point = new Text('Point:', new TextStyle({
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
                Object.assign(point, {
                    anchor: { x: 0, y: 0 },
                    x: this.props.width / 2 - point.width,
                    y: 200
                })
                this.point.text = "Point: " + this.props.point;
                this.addChild(point);

                var card = this.card = new Text('Card: ', new TextStyle({
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
                Object.assign(card, {
                    anchor: { x: 0, y: 0 },
                    x: this.props.width / 2 - card.width,
                    y: 280
                })
                this.card.text = "Card: " + this.props.card;
                this.addChild(card);

                this.setButtonPlay();
            });
    }

    setButtonPlay() {
        var button = new Sprite(this.textures['play-button']);
        Object.assign(button, {
            interactive: true,
            buttonMode: true,
            anchor: { x: 0, y: 0 }
        });
        TweenLite.set(button, {
            x: -button.width,
            y: this.props.height / 2
        });
        TweenLite.to(button, 1, { ease: Elastic.easeOut.config(1, 0.5), y: this.props.height / 2, x: this.props.width / 2 - button.width / 2 });
        this.addChild(button);
        //button on tap
        button.on('tap', () => {
            TweenLite.to(this, 0.5, {
                alpha: 0,
                onComplete: () => {
                    loader.reset();
                    sound.removeAll();
                    this.emit('retry');
                }
            });
        });
    }
}

export default Summary;