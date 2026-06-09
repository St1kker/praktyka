document.addEventListener('DOMContentLoaded', () => {

  // ==================== TOOLTIP ====================
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
    customClass: 'custom-tooltip'
  }));

  // ==================== TOAST ====================
  const favToast = document.getElementById('favToast');
  const toastMessage = document.getElementById('toastMessage');
  const toastEl = bootstrap.Toast.getOrCreateInstance(favToast);

  function showToast(message, type = 'add') {
    toastMessage.textContent = message;
    const icon = favToast.querySelector('svg');
    if (type === 'add') {
      icon.classList.remove('text-muted');
      icon.classList.add('text-danger');
    } else {
      icon.classList.remove('text-danger');
      icon.classList.add('text-muted');
    }
    toastEl.show();
  }

  // ==================== ИЗБРАННОЕ ====================
  let favorites = [];
  const favList = document.getElementById('favList');
  const favEmpty = document.getElementById('favEmpty');
  const favFooter = document.getElementById('favFooter');
  const favCount = document.getElementById('favCount');
  const favPanelCount = document.getElementById('favPanelCount');

  function updateFavCounter() {
    const count = favorites.length;
    favCount.textContent = count;
    favPanelCount.textContent = count;
    if (count > 0) {
      favCount.classList.add('show');
      favEmpty.classList.add('d-none');
      favFooter.classList.remove('d-none');
    } else {
      favCount.classList.remove('show');
      favEmpty.classList.remove('d-none');
      favFooter.classList.add('d-none');
    }
  }

  function renderFavorites() {
    favList.innerHTML = '';
    favorites.forEach(item => {
      const el = document.createElement('div');
      el.className = 'fav-item';
      el.innerHTML = `
        <div class="fav-item__image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="fav-item__info">
          <div class="fav-item__title">${item.title}</div>
          <div class="fav-item__price">${item.price}</div>
        </div>
        <button class="fav-item__remove" data-id="${item.id}" aria-label="Удалить из избранного">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      `;
      favList.appendChild(el);
    });

    // Удаление из избранного
    favList.querySelectorAll('.fav-item__remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        favorites = favorites.filter(f => f.id !== id);
        updateFavCounter();
        renderFavorites();
        showToast('Товар удалён из избранного', 'remove');
        // Сбросить лайк на карточке
        const cardLike = document.querySelector(`[data-product-id="${id}"] .product-card__like, [data-product-id="${id}"] .catalog-card__favorite, [data-product-id="${id}"] .product-card-promo__like`);
        if (cardLike) {
          cardLike.classList.remove('is-active', 'is-fav', 'is-liked');
        }
      });
    });
  }

  function addToFavorites(id, title, price, image) {
    if (!favorites.find(f => f.id === id)) {
      favorites.push({ id, title, price, image });
      updateFavCounter();
      renderFavorites();
      showToast('Товар добавлен в избранное', 'add');
    }
  }

  function removeFromFavorites(id) {
    favorites = favorites.filter(f => f.id !== id);
    updateFavCounter();
    renderFavorites();
    showToast('Товар удалён из избранного', 'remove');
  }

  // ==================== ЛАЙКИ (сердечки) — КАТАЛОГ ====================
  function initLikeButton(button) {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const isActive = this.classList.toggle('is-active');
      const col = this.closest('[data-product-id]');
      if (col) {
        const id = col.dataset.productId;
        const title = col.querySelector('h3').textContent.trim();
        const price = col.querySelector('strong').textContent.trim();
        const image = col.querySelector('.product-card__image img, .catalog-card__image img').src;
        if (isActive) {
          addToFavorites(id, title, price, image);
        } else {
          removeFromFavorites(id);
        }
      }
    });
  }
  document.querySelectorAll('.product-card__like').forEach(initLikeButton);

  // ==================== ЛАЙКИ — ПОПУЛЯРНОЕ ====================
  document.querySelectorAll('.catalog-card__favorite').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isFav = this.classList.toggle('is-fav');
      const col = this.closest('[data-product-id]');
      if (col) {
        const id = col.dataset.productId;
        const title = col.querySelector('h3').textContent.trim();
        const price = col.querySelector('strong').textContent.trim();
        const image = col.querySelector('.catalog-card__image img').src;
        if (isFav) {
          addToFavorites(id, title, price, image);
        } else {
          removeFromFavorites(id);
        }
      }
    });
  });

  // ==================== ЛАЙКИ — ПРОМО КАРТОЧКИ ====================
  document.querySelectorAll('.product-card-promo__like').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isLiked = this.classList.toggle('is-liked');
      const col = this.closest('[data-product-id]');
      if (col) {
        const id = col.dataset.productId;
        const title = col.querySelector('h3').textContent.trim();
        const price = col.querySelector('.product-card-promo__price').textContent.trim();
        const image = col.querySelector('.product-card-promo__image img').src;
        if (isLiked) {
          addToFavorites(id, title, price, image);
        } else {
          removeFromFavorites(id);
        }
      }
    });
  });

  // ==================== БУРГЕР МЕНЮ ====================
  const mobileMenu = document.getElementById('mobileMenu');
  const burgerBtn = document.querySelector('.burger-btn');

  if (mobileMenu && burgerBtn) {
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
        if (bsOffcanvas) bsOffcanvas.hide();
      });
    });

    mobileMenu.addEventListener('show.bs.offcanvas', () => {
      burgerBtn.setAttribute('aria-expanded', 'true');
    });
    mobileMenu.addEventListener('hide.bs.offcanvas', () => {
      burgerBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // ==================== STICKY HEADER ====================
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 10) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  // ==================== HERO SLIDER ====================
  const sliderWrapper = document.querySelector('.hero__slider-wrapper');
  if (sliderWrapper) {
    const slides = [
      {
        title: 'Лучшие товары<br>по оптимальной цене',
        promo: 'Скидки до 75%',
        link: 'За покупками',
        bg: 'linear-gradient(90deg, #423e7a 0%, #2b7cb9 48%, #31c9b3 100%)'
      },
      {
        title: 'Новинки сезона<br>уже в наличии',
        promo: 'Скидки до 50%',
        link: 'Смотреть новинки',
        bg: 'linear-gradient(90deg, #7c3e7a 0%, #b92b7c 48%, #c9315e 100%)'
      },
      {
        title: 'Здоровье семьи<br>начинается здесь',
        promo: 'Акции каждую неделю',
        link: 'В каталог',
        bg: 'linear-gradient(90deg, #3e7a5c 0%, #2bb97c 48%, #31c96b 100%)'
      },
      {
        title: 'Профессиональная<br>медицинская техника',
        promo: 'Специальные цены',
        link: 'Подробнее',
        bg: 'linear-gradient(90deg, #3e557a 0%, #2b7cb9 48%, #318dc9 100%)'
      },
      {
        title: 'Красота и фитнес<br>для каждого',
        promo: 'Новые поступления',
        link: 'Выбрать товары',
        bg: 'linear-gradient(90deg, #7a3e6e 0%, #b92b7c 48%, #c9318d 100%)'
      }
    ];

    let currentSlide = 1;
    let isAnimating = false;
    const dots = document.querySelectorAll('.hero__dot');
    const box = document.querySelector('.hero__box');
    const titleEl = document.querySelector('.hero__title');
    const promoEl = document.querySelector('.hero__promo-text');
    const linkEl = document.querySelector('.hero__shop-link');
    const leftArrow = document.querySelector('.hero__slider-arrow--left');
    const rightArrow = document.querySelector('.hero__slider-arrow--right');

    function updateSlide(index, direction = 'next') {
      if (isAnimating) return;
      isAnimating = true;

      const slide = slides[index];
      const contentEl = box.querySelector('.hero__content');
      const imagesEl = box.querySelector('.hero__images-container');

      const translateOut = direction === 'next' ? '-100%' : '100%';
      const translateIn = direction === 'next' ? '100%' : '-100%';

      contentEl.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      contentEl.style.transform = 'translateX(' + translateOut + ')';
      contentEl.style.opacity = '0';

      if (imagesEl) {
        imagesEl.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        imagesEl.style.transform = 'translateX(' + translateOut + ')';
        imagesEl.style.opacity = '0';
      }

      setTimeout(() => {
        box.style.transition = 'background 0.5s ease';
        box.style.background = slide.bg;

        titleEl.innerHTML = slide.title;
        promoEl.textContent = slide.promo;
        linkEl.textContent = slide.link + ' >';

        contentEl.style.transition = 'none';
        contentEl.style.transform = 'translateX(' + translateIn + ')';

        if (imagesEl) {
          imagesEl.style.transition = 'none';
          imagesEl.style.transform = 'translateX(' + translateIn + ')';
        }

        void box.offsetWidth;

        contentEl.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        contentEl.style.transform = 'translateX(0)';
        contentEl.style.opacity = '1';

        if (imagesEl) {
          imagesEl.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
          imagesEl.style.transform = 'translateX(0)';
          imagesEl.style.opacity = '1';
        }

        dots.forEach((dot, i) => {
          dot.classList.toggle('hero__dot--active', i === index);
        });

        currentSlide = index;

        setTimeout(() => { isAnimating = false; }, 500);
      }, 400);
    }

    function nextSlide() {
      const next = (currentSlide + 1) % slides.length;
      updateSlide(next, 'next');
    }

    function prevSlide() {
      const prev = (currentSlide - 1 + slides.length) % slides.length;
      updateSlide(prev, 'prev');
    }

    if (leftArrow) {
      leftArrow.addEventListener('click', (e) => { e.preventDefault(); prevSlide(); });
    }

    if (rightArrow) {
      rightArrow.addEventListener('click', (e) => { e.preventDefault(); nextSlide(); });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (index === currentSlide) return;
        const direction = index > currentSlide ? 'next' : 'prev';
        updateSlide(index, direction);
      });
    });

    let autoSlide = setInterval(nextSlide, 5000);

    sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoSlide));
    sliderWrapper.addEventListener('mouseleave', () => {
      autoSlide = setInterval(nextSlide, 5000);
    });

    let touchStartX = 0;
    let touchEndX = 0;

    sliderWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoSlide);
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) nextSlide();
      if (touchEndX > touchStartX + swipeThreshold) prevSlide();
      autoSlide = setInterval(nextSlide, 5000);
    }, { passive: true });
  }

  // ==================== КНОПКА "ПОКАЗАТЬ БОЛЬШЕ" — КАТАЛОГ ====================
  const showMoreBtn = document.getElementById('show-more-btn');
  const grid = document.querySelector('.products-grid');

  if (showMoreBtn && grid) {
    showMoreBtn.addEventListener('click', function() {
      grid.querySelectorAll('.product-card').forEach(card => {
        const clone = card.cloneNode(true);
        const likeBtn = clone.querySelector('.product-card__like');
        if (likeBtn) {
          likeBtn.classList.remove('is-active');
          initLikeButton(likeBtn);
        }
        grid.appendChild(clone);
      });
    });
  }

  // ==================== КНОПКА "ПОКАЗАТЬ ВСЕ АКЦИИ" ====================
  const showMorePromosBtn = document.getElementById('showMorePromos');
  if (showMorePromosBtn) {
    showMorePromosBtn.addEventListener('click', function() {
      document.querySelectorAll('.promo-card--hidden-wrapper').forEach(wrapper => {
        wrapper.classList.remove('d-none');
      });
      this.style.display = 'none';
    });
  }

  // ==================== КНОПКА "ВСЕ СТАТЬИ" ====================
  const articlesBtn = document.querySelector('.articles-btn-all');
  if (articlesBtn) {
    articlesBtn.addEventListener('click', function() {
      const articlesGrid = document.querySelector('.articles-grid');
      if (articlesGrid) {
        const newArticles = [
          {
            title: 'Перевязочные материалы',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Leo ac turpis nunc bibendum quam venenatis. Nunc amet, ullamcorper in nunc.',
            views: '892',
            img: './img/DSC_9115 10.png'
          },
          {
            title: 'Спортивная медицина',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Leo ac turpis nunc bibendum quam venenatis. Nunc amet, ullamcorper in nunc.',
            views: '567',
            img: './img/apetenta-pentru-sport 1.jpg'
          },
          {
            title: 'Реабилитация и восстановление',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Leo ac turpis nunc bibendum quam venenatis. Nunc amet, ullamcorper in nunc.',
            views: '1203',
            img: './img/zastavka-kreslo-koljaski 1.jpg'
          }
        ];

        newArticles.forEach(article => {
          const articleEl = document.createElement('div');
          articleEl.className = 'col article-card--new';
          articleEl.innerHTML = `
            <article class="card article-card border-0 h-100 flex-row overflow-hidden">
              <div class="card-body d-flex flex-column p-4" style="flex:1.3;">
                <h3 class="card-title fs-6 fw-bold text-uppercase">${article.title}</h3>
                <p class="card-text small text-muted">${article.text}</p>
                <a class="article-card__link fw-bold text-uppercase small text-dark mb-3" href="#">Читать &gt;</a>
                <div class="article-card__views mt-auto d-flex align-items-center gap-2">
                  <img src="./icons/eye 1.svg" alt="Просмотры" width="16">
                  <span class="small text-muted">${article.views}</span>
                </div>
              </div>
              <div class="article-card__image d-flex align-items-center justify-content-center" style="flex:0.9;">
                <img src="${article.img}" alt="${article.title}" class="img-fluid">
              </div>
            </article>
          `;
          articlesGrid.appendChild(articleEl);

          requestAnimationFrame(() => {
            articleEl.classList.add('article-card--visible');
          });
        });
      }
      this.style.display = 'none';
    });
  }

  // ==================== КНОПКА "ПОКАЗАТЬ БОЛЬШЕ" — ПОПУЛЯРНОЕ ====================
  const showMoreProductsBtn = document.getElementById('showMoreProducts');
  const productsGridFive = document.querySelector('.products-grid-five');

  if (showMoreProductsBtn && productsGridFive) {
    showMoreProductsBtn.addEventListener('click', function() {
      productsGridFive.querySelectorAll('.catalog-card').forEach(card => {
        const clone = card.cloneNode(true);
        const favBtn = clone.querySelector('.catalog-card__favorite');
        if (favBtn) {
          favBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('is-fav');
          });
        }
        productsGridFive.appendChild(clone);
      });
    });
  }

});