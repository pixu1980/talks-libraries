// Tabs component
addEventListener('DOMContentLoaded', () => {
  const tabsComponents = document.querySelectorAll('tabs');

  for (const tabsComponent of tabsComponents) {
    let currentTabIndex = 0;
    const tabs = tabsComponent.querySelectorAll('tabs-list > a');
    const tabsPanels = tabsComponent.querySelectorAll('tabs-panels > tab-panel');

    const resetTabsTabIndex = () => {
      // undo tab control selected state,
      // and make them not selectable with the tab key
      // (all tabs)
      for (const tab of tabs) {
        tab.setAttribute('tabindex', '-1');
        tab.setAttribute('aria-selected', 'false');
      }
    };

    const resetTabsPanelsVisibility = () => {
      // hide all tab panels.
      for (const tabPanel of tabsPanels) {
        tabPanel.setAttribute('aria-hidden', 'true');
      }
    };

    const setCurrentTabTabIndex = () => {
      // make the selected tab the selected one, shift focus to it
      tabs[currentTabIndex].setAttribute('tabindex', '0');
      tabs[currentTabIndex].setAttribute('aria-selected', 'true');
      tabs[currentTabIndex].focus();
    };

    tabsComponent.addEventListener('keydown', (e) => {
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

    tabsComponent.addEventListener('click', (e) => {
      // just make the clicked tab the selected one
      currentTabIndex = [...tabs].indexOf(tab);

      resetTabsTabIndex();
      resetTabsPanelsVisibility();
      setCurrentTabTabIndex();

      // // handle parent <li> current class (for coloring the tabs)
      // document.querySelector($tabs.get(index)).parent().siblings().removeClass('current');
      // document.querySelector($tabs.get(index)).parent().addClass('current');

      // add a current class also to the tab panel
      // controlled by the clicked tab
      document.querySelector(tab.getAttribute('href')).setAttribute('aria-hidden', 'false');

      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }
});
