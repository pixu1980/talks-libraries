/**
 * Tabs component
 *
 * Enhances a semantic HTML structure:
 *
 * ```html
 * <tabs-container>
 *   <tabs-list>
 *     <a href="#panel-1" role="tab">Tab 1</a>
 *     <a href="#panel-2" role="tab">Tab 2</a>
 *   </tabs-list>
 *   <tabs-panels>
 *     <tab-panel id="panel-1" role="tabpanel">...</tab-panel>
 *     <tab-panel id="panel-2" role="tabpanel">...</tab-panel>
 *   </tabs-panels>
 * </tabs-container>
 * ```
 *
 * Behavior:
 * - Manages roving tabindex for tabs.
 * - Sets `aria-selected` on the active tab and `aria-hidden` on inactive panels.
 * - Supports arrow key navigation within the tab list.
 * - Click on a tab activates the linked panel.
 *
 * Accessibility:
 * - Uses ARIA roles and attributes expected by screen readers.
 * - On keyboard navigation, prevents default browser behavior when handling arrows.
 *
 * Lifecycle:
 * - Registered as the `tabs` custom element.
 * - Initializes on connection and removes listeners on disconnection.

 * Notes:
 * - This component assumes a mostly static DOM structure after initialization.
 */
class TabsElement extends HTMLElement {
  static {
    !customElements.get('tabs-container') && customElements.define('tabs-container', TabsElement);
  }

  constructor() {
    super();
    this.currentTabIndex = 0;
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.tabs = [...this.querySelectorAll('tabs-list > a')];
    this.tabsPanels = [...this.querySelectorAll('tabs-panels > tab-panel')];
    if (!this.tabs.length) return;

    const selectedIndex = this.tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    this.currentTabIndex = selectedIndex >= 0 ? selectedIndex : 0;
    this.addEventListener('keydown', this.handleKeydown);
    this.addEventListener('click', this.handleClick);
    this.activateTab(this.currentTabIndex, false);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this.handleKeydown);
    this.removeEventListener('click', this.handleClick);
  }

  resetTabsTabIndex() {
    for (const tab of this.tabs) {
      tab.setAttribute('tabindex', '-1');
      tab.setAttribute('aria-selected', 'false');
    }
  }

  resetTabsPanelsVisibility() {
    for (const tabPanel of this.tabsPanels) {
      tabPanel.setAttribute('aria-hidden', 'true');
    }
  }

  activateTab(index, shouldFocus = true) {
    if (!this.tabs.length) return;
    this.currentTabIndex = index;
    this.resetTabsTabIndex();
    this.resetTabsPanelsVisibility();

    const currentTab = this.tabs[this.currentTabIndex];
    currentTab.setAttribute('tabindex', '0');
    currentTab.setAttribute('aria-selected', 'true');
    if (shouldFocus) currentTab.focus();

    const panel = this.querySelector(currentTab.getAttribute('href'));
    if (panel) panel.setAttribute('aria-hidden', 'false');
  }

  handleKeydown(event) {
    const key = event.which || event.keyCode;
    const leftArrow = 37;
    const upArrow = 38;
    const rightArrow = 39;
    const downArrow = 40;

    if (key < leftArrow || key > downArrow || !this.tabs.length) return;

    if (key === leftArrow || key === upArrow) {
      this.currentTabIndex = this.currentTabIndex > 0 ? this.currentTabIndex - 1 : this.tabs.length - 1;
    } else if (key === rightArrow || key === downArrow) {
      this.currentTabIndex = this.currentTabIndex < this.tabs.length - 1 ? this.currentTabIndex + 1 : 0;
    }

    this.activateTab(this.currentTabIndex);
    event.preventDefault();
    event.stopPropagation();
  }

  handleClick(event) {
    const target = event.target.closest('a');
    if (!target || !this.contains(target)) return;
    const nextIndex = this.tabs.indexOf(target);
    if (nextIndex < 0) return;

    this.activateTab(nextIndex, false);
    event.preventDefault();
    event.stopPropagation();
  }
}
