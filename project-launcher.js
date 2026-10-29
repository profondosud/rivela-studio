// This chooser only prepares the contact link; no project data is sent here.
(() => {
  const services = [
    ['siti-web', 'Sito web'],
    ['presentazioni', 'Presentazioni'],
    ['dossier', 'Dossier'],
    ['video', 'Video con IA']
  ];
  const serviceIcons = {
    'siti-web': ['M4 5h24v17H4z', 'M4 10h24', 'M11 27h10', 'M16 22v5'],
    presentazioni: ['M5 5h22v17H5z', 'M16 22v6', 'm11 28 5-6 5 6', 'm10 17 4-5 4 2 4-5'],
    dossier: ['M8 3h11l6 6v20H8z', 'M19 3v7h6', 'M12 16h9', 'M12 21h9', 'M12 25h6'],
    video: ['M27 16a11 11 0 1 1-22 0 11 11 0 0 1 22 0', 'm14 11 7 5-7 5z']
  };
  document.querySelectorAll('.brief-cta').forEach((section, index) => {
    const wrap = section.querySelector(':scope > .wrap');
    const link = wrap?.querySelector(':scope > a.btn');
    if (!wrap || !link || section.dataset.launcherReady === 'true') return;

    const panel = document.createElement('div');
    panel.className = 'project-launcher-panel';
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'project-launcher-options';
    const legend = document.createElement('legend');
    legend.textContent = 'Da dove partiamo?';
    const grid = document.createElement('div');
    grid.className = 'project-launcher-choices';

    services.forEach(([value, text]) => {
      const label = document.createElement('label');
      label.className = 'project-launcher-choice';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `project-launcher-service-${index}`;
      input.value = value;
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('viewBox', '0 0 32 32');
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('focusable', 'false');
      icon.classList.add('project-launcher-icon');
      serviceIcons[value].forEach(shape => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', shape);
        icon.append(path);
      });
      const mark = document.createElement('span');
      mark.className = 'project-launcher-radio-mark';
      mark.setAttribute('aria-hidden', 'true');
      const caption = document.createElement('span');
      caption.className = 'project-launcher-choice-text';
      caption.textContent = text;
      label.append(input, icon, mark, caption);
      input.addEventListener('change', () => {
        if (!input.checked) return;
        const source = `contatti.html?servizio=${encodeURIComponent(value)}#progetto`;
        const destination = new URL(source, document.baseURI);
        destination.searchParams.set('lang', document.documentElement.lang || 'it');
        link.href = destination.href;
        // Keep the choice when the shared language switch rebuilds internal links.
        if (typeof languageLinkSources !== 'undefined') languageLinkSources.set(link, source);
        if (typeof updateLanguageLinks === 'function') updateLanguageLinks();
      });
      grid.append(label);
    });
    fieldset.append(legend, grid);
    panel.append(fieldset, link);
    wrap.append(panel);
    section.classList.add('project-launcher');
    section.dataset.launcherReady = 'true';
    link.textContent = 'Presentaci il tuo progetto';
    const heading = section.querySelector('h2');
    if (heading) {
      if (!heading.id) heading.id = `project-launcher-title-${index}`;
      section.setAttribute('aria-labelledby', heading.id);
    }
    if (typeof translateRivela === 'function') translateRivela(section);
  });
})();
