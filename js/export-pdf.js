// js/export-pdf.js - Экспорт лекал в SVG, PNG и нарезка на листы А4 в PDF

function getSkirtPieceExportData(pieceType) {
    const g = calculateSkirtGeometry();
    const p = generateSkirtPiecesMarkup(g, { showClassic: true, separate: true });

    if (g.isCircular) {
        const rw = g.rWaist * CM;
        const rh = g.rHem * CM;
        const widthMm = Math.ceil(rh) + 40;
        const heightMm = Math.ceil(rh) + 40;
        const minX = -20;
        const minY = -Math.ceil(rh) - 20;

        const circlePath = `M 0 ${-rw} A ${rw} ${rw} 0 0 1 ${rw} 0 L ${rh} 0 A ${rh} ${rh} 0 0 0 0 ${-rh} Z`;

        const contentSvg = `
            <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                <path d="${circlePath}" fill="#ffffff"/>
                <line x1="0" y1="0" x2="${rh}" y2="0" stroke="#71717a" stroke-width="0.8" stroke-dasharray="6,4"/>
                <line x1="0" y1="0" x2="0" y2="${-rh}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="6,4"/>
                <text x="${(rw + rh) / 2}" y="18" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#09090b">[ СГИБ ТКАНИ ]</text>
                <text x="-16" y="${-(rw + rh) / 2}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#09090b" transform="rotate(-90 -16 ${-(rw + rh) / 2})">[ БОКОВОЙ ШОВ ]</text>
                <text x="${(rw + rh) * 0.45}" y="${-(rw + rh) * 0.45}" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#09090b">${g.isSun ? 'ЮБКА СОЛНЦЕ' : 'ЮБКА ПОЛУСОЛНЦЕ'}</text>
                <text x="${(rw + rh) * 0.45}" y="${-(rw + rh) * 0.45 + 18}" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" fill="#3f3f46">От=${g.ot} см | Длина=${g.skirtLength} см | R талии=${g.rWaist.toFixed(1)} см</text>
            </g>
        `;
        return {
            minX, minY, widthMm, heightMm, contentSvg,
            fileTitle: `yubka_${g.style}_OT${state.ot}`,
            pieceLabelRu: `${g.isSun ? 'Юбка Солнце (360°)' : (g.isSkater ? 'Мини-скейтер клеш (270°)' : 'Юбка Полусолнце (180°)')} (От ${state.ot})`
        };
    }

    if (pieceType === 'back') {
        const backW = Math.ceil(Math.max(g.X_side + g.flareOffset, g.X_side) * CM) + 40;
        const backH = Math.ceil(g.skirtLength * CM) + 40;
        const minX = -20;
        const minY = -20;
        const contentSvg = `
            <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                <path d="${p.backOutlinePath}" fill="#ffffff"/>
                <line x1="0" y1="${g.vb * CM}" x2="${g.X_side * CM}" y2="${g.vb * CM}" stroke="#71717a" stroke-width="0.7" stroke-dasharray="4,3"/>
                <text x="14" y="${(g.skirtLength * 0.5) * CM}" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#09090b" transform="rotate(-90 14 ${(g.skirtLength * 0.5) * CM})">[ СГИБ ТКАНИ ]</text>
                <text x="${(g.X_side * 0.5) * CM}" y="${(g.vb - 2) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#09090b">ЗАДНЕЕ ПОЛОТНИЩЕ ЮБКИ</text>
                <text x="${(g.X_side * 0.5) * CM}" y="${(g.vb + 1) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" fill="#3f3f46">1 дет. со сгибом | От=${g.ot} | Об=${g.ob} | Дю=${g.skirtLength}</text>
                ${g.isPleated ? `
                    <line x1="0" y1="${g.yokeHeight * CM}" x2="${g.X_side * CM}" y2="${g.yokeHeight * CM}" stroke="#4f46e5" stroke-width="1.2" stroke-dasharray="4,3"/>
                    <text x="${(g.X_side * 0.5) * CM}" y="${(g.yokeHeight - 1.2) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#4f46e5">ЛИНИЯ КОКЕТКИ (ниже — складки плиссе)</text>
                ` : ''}
                ${g.hasLaceup ? `
                    <circle cx="${g.B_hem_side.x * CM - 6}" cy="${(g.skirtLength - 3) * CM}" r="2.5" fill="#f43f5e"/>
                    <circle cx="${g.B_hem_side.x * CM - 6}" cy="${(g.skirtLength - 8) * CM}" r="2.5" fill="#f43f5e"/>
                    <circle cx="${g.B_hem_side.x * CM - 6}" cy="${(g.skirtLength - 13) * CM}" r="2.5" fill="#f43f5e"/>
                    <text x="${g.B_hem_side.x * CM - 10}" y="${(g.skirtLength - 8) * CM}" text-anchor="end" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#f43f5e">⚡ ЛЮВЕРСЫ (d=4мм)</text>
                ` : ''}
            </g>
        `;
        return {
            minX, minY, widthMm: backW, heightMm: backH, contentSvg,
            fileTitle: `yubka_zad_OT${state.ot}_OB${state.ob}`,
            pieceLabelRu: `Заднее полотнище юбки (От ${state.ot}, Об ${state.ob})`
        };
    } else if (pieceType === 'front') {
        const frontW = Math.ceil((g.W_grid - g.X_side + Math.max(0, -g.flareOffset) + (g.isWrap ? g.wrapOverlap : 0)) * CM) + 40;
        const frontH = Math.ceil(g.skirtLength * CM) + 40;
        const minX = Math.floor(g.F_waist_side.x * CM) - 20;
        const minY = -20;
        const contentSvg = `
            <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                <path d="${p.frontOutlinePath}" fill="#ffffff"/>
                <line x1="${g.F_hip_side.x * CM}" y1="${g.F_hip_side.y * CM}" x2="${g.F_hip_center.x * CM}" y2="${g.F_hip_center.y * CM}" stroke="#71717a" stroke-width="0.7" stroke-dasharray="4,3"/>
                <text x="${(g.W_grid * CM) - 14}" y="${(g.skirtLength * 0.5) * CM}" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#09090b" transform="rotate(-90 ${(g.W_grid * CM) - 14} ${(g.skirtLength * 0.5) * CM})">[ СГИБ ТКАНИ ]</text>
                <text x="${((g.X_side + g.W_grid) * 0.5) * CM}" y="${(g.vb - 2) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#09090b">ПЕРЕДНЕЕ ПОЛОТНИЩЕ ЮБКИ</text>
                <text x="${((g.X_side + g.W_grid) * 0.5) * CM}" y="${(g.vb + 1) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" fill="#3f3f46">1 дет. со сгибом | От=${g.ot} | Об=${g.ob} | Дю=${g.skirtLength}</text>
                ${g.hasSlit ? `
                    <line x1="${g.F_dart_apex.x * CM}" y1="${g.F_hem_side.y * CM}" x2="${g.F_dart_apex.x * CM}" y2="${(g.skirtLength - g.slitHeight) * CM}" stroke="#e11d48" stroke-width="2.0" stroke-dasharray="4,2"/>
                    <circle cx="${g.F_dart_apex.x * CM}" cy="${(g.skirtLength - g.slitHeight) * CM}" r="3" fill="#e11d48"/>
                    <text x="${g.F_dart_apex.x * CM + 6}" y="${(g.skirtLength - g.slitHeight * 0.45) * CM}" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#e11d48">✂ РАЗРЕЗ ${g.slitHeight.toFixed(0)} см</text>
                ` : ''}
                ${g.hasLaceup ? `
                    <circle cx="${g.F_hem_side.x * CM + 6}" cy="${(g.skirtLength - 3) * CM}" r="2.5" fill="#f43f5e"/>
                    <circle cx="${g.F_hem_side.x * CM + 6}" cy="${(g.skirtLength - 8) * CM}" r="2.5" fill="#f43f5e"/>
                    <circle cx="${g.F_hem_side.x * CM + 6}" cy="${(g.skirtLength - 13) * CM}" r="2.5" fill="#f43f5e"/>
                    <text x="${g.F_hem_side.x * CM + 10}" y="${(g.skirtLength - 8) * CM}" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#f43f5e">⚡ ШНУРОВКА</text>
                ` : ''}
                ${g.hasRuched ? `
                    <text x="${((g.X_side + g.W_grid) * 0.5) * CM}" y="${(g.skirtLength - 4) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#7c3aed">✨ КУЛИСКА 2.5 см (сборка длины шнуром)</text>
                ` : ''}
                ${g.isMicro ? `
                    <text x="${((g.X_side + g.W_grid) * 0.5) * CM}" y="${(g.skirtLength - 2) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#db2777">🔥 Y2K ULTRA-MINI (30 см)</text>
                ` : ''}
                ${g.isWrap ? `
                    <path d="M ${g.W_grid * CM} 0 L ${(g.W_grid + g.wrapOverlap) * CM} 0 L ${(g.W_grid + g.wrapOverlap) * CM} ${(g.skirtLength - 5) * CM} L ${g.W_grid * CM} ${g.skirtLength * CM} Z" fill="none" stroke="#d97706" stroke-width="1.6" stroke-dasharray="5,3"/>
                    <text x="${(g.W_grid + g.wrapOverlap * 0.5) * CM}" y="${(g.skirtLength * 0.5) * CM}" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#d97706" transform="rotate(-90 ${(g.W_grid + g.wrapOverlap * 0.5) * CM} ${(g.skirtLength * 0.5) * CM})">[ ЗАПАХ +${g.wrapOverlap} см ]</text>
                ` : ''}
                ${g.isPleated ? `
                    <line x1="${g.X_side * CM}" y1="${g.yokeHeight * CM}" x2="${g.W_grid * CM}" y2="${g.yokeHeight * CM}" stroke="#4f46e5" stroke-width="1.2" stroke-dasharray="4,3"/>
                    <text x="${((g.X_side + g.W_grid) * 0.5) * CM}" y="${(g.yokeHeight - 1.2) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#4f46e5">ЛИНИЯ КОКЕТКИ (ниже — складки плиссе)</text>
                ` : ''}
            </g>
        `;
        return {
            minX, minY, widthMm: frontW, heightMm: frontH, contentSvg,
            fileTitle: `yubka_pered_OT${state.ot}_OB${state.ob}`,
            pieceLabelRu: `Переднее полотнище юбки (От ${state.ot}, Об ${state.ob})`
        };
    } else if (pieceType === 'sleeve' || pieceType === 'belt') {
        const beltW = Math.ceil(g.beltLength * CM) + 40;
        const beltH = Math.ceil(g.beltWidth * CM) + 40;
        const minX = -20;
        const minY = -20;
        const contentSvg = `
            <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                <rect x="0" y="0" width="${g.beltLength * CM}" height="${g.beltWidth * CM}" fill="#ffffff"/>
                <line x1="0" y1="${(g.beltWidth / 2) * CM}" x2="${g.beltLength * CM}" y2="${(g.beltWidth / 2) * CM}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="4,3"/>
                <text x="${(g.beltLength / 2) * CM}" y="${(g.beltWidth / 2) * CM - 4}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#09090b">ПОЯС ЮБКИ (${g.beltLength.toFixed(1)} × ${g.beltWidth} см)</text>
                <text x="${(g.beltLength / 2) * CM}" y="${(g.beltWidth / 2) * CM + 15}" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" fill="#52525b">1 деталь со сгибом по пунктиру</text>
            </g>
        `;
        return {
            minX, minY, widthMm: beltW, heightMm: beltH, contentSvg,
            fileTitle: `yubka_poyas_OT${state.ot}`,
            pieceLabelRu: `Пояс юбки (${g.beltLength.toFixed(1)} × ${g.beltWidth} см)`
        };
    } else {
        const shiftX = 18 * CM;
        const pFull = generateSkirtPiecesMarkup(g, { showClassic: true, separate: true, frontShiftX: shiftX });
        const widthMm = Math.ceil(pFull.totalWidthCm * CM) + 40;
        const heightMm = Math.ceil(pFull.totalHeightCm * CM) + 40;
        const minX = -20;
        const minY = -20;
        return {
            minX, minY, widthMm, heightMm,
            contentSvg: `<g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">${pFull.markup}</g>`,
            fileTitle: `yubka_polnaya_OT${state.ot}_OB${state.ob}`,
            pieceLabelRu: `Юбка полный комплект (От ${state.ot}, Об ${state.ob})`
        };
    }
}

function getPantiesPieceExportData(pieceType) {
    const g = calculatePantiesGeometry();
    const p = generatePantiesPiecesMarkup(g, { showClassic: true });

    if (pieceType === 'front') {
        const widthMm = Math.ceil(g.frontTopHalfW * CM) + 40;
        const heightMm = Math.ceil(g.frontHeight * CM) + 40;
        const minX = -20;
        const minY = -20;
        const contentSvg = `
            <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                <path d="${p.frontPath}" fill="#ffffff"/>
                <line x1="0" y1="0" x2="0" y2="${g.frontHeight * CM}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="4,3"/>
                <text x="12" y="${(g.frontHeight * 0.45) * CM}" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#09090b" transform="rotate(-90 12 ${(g.frontHeight * 0.45) * CM})">[ СГИБ ТКАНИ ]</text>
                <text x="${(g.frontTopHalfW * 0.45) * CM}" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#09090b">ПЕРЕД ТРУСИКОВ</text>
                <text x="${(g.frontTopHalfW * 0.45) * CM}" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" fill="#52525b">1 деталь со сгибом (Об ${g.ob} см)</text>
            </g>
        `;
        return {
            minX, minY, widthMm, heightMm, contentSvg,
            fileTitle: `trusiki_pered_OB${state.ob}`,
            pieceLabelRu: `Перед трусиков (Об ${state.ob})`
        };
    } else if (pieceType === 'back') {
        const widthMm = Math.ceil(g.backTopHalfW * CM) + 40;
        const heightMm = Math.ceil(g.backHeight * CM) + 40;
        const minX = -20;
        const minY = -20;
        const contentSvg = `
            <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                <path d="${p.backPath}" fill="#ffffff"/>
                <line x1="0" y1="0" x2="0" y2="${g.backHeight * CM}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="4,3"/>
                <text x="12" y="${(g.backHeight * 0.45) * CM}" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#09090b" transform="rotate(-90 12 ${(g.backHeight * 0.45) * CM})">[ СГИБ ТКАНИ ]</text>
                <text x="${(g.backTopHalfW * 0.45) * CM}" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#09090b">СПИНКА ТРУСИКОВ (${g.model.toUpperCase()})</text>
                <text x="${(g.backTopHalfW * 0.45) * CM}" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" fill="#52525b">1 деталь со сгибом</text>
            </g>
        `;
        return {
            minX, minY, widthMm, heightMm, contentSvg,
            fileTitle: `trusiki_spinka_${g.model}_OB${state.ob}`,
            pieceLabelRu: `Спинка трусиков (${g.model})`
        };
    } else if (pieceType === 'sleeve' || pieceType === 'gusset') {
        const widthMm = Math.ceil(g.gussetBackHalfW * CM) + 40;
        const heightMm = Math.ceil(g.gussetLen * CM) + 40;
        const minX = -20;
        const minY = -20;
        const contentSvg = `
            <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                <path d="${p.gussetPath}" fill="#ffffff"/>
                <line x1="0" y1="0" x2="0" y2="${g.gussetLen * CM}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="4,3"/>
                <text x="10" y="${(g.gussetLen * 0.5) * CM}" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#09090b" transform="rotate(-90 10 ${(g.gussetLen * 0.5) * CM})">[ СГИБ ]</text>
                <text x="${(g.gussetBackHalfW * 0.5) * CM}" y="${(g.gussetLen * 0.4) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#09090b">ЛАСТОВИЦА</text>
                <text x="${(g.gussetBackHalfW * 0.5) * CM}" y="${(g.gussetLen * 0.4) * CM + 14}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#52525b">2 дет. (100% хлопок)</text>
            </g>
        `;
        return {
            minX, minY, widthMm, heightMm, contentSvg,
            fileTitle: `trusiki_lastovica_OB${state.ob}`,
            pieceLabelRu: `Ластовица трусиков (2 детали)`
        };
    } else {
        const widthMm = Math.ceil(p.totalWidthCm * CM) + 40;
        const heightMm = Math.ceil(p.totalHeightCm * CM) + 40;
        const minX = -20;
        const minY = -20;
        return {
            minX, minY, widthMm, heightMm,
            contentSvg: `<g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">${p.markup}</g>`,
            fileTitle: `trusiki_polny_komplekt_OB${state.ob}`,
            pieceLabelRu: `Трусики полный комплект (${g.model})`
        };
    }
}

function getTopPieceExportData(pieceType) {
    const g = calculateTopGeometry();
    const p = generateTopPiecesMarkup(g, { showClassic: true, frontShiftX: 0 });
    const sInfo = (typeof getStyleInfo === 'function') ? getStyleInfo('top', g.style) : null;
    const styleName = sInfo ? sInfo.name : g.style;

    let minX = 0, minY = 0, widthMm = 500, heightMm = 800;
    let contentSvg = '';
    let fileTitle = '';
    let pieceLabelRu = '';

    if (pieceType === 'back') {
        const maxBackX = Math.max(g.X_side, g.B_hem_side.x, g.B_strap_outer.x, g.B_armhole_bot.x);
        minX = -20;
        minY = -20;
        widthMm = Math.ceil(maxBackX * CM) + 40;
        heightMm = Math.ceil(g.effectiveLength * CM) + 40;
        fileTitle = `top_spinka_${g.style}_OG${state.og}_OT${state.ot}`;
        pieceLabelRu = `Спинка топа (${styleName}, Ог ${state.og}, От ${state.ot})`;

        contentSvg = `
            <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                <path d="${p.backPath}" fill="#ffffff"/>
                <line x1="0" y1="${g.Y_T * CM}" x2="${g.B_waist_side.x * CM}" y2="${g.Y_T * CM}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="4,4"/>
                <text x="14" y="${(g.effectiveLength * 0.5) * CM}" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#09090b" transform="rotate(-90 14 ${(g.effectiveLength * 0.5) * CM})">[ СГИБ СПИНКИ / ДОЛЕВАЯ ]</text>
                <text x="${(maxBackX * 0.5) * CM}" y="${(g.effectiveLength * 0.4) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#09090b">СПИНКА (${styleName})</text>
                <text x="${(maxBackX * 0.5) * CM}" y="${(g.effectiveLength * 0.4) * CM + 14}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" fill="#52525b">1 деталь со сгибом</text>
            </g>
        `;
    } else if (pieceType === 'front') {
        const frontW = g.W_grid - Math.min(g.X_side, g.F_armhole_bot.x);
        minX = Math.floor(Math.min(g.X_side, g.F_armhole_bot.x) * CM) - 20;
        minY = -20;
        widthMm = Math.ceil(frontW * CM) + 40;
        heightMm = Math.ceil((g.effectiveLength + g.antiRideupDrop) * CM) + 40;
        fileTitle = `top_polochka_${g.style}_OG${state.og}_OT${state.ot}`;
        pieceLabelRu = `Полочка топа (${styleName}, Ог ${state.og}, От ${state.ot})`;

        contentSvg = `
            <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                <path d="${p.frontPath}" fill="#ffffff"/>
                <line x1="${g.F_armhole_bot.x * CM}" y1="${g.Y_T * CM}" x2="${g.W_grid * CM}" y2="${g.Y_T * CM}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="4,4"/>
                <text x="${(g.W_grid * CM) - 14}" y="${(g.effectiveLength * 0.5) * CM}" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#09090b" transform="rotate(-90 ${(g.W_grid * CM) - 14} ${(g.effectiveLength * 0.5) * CM})">[ ЛИНИЯ ПОЛУЗАНОСА / СГИБ ]</text>
                <text x="${(g.W_grid - frontW * 0.45) * CM}" y="${(g.effectiveLength * 0.4) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#09090b">ПОЛОЧКА ПЕРЕДА</text>
                <text x="${(g.W_grid - frontW * 0.45) * CM}" y="${(g.effectiveLength * 0.4) * CM + 14}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" fill="#52525b">1 деталь со сгибом</text>
                ${g.antiRideupDrop > 0 ? `
                    <text x="${(g.W_grid - frontW * 0.45) * CM}" y="${(g.effectiveLength + g.antiRideupDrop * 0.5) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#e11d48">🛡️ АНТИ-ЗАДИР +${g.antiRideupDrop} см</text>
                ` : ''}
            </g>
        `;
    } else if (pieceType === 'sleeve') {
        if (g.hasSleeve) {
            const sW = (g.W_sleeve_custom || g.W_sleeve) * CM;
            const sH = (g.L_sleeve || 19.0) * CM;
            const capH = Math.min(sH * 0.45, 6.5 * CM);
            const sTitle = g.sleeveTitle || 'РУКАВ ФУТБОЛКИ (2 дет.)';
            minX = -20;
            minY = -20;
            widthMm = Math.ceil(sW) + 40;
            heightMm = Math.ceil(sH) + 40;
            fileTitle = `top_rukav_${g.style}_OG${state.og}`;
            pieceLabelRu = `${sTitle} (${styleName}, Ог ${state.og})`;
            contentSvg = `
                <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                    <rect x="0" y="0" width="${sW}" height="${sH}" fill="#ffffff" stroke="#09090b" stroke-width="1.8" rx="4"/>
                    <path d="M 0 ${capH} Q ${sW / 2} 0 ${sW} ${capH} L ${sW} ${sH} L 0 ${sH} Z" fill="none" stroke="#09090b" stroke-width="1.8"/>
                    <line x1="0" y1="${sH}" x2="${sW}" y2="${sH}" stroke="#09090b" stroke-width="2.2"/>
                    <line x1="0" y1="${sH - 2.0 * CM}" x2="${sW}" y2="${sH - 2.0 * CM}" stroke="#09090b" stroke-width="1.0" stroke-dasharray="4,3"/>
                    <text x="${sW / 2}" y="${sH * 0.52}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#09090b">${sTitle}</text>
                    <text x="${sW / 2}" y="${sH * 0.52 + 14}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" fill="#52525b">Длина ${g.L_sleeve || 19} см | Ширина ${(sW / CM).toFixed(1)} см | 2 дет.</text>
                </g>
            `;
        } else {
            // Бретели и пояс
            minX = -20;
            minY = -20;
            widthMm = 400;
            heightMm = 200;
            fileTitle = `top_breteli_${g.style}`;
            pieceLabelRu = `Спецификация бретелей (${styleName})`;
            contentSvg = `
                <g stroke="#09090b" stroke-width="1.5" fill="none" stroke-linejoin="round">
                    <rect x="0" y="0" width="360" height="150" rx="8" fill="#ffffff" stroke="#09090b"/>
                    <text x="20" y="30" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#09090b">СПЕЦИФИКАЦИЯ ЭЛАСТИЧНЫХ ДЕТАЛЕЙ И БРЕТЕЛЕЙ</text>
                    <text x="20" y="55" font-family="Arial, sans-serif" font-size="10" fill="#27272a">• Бретели готовые: 2 детали по ${g.elasticSpec.strapFinishedLength} см (с учетом регулятора)</text>
                    <text x="20" y="75" font-family="Arial, sans-serif" font-size="10" fill="#27272a">• Пояс под грудью: 1 деталь ${g.elasticSpec.underbustBandLength} см (растяжимость k=${g.elasticSpec.stretchCoeff})</text>
                    <text x="20" y="95" font-family="Arial, sans-serif" font-size="10" fill="#27272a">• Регуляторы длины бретелей: ${g.elasticSpec.slidersCount} шт.</text>
                    ${g.elasticSpec.ringDiameterMm ? `<text x="20" y="115" font-family="Arial, sans-serif" font-size="10" fill="#27272a">• Соединительные кольца: Ø${g.elasticSpec.ringDiameterMm} мм (${g.elasticSpec.ringsCount} шт.)</text>` : ''}
                </g>
            `;
        }
    } else {
        // Полный комплект
        const sepShift = 14 * CM;
        const pAll = generateTopPiecesMarkup(g, { showClassic: true, frontShiftX: sepShift });
        minX = -25;
        minY = -25;
        widthMm = Math.ceil((g.widthCm + sepShift / CM) * CM) + 50;
        heightMm = Math.ceil(g.heightCm * CM) + 50;
        fileTitle = `top_polny_komplekt_${g.style}_OG${state.og}`;
        pieceLabelRu = `Полный комплект топа (${styleName}, Ог ${state.og}, От ${state.ot})`;
        contentSvg = `<g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">${pAll.markup}</g>`;
    }

    return { minX, minY, widthMm, heightMm, contentSvg, fileTitle, pieceLabelRu };
}

function getCorsetPieceExportData(pieceType) {
    const g = calculateCorsetGeometry();
    const pAll = generateCorsetPiecesMarkup(g, { showClassic: true, separate: true });

    let minX = -25;
    let minY = -25;
    let widthMm = Math.ceil(g.widthCm * CM) + 50;
    let heightMm = Math.ceil(g.heightCm * CM) + 50;
    let fileTitle = `corset_${g.style}_OT${state.ot}`;
    let pieceLabelRu = `Сценическое изделие: ${g.style} (От ${state.ot})`;
    let contentSvg = `<g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">${pAll.markup}</g>`;

    if (pieceType === 'front') {
        fileTitle = `corset_pered_${g.style}_OT${state.ot}`;
        pieceLabelRu = `Полочка / Передние детали (${g.style})`;
    } else if (pieceType === 'back') {
        fileTitle = `corset_spinka_${g.style}_OT${state.ot}`;
        pieceLabelRu = `Спинка / Задние панели (${g.style})`;
    } else if (pieceType === 'sleeve') {
        fileTitle = `corset_detali_${g.style}`;
        pieceLabelRu = `Пояс / Рукава / Оборки (${g.style})`;
    }

    return { minX, minY, widthMm, heightMm, contentSvg, fileTitle, pieceLabelRu };
}

function getPieceExportData(pieceType) {
    if (state.garmentType === 'corset') {
        return getCorsetPieceExportData(pieceType);
    }
    if (state.garmentType === 'skirt') {
        return getSkirtPieceExportData(pieceType);
    }
    if (state.garmentType === 'panties') {
        return getPantiesPieceExportData(pieceType);
    }
    if (state.garmentType === 'top') {
        return getTopPieceExportData(pieceType);
    }

    const g = calculateGeometry();
    const p = generatePatternPiecesMarkup(g, { showClassic: true, frontShiftX: 0, sleeveOriginX: g.W_sleeve / 2 });

    let minX = 0, minY = 0, widthMm = 500, heightMm = 800;
    let contentSvg = '';
    let fileTitle = '';
    let pieceLabelRu = '';

    if (pieceType === 'back') {
        const maxBackX = Math.max(g.X_G4, g.B3.x, g.P1.x, g.H_back_side ? g.H_back_side.x : g.B3.x);
        minX = -20;
        minY = Math.floor(g.A4.y * CM) - 20;
        widthMm = Math.ceil(maxBackX * CM) + 45;
        heightMm = Math.ceil((g.Y_H + 2) * CM) - minY + 25;
        fileTitle = `spinka_OG${state.og}_OT${state.ot}`;
        pieceLabelRu = `Спинка (Ог ${state.og}, От ${state.ot}, Об ${state.ob})`;

        contentSvg = `
            <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                <path d="${p.backOutlinePath}" fill="#ffffff"/>
                <path d="${p.backDiamondPath}" />
                <line x1="0" y1="${g.Y_G * CM}" x2="${g.G4.x * CM}" y2="${g.Y_G * CM}" stroke="#52525b" stroke-width="0.65" stroke-dasharray="4,3"/>
                <line x1="0" y1="${g.Y_T * CM}" x2="${g.T3.x * CM}" y2="${g.Y_T * CM}" stroke="#52525b" stroke-width="0.65" stroke-dasharray="4,3"/>
                <line x1="0" y1="${g.Y_B * CM}" x2="${g.B3.x * CM}" y2="${g.Y_B * CM}" stroke="#52525b" stroke-width="0.65" stroke-dasharray="4,3"/>
                <!-- Линия долевой нити со сгибом -->
                <line x1="${3.0 * CM}" y1="${(g.Y_G + 2) * CM}" x2="${3.0 * CM}" y2="${(g.Y_H - 4) * CM}" stroke="#18181b" stroke-width="0.9"/>
                <text x="${12}" y="${(g.Y_T - 4) * CM}" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#52525b" transform="rotate(-90 12 ${(g.Y_T - 4) * CM})">[ СГИБ ТКАНИ ]</text>
            </g>
            <text x="${(g.W_back * 0.48) * CM}" y="${(g.Y_G - 2.5) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#09090b">СПИНКА (1 дет. со сгибом)</text>
            <text x="${(g.W_back * 0.48) * CM}" y="${(g.Y_G - 0.8) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" fill="#3f3f46">Ог=${state.og} | От=${state.ot} | Об=${state.ob} | Осанка: ${state.posture}</text>
        `;
    } else if (pieceType === 'front') {
        // Устраняем баг обрезания: minFrontX учитывает все варианты вытачек и клеш!
        const minFrontX = Math.min(g.P5_open.x, g.P5_closed.x, g.X_G4, g.B4.x, g.H_front_side ? g.H_front_side.x : g.B4.x);
        minX = Math.floor(minFrontX * CM) - 25;
        minY = Math.floor(Math.min(g.Y_V1, g.V3_neck ? g.V3_neck.y : g.Y_V1) * CM) - 20;
        widthMm = Math.ceil((g.X_G3 - minFrontX) * CM) + 50;
        heightMm = Math.ceil((g.Y_H + 3.2) * CM) - minY + 25;
        fileTitle = `polochka_OG${state.og}_OT${state.ot}`;
        pieceLabelRu = `Полочка (Ог ${state.og}, От ${state.ot}, Об ${state.ob})`;

        contentSvg = `
            <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                <path d="${p.frontOutlinePath}" fill="#ffffff"/>
                <path d="${p.frontDiamondPath}" />
                <line x1="${g.G4.x * CM}" y1="${g.Y_G * CM}" x2="${g.X_G3 * CM}" y2="${g.Y_G * CM}" stroke="#52525b" stroke-width="0.65" stroke-dasharray="4,3"/>
                <line x1="${g.T4.x * CM}" y1="${g.T4.y * CM}" x2="${g.T5.x * CM}" y2="${g.T5.y * CM}" stroke="#52525b" stroke-width="0.65" stroke-dasharray="4,3"/>
                <line x1="${g.B4.x * CM}" y1="${g.B4.y * CM}" x2="${g.B5.x * CM}" y2="${g.B5.y * CM}" stroke="#52525b" stroke-width="0.65" stroke-dasharray="4,3"/>
                <circle cx="${g.G7.x * CM}" cy="${g.G7.y * CM}" r="2.5" fill="#09090b"/>
                <circle cx="${g.V8.x * CM}" cy="${g.V8.y * CM}" r="2" fill="#2563eb"/>
                <text x="${(g.X_G3 * CM) - 10}" y="${(g.Y_T - 4) * CM}" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#52525b" transform="rotate(-90 ${(g.X_G3 * CM) - 10} ${(g.Y_T - 4) * CM})">[ ЛИНИЯ ПОЛУЗАНОСА ]</text>
                ${g.keyhole ? `
                    <path d="${g.keyhole.path}" stroke="#e11d48" stroke-width="2.0" fill="none"/>
                    <text x="${g.keyhole.centerX * CM - 18}" y="${((g.keyhole.topY + g.keyhole.botY) / 2) * CM}" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#e11d48" text-anchor="end">✂ ВЫРЕЗ КАПЕЛЬКА</text>
                ` : ''}
            </g>
            <text x="${((g.X_G2 + g.X_G3) * 0.5) * CM}" y="${(g.Y_G - 2.5) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#09090b">ПОЛОЧКА (1 дет. со сгибом / 2 дет.)</text>
            <text x="${((g.X_G2 + g.X_G3) * 0.5) * CM}" y="${(g.Y_G - 0.8) * CM}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" fill="#3f3f46">Ог=${state.og} | От=${state.ot} | Вг=${state.vg} | Осанка: ${state.posture}</text>
        `;
    } else if (pieceType === 'sleeve') {
        const hasSleevePiece = Boolean(state.showSleeve && state.sleeveLengthType !== 'sleeveless');
        if (!hasSleevePiece) {
            minX = -20;
            minY = -20;
            widthMm = 350;
            heightMm = 180;
            fileTitle = `bez_rukava_OG${state.og}`;
            pieceLabelRu = `Модель без рукавов`;
            contentSvg = `
                <g stroke="#09090b" stroke-width="1.5" fill="none">
                    <rect x="0" y="0" width="310" height="140" rx="8" fill="#ffffff" stroke="#09090b"/>
                    <text x="20" y="35" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#09090b">МОДЕЛЬ БЕЗ РУКАВОВ</text>
                    <text x="20" y="65" font-family="Arial, sans-serif" font-size="10" fill="#3f3f46">• Деталь рукава отключена в параметрах моделирования.</text>
                    <text x="20" y="85" font-family="Arial, sans-serif" font-size="10" fill="#3f3f46">• Обработка проймы: обтачка 3.0 см или косая бейка 3.5 см.</text>
                    <text x="20" y="105" font-family="Arial, sans-serif" font-size="10" fill="#3f3f46">• Периметр проймы: ${(g.total_armhole_len || 0).toFixed(1)} см.</text>
                </g>
            `;
        } else {
            minX = -20;
            minY = -20;
            widthMm = Math.ceil(g.W_sleeve * CM) + 40;
            heightMm = Math.ceil((g.L_sleeve + 2) * CM) + 40;
            fileTitle = `rukav_OG${state.og}_DR${state.dr}`;
            pieceLabelRu = `Рукав втачной (Оп ${state.op}, Др ${state.dr})`;

            contentSvg = `
                <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                    <path d="${p.sleeveOutlinePath}" fill="#ffffff"/>
                    <line x1="${p.slCenter - p.halfW}" y1="${p.slCapY}" x2="${p.slCenter + p.halfW}" y2="${p.slCapY}" stroke="#52525b" stroke-width="0.65" stroke-dasharray="4,3"/>
                    <line x1="${p.slCenter}" y1="0" x2="${p.slCenter}" y2="${p.slBotY}" stroke="#52525b" stroke-width="0.65" stroke-dasharray="4,3"/>
                </g>
                <text x="${p.slCenter}" y="${(p.slCapY + p.slBotY) * 0.42}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#09090b">РУКАВ ВТАЧНОЙ (2 дет.)</text>
                <text x="${p.slCenter}" y="${(p.slCapY + p.slBotY) * 0.42 + 16}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" fill="#3f3f46">Оп=${state.op} см | Др=${state.dr} см | Посадка: +${g.sleeve_ease.toFixed(1)} см</text>
                <text x="${p.slCenter + p.halfW * 0.45}" y="${p.slCapY * 0.7}" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#047857">ПЕРЕД ➔</text>
                <text x="${p.slCenter - p.halfW * 0.65}" y="${p.slCapY * 0.7}" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#1d4ed8">⬅ СПИНКА</text>
            `;
        }
    } else {
        // Полный комплект: чистая аналитическая генерация без клонирования экранного DOM!
        const sepShift = 20 * CM;
        const hasSleevePiece = Boolean(state.showSleeve && state.sleeveLengthType !== 'sleeveless');

        if (hasSleevePiece) {
            const slOrigin = g.W_grid * CM + sepShift + (g.W_sleeve / 2) * CM + 60;
            const pAll = generatePatternPiecesMarkup(g, { showClassic: true, frontShiftX: sepShift, sleeveOriginX: slOrigin / CM });
            minX = -25;
            minY = -45;
            widthMm = Math.ceil((slOrigin + (g.W_sleeve / 2) * CM) + 60);
            heightMm = Math.ceil((Math.max(g.Y_H, g.L_sleeve) + 6) * CM) + 60;
            contentSvg = `
                <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                    <path d="${pAll.backOutlinePath}" fill="#ffffff"/>
                    <path d="${pAll.backDiamondPath}" />
                    <g transform="translate(${sepShift}, 0)">
                        <path d="${pAll.frontOutlinePath}" fill="#ffffff"/>
                        <path d="${pAll.frontDiamondPath}" />
                    </g>
                    <path d="${pAll.sleeveOutlinePath}" fill="#ffffff"/>
                </g>
            `;
        } else {
            const pAll = generatePatternPiecesMarkup(g, { showClassic: true, frontShiftX: sepShift });
            minX = -25;
            minY = -45;
            widthMm = Math.ceil((g.W_grid * CM + sepShift) + 50);
            heightMm = Math.ceil((g.Y_H + 6) * CM) + 60;
            contentSvg = `
                <g stroke="#09090b" stroke-width="1.8" fill="none" stroke-linejoin="round">
                    <path d="${pAll.backOutlinePath}" fill="#ffffff"/>
                    <path d="${pAll.backDiamondPath}" />
                    <g transform="translate(${sepShift}, 0)">
                        <path d="${pAll.frontOutlinePath}" fill="#ffffff"/>
                        <path d="${pAll.frontDiamondPath}" />
                    </g>
                </g>
            `;
        }

        fileTitle = `chertezh_polny_OG${state.og}_OT${state.ot}`;
        pieceLabelRu = `Полный комплект лекал (Ог ${state.og}, От ${state.ot}, Об ${state.ob})${hasSleevePiece ? '' : ' [без рукава]'}`;
    }

    return { minX, minY, widthMm, heightMm, contentSvg, fileTitle, pieceLabelRu };
}

// Экспорт отдельной детали в SVG или PNG (8 px/mm ~ 200 DPI)
function exportPiece(pieceType, format) {
    const data = getPieceExportData(pieceType);
    const { minX, minY, widthMm, heightMm, contentSvg, fileTitle } = data;

    // Контрольный квадрат размещен строго за пределами лекала, без наложения
    const scaleSquareSvg = renderScaleSquareMarkup(minX + 20, minY + heightMm - 110);

    const standaloneSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${widthMm}mm" height="${heightMm}mm" viewBox="${minX} ${minY} ${widthMm} ${heightMm}">
    <rect x="${minX}" y="${minY}" width="${widthMm}" height="${heightMm}" fill="#ffffff"/>
    ${contentSvg}
    ${pieceType !== 'all' ? scaleSquareSvg : ''}
</svg>`;

    if (format === 'svg') {
        const blob = new Blob([standaloneSvg], { type: 'image/svg+xml;charset=utf-8' });
        triggerDownload(URL.createObjectURL(blob), `${fileTitle}_1to1.svg`);
    } else if (format === 'dxf') {
        let dxf = "0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n";
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(standaloneSvg, 'image/svg+xml');
            const paths = doc.querySelectorAll('path');
            paths.forEach((p, idx) => {
                const d = p.getAttribute('d');
                if (!d) return;
                const commands = d.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
                let polyVertices = [];
                commands.forEach(cmd => {
                    const type = cmd[0];
                    const nums = cmd.slice(1).trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
                    if (type === 'M' || type === 'L') {
                        for (let i = 0; i < nums.length; i += 2) {
                            const x = nums[i] - minX;
                            const y = heightMm - (nums[i + 1] - minY);
                            polyVertices.push({ x, y });
                        }
                    } else if (type === 'Z' || type === 'z') {
                        if (polyVertices.length > 0) {
                            dxf += `0\nPOLYLINE\n8\nPATTERN_${idx}\n66\n1\n70\n1\n`;
                            polyVertices.forEach(v => {
                                dxf += `0\nVERTEX\n8\nPATTERN_${idx}\n10\n${v.x.toFixed(2)}\n20\n${v.y.toFixed(2)}\n30\n0.0\n`;
                            });
                            dxf += "0\nSEQEND\n";
                            polyVertices = [];
                        }
                    }
                });
                if (polyVertices.length > 1) {
                    dxf += `0\nPOLYLINE\n8\nPATTERN_${idx}\n66\n1\n70\n0\n`;
                    polyVertices.forEach(v => {
                        dxf += `0\nVERTEX\n8\nPATTERN_${idx}\n10\n${v.x.toFixed(2)}\n20\n${v.y.toFixed(2)}\n30\n0.0\n`;
                    });
                    dxf += "0\nSEQEND\n";
                }
            });
        } catch (_) {}
        dxf += "0\nENDSEC\n0\nEOF\n";
        const blob = new Blob([dxf], { type: 'application/dxf;charset=utf-8' });
        triggerDownload(URL.createObjectURL(blob), `${fileTitle}_1to1.dxf`);
        if (typeof showNotification === 'function') {
            showNotification('Файл DXF сформирован для плоттера');
        }
    } else if (format === 'png') {
        const dpiScale = 6; // 6 px/mm ~ 152.4 DPI (четкие линии без размытия)
        const canvas = document.createElement('canvas');
        canvas.width = widthMm * dpiScale;
        canvas.height = heightMm * dpiScale;
        const ctx = canvas.getContext('2d');

        const img = new Image();
        const svgBlob = new Blob([standaloneSvg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            canvas.toBlob((pngBlob) => {
                if (pngBlob) triggerDownload(URL.createObjectURL(pngBlob), `${fileTitle}_200dpi.png`);
            }, 'image/png');
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            console.error('Ошибка рендеринга PNG');
        };
        img.src = url;
    }
}

// Нарезка на листы А4 в PDF (1:1 в мм)
async function exportTiledA4PDF(pieceType) {
    const banner = document.getElementById('pdf-status-banner');
    const bannerText = document.getElementById('pdf-status-text');
    if (banner) {
        banner.classList.remove('hidden');
        banner.classList.add('flex');
        bannerText.textContent = 'Подготовка векторного полотна 1:1 и нарезка на листы А4...';
    }

    try {
        const data = getPieceExportData(pieceType);
        const skipEmpty = document.getElementById('chk-skip-empty') ? document.getElementById('chk-skip-empty').checked : true;

        const pageW = 210;
        const pageH = 297;
        const marginX = 15; // Поля 15 мм
        const marginY = 15;
        const tileW = pageW - marginX * 2; // 180 мм
        const tileH = pageH - marginY * 2; // 267 мм

        const cols = Math.max(1, Math.ceil(data.widthMm / tileW));
        const rows = Math.max(1, Math.ceil(data.heightMm / tileH));
        const fullCanvasW = cols * tileW;
        const fullCanvasH = rows * tileH;

        const pxPerMm = 4; // 4 px/mm ~ 101.6 DPI (быстрый и четкий рендеринг без перегрузки памяти)

        const standaloneSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${fullCanvasW * pxPerMm}" height="${fullCanvasH * pxPerMm}" viewBox="${data.minX} ${data.minY} ${fullCanvasW} ${fullCanvasH}">
    <rect x="${data.minX}" y="${data.minY}" width="${fullCanvasW}" height="${fullCanvasH}" fill="#ffffff"/>
    ${data.contentSvg}
</svg>`;

        const masterCanvas = document.createElement('canvas');
        masterCanvas.width = fullCanvasW * pxPerMm;
        masterCanvas.height = fullCanvasH * pxPerMm;
        const mCtx = masterCanvas.getContext('2d');

        await new Promise((resolve, reject) => {
            const img = new Image();
            const svgBlob = new Blob([standaloneSvg], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            img.onload = () => {
                mCtx.fillStyle = '#ffffff';
                mCtx.fillRect(0, 0, masterCanvas.width, masterCanvas.height);
                mCtx.drawImage(img, 0, 0, masterCanvas.width, masterCanvas.height);
                URL.revokeObjectURL(url);
                resolve();
            };
            img.onerror = (e) => {
                URL.revokeObjectURL(url);
                reject(e);
            };
            img.src = url;
        });

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const tileCanvas = document.createElement('canvas');
        tileCanvas.width = tileW * pxPerMm;
        tileCanvas.height = tileH * pxPerMm;
        const tCtx = tileCanvas.getContext('2d');

        const isTileNonEmpty = (ctx, w, h) => {
            const imgData = ctx.getImageData(0, 0, w, h).data;
            for (let i = 0; i < imgData.length; i += 16) {
                if (imgData[i] < 245 || imgData[i + 1] < 245 || imgData[i + 2] < 245) return true;
            }
            return false;
        };

        let addedPagesCount = 0;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const sx = c * tileW * pxPerMm;
                const sy = r * tileH * pxPerMm;

                tCtx.fillStyle = '#ffffff';
                tCtx.fillRect(0, 0, tileCanvas.width, tileCanvas.height);
                tCtx.drawImage(masterCanvas, sx, sy, tileCanvas.width, tileCanvas.height, 0, 0, tileCanvas.width, tileCanvas.height);

                const isFirstTile = (r === 0 && c === 0);
                if (skipEmpty && !isFirstTile && !isTileNonEmpty(tCtx, tileCanvas.width, tileCanvas.height)) {
                    continue;
                }

                if (addedPagesCount > 0) pdf.addPage('a4', 'portrait');
                addedPagesCount++;

                const rowLetter = String.fromCharCode(65 + r);
                const colNumber = c + 1;
                const cellCode = `${rowLetter}${colNumber}`;

                // Вставка тайла в масштабе 1:1
                const tileDataUrl = tileCanvas.toDataURL('image/png');
                pdf.addImage(tileDataUrl, 'PNG', marginX, marginY, tileW, tileH);

                // Рамка склейки (пунктир)
                pdf.setDrawColor(120, 120, 125);
                pdf.setLineWidth(0.25);
                pdf.setLineDashPattern([2, 1.5], 0);
                pdf.rect(marginX, marginY, tileW, tileH);
                pdf.setLineDashPattern([], 0);

                // Замкнутые 4-угольные ромбики совмещения
                pdf.setDrawColor(24, 24, 27);
                pdf.setFillColor(24, 24, 27);
                const drawDiamond = (cx, cy, sz = 2.2) => {
                    pdf.lines([[sz, sz], [-sz, sz], [-sz, -sz]], cx, cy - sz, [1, 1], 'FD', true);
                };
                drawDiamond(marginX + tileW / 2, marginY);
                drawDiamond(marginX + tileW / 2, marginY + tileH);
                drawDiamond(marginX, marginY + tileH / 2);
                drawDiamond(marginX + tileW, marginY + tileH / 2);

                // Угловые крестики
                const drawCross = (cx, cy) => {
                    pdf.setLineWidth(0.35);
                    pdf.line(cx - 3, cy, cx + 3, cy);
                    pdf.line(cx, cy - 3, cx, cy + 3);
                };
                drawCross(marginX, marginY);
                drawCross(marginX + tileW, marginY);
                drawCross(marginX, marginY + tileH);
                drawCross(marginX + tileW, marginY + tileH);

                // Колонтитулы
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(9.5);
                pdf.setTextColor(24, 24, 27);
                pdf.text(`A4 [${cellCode}]  |  Row ${r + 1}/${rows}, Col ${c + 1}/${cols}`, marginX, marginY - 4.5);

                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(7.5);
                pdf.setTextColor(100, 100, 108);
                pdf.text(`Scale 100%  •  OG:${state.og} OT:${state.ot} OB:${state.ob}  •  Glue along dashed line`, marginX + 60, marginY - 4.5);

                // Номер листа
                pdf.setFillColor(244, 244, 245);
                pdf.setDrawColor(180, 180, 185);
                pdf.rect(marginX + 3, marginY + 3, 20, 9, 'FD');
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10.5);
                pdf.setTextColor(24, 24, 27);
                pdf.text(cellCode, marginX + 13, marginY + 9.2, { align: 'center' });

                // Проверочный квадрат 50x50 мм на листе A1 (размещен на правом верхнем поле, без перекрытия чертежа)
                if (isFirstTile) {
                    const sqX = marginX + tileW - 55;
                    const sqY = marginY + 4;
                    pdf.setFillColor(255, 255, 255);
                    pdf.setDrawColor(24, 24, 27);
                    pdf.setLineWidth(0.45);
                    pdf.rect(sqX, sqY, 50, 50, 'S'); // 'S' = Stroke without opaque Fill to never erase drawing

                    for (let step = 10; step < 50; step += 10) {
                        pdf.line(sqX + step, sqY, sqX + step, sqY + 3);
                        pdf.line(sqX, sqY + step, sqX + 3, sqY + step);
                    }
                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(8);
                    pdf.setTextColor(24, 24, 27);
                    pdf.text('TEST SQUARE', sqX + 25, sqY + 20, { align: 'center' });
                    pdf.setFontSize(9.5);
                    pdf.text('5.0 x 5.0 cm', sqX + 25, sqY + 27, { align: 'center' });
                }
            }
        }

        pdf.save(`${data.fileTitle}_A4_${addedPagesCount}pages.pdf`);
    } catch (err) {
        console.error('Ошибка генерации PDF А4:', err);
    } finally {
        if (banner) {
            setTimeout(() => {
                banner.classList.add('hidden');
                banner.classList.remove('flex');
            }, 600);
        }
    }
}

function triggerDownload(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
}
