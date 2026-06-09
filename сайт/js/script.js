document.addEventListener('DOMContentLoaded', () => {

  // 1. ЛАЙКИ (сердечки)
  function initLikeButton(button) {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('is-active');
    });
  }

  document.querySelectorAll('.product-card__like').forEach(initLikeButton);

  // 2. БУРГЕР МЕНЮ
  const burger = document.getElementById('burger-btn');
  const catalog = document.querySelector('.header__catalog');

  let overlay = document.querySelector('.menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.classList.add('menu-overlay');
    document.body.appendChild(overlay);
  }

  function closeMenu() {
    if (burger) burger.classList.remove('is-active');
    if (catalog) catalog.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function openMenu() {
    if (burger) burger.classList.add('is-active');
    if (catalog) catalog.classList.add('is-open');
    if (overlay) overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  if (burger && catalog) {
    burger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (catalog.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (overlay) overlay.addEventListener('click', closeMenu);

  document.querySelectorAll('.header__catalog-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && catalog && catalog.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // 3. СТИКИ ХЕДЕР — тень при скролле + сворачивание промо
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

  // 4. СЛАЙДЕР HERO — ПЛАВНЫЙ
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

  // 5. КНОПКА "ПОКАЗАТЬ БОЛЬШЕ" — КАТАЛОГ
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

  // 6. КНОПКА "ПОКАЗАТЬ ВСЕ АКЦИИ"
  const showMorePromosBtn = document.getElementById('showMorePromos');
  if (showMorePromosBtn) {
    showMorePromosBtn.addEventListener('click', function() {
      document.querySelectorAll('.promo-card--hidden').forEach(card => {
        card.classList.remove('promo-card--hidden');
      });
      this.style.display = 'none';
    });
  }

  // 7. КНОПКА "ВСЕ СТАТЬИ"
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
          const articleEl = document.createElement('article');
          articleEl.className = 'article-card';
          articleEl.innerHTML = `
            <div class="article-card__content">
              <h3>${article.title}</h3>
              <p>${article.text}</p>
              <a class="article-card__link" href="#">Читать &gt;</a>
              <div class="article-card__views">
                <img src="./icons/eye 1.svg" alt="Просмотры" class="article-card__views-icon">
                <span class="article-card__views-count">${article.views}</span>
              </div>
            </div>
            <div class="article-card__image">
              <img src="${article.img}" alt="${article.title}">
            </div>
          `;
          articleEl.classList.add('article-card--new');
          articlesGrid.appendChild(articleEl);

          // Trigger animation
          requestAnimationFrame(() => {
            articleEl.classList.add('article-card--visible');
          });
        });
      }
      this.style.display = 'none';
    });
  }

  // 8. КНОПКА "ПОКАЗАТЬ БОЛЬШЕ" — ПОПУЛЯРНОЕ
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

  // 9. ТАБЫ ДОСТАВКИ
  const deliveryTabs = document.querySelectorAll('.delivery-tab');
  const deliveryPanel = document.querySelector('.delivery-panel');

  if (deliveryTabs.length && deliveryPanel) {
    const deliveryContent = {
      'Условия доставки': {
        lead: 'Мы работаем с разными форматами заказов: от небольших покупок до крупных комплектов. Ниже основные условия, которые помогут быстро сориентироваться.',
        cards: [
          { icon: '📍', title: 'Город', text: 'Доставка день в день прямо к вашему порогу.' },
          { icon: '🚚', title: 'Область', text: 'Доставка в регионы занимает от 1 до 2 рабочих дней.' },
          { icon: '🏪', title: 'Самовывоз', text: 'Бесплатное получение заказа в любом удобном пункте выдачи.' },
          { icon: '💳', title: 'Оплата', text: 'Принимаем как наличные средства, так и любые банковские карты.' },
          { icon: '📋', title: 'Подбор', text: 'Индивидуальная комплектация по вашей персональной заявке.' },
          { icon: '🔄', title: 'Возврат', text: 'Быстрое оформление возвратов по предварительной договоренности.' }
        ]
      },
      'Онлайн-заказ': {
        lead: 'Оформляйте заказы онлайн в любое время суток. Быстрое подтверждение и удобная оплата.',
        cards: [
          { icon: '📱', title: 'Сайт', text: 'Выбирайте товары на сайте и добавляйте в корзину.' },
          { icon: '💬', title: 'WhatsApp', text: 'Пишите нам в мессенджер для быстрого оформления.' },
          { icon: '📞', title: 'Телефон', text: 'Звоните по номеру 8 495 118-34-06 для заказа.' },
          { icon: '✉️', title: 'Email', text: 'Отправляйте заявки на hello@pashka.by' },
          { icon: '⏰', title: '24/7', text: 'Приём заказов круглосуточно без выходных.' },
          { icon: '⚡', title: 'Скорость', text: 'Обработка заказа в течение 15 минут.' }
        ]
      }
    };

    deliveryTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        deliveryTabs.forEach(t => t.classList.remove('delivery-tab--active'));
        this.classList.add('delivery-tab--active');

        const tabName = this.textContent.trim();
        const content = deliveryContent[tabName];

        if (content) {
          deliveryPanel.style.opacity = '0';

          setTimeout(() => {
            const leadEl = deliveryPanel.querySelector('.delivery__lead');
            if (leadEl) leadEl.textContent = content.lead;

            const gridEl = deliveryPanel.querySelector('.delivery-grid-layout');
            if (gridEl) {
              gridEl.innerHTML = content.cards.map(card => `
                <div class="delivery-grid-card">
                  <div class="delivery-grid-card__icon">${card.icon}</div>
                  <div class="delivery-grid-card__text">
                    <h3>${card.title}</h3>
                    <p>${card.text}</p>
                  </div>
                </div>
              `).join('');
            }

            deliveryPanel.style.opacity = '1';
          }, 200);
        }
      });
    });
  }

  // 10. ЛАЙКИ В ПОПУЛЯРНЫХ ТОВАРАХ
  document.querySelectorAll('.catalog-card__favorite').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('is-fav');
    });
  });

  // 11. ЛАЙКИ В ПРОМО КАРТОЧКАХ
  document.querySelectorAll('.product-card-promo__like').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('is-liked');
    });
  });

});