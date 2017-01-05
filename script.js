(() => {
  // ---------------------------------------------------------------------------
  // variables definition
  // ---------------------------------------------------------------------------
  const nav = document.querySelector('.site-header');
  const navBottom = nav.offsetTop + nav.offsetHeight;
  const footerMenu = document.querySelector('.menu-footer');
  const footerMarker = document.querySelector('.footer-marker');
  const footerMenuElements = document.querySelectorAll('.menu-footer .menu-item');
  const menuPrimaryItems = document.querySelectorAll('.menu-primary .menu-item');
  const submenuBackground = document.querySelector('.submenu-background');
  const submenuBackgroundArrow = document.querySelector('.submenu-background .arrow');

  let navOut = false;
  let lastScrollY = 0;
  let footerMarkerVisible = false;
  let currentLiHover = null;
  let inWidthAnimation = false;
  let scaleCount = 0;
  let inReverse = false;

  // ---------------------------------------------------------------------------
  // functions definition
  // ---------------------------------------------------------------------------
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

  function placeFooterMarker (event) {
    if (!event.target.classList.contains('menu-item')) return;

    scaleCount++;
    if (!footerMarkerVisible) {
      footerMarker.style.left = `${event.target.offsetLeft + footerMenu.offsetLeft}px`;
      footerMarker.style.transform = `scaleY(${scaleCount})`;
    }
    else {
      if (this.dataset.index < currentLiHover.dataset.index) {
        inReverse = true;
        footerMarker.style.transformOrigin = 'right';
      }
      else {
        inReverse = false;
        footerMarker.style.transformOrigin = 'left';
      }

      footerMarker.style.transform = `scaleX(${scaleCount})`;
    }

    currentLiHover = event.target;
    event.stopPropagation();
  }

  function moveFooterMarker (event) {
    if (!event.target.classList.contains('menu-item')) return;

    if (footerMarkerVisible) {
      footerMarker.classList.add('animate-position');
    }

    event.stopPropagation();
  }

  function hideFooterMarker (event) {
    footerMarkerVisible = inWidthAnimation = inReverse = false;
    footerMarker.classList.remove('animate-position');
    footerMarker.style.transform = 'scaleY(0)';
    footerMarker.style.transformOrigin = 'top';
    currentLiHover = null;
    scaleCount = 0;
  }

  function leaveFooterMenu (event) {
    if (!currentLiHover) return;
    if (event.propertyName === 'transform') {
      if (!footerMarkerVisible && scaleCount > 0) footerMarkerVisible = true;
      else if (!inWidthAnimation) {
        inWidthAnimation = true;
        scaleCount = 1;

        if (inReverse) {
          footerMarker.style.transformOrigin = 'left';
        }
        else {
          footerMarker.style.transformOrigin = 'right';
        }

        footerMarker.style.left = `${currentLiHover.offsetLeft + footerMenu.offsetLeft}px`;
        footerMarker.style.transform = `scaleX(1)`;
      }
      else {
        inWidthAnimation = false;
        footerMarker.style.transformOrigin = 'left';
      }
    }
  }

  function openMenuPrimarySubmenu () {
    if (!this.querySelector('.submenu')) return;

    this.classList.add('trigger-enter');
    // when arrow functions are used, the value of this inside the function
    // is inherited from the container function, in this case, this will be
    // the <li> element. :D
    setTimeout(() => this.classList.contains('trigger-enter') && this.classList.add('trigger-enter-active'), 150);
    submenuBackground.classList.add('open');

    const submenu = this.querySelector('.submenu');
    const submenuCoords = submenu.getBoundingClientRect();
    const navCoords = nav.getBoundingClientRect();
    const coords = {
      width: submenuCoords.width,
      height: submenuCoords.height - (submenuBackground.offsetTop - submenu.offsetTop - 2),
      left: submenuCoords.left,
      top: submenuCoords.top - navCoords.top
    };

    submenuBackground.style.setProperty('width', `${coords.width}px`);
    submenuBackground.style.setProperty('height', `${coords.height}px`);
    submenuBackground.style.setProperty('transform', `translateX(${coords.left}px)`);

    submenuBackgroundArrow.style.setProperty('left', `${this.offsetWidth / 2 - submenuBackgroundArrow.offsetWidth / 2}px`);
  }

  function closeMenuPrimarySubmenu () {
    if (!this.querySelector('.submenu')) return;
    this.classList.remove('trigger-enter', 'trigger-enter-active');
    submenuBackground.classList.remove('open');
    submenuBackground.style.setProperty('transform', `translateX(0)`);
  }

  // ---------------------------------------------------------------------------
  // add event listeners
  // ---------------------------------------------------------------------------
  document.addEventListener('scroll', fixNav);
  menuPrimaryItems.forEach(menuItem => {
    menuItem.addEventListener('mouseenter', openMenuPrimarySubmenu);
    menuItem.addEventListener('mouseleave', closeMenuPrimarySubmenu);
  });
  footerMenuElements.forEach((li, index) => {
    if (!footerMarker.style.width) footerMarker.style.width = `${li.offsetWidth}px`;
    li.dataset.index = index;
    li.addEventListener('mouseleave', moveFooterMarker, {capture: true});
    li.addEventListener('mouseenter', placeFooterMarker, {capture: true});
  });
  footerMenu.addEventListener('mouseleave', hideFooterMarker);
  footerMarker.addEventListener('transitionend', leaveFooterMenu);

})();