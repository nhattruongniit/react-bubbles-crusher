import { Application, DisplayObject } from 'pixi.js';
import { Welcome } from './components/Welcome';
import { GamePlay } from './components/GamePlay';
import { Summary } from './components/Summary';
import settings from './components/GameSettings';

Object.entries = Object.entries || function (object) {
    var arr = []
    for (var x in object) {
        arr.push([x, object[x]]);
    }
    return arr;
}

Object.values = Object.values || function (object) {
    var arr = [];
    for (var x in object) {
        arr.push(object[x]);
    }
    return arr;
}

Object.keys = Object.keys || function (object) {
    var arr = [];
    for (var x in object) {
        arr.push(x);
    }
    return arr;
}

Object.assign(DisplayObject.prototype, {
    setSize: function (mode, parent) {
        if (!this.parent) return this.on('added', this.setSize.bind(this));
        parent = parent || this.parent;
        var pRatio = parent.height / parent.width,
            { width, height } = this,
            ratio = height / width;

        switch (mode) {
            case 'cover':
                if (pRatio < ratio) {
                    this.width = parent.width;
                    this.height *= ratio;
                } else {
                    this.height = parent.height;
                    this.width *= ratio;
                }
                break;
            case 'contain':
                if (pRatio > ratio) {
                    this.width = parent.width;
                    this.height *= ratio;
                } else {
                    this.height = parent.height;
                    this.width *= ratio;
                }
                break;
            default:
                this.width = parent.width;
                this.height = parent.height;
                break;
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const container = window.game = new Application({
        width: 513,
        height: 936,
        antialias: true,
        transparent: true
    });

    var welcome = this.welcome = new Welcome({
        images: 'assets/sprites/backgrounds.json',
        width: 513,
        height: 936
    });
    container.stage.addChild(welcome);
    
    welcome.on('startGame', () => {
        var game = new GamePlay({
            width: 513, // default: 800
            height: 936, // default: 600
            bubles: 'assets/sprites/bubles.json',
            backgrounds: 'assets/sprites/backgrounds.json',
            cards: 'assets/sprites/cards.json',
            autoPlay: true,
            level: 1,
            playTimes: settings.playTimes,

        });
        container.stage.addChildAt(game, 0);

        game.on('summary', (state) => {
            var sum = new Summary({
                width: 513,
                height: 936,
                card: state.card,
                point: state.point
            });
            container.stage.addChild(sum);
            sum.once('retry', () => {
                sum.destroy();
                game.destroy();
                welcome.emit('startGame');
            })
        })

    });

    document.body.appendChild(container.view);
});