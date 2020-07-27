import { Application, Container, Graphics, Sprite, loader, utils, sound } from 'pixi.js';
import { TweenMax, Power2, TimelineLite, TimelineMax, TweenLite, SteppedEase, RoughEase, Circ, Power0, Power4 } from "gsap";
import Card from './Card';
import settings from './GameSettings';

class BubbleCard extends Graphics {
    constructor(props) {
        props = Object.assign({}, props);
        super(props);
        this.state = {
            bubbleMinSize: settings.minSize,
            bubbleMaxSize: settings.maxSize,
        };
        this.props = props;

        this.setup();
    }

    setup() {
        this.interactive = true;
        this.buttonMode = true;
        Object.entries(loader.resources.cards.textures).forEach(el => { el[1].cardID = el[0] });
        this.cardTextures = loader.resources.cards.textures;
        this.cardBackground = loader.resources.backgrounds.textures['bg-card'];
        if (!sound.exists('explosion')) {
            sound.add('explosion', {
                url: 'assets/sounds/explosion.mp3',
                autoPlay: false,
                volume: 0.1
            });
        }
        this
            .on('added', () => {
                var bubble = this.bubble = new Sprite(this.props.bubble);
                this.addChild(this.bubble);
                Object.assign(this.bubble, {
                    anchor: { x: 0, y: 0 }
                });
                this.setSize(bubble, this.state.bubbleMinSize, this.state.bubbleMaxSize);
                this.emit('animation');
            })
            .on('animation', () => {
                const { bubble } = this;
                const { speed, height, width } = this.props;
                var xpos = 0;
                var _this = this;

                var anim = this.anim = new TimelineMax().set(this.bubble, { y: height + this.bubble.height, x: xpos < 0 ? _this.range(0, width) : _this.range(-xpos * height, width - 30) }, 0)
                    .to(
                    bubble,
                    speed,
                    {
                        y: -bubble.height,
                        x: _this.range(0, width / 1.5),
                        ease: Power1.easeOut,
                        onComplete: () => {
                            this.destroy();
                        },
                    }, 0);
            })
            .once('pointerdown', () => {
                var cards = Object.values(this.cardTextures);
                var index = Math.floor(this.range(0, 9));

                var card = new Card({
                    card: cards[index],
                    height: this.props.height,
                    width: this.props.width,
                    background: this.cardBackground,
                    x: this.bubble.x,
                    y: this.bubble.y
                });
                sound.play('explosion');
                this.parent.addChild(card);
                card.emit('start');
                this.emit('count');
                this.emit('stop');
                
                this.visible = false;
            })
            .on('stop', () => {
                this.visible = false;
            });
    }

    setSize(sprite, min, max) {
        var s = this.range(min, max);
        sprite.scale.set(s / 9);
    }

    async destroy() {
        await this.emit('destroy');
        return super.destroy();
    }

    range(min, max) { return min + Math.random() * (max - min); }
    Random(max) { return Math.random() * max; }
}

export default BubbleCard;