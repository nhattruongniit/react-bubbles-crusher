import { Application, Container, Graphics, Sprite, loader, utils, sound } from 'pixi.js';
import { TweenMax, Power2, TimelineLite, TimelineMax, TweenLite, SteppedEase, RoughEase, Circ, Power0, Back } from "gsap";

class Card extends Graphics {
    constructor(props) {
        super(props);
        this.props = props;
        this.setup();
    }

    setup() {
        var _this = this;
        this.interactive = false;
        var { card, background, x, y, width, height } = this.props;
        var bgSprite, cardSprite, _this = this,
            tl = new TimelineMax();
        this
            .once('start', () => {

                bgSprite = this.createLayer(background);
                cardSprite = this.createLayer(card);

                this.emit('animation', bgSprite);
                this.emit('animation', cardSprite);

            })
            .on('animation', (card) => {
                TweenLite.set(card, {
                    x: x,
                    y: y,
                    alpha: .5,
                    rotation: -180,
                    css: { scale: 0.5 }
                });

                tl.to(card, 2, {
                    rotationY: 222,
                    transformOrigin: "center top",
                })
                    .to(card, .5, {
                        alpha: 1,
                        rotation: 0,
                        css: { scale: 1 },
                        ease: Quad.easeInOut
                    }, 0)
                    .to(card, 1.5, {
                        x: width - 50,
                        y: 50,
                        alpha: 0,
                        ease: Circ.easeIn,
                        onComplete: () => {
                            // _this.destroy();
                        }
                    }, 1.5);

            });
    }

    createLayer(sprite) {
        var card = new Sprite(sprite);
        Object.assign(card, {
            anchor: { x: 0.5, y: 0.5 }
        });
        card.scale.set(0.5);
        this.addChild(card);
        return card;
    }

    range(min, max) { return min + Math.random() * (max - min); }
    Random(max) { return Math.random() * max; }
}

export default Card;