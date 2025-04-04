addEventListener('DOMContentLoaded', () => {
  const staggers = [...document.querySelectorAll('stagger')];

  for (const stagger of staggers) {
    const staggerItems = [...stagger.querySelectorAll(':scope > *')];

    for (const staggerItem of staggerItems) {
      staggerItems.style.setProperty('--stagger--index', i);
    }
  }
});
