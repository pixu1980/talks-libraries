/**
 * DiveIn stacked container component
 *
 * Enhances a `<dive-in>` element that contains a `<stack-container>` with
 * several `<stack-item>` children.
 *
 * Behavior:
 * - Assigns a sequential CSS custom property `--index` to each `stack-item`
 *   (reversed order), which can be used from CSS to create depth and staggered
 *   visual effects.
 * - Listens for mouse movements and computes an offset from the viewport center.
 *   The computed values are written to `--mouse-x` and `--mouse-y` on the
 *   `stack-container`, enabling CSS driven parallax/tilt effects.
 *
 * Lifecycle:
 * - Registered as the `dive-in` custom element.
 * - Initializes when the element is connected and cleans up listeners when it
 *   is disconnected.

 * Performance notes:
 * - The `mousemove` handler writes CSS variables on every event. For complex
 *   scenes consider throttling with requestAnimationFrame.
 */
class DiveInElement extends HTMLElement {
  constructor() {
    super();
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  connectedCallback() {
    this.refreshStack();
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  disconnectedCallback() {
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  refreshStack() {
    const stackContainer = this.querySelector('stack-container');
    if (!stackContainer) return;
    const stackItems = [...stackContainer.querySelectorAll('stack-item')].reverse();

    for (let index = 0; index < stackItems.length; index += 1) {
      stackItems[index].style.setProperty('--index', index);
    }
  }

  handleMouseMove(event) {
    const stackContainer = this.querySelector('stack-container');
    if (!stackContainer) return;

    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    const offsetX = viewportCenterX - event.clientX;
    const offsetY = viewportCenterY - event.clientY;

    stackContainer.style.setProperty('--mouse-x', `${offsetX}px`);
    stackContainer.style.setProperty('--mouse-y', `${offsetY}px`);
  }
}

if (!customElements.get('dive-in')) {
  customElements.define('dive-in', DiveInElement);
}
