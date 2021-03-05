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