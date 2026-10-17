// js/cad-renderer.js - Отрисовка лекал, интерактивный холст и навигация

let viewState = {
    scale: 0.85,
    panX: 60,
    panY: 60,
    isDragging: false,
    startX: 0,
    startY: 0
};

function generatePatternPiecesMarkup(g, options = {}) {
    const showClassic = options.showClassic ?? state.classicStyle;
    const frontShiftX = options.frontShiftX ?? (state.separate ? 16 * CM : 0);
    const sleeveOriginX = options.sleeveOriginX ?? (g.W_grid + (frontShiftX > 0 ? 28 : 14) + g.W_sleeve / 2);

    const colBack = showClassic ? '#09090b' : '#1d4ed8';
    const colFront = showClassic ? '#09090b' : '#be123c';
    const colSleeve = showClassic ? '#09090b' : '#047857';
    const fillBack = showClassic ? '#ffffff' : 'rgba(29, 78, 216, 0.04)';
    const fillFront = showClassic ? '#ffffff' : 'rgba(190, 18, 60, 0.04)';

    // 1. Контур СПИНКИ
    const backOutlinePath = `
        M 0 ${g.Y_H * CM}
        L 0 0
        Q ${g.A5.x * CM} ${g.A5.y * CM}, ${g.A4.x * CM} ${g.A4.y * CM}
        L ${g.sh_D1.x * CM} ${g.sh_D1.y * CM}
        L ${g.sh_Apex.x * CM} ${g.sh_Apex.y * CM}
        L ${g.sh_D2.x * CM} ${g.sh_D2.y * CM}
        L ${g.P1.x * CM} ${g.P1.y * CM}
        C ${(g.X_G - 0.15) * CM} ${(g.P1.y + 3.0) * CM}, ${g.P2.x * CM} ${(g.P2.y - 1.0) * CM}, ${g.P2.x * CM} ${g.P2.y * CM}
        Q ${g.P3.x * CM} ${g.P3.y * CM}, ${g.G4.x * CM} ${g.G4.y * CM}
        L ${g.T3.x * CM} ${g.T3.y * CM}
        L ${g.B3.x * CM} ${g.B3.y * CM}
        L ${g.B3.x * CM} ${g.Y_H * CM}
        Z
    `;

    const backDiamondPath = `
        M ${g.X_G8 * CM} ${(g.Y_G + 1.0) * CM}
        L ${g.T7.x * CM} ${g.T7.y * CM}
        L ${g.B8_bot.x * CM} ${g.B8_bot.y * CM}
        L ${g.T8.x * CM} ${g.T8.y * CM}
        Z
    `;

    // 2. Контур ПОЛОЧКИ (с правильной кинематикой P5_open и P6_open)
    const ctrl_f_open = {
        x: (g.P6_open.x + g.P5_open.x) * 0.5 - 0.5,
        y: (g.P6_open.y + g.P5_open.y) * 0.5 - 0.5
    };

    const frontOutlinePath = `
        M ${g.B4.x * CM} ${g.Y_H * CM}
        L ${g.B4.x * CM} ${g.B4.y * CM}
        L ${g.T4.x * CM} ${g.T4.y * CM}
        L ${g.G4.x * CM} ${g.G4.y * CM}
        Q ${g.P7.x * CM} ${g.P7.y * CM}, ${g.P6_open.x * CM} ${g.P6_open.y * CM}
        Q ${ctrl_f_open.x * CM} ${ctrl_f_open.y * CM}, ${g.P5_open.x * CM} ${g.P5_open.y * CM}
        L ${g.V9.x * CM} ${g.V9.y * CM}
        L ${g.G7.x * CM} ${g.G7.y * CM}
        L ${g.V7.x * CM} ${g.V7.y * CM}
        L ${g.V3.x * CM} ${g.V3.y * CM}
        C ${g.V5_c1.x * CM} ${g.V5_c1.y * CM}, ${g.V5_c2.x * CM} ${g.V5_c2.y * CM}, ${g.V4.x * CM} ${g.V4.y * CM}
        L ${g.X_G3 * CM} ${(g.Y_H + 1.2) * CM}
        Q ${(g.X_G3 * 0.65 + g.B4.x * 0.35) * CM} ${(g.Y_H + 1.2) * CM}, ${g.B4.x * CM} ${g.Y_H * CM}
        Z
    `;

    const frontDiamondPath = `
        M ${g.front_dart_top.x * CM} ${g.front_dart_top.y * CM}
        L ${g.T10.x * CM} ${g.T10.y * CM}
        L ${g.B_front_bot.x * CM} ${g.B_front_bot.y * CM}
        L ${g.T11.x * CM} ${g.T11.y * CM}
        Z
    `;

    // 3. Контур АНАТОМИЧЕСКОГО РУКАВА
    const slCenter = sleeveOriginX * CM;
    const slTopY = 0;
    const slCapY = g.H_cap * CM;
    const slBotY = g.L_sleeve * CM;
    const halfW = (g.W_sleeve / 2) * CM;
    const halfWrist = (g.W_wrist / 2) * CM;

    // Правая сторона = Передняя часть (с выемкой внизу)
    // Левая сторона = Локтевая часть (выпуклая)
    const sleeveOutlinePath = `
        M ${slCenter} ${slTopY}
        C ${slCenter + halfW * 0.45} ${slTopY}, ${slCenter + halfW * 0.70} ${slCapY * 1.12}, ${slCenter + halfW} ${slCapY}
        L ${slCenter + halfWrist} ${slBotY}
        L ${slCenter - halfWrist} ${slBotY}
        L ${slCenter - halfW} ${slCapY}
        C ${slCenter - halfW * 0.78} ${slCapY * 0.88}, ${slCenter - halfW * 0.50} ${slTopY}, ${slCenter} ${slTopY}
        Z
    `;

    // 4. Надсечки (Notches)
    const notchLen = 6; // 6 мм надсечка
    const notchesMarkup = `
        <!-- Надсечка спинки П2 -->
        <line x1="${(g.P2.x - notchLen/10) * CM}" y1="${g.P2.y * CM}" x2="${(g.P2.x + notchLen/10) * CM}" y2="${g.P2.y * CM}" stroke="#dc2626" stroke-width="1.6"/>
        <!-- Надсечка полочки П6 -->
        <g transform="translate(${frontShiftX}, 0)">
            <line x1="${(g.P6_open.x - notchLen/10) * CM}" y1="${g.P6_open.y * CM}" x2="${(g.P6_open.x + notchLen/10) * CM}" y2="${g.P6_open.y * CM}" stroke="#dc2626" stroke-width="1.6"/>
        </g>
        <!-- Надсечки рукава: вершина, перед (1 засечка), спинка (2 засечки) -->
        <g id="sleeve-notches">
            <line x1="${slCenter}" y1="${slTopY - notchLen}" x2="${slCenter}" y2="${slTopY + notchLen}" stroke="#dc2626" stroke-width="1.6"/>
            <!-- Передняя надсечка рукава -->
            <line x1="${slCenter + halfW * 0.58 - notchLen}" y1="${slCapY * 0.55}" x2="${slCenter + halfW * 0.58 + notchLen}" y2="${slCapY * 0.55}" stroke="#dc2626" stroke-width="1.6"/>
            <!-- Локтевая надсечка рукава (двойная) -->
            <line x1="${slCenter - halfW * 0.62 - notchLen}" y1="${slCapY * 0.50 - 3}" x2="${slCenter - halfW * 0.62 + notchLen}" y2="${slCapY * 0.50 - 3}" stroke="#dc2626" stroke-width="1.6"/>
            <line x1="${slCenter - halfW * 0.62 - notchLen}" y1="${slCapY * 0.50 + 3}" x2="${slCenter - halfW * 0.62 + notchLen}" y2="${slCapY * 0.50 + 3}" stroke="#dc2626" stroke-width="1.6"/>
        </g>
    `;

    // 5. Маркировка «СГИБ ТКАНИ» и линии долевой нити
    const markingsMarkup = `
        <!-- Спинка: Сгиб и долевая -->
        <g font-family="JetBrains Mono, monospace" font-size="9" font-weight="600" fill="#52525b">
            <text x="${12}" y="${(g.Y_T - 4) * CM}" transform="rotate(-90 12 ${(g.Y_T - 4) * CM})">[ СГИБ ТКАНИ / СЕРЕДИНА СПИНКИ ]</text>
            <line x1="${3.5 * CM}" y1="${(g.Y_G + 2) * CM}" x2="${3.5 * CM}" y2="${(g.Y_H - 4) * CM}" stroke="#27272a" stroke-width="0.8" marker-start="url(#arrow-start)" marker-end="url(#arrow-end)"/>
            <text x="${3.8 * CM}" y="${(g.Y_T) * CM}" font-size="8">ДОЛЕВАЯ НИТЬ</text>
        </g>
        <!-- Полочка: Сгиб / край борта и долевая -->
        <g transform="translate(${frontShiftX}, 0)" font-family="JetBrains Mono, monospace" font-size="9" font-weight="600" fill="#52525b">
            <text x="${(g.X_G3 * CM) - 10}" y="${(g.Y_T - 4) * CM}" transform="rotate(-90 ${(g.X_G3 * CM) - 10} ${(g.Y_T - 4) * CM})">[ ЛИНИЯ ПОЛУЗАНОСА / СГИБ ИЛИ КРАЙ БОРТА ]</text>
            <line x1="${(g.X_G6) * CM}" y1="${(g.G7.y + 7) * CM}" x2="${(g.X_G6) * CM}" y2="${(g.Y_H - 4) * CM}" stroke="#27272a" stroke-width="0.8"/>
            <text x="${(g.X_G6 + 0.3) * CM}" y="${(g.Y_T + 4) * CM}" font-size="8">ДОЛЕВАЯ НИТЬ</text>
        </g>
        <!-- Рукав: долевая и подписи сторон -->
        <g font-family="JetBrains Mono, monospace" font-size="9" font-weight="600" fill="#52525b">
            <line x1="${slCenter}" y1="${slTopY + 15}" x2="${slCenter}" y2="${slBotY - 15}" stroke="#27272a" stroke-width="0.8"/>
            <text x="${slCenter + 4}" y="${(slCapY + slBotY) * 0.5 + 24}" font-size="8">ДОЛЕВАЯ НИТЬ</text>
            <text x="${slCenter + halfW * 0.4}" y="${slCapY * 0.7}" fill="#047857">ПЕРЕД ➔</text>
            <text x="${slCenter - halfW * 0.6}" y="${slCapY * 0.7}" fill="#1d4ed8">⬅ СПИНКА</text>
        </g>
    `;

    return {
        backOutlinePath, backDiamondPath,
        frontOutlinePath, frontDiamondPath,
        sleeveOutlinePath,
        notchesMarkup, markingsMarkup,
        colBack, colFront, colSleeve, fillBack, fillFront,
        frontShiftX, sleeveOriginX, slCenter, slTopY, slCapY, slBotY, halfW,
        ctrl_f_open
    };
}

function renderPattern() {
    const g = calculateGeometry();
    const svg = document.getElementById('pattern-svg');
    if (!svg) return;

    updateCalculationTable(g);
    updateExportDimensions(g);

    const isSeparate = state.separate;
    const showSleeve = state.showSleeve;
    const showGrid = state.showGrid;
    const showSeam = state.showSeamAllowance;

    const sepBtn = document.getElementById('btn-separate-mode');
    if (sepBtn) {
        sepBtn.textContent = isSeparate ? '⇄ Раздельный вид (для раскроя)' : '⇄ Совмещенный чертеж (в сетке)';
    }

    const p = generatePatternPiecesMarkup(g);
    const totalWidthCm = showSleeve ? (p.sleeveOriginX + g.W_sleeve / 2 + 6) : (g.W_grid + (isSeparate ? 24 : 10));
    const totalHeightCm = Math.max(g.Y_H, g.L_sleeve) + 14;

    let html = `<g id="viewport" transform="translate(${viewState.panX}, ${viewState.panY}) scale(${viewState.scale})">`;

    // Маркеры стрелок для долевых нитей
    html += `
        <defs>
            <marker id="arrow-start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#27272a"/>
            </marker>
            <marker id="arrow-end" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#27272a"/>
            </marker>
        </defs>
    `;

    // 0. Сетка листов А4
    if (state.showA4Grid) {
        const a4W = 18.0 * CM;
        const a4H = 26.7 * CM;
        const startX = -2.0 * CM;
        const startY = Math.floor(g.A4.y * CM) - 20;
        const cols = Math.ceil(((totalWidthCm * CM) - startX) / a4W);
        const rows = Math.ceil(((totalHeightCm * CM) - startY) / a4H);
        html += `<g id="a4-tiling-layer">`;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = startX + c * a4W;
                const y = startY + r * a4H;
                const label = String.fromCharCode(65 + r) + (c + 1);
                html += `
                    <rect x="${x}" y="${y}" width="${a4W}" height="${a4H}" fill="none" stroke="#16a34a" stroke-width="1" stroke-dasharray="6,4" opacity="0.85"/>
                    <rect x="${x + 4}" y="${y + 4}" width="46" height="17" rx="2" fill="#16a34a" opacity="0.9"/>
                    <text x="${x + 27}" y="${y + 15.5}" text-anchor="middle" fill="#ffffff" font-size="10" font-family="JetBrains Mono" font-weight="bold">А4 ${label}</text>
                `;
            }
        }
        html += `</g>`;
    }

    // 1. Заливка деталей
    html += `<path d="${p.backOutlinePath}" fill="${p.fillBack}" stroke="none" />`;
    html += `<g transform="translate(${p.frontShiftX}, 0)"><path d="${p.frontOutlinePath}" fill="${p.fillFront}" stroke="none" /></g>`;

    // 2. Вспомогательные линии базисной сетки
    if (showGrid) {
        html += `
        <g id="construction-lines" stroke="#64748b" stroke-width="0.65" fill="none">
            <line x1="0" y1="0" x2="${g.X_G * CM}" y2="0" />
            <line x1="0" y1="${g.Y_G * CM}" x2="${g.X_G3 * CM + p.frontShiftX}" y2="${g.Y_G * CM}" />
            <line x1="0" y1="${g.Y_T * CM}" x2="${g.T4.x * CM}" y2="${g.Y_T * CM}" />
            <line x1="0" y1="${g.Y_B * CM}" x2="${g.B3.x * CM}" y2="${g.Y_B * CM}" />
            <line x1="${g.X_G * CM}" y1="${-2 * CM}" x2="${g.X_G * CM}" y2="${g.Y_G * CM}" />
            <line x1="${g.A3.x * CM}" y1="0" x2="${g.A4.x * CM}" y2="${g.A4.y * CM}" />
            <line x1="${(g.W_back * 0.48) * CM}" y1="${g.Y_G * CM}" x2="${(g.W_back * 0.48) * CM}" y2="${g.Y_B * CM}" />
            <line x1="${g.X_G4 * CM}" y1="${g.Y_G * CM}" x2="${g.X_G4 * CM}" y2="${g.Y_H * CM}" />

            <g transform="translate(${p.frontShiftX}, 0)">
                <line x1="${g.X_G2 * CM}" y1="${g.Y_V1 * CM}" x2="${g.X_G3 * CM}" y2="${g.Y_V1 * CM}" />
                <line x1="${g.X_G2 * CM}" y1="${(g.Y_V1 - 1) * CM}" x2="${g.X_G2 * CM}" y2="${g.Y_G * CM}" />
                <line x1="${g.X_G6 * CM}" y1="${g.Y_V1 * CM}" x2="${g.X_G6 * CM}" y2="${g.B_front_bot.y * CM}" />
                <line x1="${g.T4.x * CM}" y1="${g.Y_T * CM}" x2="${g.X_G3 * CM}" y2="${g.Y_T * CM}" />
                <line x1="${g.B4.x * CM}" y1="${g.Y_B * CM}" x2="${g.X_G3 * CM}" y2="${g.Y_B * CM}" />
                <circle cx="${g.V8.x * CM}" cy="${g.V8.y * CM}" r="2.5" fill="#2563eb" title="Укорочение вытачки"/>
            </g>
        </g>`;
    }

    // 3. Припуски на швы (если включены)
    if (showSeam) {
        html += `
            <g id="seam-allowances" stroke="#2563eb" stroke-width="1.2" stroke-dasharray="5,3" fill="none" opacity="0.85">
                <path d="${p.backOutlinePath}" transform="scale(1.02) translate(-3, -3)"/>
                <g transform="translate(${p.frontShiftX}, 0)"><path d="${p.frontOutlinePath}" transform="scale(1.02) translate(-3, -3)"/></g>
            </g>
        `;
    }

    // 4. Основные контуры Спинки и Полочки
    html += `
        <g id="piece-back" stroke="${p.colBack}" stroke-width="1.9" fill="none" stroke-linejoin="round" stroke-linecap="round">
            <path d="${p.backOutlinePath}" />
            <path d="${p.backDiamondPath}" />
        </g>
        <g id="piece-front" transform="translate(${p.frontShiftX}, 0)" stroke="${p.colFront}" stroke-width="1.9" fill="none" stroke-linejoin="round" stroke-linecap="round">
            <path d="${p.frontOutlinePath}" />
            <path d="${p.frontDiamondPath}" />
        </g>
    `;

    // 5. Рукав
    if (showSleeve) {
        html += `
            <g id="piece-sleeve">
                <path d="${p.sleeveOutlinePath}" fill="#ffffff" stroke="${p.colSleeve}" stroke-width="1.9" stroke-linejoin="round" />
                <text x="${p.slCenter}" y="${(p.slCapY + p.slBotY) / 2 - 12}" text-anchor="middle" font-size="11" fill="#18181b" font-weight="600">РУКАВ ВТАЧНОЙ</text>
            </g>
        `;
    }

    // 6. Надсечки и маркировка
    if (state.showNotches) html += p.notchesMarkup;
    if (state.showGrainline) html += p.markingsMarkup;

    // 7. Буквенные точки
    if (showGrid) {
        html += renderPointsMarkup(g, p.frontShiftX);
    }

    // 8. Контрольный квадрат 10x10 см (размещен безопасно внизу)
    html += renderScaleSquareMarkup(0, (g.Y_H + 4) * CM);

    html += `</g>`;
    svg.innerHTML = html;
}

function renderPointsMarkup(g, frontShiftX) {
    const backPoints = [
        { pt: g.A, lbl: 'А', dx: -14, dy: 4 },
        { pt: g.A4, lbl: 'А4', dx: -6, dy: -9 },
        { pt: g.A1, lbl: 'А1', dx: 6, dy: 4 },
        { pt: g.P1, lbl: 'П1', dx: 7, dy: 5 },
        { pt: g.P2, lbl: 'П2', dx: -22, dy: 4 },
        { pt: g.P3, lbl: 'П3', dx: -6, dy: -8 },
        { pt: { x: 0, y: g.Y_G }, lbl: 'Г1', dx: -20, dy: 4 },
        { pt: { x: g.X_G, y: g.Y_G }, lbl: 'Г', dx: 2, dy: 15 },
        { pt: g.G4, lbl: 'Г4', dx: 8, dy: 15 },
        { pt: { x: 0, y: g.Y_T }, lbl: 'Т', dx: -15, dy: 4 },
        { pt: g.T3, lbl: 'Т3', dx: -20, dy: 2 },
        { pt: { x: 0, y: g.Y_B }, lbl: 'Б', dx: -15, dy: 4 },
        { pt: g.B3, lbl: 'Б3', dx: 6, dy: 3 }
    ];

    const frontPoints = [
        { pt: g.V1, lbl: 'В1', dx: 6, dy: -4 },
        { pt: g.V3, lbl: 'В3', dx: 5, dy: -4 },
        { pt: g.V4, lbl: 'В4', dx: 6, dy: 4 },
        { pt: g.V7, lbl: 'В7', dx: -22, dy: 6 },
        { pt: g.V9, lbl: 'В9', dx: 6, dy: 2 },
        { pt: g.V8, lbl: 'В8 (укор.)', dx: 8, dy: 8 },
        { pt: g.P5_open, lbl: 'П5', dx: -24, dy: 4 },
        { pt: g.P6_open, lbl: 'П6', dx: 5, dy: 4 },
        { pt: g.P7, lbl: 'П7', dx: -20, dy: -2 },
        { pt: { x: g.X_G2, y: g.Y_G }, lbl: 'Г2', dx: 4, dy: 15 },
        { pt: g.G7, lbl: 'Г7 (Цг)', dx: 6, dy: 10 },
        { pt: { x: g.X_G3, y: g.Y_G }, lbl: 'Г3', dx: 6, dy: 4 },
        { pt: g.T4, lbl: 'Т4', dx: 6, dy: -4 },
        { pt: g.B4, lbl: 'Б4', dx: -22, dy: 3 }
    ];

    let out = `<g font-family="Inter, Arial, sans-serif" font-size="11" font-weight="600" fill="#18181b">`;
    backPoints.forEach(item => {
        const cx = item.pt.x * CM;
        const cy = item.pt.y * CM;
        out += `<circle cx="${cx}" cy="${cy}" r="2.1" fill="#ffffff" stroke="#18181b" stroke-width="1.2"/>`;
        if (item.lbl) out += `<text x="${cx + item.dx}" y="${cy + item.dy}">${item.lbl}</text>`;
    });
    frontPoints.forEach(item => {
        const cx = item.pt.x * CM + frontShiftX;
        const cy = item.pt.y * CM;
        out += `<circle cx="${cx}" cy="${cy}" r="2.1" fill="#ffffff" stroke="#18181b" stroke-width="1.2"/>`;
        if (item.lbl) out += `<text x="${cx + item.dx}" y="${cy + item.dy}">${item.lbl}</text>`;
    });
    out += `</g>`;
    return out;
}

function renderScaleSquareMarkup(x, y) {
    const s = 10 * CM; // 100 мм
    let ticks = '';
    for (let i = 1; i < 10; i++) {
        const pos = i * CM;
        const tickLen = (i === 5) ? 4 : 2;
        ticks += `<line x1="${pos}" y1="0" x2="${pos}" y2="${tickLen}" stroke="#71717a" stroke-width="0.6"/>`;
        ticks += `<line x1="${pos}" y1="${s}" x2="${pos}" y2="${s - tickLen}" stroke="#71717a" stroke-width="0.6"/>`;
        ticks += `<line x1="0" y1="${pos}" x2="${tickLen}" y2="${pos}" stroke="#71717a" stroke-width="0.6"/>`;
        ticks += `<line x1="${s}" y1="${pos}" x2="${s - tickLen}" y2="${pos}" stroke="#71717a" stroke-width="0.6"/>`;
    }

    return `
        <g transform="translate(${x}, ${y})">
            <rect x="0" y="0" width="${s}" height="${s}" fill="#ffffff" stroke="#18181b" stroke-width="1.5"/>
            ${ticks}
            <line x1="0" y1="${5 * CM}" x2="${s}" y2="${5 * CM}" stroke="#d4d4d8" stroke-width="0.7" stroke-dasharray="3,3"/>
            <line x1="${5 * CM}" y1="0" x2="${5 * CM}" y2="${s}" stroke="#d4d4d8" stroke-width="0.7" stroke-dasharray="3,3"/>
            <text x="${5 * CM}" y="${3.4 * CM}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="7.5" font-weight="700" fill="#3f3f46" letter-spacing="0.5">КОНТРОЛЬ</text>
            <text x="${5 * CM}" y="${4.5 * CM}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="7.5" font-weight="700" fill="#3f3f46" letter-spacing="0.5">МАСШТАБА</text>
            <text x="${5 * CM}" y="${6.4 * CM}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700" fill="#18181b">10 × 10 см</text>
            <text x="${5 * CM}" y="${7.5 * CM}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="6" font-weight="500" fill="#71717a">ПРОВЕРКА 1:1</text>
        </g>
    `;
}

// Управление зумом и панорамой (Pointer Events)
function initCanvasNavigation() {
    const wrapper = document.getElementById('svg-wrapper');
    if (!wrapper) return;

    wrapper.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        viewState.isDragging = true;
        viewState.startX = e.clientX - viewState.panX;
        viewState.startY = e.clientY - viewState.panY;
        wrapper.setPointerCapture(e.pointerId);
    });

    wrapper.addEventListener('pointermove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const cmX = ((e.clientX - rect.left - viewState.panX) / (viewState.scale * CM)).toFixed(1);
        const cmY = ((e.clientY - rect.top - viewState.panY) / (viewState.scale * CM)).toFixed(1);
        const coordsEl = document.getElementById('cursor-coords');
        if (coordsEl) coordsEl.textContent = `X: ${cmX} см | Y: ${cmY} см`;

        if (!viewState.isDragging) return;
        viewState.panX = e.clientX - viewState.startX;
        viewState.panY = e.clientY - viewState.startY;
        const vp = document.getElementById('viewport');
        if (vp) vp.setAttribute('transform', `translate(${viewState.panX}, ${viewState.panY}) scale(${viewState.scale})`);
    });

    const stopDrag = (e) => {
        if (!viewState.isDragging) return;
        viewState.isDragging = false;
        try { wrapper.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    wrapper.addEventListener('pointerup', stopDrag);
    wrapper.addEventListener('pointercancel', stopDrag);

    wrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = wrapper.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const prevScale = viewState.scale;
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        const nextScale = Math.min(2.8, Math.max(0.25, prevScale + delta));

        viewState.panX = mouseX - ((mouseX - viewState.panX) * (nextScale / prevScale));
        viewState.panY = mouseY - ((mouseY - viewState.panY) * (nextScale / prevScale));
        viewState.scale = nextScale;

        const zoomEl = document.getElementById('zoom-label');
        if (zoomEl) zoomEl.textContent = Math.round(viewState.scale * 100) + '%';
        const vp = document.getElementById('viewport');
        if (vp) vp.setAttribute('transform', `translate(${viewState.panX}, ${viewState.panY}) scale(${viewState.scale})`);
    }, { passive: false });
}

function zoomCanvas(delta) {
    const wrapper = document.getElementById('svg-wrapper');
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const prevScale = viewState.scale;
    const nextScale = Math.min(2.8, Math.max(0.25, prevScale + delta));

    viewState.panX = centerX - ((centerX - viewState.panX) * (nextScale / prevScale));
    viewState.panY = centerY - ((centerY - viewState.panY) * (nextScale / prevScale));
    viewState.scale = nextScale;

    const zoomEl = document.getElementById('zoom-label');
    if (zoomEl) zoomEl.textContent = Math.round(viewState.scale * 100) + '%';
    renderPattern();
}

function resetView() {
    const wrapper = document.getElementById('svg-wrapper');
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const g = calculateGeometry();

    const totalW = (state.showSleeve ? (g.W_grid + (state.separate ? 28 : 14) + g.W_sleeve) : (g.W_grid + (state.separate ? 20 : 6))) * CM;
    const totalH = (Math.max(g.Y_H, g.L_sleeve) + 18) * CM;

    const scaleX = (rect.width - 90) / totalW;
    const scaleY = (rect.height - 90) / totalH;
    viewState.scale = Math.min(1.35, Math.max(0.3, Math.min(scaleX, scaleY)));
    viewState.panX = 55;
    viewState.panY = 65;

    const zoomEl = document.getElementById('zoom-label');
    if (zoomEl) zoomEl.textContent = Math.round(viewState.scale * 100) + '%';
    renderPattern();
}

function toggleSeparateMode() {
    state.separate = !state.separate;
    const chk = document.getElementById('chk-separate');
    if (chk) chk.checked = state.separate;
    renderPattern();
}

function toggleA4Grid() {
    state.showA4Grid = !state.showA4Grid;
    const btn = document.getElementById('btn-a4-grid');
    if (btn) {
        if (state.showA4Grid) {
            btn.classList.add('bg-green-50', 'border-green-600', 'text-green-800');
        } else {
            btn.classList.remove('bg-green-50', 'border-green-600', 'text-green-800');
        }
    }
    renderPattern();
}
