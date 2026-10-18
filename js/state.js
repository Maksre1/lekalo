// js/state.js - Состояние и конфигурация САПР
const CM = 10; // 1 см = 10 единиц SVG (1 мм)

const state = {
    // Размерные признаки (см)
    og: 92,        // Обхват груди (Ог)
    ot: 74,        // Обхват талии (От)
    ob: 98,        // Обхват бедер (Об)
    osh: 36,       // Обхват шеи (Ош)
    dts: 41.0,     // Длина спинки до талии (Дтс)
    dtp: 44.5,     // Длина переда до талии (Дтп)
    vg: 26.5,      // Высота груди от основания шеи (Вг)
    cg: 9.8,       // Центр груди (Цг - 1/2 расстояния между центрами)
    vb: 19.0,      // Высота бедер от линии талии (Вб)
    di: 62.0,      // Длина изделия по спинке (Ди)
    shp: 13.0,     // Длина плеча (Шп)
    op: 29.0,      // Обхват руки вверху (Оп)
    dr: 60.0,      // Длина рукава (Др)
    oz: 22.0,      // Ширина рукава внизу (Оз)

    // Прибавки на свободу (см к полуобхвату)
    pg: 4.0,       // Прибавка по груди (Пг)
    pt: 2.0,       // Прибавка по талии (Пт)
    pb: 2.0,       // Прибавка по бедрам (Пб)
    pspr: 2.5,     // Прибавка к глубине проймы / подмышки (Пспр)
    pop: 5.5,      // Прибавка к обхвату руки (Поп)

    // Осанка: 'normal' | 'stooped' | 'erect'
    posture: 'normal',

    // Моделирование фасонов
    dartPosition: 'shoulder', // 'shoulder' (в плечо) | 'side' (в боковой шов) | 'waist' (в талию) | 'armhole' (в пройму)
    necklineType: 'round',    // 'round' (круглая) | 'v-neck' (V-образная) | 'boat' (лодочка) | 'square' (каре) | 'keyhole' (капелька) | 'deep-v' (глубокое декольте)
    necklineDepth: 0,         // доп. углубление выреза горловины (см: 0..8)
    sleeveLengthType: 'long', // 'long' (длинный) | 'three-quarter' (3/4) | 'short' (короткий)
    silhouette: 'straight',   // 'straight' (прямой) | 'flare' (трапеция/клеш)

    // Тип конструируемого изделия: 'dress' (Платье/блуза/топ) | 'skirt' (Юбка) | 'panties' (Трусики)
    garmentType: 'dress',

    // Моделирование юбок
    skirtLength: 60,          // Длина юбки (см: 30..105)
    skirtStyle: 'a-line',     // 'mini-laceup' | 'mini-ruched' | 'mini-micro' | 'mini-trapeze' | 'mini-pleated' | 'mini-wrap' | 'mini-slit' | 'mini-skater' | 'a-line' | 'half-sun' | 'sun' | 'straight' | 'pencil'
    skirtRise: 'natural',     // 'natural' (на талии) | 'low' (на бедрах) | 'high' (высокая корсетная)
    skirtPt: 1.0,             // Прибавка по талии для юбки (см)
    skirtPb: 2.0,             // Прибавка по бедрам для юбки (см)

    // Моделирование женских трусиков
    pantiesModel: 'slips',    // 'slips' (Слипы) | 'braziliana' (Бразилиана) | 'high-waist' (Ретро) | 'thong' (Стринги) | 'dolphin-shorts' (Шорты Dolphin) | 'strappy' (Стрепы/V-waist)
    pantiesRise: 'mid',       // 'high' (высокая) | 'mid' (средняя) | 'low' (низкая)
    pantiesLegCut: 'classic', // 'classic' (классический) | 'high' (высокий французский)
    pantiesStretch: 0.90,     // Коэффициент растяжимости ткани (0.90 - трикотаж 10%, 0.85 - кружево 15%, 0.95 - хлопок 5%)

    // Параметры ткани и раскладки
    fabricWidth: 140,         // ширина полотна ткани (см: 110, 140, 150)
    fabricFold: true,         // раскрой в сгиб ткани (вдвое)
    fabricShrinkage: 5,       // запас на усадку при декотировании (%)

    // Опции отображения
    showSeamAllowance: false, // Припуски на швы (+1 см, +3 см низ)
    showA4Grid: false,        // Сетка листов А4
    showNotches: true,        // Контрольные надсечки
    showGrainline: true,      // Долевая нить и сгибы
    separate: false,          // Раздельный вид деталей
    showSleeve: true,         // Показать рукав
    classicStyle: false,      // Современный цветной / Черно-белый стиль
    showGrid: true,           // Буквенные точки и линии основы
    showFitHeatmap: false     // Подсветка степени прилегания (Heatmap)
};

// Конфигурация полей ввода с подробными человеческими подсказками
const inputConfig = {
    girths: [
        {
            key: 'og',
            label: 'Обхват груди',
            abbr: 'Ог',
            min: 76, max: 132, step: 1,
            hint: 'Измеряется горизонтально через самые выступающие точки груди и под подмышками.'
        },
        {
            key: 'ot',
            label: 'Обхват талии',
            abbr: 'От',
            min: 56, max: 120, step: 1,
            hint: 'Повяжите тонкую резинку на самом узком месте талии и измерьте лентой без натяжения.'
        },
        {
            key: 'ob',
            label: 'Обхват бедер',
            abbr: 'Об',
            min: 80, max: 138, step: 1,
            hint: 'Горизонтально по самым выступающим точкам ягодиц с учетом выступа живота.'
        },
        {
            key: 'osh',
            label: 'Обхват шеи',
            abbr: 'Ош',
            min: 30, max: 48, step: 0.5,
            hint: 'Вокруг основания шеи, лента проходит сзади над 7-м позвонком, спереди над яремной впадиной.'
        },
        {
            key: 'shp',
            label: 'Длина плеча',
            abbr: 'Шп',
            min: 10, max: 17, step: 0.2,
            hint: 'От основания шеи сбоку до косточки плечевого сустава.'
        }
    ],
    lengths: [
        {
            key: 'dts',
            label: 'Длина спинки до талии',
            abbr: 'Дтс',
            min: 36, max: 49, step: 0.5,
            hint: 'От выступающего 7-го шейного позвонка вдоль позвоночника вниз до линии талии.'
        },
        {
            key: 'dtp',
            label: 'Длина переда до талии',
            abbr: 'Дтп',
            min: 38, max: 55, step: 0.5,
            hint: 'От основания шеи у плеча через наивысшую точку груди вниз до линии талии.'
        },
        {
            key: 'vg',
            label: 'Высота груди',
            abbr: 'Вг',
            min: 21, max: 35, step: 0.5,
            hint: 'От основания шеи у плеча прямо вниз до самой выступающей точки груди.'
        },
        {
            key: 'cg',
            label: 'Центр груди',
            abbr: 'Цг',
            min: 8, max: 13.5, step: 0.2,
            hint: 'Половина расстояния между наивысшими точками грудных желез (сосками).'
        },
        {
            key: 'vb',
            label: 'Высота бедер',
            abbr: 'Вб',
            min: 16, max: 24, step: 0.5,
            hint: 'Расстояние сбоку от линии талии до линии максимальной ширины бедер (обычно 18–20 см).'
        },
        {
            key: 'di',
            label: 'Длина изделия',
            abbr: 'Ди',
            min: 48, max: 95, step: 1,
            hint: 'Желаемая длина изделия по центру спинки от 7-го позвонка вниз до низа (топ, блузка, платье).'
        }
    ],
    sleeve: [
        {
            key: 'op',
            label: 'Обхват руки вверху',
            abbr: 'Оп (бицепс)',
            min: 23, max: 44, step: 0.5,
            hint: 'Вокруг самой широкой части руки в области бицепса при свободно опущенной руке.'
        },
        {
            key: 'dr',
            label: 'Длина рукава',
            abbr: 'Др',
            min: 20, max: 70, step: 1,
            hint: 'От косточки плеча по слегка согнутой руке через локоть до запястья.'
        },
        {
            key: 'oz',
            label: 'Ширина рукава внизу',
            abbr: 'Оз',
            min: 16, max: 36, step: 0.5,
            hint: 'Обхват запястья с запасом для комфорта надевания и движения (обычно 20–24 см).'
        }
    ],
    ease: [
        {
            key: 'pg',
            label: 'Свобода по груди',
            abbr: 'Пг к 1/2',
            min: 1.5, max: 12, step: 0.5,
            hint: 'Прибавка к полуобхвату груди: 2–3 см (облегающий), 4–5 см (классика), 6–8 см (свободный).'
        },
        {
            key: 'pt',
            label: 'Свобода по талии',
            abbr: 'Пт к 1/2',
            min: 0.5, max: 10, step: 0.5,
            hint: 'Прибавка для комфорта дыхания и посадки по талии.'
        },
        {
            key: 'pb',
            label: 'Свобода по бедрам',
            abbr: 'Пб к 1/2',
            min: 0.5, max: 10, step: 0.5,
            hint: 'Прибавка к бедрам, чтобы подол не натягивался и не сковывал шаг.'
        },
        {
            key: 'pspr',
            label: 'Глубина подмышки',
            abbr: 'Пспр',
            min: 1.0, max: 7, step: 0.5,
            hint: 'Насколько опустить пройму вниз для свободы подъема рук (обычно 2–3 см).'
        },
        {
            key: 'pop',
            label: 'Свобода рукава',
            abbr: 'Поп',
            min: 2.0, max: 12, step: 0.5,
            hint: 'Прибавка к обхвату руки, чтобы рукав не жало и было удобно сгибать локоть.'
        }
    ]
};

// Типовые размеры ГОСТ (женская фигура 164-168 см)
const presets = {
    '42': { og: 84, ot: 66, ob: 90, osh: 34.5, dts: 39.5, dtp: 42.5, vg: 24.5, cg: 9.0, vb: 18.5, di: 60, shp: 12.3, op: 26.5, dr: 59, oz: 20 },
    '44': { og: 88, ot: 70, ob: 94, osh: 35.2, dts: 40.2, dtp: 43.5, vg: 25.5, cg: 9.4, vb: 19.0, di: 61, shp: 12.7, op: 27.5, dr: 59.5, oz: 21 },
    '46': { og: 92, ot: 74, ob: 98, osh: 36.0, dts: 41.0, dtp: 44.5, vg: 26.5, cg: 9.8, vb: 19.0, di: 62, shp: 13.0, op: 29.0, dr: 60, oz: 22 },
    '48': { og: 96, ot: 78, ob: 102, osh: 37.0, dts: 41.5, dtp: 45.5, vg: 27.5, cg: 10.2, vb: 19.5, di: 64, shp: 13.3, op: 30.5, dr: 60.5, oz: 23 },
    '50': { og: 100, ot: 82, ob: 106, osh: 38.0, dts: 42.0, dtp: 46.8, vg: 28.5, cg: 10.6, vb: 19.5, di: 65, shp: 13.5, op: 32.0, dr: 61, oz: 24 },
    '52': { og: 104, ot: 86, ob: 110, osh: 39.0, dts: 42.5, dtp: 47.5, vg: 29.5, cg: 11.0, vb: 20.0, di: 66, shp: 13.8, op: 33.5, dr: 61.5, oz: 25 },
    '54': { og: 108, ot: 92, ob: 114, osh: 40.0, dts: 43.0, dtp: 48.5, vg: 30.5, cg: 11.4, vb: 20.0, di: 68, shp: 14.0, op: 35.0, dr: 62, oz: 26 }
};

// Модуль надежного автосохранения мерок и настроек в браузере (LocalStorage)
const StorageManager = {
    STORAGE_KEY: 'lekalo_saved_measurements_v2',
    debounceTimer: null,

    save() {
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            try {
                const data = {
                    og: state.og,
                    ot: state.ot,
                    ob: state.ob,
                    osh: state.osh,
                    dts: state.dts,
                    dtp: state.dtp,
                    vg: state.vg,
                    cg: state.cg,
                    vb: state.vb,
                    di: state.di,
                    shp: state.shp,
                    op: state.op,
                    dr: state.dr,
                    oz: state.oz,
                    pg: state.pg,
                    pt: state.pt,
                    pb: state.pb,
                    pspr: state.pspr,
                    pop: state.pop,
                    posture: state.posture,
                    garmentType: state.garmentType,
                    skirtLength: state.skirtLength,
                    skirtStyle: state.skirtStyle,
                    skirtRise: state.skirtRise,
                    pantiesModel: state.pantiesModel,
                    pantiesRise: state.pantiesRise,
                    pantiesLegCut: state.pantiesLegCut,
                    pantiesStretch: state.pantiesStretch,
                    dartPosition: state.dartPosition,
                    necklineType: state.necklineType,
                    necklineDepth: state.necklineDepth,
                    sleeveLengthType: state.sleeveLengthType,
                    silhouette: state.silhouette,
                    timestamp: Date.now()
                };
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
                this.flashIndicator();
            } catch (err) {
                console.warn('Не удалось автосохранить мерки:', err);
            }
        }, 200);
    },

    load() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (!raw) return false;
            const data = JSON.parse(raw);
            if (data && typeof data === 'object') {
                Object.keys(data).forEach(key => {
                    if (key in state && key !== 'timestamp') {
                        state[key] = data[key];
                    }
                });
                return true;
            }
        } catch (err) {
            console.warn('Ошибка загрузки сохраненных мерок:', err);
        }
        return false;
    },

    flashIndicator() {
        const ind = document.getElementById('autosave-indicator');
        if (!ind) return;
        ind.classList.remove('opacity-0');
        ind.classList.add('opacity-100');
        setTimeout(() => {
            ind.classList.remove('opacity-100');
            ind.classList.add('opacity-0');
        }, 1600);
    }
};
