window.uiuxEngineering = {
  /**
   * Pass in an element and its CSS Custom Property that you want the value of.
   * Optionally, you can determine what datatype you get back.
   *
   * @param {String} propKey
   * @param {HTMLELement} element=document.documentElement
   * @param {String} castAs='string'
   * @returns {*}
   */
  getCustomProperty: (propKey, element = document.documentElement, castAs = 'string') => {
    let response = getComputedStyle(element).getPropertyValue(propKey);

    // Tidy up the string if there's something to work with
    if (response.length) {
      response = response.replace(/\'|"/g, '').trim();
    }

    // Convert the response into a whatever type we wanted
    switch (castAs) {
      case 'number':
      case 'int':
        return parseInt(response, 10);
      case 'float':
        return parseFloat(response, 10);
      case 'boolean':
      case 'bool':
        return response === 'true' || response === '1';
    }

    // Return the string response by default
    return response;
  },
  /**
   * Dispatches an event of the specified type from the
   * reveal DOM element.
   */
  dispatchEvent(type, args) {
    var event = document.createEvent('HTMLEvents', 1, 2);
    event.initEvent(type, true, true);
    // extend(event, args);
    document.querySelector('.reveal').dispatchEvent(event);

    // If we're in an iframe, post each reveal.js event to the
    // parent window. Used by the notes plugin
    if (config.postMessageEvents && window.parent !== window.self) {
      window.parent.postMessage(
        JSON.stringify({
          namespace: 'reveal',
          eventName: type,
          state: getState()
        }),
        '*'
      );
    }
  },
  getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  },
  visibleOffset(el) {
    var offsetFromTop = this.getOffset(el).top - el.offsetParent.offsetTop;
    if (offsetFromTop < 0) return -offsetFromTop;
    var offsetFromBottom =
      el.offsetParent.offsetHeight -
      (el.offsetTop - el.offsetParent.scrollTop + el.offsetHeight);
    if (offsetFromBottom < 0) return offsetFromBottom;
    return 0;
  },
  // modified from math plugin
  loadResource(url, type, callback) {
    var head = document.querySelector('head');
    var resource;

    if (type === 'script') {
      resource = document.createElement('script');
      resource.type = 'text/javascript';
      resource.src = url;
    } else if (type === 'stylesheet') {
      resource = document.createElement('link');
      resource.rel = 'stylesheet';
      resource.href = url;
    }

    // Wrapper for callback to make sure it only fires once
    var finish = function () {
      if (typeof callback === 'function') {
        callback.call();
        callback = null;
      }
    };

    resource.onload = finish;

    // IE
    resource.onreadystatechange = function () {
      if (this.readyState === 'loaded') {
        finish();
      }
    };

    // Normal browsers
    head.appendChild(resource);
  },
  select(selector, el) {
    if (!el) {
      el = document;
    }
    return el.querySelector(selector);
  },
  selectAll(selector, el) {
    if (!el) {
      el = document;
    }
    return Array.prototype.slice.call(el.querySelectorAll(selector));
  },
  create(tagName, attrs, content) {
    var el = document.createElement(tagName);
    if (attrs) {
      Object.getOwnPropertyNames(attrs).forEach(function (n) {
        el.setAttribute(n, attrs[n]);
      });
    }
    if (content) el.innerHTML = content;
    return el;
  }
}
