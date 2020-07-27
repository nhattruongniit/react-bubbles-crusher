import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';

import { Welcome } from './components/welcomebg'

function App() {
  const refWelcome = useRef(null);

  useEffect(() => {
    if(refWelcome) {
      const app = window.game = new PIXI.Application({
        width: 513,
        height: 936,
        antialias: true,
        transparent: true,
        resolution: 1
      })
     
      refWelcome.current.appendChild(app.view);

      var welcome = new Welcome({
        images: './sprites/backgrounds.json',
        width: 513,
        height: 936
      });

      // PIXI.loader.add('welcome', './sprites/backgrounds.json').load(() => {
      //   console.log('welcome')
      // })

      // let welcome = new PIXI.Sprite.from('./images/backgrounds/background.png');
      // welcome.width = 513;
      // welcome.height = 936;
      app.stage.addChild(welcome)
    }
  })

  return (
    <div className="App">
      <div ref={refWelcome} />
    </div>
  );
}

export default App;
