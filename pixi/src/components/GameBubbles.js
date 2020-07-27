import { Application, Container, Graphics, Sprite, loader, utils, Text, TextStyle, ticker, sound } from 'pixi.js';
import { TweenMax, Power2, TimelineLite, TweenLite } from "gsap";
import Bubble from './Bubble';
import BubbleCard from './BubbleCard'

export default class GameBubbles extends Graphics {
    constructor(props){
        super(props);
        this.props = props;
        this.setup();
    }

    setup() {
        
    }
}