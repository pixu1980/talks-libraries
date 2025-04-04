/*
 * Reveal.js menu plugin
 * MIT licensed
 * (c) Pixu 2022
 */

const defaults = {
  side: 'right',
  numbers: false,
  titleSelector: 'h1, h2, h3, h4, h5',
  hideMissingTitles: false,
  useTextContentForMissingTitles: false,
  markers: true,
  transitions: [
    'None',
    'Fade',
    'Slide',
    'Convex',
    'Concave',
    'Zoom'
  ],
  openButton: true,
  openSlideNumber: false,
  keyboard: true,
  sticky: false,
  autoOpen: true,
  delayInit: false,
  openOnInit: false,
}

class Menu {
  deck; // reveal instance

  dom = {
    reveal: null,
    toolbar: null,
    menu: null,
    buttons: [],
  };

  settings = {};

  create(tagName, attrs, content) {
    var el = document.createElement(tagName);
    if (attrs) {
      Object.getOwnPropertyNames(attrs).forEach((n) => el.setAttribute(n, attrs[n]));
    }
    if (content) el.innerHTML = content;
    return el;
  }

  //#region Mouse & Keyboard handling
  mouseSelectionEnabled = true;

  disableMouseSelection() {
    this.mouseSelectionEnabled = false;
  }

  reenableMouseSelection() {
    // wait until the mouse has moved before re-enabling mouse selection
    // to avoid selections on scroll
    const tempMouseMoveEventHandler = (e) => {
      this.dom.menu.querySelector('nav.slide-menu').removeEventListener('mousemove', tempMouseMoveEventHandler);
      //XXX this should select the item under the mouse
      this.mouseSelectionEnabled = true;
    }

    this.dom.menu.querySelector('nav.slide-menu').addEventListener('mousemove', tempMouseMoveEventHandler);
  }

  keepVisible(el) {
    var offset = window.uiuxEngineering.visibleOffset(el);
    if (offset) {
      this.disableMouseSelection();
      el.scrollIntoView(offset > 0);
      this.reenableMouseSelection();
    }
  }

  scrollItemToTop(el) {
    this.disableMouseSelection();
    el.offsetParent.scrollTop = el.offsetTop;
    this.reenableMouseSelection();
  }

  scrollItemToBottom(el) {
    this.disableMouseSelection();
    el.offsetParent.scrollTop =
      el.offsetTop - el.offsetParent.offsetHeight + el.offsetHeight;
    this.reenableMouseSelection();
  }

  selectItem(el) {
    el.classList.add('selected');
    this.keepVisible(el);
    if (this.settings.sticky && this.settings.autoOpen) this.openItem(el);
  }

  onDocumentKeyDown(event) {
    // opening menu is handled by registering key binding with Reveal below
    if (this.isOpen()) {
      event.stopImmediatePropagation();
      switch (event.keyCode) {
        // case 77:
        // 	closeMenu();
        // 	break;
        // h, left - change panel
        case 72:
        case 37:
          this.prevPanel();
          break;
        // l, right - change panel
        case 76:
        case 39:
          this.nextPanel();
          break;
        // k, up
        case 75:
        case 38:
          var currItem =
            this.dom.menu.querySelector('.active-menu-panel .slide-menu-items li.selected') ||
            this.dom.menu.querySelector('.active-menu-panel .slide-menu-items li.active');
          if (currItem) {
            this.dom.menu.querySelectorAll('.active-menu-panel .slide-menu-items li').forEach(
              (item) => {
                item.classList.remove('selected');
              }
            );
            var nextItem =
              this.dom.menu.querySelector(
                '.active-menu-panel .slide-menu-items li[data-item="' +
                (parseInt(currItem.getAttribute('data-item')) - 1) +
                '"]'
              ) || currItem;
            this.selectItem(nextItem);
          } else {
            var item = this.dom.menu.querySelector(
              '.active-menu-panel .slide-menu-items li.slide-menu-item'
            );
            if (item) this.selectItem(item);
          }
          break;
        // j, down
        case 74:
        case 40:
          var currItem =
            this.dom.menu.querySelector('.active-menu-panel .slide-menu-items li.selected') ||
            this.dom.menu.querySelector('.active-menu-panel .slide-menu-items li.active');
          if (currItem) {
            this.dom.menu.querySelectorAll('.active-menu-panel .slide-menu-items li').forEach(
              (item) => {
                item.classList.remove('selected');
              }
            );
            var nextItem =
              this.dom.menu.querySelector(
                '.active-menu-panel .slide-menu-items li[data-item="' +
                (parseInt(currItem.getAttribute('data-item')) + 1) +
                '"]'
              ) || currItem;
            this.selectItem(nextItem);
          } else {
            var item = this.dom.menu.querySelector(
              '.active-menu-panel .slide-menu-items li.slide-menu-item'
            );
            if (item) this.selectItem(item);
          }
          break;
        // pageup, u
        case 33:
        case 85:
          var itemsAbove = this.dom.menu.querySelectorAll(
            '.active-menu-panel .slide-menu-items li'
          ).filter((item) => window.uiuxEngineering.visibleOffset(item) > 0);

          var visibleItems = this.dom.menu.querySelectorAll(
            '.active-menu-panel .slide-menu-items li'
          ).filter((item) => window.uiuxEngineering.visibleOffset(item) == 0);

          var firstVisible =
            itemsAbove.length > 0 &&
              Math.abs(window.uiuxEngineering.visibleOffset(itemsAbove[itemsAbove.length - 1])) <
              itemsAbove[itemsAbove.length - 1].clientHeight
              ? itemsAbove[itemsAbove.length - 1]
              : visibleItems[0];
          if (firstVisible) {
            if (
              firstVisible.classList.contains('selected') &&
              itemsAbove.length > 0
            ) {
              // at top of viewport already, page scroll (if not at start)
              // ...move selected item to bottom, and change selection to last fully visible item at top
              this.scrollItemToBottom(firstVisible);
              visibleItems = this.dom.menu.querySelectorAll(
                '.active-menu-panel .slide-menu-items li'
              ).filter((item) => window.uiuxEngineering.visibleOffset(item) == 0);

              if (visibleItems[0] == firstVisible) {
                // prev item is still beyond the viewport (for custom panels)
                firstVisible = itemsAbove[itemsAbove.length - 1];
              } else {
                firstVisible = visibleItems[0];
              }
            }
            this.dom.menu.querySelectorAll('.active-menu-panel .slide-menu-items li').forEach(
              (item) => {
                item.classList.remove('selected');
              }
            );
            this.selectItem(firstVisible);
            // ensure selected item is positioned at the top of the viewport
            this.scrollItemToTop(firstVisible);
          }
          break;
        // pagedown, d
        case 34:
        case 68:
          var visibleItems = this.dom.menu.querySelectorAll(
            '.active-menu-panel .slide-menu-items li'
          ).filter((item) => window.uiuxEngineering.visibleOffset(item) == 0);
          var itemsBelow = this.dom.menu.querySelectorAll(
            '.active-menu-panel .slide-menu-items li'
          ).filter((item) => window.uiuxEngineering.visibleOffset(item) < 0);

          var lastVisible =
            itemsBelow.length > 0 &&
              Math.abs(window.uiuxEngineering.visibleOffset(itemsBelow[0])) < itemsBelow[0].clientHeight
              ? itemsBelow[0]
              : visibleItems[visibleItems.length - 1];

          if (lastVisible) {
            if (
              lastVisible.classList.contains('selected') &&
              itemsBelow.length > 0
            ) {
              // at bottom of viewport already, page scroll (if not at end)
              // ...move selected item to top, and change selection to last fully visible item at bottom
              this.scrollItemToTop(lastVisible);
              visibleItems = this.dom.menu.querySelectorAll(
                '.active-menu-panel .slide-menu-items li'
              ).filter((item) => window.uiuxEngineering.visibleOffset(item) == 0);
              if (visibleItems[visibleItems.length - 1] == lastVisible) {
                // next item is still beyond the viewport (for custom panels)
                lastVisible = itemsBelow[0];
              } else {
                lastVisible = visibleItems[visibleItems.length - 1];
              }
            }
            this.dom.menu.querySelectorAll('.active-menu-panel .slide-menu-items li').forEach(
              (item) => {
                item.classList.remove('selected');
              }
            );
            this.selectItem(lastVisible);
            // ensure selected item is positioned at the bottom of the viewport
            this.scrollItemToBottom(lastVisible);
          }
          break;
        // home
        case 36:
          this.dom.menu.querySelectorAll('.active-menu-panel .slide-menu-items li').forEach(
            (item) => {
              item.classList.remove('selected');
            }
          );
          var item = this.dom.menu.querySelector(
            '.active-menu-panel .slide-menu-items li:first-of-type'
          );
          if (item) {
            item.classList.add('selected');
            this.keepVisible(item);
          }
          break;
        // end
        case 35:
          this.dom.menu.querySelectorAll('.active-menu-panel .slide-menu-items li').forEach(
            (item) => {
              item.classList.remove('selected');
            }
          );
          var item = this.dom.menu.querySelector(
            '.active-menu-panel .slide-menu-items:last-of-type li:last-of-type'
          );
          if (item) {
            item.classList.add('selected');
            this.keepVisible(item);
          }
          break;
        // space, return
        case 32:
        case 13:
          var currItem = this.dom.menu.querySelector(
            '.active-menu-panel .slide-menu-items li.selected'
          );
          if (currItem) {
            this.openItem(currItem, true);
          }
          break;
        // esc
        case 27:
          this.closeMenu(null, true);
          break;
      }
    }
  }
  //#endregion

  //#region Plugin Methods
  openMenu(event) {
    if (event) event.preventDefault();
    if (!this.isOpen()) {
      document.querySelector('body').classList.add('slide-menu-active');
      this.dom.reveal.classList.add(
        'has-' + this.settings.effect + '-' + this.settings.side
      );
      this.dom.menu.querySelector('.slide-menu').classList.add('active');
      this.dom.menu.querySelector('.slide-menu-overlay').classList.add('active');

      // identify active theme
      // if (this.settings.themes) {
      //   this.dom.menu.querySelectorAll('div[data-panel="Themes"] li').forEach((i) => {
      //     i.classList.remove('active');
      //   });
      //   this.dom.menu.querySelectorAll(
      //     'li[data-theme="' + this.dom.menu.querySelector('link#theme').getAttribute('href') + '"]'
      //   ).forEach((i) => {
      //     i.classList.add('active');
      //   });
      // }

      // identify active transition
      if (this.settings.transitions) {
        this.dom.menu.querySelectorAll('div[data-panel="Transitions"] li').forEach((i) => {
          i.classList.remove('active');
        });
        this.dom.menu.querySelectorAll('li[data-transition="' + this.settings.transition + '"]').forEach(
          (i) => {
            i.classList.add('active');
          }
        );
      }

      // set item selections to match active items
      var items = this.dom.menu.querySelectorAll('.slide-menu-panel li.active');
      items.forEach((i) => {
        i.classList.add('selected');
        this.keepVisible(i);
      });
    }
  }

  closeMenu(event, force) {
    if (event) event.preventDefault();
    if (!this.settings.sticky || force) {
      document.querySelector('body').classList.remove('slide-menu-active');
      this.dom.reveal.classList.remove(
        'has-' + this.settings.effect + '-' + this.settings.side
      );
      this.dom.menu.querySelector('.slide-menu').classList.remove('active');
      this.dom.menu.querySelector('.slide-menu-overlay').classList.remove('active');
      this.dom.menu.querySelectorAll('.slide-menu-panel li.selected').forEach((i) => {
        i.classList.remove('selected');
      });
    }
  }

  toggle(event) {
    if (this.isOpen()) {
      this.closeMenu(event, true);
    } else {
      this.openMenu(event);
    }
  }

  isOpen() {
    return document.querySelector('body').classList.contains('slide-menu-active');
  }

  openPanel(event, ref) {
    this.openMenu(event);
    var panel = ref;
    if (typeof ref !== 'string') {
      panel = event.currentTarget.getAttribute('data-panel');
    }
    this.dom.menu.querySelector('.slide-menu-toolbar > li.active-toolbar-button').classList.remove(
      'active-toolbar-button'
    );
    this.dom.menu.querySelector('li[data-panel="' + panel + '"]').classList.add(
      'active-toolbar-button'
    );
    this.dom.menu.querySelector('.slide-menu-panel.active-menu-panel').classList.remove(
      'active-menu-panel'
    );
    this.dom.menu.querySelector('div[data-panel="' + panel + '"]').classList.add(
      'active-menu-panel'
    );
  }

  nextPanel() {
    var next =
      (parseInt(this.dom.menu.querySelector('.active-toolbar-button').getAttribute('data-button')) +
        1) %
      this.dom.buttons.length;
    this.openPanel(
      null,
      this.dom.menu.querySelector('.toolbar-panel-button[data-button="' + next + '"]').getAttribute(
        'data-panel'
      )
    );
  }

  prevPanel() {
    var next =
      parseInt(this.dom.menu.querySelector('.active-toolbar-button').getAttribute('data-button')) -
      1;
    if (next < 0) {
      next = this.dom.buttons.length - 1;
    }
    this.openPanel(
      null,
      this.dom.menu.querySelector('.toolbar-panel-button[data-button="' + next + '"]').getAttribute(
        'data-panel'
      )
    );
  }

  openItem(item, force) {
    var h = parseInt(item.getAttribute('data-slide-h'));
    var v = parseInt(item.getAttribute('data-slide-v'));
    // var theme = item.getAttribute('data-theme');
    var highlightTheme = item.getAttribute('data-highlight-theme');
    var transition = item.getAttribute('data-transition');

    if (!isNaN(h) && !isNaN(v)) {
      this.deck.slide(h, v);
    }

    // if (theme) {
    //   this.changeStylesheet('theme', theme);
    // }

    // if (highlightTheme) {
    //   this.changeStylesheet('highlight-theme', highlightTheme);
    // }

    if (transition) {
      this.deck.configure({ transition: transition });
    }

    var link = this.dom.menu.querySelector('a', item);
    if (link) {
      if (
        force ||
        !this.settings.sticky ||
        (this.settings.autoOpen && link.href.startsWith('#')) ||
        link.href.startsWith(
          window.location.origin + window.location.pathname + '#'
        )
      ) {
        link.click();
      }
    }

    this.closeMenu();
  }

  clicked(event) {
    if (event.target.nodeName !== 'A') {
      event.preventDefault();
    }
    this.openItem(event.currentTarget);
  }

  highlightCurrentSlide() {
    var state = this.deck.getState();
    this.dom.menu.querySelectorAll('li.slide-menu-item, li.slide-menu-item-vertical').forEach(
      (item) => {
        item.classList.remove('past');
        item.classList.remove('active');
        item.classList.remove('future');

        var h = parseInt(item.getAttribute('data-slide-h'));
        var v = parseInt(item.getAttribute('data-slide-v'));
        if (h < state.indexh || (h === state.indexh && v < state.indexv)) {
          item.classList.add('past');
        } else if (h === state.indexh && v === state.indexv) {
          item.classList.add('active');
        } else {
          item.classList.add('future');
        }
      }
    );
  }

  // matchRevealStyle() {
  //   var revealStyle = window.getComputedStyle(this.dom.reveal);
  //   var element = this.dom.menu.querySelector('.slide-menu');
  //   element.style.fontFamily = revealStyle.fontFamily;
  //   //XXX could adjust the complete menu style to match the theme, ie colors, etc
  // }

  addToolbarButton(title, ref, icon, style, fn, active) {
    var attrs = {
      'data-button': '' + this.dom.buttons.length + 1,
      class:
        'toolbar-panel-button' + (active ? ' active-toolbar-button' : '')
    };
    if (ref) {
      attrs['data-panel'] = ref;
    }
    var button = this.create('li', attrs);

    if (icon.startsWith('fa-')) {
      button.appendChild(this.create('i', { class: style + ' ' + icon }));
    } else {
      button.innerHTML = icon + '</i>';
    }
    button.appendChild(this.create('br'), this.dom.menu.querySelector('i', button));
    button.appendChild(
      this.create('span', { class: 'slide-menu-toolbar-label' }, title),
      this.dom.menu.querySelector('i', button)
    );
    button.onclick = fn;

    this.dom.buttons.push(button);
    this.dom.toolbar.appendChild(button);
    return button;
  }

  //
  // Slide links
  //
  text(selector, parent) {
    if (selector === '') return null;
    var el = parent ? parent.querySelector(selector) : this.dom.menu.querySelector(selector);
    if (el) return el.textContent;
    return null;
  }

  generateItem(type, section, i, h, v) {
    var link = '/#/' + h;
    if (typeof v === 'number' && !isNaN(v)) link += '/' + v;

    var title =
      this.text('[data-menu-title]', section) ||
      this.text('[data-id="slide-title"]', section) ||
      this.text('.menu-title', section) ||
      this.text(this.settings.titleSelector, section);

    if (!title && this.settings.useTextContentForMissingTitles) {
      // attempt to figure out a title based on the text in the slide
      title = section.textContent.trim();
      if (title) {
        title =
          title
            .split('\n')
            .map((t) => t.trim())
            .join(' ')
            .trim()
            .replace(/^(.{16}[^\s]*).*/, '$1') // limit to 16 chars plus any consecutive non-whitespace chars (to avoid breaking words)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;') + '...';
      }
    }

    if (!title) {
      if (this.settings.hideMissingTitles) return '';
      type += ' no-title';
      title = 'Slide ' + (i + 1);
    }

    var item = this.create('li', {
      class: type,
      'data-item': i,
      'data-slide-h': h,
      'data-slide-v': v === undefined ? 0 : v
    });

    if (this.settings.markers) {
      item.appendChild(
        this.create('i', { class: 'fas fa-check-circle fa-fw past' })
      );
      item.appendChild(
        this.create('i', {
          class: 'fas fa-arrow-alt-circle-right fa-fw active'
        })
      );
      item.appendChild(
        this.create('i', { class: 'far fa-circle fa-fw future' })
      );
    }

    if (this.settings.numbers) {
      // Number formatting taken from reveal.js
      var value = [];
      var format = 'h.v';

      // Check if a custom number format is available
      if (typeof this.settings.numbers === 'string') {
        format = this.settings.numbers;
      } else if (typeof this.settings.slideNumber === 'string') {
        // Take user defined number format for slides
        format = this.settings.slideNumber;
      }

      switch (format) {
        case 'c':
          value.push(i + 1);
          break;
        case 'c/t':
          value.push(i + 1, '/', this.deck.getTotalSlides());
          break;
        case 'h/v':
          value.push(h + 1);
          if (typeof v === 'number' && !isNaN(v)) value.push('/', v + 1);
          break;
        default:
          value.push(h + 1);
          if (typeof v === 'number' && !isNaN(v)) value.push('.', v + 1);
      }

      item.appendChild(
        this.create(
          'span',
          { class: 'slide-menu-item-number' },
          value.join('') + '. '
        )
      );
    }

    item.appendChild(
      this.create('span', { class: 'slide-menu-item-title' }, title)
    );

    return item;
  }

  createSlideMenu() {
    if (
      !this.dom.menu.querySelector(
        'section[data-markdown]:not([data-markdown-parsed])'
      )
    ) {
      var panel = this.create('div', {
        'data-panel': 'Slides',
        class: 'slide-menu-panel active-menu-panel'
      });
      panel.appendChild(this.create('ul', { class: 'slide-menu-items' }));
      this.dom.panels.appendChild(panel);
      var items = this.dom.menu.querySelector(
        '.slide-menu-panel[data-panel="Slides"] > .slide-menu-items'
      );
      var slideCount = 0;
      this.dom.reveal.querySelectorAll('.slides > section').forEach((section, h) => {
        var subsections = section.querySelectorAll('section');
        if (subsections.length > 0) {
          subsections.forEach((subsection, v) => {
            var type =
              v === 0 ? 'slide-menu-item' : 'slide-menu-item-vertical';
            var item = this.generateItem(type, subsection, slideCount, h, v);
            if (item) {
              items.appendChild(item);
            }
            slideCount++;
          });
        } else {
          var item = this.generateItem(
            'slide-menu-item',
            section,
            slideCount,
            h
          );
          if (item) {
            items.appendChild(item);
          }
          slideCount++;
        }
      });
      this.dom.menu.querySelectorAll('.slide-menu-item, .slide-menu-item-vertical').forEach(
        (i) => {
          i.onclick = (e) => this.clicked(e);
        }
      );
      this.highlightCurrentSlide();
    } else {
      // wait for markdown to be loaded and parsed
      setTimeout(this.createSlideMenu, 100);
    }
  }

  handleMouseHighlight(event) {
    if (this.mouseSelectionEnabled) {
      this.dom.menu.querySelectorAll('.active-menu-panel .slide-menu-items li.selected').forEach(
        (i) => {
          i.classList.remove('selected');
        }
      );
      event.currentTarget.classList.add('selected');
    }
  }


  initMenu() {
    // if (!initialized) {
    this.dom.panels = this.create('nav', {
      class: 'slide-menu slide-menu--' + this.settings.side
    });

    if (typeof this.settings.width === 'string') {
      if (
        ['normal', 'wide', 'third', 'half', 'full'].indexOf(this.settings.width) !=
        -1
      ) {
        this.dom.panels.classList.add('slide-menu--' + this.settings.width);
      } else {
        this.dom.panels.classList.add('slide-menu--custom');
        this.dom.panels.style.width = this.settings.width;
      }
    }
    this.dom.menu.appendChild(this.dom.panels);
    // this.matchRevealStyle();
    var overlay = this.create('div', { class: 'slide-menu-overlay' });
    this.dom.menu.appendChild(overlay);
    overlay.onclick = () => {
      this.closeMenu(null, true);
    };

    this.dom.toolbar = this.create('ol', { class: 'slide-menu-toolbar' });
    this.dom.menu.querySelector('.slide-menu').appendChild(this.dom.toolbar);

    this.addToolbarButton('Slides', 'Slides', 'fa-images', 'fas', this.openPanel.bind(this), true);

    // if (this.settings.custom) {
    //   this.settings.custom.forEach((element, index, array) => {
    //     this.addToolbarButton(
    //       element.title,
    //       'Custom' + index,
    //       element.icon,
    //       null,
    //       openPanel
    //     );
    //   });
    // }

    // if (this.settings.themes) {
    //   this.addToolbarButton('Themes', 'Themes', 'fa-adjust', 'fas', openPanel);
    // }

    if (this.settings.transitions) {
      this.addToolbarButton(
        'Transitions',
        'Transitions',
        'fa-sticky-note',
        'fas',
        this.openPanel.bind(this)
      );
    }
    var button = this.create('li', {
      id: 'close',
      class: 'toolbar-panel-button'
    });
    button.appendChild(this.create('i', { class: 'fas fa-times' }));
    button.appendChild(this.create('br'));
    button.appendChild(
      this.create('span', { class: 'slide-menu-toolbar-label' }, 'Close')
    );
    button.onclick = () => {
      this.closeMenu(null, true);
    };

    // TODO: add button in this.dom.buttons?

    this.dom.toolbar.appendChild(button);

    this.createSlideMenu();
    this.deck.addEventListener('slidechanged', (e) => this.highlightCurrentSlide(e));

    //
    // Custom menu panels
    //
    // if (this.settings.custom) {
    //   function xhrSuccess() {
    //     if (this.status >= 200 && this.status < 300) {
    //       this.panel.innerHTML = this.responseText;
    //       this.enableCustomLinks(this.panel);
    //     } else {
    //       this.showErrorMsg(this);
    //     }
    //   }
    //   function xhrError() {
    //     this.showErrorMsg(this);
    //   }
    //   function loadCustomPanelContent(panel, sURL) {
    //     var oReq = new XMLHttpRequest();
    //     oReq.panel = panel;
    //     oReq.arguments = Array.prototype.slice.call(arguments, 2);
    //     oReq.onload = xhrSuccess;
    //     oReq.onerror = xhrError;
    //     oReq.open('get', sURL, true);
    //     oReq.send(null);
    //   }
    //   function enableCustomLinks(panel) {
    //     this.dom.menu.querySelectorAll('ul.slide-menu-items li.slide-menu-item', panel).forEach(
    //       function (item, i) {
    //         item.setAttribute('data-item', i + 1);
    //         item.onclick = clicked;
    //         item.addEventListener('mouseenter', handleMouseHighlight);
    //       }
    //     );
    //   }

    //   function showErrorMsg(response) {
    //     var msg =
    //       '<p>ERROR: The attempt to fetch ' +
    //       response.responseURL +
    //       ' failed with HTTP status ' +
    //       response.status +
    //       ' (' +
    //       response.statusText +
    //       ').</p>' +
    //       '<p>Remember that you need to serve the presentation HTML from a HTTP server.</p>';
    //     response.panel.innerHTML = msg;
    //   }

    //   this.settings.custom.forEach(function (element, index, array) {
    //     var panel = this.create('div', {
    //       'data-panel': 'Custom' + index,
    //       class: 'slide-menu-panel slide-menu-custom-panel'
    //     });
    //     if (element.content) {
    //       panel.innerHTML = element.content;
    //       this.enableCustomLinks(panel);
    //     } else if (element.src) {
    //       this.loadCustomPanelContent(panel, element.src);
    //     }
    //     panels.appendChild(panel);
    //   });
    // }

    //
    // Themes
    //
    // if (this.settings.themes) {
    //   var panel = this.create('div', {
    //     class: 'slide-menu-panel',
    //     'data-panel': 'Themes'
    //   });
    //   panels.appendChild(panel);
    //   var menu = this.create('ul', { class: 'slide-menu-items' });
    //   panel.appendChild(menu);
    //   this.settings.themes.forEach(function (t, i) {
    //     var attrs = {
    //       class: 'slide-menu-item',
    //       'data-item': '' + (i + 1)
    //     };
    //     if (t.theme) {
    //       attrs['data-theme'] = t.theme;
    //     }
    //     if (t.highlightTheme) {
    //       attrs['data-highlight-theme'] = t.highlightTheme;
    //     }
    //     var item = this.create('li', attrs, t.name);
    //     menu.appendChild(item);
    //     item.onclick = clicked;
    //   });
    // }

    //
    // Transitions
    //
    if (this.settings.transitions) {
      var panel = this.create('div', {
        class: 'slide-menu-panel',
        'data-panel': 'Transitions'
      });
      this.dom.panels.appendChild(panel);
      var menu = this.create('ul', { class: 'slide-menu-items' });
      panel.appendChild(menu);
      this.settings.transitions.forEach((name, i) => {
        var item = this.create(
          'li',
          {
            class: 'slide-menu-item',
            'data-transition': name.toLowerCase(),
            'data-item': '' + (i + 1)
          },
          name
        );
        menu.appendChild(item);
        item.onclick = (e) => this.clicked(e);
      });
    }

    //
    // Open menu options
    //
    if (this.settings.openButton) {
      // add menu button
      var div = this.create('div', { class: 'slide-menu-button' });
      var link = this.create('a', { href: '#' });
      link.appendChild(this.create('i', { class: 'fas fa-bars' }));
      div.appendChild(link);
      this.dom.reveal.appendChild(div);
      div.onclick = (e) => this.openMenu(e);
    }

    if (this.settings.openSlideNumber) {
      var slideNumber = this.dom.menu.querySelector('div.slide-number');
      slideNumber.onclick = (e) => this.openMenu(e);
    }

    //
    // Handle mouse overs
    //
    this.dom.menu.querySelectorAll('.slide-menu-panel .slide-menu-items li').forEach((item) => {
      item.addEventListener('mouseenter', (e) => this.handleMouseHighlight(e));
    });
    // }

    if (this.settings.keyboard) {
      //XXX add keyboard option for custom key codes, etc.

      document.addEventListener('keydown', (e) => this.onDocumentKeyDown(e), false);

      // handle key presses within speaker notes
      window.addEventListener('message', (event) => {
        var data;
        try {
          data = JSON.parse(event.data);
        } catch (e) { }
        if (data && data.method === 'triggerKey') {
          this.onDocumentKeyDown({
            keyCode: data.args[0],
            stopImmediatePropagation: () => { }
          });
        }
      });

      // Prevent reveal from processing keyboard events when the menu is open
      if (
        this.settings.keyboardCondition &&
        typeof this.settings.keyboardCondition === 'function'
      ) {
        // combine user defined keyboard condition with the menu's own condition
        this.settings.keyboardCondition = (event) => this.settings.keyboardCondition(event) && (!this.isOpen() || event.keyCode == 77);
      } else {
        this.settings.keyboardCondition = (event) => !this.isOpen() || event.keyCode == 77;
      }

      this.deck.addKeyBinding(
        { keyCode: 77, key: 'M', description: 'Toggle menu' },
        (e) => this.toggle(e)
      );
    }

    if (this.settings.openOnInit) {
      this.openMenu();
    }
  }
  //#endregion

  init() {
    this.dom.menu = document.createElement('div');
    this.dom.menu.classList.add('slide-menu-wrapper');

    this.dom.reveal = document.querySelector('.reveal');
    this.dom.reveal.parentElement.appendChild(this.dom.menu);

    // do not load the menu in the upcoming slide panel in the speaker notes
    if (
      !(this.deck.isSpeakerNotes() &&
        window.location.search.endsWith('controls=false'))
    ) {
      if (!this.settings.delayInit) this.initMenu();
      this.deck.dispatchEvent('menu-ready', this, true);
    }
  }

  constructor(deck) {
    this.deck = deck;
    this.settings = { ...defaults, ...deck.getConfig()?.menu };

    this.init();
  }
}

const Plugin = () => {
  let instance;

  return {
    id: 'menu',
    init: (deck) => {
      instance = new Menu(deck);
    },
    toggleMenu: () => {
      instance.toggle();
    },
    // openMenu,
    // closeMenu,
    // openPanel,
    // isOpen,
    // initMenu,
    // isMenuInitialized: () => initialized
  };
};

export default Plugin;
