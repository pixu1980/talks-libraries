/**
 * Tabs component
 *
 * Enhances a semantic HTML structure:
 *
 * ```html
 * <tabs>
 *   <tabs-list>
 *     <a href="#panel-1" role="tab">Tab 1</a>
 *     <a href="#panel-2" role="tab">Tab 2</a>
 *   </tabs-list>
 *   <tabs-panels>
 *     <tab-panel id="panel-1" role="tabpanel">...</tab-panel>
 *     <tab-panel id="panel-2" role="tabpanel">...</tab-panel>
 *   </tabs-panels>
 * </tabs>
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
 * Notes:
 * - This component assumes a static DOM structure.
 * - There are potential issues in the original code (kept to avoid behavior changes):
 *   - `currentTabIndex = [...tabs].indexOf(tab);` references `tab` which is not defined in the click handler scope.
 *   - `document.querySelector(tab.getAttribute('href'))` searches the whole document; a scoped query within the tabs component may be preferable.
 */
// Tabs component
addEventListener("DOMContentLoaded", () => {
	const tabsComponents = document.querySelectorAll("tabs");

	for (const tabsComponent of tabsComponents) {
		let currentTabIndex = 0;
		const tabs = tabsComponent.querySelectorAll("tabs-list > a");
		const tabsPanels = tabsComponent.querySelectorAll(
			"tabs-panels > tab-panel",
		);

		const resetTabsTabIndex = () => {
			// undo tab control selected state,
			// and make them not selectable with the tab key
			// (all tabs)
			for (const tab of tabs) {
				tab.setAttribute("tabindex", "-1");
				tab.setAttribute("aria-selected", "false");
			}
		};

		const resetTabsPanelsVisibility = () => {
			// hide all tab panels.
			for (const tabPanel of tabsPanels) {
				tabPanel.setAttribute("aria-hidden", "true");
			}
		};

		const setCurrentTabTabIndex = () => {
			// make the selected tab the selected one, shift focus to it
			tabs[currentTabIndex].setAttribute("tabindex", "0");
			tabs[currentTabIndex].setAttribute("aria-selected", "true");
			tabs[currentTabIndex].focus();
		};

		tabsComponent.addEventListener("keydown", (e) => {
			// on keydown,
			// determine which tab to select
			var LEFT_ARROW = 37;
			var UP_ARROW = 38;
			var RIGHT_ARROW = 39;
			var DOWN_ARROW = 40;

			var k = e.which || e.keyCode;

			// if the key pressed was an arrow key
			if (k >= LEFT_ARROW && k <= DOWN_ARROW) {
				// move left one tab for left and up arrows
				if (k === LEFT_ARROW || k === UP_ARROW) {
					if (currentTabIndex > 0) {
						currentTabIndex--;
					}
					// unless you are on the first tab,
					// in which case select the last tab.
					else {
						currentTabIndex = tabs.length - 1;
					}
				}
				// move right one tab for right and down arrows
				else if (k === RIGHT_ARROW || k === DOWN_ARROW) {
					if (currentTabIndex < tabs.length - 1) {
						currentTabIndex++;
					}
					// unless you're at the last tab,
					// in which case select the first one
					else {
						currentTabIndex = 0;
					}
				}

				// trigger a click event on the tab to move to
				tabs[currentTabIndex].click();

				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		});

		tabsComponent.addEventListener("click", (e) => {
			// Determine the clicked tab anchor within this tabs component
			const target = e.target.closest("a");
			if (!target || !tabsComponent.contains(target)) return;
			// Make the clicked tab the selected one
			currentTabIndex = [...tabs].indexOf(target);

			resetTabsTabIndex();
			resetTabsPanelsVisibility();
			setCurrentTabTabIndex();

			// // handle parent <li> current class (for coloring the tabs)
			// document.querySelector($tabs.get(index)).parent().siblings().removeClass('current');
			// document.querySelector($tabs.get(index)).parent().addClass('current');

			// Show the associated panel (scoped within this tabs component)
			const panel = tabsComponent.querySelector(target.getAttribute("href"));
			panel && panel.setAttribute("aria-hidden", "false");

			e.preventDefault();
			e.stopPropagation();
			return false;
		});
	}
});
