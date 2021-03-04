import gsap from 'gsap';
import { SlowMo } from "gsap/EasePack";

gsap.registerPlugin(SlowMo);

class Preloader {
  constructor () {
    this.preloader = document.querySelector('.js-preloader');
    this.text = this.preloader.querySelector('.js-loaderText');
    this.hover = this.preloader.querySelector('.js-hover');
    this.circles = this.preloader.querySelectorAll('.js-circle');
    this.letters = [];

    this.init();
  }

  init() {
    this.splitString();
  }

  splitString() {
    const string = this.text.innerHTML.split('');
    this.text.innerHTML = '';

    string.forEach( letter => {
      const span = document.createElement('span');
      span.innerHTML = letter;
      this.letters.push(span)
      this.text.appendChild(span)
    })
  }

  
  // moveLoader() {
  //   this.timeline = gsap.timeline()
  //   .to(this.letters, {
  //     duration: 1,
  //     y: 30,
  //     repeat: -1,
  //     ease: "slow(0.1, 0.7, true)",
  //     stagger: {
  //       amount: 1
  //     }
  //   })
    
  //   this.circles.forEach( circle => {
  //     this.timeline.to(circle, {
  //       duration: 2,
  //       x: "+=700%",
  //       ease: 'power1.inOut',
  //       repeat: -1,
  //       borderRadius: 0,
  //       rotation: 360,
  //       yoyo: true 
  //     }, this.delay)

  //     this.delay += this.delayAdditive;
  //   })
  // }

  stop() {
    gsap.to([this.letters, this.circles], {
      opacity: 0,
      duration: 1,
      stagger: {
        amount: 1
      }
    })
    gsap.to(this.hover, {
      duration: 1,
      y: '-100%',
      delay: 1,
    })
    gsap.to(this.preloader, {
      duration: 1,
      x: '-100%',
      delay: 2,
      display: 'none',
      onComplete: ()=> {
        this.preloader.innerHTML = ''
      }
    })
  }
};

module.exports = Preloader;