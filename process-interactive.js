/* Progressive enhancement: every phase stays readable when JavaScript is unavailable. */
(() => {
  const explorer = document.querySelector('#come-funziona .process-explorer');
  const track = explorer?.querySelector('.process-track');
  const panels = track ? Array.from(track.children).filter(node => node.tagName === 'LI') : [];
  if (!explorer || panels.length < 2 || explorer.classList.contains('is-enhanced')) return;

  const tabList = document.createElement('div');
  tabList.className = 'process-tabs';
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-label', 'Esplora le fasi');

  const tabs = panels.map((panel, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'process-tab';
    tab.id = `process-tab-${index + 1}`;
    tab.setAttribute('role', 'tab');
    const panelId = panel.id || `process-phase-${index + 1}`;
    panel.id = panelId;
    panel.dataset.phase = String(index + 1);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.setAttribute('aria-controls', panelId);

    const number = document.createElement('span');
    number.className = 'process-tab-number';
    number.textContent = String(index + 1).padStart(2, '0');
    number.setAttribute('aria-hidden', 'true');
    const title = document.createElement('span');
    title.textContent = panel.querySelector('h2')?.textContent.trim() || String(index + 1);
    tab.append(number, title);
    tabList.append(tab);
    return tab;
  });

  track.setAttribute('role', 'presentation');
  explorer.prepend(tabList);

  let active = 0;
  const activate = (index, focus = '') => {
    active = Math.max(0, Math.min(index, panels.length - 1));
    panels.forEach((panel, item) => {
      const selected = item === active;
      panel.hidden = !selected;
      panel.inert = !selected;
      panel.classList.toggle('is-active', selected);
      tabs[item].setAttribute('aria-selected', String(selected));
      tabs[item].tabIndex = selected ? 0 : -1;
    });
    explorer.dataset.phase = String(active + 1);
    explorer.style.setProperty('--path-progress', String(active / (panels.length - 1)));
    if (focus === 'tab') tabs[active].focus({ preventScroll: true });
    if (focus === 'panel') panels[active].focus({ preventScroll: true });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % panels.length;
      else if (event.key === 'ArrowLeft') target = (index - 1 + panels.length) % panels.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = panels.length - 1;
      else return;
      event.preventDefault();
      activate(target, 'tab');
    });
  });

  explorer.classList.add('is-enhanced');
  const linkedPhase = panels.findIndex(panel => `#${panel.id}` === window.location.hash);
  activate(linkedPhase >= 0 ? linkedPhase : 0);
  if (typeof translateRivela === 'function') translateRivela(explorer);
})();
