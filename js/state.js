// js/state.js - Состояние и конфигурация конструктора выкроек
const CM = 10; // 1 см = 10 единиц SVG (1 мм)

const state = {
    // Размерные признаки (см)
    og: 92,        // Обхват груди (Ог)
    ot: 75,        // Обхват талии (От)
    ob: 96,        // Обхват бедер (Об)
    osh: 36,       // Обхват шеи (Ош)
    dts: 40.0,     // Длина спинки до талии (Дтс)
    dtp: 44.0,     // Длина переда до талии (Дтп: 44 см от точки основания шеи у плеча)
    vg: 27.0,      // Высота груди от основания шеи (Вг)
    cg: 10.0,      // Центр груди (Цг - 1/2 расстояния между центрами)
    vb: 18.5,      // Высота бедер от линии талии (Вб)
    di: 95.0,      // Длина изделия по спинке (Ди)
    shp: 13.0,     // Длина плеча (Шп)
    shs: null,     // Ширина спинки (Шс - опционально, авторасчет)
    shg: null,     // Ширина груди (Шг - опционально, авторасчет)
    vpk: null,     // Высота плеча косая (Впк - опционально, авторасчет)
    gpr: null,     // Глубина проймы (Гпр - опционально, авторасчет)
    op: 32.5,      // Обхват руки вверху (Оп)
    dr: 61.0,      // Длина рукава (Др)
    dr_l: null,    // Длина до локтя (Др.л - опционально, авторасчет)
    oz: null,      // Обхват запястья (Оз - опционально, авторасчет)

    // Прибавки на свободу (см к полуобхвату)
    pg: 4.0,       // Прибавка по груди (Пг)
    pt: 2.0,       // Прибавка по талии (Пт)
    pb: 2.0,       // Прибавка по бедрам (Пб)
    pspr: 2.5,     // Прибавка к глубине проймы / подмышки (Пспр)
    pop: 5.5,      // Прибавка к обхвату руки (Поп)

    // Осанка: 'normal' | 'stooped' | 'erect'
    posture: 'normal',

    // Моделирование фасонов
    dressStyle: 'dress-sheath', // 'dress-sheath' | 'dress-business' | 'dress-relief' | 'dress-cocktail-v' | 'dress-keyhole' | 'dress-deep-v' | 'dress-trapeze' | 'dress-tunic' | 'dress-flare-midi'
    dartPosition: 'side',     // 'shoulder' (в плечо) | 'side' (в боковой шов) | 'waist' (в талию) | 'armhole' (в пройму)
    necklineType: 'round',    // 'round' (круглая) | 'v-neck' (V-образная) | 'boat' (лодочка) | 'square' (каре) | 'keyhole' (капелька) | 'deep-v' (глубокое декольте)
    necklineDepth: 0,         // доп. углубление выреза горловины (см: 0..8)
    sleeveLengthType: 'three-quarter', // 'long' (длинный) | 'three-quarter' (3/4) | 'short' (короткий)
    silhouette: 'straight',   // 'straight' (прямой) | 'flare' (трапеция/клеш)

    // Тип конструируемого изделия: 'dress' (Платье/блуза) | 'top' (Майки и топы) | 'skirt' (Юбка) | 'panties' (Белье/трусики)
    garmentType: 'dress',

    // Моделирование маек и топов
    topStyle: 'tank-top',       // 'tank-top' | 'smart-tee' | 'oversize-tee' | 'asymmetric-tee' | 'ruched-baby-tee' | 'underboob-crop-tee' | 'cutout-laceup-tee' | 'backless-mesh-tee' | 'racerback' | 'halter-top' | 'camisole' | 'bustier-crop' | 'low-back' | 'open-cup' | 'plunging-mesh' | 'strappy-cage' | 'o-ring-top'
    topLengthType: 'hip',       // 'crop' (под грудь/ребра) | 'waist' (до талии) | 'hip' (до бедер) | 'long' (удлиненный)
    topAntiRideup: true,        // Система «Анти-задир» (дугообразное удлинение низа переда)
    topElasticStretch: 0.82,    // Коэффициент натяжения эластичных лент / резинок (0.80–0.85)
    topUnderbustFit: -3.0,      // Отрицательная прибавка под грудью (см)

    // Моделирование юбок
    skirtLength: 60,          // Длина юбки (см: 30..105)
    skirtStyle: 'a-line',     // 'mini-laceup' | 'mini-ruched' | 'mini-micro' | 'mini-trapeze' | 'mini-pleated' | 'mini-wrap' | 'mini-slit' | 'mini-skater' | 'a-line' | 'half-sun' | 'sun' | 'straight' | 'pencil'
    skirtRise: 'natural',     // 'natural' (на талии) | 'low' (на бедрах) | 'high' (высокая корсетная)
    skirtPt: 1.0,             // Прибавка по талии для юбки (см)
    skirtPb: 2.0,             // Прибавка по бедрам для юбки (см)
    skirtVb: null,            // Высота бедер юбки (Вб - опционально, авторасчет)
    skirtBalance: 0.0,        // Баланс талии юбки (см: -3.0..+3.0, авто = 0)

    // Моделирование женских трусиков
    pantiesModel: 'slips',    // 'slips' (Слипы) | 'braziliana' (Бразилиана) | 'high-waist' (Ретро) | 'thong' (Стринги) | 'dolphin-shorts' (Шорты Dolphin) | 'strappy' (Стрепы/V-waist)
    pantiesRise: 'mid',       // 'high' (высокая) | 'mid' (средняя) | 'low' (низкая)
    pantiesLegCut: 'classic', // 'classic' (классический) | 'high' (высокий французский)
    pantiesStretch: 0.90,     // Коэффициент растяжимости ткани (0.90 - трикотаж 10%, 0.85 - кружево 15%, 0.95 - хлопок 5%)

    // Моделирование корсетов и сценических образов
    corsetStyle: 'underbust-corset', // 'underbust-corset' | 'waspie-belt' | 'boudoir-kimono' | 'bell-peignoir' | 'super-crop-shrug' | 'lounge-romper' | 'french-maid-apron'
    corsetReduction: 5.0,            // Утяжка талии корсета (см: 3..8, базовая От - 5 см)
    corsetHeight: 28.0,              // Высота корсета по центру переда (см)
    shrugWithHood: true,             // Болеро: включить выкройку капюшона (Hoodie)
    zeroWasteAccessories: false,     // Бонус: раскрой комплекта аксессуаров (митенки, гетры, чокер+подвязка) на свободных выпадах ткани
    apronRuffleGather: 1.8,          // Коэффициент сборки оборок передника (1.8 - 2.0x)

    // Инженерный конструктор деталей и трансформация (Киллер-фичи)
    vCutWaist: false,         // Посадка пояса «V-Cut» (галочка спереди для комфорта в сидячих позах на стримах)
    vCutDepth: 5.0,           // Глубина выреза галочки V-Cut (см: 4..7)
    scrunchEffect: false,     // Эффект «Scrunch» (сборка среднего шва ягодиц на эластичную резинку 1.5x)
    quickRelease: false,      // Опция «Быстрое снятие» (разъем по центру переда/спинки с припуском 1.8 см)
    gussetType: 'classic',    // Конструкция ластовицы: 'classic' (цельная) | 'buttons' (на кнопках) | 'frame' (открытая рамка)
    bodysuitStretchVertical: 0.90, // Коэффициент продольной растяжимости торса для боди

    // Параметры ткани и раскладки
    fabricWidth: 140,         // ширина полотна ткани (см: 110, 140, 150)
    fabricFold: true,         // раскрой в сгиб ткани (вдвое)
    fabricShrinkage: 5,       // запас на усадку при декотировании (%)

    // Опции отображения
    showSeamAllowance: false, // Припуски на швы (+1 см, +3 см низ)
    showA4Grid: false,        // Сетка листов А4
    showNotches: true,        // Контрольные надсечки
    showGrainline: true,      // Долевая нить и сгибы
    separate: true,          // Раздельный вид деталей (по умолчанию спинка и полочка раздвинуты)
    showSleeve: true,         // Показать рукав
    classicStyle: false,      // Современный цветной / Черно-белый стиль
    showGrid: true,           // Буквенные точки и линии основы
    showFitHeatmap: false     // Подсветка степени прилегания (Heatmap)
};
window.state = state;

// Модуль пропорционального авторасчета дополнительных мерок (Smart Auto)
const AutoMeasurements = {
    shs(s = state) {
        const Sg = (Number(s.og) || 92) / 2;
        return Math.round(((Sg / 3) + 2.1) * 2 * 10) / 10;
    },
    shg(s = state) {
        const Sg = (Number(s.og) || 92) / 2;
        return Math.round((Sg - 13.0) * 10) / 10;
    },
    vpk(s = state) {
        const dts = Number(s.dts) || 40.0;
        const shs = s.shs ? Number(s.shs) : AutoMeasurements.shs(s);
        const shDrop = s.posture === 'stooped' ? 2.6 : s.posture === 'erect' ? 1.9 : 2.2;
        const xP1 = (shs / 2) + 1.5;
        const yDist = dts - shDrop;
        return Math.round(Math.hypot(xP1, yDist) * 10) / 10;
    },
    gpr(s = state) {
        const Sg = (Number(s.og) || 92) / 2;
        return Math.round((0.28 * Sg + 5.5) * 10) / 10;
    },
    dr_l(s = state) {
        const dr = Number(s.dr) || 61.0;
        return Math.round((dr * 0.56) * 10) / 10;
    },
    oz(s = state) {
        const op = Number(s.op) || 32.5;
        return Math.round((op * 0.51) * 10) / 10;
    },
    skirtVb(s = state) {
        return Number(s.vb) || 19.5;
    },
    skirtBalance(s = state) {
        return 0.0;
    },

    get(key, s = state) {
        if (typeof this[key] === 'function') {
            return this[key](s);
        }
        return null;
    },

    isAuto(key, s = state) {
        if (key === 'skirtBalance') {
            return s[key] === null || s[key] === undefined || s[key] === '' || Number(s[key]) === 0;
        }
        return s[key] === null || s[key] === undefined || s[key] === '';
    },

    getEffective(key, s = state) {
        if (!this.isAuto(key, s)) {
            return Number(s[key]);
        }
        return this.get(key, s);
    }
};
if (typeof window !== 'undefined') {
    window.AutoMeasurements = AutoMeasurements;
}

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
            key: 'shs',
            label: 'Ширина спинки',
            abbr: 'Шс',
            min: 28, max: 48, step: 0.5,
            optional: true,
            isSmartAuto: true,
            recommended: true,
            placeholder: 'Авто',
            hint: 'Необязательно. Замер лентой по выступающим лопаткам (например, 35 см). При заполнении точно подгоняет спинку и убирает сдавливание груди.'
        },
        {
            key: 'shg',
            label: 'Ширина груди',
            abbr: 'Шг',
            min: 26, max: 46, step: 0.5,
            optional: true,
            isSmartAuto: true,
            recommended: true,
            placeholder: 'Авто',
            hint: 'Необязательно. Замер лентой над грудью между углами подмышек (например, 33 см). Настраивает идеальный раствор вытачки и объем чашки груди.'
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
        },
        {
            key: 'vpk',
            label: 'Высота плеча косая',
            abbr: 'Впк',
            min: 36, max: 54, step: 0.5,
            isSmartAuto: true,
            optional: true,
            hint: 'От точки пересечения линии талии с позвоночником через лопатку до крайней плечевой точки (косточки). Задает точный угол наклона плеча.'
        },
        {
            key: 'gpr',
            label: 'Глубина проймы',
            abbr: 'Гпр',
            min: 14, max: 28, step: 0.5,
            isSmartAuto: true,
            optional: true,
            hint: 'От 7-го шейного позвонка по спине вертикально вниз до уровня подмышки. Регулирует высоту проймы под рукой.'
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
            key: 'dr_l',
            label: 'Длина до локтя',
            abbr: 'Др.л',
            min: 24, max: 42, step: 0.5,
            isSmartAuto: true,
            optional: true,
            hint: 'От косточки плеча по слегка согнутой руке до выступающей точки локтя. Задает уровень локтя для правильного сужения рукава.'
        },
        {
            key: 'oz',
            label: 'Обхват запястья',
            abbr: 'Оз',
            min: 13, max: 24, step: 0.5,
            isSmartAuto: true,
            optional: true,
            hint: 'Вокруг запястья по выступающим косточкам. Автоматически рассчитывает комфортную ширину низа рукава (Шрн).'
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

// Типовые размеры ГОСТ и персональный пресет
const presets = {
    'my': { og: 92, ot: 75, ob: 96, osh: 36.0, dts: 40.0, dtp: 44.0, vg: 27.0, cg: 10.0, vb: 18.5, di: 95.0, shp: 13.0, shs: null, shg: null, vpk: null, gpr: null, op: 32.5, dr: 61.0, dr_l: null, oz: null, skirtVb: null, skirtBalance: 0.0 },
    '42': { og: 84, ot: 66, ob: 90, osh: 34.5, dts: 39.5, dtp: 42.5, vg: 24.5, cg: 9.0, vb: 18.5, di: 60, shp: 12.3, shs: null, shg: null, vpk: null, gpr: null, op: 26.5, dr: 59, dr_l: null, oz: null, skirtVb: null, skirtBalance: 0.0 },
    '44': { og: 88, ot: 70, ob: 94, osh: 35.2, dts: 40.2, dtp: 43.5, vg: 25.5, cg: 9.4, vb: 19.0, di: 61, shp: 12.7, shs: null, shg: null, vpk: null, gpr: null, op: 27.5, dr: 59.5, dr_l: null, oz: null, skirtVb: null, skirtBalance: 0.0 },
    '46': { og: 92, ot: 74, ob: 98, osh: 36.0, dts: 41.0, dtp: 44.5, vg: 26.5, cg: 9.8, vb: 19.0, di: 62, shp: 13.0, shs: null, shg: null, vpk: null, gpr: null, op: 29.0, dr: 60, dr_l: null, oz: null, skirtVb: null, skirtBalance: 0.0 },
    '48': { og: 96, ot: 78, ob: 102, osh: 37.0, dts: 41.5, dtp: 45.5, vg: 27.5, cg: 10.2, vb: 19.5, di: 64, shp: 13.3, shs: null, shg: null, vpk: null, gpr: null, op: 30.5, dr: 60.5, dr_l: null, oz: null, skirtVb: null, skirtBalance: 0.0 },
    '50': { og: 100, ot: 82, ob: 106, osh: 38.0, dts: 42.0, dtp: 46.8, vg: 28.5, cg: 10.6, vb: 19.5, di: 65, shp: 13.5, shs: null, shg: null, vpk: null, gpr: null, op: 32.0, dr: 61, dr_l: null, oz: null, skirtVb: null, skirtBalance: 0.0 },
    '52': { og: 104, ot: 86, ob: 110, osh: 39.0, dts: 42.5, dtp: 47.5, vg: 29.5, cg: 11.0, vb: 20.0, di: 66, shp: 13.8, shs: null, shg: null, vpk: null, gpr: null, op: 33.5, dr: 61.5, dr_l: null, oz: null, skirtVb: null, skirtBalance: 0.0 },
    '54': { og: 108, ot: 92, ob: 114, osh: 40.0, dts: 43.0, dtp: 48.5, vg: 30.5, cg: 11.4, vb: 20.0, di: 68, shp: 14.0, shs: null, shg: null, vpk: null, gpr: null, op: 35.0, dr: 62, dr_l: null, oz: null, skirtVb: null, skirtBalance: 0.0 }
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
                    shs: state.shs,
                    shg: state.shg,
                    vpk: state.vpk,
                    gpr: state.gpr,
                    op: state.op,
                    dr: state.dr,
                    dr_l: state.dr_l,
                    oz: state.oz,
                    pg: state.pg,
                    pt: state.pt,
                    pb: state.pb,
                    pspr: state.pspr,
                    pop: state.pop,
                    skirtVb: state.skirtVb,
                    skirtBalance: state.skirtBalance,
                    posture: state.posture,
                    garmentType: state.garmentType,
                    skirtLength: state.skirtLength,
                    skirtStyle: state.skirtStyle,
                    skirtRise: state.skirtRise,
                    pantiesModel: state.pantiesModel,
                    pantiesRise: state.pantiesRise,
                    pantiesLegCut: state.pantiesLegCut,
                    pantiesStretch: state.pantiesStretch,
                    topStyle: state.topStyle,
                    topLengthType: state.topLengthType,
                    topAntiRideup: state.topAntiRideup,
                    topElasticStretch: state.topElasticStretch,
                    topUnderbustFit: state.topUnderbustFit,
                    dressStyle: state.dressStyle,
                    dartPosition: state.dartPosition,
                    necklineType: state.necklineType,
                    necklineDepth: state.necklineDepth,
                    sleeveLengthType: state.sleeveLengthType,
                    silhouette: state.silhouette,
                    vCutWaist: state.vCutWaist,
                    vCutDepth: state.vCutDepth,
                    scrunchEffect: state.scrunchEffect,
                    quickRelease: state.quickRelease,
                    gussetType: state.gussetType,
                    bodysuitStretchVertical: state.bodysuitStretchVertical,
                    corsetStyle: state.corsetStyle,
                    corsetReduction: state.corsetReduction,
                    shrugWithHood: state.shrugWithHood,
                    zeroWasteAccessories: state.zeroWasteAccessories,
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
