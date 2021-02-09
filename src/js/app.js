import * as PIXI from 'pixi.js';
import { contain } from 'intrinsic-scale';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { pathParse, serializePath } from 'svg-path-parse';
import sayHello from './lib/sayHello';

class Animation {

  constructor({container, playButton, stopButton, titles, birdBlock}) {
    this.animationContainer = container;
    this.titles = titles;
    this.width = this.animationContainer.clientWidth;
    this.height = this.animationContainer.clientHeight;
    this.playButton = playButton;
    this.stopButton = stopButton;
    this.birdBlock = birdBlock;
    this.stopAnimation = false;
    this.previousWidth = this.width;
    this.previousHeight = this.height;
    this.birdNormalPath = 'M-91.5,1080.5c307-30,344-364,594-413c257.74-50.52,586,209.98,911.44-55.31C1667.5,405.5,1696-24.36,2049.5-61.5';
    this.pathNormalHeight = 1080;
    this.pathNormalWidth = 1920;

    this.roomsOptions = [
      {x: 730, y: 10, yPath: 10, speed: 0.01, timer: 0},
      {x: 358, y: 229, yPath: 10, speed: 0.008, timer: 0},
      {x: 229, y: 70, yPath: 10, speed: 0.008, timer: 0},
      {x: 308, y: 406, yPath: 5, speed: 0.01, timer: 0},
      {x: 330, y: 226, yPath: 5, speed: 0.01, timer: 0},
      {x: 48, y: 360, yPath: 10, speed: 0.01, timer: 0},
      {x: 542, y: 183, yPath: 10, speed: 0.012, timer: 0},
      {x: 463, y: 40, yPath: 10, speed: 0.012, timer: 0},
      {x: 408, y: 517, yPath: 8, speed: 0.013, timer: 0},
      {x: 330, y: 420, yPath: 8, speed: 0.013, timer: 0},
      {x: 380, y: 363, yPath: 9, speed: 0.02, timer: 0},
      {x: 274, y: 237, yPath: 9, speed: 0.02, timer: 0},
      {x: 289, y: 490, yPath: -9, speed: 0.015, timer: 0},
      {x: 0, y: 560, yPath: -9, speed: 0.015, timer: 0},
      {x: 215, y: 389, yPath: -9, speed: 0.015, timer: 0},
      {x: 661, y: 331, yPath: -6, speed: 0.015, timer: 0},
      {x: 554, y: 205, yPath: -6, speed: 0.015, timer: 0},
    ];

    this.titlesOptions = [
      {x: -128, y: -35, color: '#f8f7ef', background: '#88979c'},
      {x: 106, y: -35, color: '#bf9c7a', background: '#f2edd3'},
      {x: 79, y: -10, color: '#fef9e8', background: '#e1cdab'},
      {x: -74, y: -20, color: '#b9987a', background: '#f3ebe0'},
      {x: -105, y: -60, color: '#525a58', background: '#eedacc'},
      {x: 75, y: -80, color: '#b9987a', background: '#f3ebe0'},
    ];

    this.cloudsOptions = [
      {x: 150, y: 400},
      {x: 600, y: 600},
      {x: 150, y: 800},
      {x: 850, y: 770},
      {x: 350, y: 1600},
      {x: 100, y: 1500},
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
    this.playButton.addEventListener('click', this.play.bind(this));
    this.stopButton.addEventListener('click', this.stop.bind(this));

    this.animationContainer.appendChild(this.canvas.view);

    this.loadImages();
    this.styleTitles();
  }

  styleTitles() {
    this.titles.forEach( (title, index) => {
      const text = title.querySelector('.js-text')
      const options = this.titlesOptions[index];

      text.style.backgroundColor = options.background;
      text.style.color = options.color;
    })
  }

  loadImages() {
    PIXI.Loader.shared
      .add([
        '../img/rooms/family.png',
        '../img/rooms/luxurious.png',
        '../img/rooms/floor.png',
        '../img/rooms/secondFloor.png',
        '../img/rooms/marketing.png',
        '../img/rooms/stairs.png',
        '../img/rooms/stairsRoom.png',
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
        '../img/clouds/cloud1.png',
        '../img/clouds/cloud2.png',
        '../img/clouds/cloud3.png',
        '../img/clouds/cloud4.png',
        '../img/clouds/cloud5.png',
        '../img/clouds/cloud6.png',
        '../img/bird/bird-straight.json',
        '../img/bird/bird-flap.json',
      ])
      .load(this.setup.bind(this));
  }

  setup(loader) {
    // Rooms
    const family = new PIXI.Sprite(loader.resources['../img/rooms/family.png'].texture);
    const floor = new PIXI.Sprite(loader.resources['../img/rooms/floor.png'].texture);
    const secondFloor = new PIXI.Sprite(loader.resources['../img/rooms/secondFloor.png'].texture);
    const luxurious = new PIXI.Sprite(loader.resources['../img/rooms/luxurious.png'].texture);
    const marketing = new PIXI.Sprite(loader.resources['../img/rooms/marketing.png'].texture);
    const stairs = new PIXI.Sprite(loader.resources['../img/rooms/stairs.png'].texture);
    const stairsRoom = new PIXI.Sprite(loader.resources['../img/rooms/stairsRoom.png'].texture);
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
    this.container.addChild(stairsRoom);
    this.container.addChild(luxuriousHover);
    this.container.addChild(luxurious);

    this.hovers = [familyHover, luxuriousHover, marketingHover, stairsHover, trainingHover, youtfulHover];
    this.interactiveRooms = [family, luxurious, marketing, stairsRoom, training, youtful];
    this.coordinateRooms();
    this.addSpriteListaners();

    // Clouds
    const cloud1 = new PIXI.Sprite(loader.resources['../img/clouds/cloud1.png'].texture);
    const cloud2 = new PIXI.Sprite(loader.resources['../img/clouds/cloud2.png'].texture);
    const cloud3 = new PIXI.Sprite(loader.resources['../img/clouds/cloud3.png'].texture);
    const cloud4 = new PIXI.Sprite(loader.resources['../img/clouds/cloud4.png'].texture);
    const cloud5 = new PIXI.Sprite(loader.resources['../img/clouds/cloud5.png'].texture);
    const cloud6 = new PIXI.Sprite(loader.resources['../img/clouds/cloud6.png'].texture);

    this.canvas.stage.addChild(cloud1);
    this.canvas.stage.addChild(cloud3);
    this.canvas.stage.addChild(cloud4);
    this.canvas.stage.addChild(cloud5);
    this.canvas.stage.addChild(cloud6);
    this.canvas.stage.addChild(this.container);
    this.canvas.stage.addChild(cloud2);

    this.clouds = [cloud1, cloud2, cloud3, cloud4, cloud5, cloud6];
    this.coordinateClouds();

    // Bird
    this.birdStraightSheet = PIXI.Loader.shared.resources['../img/bird/bird-straight.json'].spritesheet.animations.bird;
    this.birdFlapSheet = PIXI.Loader.shared.resources['../img/bird/bird-flap.json'].spritesheet.animations.bird;

    this.animatedBird = new PIXI.AnimatedSprite(this.birdFlapSheet);
    this.animatedBird.animationSpeed = 0.3;
    this.animatedBird.play();
    const counter = 0;
    this.animatedBird.loop = true;
    // this.animatedBird.onLoop = () => {
    //   console.log(29)
    //   if (counter % 20 === 0) {
    //     this.animatedBird.textures = (this.animatedBird.textures !== this.birdStraightSheet) ? this.birdFlapSheet : this.birdStraightSheet;
    //   }
    //   this.animatedBird.play();
    //   console.log(29)
    //   counter++ 
    // }
    this.canvas.stage.addChild(this.animatedBird);
    this.timeline = this.createBirdAnimation()

    // Add empty space
    const rect = new PIXI.Graphics();
    rect.drawRect(this.container.width, 0, 200, 200);
    this.container.addChild(rect);

    this.containerWidth = this.container.width;
    this.containerHeight = this.container.height;
    this.resizeContainer();
  }

  coordinateRooms() {
    this.container.children.forEach ( (room, index) => {
      room.scale.set(0.6);
      if(this.hovers.includes(room)) {
        room.anchor.set(0.5);
        room.scale.set(0.52)
      }
      room.position.set(this.roomsOptions[index].x, this.roomsOptions[index].y);
    });
  }

  coordinateClouds() {
    this.clouds.forEach( (cloud, index) => {
      const xPosition = this.cloudsOptions[index].x;
      const yPosition = this.cloudsOptions[index].y;
      cloud.anchor.set(0.5);
      cloud.position.set(xPosition, yPosition);
    });
  }

  addSpriteListaners() {
    /* eslint no-param-reassign: ["error", { "props": false }] */
    this.interactiveRooms.forEach ( (room, index) => {
      room.interactive = true;
      room.buttonMode = true;

      room.on('pointerover', this.mouseOverRoom.bind(this, this.hovers[index]));
      room.on('pointerout', this.mouseOutRoom.bind(this, this.hovers[index]));
    });
  }

  resizeContainer() {
    const { width, height, x, y } = contain(this.width, this.height, this.containerWidth, this.containerHeight);
    this.container.width = width;
    this.container.height = height;
    this.container.position.set(x, y);
    
    this.changeTitles();
    this.changeClouds();
    this.resizeBirdPath();
    this.changeBird();
    this.updateTimeline();
  }

  changeTitles() {
    const padding = 10;

    this.hovers.forEach( (hover, index) => {
      const title = this.titles[index];
      const options = this.titlesOptions[index];
      let currentTitleWidth = title.getBoundingClientRect().width;

      let xPosition = hover.getGlobalPosition().x + (this.container.width * options.x / this.containerWidth);
      const yPosition = hover.getGlobalPosition().y + (this.container.height * options.y / this.containerHeight);

      if (title.classList.contains('js-rightTitle')) {

        if (this.width < xPosition + currentTitleWidth + padding) {
          const newTitleWidth = this.width - xPosition - padding;
          title.style.width = `${newTitleWidth }px`;
        } else {
          title.style.width = `${currentTitleWidth + padding }px`;
        }

      } else if (xPosition - currentTitleWidth - padding <= 0) {
        const newTitleWidth = xPosition - padding;
        title.style.width = `${newTitleWidth }px`;

        xPosition = hover.getGlobalPosition().x + (this.container.width * options.x / this.containerWidth) - newTitleWidth;
      } else {
        title.style.width = `${currentTitleWidth + padding }px`;
        currentTitleWidth = title.getBoundingClientRect().width;

        xPosition = hover.getGlobalPosition().x + (this.container.width * options.x / this.containerWidth) - currentTitleWidth;
      }

      title.style.left = `${xPosition  }px`;
      title.style.top = `${yPosition  }px`;
    })
  }

  changeClouds() {
    this.clouds.forEach( cloud => {
      const proportionalContainerWidth = this.container.width * 0.7 / this.containerWidth ;

      const scaleCoefficient = Math.max(proportionalContainerWidth, 0.3);
      cloud.scale.set(scaleCoefficient);

      const xPosition = cloud.x * this.width / this.previousWidth;
      const yPosition = cloud.y * this.height / this.previousHeight;
      cloud.position.set(xPosition, yPosition);
    })
  }

  resizeBirdPath() {
    const parsedPath = pathParse(this.birdNormalPath).getSegments();
    parsedPath.segments = parsedPath.segments.map( segment => {
      const newSegment = [];

      segment.forEach( (element, index) => {
        newSegment.push(this.changeSegment(element, index));
      });

      return newSegment;
    })

    this.birdPath = serializePath(parsedPath);
  }

  changeSegment(element, index) {
    if ( index === 0 ) {
      return element;
    }
    if ( index % 2 === 0 ) {
      return element * this.height / this.pathNormalHeight;
    }
    return element * this.width / this.pathNormalWidth;
  }

  changeBird() {
    const proportionalContainerWidth = this.container.width * 0.25 / this.containerWidth ;
    const scaleCoefficient = Math.max(proportionalContainerWidth, 0.1);

    this.animatedBird.scale.set(scaleCoefficient);
    this.animatedBird.x = -this.animatedBird.width;
    this.animatedBird.y = this.height - this.animatedBird.height / 2;
  }

  updateTimeline() {
    const progress = this.timeline.progress();
    this.timeline.clear();
    this.timeline = this.createBirdAnimation();
    this.timeline.progress(progress);
    this.timeline.play();
  }

  play() {
    this.stopAnimation = false;

    this.container.children.forEach ( (room, index) => {
      if(!this.roomsOptions[index]) return;
      this.moveRooms(room, index);
    });

    this.clouds.forEach ( (cloud, index) => {
      this.moveClouds(cloud, index);
    });

    this.timeline.play();
  }

  stop() {
    this.stopAnimation = true;
  }

  moveRooms(room, index) {
    if (this.stopAnimation) {
      return;
    };

    const options = this.roomsOptions[index];
    const newPositionY = options.yPath * Math.sin(options.timer) + options.y;

    room.position.y = newPositionY;
    options.timer += options.speed;
    requestAnimationFrame( this.moveRooms.bind(this, room, index) );
  }

  moveClouds(cloud, index) {
    if (this.stopAnimation) {
      return;
    };

    const options = this.cloudsOptions[index];
    let newPositionY;
    let newPositionX;

    if (cloud.y < -cloud.height) {
      newPositionY = options.y * (cloud.width + cloud.x) / (cloud.x - options.x);
      newPositionX = -cloud.width;
    } else if (cloud.x - cloud.width > this.width) {
      newPositionY = options.y * (cloud.width + cloud.x) / (cloud.x - options.x);
      newPositionX = -cloud.width;
    } else {
      newPositionY = cloud.y - 0.3;
      newPositionX = cloud.x + 0.3;
    }

    cloud.position.set(newPositionX, newPositionY);
    options.timer += options.speed;
    requestAnimationFrame( this.moveClouds.bind(this, cloud, index) );
  }

  createBirdAnimation() {
    gsap.registerPlugin(MotionPathPlugin);

    return gsap.timeline()
    .repeat(-1)
    .paused(true)
    .to( this.animatedBird, {
      duration: 14,
      ease: 'power1.inOut',
      motionPath: {
        path: this.birdPath,
        align: 'self',
      }
    })
    .to(this.birdBlock, {
      duration: 14,
      ease: 'power1.inOut',
      onUpdate: () => {
        this.updateRotation();
      },
      motionPath: {
        path: this.birdPath,
        autoRotate: true,
      }
    }, 0)
    // .to(this.animatedBirdFlap, {
    //   scale: 0,
    //   duration: 0,
    // }, 4.7)
    // .to(this.animatedBirdStraight.scale, {
    //   x: 0.25,
    //   y: 0.25,
    //   duration: 0,
    // })
    // .to(this.animatedBirdStraight, {
    //   scale: 0,
    //   duration: 0,
    // }, 6)
    // .to(this.animatedBirdFlap.scale, {
    //   x: 0.25,
    //   y: 0.25,
    //   duration: 0,
    // }, 6)
    // .to(this.animatedBirdFlap, {
    //   scale: 0,
    //   duration: 0,
    // }, 8)
    // .to(this.animatedBirdStraight.scale, {
    //   x: 0.25,
    //   y: 0.25,
    //   duration: 0,
    // }, 8)
  }

  updateRotation() {
    const rotation = (gsap.getProperty(this.birdBlock, 'rotation') + 90)  * Math.PI / 180;
    this.animatedBird.rotation = rotation;
  }

  mouseOverRoom(hover) {
    const title = this.titles[this.hovers.indexOf(hover)].querySelector('.js-content');

    if( title.classList.contains('js-rightTitle') ) {
      gsap.to(title, {
        duration: 0.4,
        x: '100%',
      });
    } else {
      gsap.to(title, {
        duration: 0.4,
        x: '-100%',
      })
    }

    gsap.to(hover.scale, {
      x: 0.6, 
      y: 0.6, 
      duration: 0.3
    });
  }

  mouseOutRoom(hover) {
    const title = this.titles[this.hovers.indexOf(hover)].querySelector('.js-content');
    
    gsap.to(title, {
      duration: 0.4,
      delay: 0.1,
      x: 0,
    });

    gsap.to(hover.scale, {
      x: 0.52,
      y: 0.52,
      delay: 0.1,
      duration: 0.3
    });
  }

  resize() {
    this.previousWidth = this.width;
    this.previousHeight = this.height;
    this.width = this.animationContainer.clientWidth;
    this.height = this.animationContainer.clientHeight;

    this.canvas.renderer.resize(this.width, this.height);
    this.resizeContainer();
  }
};

const birdBlock = document.querySelector('.js-birdRotation');
const titles = document.querySelectorAll('.js-title')
const container = document.querySelector('.js-container');
const playButton = document.querySelector('.js-play');
const stopButton = document.querySelector('.js-stop');
const animationControl = new Animation({container, playButton, stopButton, titles, birdBlock});

sayHello();