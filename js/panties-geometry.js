// js/panties-geometry.js - Конструирование женских трусиков (Нижнее белье)
// Поддерживает: Слипы (базовые), Бразилиана (кокетливый V-вырез сзади), Высокие ретро, Стринги

function calculatePantiesGeometry() {
    const ob = Number(state.ob) || 98;
    const ot = Number(state.ot) || 74;
    const model = state.pantiesModel || 'slips';
    const rise = state.pantiesRise || 'mid';
    const legCut = state.pantiesLegCut || 'classic';
    const stretch = Number(state.pantiesStretch) || 0.90; // коэффициент растяжимости ткани

    // Расчетные обхваты с учетом эластичности трикотажа / кружева
    const obCalc = ob * stretch;
    const otCalc = ot * stretch;

    // Высота детали от линии верха до ластовицы
    let frontHeight = 22.0; // см
    let backHeight = 23.5;  // спинка чуть глубже для анатомии ягодиц
    let sideSeam = 6.5;     // длина бокового шва (см)

    if (rise === 'high') {
        frontHeight = 28.0;
        backHeight = 30.0;
        sideSeam = 12.0;
    } else if (rise === 'low') {
        frontHeight = 17.5;
        backHeight = 19.0;
        sideSeam = 3.5;
    }

    if (model === 'braziliana') {
        sideSeam = Math.min(sideSeam, 4.5);
    } else if (model === 'thong') {
        sideSeam = Math.min(sideSeam, 3.0);
    } else if (model === 'strappy') {
        sideSeam = 2.0; // ультра-узкий бок под эластичные стрепы
    } else if (model === 'dolphin-shorts') {
        frontHeight += 3.5;
        backHeight += 3.5;
        sideSeam = 8.0;
    }

    // Ширина верха переда (половина со сгибом)
    const frontTopHalfW = (obCalc / 4) * (model === 'dolphin-shorts' ? 1.05 : 0.88);
    // Ширина верха спинки (половина со сгибом)
    const backTopHalfW = (obCalc / 4) * (model === 'dolphin-shorts' ? 1.10 : 0.94);

    // Размеры ластовицы (половина со сгибом)
    const gussetLen = 12.0;
    const gussetFrontHalfW = 3.2; // полная 6.4 см
    const gussetBackHalfW = 3.9;  // полная 7.8 см

    // Точки передней детали (Front) - сгиб по X = 0
    const F_top_center = { x: 0, y: model === 'dolphin-shorts' ? 0 : 1.2 };
    const F_top_side = { x: frontTopHalfW, y: 0 };
    const F_bot_side = { x: frontTopHalfW - (frontHeight - sideSeam) * 0.22, y: sideSeam };
    const F_gusset_join = { x: gussetFrontHalfW, y: frontHeight };
    const F_gusset_center = { x: 0, y: frontHeight };

    // Точки выреза ноги переда (контрольные точки Безье)
    const legDepthMult = (legCut === 'high' ? 0.35 : (model === 'dolphin-shorts' ? 0.70 : 0.50));
    const F_leg_ctrl1 = {
        x: F_bot_side.x * (model === 'dolphin-shorts' ? 0.90 : 0.55),
        y: F_bot_side.y + (frontHeight - F_bot_side.y) * 0.35
    };
    const F_leg_ctrl2 = {
        x: gussetFrontHalfW + (F_bot_side.x - gussetFrontHalfW) * legDepthMult,
        y: frontHeight - (model === 'dolphin-shorts' ? 1.0 : 2.5)
    };

    // Точки задней детали (Back) - сгиб по X = 0
    const B_top_center = { x: 0, y: model === 'dolphin-shorts' ? 0 : -0.8 };
    const B_top_side = { x: backTopHalfW, y: 0 };
    const B_bot_side = { x: backTopHalfW - (backHeight - sideSeam) * 0.20, y: sideSeam };
    const B_gusset_join = { x: gussetBackHalfW, y: backHeight };
    const B_gusset_center = { x: 0, y: backHeight };

    // Оформление выреза спинки в зависимости от модели
    let B_leg_ctrl1, B_leg_ctrl2;
    if (model === 'braziliana' || model === 'strappy') {
        // V-образный дерзкий вырез Бразилиана / Стрепы
        B_leg_ctrl1 = {
            x: B_bot_side.x * 0.28,
            y: B_bot_side.y + (backHeight - B_bot_side.y) * 0.58
        };
        B_leg_ctrl2 = {
            x: gussetBackHalfW + 0.8,
            y: backHeight - 1.5
        };
    } else if (model === 'thong') {
        // Стринги: узкая спинка
        B_leg_ctrl1 = { x: 1.8, y: B_bot_side.y + 4.0 };
        B_leg_ctrl2 = { x: 1.5, y: backHeight - 2.0 };
    } else if (model === 'dolphin-shorts') {
        // Округлый вырез шортиков Dolphin
        B_leg_ctrl1 = {
            x: B_bot_side.x * 0.95,
            y: B_bot_side.y + (backHeight - B_bot_side.y) * 0.30
        };
        B_leg_ctrl2 = {
            x: gussetBackHalfW + (B_bot_side.x - gussetBackHalfW) * 0.65,
            y: backHeight - 0.5
        };
    } else {
        // Слипы (классика): плавная линия, закрывающая ягодицу
        B_leg_ctrl1 = {
            x: B_bot_side.x * 0.85,
            y: B_bot_side.y + (backHeight - B_bot_side.y) * 0.40
        };
        B_leg_ctrl2 = {
            x: gussetBackHalfW + (B_bot_side.x - gussetBackHalfW) * 0.45,
            y: backHeight - 1.0
        };
    }

    // Точки ластовицы (Gusset)
    const G_front_center = { x: 0, y: 0 };
    const G_front_side = { x: gussetFrontHalfW, y: 0 };
    const G_back_side = { x: gussetBackHalfW, y: gussetLen };
    const G_back_center = { x: 0, y: gussetLen };
    const G_waist_curve = { x: Math.min(gussetFrontHalfW, gussetBackHalfW) - 0.4, y: gussetLen / 2 };

    return {
        type: 'panties',
        model, rise, legCut, stretch,
        ob, ot, obCalc, otCalc,
        frontHeight, backHeight, sideSeam,
        frontTopHalfW, backTopHalfW,
        gussetLen, gussetFrontHalfW, gussetBackHalfW,
        // Точки переда
        F_top_center, F_top_side, F_bot_side, F_gusset_join, F_gusset_center,
        F_leg_ctrl1, F_leg_ctrl2,
        // Точки спинки
        B_top_center, B_top_side, B_bot_side, B_gusset_join, B_gusset_center,
        B_leg_ctrl1, B_leg_ctrl2,
        // Точки ластовицы
        G_front_center, G_front_side, G_back_side, G_back_center, G_waist_curve,
        // Габариты
        widthCm: Math.ceil(frontTopHalfW + backTopHalfW + gussetBackHalfW + 16),
        heightCm: Math.ceil(Math.max(frontHeight, backHeight) + 12)
    };
}

// Генерация SVG разметки для женских трусиков
function generatePantiesPiecesMarkup(g, options = {}) {
    const showClassic = options.showClassic ?? state.classicStyle;
    const colFront = showClassic ? '#09090b' : '#be123c';
    const colBack = showClassic ? '#09090b' : '#4338ca';
    const colGusset = showClassic ? '#09090b' : '#047857';

    const fillFront = showClassic ? '#ffffff' : 'rgba(190, 18, 60, 0.04)';
    const fillBack = showClassic ? '#ffffff' : 'rgba(67, 56, 202, 0.04)';
    const fillGusset = showClassic ? '#ffffff' : 'rgba(4, 120, 87, 0.06)';

    // Расположение деталей на холсте:
    // 1. Передняя половинка
    const frontOriginX = 4 * CM;
    const frontOriginY = 3 * CM;

    // 2. Задняя половинка (справа от переда)
    const backOriginX = frontOriginX + (g.frontTopHalfW + 7) * CM;
    const backOriginY = 3 * CM;

    // 3. Ластовица (справа от спинки)
    const gussetOriginX = backOriginX + (g.backTopHalfW + 7) * CM;
    const gussetOriginY = 3 * CM;

    // Контур передней половинки (со сгибом по x=0)
    const frontPath = `
        M 0 ${g.F_top_center.y * CM}
        Q ${(g.F_top_side.x * 0.5) * CM} ${(g.F_top_center.y) * CM}, ${g.F_top_side.x * CM} 0
        L ${g.F_bot_side.x * CM} ${g.F_bot_side.y * CM}
        C ${g.F_leg_ctrl1.x * CM} ${g.F_leg_ctrl1.y * CM}, ${g.F_leg_ctrl2.x * CM} ${g.F_leg_ctrl2.y * CM}, ${g.F_gusset_join.x * CM} ${g.F_gusset_join.y * CM}
        L 0 ${g.F_gusset_center.y * CM}
        Z
    `;

    // Контур задней половинки (со сгибом по x=0)
    const backPath = `
        M 0 ${g.B_top_center.y * CM}
        Q ${(g.B_top_side.x * 0.5) * CM} ${(g.B_top_center.y) * CM}, ${g.B_top_side.x * CM} 0
        L ${g.B_bot_side.x * CM} ${g.B_bot_side.y * CM}
        C ${g.B_leg_ctrl1.x * CM} ${g.B_leg_ctrl1.y * CM}, ${g.B_leg_ctrl2.x * CM} ${g.B_leg_ctrl2.y * CM}, ${g.B_gusset_join.x * CM} ${g.B_gusset_join.y * CM}
        L 0 ${g.B_gusset_center.y * CM}
        Z
    `;

    // Контур ластовицы (со сгибом по x=0)
    const gussetPath = `
        M 0 0
        L ${g.G_front_side.x * CM} 0
        Q ${g.G_waist_curve.x * CM} ${g.G_waist_curve.y * CM}, ${g.G_back_side.x * CM} ${g.G_back_side.y * CM}
        L 0 ${g.G_back_center.y * CM}
        Z
    `;

    const modelRu = g.model === 'braziliana' ? 'БРАЗИЛИАНА' : (g.model === 'high-waist' ? 'РЕТРО (ВЫСОКАЯ ТАЛИЯ)' : (g.model === 'thong' ? 'СТРИНГИ' : (g.model === 'dolphin-shorts' ? 'ШОРТИКИ DOLPHIN' : (g.model === 'strappy' ? 'СТРЕПЫ / V-WAIST' : 'СЛИПЫ'))));

    const strappySideMarkup = g.model === 'strappy' ? `
        <!-- Линии стреп на бедрах -->
        <line x1="${g.F_top_side.x * CM}" y1="0" x2="${(g.F_top_side.x + 3.5) * CM}" y2="-6" stroke="#f43f5e" stroke-width="1.8" stroke-dasharray="3,2"/>
        <line x1="${g.F_bot_side.x * CM}" y1="${g.F_bot_side.y * CM}" x2="${(g.F_bot_side.x + 3.5) * CM}" y2="${g.F_bot_side.y * CM + 4}" stroke="#f43f5e" stroke-width="1.8" stroke-dasharray="3,2"/>
        <text x="${(g.F_top_side.x + 0.5) * CM}" y="-8" font-family="Inter, sans-serif" font-size="7.5" font-weight="bold" fill="#f43f5e">⚡ СТРЕПЫ (резинка 12 мм)</text>
    ` : '';

    const dolphinSideMarkup = g.model === 'dolphin-shorts' ? `
        <!-- Контрастный кант Dolphin -->
        <text x="${(g.frontTopHalfW * 0.45) * CM}" y="${(g.frontHeight * CM) - 22}" text-anchor="middle" font-family="Inter, sans-serif" font-size="8" font-weight="bold" fill="#059669">✨ Окантовка контрастным кантом (бейка)</text>
    ` : '';

    return {
        frontPath,
        backPath,
        gussetPath,
        frontOriginX,
        backOriginX,
        gussetOriginX,
        totalWidthCm: Math.ceil((gussetOriginX / CM) + g.gussetBackHalfW + 10),
        totalHeightCm: Math.ceil(Math.max(g.frontHeight, g.backHeight) + 12),
        markup: `
            <!-- 1. ПЕРЕДНЯЯ ПОЛОВИНКА -->
            <g id="piece-panties-front" transform="translate(${frontOriginX}, ${frontOriginY})">
                <path d="${frontPath}" fill="${fillFront}" stroke="${colFront}" stroke-width="1.9" stroke-linejoin="round"/>
                <!-- Линия сгиба -->
                <line x1="0" y1="0" x2="0" y2="${g.frontHeight * CM}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="4,3"/>
                <text x="12" y="${(g.frontHeight * 0.45) * CM}" font-family="Inter, sans-serif" font-size="9.5" font-weight="bold" fill="#52525b" transform="rotate(-90 12 ${(g.frontHeight * 0.45) * CM})">[ СГИБ ТКАНИ ]</text>
                <!-- Долевая нить -->
                <line x1="${(g.frontTopHalfW * 0.35) * CM}" y1="35" x2="${(g.frontTopHalfW * 0.35) * CM}" y2="${(g.frontHeight * CM) - 35}" stroke="#18181b" stroke-width="0.9" marker-start="url(#arrow-start)" marker-end="url(#arrow-end)"/>
                <!-- Подписи -->
                <text x="${(g.frontTopHalfW * 0.45) * CM}" y="45" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="${colFront}">ПЕРЕД</text>
                <text x="${(g.frontTopHalfW * 0.45) * CM}" y="60" text-anchor="middle" font-family="Inter, sans-serif" font-size="8.5" fill="#52525b">1 дет. со сгибом</text>
                <text x="${(g.frontTopHalfW * 0.45) * CM}" y="${(g.frontHeight * CM) - 10}" text-anchor="middle" font-family="Inter, sans-serif" font-size="8" fill="#71717a">⬇ шов ластовицы</text>
                <!-- Отметка длины бокового шва -->
                <text x="${g.F_top_side.x * CM + 4}" y="${(g.sideSeam * 0.5) * CM}" font-family="JetBrains Mono, monospace" font-size="8" fill="#be123c">бок ${g.sideSeam} см</text>
                ${strappySideMarkup}
                ${dolphinSideMarkup}
            </g>

            <!-- 2. ЗАДНЯЯ ПОЛОВИНКА -->
            <g id="piece-panties-back" transform="translate(${backOriginX}, ${backOriginY})">
                <path d="${backPath}" fill="${fillBack}" stroke="${colBack}" stroke-width="1.9" stroke-linejoin="round"/>
                <!-- Линия сгиба -->
                <line x1="0" y1="0" x2="0" y2="${g.backHeight * CM}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="4,3"/>
                <text x="12" y="${(g.backHeight * 0.45) * CM}" font-family="Inter, sans-serif" font-size="9.5" font-weight="bold" fill="#52525b" transform="rotate(-90 12 ${(g.backHeight * 0.45) * CM})">[ СГИБ ТКАНИ ]</text>
                <!-- Долевая нить -->
                <line x1="${(g.backTopHalfW * 0.35) * CM}" y1="35" x2="${(g.backTopHalfW * 0.35) * CM}" y2="${(g.backHeight * CM) - 35}" stroke="#18181b" stroke-width="0.9" marker-start="url(#arrow-start)" marker-end="url(#arrow-end)"/>
                <!-- Подписи -->
                <text x="${(g.backTopHalfW * 0.45) * CM}" y="45" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="${colBack}">СПИНКА (${modelRu})</text>
                <text x="${(g.backTopHalfW * 0.45) * CM}" y="60" text-anchor="middle" font-family="Inter, sans-serif" font-size="8.5" fill="#52525b">1 дет. со сгибом</text>
                <text x="${(g.backTopHalfW * 0.45) * CM}" y="${(g.backHeight * CM) - 10}" text-anchor="middle" font-family="Inter, sans-serif" font-size="8" fill="#71717a">⬇ шов ластовицы</text>
            </g>

            <!-- 3. ЛАСТОВИЦА -->
            <g id="piece-panties-gusset" transform="translate(${gussetOriginX}, ${gussetOriginY})">
                <path d="${gussetPath}" fill="${fillGusset}" stroke="${colGusset}" stroke-width="1.9" stroke-linejoin="round"/>
                <line x1="0" y1="0" x2="0" y2="${g.gussetLen * CM}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="4,3"/>
                <text x="10" y="${(g.gussetLen * 0.5) * CM}" font-family="Inter, sans-serif" font-size="8.5" font-weight="bold" fill="#52525b" transform="rotate(-90 10 ${(g.gussetLen * 0.5) * CM})">[ СГИБ ]</text>
                <text x="${(g.gussetBackHalfW * 0.5) * CM}" y="${(g.gussetLen * 0.4) * CM}" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="bold" fill="${colGusset}">ЛАСТОВИЦА</text>
                <text x="${(g.gussetBackHalfW * 0.5) * CM}" y="${(g.gussetLen * 0.4) * CM + 14}" text-anchor="middle" font-family="Inter, sans-serif" font-size="8" fill="#52525b">2 дет. (хлопок 100%)</text>
                <text x="${(g.gussetFrontHalfW * 0.5) * CM}" y="-6" text-anchor="middle" font-family="Inter, sans-serif" font-size="7.5" font-weight="bold" fill="#047857">▲ К ПЕРЕДУ</text>
                <text x="${(g.gussetBackHalfW * 0.5) * CM}" y="${g.gussetLen * CM + 12}" text-anchor="middle" font-family="Inter, sans-serif" font-size="7.5" font-weight="bold" fill="#4338ca">▼ К СПИНКЕ</text>
            </g>

            <!-- Информационная плашка для швеи -->
            <g transform="translate(${frontOriginX}, ${(Math.max(g.frontHeight, g.backHeight) + 4.5) * CM})">
                <rect x="0" y="0" width="${(g.frontTopHalfW + g.backTopHalfW + g.gussetBackHalfW + 10) * CM}" height="32" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
                <text x="12" y="16" font-family="Inter, sans-serif" font-size="9.5" font-weight="bold" fill="#0f172a">✂️ Припуски на швы:</text>
                <text x="135" y="16" font-family="Inter, sans-serif" font-size="9" fill="#475569">${g.model === 'dolphin-shorts' ? '0 см по низу (окантовка косой бейкой), 1.0 см по поясу' : '0.7 см под резинку или оверлок; 0 см под ажурное фестончатое кружево.'}</text>
                <text x="12" y="27" font-family="Inter, sans-serif" font-size="8.5" fill="#64748b">Об=${g.ob} см (расчетный с эластичностью: ${g.obCalc.toFixed(1)} см, растяжение ${(100 - g.stretch*100).toFixed(0)}%) | От=${g.ot} см</text>
            </g>
        `
    };
}
