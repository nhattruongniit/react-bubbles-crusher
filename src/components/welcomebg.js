import { Container, Graphics, Sprite, utils, loader, sound } from 'pixi.js';
import { TweenLite, Ease, Back, Elastic} from 'gsap';
import Particle from './particles';
// import Sound from 'pixi-sound';

export class Welcome extends Container {
    constructor(props) {
        super(props);
        this.props = props;
        loader
            .add('welcome', props.images)
            .load(this.setup.bind(this))
    }

    setup() {
        this.textures = loader.resources.welcome.textures;
        this.setBackground();
        this.setParticle();
        this.setButtonPlay();
    }


    setBackground() {
        var bg = new Sprite(this.textures.background);
        this.addChild(bg);
        // bg.setSize('cover', this.props);
    }

    setParticle() {
        var particle = new Particle({
            width: this.props.width,
            height: this.props.height,
            num: 100,
            effect: 'Starfall',
            objects: [0x55476a, 0xae3d63, 0xdb3853, 0xf45c44, 0xf8b646, 0xffffff].map((color) => {
                var ga = new Graphics({
                    width: 50,
                    height: 50
                });

                ga.beginFill(color);
                ga.alpha = 1;
                ga.drawCircle(10, 10, 10);
                // ga.drawRect(0, 0, 15, 15);
                // ga.drawRoundedRect(0, 0, 15, 15, 5); 
                return ga;
            })
        });

        this.addChild(particle);
    }

    setButtonPlay() {
        const button = new Sprite(this.textures['play-button']);
        Object.assign(button, {
            interactive: true,
            buttonMode: true,
            anchor: { x: 0, y: 0 }
        });
        TweenLite.set(button, {
            x: -button.width,
            y: this.props.height/2 - button.height/2
        });
        TweenLite.to(button, 1, { ease: Elastic.easeOut.config(1, 0.5), y: this.props.height/2 - button.height/2, x: this.props.width/2 - button.width/2 });
        this.addChild(button);
        button.on('tap', () => {
            this.emit('startGame');
            sound.remove('bg');
            TweenLite.to(this, 0.3, {
                alpha: 0,
                onComplete: () => this.visible = false
            });
        });
    }
}