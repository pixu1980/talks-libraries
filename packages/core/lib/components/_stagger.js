/**
 * Stagger animation components
 *
 * Enhances `<stagger-container>` containers by assigning a per-child CSS variable
 * `--stagger--index` to allow staggered effects in CSS.
 *
 * Usage:
 * ```html
 * <stagger-container>
 *   <div>Item A</div>
 *   <div>Item B</div>
 *   <div>Item C</div>
 * </stagger-container>
 * ```
 * Then in CSS you can refer to `--stagger--index` to offset animations/timings.
 *
 * Lifecycle:
 * - Registered as the `stagger` custom element.
 * - Recomputes child indexes when the element is connected.
 */
class StaggerElement extends HTMLElement {
  static {
    !customElements.get('stagger-container') && customElements.define('stagger-container', StaggerElement);
  }
  
  connectedCallback() {
    this.refreshItems();
  }

  refreshItems() {
    const staggerItems = [...this.querySelectorAll(':scope > *')];

    staggerItems.forEach((element, index) => {
      element.style.setProperty('--stagger--index', index);
    });
  }
}
