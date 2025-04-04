/*
 * Reveal.js toolbar plugin
 * MIT licensed
 *
 * Copyright (c) 2025 Emiliano "pixu1980" Pisu
 */

/* TODO:
 * - Notes ?
 * - PDF export ?
 * - tooltips
 */

const defaults = {
  position: 'top',
  fullscreen: true,
  overview: true,
  pause: false,
  notes: false,
  help: true,
  menu: true,
};

class Toolbar {
  deck; // reveal instance

  dom = {
    reveal: null,
    toolbar: null,
    buttons: [],
  };

  settings = {};

  addActionButton(settings) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('reveal-toolbar-button');

    settings.class && button.classList.add(settings.class);
    settings.caption && (button.innerText = settings.caption);
    settings.content && (button.innerHTML = settings.content);
    settings.handler && button.addEventListener('click', settings.handler);

    this.dom.buttons.push(button);
    this.dom.toolbar.appendChild(button);
  }

  addAction(name, caption, options, handler) {
    const defaults = {
      class: `reveal-toolbar-button-${name}`,
      caption,
      content: undefined,
    };

    const settings = {
      ...defaults,
      ...(Object.prototype.toString.call(options) === '[object Object]' && options),
      ...{
        handler: (e) => {
          handler && handler(e);
          this.deck.dispatchEvent(`toolbar-${name}-action`, this, true);
        },
      },
    };

    this.addActionButton(settings);
  }

  init() {
    this.dom.toolbar = document.createElement('div');
    this.dom.toolbar.classList.add('reveal-toolbar');
    this.dom.toolbar.classList.add(this.settings.position == 'top' ? 'reveal-toolbar-top' : 'reveal-toolbar-bottom');

    this.dom.reveal = document.querySelector('.reveal');
    this.dom.reveal.appendChild(this.dom.toolbar);

    this.settings.menu &&
      this.addAction('menu', 'M', this.settings.menu, (e) => {
        this.deck.getPlugin('menu')?.toggleMenu();
      });

    this.settings.help &&
      this.addAction('help', '?', this.settings.help, (e) => {
        this.deck.toggleHelp();

        this.dom.reveal.querySelector('.overlay-help header .close').remove();
        this.dom.reveal.querySelector('.overlay-help table tr:nth-child(2) td:first-child').innerText = 'SPACE';
        this.dom.reveal.querySelector('.overlay-help table tr:nth-child(3) td:first-child').innerText = 'BACKSPACE';

        this.dom.reveal.querySelectorAll('.overlay-help header, .overlay-help .viewport').forEach((item) => {
          item.addEventListener(
            'click',
            (e) => {
              this.deck.toggleHelp();
            },
            { once: true }
          );
        });
      });

    this.settings.overview &&
      this.addAction('overview', 'O', this.settings.overview, (e) => {
        this.deck.toggleOverview();
      });

    this.settings.notes &&
      !this.deck.isSpeakerNotes() &&
      this.addAction('notes', 'N', this.settings.notes, (e) => {
        this.deck.getPlugin('notes')?.open();
      });

    this.settings.fullscreen &&
      this.addAction('fullscreen', 'F', this.settings.fullscreen, (e) => {
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

        if (!document.exitFullscreen) {
          document.exitFullscreen = document.mozExitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
        }

        if (fullscreenElement) {
          // triggering ESC key
          document.exitFullscreen();
        } else {
          // triggering F key
          this.deck.triggerKey(70);
        }
      });

    this.settings.pause &&
      this.addAction('pause', 'P', this.settings.pause, (e) => {
        this.deck.togglePause();

        this.deck.addEventListener('paused', function () {
          // var icon = dom.pauseButton.querySelector('i');
          // icon.classList.remove('fa-eye-slash');
          // icon.classList.add('fa-eye');
        });

        this.deck.addEventListener('resumed', function () {
          // var icon = dom.pauseButton.querySelector('i');
          // icon.classList.remove('fa-eye');
          // icon.classList.add('fa-eye-slash');
        });
      });
  }

  constructor(deck) {
    this.deck = deck;
    this.settings = { ...defaults, ...deck.getConfig()?.toolbar };

    this.init();

    this.deck.dispatchEvent('toolbar-ready', this, true);
  }
}

const Plugin = () => {
  return {
    id: 'toolbar',
    init: (deck) => {
      new Toolbar(deck);
    },
  };
};

export default Plugin;
