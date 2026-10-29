const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav?.addEventListener('click', e => {
  if (e.target.closest('a')) { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.focus();
  }
});
const search = document.querySelector('#pub-search');
const category = document.querySelector('#pub-category');
if (search && category) {
  const items = [...document.querySelectorAll('.pub-item')];
  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function filter() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let total = 0;
    items.forEach(item => {
      const text = normalize(item.textContent);
      const show = terms.every(term => text.includes(term)) && (category.value === 'all' || category.value === item.dataset.category);
      item.hidden = !show; if (show) total++;
    });
    document.querySelectorAll('.pub-group').forEach(group => { group.hidden = ![...group.querySelectorAll('.pub-item')].some(item => !item.hidden); });
    document.querySelector('#result-count').textContent = `${total} ${total === 1 ? 'entry' : 'entries'} shown`;
    document.querySelector('#no-results').hidden = total !== 0;
  }
  search.value = new URLSearchParams(location.search).get('q') || '';
  search.addEventListener('input', filter); category.addEventListener('change', filter); filter();
}
