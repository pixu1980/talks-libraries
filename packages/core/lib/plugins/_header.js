/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 *
 * Handshake process:
 * 1. This window posts 'connect' to notes window
 *    - Includes URL of presentation to show
 * 2. Notes window responds with 'connected' when it is available
 * 3. This window proceeds to send the current presentation state
 *    to the notes window
 */
const HeaderPlugin = () => {
  let deck;

  const headerPlugin = {
    id: 'header',
    init: (reveal) => {
      deck = reveal;

      deck.addEventListener('slidechanged', (e) => {
        if (e.previousSlide) {
          const prevHeaderElement = e.previousSlide.querySelector('header');

          if (!!prevHeaderElement) {
            prevHeaderElement.style.position = 'fixed';
            prevHeaderElement.style.top = 0;
            prevHeaderElement.style.left = 0;
            prevHeaderElement.style.right = 0;
            prevHeaderElement.style.opacity = 0;
            prevHeaderElement.style.width = '100vw';
          }
        }

        if (e.currentSlide) {
          const headerElement = e.currentSlide.querySelector('header');

          if (!!headerElement) {
            headerElement.style.position = 'fixed !important';
            headerElement.style.top = '0 !important';
            headerElement.style.left = '0 !important';
            headerElement.style.right = '0 !important';
            headerElement.style.width = '100vw !important';
            headerElement.style.opacity = !e.previousSlide;
            headerElement.style.transition = 'opacity .2s ease-in-out';
          }
        }
      });

      deck.addEventListener('slidetransitionend', (e) => {
        const headerElement = e.currentSlide.querySelector('header');

        if (!!headerElement) {
          headerElement.style.opacity = 1;
        }
      });
    },
    update: (e) => {
    }
  };

  return headerPlugin;

};

export default HeaderPlugin;
