// nav scroll state
const nav = document.getElementById('nav');
if (nav) addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 24));

// mobile menu
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navlinks');
if (toggle && links) {
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// capability accordion
document.querySelectorAll('.cap').forEach(cap => {
  const head = cap.querySelector('.cap-head');
  const body = cap.querySelector('.cap-body');
  if (!head || !body) return;
  head.addEventListener('click', () => {
    const open = cap.classList.toggle('open');
    body.style.maxHeight = open ? body.scrollHeight + 'px' : null;
  });
});

// game experience slider: clone for seamless loop + hover/click detail
(function () {
  const track = document.getElementById('gameTrack');
  const detail = document.getElementById('gameDetail');
  if (!track || !detail) return;
  const tag = detail.querySelector('.gd-tag');
  const title = detail.querySelector('.gd-title');
  const desc = detail.querySelector('.gd-desc');
  const slider = document.getElementById('gameSlider');
  const items = [...track.children];
  function show(el) {
    tag.textContent = el.dataset.tag;
    title.textContent = el.dataset.title;
    desc.textContent = el.dataset.desc;
    detail.classList.add('show');
  }
  function hide() { detail.classList.remove('show'); }
  // duplicate set so the -50% loop is seamless
  items.forEach(it => track.appendChild(it.cloneNode(true)));
  track.querySelectorAll('.gitem').forEach(it => {
    it.addEventListener('mouseenter', () => show(it));
    it.addEventListener('click', () => show(it));
  });
  if (slider) slider.addEventListener('mouseleave', hide);

  // drag-to-scroll for the game slider
  if (!slider) return;
  let isDown = false, startX = 0, baseX = 0, curX = 0, moved = 0, halfW = 0;
  const getX = () => {
    const t = getComputedStyle(track).transform;
    if (!t || t === 'none') return 0;
    const m = t.match(/matrix.*\(([^)]+)\)/);
    return m ? parseFloat(m[1].split(',')[4]) : 0;
  };
  const wrapX = (x) => {
    if (!halfW) return x;
    while (x > 0) x -= halfW;
    while (x < -halfW) x += halfW;
    return x;
  };
  const dragStart = (clientX) => {
    isDown = true;
    moved = 0;
    halfW = track.scrollWidth / 2;
    baseX = wrapX(getX());
    startX = clientX;
    curX = baseX;
    slider.classList.add('dragging', 'dragged');
    track.style.transform = `translateX(${baseX}px)`;
    hide();
  };
  const dragMove = (clientX) => {
    if (!isDown) return;
    const dx = clientX - startX;
    if (Math.abs(dx) > moved) moved = Math.abs(dx);
    curX = wrapX(baseX + dx);
    track.style.transform = `translateX(${curX}px)`;
  };
  const dragEnd = () => {
    if (!isDown) return;
    isDown = false;
    slider.classList.remove('dragging');
  };
  slider.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    dragStart(e.clientX);
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => dragMove(e.clientX));
  window.addEventListener('mouseup', dragEnd);
  slider.addEventListener('touchstart', (e) => dragStart(e.touches[0].clientX), { passive: true });
  slider.addEventListener('touchmove', (e) => dragMove(e.touches[0].clientX), { passive: true });
  slider.addEventListener('touchend', dragEnd);
  slider.addEventListener('touchcancel', dragEnd);
  // suppress accidental click after a real drag
  slider.addEventListener('click', (e) => {
    if (moved > 5) { e.stopPropagation(); e.preventDefault(); }
  }, true);
})();

// reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (Math.min(i % 4, 3) * 0.07) + 's';
  io.observe(el);
});
