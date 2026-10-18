// js/onboarding-tour.js - Интерактивный путеводитель (Spotlight Tour) по «Лекало»

const OnboardingTour = {
    STORAGE_KEY: 'lekalo_onboarding_completed_v1',
    isActive: false,
    currentStep: 0,
    resizeTimer: null,

    steps: [
        {
            id: 'garment-selector',
            selector: '[data-tour="garment-selector"]',
            title: 'Выбор типа основы',
            desc: 'Переключайтесь между платьем/топом, юбкой и нижним бельем. Все формулы, прибавки и чертежи мгновенно перестраиваются под выбранную основу.',
            badge: 'Шаг 1 из 7',
            prepare: () => {
                // Всегда гарантируем видимость шапки
            }
        },
        {
            id: 'measures-tab',
            selector: '[data-tour="measures-tab"]',
            title: 'Индивидуальные мерки',
            desc: 'Вводите ваши точные параметры или выбирайте размеры ГОСТ. Поля «Шс» и «Шг» с меткой «Советуем» обеспечивают идеальную свободу в области груди.',
            badge: 'Шаг 2 из 7',
            prepare: () => {
                if (typeof setMobileView === 'function' && window.innerWidth < 768) {
                    setMobileView('sidebar');
                }
                if (typeof switchTab === 'function') {
                    switchTab('measures');
                }
            }
        },
        {
            id: 'style-tab',
            selector: '[data-tour="style-tab"]',
            title: 'Каталог фасонов и детали',
            desc: 'Выбирайте силуэт, форму выреза горловины, длину рукава и перевод нагрудной вытачки (в бок, талию или пройму) с наглядными фото-превью.',
            badge: 'Шаг 3 из 7',
            prepare: () => {
                if (typeof setMobileView === 'function' && window.innerWidth < 768) {
                    setMobileView('sidebar');
                }
                if (typeof switchTab === 'function') {
                    switchTab('style');
                }
            }
        },
        {
            id: 'fit-tab',
            selector: '[data-tour="fit-tab"]',
            title: 'Посадка, прибавки и осанка',
            desc: 'Регулируйте свободу облегания (прилегающий, умеренный, оверсайз) и тип осанки. Конструктор автоматически скорректирует баланс спинки и полочки.',
            badge: 'Шаг 4 из 7',
            prepare: () => {
                if (typeof setMobileView === 'function' && window.innerWidth < 768) {
                    setMobileView('sidebar');
                }
                if (typeof switchTab === 'function') {
                    switchTab('fit');
                }
            }
        },
        {
            id: 'canvas-toolbar',
            selector: '[data-tour="canvas-toolbar"]',
            title: 'Интерактивный чертёж 1:1',
            desc: 'Масштабируйте колесиком мыши, перемещайте чертеж левой кнопкой. Кнопка «Раздельный вид» раздвигает детали переда и спинки для контроля.',
            badge: 'Шаг 5 из 7',
            prepare: () => {
                if (typeof setMobileView === 'function' && window.innerWidth < 768) {
                    setMobileView('canvas');
                }
            }
        },
        {
            id: 'profile-menu',
            selector: '[data-tour="profile-menu"]',
            title: 'Сохранение мерок и профиль',
            desc: 'Все параметры сохраняются автоматически в браузере. В этом меню вы можете сохранить профиль, а также скачать мерки в JSON или загрузить с диска.',
            badge: 'Шаг 6 из 7',
            prepare: () => {
                if (typeof toggleProfilePopover === 'function') {
                    toggleProfilePopover(false);
                }
            }
        },
        {
            id: 'export-button',
            selector: '[data-tour="export-button"]',
            title: 'Печать и экспорт выкройки',
            desc: 'Скачивайте готовую выкройку в масштабе 1:1, разбитую на листы А4 с проверочным квадратом для домашнего принтера, плоттерный PDF или DXF/SVG.',
            badge: 'Шаг 7 из 7',
            prepare: () => {
                if (typeof closeExportModal === 'function') {
                    closeExportModal();
                }
            }
        }
    ],

    // Проверка первого визита и запуск приветственного окна
    checkFirstVisit() {
        try {
            const completed = localStorage.getItem(this.STORAGE_KEY);
            if (!completed) {
                setTimeout(() => {
                    this.showWelcomeModal();
                }, 600);
            }
        } catch (e) {
            console.warn('Storage access warning:', e);
        }
    },

    // Приветственное окно
    showWelcomeModal() {
        let modal = document.getElementById('tour-welcome-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'tour-welcome-modal';
            modal.className = 'fixed inset-0 z-50 bg-[#2C2825]/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300';
            modal.innerHTML = `
                <div class="bg-white rounded-3xl border border-[#F0ECE1] shadow-2xl max-w-md w-full p-6 sm:p-7 flex flex-col gap-5 transform transition-all duration-300 scale-95 opacity-0 font-sans" id="tour-welcome-card">
                    <!-- Заголовок и иконка -->
                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-2xl bg-[#FFF5F3] border border-[#FCDAD5] flex items-center justify-center text-[#E05A47] shrink-0 shadow-xs">
                                <i data-lucide="compass" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <h3 class="text-base sm:text-lg font-extrabold text-[#2C2825] leading-tight">Добро пожаловать в Лекало!</h3>
                                <p class="text-xs text-[#78716C] mt-0.5">Параметрический конструктор выкроек 1:1</p>
                            </div>
                        </div>
                        <button onclick="OnboardingTour.dismissWelcome(true)" class="text-[#A8A29E] hover:text-[#2C2825] p-1.5 rounded-xl hover:bg-[#FAF8F5] transition cursor-pointer">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <!-- Описание и ключевые фичи -->
                    <p class="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                        Постройте идеальную выкройку по вашей фигуре за пару минут. Пройдите короткое интерактивное знакомство с возможностями (займет всего 1 минуту).
                    </p>

                    <div class="space-y-2.5 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#F0ECE1]">
                        <div class="flex items-center gap-2.5 text-xs text-[#2C2825] font-semibold">
                            <span class="w-6 h-6 rounded-lg bg-[#FFF0ED] text-[#E05A47] flex items-center justify-center shrink-0 border border-[#FCDAD5]">
                                <i data-lucide="ruler" class="w-3.5 h-3.5"></i>
                            </span>
                            <span>Индивидуальные мерки с автобалансом ЦНИИШП</span>
                        </div>
                        <div class="flex items-center gap-2.5 text-xs text-[#2C2825] font-semibold">
                            <span class="w-6 h-6 rounded-lg bg-[#FFF0ED] text-[#E05A47] flex items-center justify-center shrink-0 border border-[#FCDAD5]">
                                <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                            </span>
                            <span>Моделирование силуэтов, вытачек и рукавов</span>
                        </div>
                        <div class="flex items-center gap-2.5 text-xs text-[#2C2825] font-semibold">
                            <span class="w-6 h-6 rounded-lg bg-[#FFF0ED] text-[#E05A47] flex items-center justify-center shrink-0 border border-[#FCDAD5]">
                                <i data-lucide="printer" class="w-3.5 h-3.5"></i>
                            </span>
                            <span>Готовые листы А4 для домашней печати и сборки</span>
                        </div>
                    </div>

                    <!-- Кнопки действий -->
                    <div class="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                        <button onclick="OnboardingTour.startFromWelcome()" class="w-full sm:flex-1 py-3 px-4 bg-[#E05A47] hover:bg-[#D04835] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer">
                            <i data-lucide="sparkles" class="w-4 h-4"></i>
                            <span>Начать обучение (1 мин)</span>
                        </button>
                        <button onclick="OnboardingTour.dismissWelcome(true)" class="w-full sm:w-auto py-3 px-4 bg-white hover:bg-[#FAF8F5] text-[#78716C] hover:text-[#2C2825] font-semibold text-xs rounded-xl border border-[#F0ECE1] transition cursor-pointer text-center">
                            Пропустить
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        modal.classList.remove('hidden');
        if (window.lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }

        setTimeout(() => {
            const card = document.getElementById('tour-welcome-card');
            if (card) {
                card.classList.remove('scale-95', 'opacity-0');
                card.classList.add('scale-100', 'opacity-100');
            }
        }, 20);
    },

    dismissWelcome(markAsCompleted = false) {
        const modal = document.getElementById('tour-welcome-modal');
        if (modal) {
            const card = document.getElementById('tour-welcome-card');
            if (card) {
                card.classList.remove('scale-100', 'opacity-100');
                card.classList.add('scale-95', 'opacity-0');
            }
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 250);
        }
        if (markAsCompleted) {
            try {
                localStorage.setItem(this.STORAGE_KEY, 'true');
            } catch (_) {}
        }
    },

    startFromWelcome() {
        this.dismissWelcome(false);
        setTimeout(() => {
            this.start(0);
        }, 150);
    },

    // Создание DOM элементов Spotlight оверлея
    ensureSpotlightElements() {
        let root = document.getElementById('tour-spotlight-root');
        if (!root) {
            root = document.createElement('div');
            root.id = 'tour-spotlight-root';
            root.className = 'fixed inset-0 pointer-events-none transition-opacity duration-300 opacity-0 z-[9990]';
            root.innerHTML = `
                <!-- SVG затемнение с динамическим круглым вырезом (Spotlight) -->
                <svg id="tour-spotlight-svg" class="fixed inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <mask id="tour-spotlight-mask">
                            <rect width="100%" height="100%" fill="white" />
                            <rect id="tour-spotlight-hole" x="0" y="0" width="0" height="0" rx="14" ry="14" fill="black" style="transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);" />
                        </mask>
                    </defs>
                    <rect width="100%" height="100%" fill="rgba(44, 40, 37, 0.65)" mask="url(#tour-spotlight-mask)" class="pointer-events-auto cursor-pointer" onclick="OnboardingTour.onBackdropClick()" />
                </svg>

                <!-- Тактильная пульсирующая рамка вокруг подсвечиваемого элемента -->
                <div id="tour-spotlight-ring" class="fixed pointer-events-none rounded-2xl border-2 border-[#E05A47] shadow-[0_0_0_4px_rgba(224,90,71,0.25),0_8px_24px_rgba(224,90,71,0.15)] z-[9995]" style="transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);"></div>

                <!-- Карточка-подсказка текущего шага -->
                <div id="tour-card" class="fixed z-[10000] pointer-events-auto bg-white rounded-2xl border border-[#F0ECE1] shadow-2xl p-5 w-[360px] max-w-[calc(100vw-32px)] flex flex-col gap-3 font-sans opacity-0 scale-95" style="transition: top 0.35s cubic-bezier(0.16, 1, 0.3, 1), left 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, transform 0.2s ease;">
                    <!-- Шапка карточки: бейдж шага и кнопка закрытия -->
                    <div class="flex items-center justify-between">
                        <span id="tour-card-badge" class="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FFF0ED] text-[#E05A47] border border-[#FCDAD5]">
                            Шаг 1 из 7
                        </span>
                        <button onclick="OnboardingTour.close()" class="w-6 h-6 flex items-center justify-center rounded-lg text-[#A8A29E] hover:text-[#2C2825] hover:bg-[#FAF8F5] transition cursor-pointer" aria-label="Закрыть">
                            <i data-lucide="x" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>

                    <!-- Заголовок и поясняющий текст -->
                    <div class="space-y-1">
                        <h4 id="tour-card-title" class="text-sm font-extrabold text-[#2C2825] flex items-center gap-1.5 leading-snug">
                            Заголовок
                        </h4>
                        <p id="tour-card-desc" class="text-xs text-[#57534E] leading-relaxed">
                            Описание действия
                        </p>
                    </div>

                    <!-- Навигация: Пропустить, Назад, Далее -->
                    <div class="flex items-center justify-between pt-2.5 border-t border-[#F0ECE1] mt-0.5">
                        <button onclick="OnboardingTour.skip()" class="text-xs text-[#78716C] hover:text-[#2C2825] font-medium transition cursor-pointer">
                            Пропустить
                        </button>
                        <div class="flex items-center gap-1.5">
                            <button id="tour-btn-prev" onclick="OnboardingTour.prev()" class="px-3 py-1.5 text-xs font-semibold rounded-xl text-[#78716C] bg-[#FAF8F5] hover:bg-[#F0ECE1] border border-[#F0ECE1] transition cursor-pointer">
                                Назад
                            </button>
                            <button id="tour-btn-next" onclick="OnboardingTour.next()" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#E05A47] hover:bg-[#D04835] text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer">
                                <span id="tour-btn-next-text">Далее</span>
                                <i id="tour-btn-next-icon" data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(root);
        }
        return root;
    },

    // Запуск тура
    start(stepIndex = 0) {
        this.isActive = true;
        this.currentStep = stepIndex;

        // Закрываем приветственное окно, если было открыто
        this.dismissWelcome(false);

        const root = this.ensureSpotlightElements();
        root.classList.remove('pointer-events-none', 'opacity-0');
        root.classList.add('pointer-events-auto', 'opacity-100');

        // Привязываем слушатели ресайза и клавиатуры
        this.bindEvents();

        this.goToStep(this.currentStep);
    },

    // Переход к конкретному шагу
    goToStep(index) {
        if (index < 0 || index >= this.steps.length) return;
        this.currentStep = index;
        const step = this.steps[index];

        // 1. Вызываем подготовительные действия (переключение вкладок, отображение сайдбара и т.д.)
        if (typeof step.prepare === 'function') {
            try {
                step.prepare();
            } catch (err) {
                console.warn('Step prepare error:', err);
            }
        }

        // Даем браузеру время обновить макет DOM (например, отобразить скрытую вкладку)
        setTimeout(() => {
            this.highlightElement(step);
        }, 120);
    },

    // Подсветка целевого элемента и позиционирование карточки
    highlightElement(step) {
        if (!this.isActive) return;

        const targetEl = document.querySelector(step.selector);
        if (!targetEl) {
            console.warn(`Tour target element not found: ${step.selector}`);
            // Если элемент не найден, пробуем перейти дальше или центрировать
            this.fallbackCenterCard(step);
            return;
        }

        // Скроллим к элементу, если он вне зоны видимости (например, внутри скроллируемого сайдбара)
        try {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        } catch (_) {}

        // После возможного скролла пересчитываем координаты
        setTimeout(() => {
            const rect = targetEl.getBoundingClientRect();
            const padding = 6;
            const x = Math.max(4, rect.left - padding);
            const y = Math.max(4, rect.top - padding);
            const w = Math.min(window.innerWidth - 8, rect.width + padding * 2);
            const h = Math.min(window.innerHeight - 8, rect.height + padding * 2);

            // Обновляем SVG вырез
            const hole = document.getElementById('tour-spotlight-hole');
            if (hole) {
                hole.setAttribute('x', x);
                hole.setAttribute('y', y);
                hole.setAttribute('width', w);
                hole.setAttribute('height', h);
            }

            // Обновляем рамку
            const ring = document.getElementById('tour-spotlight-ring');
            if (ring) {
                ring.style.display = 'block';
                ring.style.left = `${x}px`;
                ring.style.top = `${y}px`;
                ring.style.width = `${w}px`;
                ring.style.height = `${h}px`;
            }

            // Обновляем содержимое карточки
            this.updateCardContent(step, rect);
        }, 60);
    },

    // Фоллбэк, если элемент не найден
    fallbackCenterCard(step) {
        const hole = document.getElementById('tour-spotlight-hole');
        if (hole) {
            hole.setAttribute('x', window.innerWidth / 2);
            hole.setAttribute('y', window.innerHeight / 2);
            hole.setAttribute('width', 0);
            hole.setAttribute('height', 0);
        }
        const ring = document.getElementById('tour-spotlight-ring');
        if (ring) ring.style.display = 'none';

        this.updateCardContent(step, null);
    },

    // Обновление контента и положения карточки подсказки
    updateCardContent(step, targetRect) {
        const card = document.getElementById('tour-card');
        const badgeEl = document.getElementById('tour-card-badge');
        const titleEl = document.getElementById('tour-card-title');
        const descEl = document.getElementById('tour-card-desc');
        const btnPrev = document.getElementById('tour-btn-prev');
        const btnNextText = document.getElementById('tour-btn-next-text');

        if (!card) return;

        if (badgeEl) badgeEl.textContent = step.badge;
        if (titleEl) titleEl.innerHTML = `<i data-lucide="sparkles" class="w-4 h-4 text-[#E05A47]"></i><span>${step.title}</span>`;
        if (descEl) descEl.textContent = step.desc;

        // Кнопка Назад
        if (btnPrev) {
            if (this.currentStep === 0) {
                btnPrev.classList.add('hidden');
            } else {
                btnPrev.classList.remove('hidden');
            }
        }

        // Кнопка Далее / Готово
        const isLast = this.currentStep === this.steps.length - 1;
        if (btnNextText) {
            btnNextText.textContent = isLast ? 'Завершить' : 'Далее';
        }

        if (window.lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }

        // Расчет позиции карточки
        const cardWidth = Math.min(360, window.innerWidth - 32);
        const cardHeight = 200; // примерная высота

        let left = 16;
        let top = 16;

        if (targetRect) {
            // Приоритет 1: Снизу от элемента
            if (targetRect.bottom + cardHeight + 16 < window.innerHeight) {
                top = targetRect.bottom + 14;
                left = targetRect.left;
            }
            // Приоритет 2: Сверху от элемента
            else if (targetRect.top - cardHeight - 16 > 0) {
                top = targetRect.top - cardHeight - 14;
                left = targetRect.left;
            }
            // Приоритет 3: Справа от элемента
            else if (targetRect.right + cardWidth + 16 < window.innerWidth) {
                left = targetRect.right + 14;
                top = targetRect.top;
            }
            // Приоритет 4: Слева от элемента
            else if (targetRect.left - cardWidth - 16 > 0) {
                left = targetRect.left - cardWidth - 14;
                top = targetRect.top;
            } else {
                // Центрируем
                top = (window.innerHeight - cardHeight) / 2;
                left = (window.innerWidth - cardWidth) / 2;
            }
        } else {
            top = (window.innerHeight - cardHeight) / 2;
            left = (window.innerWidth - cardWidth) / 2;
        }

        // Ограничиваем экраном с отступами 16px
        left = Math.max(16, Math.min(left, window.innerWidth - cardWidth - 16));
        top = Math.max(16, Math.min(top, window.innerHeight - cardHeight - 16));

        card.style.left = `${left}px`;
        card.style.top = `${top}px`;

        card.classList.remove('opacity-0', 'scale-95');
        card.classList.add('opacity-100', 'scale-100');
    },

    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.goToStep(this.currentStep + 1);
        } else {
            this.finish();
        }
    },

    prev() {
        if (this.currentStep > 0) {
            this.goToStep(this.currentStep - 1);
        }
    },

    skip() {
        this.close();
        if (typeof showNotification === 'function') {
            showNotification('Обучение пропущено. Вы можете запустить его в любой момент из шапки.');
        }
    },

    finish() {
        this.close();
        if (typeof showNotification === 'function') {
            showNotification('Поздравляем! Вы познакомились с Конструктором Лекало 1:1 ✨');
        }
    },

    close() {
        this.isActive = false;
        try {
            localStorage.setItem(this.STORAGE_KEY, 'true');
        } catch (_) {}

        const root = document.getElementById('tour-spotlight-root');
        if (root) {
            root.classList.remove('opacity-100', 'pointer-events-auto');
            root.classList.add('opacity-0', 'pointer-events-none');
        }

        this.unbindEvents();
    },

    onBackdropClick() {
        // Мягкое покачивание карточки подсказки при клике на фон
        const card = document.getElementById('tour-card');
        if (card) {
            card.classList.add('scale-105');
            setTimeout(() => {
                card.classList.remove('scale-105');
            }, 180);
        }
    },

    reposition() {
        if (!this.isActive) return;
        const step = this.steps[this.currentStep];
        if (step) {
            this.highlightElement(step);
        }
    },

    bindEvents() {
        this._onResize = () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.reposition(), 80);
        };
        this._onKeydown = (e) => {
            if (!this.isActive) return;
            if (e.key === 'Escape') {
                this.close();
            } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
                this.next();
            } else if (e.key === 'ArrowLeft') {
                this.prev();
            }
        };

        window.addEventListener('resize', this._onResize);
        window.addEventListener('keydown', this._onKeydown);
    },

    unbindEvents() {
        if (this._onResize) window.removeEventListener('resize', this._onResize);
        if (this._onKeydown) window.removeEventListener('keydown', this._onKeydown);
    }
};

// Глобальная функция для ручного запуска из интерфейса
function startOnboardingTour() {
    OnboardingTour.start(0);
}

if (typeof window !== 'undefined') {
    window.OnboardingTour = OnboardingTour;
    window.startOnboardingTour = startOnboardingTour;
}

