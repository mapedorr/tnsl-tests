(() => {
  const nav = document.querySelector('.site-header');
  const navBottom = nav.offsetTop + nav.offsetHeight;
  let navOut = false;
  let lastScrollY = 0;

  function fixNav () {
    if (window.scrollY === 0) {
      navOut = false;
      document.body.style.paddingTop = 0;
      nav.classList.remove('is-fixed');
    }
    else if (window.scrollY >= navBottom) {
      navOut = true;
      nav.classList.add('is-hidden');
    }

    if (navOut === true && lastScrollY > window.scrollY) {
      document.body.style.paddingTop = `${nav.offsetHeight}px`;
      nav.classList.remove('is-hidden');
      nav.classList.add('is-fixed');
    }

    lastScrollY = window.scrollY;
  }

  document.addEventListener('scroll', fixNav);
})();