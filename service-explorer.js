// Progressive enhancement: the complete service list remains readable without JavaScript.
(() => {
  const grid = document.querySelector('#servizi .offer-grid');
  if (!grid) return;
  const panels = [...grid.querySelectorAll(':scope > .offer')];
  if (panels.length !== 4) return;

  const explorer = document.createElement('div');
  explorer.className = 'service-explorer';
  const choices = document.createElement('div');
  choices.className = 'service-explorer-choices';
  const hint = document.createElement('p');
  hint.className = 'service-explorer-hint';
  hint.textContent = 'Scegli un servizio';
  const tablist = document.createElement('div');
  tablist.className = 'service-explorer-tabs';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Scegli un servizio');
  const compactLayout = matchMedia('(max-width: 700px)');
  function updateOrientation() {
    tablist.setAttribute('aria-orientation', compactLayout.matches ? 'horizontal' : 'vertical');
  }
  updateOrientation();
  compactLayout.addEventListener('change', updateOrientation);
  const tabs = panels.map((panel, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.id = `service-tab-${panel.id}`;
    tab.className = 'service-explorer-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    const number = document.createElement('span');
    number.className = 'service-explorer-number';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = String(index + 1).padStart(2, '0');
    const label = document.createElement('span');
    label.className = 'service-explorer-label';
    label.textContent = panel.querySelector('h2').textContent;
    const marker = document.createElement('span');
    marker.className = 'service-explorer-marker';
    marker.setAttribute('aria-hidden', 'true');
    tab.append(number, label, marker);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    tablist.append(tab);
    return tab;
  });
  choices.append(hint, tablist);
  grid.before(explorer);
  explorer.append(choices, grid);
  grid.classList.add('service-explorer-stage');

  let selected = -1;
  function select(index, { focus = false, updateHash = false } = {}) {
    if (index < 0 || index >= panels.length) return;
    const changed = index !== selected;
    panels.forEach((panel, item) => {
      const active = index === item;
      panel.hidden = !active;
      panel.inert = !active;
      tabs[item].setAttribute('aria-selected', String(active));
      tabs[item].tabIndex = active ? 0 : -1;
    });
    explorer.dataset.service = panels[index].id;
    selected = index;
    if (changed && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      panels[index].animate(
        [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 240, easing: 'ease-out' }
      );
    }
    if (focus) tabs[index].focus({ preventScroll: true });
    if (updateHash) history.replaceState(null, '', `${location.pathname}${location.search}#${panels[index].id}`);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index, { updateHash: true }));
    tab.addEventListener('keydown', event => {
      const directions = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      let next;
      if (Object.hasOwn(directions, event.key)) next = (index + directions[event.key] + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(next, { focus: true, updateHash: true });
    });
  });
  function selectHash() {
    const index = panels.findIndex(panel => `#${panel.id}` === location.hash);
    if (index >= 0) select(index);
  }
  select(Math.max(0, panels.findIndex(panel => `#${panel.id}` === location.hash)));
  window.addEventListener('hashchange', selectHash);
  // Newly created labels join the same translation system as the rest of the page.
  if (typeof translateRivela === 'function') translateRivela(explorer);
})();
