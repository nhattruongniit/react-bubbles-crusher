import { Application, Container, Graphics, Sprite, loader, utils, RenderTexture, Texture, ticker } from 'pixi.js';
import { TweenMax, Power2, TimelineLite, TimelineMax, Power0, Circ, Expo } from "gsap";


class Particle extends Graphics {
    constructor(props) {
        props = Object.assign({}, Particle.default, props);
        super(props);
        if (!props.objects.length) return;
        this.props = props;

        // this.beginFill(0xfff000);
        // this.alpha = 1;
        // this.drawRect(10, 10, props.width - 20, props.height - 20);

        this.hookRenderer();
        this.on('hookRenderer', (renderer) => {
            this.convertTexture(renderer);
            this.setup();
        });
    }

    hookRenderer() {
        ['renderWebGL'].forEach((key) => {
            var native = this[key];
            this[key] = function () {
                var renderer = arguments[0];
                this[key] = native;
                this[key].apply(this, arguments);
                this.emit('hookRenderer', renderer);
            }
        });
    }

    convertTexture(renderer) {
        this.textures = this.props.objects.map(object => renderer.generateTexture(object));
    }


    setup() {
        this.setupTicker();
        this.add(this.props.num);
    }

    setupTicker() {
        var This = this;
        var tick = function () { This.emit('tick') };
        this.parent && ticker.shared.add(tick);
        this.on('added', () => ticker.shared.add(tick));
        this.on('removed', () => ticker.shared.remove(tick));
    }

    setUpEffect(sprites) {
        var effect = Particle[this.props.effect] || Particle.Fallen;
        var tickers = sprites.map(sprite => effect.call(this, sprite));
        this.on('tick', () => tickers.forEach(ticker => ticker()));
    }

    createSprite() {
        var textures = this.textures,
            index = Math.floor((Math.random() * (textures.length - 1))),
            sprite = new Sprite(textures[index]);
        return sprite;
    }

    range(a, b) { return (b - a) * Math.random() + a }

    randomMax(max) {
        return Math.random() * max;
    }

    random(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    }

    add(num) {
        var sprites = [],
            sprite;
        for (var i = 0; i < num; i++) {
            sprites.push(sprite = this.createSprite());
            this.addChild(sprite);
        }
        this.setUpEffect(sprites);
        return sprites;
    }

    remove(num) {
        return this.children.slice(0, num).map(sprite => {
            this.emit('remove', sprite);
            sprite.destroy();
            //sprite.emit('destroy');
        });
    }
}

Particle.default = {
    num: 200,
    objects: [],
    speed: 1,
    effect: 'Fallen'
};

Particle.Starfall = function (sprite) {
    var
        range = this.range,
        xpos = 0.5,
        { width, height, speed } = this.props;

    var r = ~~range(2, 6),
        r2 = 2 * r;

    var replace = (function () {
        Object.assign(this, {
            alpha: 0,
            dop: 0.03 * range(1, 4),
            x: range(-r2, width - r2),
            y: range(-20, height - r2),
            xmax: width - r,
            ymax: height - r,
            vx: range(0, 2) + 8 * xpos - 5,
            vy: 0.7 * r + range(-1, 1)

        });
        this.scale.set(range(0.5, 1));
    }).bind(sprite);

    var draw = (function () {
        var ref;
        this.x += this.vx * speed;
        this.y += this.vy * speed;
        this.alpha += this.dop * speed;
        if (this.alpha > 1) {
            this.alpha = 1;
            this.dop *= -1;
        }

        if (this.alpha < 0 || this.y > this.ymax) {
            replace();
        }
        if (!((0 < (ref = this.x) && ref < this.xmax))) {
            this.x = (this.x + this.xmax) % this.xmax;
        }
        //return drawCircle(~~this.x, ~~this.y, this.r, `${this.rgb},${this.opacity})`);
    }).bind(sprite);
    replace();
    return draw;
}

Particle.Fallen = function (sprite) {
    var
        range = this.range,
        xpos = 1,
        { width, height, speed } = this.props;

    var s, skew, shake = 0,
        absShake, fNull = () => { },
        onDraw, draw;

    onDraw = draw = fNull;

    sprite.visible = false;
    sprite.anchor.set(0.5);


    var reset = () => {
        s = range(1, 3);
        reEfect();
        sprite.scale.set(s / 3);

        Object.assign(sprite, {
            x: xpos > 0 ? range(-xpos * height / 2, width) : range(0, width - xpos * height / 2),
            y: -sprite.height
        });
    }

    var reEfect = () => {
        skew = {
            x: range(0, 0.05),
            y: range(0, 0.05)
        };

        var newShake = range(-1, 1);
        onDraw = () => {
            shake += ((newShake - shake) / 16);
            absShake = Math.abs(shake);

            if (shake >= newShake) {
                shake = newShake;
                onDraw = fNull;
            }
        }
    }

    var timeOut, interVal;

    timeOut = setTimeout(() => {
        draw = () => {
            onDraw()
            if (sprite.y >= height + sprite.height) reset();
            sprite.y += s - absShake;
            sprite.x += shake + xpos;
            sprite.skew.x += skew.x;
            sprite.skew.y += skew.y;

            //sprite.skew.set()
        }
        sprite.visible = true;
        reset();
        interVal = setInterval(reEfect, 2000);

    }, range(0, 5000));
    this.on('remove', sprite => {
        draw = fNull;
        clearTimeout(timeOut);
        clearInterval(interVal);
    })
    return () => draw();
}

Particle.Rain = function (sprite) {
    var
        range = this.range,
        xpos = 0.5,
        { width, height, speed } = this.props;

    var x, y, s, velY, life, isDrop, xS;

    sprite.visible = false;

    var reset = () => {
        s = range(3, 9);
        sprite.scale.set(s / 9);
        x = xpos < 0 ? range(0, width - xpos * height - 100) : range(-xpos * height - 100, width);
        y = -sprite.height;
        velY = 2;
        life = 30;
        isDrop = true;
        xS = range(0.05, 0.15)

        Object.assign(sprite, {
            x: x,
            y: y
        });

    }
    var draw = () => { };
    setTimeout(() => {
        draw = (function () {

            if (sprite.y + sprite.height >= height) {
                isDrop = false;
            }


            if (isDrop) {
                sprite.y += s - s * xS;
                sprite.x += (s * xpos) * speed;
            } else {
                sprite.scale.x -= sprite.scale.x / 15;
                sprite.scale.y -= sprite.scale.y / 10;
                sprite.y -= velY * s / 6;
                life--;
                sprite.x += xS * s * xpos;
                velY -= 0.13;
                if (life <= 0) reset();
            }
        }).bind(sprite);
        sprite.visible = true;
        reset();
    }, range(0, 5000));
    return () => draw();
}

Particle.BubleUp = function (sprite) {
    sprite.interactive = true;
    sprite.buttonMode = true;

    var
        range = this.range,
        xpos = 0,
        { width, height, speed } = this.props;

    var x, y, s, velY, life, isDrop, xS;

    sprite.visible = false;

    var reset = () => {
        s = range(2, 4);
        sprite.scale.set(s / 9);
        x = xpos < 0 ? range(0, width) : range(-xpos * height, width);
        y = (-sprite.height + height);

        velY = 0;
        life = 30;
        isDrop = true;
        xS = range(0.01, 0.15)

        Object.assign(sprite, {
            x: x,
            y: y
        });

    }
    var draw = () => { };
    setTimeout(() => {
        draw = (function () {
            sprite.on('tap', () => {
                isDrop = false;
            })
            if (sprite.y <= -50) {
                // isDrop = false;
                reset();
            }

            if (sprite.x + sprite.width >= width) {
                isDrop = false;
            }

            if (isDrop) {
                sprite.y -= (s + s * xS) * speed;
                sprite.x -= s * xpos;
            } else {
                sprite.scale.x -= sprite.scale.x / 10;
                sprite.scale.y -= sprite.scale.y / 10;
                sprite.y -= velY * s / 10;
                life--;
                sprite.x += xS * s * xpos;
                velY -= 0.2;
                if (life <= 0) reset();
            }
        }).bind(sprite);
        sprite.visible = true;
        reset();
    }, range(0, 3000));
    return () => draw();
}


var copySprite = function (object) {
    return this.renderer.renderTexture(object);
}

Particle.TweenUp = function (sprite) {
    sprite.interactive = true;
    sprite.buttonMode = true;
    var _this = this;
    var range = this.range,
        xpos = 0, s, t, This = this,
        { width, height, speed } = this.props;

    var particles = new TimelineMax();
    var dotQuantity = 30, gravity, explosionQuantity = 3;

    //random size
    s = range(3, 8);
    sprite.scale.set(s / 9);

    t = range(0.5, 1);
    //set place at the bottom
    particles.set(sprite, { y: height, x: xpos < 0 ? range(0, width) : range(-xpos * height, width - 30) }, 0);

    //create an animation at a random start time
    particles.to(
        sprite,
        speed,
        {
            y: -sprite.height,
            x: range(0, width - 10),
            ease: Power0.easeNone,
            repeat: 1000000,
            repeatDelay: 0,
        }, range(0, 5));

    // tap to bubble
    sprite.once('tap', () => {
        for (var i = 0; i < dotQuantity; i++) {

            var dot = copySprite.call(_this, sprite);
            console.log(dot);
            // var dot = new Graphics({
            //     width: 50,
            //     height: 50
            // });
            // dot.beginFill(0xffffff);
            // dot.alpha = 1;
            // dot.drawCircle(10,10,10);
            // sprite.parent.addChild(dot);
        }
        this
        console.log(sprite, sprite);
    });


}
Particle.Snow = function (sprite) {
    var { width, height, num } = this.props;
    sprite.interactive = false;

    TweenMax.set("img", { xPercent: "-50%", yPercent: "-50%" });
    var total = 70;
    var svgNS = "http://www.w3.org/2000/svg";  

    for (var i = 0; i < total; i++) {
        var myCircle = document.createElementNS(svgNS, "circle");
        myCircle.setAttributeNS(null, "class", "dot");
        myCircle.setAttributeNS(null, "r", 5);
        document.body.appendChild(myCircle);
        TweenMax.set(document.getElementsByClassName('dot')[i], { x: Random(width), y: 0, scale: Random(0.5) + 0.5, fill: "hsl(" + random(0, 150) + ",50%,50%)" });
        animm.call(this,document.getElementsByClassName('dot')[i]);
    }
}
Particle.Outbreak = function () { }

var random = (min, max) => {
    return min + Math.floor(Math.random() * (max - min));
}

var Random = (max) => {
    return Math.random() * max;
}

var animm = (elm) => {
    TweenMax.to(elm, Random(5) + 3, { y: this.width, ease: Linear.easeNone, repeat: -1, delay: -5 });
    TweenMax.to(elm, Random(5) + 1, { x: '+=70', repeat: -1, yoyo: true, ease: Sine.easeInOut })
    TweenMax.to(elm, Random(1) + 0.5, { fill: "rgba(0,0,0,0)", repeat: -1, yoyo: true, ease: Sine.easeInOut })
}

export default Particle;