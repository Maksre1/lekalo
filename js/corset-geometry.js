// js/corset-geometry.js - Параметрическое ядро построения сценических, будуарных и корсетных изделий
// Реальное геометрическое построение выкроек: корсеты (6-8 панелей), пояс Waspie, кимоно, пеньюар, болеро с капюшоном, ромпер и передник

function calculateCorsetGeometry(options = {}) {
    const og = Number(state.og) || 92;
    const ot = Number(state.ot) || 74;
    const ob = Number(state.ob) || 98;
    const osh = Number(state.osh) || 36;
    const op = Number(state.op) || 32.5;
    const oz = state.oz ? Number(state.oz) : (typeof AutoMeasurements !== 'undefined' ? AutoMeasurements.oz() : 16.5);
    const dr = Number(state.dr) || 61.0;
    const vg = Number(state.vg) || 27.0;
    const vb = Number(state.vb) || 18.5;
    const dts = Number(state.dts) || 40.0;
    const dtp = Number(state.dtp) || 44.0;
    const shp = Number(state.shp) || 13.0;

    const style = state.corsetStyle || 'underbust-corset';
    const reduction = Number(state.corsetReduction) || 5.0; // утяжка талии (см)
    const withHood = Boolean(state.shrugWithHood);
    const gatherK = Number(state.apronRuffleGather) || 1.8;

    // Утяжка по талии
    const targetWaist = Math.max(50, ot - reduction);
    const targetWaistHalf = targetWaist / 2;
    const underbustHalf = Math.max(30, (og * 0.42)); // основание груди
    const hipHalf = (ob / 2) + 1.0; // бедра с легким припуском

    let widthCm = 90;
    let heightCm = 65;
    let panels = [];
    let extraPieces = [];
    let spec = {};

    if (style === 'underbust-corset') {
        // Подгрудный корсет из 4 профилированных деталей на полуобхвате (8 деталей на все изделие)
        // Высота: 11 см вверх от талии, 14 см вниз от талии
        const hTop = 11.0;
        const hBot = 14.0;
        const totalH = hTop + hBot;

        // Распределение ширины по талии между 4 панелями:
        // П1 (Центр переда): 22%
        // П2 (Бочок переда): 25%
        // П3 (Бочок спинки): 25%
        // П4 (Центр спинки): 28%
        const wP1_waist = targetWaistHalf * 0.22;
        const wP2_waist = targetWaistHalf * 0.25;
        const wP3_waist = targetWaistHalf * 0.25;
        const wP4_waist = targetWaistHalf * 0.28;

        // Ширины по верху (под грудью):
        const wP1_top = underbustHalf * 0.23;
        const wP2_top = underbustHalf * 0.27; // подъем под основание железы
        const wP3_top = underbustHalf * 0.25;
        const wP4_top = underbustHalf * 0.25;

        // Ширины по низу (бедра):
        const wP1_bot = hipHalf * 0.22;
        const wP2_bot = hipHalf * 0.26;
        const wP3_bot = hipHalf * 0.26;
        const wP4_bot = hipHalf * 0.26;

        panels = [
            {
                id: 'p1-front-center',
                num: 1,
                title: 'ПАНЕЛЬ 1: ЦЕНТР ПЕРЕДА',
                subtitle: '2 детали (со шнуровкой / бюском)',
                wTop: wP1_top,
                wWaist: wP1_waist,
                wBot: wP1_bot,
                hTop: hTop + 1.5, // мысок вверх к ложбинке
                hBot: hBot + 3.5, // выраженный мыс переда вниз
                boningCount: 2,
                hasEyelets: false,
                hasBusk: true,
                grainline: 'center'
            },
            {
                id: 'p2-front-side',
                num: 2,
                title: 'ПАНЕЛЬ 2: БОЧОК ПЕРЕДА',
                subtitle: '2 детали (анатомический рельеф)',
                wTop: wP2_top,
                wWaist: wP2_waist,
                wBot: wP2_bot,
                hTop: hTop + 2.5, // подъем под центр груди
                hBot: hBot + 1.0,
                boningCount: 2,
                hasEyelets: false,
                hasBusk: false,
                grainline: 'center'
            },
            {
                id: 'p3-back-side',
                num: 3,
                title: 'ПАНЕЛЬ 3: БОЧОК СПИНКИ',
                subtitle: '2 детали (вырез над бедром)',
                wTop: wP3_top,
                wWaist: wP3_waist,
                wBot: wP3_bot,
                hTop: hTop - 0.5,
                hBot: hBot - 2.5, // арка над бедром для свободы сидения
                boningCount: 2,
                hasEyelets: false,
                hasBusk: false,
                grainline: 'center'
            },
            {
                id: 'p4-back-center',
                num: 4,
                title: 'ПАНЕЛЬ 4: ЦЕНТР СПИНКИ',
                subtitle: '2 детали (планка со шнуровкой)',
                wTop: wP4_top,
                wWaist: wP4_waist,
                wBot: wP4_bot,
                hTop: hTop,
                hBot: hBot + 1.0,
                boningCount: 2,
                hasEyelets: true, // планка со шнуровкой
                hasBusk: false,
                eyeletSpacing: 2.5,
                grainline: 'center'
            }
        ];

        widthCm = 88;
        heightCm = 42;
        spec = {
            panelsCount: 8,
            boningTotal: 16,
            waistReduction: reduction,
            targetWaist: targetWaist,
            eyeletsCount: 20
        };

    } else if (style === 'waspie-belt') {
        // Узкий шнурованный пояс-корсаж (Waspie Waist Belt)
        // Высота: 6 см вверх от талии, 8 см вниз (всего 14 см)
        const hTop = 6.0;
        const hBot = 8.0;

        const wP1_waist = targetWaistHalf * 0.28;
        const wP2_waist = targetWaistHalf * 0.34;
        const wP3_waist = targetWaistHalf * 0.38;

        panels = [
            {
                id: 'waspie-p1',
                num: 1,
                title: 'ПАНЕЛЬ 1: ЦЕНТР ПЕРЕДА',
                subtitle: '2 дет. со сгибом/застежкой',
                wTop: wP1_waist * 1.08,
                wWaist: wP1_waist,
                wBot: wP1_waist * 1.15,
                hTop: hTop + 3.0, // острый фигурный мыс
                hBot: hBot + 3.5, // острый мыс книзу
                boningCount: 2,
                hasEyelets: false,
                grainline: 'center'
            },
            {
                id: 'waspie-p2',
                num: 2,
                title: 'ПАНЕЛЬ 2: БОКОВАЯ ЧАСТЬ',
                subtitle: '2 детали (выемка бедра)',
                wTop: wP2_waist * 1.05,
                wWaist: wP2_waist,
                wBot: wP2_waist * 1.18,
                hTop: hTop - 1.0,
                hBot: hBot - 2.5, // глубокий вырез над тазовой костью
                boningCount: 2,
                hasEyelets: false,
                grainline: 'center'
            },
            {
                id: 'waspie-p3',
                num: 3,
                title: 'ПАНЕЛЬ 3: ЦЕНТР СПИНКИ',
                subtitle: '2 дет. (люверсы шнуровки)',
                wTop: wP3_waist * 1.06,
                wWaist: wP3_waist,
                wBot: wP3_waist * 1.12,
                hTop: hTop + 2.0,
                hBot: hBot + 2.0,
                boningCount: 2,
                hasEyelets: true,
                eyeletSpacing: 2.0,
                grainline: 'center'
            }
        ];

        widthCm = 75;
        heightCm = 35;
        spec = {
            panelsCount: 6,
            boningTotal: 12,
            waistReduction: reduction,
            targetWaist: targetWaist,
            eyeletsCount: 16
        };

    } else if (style === 'boudoir-kimono') {
        // Короткое шелковое/кружевное кимоно (Boudoir Kimono Robe)
        const backW = (og / 4) + 6.0;
        const frontW = backW + 12.0; // нахлест запаха
        const kimonoLen = 78.0; // длина кимоно по спинке
        const sleeveW = 38.0; // широкий прямоугольный рукав
        const sleeveL = 38.0;
        const beltL = 160.0;
        const beltW = 7.0;

        extraPieces = [
            { id: 'kimono-back', title: 'СПИНКА КИМОНО', subtitle: '1 дет. со сгибом', w: backW, h: kimonoLen, isFold: true },
            { id: 'kimono-front', title: 'ПОЛОЧКА С ЗАПАХОМ', subtitle: '2 детали (запах +12 см)', w: frontW, h: kimonoLen, isFold: false },
            { id: 'kimono-sleeve', title: 'ШИРОКИЙ РУКАВ-КИМОНО', subtitle: '2 дет. летящий крой', w: sleeveW, h: sleeveL, isFold: false },
            { id: 'kimono-belt', title: 'ПОЯС ПОД ЗАВЯЗКУ', subtitle: '1 дет. 160×7 см', w: beltL, h: beltW, isFold: false }
        ];

        widthCm = 95;
        heightCm = 85;
        spec = {
            robeLength: kimonoLen,
            sleeveWidth: sleeveW,
            beltLength: beltL,
            wrapOverlap: 12.0
        };

    } else if (style === 'bell-peignoir') {
        // Сетчатый пеньюар с рукавом-клеш (Bell-Sleeve Peignoir)
        const pLen = 82.0;
        const bodiceH = vg + 3.0; // линия под грудью (ампир)
        const sleeveCapW = 34.0;
        const sleeveElbowW = 26.0;
        const sleeveFlareW = 54.0; // двойное расширение от локтя
        const sleeveL = dr + 2.0;

        extraPieces = [
            { id: 'peignoir-back', title: 'СПИНКА ПЕНЬЮАРА', subtitle: '1 дет. со сгибом', w: (og / 4) + 5.0, h: pLen, isFold: true },
            { id: 'peignoir-front', title: 'ПОЛОЧКА НА ЗАВЯЗКАХ', subtitle: '2 дет. кулиска под грудью', w: (og / 4) + 8.0, h: pLen, isFold: false },
            { id: 'peignoir-sleeve', title: 'РУКАВ-КОЛОКОЛ (BELL-SLEEVE)', subtitle: '2 дет. клеш от локтя (2.1x)', w: sleeveFlareW, h: sleeveL, isFold: false }
        ];

        widthCm = 96;
        heightCm = 90;
        spec = {
            peignoirLength: pLen,
            underbustLevel: bodiceH,
            sleeveFlare: sleeveFlareW,
            closure: 'Шелковые завязки под грудью'
        };

    } else if (style === 'super-crop-shrug') {
        // Экстремальное болеро / Съемные рукава с капюшоном (Super-Crop Shrug / Cut-Out Hoodie)
        const shrugBackLen = 19.0; // закрывает только верх спинки до лопаток
        const frontChestDrop = 8.5; // глубокий дугообразный вырез над грудью
        const sleeveL = dr + 4.0; // удлиненный рукав с напуском на кисть
        const sleeveW = op + 3.0;
        const thumbholeDist = 6.0; // прорезь для большого пальца

        extraPieces = [
            { id: 'shrug-back', title: 'МИКРО-СПИНКА БОЛЕРО', subtitle: '1 дет. со сгибом (до лопаток 19 см)', w: (og / 4) + 2.5, h: shrugBackLen, isFold: true },
            { id: 'shrug-sleeve', title: 'РУКАВ С ПРОРЕЗЬЮ ПОД ПАЛЕЦ', subtitle: '2 дет. длина 65 см, прорезь 4.5 см', w: sleeveW, h: sleeveL, isFold: false, thumbhole: true }
        ];

        if (withHood) {
            extraPieces.push({
                id: 'shrug-hood',
                title: 'АНАТОМИЧЕСКИЙ КАПЮШОН (ХУДИ)',
                subtitle: '2 дет. с кулиской 2.5 см под шнурок',
                w: 28.0,
                h: 36.0,
                isFold: false
            });
        }

        widthCm = 85;
        heightCm = 75;
        spec = {
            backLength: shrugBackLen,
            sleeveLength: sleeveL,
            thumbholeSize: 4.5,
            hasHood: withHood
        };

    } else if (style === 'lounge-romper') {
        // Домашний микро-ромпер (Lounge Teddy Romper)
        const topH = dts;
        const shortsH = 26.0; // ультракороткие шортики
        const totalRomperH = topH + shortsH;

        extraPieces = [
            { id: 'romper-front', title: 'ПЕРЕДНЯЯ ДЕТАЛЬ РОМПЕРА', subtitle: '2 дет. с планкой под кнопки', w: (og / 4) + 3.5, h: totalRomperH, isFold: false },
            { id: 'romper-back', title: 'СПИНКА РОМПЕРА', subtitle: '1 дет. со сгибом', w: (og / 4) + 3.0, h: totalRomperH, isFold: true },
            { id: 'romper-gusset', title: 'ЛАСТОВИЦА ШОРТ', subtitle: '2 дет. хлопок 12×7 см', w: 12.0, h: 7.0, isFold: false }
        ];

        widthCm = 88;
        heightCm = 78;
        spec = {
            totalLength: totalRomperH,
            closure: 'Центральная планка на 5 кнопок',
            waistElastic: 'Кулиска под эластичную нить/резинку 0.8 см',
            strapsLength: 38.0
        };

    } else if (style === 'french-maid-apron') {
        // Кокетливый мини-передник (French Maid Ruffle Apron)
        const apronW = 34.0;
        const apronH = 26.0;
        const hemPerimeter = Math.PI * (apronW / 2) + 12.0; // дуга подола передника
        const ruffleLength = Math.round(hemPerimeter * gatherK);
        const strapRuffleLength = Math.round(52.0 * gatherK);

        extraPieces = [
            { id: 'apron-main', title: 'ФИГУРНЫЙ ПОЛУКРУГЛЫЙ ФАРТУК', subtitle: '1 дет. со сгибом (ширина 34 см)', w: apronW / 2, h: apronH, isFold: true },
            { id: 'apron-bib', title: 'ФИГУРНЫЙ НАГРУДНИК', subtitle: '1 дет. со сгибом 16×13 см', w: 8.0, h: 13.0, isFold: true },
            { id: 'apron-belt', title: 'ПОЯС-БАНТ С ДЛИННЫМИ КОНЦАМИ', subtitle: '1 дет. 140×5 см (завязка на бант)', w: 140.0, h: 5.0, isFold: false },
            { id: 'apron-straps', title: 'БРЕТЕЛИ КРЕСТ-НАКРЕСТ', subtitle: '2 детали 68×4 см', w: 68.0, h: 4.0, isFold: false },
            { id: 'apron-ruffle-main', title: 'ПОЛОСА КРУЖЕВНОЙ ОБОРКИ ПОДОЛА', subtitle: `Расчет: ${hemPerimeter.toFixed(0)} см × k${gatherK} = ${ruffleLength} см (ширина 5 см)`, w: ruffleLength, h: 5.0, isFold: false },
            { id: 'apron-ruffle-straps', title: 'ОБОРКИ НА БРЕТЕЛИ (2 ШТ.)', subtitle: `2 полосы по ${strapRuffleLength} см (ширина 4 см)`, w: strapRuffleLength, h: 4.0, isFold: false }
        ];

        widthCm = 92;
        heightCm = 68;
        spec = {
            apronWidth: apronW,
            apronHeight: apronH,
            ruffleTotalLength: ruffleLength,
            strapRuffleLength: strapRuffleLength,
            beltLength: 140.0,
            gatherCoeff: gatherK
        };
    }

    return {
        type: 'corset',
        style,
        og, ot, ob, osh, op, oz, dr, vg, vb, dts, dtp, shp,
        reduction,
        targetWaist,
        targetWaistHalf,
        widthCm,
        heightCm,
        panels,
        extraPieces,
        spec
    };
}

// Генерация SVG разметки лекал корсетных и сценических изделий
function generateCorsetPiecesMarkup(g, options = {}) {
    const showClassic = options.showClassic ?? state.classicStyle;
    const isSeparate = options.separate ?? state.separate;
    const showGrainline = options.showGrainline ?? state.showGrainline;
    const showNotches = options.showNotches ?? state.showNotches;

    const colLine = showClassic ? '#27272a' : '#991b1b';
    const colFill = showClassic ? '#ffffff' : 'rgba(225, 29, 72, 0.04)';
    const colBoning = '#dc2626';
    const colGrain = '#3f3f46';

    let markup = '';

    if (g.style === 'underbust-corset' || g.style === 'waspie-belt') {
        // Отрисовка профилированных корсетных панелей с кулисками под косточки и разметкой люверсов
        let currentX = 5.0; // отступ слева в см
        const gapX = isSeparate ? 6.5 : 2.0;

        g.panels.forEach((p, idx) => {
            const originX = currentX;
            const wT = p.wTop;
            const wW = p.wWaist;
            const wB = p.wBot;
            const hT = p.hTop;
            const hB = p.hBot;

            // Координаты углов детали (линия талии на Y = 22 см)
            const yWaist = 22.0;
            const pTL = { x: originX + (wW - wT) * 0.35, y: yWaist - hT };
            const pTR = { x: originX + wT + (wW - wT) * 0.35, y: yWaist - hT };
            const pWL = { x: originX, y: yWaist };
            const pWR = { x: originX + wW, y: yWaist };
            const pBL = { x: originX + (wW - wB) * 0.3, y: yWaist + hB };
            const pBR = { x: originX + wB + (wW - wB) * 0.3, y: yWaist + hB };

            // Плавный анатомический контур панели корсета
            const panelPath = `
                M ${pTL.x * CM} ${pTL.y * CM}
                Q ${(pTL.x + pTR.x) * 0.5 * CM} ${(pTL.y - 1.2) * CM} ${pTR.x * CM} ${pTR.y * CM}
                Q ${(pTR.x + pWR.x) * 0.5 * CM + 3} ${(pTR.y + pWR.y) * 0.5 * CM} ${pWR.x * CM} ${pWR.y * CM}
                Q ${(pWR.x + pBR.x) * 0.5 * CM + 4} ${(pWR.y + pBR.y) * 0.5 * CM} ${pBR.x * CM} ${pBR.y * CM}
                Q ${(pBL.x + pBR.x) * 0.5 * CM} ${(pBL.y + 1.5) * CM} ${pBL.x * CM} ${pBL.y * CM}
                Q ${(pWL.x + pBL.x) * 0.5 * CM - 4} ${(pWL.y + pBL.y) * 0.5 * CM} ${pWL.x * CM} ${pWL.y * CM}
                Q ${(pTL.x + pWL.x) * 0.5 * CM - 3} ${(pTL.y + pWL.y) * 0.5 * CM} ${pTL.x * CM} ${pTL.y * CM}
                Z
            `;

            // Линия талии (контрольная засечка)
            const waistLine = `
                <line x1="${(pWL.x - 0.5) * CM}" y1="${yWaist * CM}" x2="${(pWR.x + 0.5) * CM}" y2="${yWaist * CM}" stroke="#71717a" stroke-width="0.8" stroke-dasharray="3,3"/>
                <text x="${(originX + wW * 0.5) * CM}" y="${(yWaist - 0.5) * CM}" text-anchor="middle" font-family="JetBrains Mono" font-size="7.5" fill="#71717a">ТАЛИЯ (${wW.toFixed(1)} см)</text>
            `;

            // Кулиски под косточки (туннели для регилина/стальных костей шириной 8 мм)
            let boningMarkup = '';
            const b1_x = originX + wW * 0.33;
            const b2_x = originX + wW * 0.67;
            boningMarkup += `
                <line x1="${b1_x * CM}" y1="${(yWaist - hT + 1.2) * CM}" x2="${b1_x * CM}" y2="${(yWaist + hB - 1.2) * CM}" stroke="${colBoning}" stroke-width="1.3" stroke-dasharray="4,2"/>
                <line x1="${(b1_x + 0.8) * CM}" y1="${(yWaist - hT + 1.2) * CM}" x2="${(b1_x + 0.8) * CM}" y2="${(yWaist + hB - 1.2) * CM}" stroke="${colBoning}" stroke-width="0.8" stroke-dasharray="2,2"/>
                <line x1="${b2_x * CM}" y1="${(yWaist - hT + 1.2) * CM}" x2="${b2_x * CM}" y2="${(yWaist + hB - 1.2) * CM}" stroke="${colBoning}" stroke-width="1.3" stroke-dasharray="4,2"/>
                <line x1="${(b2_x + 0.8) * CM}" y1="${(yWaist - hT + 1.2) * CM}" x2="${(b2_x + 0.8) * CM}" y2="${(yWaist + hB - 1.2) * CM}" stroke="${colBoning}" stroke-width="0.8" stroke-dasharray="2,2"/>
                <text x="${b1_x * CM}" y="${(yWaist + hB - 2.5) * CM}" font-family="JetBrains Mono" font-size="6.5" font-weight="bold" fill="${colBoning}">КУЛИСКА 8мм</text>
            `;

            // Шнуровка / Люверсы (для панели спинки или переда)
            let eyeletsMarkup = '';
            if (p.hasEyelets) {
                const elX = originX + wW * 0.85;
                eyeletsMarkup += `<g id="eyelets-panel-${p.num}">`;
                for (let y = yWaist - hT + 2.0; y <= yWaist + hB - 2.0; y += p.eyeletSpacing || 2.5) {
                    eyeletsMarkup += `
                        <circle cx="${elX * CM}" cy="${y * CM}" r="2.5" fill="#ffffff" stroke="#e11d48" stroke-width="1.4"/>
                        <circle cx="${elX * CM}" cy="${y * CM}" r="1.0" fill="#e11d48"/>
                    `;
                }
                eyeletsMarkup += `
                    <text x="${elX * CM + 7}" y="${yWaist * CM}" font-family="JetBrains Mono" font-size="7" font-weight="bold" fill="#e11d48" transform="rotate(-90 ${elX * CM + 7} ${yWaist * CM})">ШНУРОВКА (ЛЮВЕРСЫ Ø4мм)</text>
                </g>`;
            }

            // Долевая нить и подписи
            const grainlineMarkup = showGrainline ? `
                <g id="grain-${p.num}">
                    <line x1="${(originX + wW * 0.5) * CM}" y1="${(yWaist - hT * 0.6) * CM}" x2="${(originX + wW * 0.5) * CM}" y2="${(yWaist + hB * 0.6) * CM}" stroke="${colGrain}" stroke-width="0.9" marker-start="url(#arrow-start)" marker-end="url(#arrow-end)"/>
                    <text x="${(originX + wW * 0.5 + 2) * CM}" y="${(yWaist + 4) * CM}" font-family="JetBrains Mono" font-size="7" fill="${colGrain}">ДОЛЕВАЯ</text>
                </g>
            ` : '';

            markup += `
                <g id="corset-panel-${p.num}">
                    <path d="${panelPath}" fill="${colFill}" stroke="${colLine}" stroke-width="1.8" stroke-linejoin="round"/>
                    ${waistLine}
                    ${boningMarkup}
                    ${eyeletsMarkup}
                    ${grainlineMarkup}
                    <!-- Заголовок детали -->
                    <text x="${(originX + wW * 0.5) * CM}" y="${(yWaist - hT + 3.2) * CM}" text-anchor="middle" font-family="Manrope, sans-serif" font-size="9" font-weight="800" fill="#18181b">${p.title}</text>
                    <text x="${(originX + wW * 0.5) * CM}" y="${(yWaist - hT + 5.0) * CM}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#71717a">${p.subtitle}</text>
                </g>
            `;

            currentX += Math.max(wT, wW, wB) + gapX;
        });

    } else {
        // Отрисовка других сценических моделей: Кимоно, Пеньюар, Болеро, Ромпер, Передник
        let curX = 5.0;
        const curY = 5.0;

        g.extraPieces.forEach((piece, idx) => {
            const pW = piece.w * CM;
            const pH = piece.h * CM;
            const px = curX * CM;
            const py = curY * CM;

            // Контур детали
            let piecePath = '';
            if (piece.id === 'apron-main') {
                // Полукруглый фартук
                piecePath = `
                    M ${px} ${py}
                    L ${px + pW} ${py}
                    Q ${px + pW} ${py + pH * 0.6} ${px + pW * 0.7} ${py + pH}
                    Q ${px + pW * 0.3} ${py + pH + 8} ${px} ${py + pH}
                    Z
                `;
            } else if (piece.id === 'shrug-sleeve' && piece.thumbhole) {
                // Рукав с прорезью под большой палец
                piecePath = `
                    M ${px} ${py + 7 * CM}
                    Q ${px + pW * 0.5} ${py} ${px + pW} ${py + 7 * CM}
                    L ${px + pW * 0.75} ${py + pH}
                    L ${px + pW * 0.25} ${py + pH}
                    Z
                `;
            } else if (piece.id === 'peignoir-sleeve') {
                // Рукав-колокол (клеш от локтя)
                const elbowY = py + (pH * 0.55);
                piecePath = `
                    M ${px + pW * 0.2} ${py + 5 * CM}
                    Q ${px + pW * 0.5} ${py} ${px + pW * 0.8} ${py + 5 * CM}
                    L ${px + pW * 0.65} ${elbowY}
                    L ${px + pW} ${py + pH}
                    Q ${px + pW * 0.5} ${py + pH + 12} ${px} ${py + pH}
                    L ${px + pW * 0.35} ${elbowY}
                    Z
                `;
            } else {
                piecePath = `
                    M ${px} ${py}
                    L ${px + pW} ${py}
                    L ${px + pW} ${py + pH}
                    L ${px} ${py + pH}
                    Z
                `;
            }

            // Метки сгиба и долевой
            let foldGrainMarkup = '';
            if (piece.isFold) {
                foldGrainMarkup += `
                    <line x1="${px + 2}" y1="${py + 5}" x2="${px + 2}" y2="${py + pH - 5}" stroke="#dc2626" stroke-width="1.6" stroke-dasharray="5,3"/>
                    <text x="${px + 8}" y="${py + pH * 0.5}" font-family="JetBrains Mono" font-size="8" font-weight="bold" fill="#dc2626" transform="rotate(-90 ${px + 8} ${py + pH * 0.5})">[ СГИБ ТКАНИ ]</text>
                `;
            }
            if (showGrainline) {
                foldGrainMarkup += `
                    <line x1="${px + pW * 0.5}" y1="${py + 15}" x2="${px + pW * 0.5}" y2="${py + pH - 15}" stroke="${colGrain}" stroke-width="0.8" marker-start="url(#arrow-start)" marker-end="url(#arrow-end)"/>
                    <text x="${px + pW * 0.5 + 4}" y="${py + pH * 0.5}" font-family="JetBrains Mono" font-size="7.5" fill="${colGrain}">ДОЛЕВАЯ</text>
                `;
            }

            // Опция отверстия под палец для болеро
            let thumbMarkup = '';
            if (piece.thumbhole) {
                const thY = py + pH - 6 * CM;
                thumbMarkup = `
                    <line x1="${px + pW * 0.25 + 5}" y1="${thY}" x2="${px + pW * 0.25 + 5}" y2="${thY + 4.5 * CM}" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round"/>
                    <circle cx="${px + pW * 0.25 + 5}" cy="${thY}" r="2" fill="#f59e0b"/>
                    <circle cx="${px + pW * 0.25 + 5}" cy="${thY + 4.5 * CM}" r="2" fill="#f59e0b"/>
                    <text x="${px + pW * 0.25 + 12}" y="${thY + 2.5 * CM}" font-family="JetBrains Mono" font-size="7.5" font-weight="bold" fill="#d97706">✂ ПРОРЕЗЬ ДЛЯ ПАЛЬЦА 4.5 см</text>
                `;
            }

            markup += `
                <g id="corset-extra-${piece.id}">
                    <path d="${piecePath}" fill="${colFill}" stroke="${colLine}" stroke-width="1.8" stroke-linejoin="round"/>
                    ${foldGrainMarkup}
                    ${thumbMarkup}
                    <!-- Текст детали -->
                    <text x="${px + pW * 0.5}" y="${py + 18}" text-anchor="middle" font-family="Manrope, sans-serif" font-size="10" font-weight="800" fill="#18181b">${piece.title}</text>
                    <text x="${px + pW * 0.5}" y="${py + 32}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" fill="#71717a">${piece.subtitle}</text>
                    <text x="${px + pW * 0.5}" y="${py + 44}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#059669">${Math.round(piece.w)} × ${Math.round(piece.h)} см</text>
                </g>
            `;

            curX += piece.w + (isSeparate ? 5.0 : 2.5);
            if (curX > 75.0 && idx < g.extraPieces.length - 1) {
                curX = 5.0;
            }
        });
    }

    return {
        markup,
        totalWidthCm: g.widthCm,
        totalHeightCm: g.heightCm
    };
}
