// js/top-geometry.js - Математическое ядро построения выкроек маек и топов
// Включает систему «Анти-задир», подгрудные анатомические рельефы, расчет эластичных лент и портупей

function calculateTopGeometry(options = {}) {
    // Базовая анатомическая сетка плечевого стана
    const gBase = calculateGeometry();

    const og = Number(state.og) || 92;
    const ot = Number(state.ot) || 74;
    const ob = Number(state.ob) || 98;
    const dts = Number(state.dts) || 40.0;
    const dtp = Number(state.dtp) || 43.5;
    const vg = Number(state.vg) || 26.5;
    const cg = Number(state.cg) || 10.0;
    const shp = Number(state.shp) || 12.8;

    const style = state.topStyle || 'tank-top';
    const lengthType = state.topLengthType || 'hip';
    const stretch = Number(state.topElasticStretch) || 0.82;
    const antiRideupActive = Boolean(state.topAntiRideup);

    // Уровень основания грудной железы (под грудью)
    const Y_underbust = Math.round((gBase.G7.y + 7.5) * 10) / 10;
    // Обхват под грудью (Опг)
    const underbustGirth = Math.round((og - Math.max(10, (og - ot) * 0.6)) * 10) / 10;

    // Расчет эффективной длины изделия
    let effectiveLength = gBase.Y_H;
    let isCrop = false;
    let isBodysuit = false;
    let isFrontLaceUp = false;
    let isKeyholeHalter = false;
    let isCurtainTop = false;
    let isExtremeCrop = false;

    if (style === 'extreme-crop') {
        isCrop = true;
        isExtremeCrop = true;
        effectiveLength = Y_underbust; // ровно до нижнего основания груди
    } else if (style === 'bustier-crop' || style === 'open-cup' || style === 'strappy-cage' || style === 'o-ring-top') {
        isCrop = true;
        effectiveLength = (lengthType === 'waist') ? gBase.Y_T : (Y_underbust + 3.5);
    } else if (style === 'curtain-top') {
        isCrop = true;
        isCurtainTop = true;
        effectiveLength = (lengthType === 'waist') ? gBase.Y_T : (Y_underbust + 5.0);
    } else if (style === 'plunging-mesh') {
        isBodysuit = true;
        effectiveLength = gBase.Y_H + 10.0; // боди
    } else if (lengthType === 'crop') {
        isCrop = true;
        effectiveLength = Y_underbust + 4.0;
    } else if (lengthType === 'waist') {
        effectiveLength = gBase.Y_T;
    } else if (lengthType === 'long') {
        effectiveLength = gBase.Y_B + 6.0;
    } else {
        // 'hip' (по умолчанию)
        effectiveLength = Math.min(gBase.Y_T + 17.0, gBase.Y_B + 1.0);
    }

    // --- СИСТЕМА «АНТИ-ЗАДИР» (Компенсация объема груди дугой низа переда) ---
    // Разница между длиной переда и спинки
    const balanceDiff = Math.max(1.5, dtp - dts);
    // Дугообразный опуск подола переда по центру
    const antiRideupDrop = (antiRideupActive && !isCrop && !isBodysuit)
        ? Math.round((balanceDiff * 0.65 + 1.2) * 10) / 10
        : 0;

    // --- НАЛИЧИЕ РУКАВА ---
    // Рукав есть ТОЛЬКО у анатомической футболки (Smart Tee)
    const hasSleeve = (style === 'smart-tee');

    // --- МОДЕЛЬНЫЕ ПАРАМЕТРЫ ВЫРЕЗОВ И БРЕТЕЛЕЙ ---
    let strapWidth = 4.0;      // ширина бретели (см)
    let backNeckDrop = 3.5;    // углубление горловины спинки (см)
    let frontNeckDrop = 9.0;   // углубление горловины переда (см)
    let armholeDrop = 1.5;     // опуск проймы для свободы (см)
    let shoulderCutIn = 2.0;   // смещение плеча к шее (см)
    let isRacerback = false;   // спинка-борцовка
    let isHalter = false;      // американская пройма
    let isLowBack = false;     // открытая спина
    let isPlunging = false;    // экстремальное декольте
    let stabilizationDart = 0; // вытачка на прилегание декольте (см)

    if (style === 'tank-top') {
        strapWidth = 4.0;
        backNeckDrop = 5.0;
        frontNeckDrop = 9.5;
        armholeDrop = 1.5;
        shoulderCutIn = 2.5;
    } else if (style === 'extreme-crop') {
        strapWidth = 3.5;
        backNeckDrop = 6.0;
        frontNeckDrop = 10.0;
        armholeDrop = 0.5;
        shoulderCutIn = 2.5;
    } else if (style === 'front-laceup') {
        strapWidth = 3.5;
        backNeckDrop = 5.0;
        frontNeckDrop = 11.0;
        armholeDrop = 1.0;
        shoulderCutIn = 3.0;
        isFrontLaceUp = true;
    } else if (style === 'keyhole-halter') {
        strapWidth = 3.0;
        backNeckDrop = 16.0;
        frontNeckDrop = 3.0; // стойка-чокер
        armholeDrop = 1.5;
        isHalter = true;
        isKeyholeHalter = true;
    } else if (style === 'curtain-top') {
        strapWidth = 1.0;
        backNeckDrop = 16.0;
        frontNeckDrop = 12.0;
        armholeDrop = 2.0;
        shoulderCutIn = 4.0;
    } else if (style === 'smart-tee') {
        strapWidth = shp;
        backNeckDrop = 2.2;
        frontNeckDrop = 7.5;
        armholeDrop = 0.5; // высокая комфортная подмышка
        shoulderCutIn = 0.5;
    } else if (style === 'racerback') {
        strapWidth = 3.2;
        backNeckDrop = 12.0;
        frontNeckDrop = 9.0;
        armholeDrop = 2.5;
        shoulderCutIn = 3.0;
        isRacerback = true;
    } else if (style === 'halter-top') {
        strapWidth = 3.0;
        backNeckDrop = 14.0;
        frontNeckDrop = 4.0;
        armholeDrop = 1.0;
        isHalter = true;
    } else if (style === 'camisole') {
        strapWidth = 0.8;
        backNeckDrop = 12.0;
        frontNeckDrop = 15.0;
        armholeDrop = 2.0;
        shoulderCutIn = 4.5;
    } else if (style === 'bustier-crop') {
        strapWidth = 2.0;
        backNeckDrop = 14.0;
        frontNeckDrop = 13.5;
        armholeDrop = 0.5;
        shoulderCutIn = 4.0;
    } else if (style === 'low-back') {
        strapWidth = 1.2;
        backNeckDrop = gBase.Y_T - 1.5; // глубокий вырез спинки до талии
        frontNeckDrop = 6.0;
        armholeDrop = 1.5;
        shoulderCutIn = 3.5;
        isLowBack = true;
    } else if (style === 'open-cup') {
        strapWidth = 1.5;
        backNeckDrop = 16.0;
        frontNeckDrop = Y_underbust; // открытая грудь до основания
        armholeDrop = 0.5;
        shoulderCutIn = 5.0;
    } else if (style === 'plunging-mesh') {
        strapWidth = 2.5;
        backNeckDrop = 8.0;
        frontNeckDrop = gBase.Y_T - 0.5; // вырез до талии
        armholeDrop = 1.5;
        shoulderCutIn = 3.0;
        isPlunging = true;
        stabilizationDart = 1.2; // компенсация растяжения сетки
    } else if (style === 'strappy-cage') {
        strapWidth = 1.2;
        backNeckDrop = 16.0;
        frontNeckDrop = 15.0;
        armholeDrop = 1.0;
        shoulderCutIn = 4.5;
    } else if (style === 'o-ring-top') {
        strapWidth = 1.5;
        backNeckDrop = 16.0;
        frontNeckDrop = 14.0;
        armholeDrop = 1.0;
        shoulderCutIn = 4.5;
    }

    // --- РАСЧЕТ ДЛИН ЭЛАСТИЧНЫХ ЛЕНТ, БРЕТЕЛЕЙ И ПОРТУПЕЙ ---
    const strapRawLength = (dts * 0.44 + vg * 0.56);
    const strapFinishedLength = Math.round((strapRawLength * stretch + 4.5) * 10) / 10;
    const underbustBandLength = Math.round((underbustGirth * stretch + 3.0) * 10) / 10;
    const cageRibStraps = Math.round(((underbustGirth - 4) * stretch * 2 + 6.0) * 10) / 10;

    const elasticSpec = {
        underbustGirth,
        underbustBandLength,
        strapFinishedLength,
        cageRibStraps,
        stretchCoeff: stretch,
        ringDiameterMm: (style === 'o-ring-top') ? 30 : 15,
        slidersCount: (style === 'strappy-cage' || style === 'camisole' || style === 'low-back') ? 4 : 2
    };

    // Точки спинки (Back)
    const B_neck_center = { x: 0, y: backNeckDrop };
    const B_neck_shoulder = { x: gBase.A2.x + 1.0, y: gBase.A2.y + 0.3 };
    const B_strap_outer = { x: B_neck_shoulder.x + strapWidth, y: gBase.A2.y + 0.8 };
    const B_armhole_bot = { x: gBase.X_G4, y: gBase.Y_G + armholeDrop };
    const B_waist_center = { x: 0, y: gBase.Y_T };
    const B_waist_side = { x: gBase.B3.x, y: gBase.Y_T };
    const B_hem_center = { x: 0, y: effectiveLength };
    const B_hem_side = { x: gBase.B3.x, y: effectiveLength };

    // Специфика спинки-борцовки (racerback)
    const B_racer_narrow = { x: 3.2, y: (gBase.Y_G + backNeckDrop) / 2 };

    // Точки полочки (Front)
    const F_neck_center = { x: gBase.W_grid, y: frontNeckDrop };
    const F_neck_shoulder = { x: gBase.A4.x - 1.0, y: gBase.A4.y + 0.3 };
    const F_strap_outer = { x: F_neck_shoulder.x - strapWidth, y: gBase.A4.y + 0.8 };
    const F_armhole_bot = { x: gBase.X_G4, y: gBase.Y_G + armholeDrop };
    const F_waist_center = { x: gBase.W_grid, y: gBase.Y_T };
    const F_waist_side = { x: gBase.B4.x, y: gBase.Y_T };
    // Передний подол с учетом дуги «Анти-задир»
    const F_hem_center = { x: gBase.W_grid, y: effectiveLength + antiRideupDrop };
    const F_hem_side = { x: gBase.B4.x, y: effectiveLength };

    // Подгрудные точки для корсажных и открытых топов
    const Underbust_center = { x: gBase.W_grid, y: Y_underbust };
    const Underbust_apex = { x: gBase.G7.x, y: Y_underbust };
    const Underbust_side = { x: gBase.X_G4, y: Y_underbust };

    return {
        type: 'top',
        style,
        lengthType,
        og, ot, ob, dts, dtp, vg, cg,
        W_grid: gBase.W_grid,
        X_side: gBase.X_G4,
        Y_G: gBase.Y_G,
        Y_T: gBase.Y_T,
        Y_B: gBase.Y_B,
        Y_underbust,
        effectiveLength,
        antiRideupDrop,
        hasSleeve,
        sleeve: gBase.sleeve,
        isCrop,
        isExtremeCrop,
        isBodysuit,
        isRacerback,
        isHalter,
        isLowBack,
        isPlunging,
        isFrontLaceUp,
        isKeyholeHalter,
        isCurtainTop,
        stabilizationDart,
        elasticSpec,
        // Точки спинки
        B_neck_center, B_neck_shoulder, B_strap_outer, B_armhole_bot,
        B_waist_center, B_waist_side, B_hem_center, B_hem_side, B_racer_narrow,
        // Точки полочки
        F_neck_center, F_neck_shoulder, F_strap_outer, F_armhole_bot,
        F_waist_center, F_waist_side, F_hem_center, F_hem_side,
        Underbust_center, Underbust_apex, Underbust_side,
        // Исходные точки каркаса
        G7: gBase.G7,
        W_sleeve: gBase.W_sleeve,
        L_sleeve: (hasSleeve ? 19.0 : 0),
        widthCm: Math.ceil(gBase.W_grid + (hasSleeve ? (gBase.W_sleeve + 12) : 10)),
        heightCm: Math.ceil(effectiveLength + antiRideupDrop + 10)
    };
}

// Генерация SVG разметки деталей маек и топов
function generateTopPiecesMarkup(g, options = {}) {
    const isSeparate = options.separate ?? state.separate;
    const showClassic = options.showClassic ?? state.classicStyle;
    const frontShiftX = options.frontShiftX ?? (isSeparate ? (24 * CM) : 0);

    const colBack = showClassic ? '#09090b' : '#2563eb';
    const colFront = showClassic ? '#09090b' : '#dc2626';
    const fillBack = showClassic ? '#ffffff' : 'rgba(37, 99, 235, 0.04)';
    const fillFront = showClassic ? '#ffffff' : 'rgba(220, 38, 38, 0.04)';
    const colDetail = showClassic ? '#71717a' : '#d97706';

    const p = (pt, shiftX = 0, shiftY = 0) => `${((pt.x + shiftX) * CM).toFixed(1)} ${((pt.y + shiftY) * CM).toFixed(1)}`;

    // Контур Спинки (Back)
    let backPath = '';
    if (g.isRacerback) {
        // Спинка-борцовка с фигурной Т-образной выемкой
        backPath = `
            M ${p(g.B_neck_center)}
            Q ${p({ x: g.B_strap_outer.x * 0.4, y: g.B_neck_center.y })} ${p(g.B_neck_shoulder)}
            L ${p(g.B_strap_outer)}
            Q ${p(g.B_racer_narrow)} ${p(g.B_armhole_bot)}
            L ${p(g.B_waist_side)}
            L ${p(g.B_hem_side)}
            L ${p(g.B_hem_center)}
            Z
        `;
    } else if (g.isHalter) {
        // Американская пройма (срез от подмышки к горловине)
        backPath = `
            M ${p(g.B_neck_center)}
            L ${p({ x: g.B_strap_outer.x, y: g.B_neck_center.y })}
            L ${p(g.B_armhole_bot)}
            L ${p(g.B_waist_side)}
            L ${p(g.B_hem_side)}
            L ${p(g.B_hem_center)}
            Z
        `;
    } else if (g.isLowBack) {
        // Открытая спинка
        backPath = `
            M ${p(g.B_neck_center)}
            L ${p(g.B_armhole_bot)}
            L ${p(g.B_waist_side)}
            L ${p(g.B_hem_side)}
            L ${p(g.B_hem_center)}
            Z
        `;
    } else {
        // Классическая майка / футболка
        backPath = `
            M ${p(g.B_neck_center)}
            Q ${p({ x: g.B_neck_shoulder.x * 0.4, y: g.B_neck_center.y })} ${p(g.B_neck_shoulder)}
            L ${p(g.B_strap_outer)}
            Q ${p({ x: g.B_strap_outer.x + 1.0, y: (g.B_strap_outer.y + g.B_armhole_bot.y) * 0.6 })} ${p(g.B_armhole_bot)}
            L ${p(g.B_waist_side)}
            L ${p(g.B_hem_side)}
            L ${p(g.B_hem_center)}
            Z
        `;
    }

    // Контур Полочки (Front)
    let frontPath = '';
    const fx = frontShiftX / CM;

    if (g.isHalter) {
        // Американская пройма полочки
        frontPath = `
            M ${p(g.F_neck_center, fx)}
            L ${p(g.F_neck_shoulder, fx)}
            L ${p(g.F_armhole_bot, fx)}
            L ${p(g.F_waist_side, fx)}
            L ${p(g.F_hem_side, fx)}
            Q ${p({ x: (g.F_hem_side.x + g.F_hem_center.x) / 2, y: g.F_hem_center.y }, fx)} ${p(g.F_hem_center, fx)}
            Z
        `;
    } else if (g.isPlunging) {
        // Экстремальное декольте с вытачкой стабилизации
        frontPath = `
            M ${p(g.F_neck_center, fx)}
            L ${p(g.F_neck_shoulder, fx)}
            L ${p(g.F_strap_outer, fx)}
            Q ${p({ x: g.F_strap_outer.x - 1.5, y: (g.F_strap_outer.y + g.F_armhole_bot.y) * 0.6 }, fx)} ${p(g.F_armhole_bot, fx)}
            L ${p(g.F_waist_side, fx)}
            L ${p(g.F_hem_side, fx)}
            Q ${p({ x: (g.F_hem_side.x + g.F_hem_center.x) / 2, y: g.F_hem_center.y }, fx)} ${p(g.F_hem_center, fx)}
            Z
        `;
    } else if (g.style === 'open-cup') {
        // Открытая грудь / Shelf Bra балконет
        frontPath = `
            M ${p(g.Underbust_center, fx)}
            Q ${p(g.Underbust_apex, fx)} ${p({ x: g.F_armhole_bot.x + 2.0, y: g.Y_underbust + 1.0 }, fx)}
            L ${p(g.F_armhole_bot, fx)}
            L ${p(g.F_waist_side, fx)}
            L ${p(g.F_hem_side, fx)}
            L ${p(g.F_hem_center, fx)}
            Z
        `;
    } else {
        // Базовый вырез с кривой «Анти-задир»
        const isVNeck = (g.style === 'camisole' || g.style === 'bustier-crop');
        const neckCurve = isVNeck
            ? `L ${p(g.F_neck_shoulder, fx)}`
            : `Q ${p({ x: g.W_grid - (g.W_grid - g.F_neck_shoulder.x) * 0.4, y: g.F_neck_center.y }, fx)} ${p(g.F_neck_shoulder, fx)}`;

        frontPath = `
            M ${p(g.F_neck_center, fx)}
            ${neckCurve}
            L ${p(g.F_strap_outer, fx)}
            Q ${p({ x: g.F_strap_outer.x - 1.5, y: (g.F_strap_outer.y + g.F_armhole_bot.y) * 0.6 }, fx)} ${p(g.F_armhole_bot, fx)}
            L ${p(g.F_waist_side, fx)}
            L ${p(g.F_hem_side, fx)}
            Q ${p({ x: (g.F_hem_side.x + g.F_hem_center.x) / 2, y: g.F_hem_center.y }, fx)} ${p(g.F_hem_center, fx)}
            Z
        `;
    }

    // Декоративные перемычки и конструктивные узлы (шнуровка, капля, кулиски, O-Ring)
    let harnessMarkup = '';
    const isQuickRelease = Boolean(state.quickRelease);

    if (g.style === 'o-ring-top') {
        const ringX = (g.W_grid + fx) * CM;
        const ringY = (g.G7.y + 1.5) * CM;
        harnessMarkup = `
            <!-- Центральное соединительное металлическое кольцо O-Ring -->
            <circle cx="${ringX}" cy="${ringY}" r="15" fill="#f43f5e" fill-opacity="0.15" stroke="#e11d48" stroke-width="2.5"/>
            <circle cx="${ringX}" cy="${ringY}" r="9" fill="#ffffff" stroke="#e11d48" stroke-width="1.5"/>
            <text x="${ringX}" y="${ringY + 28}" text-anchor="middle" font-size="9" font-family="JetBrains Mono" font-weight="bold" fill="#e11d48">O-RING Ø30 мм</text>
            <!-- Расходящиеся эластичные ленты -->
            <line x1="${ringX - 10}" y1="${ringY - 10}" x2="${(g.F_strap_outer.x + fx) * CM}" y2="${g.F_strap_outer.y * CM}" stroke="#e11d48" stroke-width="2.2" stroke-dasharray="6,3"/>
            <line x1="${ringX - 12}" y1="${ringY + 5}" x2="${(g.F_armhole_bot.x + fx) * CM}" y2="${(g.Y_underbust) * CM}" stroke="#e11d48" stroke-width="2.2" stroke-dasharray="6,3"/>
        `;
    } else if (g.isFrontLaceUp) {
        // Передняя шнуровка с люверсами и припуском
        const cX = (g.W_grid + fx) * CM;
        const topY = (g.F_neck_center.y + 1.5) * CM;
        const botY = (g.F_hem_center.y - 1.0) * CM;
        let eyeletsSvg = '';
        const count = 5;
        const step = (botY - topY) / (count - 1);
        for (let i = 0; i < count; i++) {
            const ey = topY + i * step;
            eyeletsSvg += `
                <circle cx="${cX - 8}" cy="${ey}" r="2.5" fill="#e11d48"/>
                <circle cx="${cX - 18}" cy="${ey}" r="2.5" fill="#e11d48"/>
                ${i < count - 1 ? `<line x1="${cX - 8}" y1="${ey}" x2="${cX - 18}" y2="${ey + step}" stroke="#e11d48" stroke-width="1.2" stroke-dasharray="2,2"/>` : ''}
            `;
        }
        harnessMarkup = `
            <!-- Планка передней шнуровки -->
            <line x1="${cX - 14}" y1="${topY - 10}" x2="${cX - 14}" y2="${botY + 10}" stroke="#e11d48" stroke-width="1.5" stroke-dasharray="5,3"/>
            ${eyeletsSvg}
            <text x="${cX - 24}" y="${(topY + botY) / 2}" font-family="JetBrains Mono" font-size="8.5" font-weight="bold" fill="#e11d48" text-anchor="end" transform="rotate(-90 ${cX - 24} ${(topY + botY) / 2})">⚡ ПЕРЕДНЯЯ ШНУРОВКА (быстрое снятие)</text>
        `;
    } else if (g.isKeyholeHalter) {
        // Чокер-стойка + вырез-капля
        const cX = (g.W_grid + fx) * CM;
        const khCenterY = (g.G7.y - 1.0) * CM;
        harnessMarkup = `
            <!-- Воротник-чокер вокруг шеи -->
            <rect x="${cX - 38}" y="${g.F_neck_center.y * CM - 35}" width="38" height="30" rx="4" fill="rgba(225, 29, 72, 0.08)" stroke="#e11d48" stroke-width="1.8"/>
            <text x="${cX - 19}" y="${g.F_neck_center.y * CM - 16}" text-anchor="middle" font-family="JetBrains Mono" font-size="8" font-weight="bold" fill="#e11d48">ЧОКЕР 3.5 см</text>
            <!-- Вырез-капля на груди -->
            <ellipse cx="${cX}" cy="${khCenterY}" rx="22" ry="34" fill="#ffffff" stroke="#e11d48" stroke-width="2.0"/>
            <text x="${cX - 28}" y="${khCenterY}" text-anchor="end" font-family="JetBrains Mono" font-size="8" font-weight="bold" fill="#e11d48">ВЫРЕЗ-КАПЛЯ</text>
        `;
    } else if (g.isCurtainTop) {
        // Кулиски сверху и снизу
        const topY = g.F_neck_center.y * CM;
        const botY = g.F_hem_center.y * CM;
        harnessMarkup = `
            <!-- Верхняя кулиска -->
            <line x1="${(g.F_strap_outer.x + fx) * CM}" y1="${topY + 18}" x2="${(g.W_grid + fx) * CM}" y2="${topY + 18}" stroke="#e11d48" stroke-width="1.5" stroke-dasharray="4,2"/>
            <text x="${(g.W_grid + fx - 4) * CM}" y="${topY + 14}" text-anchor="end" font-family="JetBrains Mono" font-size="8" font-weight="bold" fill="#e11d48">КУЛИСКА ВЕРХНЯЯ 2.5 см</text>
            <!-- Нижняя кулиска -->
            <line x1="${(g.F_hem_side.x + fx) * CM}" y1="${botY - 18}" x2="${(g.W_grid + fx) * CM}" y2="${botY - 18}" stroke="#e11d48" stroke-width="1.5" stroke-dasharray="4,2"/>
            <text x="${(g.W_grid + fx - 4) * CM}" y="${botY - 22}" text-anchor="end" font-family="JetBrains Mono" font-size="8" font-weight="bold" fill="#e11d48">КУЛИСКА НИЖНЯЯ 2.5 см</text>
        `;
    } else if (g.style === 'plunging-mesh') {
        const p1Y = (g.F_neck_center.y - 7) * CM;
        const p2Y = (g.F_neck_center.y - 3) * CM;
        harnessMarkup = `
            <!-- Перемычки глубокого декольте -->
            <line x1="${(g.W_grid + fx - 4.5) * CM}" y1="${p1Y}" x2="${(g.W_grid + fx) * CM}" y2="${p1Y}" stroke="#e11d48" stroke-width="1.8"/>
            <line x1="${(g.W_grid + fx - 2.5) * CM}" y1="${p2Y}" x2="${(g.W_grid + fx) * CM}" y2="${p2Y}" stroke="#e11d48" stroke-width="1.8"/>
            <text x="${(g.W_grid + fx - 3.5) * CM}" y="${p1Y - 4}" font-size="8" fill="#e11d48" font-family="JetBrains Mono">стреп</text>
        `;
    } else if (g.style === 'strappy-cage') {
        const uY = g.Y_underbust * CM;
        harnessMarkup = `
            <!-- Портупейная лента под грудью -->
            <line x1="${(g.F_armhole_bot.x + fx) * CM}" y1="${uY}" x2="${(g.W_grid + fx) * CM}" y2="${uY}" stroke="#e11d48" stroke-width="2.5"/>
            <text x="${(g.F_armhole_bot.x + fx + 3) * CM}" y="${uY - 4}" font-size="9" font-family="JetBrains Mono" font-weight="bold" fill="#e11d48">Лента под грудью (${g.elasticSpec.underbustBandLength} см)</text>
        `;
    }

    // Маркировка опции «Быстрое снятие»
    if (isQuickRelease) {
        const qrX = (g.W_grid + fx) * CM;
        harnessMarkup += `
            <!-- Инженерная опция «Быстрое снятие» -->
            <line x1="${qrX + 18}" y1="${(g.F_neck_center.y) * CM}" x2="${qrX + 18}" y2="${(g.F_hem_center.y) * CM}" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="4,3"/>
            <text x="${qrX + 22}" y="${((g.F_neck_center.y + g.F_hem_center.y) / 2) * CM}" font-family="JetBrains Mono" font-size="8" font-weight="bold" fill="#d97706" transform="rotate(-90 ${qrX + 22} ${((g.F_neck_center.y + g.F_hem_center.y) / 2) * CM})">⚡ ПРИПУСК 1.8 СМ (БЫСТРОЕ СНЯТИЕ: МОЛНИЯ/КНОПКИ)</text>
        `;
    }

    // Рукав для футболки
    let sleeveMarkup = '';
    const sleeveOriginX = (g.W_grid + fx + 16) * CM;
    if (g.hasSleeve) {
        const sW = g.W_sleeve * CM;
        const sH = 19.0 * CM; // короткий рукав
        sleeveMarkup = `
            <g id="top-sleeve-piece" transform="translate(${sleeveOriginX}, ${6 * CM})">
                <rect x="0" y="0" width="${sW}" height="${sH}" fill="rgba(16, 185, 129, 0.04)" stroke="#10b981" stroke-width="1.8" rx="4"/>
                <path d="M 0 ${6 * CM} Q ${sW / 2} 0 ${sW} ${6 * CM} L ${sW} ${sH} L 0 ${sH} Z" fill="none" stroke="#059669" stroke-width="2.0"/>
                <text x="${sW / 2}" y="${sH / 2}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#065f46">РУКАВ ФУТБОЛКИ (2 дет.)</text>
                <text x="${sW / 2}" y="${sH / 2 + 16}" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#047857">Длина 19 см | Оп=${g.og / 3} см</text>
            </g>
        `;
    }

    const antiRideupLabel = g.antiRideupDrop > 0 ? `
        <!-- Индикатор Анти-задир -->
        <g transform="translate(${(g.W_grid + fx - 6) * CM}, ${(g.F_hem_center.y - 1.2) * CM})">
            <rect x="0" y="0" width="85" height="18" rx="5" fill="#fef2f2" stroke="#fecaca"/>
            <text x="42.5" y="12.5" text-anchor="middle" font-family="Inter, sans-serif" font-size="8.5" font-weight="bold" fill="#dc2626">🛡️ Анти-задир +${g.antiRideupDrop} см</text>
        </g>
    ` : '';

    const markup = `
        <!-- СПИНКА МАЙКИ / ТОПА -->
        <g id="top-back-piece">
            <path d="${backPath}" fill="${fillBack}" stroke="${colBack}" stroke-width="2.0" stroke-linejoin="round"/>
            <text x="${(g.B_strap_outer.x / 2) * CM}" y="${(g.effectiveLength / 2) * CM}" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#1e3a8a">СПИНКА ТОПА</text>
            <text x="${(g.B_strap_outer.x / 2) * CM}" y="${(g.effectiveLength / 2 + 18 / 10) * CM}" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#3b82f6">[ СГИБ ТКАНИ ПО ЦЕНТРУ ]</text>
            <!-- Линия талии -->
            <line x1="0" y1="${g.Y_T * CM}" x2="${g.B_waist_side.x * CM}" y2="${g.Y_T * CM}" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="4,4"/>
        </g>

        <!-- ПОЛОЧКА МАЙКИ / ТОПА -->
        <g id="top-front-piece">
            <path d="${frontPath}" fill="${fillFront}" stroke="${colFront}" stroke-width="2.0" stroke-linejoin="round"/>
            <text x="${(g.W_grid + fx - 7) * CM}" y="${(g.effectiveLength / 2) * CM}" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#991b1b">ПОЛОЧКА (ПЕРЕД)</text>
            <text x="${(g.W_grid + fx - 7) * CM}" y="${(g.effectiveLength / 2 + 18 / 10) * CM}" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#ef4444">[ СГИБ ТКАНИ / ЦЕНТР ]</text>
            <!-- Линия талии -->
            <line x1="${(g.F_armhole_bot.x + fx) * CM}" y1="${g.Y_T * CM}" x2="${(g.W_grid + fx) * CM}" y2="${g.Y_T * CM}" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="4,4"/>
            ${antiRideupLabel}
            ${harnessMarkup}
        </g>

        ${sleeveMarkup}
    `;

    return {
        markup,
        backPath,
        frontPath,
        sleeveMarkup,
        totalWidthCm: g.widthCm,
        totalHeightCm: g.heightCm,
        sleeveOriginX: sleeveOriginX / CM
    };
}

if (typeof window !== 'undefined') {
    window.calculateTopGeometry = calculateTopGeometry;
    window.generateTopPiecesMarkup = generateTopPiecesMarkup;
}
