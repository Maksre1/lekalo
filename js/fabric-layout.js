function calculateSkirtFabricLayout(g, state) {
    const fabricW = Number(state.fabricWidth) || 140;
    const isFolded = state.fabricFold !== false;
    const shrinkagePct = Number(state.fabricShrinkage) || 5;
    const margin = 2.5;
    const edgeMargin = 1.5;
    const usableW = isFolded ? (fabricW / 2) : fabricW;

    let pieces = [];
    let totalLengthCm = 0;

    if (g.isCircular) {
        const r = g.rHem + 2.0;
        const beltH = g.beltWidth + 2.0;
        const beltW = g.beltLength + 2.0;

        pieces.push({
            id: 'skirt-circ',
            name: g.isSun ? 'Солнце (1 дет.)' : 'Полусолнце (1 дет.)',
            abbr: g.isSun ? 'Солнце' : 'Полусолнце',
            w: Math.min(r, usableW - edgeMargin),
            h: r,
            x: 0,
            y: edgeMargin,
            color: '#4f46e5',
            bg: 'rgba(79, 70, 229, 0.12)',
            isFold: true
        });

        pieces.push({
            id: 'skirt-belt',
            name: 'Пояс юбки',
            abbr: 'Пояс',
            w: Math.min(beltW, usableW - edgeMargin),
            h: beltH,
            x: edgeMargin,
            y: r + edgeMargin + margin,
            color: '#18181b',
            bg: 'rgba(24, 24, 27, 0.08)'
        });

        totalLengthCm = r + beltH + edgeMargin * 2 + margin + 5;
    } else {
        const backW = (g.X_side + Math.max(0, g.flareOffset)) + 2.0;
        const backH = g.skirtLength + 3.0;
        const frontW = (g.W_grid - g.X_side + Math.max(0, -g.flareOffset)) + 2.0;
        const frontH = g.skirtLength + 3.0;
        const beltH = g.beltWidth + 2.0;
        const beltW = g.beltLength + 2.0;

        if (backW + margin + frontW + edgeMargin <= usableW) {
            pieces.push({
                id: 'skirt-back',
                name: 'Заднее полотнище (со сгибом)',
                abbr: 'Заднее пол.',
                w: backW,
                h: backH,
                x: 0,
                y: edgeMargin,
                color: '#1d4ed8',
                bg: 'rgba(29, 78, 216, 0.12)',
                isFold: true
            });
            pieces.push({
                id: 'skirt-front',
                name: 'Переднее полотнище',
                abbr: 'Переднее пол.',
                w: frontW,
                h: frontH,
                x: backW + margin,
                y: edgeMargin,
                color: '#be123c',
                bg: 'rgba(190, 18, 60, 0.12)',
                isFold: false
            });
            let curY = Math.max(backH, frontH) + edgeMargin + margin;
            pieces.push({
                id: 'skirt-belt',
                name: 'Пояс юбки',
                abbr: 'Пояс',
                w: Math.min(beltW, usableW - edgeMargin),
                h: beltH,
                x: edgeMargin,
                y: curY,
                color: '#18181b',
                bg: 'rgba(24, 24, 27, 0.08)'
            });
            totalLengthCm = curY + beltH + edgeMargin + 4;
        } else {
            pieces.push({
                id: 'skirt-back',
                name: 'Заднее полотнище (со сгибом)',
                abbr: 'Заднее пол.',
                w: backW,
                h: backH,
                x: 0,
                y: edgeMargin,
                color: '#1d4ed8',
                bg: 'rgba(29, 78, 216, 0.12)',
                isFold: true
            });
            let curY = backH + edgeMargin + margin;
            pieces.push({
                id: 'skirt-front',
                name: 'Переднее полотнище (со сгибом)',
                abbr: 'Переднее пол.',
                w: frontW,
                h: frontH,
                x: 0,
                y: curY,
                color: '#be123c',
                bg: 'rgba(190, 18, 60, 0.12)',
                isFold: true
            });
            curY += frontH + margin;
            pieces.push({
                id: 'skirt-belt',
                name: 'Пояс юбки',
                abbr: 'Пояс',
                w: Math.min(beltW, usableW - edgeMargin),
                h: beltH,
                x: edgeMargin,
                y: curY,
                color: '#18181b',
                bg: 'rgba(24, 24, 27, 0.08)'
            });
            totalLengthCm = curY + beltH + edgeMargin + 4;
        }
    }

    totalLengthCm = Math.ceil(totalLengthCm / 5.0) * 5.0;
    const totalLengthWithShrinkageCm = Math.ceil((totalLengthCm * (1 + shrinkagePct / 100)) / 5.0) * 5.0;
    const totalFabricArea = fabricW * totalLengthCm;
    let piecesArea = 0;
    pieces.forEach(p => {
        piecesArea += (p.w * p.h) * (p.isFold ? 2 : 1);
    });
    const efficiency = Math.min(92, Math.max(55, Math.round((piecesArea / totalFabricArea) * 100)));

    return {
        fabricW, usableW, isFolded, shrinkagePct,
        totalLengthCm,
        totalLengthM: (totalLengthCm / 100).toFixed(2),
        totalLengthWithShrinkageCm,
        totalLengthWithShrinkageM: (totalLengthWithShrinkageCm / 100).toFixed(2),
        efficiency,
        pieces
    };
}

function calculatePantiesFabricLayout(g, state) {
    const fabricW = Number(state.fabricWidth) || 140;
    const isFolded = state.fabricFold !== false;
    const shrinkagePct = Number(state.fabricShrinkage) || 5;
    const margin = 2.0;
    const edgeMargin = 1.5;
    const usableW = isFolded ? (fabricW / 2) : fabricW;

    const fW = g.frontTopHalfW + 1.5;
    const fH = g.frontHeight + 1.5;
    const bW = g.backTopHalfW + 1.5;
    const bH = g.backHeight + 1.5;
    const gW = g.gussetBackHalfW + 1.0;
    const gH = g.gussetLen + 1.0;

    let pieces = [];
    pieces.push({
        id: 'panties-front',
        name: 'Перед трусиков (со сгибом)',
        abbr: 'Перед',
        w: fW,
        h: fH,
        x: 0,
        y: edgeMargin,
        color: '#be123c',
        bg: 'rgba(190, 18, 60, 0.12)',
        isFold: true
    });
    pieces.push({
        id: 'panties-back',
        name: 'Спинка трусиков',
        abbr: 'Спинка',
        w: bW,
        h: bH,
        x: fW + margin,
        y: edgeMargin,
        color: '#4338ca',
        bg: 'rgba(67, 56, 202, 0.12)',
        isFold: true
    });
    pieces.push({
        id: 'panties-gusset',
        name: 'Ластовица (2 дет. из хлопка)',
        abbr: 'Ластовица',
        w: gW,
        h: gH,
        x: fW + margin + bW + margin,
        y: edgeMargin,
        color: '#047857',
        bg: 'rgba(4, 120, 87, 0.14)',
        isFold: true
    });

    let totalLengthCm = Math.max(fH, bH) + edgeMargin * 2 + 3.0;
    totalLengthCm = Math.max(30, Math.ceil(totalLengthCm / 5.0) * 5.0);
    const totalLengthWithShrinkageCm = Math.ceil((totalLengthCm * (1 + shrinkagePct / 100)) / 5.0) * 5.0;
    const efficiency = 75;

    return {
        fabricW, usableW, isFolded, shrinkagePct,
        totalLengthCm,
        totalLengthM: (totalLengthCm / 100).toFixed(2),
        totalLengthWithShrinkageCm,
        totalLengthWithShrinkageM: (totalLengthWithShrinkageCm / 100).toFixed(2),
        efficiency,
        pieces
    };
}

function calculateTopFabricLayout(g, state) {
    const fabricW = Number(state.fabricWidth) || 140;
    const isFolded = state.fabricFold !== false;
    const shrinkagePct = Number(state.fabricShrinkage) || 5;
    const margin = 2.5;
    const edgeMargin = 1.5;
    const usableW = isFolded ? (fabricW / 2) : fabricW;

    const backW = Math.max(g.X_side, g.B_hem_side.x, g.B_strap_outer.x, g.B_armhole_bot.x) + 2.0;
    const backH = g.effectiveLength + 2.0;
    const frontW = (g.W_grid - Math.min(g.X_side, g.F_armhole_bot.x)) + 2.0;
    const frontH = g.effectiveLength + g.antiRideupDrop + 2.0;

    let pieces = [];
    let totalLengthCm = 0;
    const hasSleeve = (state.topStyle === 'smart-tee');

    if (backW + margin + frontW + edgeMargin <= usableW) {
        pieces.push({
            id: 'top-back',
            name: 'Спинка топа (со сгибом)',
            abbr: 'Спинка',
            w: backW,
            h: backH,
            x: 0,
            y: edgeMargin,
            color: '#1d4ed8',
            bg: 'rgba(29, 78, 216, 0.12)',
            isFold: true
        });
        pieces.push({
            id: 'top-front',
            name: 'Полочка топа',
            abbr: 'Полочка',
            w: frontW,
            h: frontH,
            x: backW + margin,
            y: edgeMargin,
            color: '#be123c',
            bg: 'rgba(190, 18, 60, 0.12)',
            isFold: false
        });
        let curY = Math.max(backH, frontH) + edgeMargin + margin;
        if (hasSleeve) {
            const slW = g.W_sleeve + 2.0;
            const slH = 21.0;
            pieces.push({
                id: 'top-sleeve-1',
                name: 'Рукав футболки левый',
                abbr: 'Рукав Л',
                w: slW,
                h: slH,
                x: edgeMargin,
                y: curY,
                color: '#047857',
                bg: 'rgba(4, 120, 87, 0.12)'
            });
            if (edgeMargin + slW + margin + slW <= usableW) {
                pieces.push({
                    id: 'top-sleeve-2',
                    name: 'Рукав футболки правый',
                    abbr: 'Рукав П',
                    w: slW,
                    h: slH,
                    x: edgeMargin + slW + margin,
                    y: curY,
                    color: '#047857',
                    bg: 'rgba(4, 120, 87, 0.12)'
                });
                curY += slH + margin;
            } else {
                curY += slH + margin;
                pieces.push({
                    id: 'top-sleeve-2',
                    name: 'Рукав футболки правый',
                    abbr: 'Рукав П',
                    w: slW,
                    h: slH,
                    x: edgeMargin,
                    y: curY,
                    color: '#047857',
                    bg: 'rgba(4, 120, 87, 0.12)'
                });
                curY += slH + margin;
            }
        }
        totalLengthCm = curY + 5;
    } else {
        pieces.push({
            id: 'top-back',
            name: 'Спинка топа (со сгибом)',
            abbr: 'Спинка',
            w: backW,
            h: backH,
            x: 0,
            y: edgeMargin,
            color: '#1d4ed8',
            bg: 'rgba(29, 78, 216, 0.12)',
            isFold: true
        });
        let curY = backH + edgeMargin + margin;
        pieces.push({
            id: 'top-front',
            name: 'Полочка топа',
            abbr: 'Полочка',
            w: frontW,
            h: frontH,
            x: 0,
            y: curY,
            color: '#be123c',
            bg: 'rgba(190, 18, 60, 0.12)',
            isFold: false
        });
        curY += frontH + margin;
        if (hasSleeve) {
            const slW = g.W_sleeve + 2.0;
            const slH = 21.0;
            pieces.push({
                id: 'top-sleeve-1',
                name: 'Рукав футболки левый',
                abbr: 'Рукав Л',
                w: slW,
                h: slH,
                x: edgeMargin,
                y: curY,
                color: '#047857',
                bg: 'rgba(4, 120, 87, 0.12)'
            });
            pieces.push({
                id: 'top-sleeve-2',
                name: 'Рукав футболки правый',
                abbr: 'Рукав П',
                w: slW,
                h: slH,
                x: slW + margin,
                y: curY,
                color: '#047857',
                bg: 'rgba(4, 120, 87, 0.12)'
            });
            curY += slH + margin;
        }
        totalLengthCm = curY + 5;
    }

    totalLengthCm = Math.max(40, Math.ceil(totalLengthCm / 5.0) * 5.0);
    const totalLengthWithShrinkageCm = Math.ceil((totalLengthCm * (1 + shrinkagePct / 100)) / 5.0) * 5.0;
    const efficiency = 78;

    return {
        fabricW, usableW, isFolded, shrinkagePct,
        totalLengthCm,
        totalLengthM: (totalLengthCm / 100).toFixed(2),
        totalLengthWithShrinkageCm,
        totalLengthWithShrinkageM: (totalLengthWithShrinkageCm / 100).toFixed(2),
        efficiency,
        pieces
    };
}

function calculateFabricLayout(g, state) {
    if (state.garmentType === 'skirt') {
        const skirtG = (g && g.type === 'skirt') ? g : calculateSkirtGeometry();
        return calculateSkirtFabricLayout(skirtG, state);
    }
    if (state.garmentType === 'panties') {
        const pantiesG = (g && g.type === 'panties') ? g : calculatePantiesGeometry();
        return calculatePantiesFabricLayout(pantiesG, state);
    }
    if (state.garmentType === 'top') {
        const topG = (g && g.type === 'top') ? g : calculateTopGeometry();
        return calculateTopFabricLayout(topG, state);
    }

    const fabricW = Number(state.fabricWidth) || 140; // см (110, 140, 150)
    const isFolded = state.fabricFold !== false; // по умолчанию в сгиб
    const shrinkagePct = Number(state.fabricShrinkage) || 5; // % на усадку
    const margin = 2.5; // зазор между деталями 2.5 см
    const edgeMargin = 1.5; // отступ от среза/кромки 1.5 см

    // Полезная ширина раскладки (при сгибе - половина полотна)
    const usableW = isFolded ? (fabricW / 2) : fabricW;

    // Габаритные размеры деталей с учетом выступов и припусков
    const maxBackX = Math.max(g.X_G4, g.B3.x, g.P1.x, g.H_back_side ? g.H_back_side.x : g.B3.x);
    const backW = maxBackX + 1.5;
    const backH = (g.Y_H + g.H_back_neck) + 2.0;

    const minFrontX = Math.min(g.P5_open.x, g.P5_closed.x, g.X_G4, g.B4.x, g.H_front_side ? g.H_front_side.x : g.B4.x);
    const frontW = (g.X_G3 - minFrontX) + 1.5;
    const frontH = (g.Y_H + 1.2 - g.Y_V1) + 2.0;

    const sleeveW = g.W_sleeve + 1.5;
    const sleeveH = g.L_sleeve + 2.0;

    // Список деталей для раскладки:
    // 1. Спинка (1 дет. со сгибом: сгиб x = 0)
    // 2. Полочка (1 дет. со сгибом или 2 дет.)
    // 3. Рукав 1 (левый)
    // 4. Рукав 2 (правый)
    let pieces = [];
    let totalLengthCm = 0;

    // Алгоритм оптимизированного размещения по правилам раскроя (долевая нить вдоль рулона Y)
    // При раскрое «в сгиб» линия x=0 является линией сгиба ткани!
    const backPiece = {
        id: 'back',
        name: 'Спинка (1 дет. со сгибом)',
        abbr: 'Спинка',
        w: backW,
        h: backH,
        x: 0, // строго на сгибе полотна
        y: edgeMargin,
        color: '#1d4ed8',
        bg: 'rgba(29, 78, 216, 0.12)',
        isFold: true
    };

    // Проверяем, помещается ли полочка рядом со спинкой по ширине
    if (backW + margin + frontW + edgeMargin <= usableW) {
        // Полочка помещается параллельно спинке
        pieces.push(backPiece);
        pieces.push({
            id: 'front',
            name: 'Полочка (1 дет.)',
            abbr: 'Полочка',
            w: frontW,
            h: frontH,
            x: backW + margin,
            y: edgeMargin,
            color: '#be123c',
            bg: 'rgba(190, 18, 60, 0.12)',
            isFold: false
        });
        let curY = Math.max(backH, frontH) + edgeMargin + margin;

        // Размещение рукавов
        if (sleeveW * 2 + margin + edgeMargin <= usableW) {
            // Два рукава рядом
            pieces.push({
                id: 'sleeve1',
                name: 'Рукав левый',
                abbr: 'Рукав Л',
                w: sleeveW,
                h: sleeveH,
                x: edgeMargin,
                y: curY,
                color: '#047857',
                bg: 'rgba(4, 120, 87, 0.12)'
            });
            pieces.push({
                id: 'sleeve2',
                name: 'Рукав правый',
                abbr: 'Рукав П',
                w: sleeveW,
                h: sleeveH,
                x: edgeMargin + sleeveW + margin,
                y: curY,
                color: '#047857',
                bg: 'rgba(4, 120, 87, 0.12)'
            });
            totalLengthCm = curY + sleeveH + edgeMargin + 4.0;
        } else {
            // Рукава друг за другом
            pieces.push({
                id: 'sleeve1',
                name: 'Рукав левый',
                abbr: 'Рукав Л',
                w: sleeveW,
                h: sleeveH,
                x: edgeMargin,
                y: curY,
                color: '#047857',
                bg: 'rgba(4, 120, 87, 0.12)'
            });
            pieces.push({
                id: 'sleeve2',
                name: 'Рукав правый',
                abbr: 'Рукав П',
                w: sleeveW,
                h: sleeveH,
                x: edgeMargin,
                y: curY + sleeveH + margin,
                color: '#047857',
                bg: 'rgba(4, 120, 87, 0.12)'
            });
            totalLengthCm = curY + sleeveH * 2 + margin + edgeMargin + 4.0;
        }
    } else {
        // Полочка размещается последовательно под спинкой
        pieces.push(backPiece);
        let curY = backH + edgeMargin + margin;
        pieces.push({
            id: 'front',
            name: 'Полочка (1 дет.)',
            abbr: 'Полочка',
            w: frontW,
            h: frontH,
            x: edgeMargin,
            y: curY,
            color: '#be123c',
            bg: 'rgba(190, 18, 60, 0.12)',
            isFold: false
        });
        curY += frontH + margin;

        // Рукава
        if (sleeveW * 2 + margin + edgeMargin <= usableW) {
            pieces.push({
                id: 'sleeve1',
                name: 'Рукав левый',
                abbr: 'Рукав Л',
                w: sleeveW,
                h: sleeveH,
                x: edgeMargin,
                y: curY,
                color: '#047857',
                bg: 'rgba(4, 120, 87, 0.12)'
            });
            pieces.push({
                id: 'sleeve2',
                name: 'Рукав правый',
                abbr: 'Рукав П',
                w: sleeveW,
                h: sleeveH,
                x: edgeMargin + sleeveW + margin,
                y: curY,
                color: '#047857',
                bg: 'rgba(4, 120, 87, 0.12)'
            });
            totalLengthCm = curY + sleeveH + edgeMargin + 4.0;
        } else {
            pieces.push({
                id: 'sleeve1',
                name: 'Рукав левый',
                abbr: 'Рукав Л',
                w: sleeveW,
                h: sleeveH,
                x: edgeMargin,
                y: curY,
                color: '#047857',
                bg: 'rgba(4, 120, 87, 0.12)'
            });
            pieces.push({
                id: 'sleeve2',
                name: 'Рукав правый',
                abbr: 'Рукав П',
                w: sleeveW,
                h: sleeveH,
                x: edgeMargin,
                y: curY + sleeveH + margin,
                color: '#047857',
                bg: 'rgba(4, 120, 87, 0.12)'
            });
            totalLengthCm = curY + sleeveH * 2 + margin + edgeMargin + 4.0;
        }
    }

    // Округление до 5 см в большую сторону (стандарт в магазинах тканей)
    totalLengthCm = Math.ceil(totalLengthCm / 5.0) * 5.0;
    const totalLengthWithShrinkageCm = Math.ceil((totalLengthCm * (1 + shrinkagePct / 100)) / 5.0) * 5.0;

    // Площади для расчета эффективности кроя (%)
    const piecesArea = (backW * backH * (isFolded ? 1 : 2)) + (frontW * frontH) + (sleeveW * sleeveH * 2);
    const fabricArea = fabricW * totalLengthCm;
    const efficiency = Math.min(94, Math.max(50, Math.round((piecesArea / fabricArea) * 100)));

    return {
        fabricW,
        usableW,
        isFolded,
        shrinkagePct,
        totalLengthCm,
        totalLengthM: (totalLengthCm / 100).toFixed(2),
        totalLengthWithShrinkageCm,
        totalLengthWithShrinkageM: (totalLengthWithShrinkageCm / 100).toFixed(2),
        efficiency,
        pieces
    };
}

// Генерация SVG-карты раскладки ткани
function renderFabricLayoutSvg(layoutData) {
    const { fabricW, usableW, isFolded, totalLengthCm, pieces, totalLengthWithShrinkageM, efficiency } = layoutData;
    
    // Масштабирование для красивого отображения в контейнере шириной 360-600px
    const svgW = 420;
    const scale = (svgW - 50) / usableW;
    const svgH = totalLengthCm * scale + 60;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" class="w-full h-auto bg-stone-50 rounded-xl border border-stone-200">`;
    
    // Текстура полотна ткани
    svg += `
        <defs>
            <pattern id="cloth-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" stroke-width="0.5"/>
            </pattern>
        </defs>
        
        <!-- Полотно ткани -->
        <rect x="35" y="25" width="${usableW * scale}" height="${totalLengthCm * scale}" fill="#ffffff" stroke="#94a3b8" stroke-width="1.2"/>
        <rect x="35" y="25" width="${usableW * scale}" height="${totalLengthCm * scale}" fill="url(#cloth-grid)" opacity="0.6"/>
    `;

    // Метки кромки и сгиба ткани
    if (isFolded) {
        svg += `
            <!-- Линия сгиба (слева) -->
            <line x1="35" y1="25" x2="35" y2="${25 + totalLengthCm * scale}" stroke="#4f46e5" stroke-width="2.5" stroke-dasharray="6,3"/>
            <text x="31" y="${25 + (totalLengthCm * scale) / 2}" transform="rotate(-90 31 ${25 + (totalLengthCm * scale) / 2})" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#4f46e5" text-anchor="middle">[ СГИБ ТКАНИ ]</text>
            
            <!-- Кромка ткани (справа) -->
            <line x1="${35 + usableW * scale}" y1="25" x2="${35 + usableW * scale}" y2="${25 + totalLengthCm * scale}" stroke="#64748b" stroke-width="1.8"/>
            <text x="${39 + usableW * scale}" y="${25 + (totalLengthCm * scale) / 2}" transform="rotate(90 ${39 + usableW * scale} ${25 + (totalLengthCm * scale) / 2})" font-family="JetBrains Mono, monospace" font-size="8" font-weight="600" fill="#64748b" text-anchor="middle">КРОМКА ТКАНИ</text>
        `;
    }

    // Размещение деталей
    pieces.forEach(p => {
        const px = 35 + p.x * scale;
        const py = 25 + p.y * scale;
        const pw = p.w * scale;
        const ph = p.h * scale;

        svg += `
            <g>
                <rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="3" fill="${p.bg}" stroke="${p.color}" stroke-width="1.2"/>
                <!-- Стрелка долевой нити -->
                <line x1="${px + pw / 2}" y1="${py + 10}" x2="${px + pw / 2}" y2="${py + ph - 10}" stroke="${p.color}" stroke-width="0.8" stroke-dasharray="2,2"/>
                <!-- Подпись детали -->
                <text x="${px + pw / 2}" y="${py + ph / 2 - 4}" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="${p.color}">${p.abbr}</text>
                <text x="${px + pw / 2}" y="${py + ph / 2 + 9}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" fill="#475569">${Math.round(p.w)}×${Math.round(p.h)} см</text>
            </g>
        `;
    });

    // Линейка длины ткани с левой стороны
    const step = 50; // каждые 50 см
    for (let cm = 0; cm <= totalLengthCm; cm += step) {
        const y = 25 + cm * scale;
        svg += `
            <line x1="28" y1="${y}" x2="35" y2="${y}" stroke="#64748b" stroke-width="1"/>
            <text x="25" y="${y + 3}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="8" fill="#64748b">${cm / 100}м</text>
        `;
    }

    svg += `</svg>`;
    return svg;
}
