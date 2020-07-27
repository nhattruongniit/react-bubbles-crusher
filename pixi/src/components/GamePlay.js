import { Application, Container, Graphics, Sprite, loader, utils, Text, TextStyle, ticker, sound } from 'pixi.js';
import { TweenMax, Power2, TimelineLite, TweenLite } from "gsap";
import Particle from './Particles';
import PointCounter from './PointCounter';
import CardCounter from './CardCounter';
import Bubble from './Bubble';
import BubbleCard from './BubbleCard';
import settings from './GameSettings';
import TimeCounter from './Timer'

export class GamePlay extends Container {
    constructor(props) {
        props = Object.assign({}, GamePlay.default, props);
        super(props);
        this.props = props;
        this.state = {
            point: 0,
            card: 0,
            bubbleSpeed: settings.speed,
            bubbleInterval: settings.interval,
            bubbleCardSpeed: settings.speed - 2,
            level: 1,
        };
        loader
            .add('bubles', props.bubles)
            .add('backgrounds', props.backgrounds)
            .add('cards', props.cards)
            .load(this.setup.bind(this))
    }

    setup() {
        Object.entries(loader.resources.bubles.textures).forEach(el => { el[1].bubleID = el[0] });
        this.bubbleTextures = loader.resources.bubles.textures;
        this.bgTextures = loader.resources.backgrounds.textures;
        var { width, height } = this.props;
        this.setSound();
        this.setBackground();
        this.setText();
        this.countDownBegin();
        this.newGame();
        this
            .on('overtime', () => {
                clearInterval(this.speedUpInterval);
                sound.stop('bg');
                TweenLite.to(this, 0.5, {
                    alpha: 0,
                    onComplete: () => {
                        this.emit('summary', this.state);
                    }
                });
            });

        sound.play('start', { loop: false, speed: 1 });
    }

    setText() {
        var pointCounter, cardCounter, timer;
        pointCounter = this.pointCounter = new PointCounter({
            width: this.props.width,
            height: this.props.height,
        });
        cardCounter = this.cardCounter = new CardCounter({
            width: this.props.width,
            height: this.props.height
        });
    }

    setSound() {
        sound.add('bg', {
            url: 'assets/sounds/background.mp3',
            autoPlay: false,
            preload: true,
            volume: 0.1
        });

        sound.add('levelup', {
            url: 'assets/sounds/levelup.wav',
            autoPlay: false,
            preload: false,
            volume: 0.1
        });
        sound.add('start', {
            url: 'assets/sounds/start.wav',
            autoPlay: false,
            preload: false,
            volume: 0.1
        });
    }

    setBackground() {
        var bg = new Sprite(this.bgTextures['background']);
        this.addChild(bg);
        bg.setSize('cover', this.props);
    }

    newGame() {
        var { width, height } = this.props;
        var bubbles = Object.values(this.bubbleTextures);
        bubbles.shift();

        setTimeout(() => {
            this.addChild(this.pointCounter);
            this.addChild(this.cardCounter);
            this.setTime();
            this.speedUp();
            var bubbleInterval = this.bubbleInterval = setInterval(() => {
                this.setBubble(bubbles);
            }, this.state.bubbleInterval);

            var bubblecardInterval = this.bubblecardInterval = setInterval(() => {
                this.setBubbleCard();
            }, Math.floor(this.range(settings.rangeShowCard[0], settings.rangeShowCard[1])));

            sound.play('bg', {
                loop: true,
                volume: .4
            });
        }, settings.countDownTime * 1000);
    }

    setTime() {
        var timer = this.timer = new TimeCounter({
            width: this.props.width,
            height: this.props.height,
        });
        this.addChild(timer);
        timer.addTime(this.props.playTimes);
        timer.start();
        timer.once('overtime', () => {
            this.emit('overtime');
        });
    }

    setBubble(bubbles) {
        var index = this.range(0, 5);
        var bubble = this.bubble = new Bubble({
            bubble: bubbles[Math.floor(index)],
            width: this.props.width,
            height: this.props.height,
            speed: this.state.bubbleSpeed
        });
        this.addChild(bubble);

        bubble
            .on('count', () => {
                var point = this.state.point += 1;
                this.pointCounter.emit('setPoint', point);
            });
    }

    setBubbleCard() {
        var bubbleCard = new BubbleCard({
            bubble: Object.values(this.bubbleTextures)[0],
            width: this.props.width,
            height: this.props.height,
            speed: this.state.bubbleCardSpeed
        });
        this.addChild(bubbleCard);

        bubbleCard
            .on('count', () => {
                var card = this.state.card += 1;
                this.cardCounter.emit('setCard', card);
            });
    }

    speedUp() {
        this.speedUpInterval = setInterval(() => {
            this.state.bubbleSpeed = this.state.bubbleSpeed >=1 ? this.state.bubbleSpeed -= .5 : 1;
            this.state.bubbleInterval = this.state.bubbleInterval >= 100 ? this.state.bubbleInterval -= 50 : 100;
            sound.play('levelup', {
                loop: false
            });
        }, settings.timeSpeedUp * 1000);
    }

    countDownBegin() {
        var num = settings.countDownTime - 1;
        var countNum = this.countNum = new Text(num, new TextStyle({
            fontFamily: 'Arial',
            fontSize: 100,
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
        Object.assign(countNum, {
            anchor: { x: 0, y: 0 },
            x: this.props.width / 2 - countNum.width / 2,
            y: this.props.height / 2 - countNum.height / 2
        });
        var countNumInterval = setInterval(() => {
            if (num > 0) {
                num -= 1;
                this.countNum.text = num;
            } else {
                countNum.visible = false;
                clearInterval(countNumInterval);
                this.removeChild(countNum);
            }
        }, 1000);
        this.addChild(countNum);
    }

    range(min, max) { return min + Math.random() * (max - min); }
}

GamePlay.default = {
    level: 1,
    transparent: true,
    autoPlay: false,
    while: true
}

export default GamePlay;