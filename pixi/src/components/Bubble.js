import { Application, Container, Graphics, Sprite, loader, utils, sound } from 'pixi.js';
import { TweenMax, Power2, TimelineLite, TimelineMax, TweenLite, SteppedEase, RoughEase, Circ, Power0 } from "gsap";
import CustomEase from './CustomEase';
import Explosion from './Explosions';
import settings from './GameSettings';

class Bubble extends Graphics {
    constructor(props) {
        props = Object.assign({}, props);
        super(props);
        this.state = {
            bubbleMinSize: settings.minSize,
            bubbleMaxSize: settings.maxSize,
        }
        this.props = props;
        this.setup();
    }

    setup() {
        this.interactive = true;
        this.buttonMode = true;
        this.createBubble();
        this.setupAnimation();
        if (!sound.exists('explosion')) {
            sound.add('explosion', {
                url: 'assets/sounds/explosion.mp3',
                autoPlay: false,
                volume: 0.1
            });
        }
        this
            .once('pointerdown', () => {
                var boom = new Explosion({
                    bubble: this.props.bubble,
                    x: this.bubble.x,
                    y: this.bubble.y
                });
                sound.play('explosion');
                boom.emit('start');
                this.parent.addChild(boom);
                this.emit('count');
                this.emit('stop');
            })
            .once('stop', () => {
                this.visible = false;
            })
    }

    createLayer(texture) {
        const { bubbleMaxSize, bubbleMinSize } = this.state;
        var layer = new Sprite(texture);
        this.setSize(layer, bubbleMinSize, bubbleMaxSize);
        this.addChild(layer);
        return layer;
    }

    createBubble() {
        const { bubble } = this.props;
        this.bubble = this.createLayer(this.props.bubble);
        Object.assign(this.bubble, {
            anchor: { x: 0, y: 0 }
        });
    }

    setSize(sprite, min, max) {
        var s = this.range(min, max);
        sprite.scale.set(s / 9);
    }

    setupAnimation() {
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
                ease: Power0.easeNone,
                onComplete: () => {
                    this.Destroy();
                },
            }, 0);
    }

    async Destroy() {
        await this.emit('destroy');
        return super.destroy();
    }

    range(min, max) { return min + Math.random() * (max - min); }
    Random(max) { return Math.random() * max; }
}

export default Bubble;