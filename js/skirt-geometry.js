// js/skirt-geometry.js - Конструирование юбок (ЕМКО СЭВ / ЦОТШЛ)
// Поддерживает: А-силуэт (Трапеция), Полусолнце, Солнце, Прямая классическая, Карандаш

function calculateSkirtGeometry() {
    const ot = Number(state.ot) || 74;
    const ob = Number(state.ob) || 98;
    const vb = (typeof AutoMeasurements !== 'undefined') ? AutoMeasurements.getEffective('skirtVb') : (Number(state.skirtVb) || Number(state.vb) || 19.5);
    const balance = (typeof AutoMeasurements !== 'undefined') ? AutoMeasurements.getEffective('skirtBalance') : (Number(state.skirtBalance) || 0);
    const skirtLength = Number(state.skirtLength) || 60;
    const style = state.skirtStyle || 'a-line';
    const pt = Number(state.skirtPt) || 1.0;
    const pb = Number(state.skirtPb) || 2.0;
    const rise = state.skirtRise || 'natural';

    // Корректировка длины и талии под посадку
    let riseDrop = 0;
    if (rise === 'low') riseDrop = 3.5; // посадка на бедрах
    if (rise === 'high') riseDrop = -4.0; // высокая корсетная посадка

    const effectiveLength = Math.max(30, skirtLength - Math.max(0, riseDrop));

    // --- ВАРИАНТ 1: ПОЛУСОЛНЦЕ, СОЛНЦЕ И МИНИ-СКЕЙТЕР (Клеш) ---
    if (style === 'half-sun' || style === 'sun' || style === 'mini-skater') {
        const isSun = (style === 'sun');
        const circumference = (ot + pt * 2);
        const rWaist = circumference / (isSun ? (2 * Math.PI) : (style === 'mini-skater' ? (1.5 * Math.PI) : Math.PI));
        const rHem = rWaist + effectiveLength;

        return {
            type: 'skirt',
            style,
            isCircular: true,
            isSun,
            isSkater: (style === 'mini-skater'),
            ot, ob, vb, skirtLength: effectiveLength,
            pt, pb, rise,
            rWaist, rHem,
            widthCm: Math.ceil(rHem + 6),
            heightCm: Math.ceil(rHem + 6),
            beltLength: ot + pt * 2 + 3.0,
            beltWidth: 7.0
        };
    }

    // --- ВАРИАНТ 2: КОНСТРУКТИВНЫЕ ЮБКИ (А-силуэт/Трапеция, Прямая, Карандаш, Мини-фасоны) ---
    const St = (ot / 2) + pt;
    const Sb = (ob / 2) + pb;

    // Ширина базисной сетки
    const W_grid = Sb;
    // Положение бокового шва (ЗП немного шире или равно)
    const X_side = Sb / 2 - 0.5;

    // Суммарный раствор талиевых вытачек: разница между полуобхватом бедер и талии
    const totalDart = Math.max(0.5, Sb - St);

    // Распределение вытачек:
    const sideDart = totalDart * 0.50;
    const backDart = totalDart * 0.32;
    const frontDart = totalDart * 0.18;

    // Моделирование подола, длины и специфики фасона
    let flareOffset = 0;
    let hemCurveLift = 0;
    let backDartLen = 13.0; // см
    let frontDartLen = 9.5;  // см
    let hasSlit = false;
    let slitHeight = 0;
    let isWrap = false;
    let wrapOverlap = 0;
    let isPleated = false;
    let yokeHeight = 0;
    let pleatStep = 0;
    let hasLaceup = false;
    let laceupHeight = 0;
    let hasRuched = false;
    let isMicro = false;
    let hasDoubleSlit = false;
    let isWrapMicroPleated = false;
    let isBootyShorts = false;
    let isGarterPeplum = false;

    if (style === 'wrap-micro-pleated') {
        // Микро-плиссе на запахе (18-28 см) со складками и широким запахом
        flareOffset = 2.5;
        hemCurveLift = 0.5;
        isPleated = true;
        isWrap = true;
        isWrapMicroPleated = true;
        wrapOverlap = 16.0;
        yokeHeight = 5.0;
        pleatStep = 2.8;
        backDartLen = 4.5;
        frontDartLen = 4.0;
    } else if (style === 'double-high-slit') {
        // Юбка с двумя высокими разрезами до талии
        flareOffset = 1.0;
        hemCurveLift = 0;
        hasDoubleSlit = true;
        hasSlit = true;
        slitHeight = Math.max(10, effectiveLength - 3.5);
        backDartLen = Math.min(10.0, effectiveLength * 0.28);
        frontDartLen = Math.min(7.0, effectiveLength * 0.20);
    } else if (style === 'ruched-drawstring') {
        // Асимметричная юбка на кулиске 1.6x
        flareOffset = -0.5;
        hemCurveLift = 0;
        hasRuched = true;
        backDartLen = Math.min(9.0, effectiveLength * 0.25);
        frontDartLen = Math.min(6.5, effectiveLength * 0.18);
    } else if (style === 'booty-shorts') {
        // Микро-шорты / Чикис
        flareOffset = -2.0;
        hemCurveLift = 1.5;
        isBootyShorts = true;
        backDartLen = Math.min(6.0, effectiveLength * 0.25);
        frontDartLen = Math.min(4.5, effectiveLength * 0.20);
    } else if (style === 'garter-peplum') {
        // Корсетная юбка-баска с креплениями для чулок (12-16 см)
        flareOffset = 3.5;
        hemCurveLift = 0.5;
        isGarterPeplum = true;
        backDartLen = Math.min(8.0, effectiveLength * 0.45);
        frontDartLen = Math.min(6.0, effectiveLength * 0.35);
    } else if (style === 'a-line') {
        // Трапеция / А-силуэт миди: расклешение бокового шва
        flareOffset = 6.5; // +6.5 см по низу с каждой стороны
        hemCurveLift = 1.2; // подъем бока для ровного подола
    } else if (style === 'mini-trapeze') {
        // Мини-трапеция (А-силуэт короткая)
        flareOffset = 5.2;
        hemCurveLift = 0.9;
        backDartLen = Math.min(10.0, effectiveLength * 0.28);
        frontDartLen = Math.min(7.0, effectiveLength * 0.20);
    } else if (style === 'mini-laceup') {
        // Мини со шнуровкой по бедру
        flareOffset = 1.0;
        hemCurveLift = 0;
        hasLaceup = true;
        laceupHeight = Math.min(18.0, effectiveLength * 0.45);
        backDartLen = Math.min(10.0, effectiveLength * 0.28);
        frontDartLen = Math.min(7.0, effectiveLength * 0.20);
    } else if (style === 'mini-ruched') {
        // Мини на кулиске со сборкой
        flareOffset = -1.2;
        hemCurveLift = 0;
        hasRuched = true;
        backDartLen = Math.min(9.0, effectiveLength * 0.25);
        frontDartLen = Math.min(6.5, effectiveLength * 0.18);
    } else if (style === 'mini-micro') {
        // Y2K ультра-микро юбка 30 см на бедрах
        flareOffset = 2.0;
        hemCurveLift = 0.5;
        isMicro = true;
        backDartLen = Math.min(7.0, effectiveLength * 0.22);
        frontDartLen = Math.min(5.0, effectiveLength * 0.16);
    } else if (style === 'mini-slit') {
        // Мини с разрезом по ноге
        flareOffset = 0.5;
        hemCurveLift = 0;
        hasSlit = true;
        slitHeight = Math.min(10.0, effectiveLength * 0.25);
        backDartLen = Math.min(11.0, effectiveLength * 0.30);
        frontDartLen = Math.min(8.0, effectiveLength * 0.22);
    } else if (style === 'mini-wrap') {
        // Мини с запахом (асимметрия)
        flareOffset = 4.2;
        hemCurveLift = 0.9;
        isWrap = true;
        wrapOverlap = 12.0;
        backDartLen = Math.min(10.0, effectiveLength * 0.28);
        frontDartLen = Math.min(7.0, effectiveLength * 0.20);
    } else if (style === 'mini-pleated') {
        // Теннисная мини со складками плиссе и кокеткой
        flareOffset = 0;
        hemCurveLift = 0;
        isPleated = true;
        yokeHeight = 9.0;
        pleatStep = 3.5;
        backDartLen = Math.min(8.5, yokeHeight - 0.5);
        frontDartLen = Math.min(7.0, yokeHeight - 1.5);
    } else if (style === 'pencil') {
        // Зауженная юбка-карандаш
        flareOffset = -3.2; // -3.2 см к низу
        hemCurveLift = 0;
    }

    // Позиция задней вытачки
    const X_backDart = X_side * 0.44;
    // Позиция передней вытачки
    const X_frontDart = X_side + (W_grid - X_side) * 0.55;

    // Инженерные фичи: V-Cut талия и Scrunch сборка
    const isVCut = Boolean(state.vCutWaist);
    const vCutDepth = Number(state.vCutDepth) || 5.0;
    const isScrunch = Boolean(state.scrunchEffect);

    // Точки заднего полотнища (Back panel)
    const B_waist_center = { x: 0, y: (balance * 0.5) - (isVCut ? 1.5 : 0) };
    const B_dart_left = { x: X_backDart - backDart / 2, y: (balance * 0.25) - (isVCut ? 0.8 : 0) };
    const B_dart_apex = { x: X_backDart, y: backDartLen };
    const B_dart_right = { x: X_backDart + backDart / 2, y: (balance * 0.25) - (isVCut ? 0.8 : 0) };
    const B_waist_side = { x: X_side - sideDart / 2, y: -1.2 - (isVCut ? 1.0 : 0) };
    const B_hip_side = { x: X_side, y: vb };
    const B_hem_side = { x: X_side + flareOffset, y: effectiveLength - hemCurveLift };
    const B_hem_center = { x: 0, y: effectiveLength + (isScrunch ? 2.5 : 0) };
    const B_hip_center = { x: 0, y: vb };

    // Точки переднего полотнища (Front panel)
    const F_waist_side = { x: X_side + sideDart / 2, y: -1.2 - (isVCut ? 1.0 : 0) };
    const F_dart_left = { x: X_frontDart - frontDart / 2, y: -balance * 0.25 + (isVCut ? (vCutDepth * 0.35) : 0) };
    const F_dart_apex = { x: X_frontDart, y: frontDartLen + (isVCut ? 1.5 : 0) };
    const F_dart_right = { x: X_frontDart + frontDart / 2, y: -balance * 0.25 + (isVCut ? (vCutDepth * 0.35) : 0) };
    const F_waist_center = { x: W_grid, y: (0.5 - balance) + (isVCut ? vCutDepth : 0) };
    const F_hip_side = { x: X_side, y: vb };
    const F_hem_side = { x: X_side - flareOffset, y: effectiveLength - hemCurveLift };
    const F_hem_center = { x: W_grid, y: effectiveLength };
    const F_hip_center = { x: W_grid, y: vb };

    return {
        type: 'skirt',
        style,
        isCircular: false,
        ot, ob, vb, skirtLength: effectiveLength,
        pt, pb, rise,
        St, Sb, W_grid, X_side,
        totalDart, sideDart, backDart, frontDart,
        flareOffset, hemCurveLift,
        hasSlit, slitHeight,
        isWrap, wrapOverlap,
        isPleated, yokeHeight, pleatStep,
        hasLaceup, laceupHeight,
        hasRuched, isMicro,
        // Точки ЗП
        B_waist_center, B_dart_left, B_dart_apex, B_dart_right, B_waist_side,
        B_hip_side, B_hem_side, B_hem_center, B_hip_center,
        // Точки ПП
        F_waist_side, F_dart_left, F_dart_apex, F_dart_right, F_waist_center,
        F_hip_side, F_hem_side, F_hem_center, F_hip_center,
        // Габариты
        widthCm: Math.ceil(W_grid + Math.abs(flareOffset) * 2 + (isWrap ? wrapOverlap : 0) + 10),
        heightCm: Math.ceil(effectiveLength + 10),
        // Пояс
        beltLength: ot + pt * 2 + 4.0,
        beltWidth: 7.0
    };
}

// Генерация SVG разметки для юбок
function generateSkirtPiecesMarkup(g, options = {}) {
    const isSeparate = options.separate ?? state.separate;
    const showClassic = options.showClassic ?? state.classicStyle;
    const frontShiftX = options.frontShiftX ?? (isSeparate ? (18 * CM) : 0);

    const colBack = showClassic ? '#09090b' : '#1d4ed8';
    const colFront = showClassic ? '#09090b' : '#be123c';
    const fillBack = showClassic ? '#ffffff' : 'rgba(29, 78, 216, 0.04)';
    const fillFront = showClassic ? '#ffffff' : 'rgba(190, 18, 60, 0.04)';

    // --- КРУГЛЫЕ ЮБКИ (ПОЛУСОЛНЦЕ / СОЛНЦЕ) ---
    if (g.isCircular) {
        const rw = g.rWaist * CM;
        const rh = g.rHem * CM;
        const arcWaist = `M 0 ${-rw} A ${rw} ${rw} 0 0 1 ${rw} 0`;
        const arcHem = `L ${rh} 0 A ${rh} ${rh} 0 0 0 0 ${-rh} Z`;
        const circleOutline = `M 0 ${-rw} A ${rw} ${rw} 0 0 1 ${rw} 0 L ${rh} 0 A ${rh} ${rh} 0 0 0 0 ${-rh} Z`;

        const titleRu = g.isSun ? 'ЮБКА СОЛНЦЕ (КЛЕШ 360°)' : 'ЮБКА ПОЛУСОЛНЦЕ (КЛЕШ 180°)';
        const descRu = g.isSun ? '2 детали со сгибом' : '1 деталь со сгибом (или 2 с боковыми швами)';

        const beltW = g.beltLength * CM;
        const beltH = g.beltWidth * CM;
        const beltY = 25 * CM;

        return {
            isCircular: true,
            totalWidthCm: g.widthCm + 15,
            totalHeightCm: g.heightCm + 15,
            frontShiftX: 0,
            markup: `
                <!-- Сектор юбки полусолнце / солнце -->
                <g id="skirt-circular" transform="translate(${25 * CM}, ${g.heightCm * CM})">
                    <!-- Заливка и контур -->
                    <path d="${circleOutline}" fill="rgba(99, 102, 241, 0.05)" stroke="#4f46e5" stroke-width="2.0" stroke-linejoin="round"/>

                    <!-- Осевые линии -->
                    <line x1="0" y1="0" x2="${rh + 40}" y2="0" stroke="#71717a" stroke-width="0.8" stroke-dasharray="6,4"/>
                    <line x1="0" y1="0" x2="0" y2="${-rh - 40}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="6,4"/>
                    <circle cx="0" cy="0" r="4" fill="#4f46e5"/>

                    <!-- Подписи срезов -->
                    <text x="${(rw + rh) / 2}" y="18" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#3f3f46">[ СГИБ ТКАНИ / СЕРЕДИНА ]</text>
                    <text x="-16" y="${-(rw + rh) / 2}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#3f3f46" transform="rotate(-90 -16 ${-(rw + rh) / 2})">[ БОКОВОЙ ШОВ / КРОМКА ]</text>

                    <!-- Размерные радиусы -->
                    <text x="${rw * 0.7}" y="${-rw * 0.7 - 8}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" fill="#4f46e5">R талии = ${g.rWaist.toFixed(1)} см</text>
                    <text x="${rh * 0.7}" y="${-rh * 0.7 - 12}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold" fill="#4f46e5">Длина юбки = ${g.skirtLength} см (R низа = ${g.rHem.toFixed(1)} см)</text>

                    <!-- Лейбл по центру -->
                    <text x="${(rw + rh) * 0.45}" y="${-(rw + rh) * 0.45}" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="800" fill="#1e1b4b">${titleRu}</text>
                    <text x="${(rw + rh) * 0.45}" y="${-(rw + rh) * 0.45 + 18}" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#475569">${descRu} | От=${g.ot} см</text>
                </g>

                <!-- Пояс юбки -->
                <g id="skirt-belt" transform="translate(${25 * CM}, ${(g.heightCm + 4) * CM})">
                    <rect x="0" y="0" width="${beltW}" height="${beltH}" fill="rgba(79, 70, 229, 0.04)" stroke="#4f46e5" stroke-width="1.8" rx="2"/>
                    <line x1="0" y1="${beltH / 2}" x2="${beltW}" y2="${beltH / 2}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="4,3"/>
                    <text x="${beltW / 2}" y="${beltH / 2 - 4}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#18181b">ПОЯС ЮБКИ (${g.beltLength.toFixed(1)} × ${g.beltWidth} см)</text>
                    <text x="${beltW / 2}" y="${beltH / 2 + 15}" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#52525b">1 деталь со сгибом вдоль пунктира</text>
                </g>
            `,
            totalWidthCm: g.widthCm,
            totalHeightCm: g.heightCm
        };
    }

    // --- КОНСТРУКТИВНЫЕ ЮБКИ (А-силуэт / Трапеция, Прямая, Карандаш) ---
    // Заднее полотнище
    const backOutlinePath = `
        M 0 ${g.B_hem_center.y * CM}
        L 0 0
        L ${g.B_dart_left.x * CM} ${g.B_dart_left.y * CM}
        L ${g.B_dart_apex.x * CM} ${g.B_dart_apex.y * CM}
        L ${g.B_dart_right.x * CM} ${g.B_dart_right.y * CM}
        Q ${(g.B_dart_right.x + g.B_waist_side.x) * 0.5 * CM} ${(g.B_waist_side.y * 0.5) * CM}, ${g.B_waist_side.x * CM} ${g.B_waist_side.y * CM}
        Q ${(g.B_waist_side.x + 0.6) * CM} ${(g.B_hip_side.y * 0.6) * CM}, ${g.B_hip_side.x * CM} ${g.B_hip_side.y * CM}
        L ${g.B_hem_side.x * CM} ${g.B_hem_side.y * CM}
        Q ${(g.B_hem_side.x * 0.5) * CM} ${(g.B_hem_center.y + 0.3) * CM}, 0 ${g.B_hem_center.y * CM}
        Z
    `;

    // Переднее полотнище (строится от x = X_side до x = W_grid)
    const frontOutlinePath = `
        M ${g.F_waist_side.x * CM} ${g.F_waist_side.y * CM}
        Q ${(g.F_waist_side.x + 0.6) * CM} ${(g.F_hip_side.y * 0.6) * CM}, ${g.F_hip_side.x * CM} ${g.F_hip_side.y * CM}
        L ${g.F_hem_side.x * CM} ${g.F_hem_side.y * CM}
        Q ${(g.F_hem_side.x * 0.5 + g.F_hem_center.x * 0.5) * CM} ${(g.F_hem_center.y + 0.3) * CM}, ${g.F_hem_center.x * CM} ${g.F_hem_center.y * CM}
        L ${g.F_waist_center.x * CM} ${g.F_waist_center.y * CM}
        Q ${(g.F_waist_center.x * 0.7 + g.F_dart_right.x * 0.3) * CM} ${(g.F_dart_right.y * 0.5) * CM}, ${g.F_dart_right.x * CM} ${g.F_dart_right.y * CM}
        L ${g.F_dart_apex.x * CM} ${g.F_dart_apex.y * CM}
        L ${g.F_dart_left.x * CM} ${g.F_dart_left.y * CM}
        Q ${(g.F_dart_left.x + g.F_waist_side.x) * 0.5 * CM} ${(g.F_waist_side.y * 0.5) * CM}, ${g.F_waist_side.x * CM} ${g.F_waist_side.y * CM}
        Z
    `;

    // Пояс
    const beltW = g.beltLength * CM;
    const beltH = g.beltWidth * CM;
    const beltY = (g.heightCm + 3) * CM;

    let styleTitleRu = 'ПРЯМАЯ КЛАССИЧЕСКАЯ';
    if (g.style === 'wrap-micro-pleated') styleTitleRu = 'МИКРО-ПЛИССЕ НА ЗАПАХЕ (18–28 СМ)';
    else if (g.style === 'double-high-slit') styleTitleRu = 'С ДВУМЯ ВЫСОКИМИ РАЗРЕЗАМИ ДО ТАЛИИ';
    else if (g.style === 'ruched-drawstring') styleTitleRu = 'АСИММЕТРИЧНАЯ НА КУЛИСКЕ (1.6X)';
    else if (g.style === 'booty-shorts') styleTitleRu = 'МИКРО-ШОРТЫ / ЧИКИС (BOOTY SHORTS)';
    else if (g.style === 'garter-peplum') styleTitleRu = 'КОРСЕТНАЯ БАСКА С ПАЖАМИ ДЛЯ ЧУЛОК';
    else if (g.style === 'a-line') styleTitleRu = 'ТРАПЕЦИЯ МИДИ (А-СИЛУЭТ)';
    else if (g.style === 'mini-trapeze') styleTitleRu = 'МИНИ-ТРАПЕЦИЯ (А-СИЛУЭТ)';
    else if (g.style === 'mini-laceup') styleTitleRu = 'МИНИ СО ШНУРОВКОЙ ПО БЕДРУ';
    else if (g.style === 'mini-ruched') styleTitleRu = 'МИНИ С БОКОВОЙ КУЛИСКОЙ';
    else if (g.style === 'mini-micro') styleTitleRu = 'Y2K МИКРО-ЮБКА (30 СМ)';
    else if (g.style === 'mini-pleated') styleTitleRu = 'ТЕННИСНАЯ МИНИ (ПЛИССЕ)';
    else if (g.style === 'mini-wrap') styleTitleRu = 'МИНИ С ЗАПАХОМ';
    else if (g.style === 'mini-slit') styleTitleRu = 'МИНИ С РАЗРЕЗОМ';
    else if (g.style === 'mini-skater') styleTitleRu = 'МИНИ-СКЕЙТЕР (КЛЕШ)';
    else if (g.style === 'pencil') styleTitleRu = 'КАРАНДАШ (ЗАУЖЕННАЯ)';

    const slitMarkup = g.hasSlit ? `
        <!-- Вертикальный разрез по ноге -->
        <line x1="${g.F_dart_apex.x * CM}" y1="${g.F_hem_side.y * CM}" x2="${g.F_dart_apex.x * CM}" y2="${(g.skirtLength - g.slitHeight) * CM}" stroke="#e11d48" stroke-width="2.0" stroke-dasharray="4,2"/>
        <circle cx="${g.F_dart_apex.x * CM}" cy="${(g.skirtLength - g.slitHeight) * CM}" r="3" fill="#e11d48"/>
        <text x="${g.F_dart_apex.x * CM + 6}" y="${(g.skirtLength - g.slitHeight * 0.45) * CM}" font-family="Inter, sans-serif" font-size="8.5" font-weight="bold" fill="#e11d48">✂ ${g.hasDoubleSlit ? 'РАЗРЕЗ ДО ТАЛИИ' : `РАЗРЕЗ ${g.slitHeight.toFixed(0)} см`}</text>
    ` : '';

    const doubleSlitMarkupBack = g.hasDoubleSlit ? `
        <!-- Разрез до талии на спинке -->
        <line x1="${g.B_hem_side.x * CM}" y1="${g.B_hem_side.y * CM}" x2="${g.B_waist_side.x * CM}" y2="${g.B_waist_side.y * CM + 30}" stroke="#e11d48" stroke-width="2.0" stroke-dasharray="5,3"/>
        <text x="${g.B_hem_side.x * CM - 8}" y="${(g.skirtLength * 0.5) * CM}" font-family="Inter, sans-serif" font-size="8.5" font-weight="bold" fill="#e11d48" text-anchor="end">✂ ОТКРЫТОЕ БЕДРО (РАЗРЕЗ)</text>
    ` : '';

    const garterMarkup = g.isGarterPeplum ? `
        <!-- Пажи и крепления для чулок -->
        <circle cx="${(g.W_grid * 0.70) * CM}" cy="${g.skirtLength * CM - 4}" r="3" fill="#e11d48"/>
        <circle cx="${(g.W_grid * 0.90) * CM}" cy="${g.skirtLength * CM - 4}" r="3" fill="#e11d48"/>
        <text x="${(g.W_grid * 0.80) * CM}" y="${g.skirtLength * CM + 12}" text-anchor="middle" font-family="JetBrains Mono" font-size="8" font-weight="bold" fill="#e11d48">⚡ ПАЖИ ДЛЯ ЧУЛОК (длина 24 см)</text>
    ` : '';

    const laceupMarkupBack = g.hasLaceup ? `
        <!-- Люверсы шнуровки на ЗП -->
        <circle cx="${g.B_hem_side.x * CM - 6}" cy="${(g.skirtLength - 3) * CM}" r="2.5" fill="#f43f5e"/>
        <circle cx="${g.B_hem_side.x * CM - 6}" cy="${(g.skirtLength - 8) * CM}" r="2.5" fill="#f43f5e"/>
        <circle cx="${g.B_hem_side.x * CM - 6}" cy="${(g.skirtLength - 13) * CM}" r="2.5" fill="#f43f5e"/>
        <text x="${g.B_hem_side.x * CM - 10}" y="${(g.skirtLength - 8) * CM}" text-anchor="end" font-family="Inter, sans-serif" font-size="8" font-weight="bold" fill="#f43f5e">⚡ ЛЮВЕРСЫ (d=4мм)</text>
    ` : '';

    const laceupMarkupFront = g.hasLaceup ? `
        <!-- Люверсы и шнуровка на ПП -->
        <circle cx="${g.F_hem_side.x * CM + 6}" cy="${(g.skirtLength - 3) * CM}" r="2.5" fill="#f43f5e"/>
        <circle cx="${g.F_hem_side.x * CM + 6}" cy="${(g.skirtLength - 8) * CM}" r="2.5" fill="#f43f5e"/>
        <circle cx="${g.F_hem_side.x * CM + 6}" cy="${(g.skirtLength - 13) * CM}" r="2.5" fill="#f43f5e"/>
        <text x="${g.F_hem_side.x * CM + 10}" y="${(g.skirtLength - 8) * CM}" font-family="Inter, sans-serif" font-size="8" font-weight="bold" fill="#f43f5e">⚡ ШНУРОВКА</text>
    ` : '';

    const ruchedMarkup = g.hasRuched ? `
        <!-- Кулиска под шнурок со сборкой по боку -->
        <text x="${((g.X_side + g.W_grid) * 0.5) * CM}" y="${(g.skirtLength - 4) * CM}" text-anchor="middle" font-family="Inter, sans-serif" font-size="8.5" font-weight="bold" fill="#7c3aed">✨ КУЛИСКА 1.6x (сборка драпировки шнуром)</text>
    ` : '';

    const microMarkup = g.isMicro ? `
        <text x="${((g.X_side + g.W_grid) * 0.5) * CM}" y="${(g.skirtLength - 2) * CM}" text-anchor="middle" font-family="Inter, sans-serif" font-size="8.5" font-weight="bold" fill="#db2777">🔥 Y2K ULTRA-MINI (30 см) - низкая посадка</text>
    ` : '';

    const wrapMarkup = g.isWrap ? `
        <!-- Нахлест запаха переда (+${g.wrapOverlap} см) -->
        <path d="M ${g.W_grid * CM} 0 L ${(g.W_grid + g.wrapOverlap) * CM} 0 L ${(g.W_grid + g.wrapOverlap) * CM} ${(g.skirtLength - 5) * CM} L ${g.W_grid * CM} ${g.skirtLength * CM} Z" fill="rgba(245, 158, 11, 0.08)" stroke="#d97706" stroke-width="1.6" stroke-dasharray="5,3"/>
        <text x="${(g.W_grid + g.wrapOverlap * 0.5) * CM}" y="${(g.skirtLength * 0.5) * CM}" font-family="Inter, sans-serif" font-size="8.5" font-weight="bold" fill="#d97706" transform="rotate(-90 ${(g.W_grid + g.wrapOverlap * 0.5) * CM} ${(g.skirtLength * 0.5) * CM})">[ ЗАПАХ +${g.wrapOverlap} см / БЫСТРАЯ ЗАСТЕЖКА ]</text>
    ` : '';

    const vCutMarkup = Boolean(state.vCutWaist) ? `
        <!-- Метка V-Cut пояса -->
        <text x="${(g.F_waist_center.x - 4) * CM}" y="${g.F_waist_center.y * CM - 6}" text-anchor="end" font-family="JetBrains Mono" font-size="8" font-weight="bold" fill="#e11d48">⚡ V-CUT −${state.vCutDepth} см (комфорт для сидячих поз)</text>
    ` : '';

    const scrunchMarkup = Boolean(state.scrunchEffect) ? `
        <!-- Метка сборки Scrunch -->
        <text x="14" y="${(g.skirtLength * 0.25) * CM}" font-family="JetBrains Mono" font-size="8.5" font-weight="bold" fill="#7c3aed" transform="rotate(-90 14 ${(g.skirtLength * 0.25) * CM})">✨ СБОРКА НА РЕЗИНКУ (SCRUNCH 1.5x)</text>
    ` : '';

    const pleatedMarkupBack = g.isPleated ? `
        <!-- Линия кокетки ЗП -->
        <line x1="0" y1="${g.yokeHeight * CM}" x2="${g.X_side * CM}" y2="${g.yokeHeight * CM}" stroke="#4f46e5" stroke-width="1.2" stroke-dasharray="4,3"/>
        <text x="${(g.X_side * 0.5) * CM}" y="${(g.yokeHeight - 1.2) * CM}" text-anchor="middle" font-family="Inter, sans-serif" font-size="8" font-weight="bold" fill="#4f46e5">ЛИНИЯ КОКЕТКИ (ниже — складки)</text>
    ` : '';

    const pleatedMarkupFront = g.isPleated ? `
        <!-- Линия кокетки ПП -->
        <line x1="${g.X_side * CM}" y1="${g.yokeHeight * CM}" x2="${g.W_grid * CM}" y2="${g.yokeHeight * CM}" stroke="#4f46e5" stroke-width="1.2" stroke-dasharray="4,3"/>
        <text x="${((g.X_side + g.W_grid) * 0.5) * CM}" y="${(g.yokeHeight - 1.2) * CM}" text-anchor="middle" font-family="Inter, sans-serif" font-size="8" font-weight="bold" fill="#4f46e5">ЛИНИЯ КОКЕТКИ (ниже — складки)</text>
    ` : '';

    return {
        isCircular: false,
        backOutlinePath,
        frontOutlinePath,
        frontShiftX,
        totalWidthCm: g.widthCm + (frontShiftX > 0 ? 25 : 10),
        totalHeightCm: g.heightCm + 18,
        markup: `
            <!-- Заднее полотнище юбки -->
            <g id="piece-skirt-back">
                <path d="${backOutlinePath}" fill="${fillBack}" stroke="${colBack}" stroke-width="2.0" stroke-linejoin="round"/>
                <!-- Линия бедер ЗП -->
                <line x1="0" y1="${g.B_hip_center.y * CM}" x2="${g.B_hip_side.x * CM}" y2="${g.B_hip_side.y * CM}" stroke="#71717a" stroke-width="0.7" stroke-dasharray="4,3"/>
                <!-- Долевая нить -->
                <line x1="${(g.X_side * 0.25) * CM}" y1="${(g.vb + 3) * CM}" x2="${(g.X_side * 0.25) * CM}" y2="${(g.skirtLength - 5) * CM}" stroke="#18181b" stroke-width="1.0" marker-start="url(#arrow-start)" marker-end="url(#arrow-end)"/>
                <!-- Сгиб / середина -->
                <text x="14" y="${(g.skirtLength * 0.5) * CM}" font-family="Inter, sans-serif" font-size="10" font-weight="bold" fill="#52525b" transform="rotate(-90 14 ${(g.skirtLength * 0.5) * CM})">[ СГИБ ТКАНИ / СЕРЕДИНА СПИНКИ ]</text>
                <!-- Подписи -->
                <text x="${(g.X_side * 0.5) * CM}" y="${(g.vb - 2) * CM}" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="${colBack}">ЗАДНЕЕ ПОЛОТНИЩЕ</text>
                <text x="${(g.X_side * 0.5) * CM}" y="${(g.vb + 0) * CM}" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#52525b">${styleTitleRu} | 1 деталь со сгибом</text>
                ${pleatedMarkupBack}
                ${laceupMarkupBack}
                ${doubleSlitMarkupBack}
                ${scrunchMarkup}
            </g>

            <!-- Переднее полотнище юбки -->
            <g id="piece-skirt-front" transform="translate(${frontShiftX}, 0)">
                <path d="${frontOutlinePath}" fill="${fillFront}" stroke="${colFront}" stroke-width="2.0" stroke-linejoin="round"/>
                <!-- Линия бедер ПП -->
                <line x1="${g.F_hip_side.x * CM}" y1="${g.F_hip_side.y * CM}" x2="${g.F_hip_center.x * CM}" y2="${g.F_hip_center.y * CM}" stroke="#71717a" stroke-width="0.7" stroke-dasharray="4,3"/>
                <!-- Долевая нить -->
                <line x1="${((g.X_side + g.W_grid) * 0.5) * CM}" y1="${(g.vb + 3) * CM}" x2="${((g.X_side + g.W_grid) * 0.5) * CM}" y2="${(g.skirtLength - 5) * CM}" stroke="#18181b" stroke-width="1.0" marker-start="url(#arrow-start)" marker-end="url(#arrow-end)"/>
                <!-- Сгиб переда -->
                <text x="${(g.W_grid * CM) - 14}" y="${(g.skirtLength * 0.5) * CM}" font-family="Inter, sans-serif" font-size="10" font-weight="bold" fill="#52525b" transform="rotate(-90 ${(g.W_grid * CM) - 14} ${(g.skirtLength * 0.5) * CM})">[ СГИБ ТКАНИ / СЕРЕДИНА ПЕРЕДА ]</text>
                <!-- Подписи -->
                <text x="${((g.X_side + g.W_grid) * 0.5) * CM}" y="${(g.vb - 2) * CM}" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="${colFront}">ПЕРЕДНЕЕ ПОЛОТНИЩЕ</text>
                <text x="${((g.X_side + g.W_grid) * 0.5) * CM}" y="${(g.vb + 0) * CM}" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#52525b">1 деталь со сгибом (От ${g.ot}, Об ${g.ob})</text>
                ${slitMarkup}
                ${laceupMarkupFront}
                ${ruchedMarkup}
                ${microMarkup}
                ${wrapMarkup}
                ${pleatedMarkupFront}
                ${garterMarkup}
                ${vCutMarkup}
            </g>

            <!-- Пояс юбки -->
            <g id="piece-skirt-belt" transform="translate(0, ${beltY})">
                <rect x="0" y="0" width="${beltW}" height="${beltH}" fill="rgba(99, 102, 241, 0.05)" stroke="#4f46e5" stroke-width="1.8" rx="2"/>
                <line x1="0" y1="${beltH / 2}" x2="${beltW}" y2="${beltH / 2}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="4,3"/>
                <text x="${beltW / 2}" y="${beltH / 2 - 4}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#18181b">ПОЯС ЮБКИ (${g.beltLength.toFixed(1)} × ${g.beltWidth} см)</text>
                <text x="${beltW / 2}" y="${beltH / 2 + 15}" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#52525b">1 дет. со сгибом (включая припуск 3 см на пуговицу)</text>
            </g>
        `,
        backOutlinePath,
        frontOutlinePath,
        totalWidthCm: g.widthCm + (frontShiftX / CM),
        totalHeightCm: g.heightCm
    };
}
