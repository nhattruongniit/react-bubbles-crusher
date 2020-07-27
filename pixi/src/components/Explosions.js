import { Application, Container, Graphics, Sprite, loader, utils } from 'pixi.js';
import { TweenMax, Power2, TimelineLite, TimelineMax, TweenLite, SteppedEase, RoughEase, Circ, Power0 } from "gsap";

class Explosion extends Container {
    constructor(props) {
        super(props);
        this.props = props;
        this.setup();
    }

    setup() {
        var _this = this;
        this.interactive = false;
        this
            .once('start', e => {
                const { bubble, x, y } = this.props;
                this.bubbles = [];
                var tl = new TimelineLite(),
                angle, length, i, size, gravity = 1, num;
                num = this.range(5,20);
                for (i = 0; i < Math.floor(num); i++) {
                    var sprite = new Sprite(bubble);
                    this.addChild(sprite);

                    size = this.range(0.5, 1.5);
                    angle = Math.random() * Math.PI * 2;
                    length = Math.random() * (50 - size / 2);

                    this.setSize(sprite, 0.5, 1.5);

                    TweenLite.set(sprite, {
                        x: x,
                        y: y,
                        force3D: true
                    });

                    tl.to(sprite, 1 + Math.random(), {
                        alpha: 0,
                        x: x + Math.cos(angle) * length * 4,
                        y: y + Math.sin(angle) * length * 4,
                        onComplete: () => {
                            this.destroy();
                        }
                    }, 0);

                    this.bubbles.push(sprite);
                }
            })
            .on('stop', e => {
                
            });
    }

    setSize(sprite, min, max) {
        var s = this.range(min, max);
        sprite.scale.set(s / 9);
    }
    range(min, max) { return min + Math.random() * (max - min); }
}

export default Explosion;