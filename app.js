const body = document.body;
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
const langButton = document.querySelector('.lang-toggle');
const floatingCta = document.querySelector('.floating-cta');
const contact = document.querySelector('#contact');
const toast = document.querySelector('.toast');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-hidden', String(!open));
  menu.classList.toggle('open', open);
  body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

langButton.addEventListener('click', () => {
  const english = !body.classList.contains('lang-en');
  body.classList.toggle('lang-en', english);
  document.documentElement.lang = english ? 'en' : 'zh-CN';
  langButton.innerHTML = english
    ? '<span>中</span><span class="slash">/</span><span class="active-lang">EN</span>'
    : '<span class="active-lang">中</span><span class="slash">/</span><span>EN</span>';
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  revealObserver.observe(el);
});

const ctaObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => floatingCta.classList.toggle('hidden', entry.isIntersecting));
}, { threshold: 0.14 });
ctaObserver.observe(contact);

document.querySelector('.copy-brief').addEventListener('click', async () => {
  const product = document.querySelector('#product-select').value;
  const quantity = document.querySelector('#quantity-input').value.trim() || '待确认 / To be confirmed';
  const requirement = document.querySelector('#requirement-input').value.trim() || '待沟通 / To be discussed';
  const brief = [
    '华洁无纺 OEM/ODM 询价需求 / Huajie OEM/ODM Inquiry',
    `产品 / Product: ${product}`,
    `预计数量 / Quantity: ${quantity}`,
    `主要需求 / Requirements: ${requirement}`,
  ].join('\n');

  try {
    await navigator.clipboard.writeText(brief);
  } catch (error) {
    const helper = document.createElement('textarea');
    helper.value = brief;
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
  }

  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1800);
});

document.querySelector('#year').textContent = new Date().getFullYear();
