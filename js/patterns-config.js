// js/patterns-config.js - Централизованная конфигурация и константы конструктора «Лекало»
// Выносит константы, анатомические формулы по умолчанию, типы изделий и коэффициенты для масштабируемости проекта

const PATTERNS_CONFIG = {
    // Единица масштабирования холста: 1 см = 10 мм
    CM: 10,

    // Печатные параметры сетки листов А4 для домашнего принтера
    A4_TILES: {
        PAGE_WIDTH_MM: 210,
        PAGE_HEIGHT_MM: 297,
        PRINTABLE_WIDTH_CM: 18.0,
        PRINTABLE_HEIGHT_CM: 26.7,
        TEST_SQUARE_SIZE_MM: 50, // Проверочный контрольный квадрат 50×50 мм
        MARGIN_OVERLAP_MM: 15
    },

    // Категории изделий конструктора
    GARMENT_CATEGORIES: {
        dress: {
            id: 'dress',
            name: 'Плечевые изделия',
            shortName: 'Плечевые',
            icon: 'sparkles',
            defaultStyle: 'sheath-classic',
            hasSleeveSupport: true
        },
        top: {
            id: 'top',
            name: 'Майки и Топы',
            shortName: 'Майки и Топы',
            icon: 'flame',
            defaultStyle: 'tank-top',
            hasSleeveSupport: true // Только для smart-tee
        },
        skirt: {
            id: 'skirt',
            name: 'Юбки и Шорты',
            shortName: 'Юбки и Шорты',
            icon: 'layers',
            defaultStyle: 'pencil',
            hasSleeveSupport: false
        },
        panties: {
            id: 'panties',
            name: 'Нижнее белье',
            shortName: 'Белье',
            icon: 'heart',
            defaultStyle: 'slips',
            hasSleeveSupport: false
        },
        corset: {
            id: 'corset',
            name: 'Образы и Корсеты',
            shortName: 'Образы и Корсеты',
            icon: 'crown',
            defaultStyle: 'underbust-corset',
            hasSleeveSupport: false
        }
    },

    // Константы и анатомические коэффициенты распределения сетки (ЦНИИШП / ЕМКО)
    ANATOMICAL_LIMITS: {
        MIN_ARMHOLE_WIDTH_CM: 8.5,
        MIN_ARMHOLE_RATIO_SG: 0.20,
        MIN_FRONT_BONE_RATIO: 0.20,
        MIN_BACK_BONE_RATIO: 0.22,
        BUST_DART_DEFAULT_OFFSET_CM: 1.5,
        SIDE_DART_DEFAULT_OFFSET_CM: 2.5
    },

    // Градации степеней прилегания (Fit Categories)
    FIT_CATEGORIES: {
        tight: { minEase: -10, maxEase: 3.9, label: 'Облегающий (бодикон)', color: '#f43f5e' },
        fitted: { minEase: 4.0, maxEase: 6.0, label: 'Прилегающий (по фигуре)', color: '#06b6d4' },
        semi: { minEase: 6.1, maxEase: 9.0, label: 'Полуприлегающий (комфорт)', color: '#10b981' },
        relaxed: { minEase: 9.1, maxEase: 14.0, label: 'Свободный (прямой)', color: '#6366f1' },
        oversize: { minEase: 14.1, maxEase: 30.0, label: 'Оверсайз (свободный крой)', color: '#8b5cf6' }
    },

    // Тканевые коэффициенты растяжимости (Negative Ease)
    STRETCH_COEFFICIENTS: {
        woven: 1.0,           // Неэластичные костюмные / хлопок / шелк
        lowStretch: 0.95,     // Ткани с добавлением 2-5% эластана
        mediumStretch: 0.90,  // Плотный трикотаж, джерси, кулирка
        highStretch: 0.85,    // Бифлекс, микрофибра, спортивный трикотаж
        extremeStretch: 0.78  // Эластичная сетка, стрейч-кружево
    },

    // Корсетная группа: параметры утяжки и фурнитуры
    CORSET_SPEC: {
        BONING_CHANNEL_WIDTH_MM: 8,
        BONING_PADDING_MM: 3,
        EYELETS_STEP_CM: 2.5,
        LACING_GAP_DEFAULT_CM: 4.0,
        DEFAULT_WAIST_REDUCTION_CM: 5.0
    }
};

if (typeof window !== 'undefined') {
    window.PATTERNS_CONFIG = PATTERNS_CONFIG;
}
