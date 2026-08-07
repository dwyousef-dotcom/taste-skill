/* sessions-dynamo.com - site behavior. No frameworks, no build step.
   Scroll reveals use IntersectionObserver (never scroll listeners) and are
   skipped entirely under prefers-reduced-motion. */

document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

/* CALL_LINK - the real "Yousef D" cal.com account (verified 2026-08-06). */
const CALL_LINK = "https://cal.com/yousef-dynamo/15min";
const CONTACT_EMAIL = "yousef@sessions-dynamo.com";

/* ---- mobile nav ---- */
const burger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
burger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

/* ---- reveal on scroll ---- */
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-fade]').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('[data-fade]').forEach(el => el.classList.add('in'));
}

/* ---- intake modal ---- */
const intake = document.getElementById('intake');
const steps  = intake.querySelectorAll('.step');
const fsteps = intake.querySelectorAll('.fstep');
const dots   = intake.querySelectorAll('.steps-dots span');
let fstep = 1;
const titles = {
  1: ["Your pharmacy", "We'll confirm your city is still open."],
  2: ["Where do the calls go?", "The number patient calls get forwarded to."],
  3: ["Where does the tracker go?", "Your tracker lands in this inbox."]
};
function showStep(name) { steps.forEach(s => s.classList.toggle('active', s.dataset.step === name)); }
function openIntake(e) { if (e) e.preventDefault(); setFStep(1); showStep('0'); intake.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeIntake() { intake.classList.remove('open'); document.body.style.overflow = ''; }
function setFStep(n) {
  fstep = n;
  fsteps.forEach(f => f.classList.toggle('active', +f.dataset.fstep === n));
  dots.forEach((d, i) => d.classList.toggle('on', i < n));
  document.getElementById('step-label').textContent = 'Step ' + n + ' of 3';
  document.getElementById('form-title').textContent = titles[n][0];
  document.getElementById('form-sub').textContent = titles[n][1];
  document.getElementById('form-back').style.visibility = n > 1 ? 'visible' : 'hidden';
  document.getElementById('form-next').textContent = n < 3 ? 'Continue' : 'Send my details';
}

/* every "Book a 15-min call" control on the page */
document.querySelectorAll('[data-book]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault(); window.open(CALL_LINK, '_blank', 'noopener');
}));
/* every "Start the setup" control opens the intake straight at the form */
document.querySelectorAll('[data-start]').forEach(b => b.addEventListener('click', e => {
  e.preventDefault(); openIntake(); showStep('form'); setFStep(1);
}));

document.getElementById('intake-close').addEventListener('click', closeIntake);
intake.addEventListener('click', e => { if (e.target === intake) closeIntake(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && intake.classList.contains('open')) closeIntake(); });
document.getElementById('choose-call').addEventListener('click', () => { window.open(CALL_LINK, '_blank', 'noopener'); closeIntake(); });
document.getElementById('choose-start').addEventListener('click', () => { showStep('form'); setFStep(1); });
document.getElementById('form-back').addEventListener('click', () => { if (fstep > 1) setFStep(fstep - 1); });
if (location.search.indexOf('start') > -1) { openIntake(); showStep('form'); setFStep(1); }

function validStep(n) {
  const inputs = fsteps[n - 1].querySelectorAll('input');
  for (const i of inputs) {
    i.classList.remove('invalid');
    if (i.name === 'website') continue;
    if (!i.value.trim()) { i.focus(); i.classList.add('invalid'); return false; }
    if (i.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value)) { i.focus(); i.classList.add('invalid'); return false; }
  }
  return true;
}

document.getElementById('intake-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validStep(fstep)) return;
  if (fstep < 3) { setFStep(fstep + 1); return; }

  const data = Object.fromEntries(new FormData(e.target).entries());
  const subject = 'Yellow Fever pilot - ' + (data.pharmacy || 'pharmacy') + ' (' + (data.city || '') + ')';
  const body = 'Pharmacy: ' + data.pharmacy +
               '\nCity: ' + data.city +
               '\nWebsite: ' + (data.website || 'n/a') +
               '\nRouting phone: ' + data.phone +
               '\nTracker email: ' + data.email + '\n';
  const href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

  /* Show the answers back so nothing is lost if the mail client never opens.
     No fake "you're in the queue": the visitor still has to press send. */
  document.getElementById('done-review').innerHTML =
    [['Pharmacy', data.pharmacy], ['City', data.city], ['Website', data.website || 'n/a'],
     ['Phone', data.phone], ['Email', data.email]]
    .map(([k, v]) => '<div><dt>' + k + '</dt><dd>' + String(v).replace(/[<>&]/g, '') + '</dd></div>').join('');
  document.getElementById('done-mailto').href = href;
  showStep('done');
  window.location.href = href;
});
