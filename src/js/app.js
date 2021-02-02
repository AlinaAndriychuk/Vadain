import * as PIXI from 'pixi.js';
import {contain} from 'intrinsic-scale';
import gsap from "gsap";
import sayHello from './lib/sayHello';

class Animation {

  constructor({playButton, stopButton}) {
    this.animationContainer = document.querySelector('.animation-block');
    this.width = this.animationContainer.clientWidth;
    this.height = this.animationContainer.clientHeight;
    this.playButton = playButton;
    this.stopButton = stopButton;
    this.stopAnimation = false;

    this.roomsOptions = [
      {x: 730, y: 10, yPath: 10, speed: 0.01, timer: 0},
      {x: 235, y: 72, yPath: 10, speed: 0.008, timer: 0},
      {x: 229, y: 70, yPath: 10, speed: 0.008, timer: 0},
      {x: 308, y: 406, yPath: 5, speed: 0.01, timer: 0},
      {x: 330, y: 226, yPath: 5, speed: 0.01, timer: 0},
      {x: 48, y: 360, yPath: 10, speed: 0.01, timer: 0},
      {x: 463, y: 43, yPath: 10, speed: 0.012, timer: 0},
      {x: 463, y: 40, yPath: 10, speed: 0.012, timer: 0},
      {x: 318, y: 404, yPath: 8, speed: 0.013, timer: 0},
      {x: 330, y: 420, yPath: 8, speed: 0.013, timer: 0},
      {x: 274, y: 240, yPath: 9, speed: 0.02, timer: 0},
      {x: 274, y: 237, yPath: 9, speed: 0.02, timer: 0},
      {x: 215, y: 393, yPath: -9, speed: 0.015, timer: 0},
      {x: 0, y: 390, yPath: -9, speed: 0.015, timer: 0},
      {x: 551, y: 201, yPath: -6, speed: 0.015, timer: 0},
      {x: 554, y: 205, yPath: -6, speed: 0.015, timer: 0},
    ];

    this.canvas = new PIXI.Application({
      width: this.width, 
      height: this.height,
      autoResize: true,
      autoStart: true,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      transparent: true,
    });
    this.container = new PIXI.Container();

    this.init()
  }

  init() {
    window.addEventListener("resize", this.resize.bind(this));

    this.canvas.stage.addChild(this.container);
    this.animationContainer.appendChild(this.canvas.view);

    const setup = loader => {
      const family = new PIXI.Sprite(loader.resources['../img/rooms/family.png'].texture);
      const floor = new PIXI.Sprite(loader.resources['../img/rooms/floor.png'].texture);
      const secondFloor = new PIXI.Sprite(loader.resources['../img/rooms/secondFloor.png'].texture);
      const luxurious = new PIXI.Sprite(loader.resources['../img/rooms/luxurious.png'].texture);
      const marketing = new PIXI.Sprite(loader.resources['../img/rooms/marketing.png'].texture);
      const stairs = new PIXI.Sprite(loader.resources['../img/rooms/stairs.png'].texture);
      const terrace = new PIXI.Sprite(loader.resources['../img/rooms/terrace.png'].texture);
      const training = new PIXI.Sprite(loader.resources['../img/rooms/training.png'].texture);
      const windows = new PIXI.Sprite(loader.resources['../img/rooms/windows.png'].texture);
      const youtful = new PIXI.Sprite(loader.resources['../img/rooms/youtful.png'].texture);
      const familyHover = new PIXI.Sprite(loader.resources['../img/hover/family1.png'].texture);
      const luxuriousHover = new PIXI.Sprite(loader.resources['../img/hover/luxurious1.png'].texture);
      const marketingHover = new PIXI.Sprite(loader.resources['../img/hover/marketing1.png'].texture);
      const stairsHover = new PIXI.Sprite(loader.resources['../img/hover/stairs1.png'].texture);
      const trainingHover = new PIXI.Sprite(loader.resources['../img/hover/training1.png'].texture);
      const youtfulHover = new PIXI.Sprite(loader.resources['../img/hover/youtful1.png'].texture);

      this.container.addChild(windows);
      this.container.addChild(familyHover);
      this.container.addChild(family);
      this.container.addChild(floor);
      this.container.addChild(secondFloor);
      this.container.addChild(terrace);
      this.container.addChild(youtfulHover);
      this.container.addChild(youtful);
      this.container.addChild(marketingHover);
      this.container.addChild(marketing);
      this.container.addChild(trainingHover);
      this.container.addChild(training);
      this.container.addChild(stairsHover);
      this.container.addChild(stairs);
      this.container.addChild(luxuriousHover);
      this.container.addChild(luxurious);

      this.container.children.forEach ( (room, index) => {
        room.scale.set(0.6);
        room.position.set(this.roomsOptions[index].x, this.roomsOptions[index].y);
      });

      const hovers = [familyHover, luxuriousHover, marketingHover, stairsHover, trainingHover, youtfulHover];

      /* eslint no-param-reassign: ["error", { "props": false }] */
      // luxuriousHover.anchor.set(0.5, 0.5);
      // marketingHover.anchor.set(0.5, 0.5);
      // trainingHover.anchor.set(0.5, 0.5);
      // familyHover.anchor.set(0.5, 0.5)
      // youtfulHover.anchor.set(0.5, 0.5);
      hovers.forEach ( (hover) => {
        hover.scale.set(0.52);
        // hover.anchor.set(0.5, 0.5);

        hover.interactive = true;
        hover.buttonMode = true;
        hover.on('pointerover', this.mouseOverRoom.bind(this, hover));
        hover.on('pointerout', this.mouseOffRoom.bind(this, hover));
      });

      const rect = new PIXI.Graphics(); // Empty right space
      rect.drawRect(0, 0, 200, 200);
      rect.x = this.container.width;
      this.container.addChild(rect);

      this.containerWidth = this.container.width;
      this.containerHeight = this.container.height;

      const { width, height, x, y } = contain(this.width, this.height, this.containerWidth, this.containerHeight);
      this.container.width = width;
      this.container.height = height;
      this.container.position.set(x, y);
    }

    PIXI.Loader.shared
      .add([
        '../img/rooms/family.png',
        '../img/rooms/luxurious.png',
        '../img/rooms/floor.png',
        '../img/rooms/secondFloor.png',
        '../img/rooms/marketing.png',
        '../img/rooms/stairs.png',
        '../img/rooms/terrace.png',
        '../img/rooms/training.png',
        '../img/rooms/youtful.png',
        '../img/rooms/windows.png',
        '../img/hover/family1.png',
        '../img/hover/luxurious1.png',
        '../img/hover/marketing1.png',
        '../img/hover/stairs1.png',
        '../img/hover/training1.png',
        '../img/hover/youtful1.png',
      ])
      .load(setup);

    this.playButton.addEventListener('click', this.play.bind(this));
    this.stopButton.addEventListener('click', this.stop.bind(this));
  }

  play() {
    this.stopAnimation = false;

    this.container.children.forEach ( (room, index) => {
      this.flyRoom(room, this.roomsOptions[index].y, this.roomsOptions[index].yPath, this.roomsOptions[index].speed, index);
    });
  }

  stop() {
    this.stopAnimation = true;
  }

  flyRoom(room, yPosition, yPath, speed, index) {
    if (this.stopAnimation) {
      return;
    };

    this.roomsOptions[index].timer += speed;
    const currentTime = this.roomsOptions[index].timer;
    requestAnimationFrame( this.flyRoom.bind(this, room, yPosition, yPath, speed, index) );

    const newPositionY = yPath * Math.sin(currentTime) + yPosition;
    room.position.set(this.roomsOptions[index].x, newPositionY)
  }

  mouseOverRoom(hover) {
    if (hover.scale.x >= 0.6) return;
    requestAnimationFrame( this.mouseOverRoom.bind(this, hover) );

    hover.scale.set(hover.scale.x + 0.01)
    console.log(hover.scale.x)
  }

  mouseOffRoom(hover) {

    if (hover.scale.x <= 0.522) return;
    requestAnimationFrame( this.mouseOffRoom.bind(this, hover) );

    hover.scale.set(hover.scale.x - 0.01)
    console.log(hover.scale.x)
  }

  resize() {
    this.width = this.animationContainer.clientWidth;
    this.height = this.animationContainer.clientHeight;

    this.canvas.renderer.resize(this.width, this.height);
    
    const { width, height, x, y } = contain(this.width, this.height, this.containerWidth, this.containerHeight);
    this.container.width = width;
    this.container.height = height;
    this.container.position.set(x, y);
  }
};

const playButton = document.getElementById('playAnimation');
const stopButton = document.getElementById('stopAnimation');
const animationControl = new Animation({playButton, stopButton});

sayHello();