// js/ui.js - Пользовательский интерфейс с понятными подсказками и мобильной адаптацией

// Активный режим отображения на смартфонах ('canvas' | 'sidebar')
let mobileView = 'canvas';

function buildInputs() {
    const renderGroup = (containerId, list) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = list.map(item => `
            <div class="bg-white p-3 rounded-xl border border-stone-200 shadow-sm card-hover">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1 pr-2">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="text-xs font-semibold text-stone-900">${item.label}</span>
                            <span class="text-[10px] mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold">${item.abbr}</span>
                            <button type="button" onclick="showMeasurementHint('${item.label}', '${item.abbr}', '${item.hint.replace(/'/g, "\\'")}')" class="text-stone-400 hover:text-indigo-600 p-0.5 transition" title="Как измерить?">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke-width="2"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v-4m0-4h.01"/>
                                </svg>
                            </button>
                        </div>
                        <p class="text-[11px] text-stone-500 line-clamp-1 mt-0.5">${item.hint}</p>
                    </div>
                    <!-- Блок ввода с кнопками + / - для удобства пальцев на смартфонах -->
                    <div class="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50 shrink-0">
                        <button type="button" onclick="adjustValue('${item.key}', -${item.step})" class="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 font-bold active:bg-stone-300 transition">−</button>
                        <input type="number" id="num-${item.key}" value="${state[item.key]}" min="${item.min}" max="${item.max}" step="${item.step}"
                            oninput="syncInput('${item.key}', this.value)"
                            class="w-12 text-center mono text-xs font-bold bg-white border-x border-stone-300 py-1 focus:outline-none focus:bg-indigo-50">
                        <button type="button" onclick="adjustValue('${item.key}', ${item.step})" class="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 font-bold active:bg-stone-300 transition">+</button>
                    </div>
                </div>
                <input type="range" id="rng-${item.key}" value="${state[item.key]}" min="${item.min}" max="${item.max}" step="${item.step}"
                    oninput="syncInput('${item.key}', this.value)" class="w-full mt-1">
            </div>
        `).join('');
    };

    renderGroup('measures-girths', inputConfig.girths);
    renderGroup('measures-lengths', inputConfig.lengths);
    renderGroup('measures-sleeve', inputConfig.sleeve);
    renderGroup('measures-ease', inputConfig.ease);
}

function adjustValue(key, delta) {
    let cur = parseFloat(state[key]);
    if (isNaN(cur)) cur = 0;
    let next = Math.round((cur + delta) * 10) / 10;
    syncInput(key, next);
}

function syncInput(key, value) {
    const val = parseFloat(value);
    if (isNaN(val)) return;
    state[key] = val;

    const numEl = document.getElementById(`num-${key}`);
    const rngEl = document.getElementById(`rng-${key}`);
    if (numEl && document.activeElement !== numEl) numEl.value = val;
    if (rngEl && document.activeElement !== rngEl) rngEl.value = val;

    renderPattern();
}

// Модальное окно с подсказкой «Как правильно снять мерку»
function showMeasurementHint(title, abbr, hintText) {
    const modal = document.getElementById('hint-modal');
    const titleEl = document.getElementById('hint-modal-title');
    const abbrEl = document.getElementById('hint-modal-abbr');
    const textEl = document.getElementById('hint-modal-text');

    if (modal && titleEl && abbrEl && textEl) {
        titleEl.textContent = title;
        abbrEl.textContent = abbr;
        textEl.textContent = hintText;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeHintModal() {
    const modal = document.getElementById('hint-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function setPosture(postureType) {
    state.posture = postureType;
    document.querySelectorAll('.posture-btn').forEach(btn => {
        if (btn.dataset.posture === postureType) {
            btn.className = "posture-btn flex-1 py-2 px-2 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm transition flex flex-col items-center justify-center text-center";
        } else {
            btn.className = "posture-btn flex-1 py-2 px-2 text-xs font-medium rounded-lg text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition flex flex-col items-center justify-center text-center";
        }
    });

    const descEl = document.getElementById('posture-desc');
    if (descEl) {
        if (postureType === 'stooped') {
            descEl.innerHTML = '<b>🧘‍♀️ Сутулая осанка:</b> Спинка удлинена на 1 см, вытачка спинки увеличена до 2.4 см для выпуклых лопаток.';
        } else if (postureType === 'erect') {
            descEl.innerHTML = '<b>💃 Прямая (перегибистая):</b> Плечи расправлены, перед удлинен на 1.2 см, вытачка спинки уменьшена до 1.1 см.';
        } else {
            descEl.innerHTML = '<b>🚶‍♂️ Обычная осанка:</b> Стандартный пропорциональный баланс спинки и полочки.';
        }
    }
    renderPattern();
}

function applyPreset(sizeKey) {
    const p = presets[sizeKey];
    if (!p) return;
    Object.keys(p).forEach(k => {
        state[k] = p[k];
        const numEl = document.getElementById(`num-${k}`);
        const rngEl = document.getElementById(`rng-${k}`);
        if (numEl) numEl.value = p[k];
        if (rngEl) rngEl.value = p[k];
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
        if (btn.dataset.size === sizeKey) {
            btn.className = "preset-btn px-2.5 py-1 text-xs mono font-bold rounded-md bg-indigo-600 text-white shadow-sm transition";
        } else {
            btn.className = "preset-btn px-2.5 py-1 text-xs mono font-medium rounded-md text-stone-700 hover:bg-white transition";
        }
    });

    renderPattern();
}

function applyEasePreset(pg, pt, pb, pspr, pop) {
    syncInput('pg', pg);
    syncInput('pt', pt);
    syncInput('pb', pb);
    syncInput('pspr', pspr);
    syncInput('pop', pop);
}

function switchTab(tabName) {
    const tabs = ['measures', 'style', 'fit', 'layout', 'export'];
    tabs.forEach(t => {
        const panel = document.getElementById(`panel-${t}`);
        const btn = document.getElementById(`tab-${t}`);
        if (panel) panel.classList.add('hidden');
        if (btn) {
            btn.classList.remove('border-indigo-600', 'text-indigo-600', 'bg-white', 'font-bold');
            btn.classList.add('border-transparent', 'text-stone-500', 'font-medium');
        }
    });
    const activePanel = document.getElementById(`panel-${tabName}`);
    const activeBtn = document.getElementById(`tab-${tabName}`);
    if (activePanel) activePanel.classList.remove('hidden');
    if (activeBtn) {
        activeBtn.classList.add('border-indigo-600', 'text-indigo-600', 'bg-white', 'font-bold');
        activeBtn.classList.remove('border-transparent', 'text-stone-500', 'font-medium');
    }
}

// --- МОДЕЛИРОВАНИЕ ФАСОНОВ ---
function setDartPosition(pos) {
    state.dartPosition = pos;
    document.querySelectorAll('.dart-btn').forEach(btn => {
        if (btn.dataset.dart === pos) {
            btn.className = "dart-btn p-2 rounded-xl text-left border-2 border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-950 transition cursor-pointer";
        } else {
            btn.className = "dart-btn p-2 rounded-xl text-left border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition cursor-pointer";
        }
    });
    renderPattern();
}

function setNecklineType(type) {
    state.necklineType = type;
    document.querySelectorAll('.neckline-btn').forEach(btn => {
        if (btn.dataset.neckline === type) {
            btn.className = "neckline-btn p-2 rounded-xl text-left border-2 border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-950 transition cursor-pointer";
        } else {
            btn.className = "neckline-btn p-2 rounded-xl text-left border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition cursor-pointer";
        }
    });
    renderPattern();
}

function setNecklineDepth(val) {
    const d = parseFloat(val);
    if (isNaN(d)) return;
    state.necklineDepth = Math.max(0, Math.min(8, d));
    const numEl = document.getElementById('num-neckline-depth');
    const rngEl = document.getElementById('rng-neckline-depth');
    if (numEl && document.activeElement !== numEl) numEl.value = state.necklineDepth;
    if (rngEl && document.activeElement !== rngEl) rngEl.value = state.necklineDepth;
    renderPattern();
}

function setSleeveLength(type) {
    state.sleeveLengthType = type;
    document.querySelectorAll('.sleeve-length-btn').forEach(btn => {
        if (btn.dataset.sleeve === type) {
            btn.className = "sleeve-length-btn flex-1 py-1.5 px-2 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm transition text-center";
        } else {
            btn.className = "sleeve-length-btn flex-1 py-1.5 px-2 text-xs font-medium rounded-lg text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition text-center";
        }
    });
    renderPattern();
}

function setSilhouette(sil) {
    state.silhouette = sil;
    document.querySelectorAll('.silhouette-btn').forEach(btn => {
        if (btn.dataset.silhouette === sil) {
            btn.className = "silhouette-btn flex-1 py-1.5 px-2 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm transition text-center";
        } else {
            btn.className = "silhouette-btn flex-1 py-1.5 px-2 text-xs font-medium rounded-lg text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition text-center";
        }
    });
    renderPattern();
}

function updateStyleUI(g) {
    document.querySelectorAll('.dart-btn').forEach(btn => {
        const active = btn.dataset.dart === state.dartPosition;
        btn.classList.toggle('border-indigo-600', active);
        btn.classList.toggle('border-2', active);
        btn.classList.toggle('bg-indigo-50/60', active);
    });
    document.querySelectorAll('.neckline-btn').forEach(btn => {
        const active = btn.dataset.neckline === state.necklineType;
        btn.classList.toggle('border-indigo-600', active);
        btn.classList.toggle('border-2', active);
        btn.classList.toggle('bg-indigo-50/60', active);
    });
    document.querySelectorAll('.sleeve-length-btn').forEach(btn => {
        const active = btn.dataset.sleeve === state.sleeveLengthType;
        btn.classList.toggle('bg-indigo-600', active);
        btn.classList.toggle('text-white', active);
    });
    document.querySelectorAll('.silhouette-btn').forEach(btn => {
        const active = btn.dataset.silhouette === state.silhouette;
        btn.classList.toggle('bg-indigo-600', active);
        btn.classList.toggle('text-white', active);
    });
}

// --- ИНДИКАТОР ПРИЛЕГАНИЯ И ТЕПЛОВАЯ КАРТА ---
function toggleFitHeatmap() {
    state.showFitHeatmap = !state.showFitHeatmap;
    const btn = document.getElementById('btn-toggle-heatmap');
    if (btn) {
        if (state.showFitHeatmap) {
            btn.className = "w-full py-2 px-3 text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-sm flex items-center justify-center gap-2 transition cursor-pointer";
            btn.innerHTML = `<span>🔥 Тепловая карта включена (скрыть)</span>`;
        } else {
            btn.className = "w-full py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center gap-2 transition cursor-pointer";
            btn.innerHTML = `<span>🌡️ Показать карту прилегания (Heatmap)</span>`;
        }
    }
    renderPattern();
}

function updateFitIndicatorUI(g) {
    const badgeCategory = document.getElementById('fit-category-badge');
    const badgeCategoryDesc = document.getElementById('fit-category-desc');
    if (badgeCategory) {
        badgeCategory.textContent = g.bustFitLabel;
        badgeCategory.style.backgroundColor = g.bustFitColor + '20';
        badgeCategory.style.color = g.bustFitColor;
        badgeCategory.style.borderColor = g.bustFitColor + '50';
    }
    if (badgeCategoryDesc) {
        if (g.bustFitCategory === 'tight') {
            badgeCategoryDesc.innerHTML = '<b>Облегающий крой:</b> Плотная посадка. Рекомендуется для эластичных тканей (трикотаж, стрейч).';
        } else if (g.bustFitCategory === 'fitted') {
            badgeCategoryDesc.innerHTML = '<b>Прилегающий силуэт:</b> Подчеркивает изгибы фигуры, четкая посадка с легкой свободой дыхания.';
        } else if (g.bustFitCategory === 'semi') {
            badgeCategoryDesc.innerHTML = '<b>Полуприлегающий крой (ГОСТ):</b> Оптимальный баланс элегантности и комфорта в повседневной носке.';
        } else if (g.bustFitCategory === 'relaxed') {
            badgeCategoryDesc.innerHTML = '<b>Свободный крой:</b> Прямой непринужденный силуэт для блуз, жакетов и платьев свободного кроя.';
        } else {
            badgeCategoryDesc.innerHTML = '<b>Оверсайз:</b> Объемный современный фасон со спущенным ощущением свободы.';
        }
    }

    const setGauge = (prefix, val, text, maxVal = 16) => {
        const valEl = document.getElementById(`fit-val-${prefix}`);
        const textEl = document.getElementById(`fit-text-${prefix}`);
        const barEl = document.getElementById(`fit-bar-${prefix}`);
        if (valEl) valEl.textContent = `+${val.toFixed(1)} см`;
        if (textEl) textEl.textContent = text;
        if (barEl) {
            const pct = Math.min(100, Math.max(10, Math.round((val / maxVal) * 100)));
            barEl.style.width = `${pct}%`;
        }
    };

    setGauge('bust', g.totalEaseBust, g.bustFitLabel.split(' ')[0], 16);
    const waistText = g.totalEaseWaist < 2.0 ? 'Плотный пояс' : (g.totalEaseWaist <= 5.0 ? 'Комфортное дыхание' : 'Свободный пояс');
    setGauge('waist', g.totalEaseWaist, waistText, 12);
    const hipsText = g.totalEaseHips < 2.0 ? 'Плотно по бедрам' : (g.totalEaseHips <= 5.0 ? 'Свободный шаг' : 'Летящий низ');
    setGauge('hips', g.totalEaseHips, hipsText, 12);
    const sleeveText = g.totalEaseSleeve < 3.5 ? 'Узкий рукав' : (g.totalEaseSleeve <= 6.5 ? 'Свободный подъем рук' : 'Широкий рукав');
    setGauge('sleeve', g.totalEaseSleeve, sleeveText, 10);
}

// --- КАЛЬКУЛЯТОР ТКАНИ И РАСКЛАДКА ---
function setFabricWidth(w) {
    state.fabricWidth = parseInt(w);
    document.querySelectorAll('.fabric-w-btn').forEach(btn => {
        if (parseInt(btn.dataset.width) === state.fabricWidth) {
            btn.className = "fabric-w-btn flex-1 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm transition text-center";
        } else {
            btn.className = "fabric-w-btn flex-1 py-1.5 text-xs font-medium rounded-lg text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition text-center";
        }
    });
    renderPattern();
}

function toggleFabricFold() {
    state.fabricFold = !state.fabricFold;
    const btn = document.getElementById('btn-fabric-fold');
    if (btn) {
        btn.textContent = state.fabricFold ? 'Раскрой «в сгиб» (полотно вдвое)' : 'Раскрой «в разворот» (в один слой)';
    }
    renderPattern();
}

function setFabricShrinkage(val) {
    const s = parseFloat(val);
    if (isNaN(s)) return;
    state.fabricShrinkage = Math.max(0, Math.min(15, s));
    const lbl = document.getElementById('fabric-shrinkage-val');
    if (lbl) lbl.textContent = `${state.fabricShrinkage}%`;
    renderPattern();
}

function updateFabricLayoutUI(g) {
    if (typeof calculateFabricLayout !== 'function' || typeof renderFabricLayoutSvg !== 'function') return;
    const layout = calculateFabricLayout(g, state);

    const mLen = document.getElementById('layout-length-m');
    const mLenShrink = document.getElementById('layout-length-shrink-m');
    const mEfficiency = document.getElementById('layout-efficiency-pct');
    const svgContainer = document.getElementById('fabric-layout-svg-container');

    if (mLen) mLen.textContent = `${layout.totalLengthM} м`;
    if (mLenShrink) mLenShrink.textContent = `${layout.totalLengthWithShrinkageM} м`;
    if (mEfficiency) mEfficiency.textContent = `${layout.efficiency}%`;
    if (svgContainer) {
        svgContainer.innerHTML = renderFabricLayoutSvg(layout);
    }
}

// Мобильное переключение между списком мерок и чертежом
function setMobileView(view) {
    mobileView = view;
    const sidebar = document.getElementById('cad-sidebar');
    const canvas = document.getElementById('cad-canvas-container');
    const btnParams = document.getElementById('m-btn-params');
    const btnCanvas = document.getElementById('m-btn-canvas');

    if (view === 'sidebar') {
        if (sidebar) sidebar.classList.remove('hidden');
        if (canvas) canvas.classList.add('hidden');
        if (btnParams) btnParams.className = "flex-1 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border-t-2 border-indigo-600 flex items-center justify-center gap-1.5";
        if (btnCanvas) btnCanvas.className = "flex-1 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border-t-2 border-transparent flex items-center justify-center gap-1.5";
    } else {
        if (sidebar) sidebar.classList.add('hidden');
        if (canvas) canvas.classList.remove('hidden');
        if (btnCanvas) btnCanvas.className = "flex-1 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border-t-2 border-indigo-600 flex items-center justify-center gap-1.5";
        if (btnParams) btnParams.className = "flex-1 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border-t-2 border-transparent flex items-center justify-center gap-1.5";
        resetView();
    }
}

function updateCalculationTable(g) {
    const tbody = document.getElementById('calc-table-body');
    if (!tbody) return;

    const rows = [
        { name: 'Ширина сетки', abbr: 'Г1-Г3', formula: 'Полуобхват груди + прибавка', val: `${g.W_grid.toFixed(1)} см` },
        { name: 'Ширина спинки', abbr: 'Шсп', formula: 'Спинка изделия', val: `${g.W_back.toFixed(1)} см` },
        { name: 'Ширина проймы', abbr: 'Шпр', formula: 'Подмышечная область', val: `${g.W_armhole.toFixed(1)} см` },
        { name: 'Ширина переда', abbr: 'Шпол', formula: 'Полочка с вытачкой', val: `${g.W_front.toFixed(1)} см` },
        { name: 'Длина проймы спинки', abbr: 'Дпр_спин', formula: 'Линия проймы сзади', val: `${g.len_back_armhole.toFixed(1)} см` },
        { name: 'Длина проймы переда', abbr: 'Дпр_перед', formula: 'Линия проймы спереди', val: `${g.len_front_armhole.toFixed(1)} см` },
        { name: 'Вся длина проймы', abbr: 'Дпр', formula: 'Сумма полочки и спинки', val: `${g.total_armhole_len.toFixed(1)} см` },
        { name: 'Длина оката рукава', abbr: 'Док', formula: 'Линия втачивания рукава', val: `${g.total_sleeve_cap_len.toFixed(1)} см` },
        { name: 'Посадка по окату', abbr: 'Ппос', formula: 'Док - Дпр (норма +2..+3.5 см)', val: `+${g.sleeve_ease.toFixed(1)} см` },
        { name: 'Раствор вытачки груди', abbr: 'В7-В9', formula: 'Раскрытие для груди', val: `${g.bust_dart_width.toFixed(1)} см` },
        { name: 'Талиевые вытачки', abbr: 'Сумма', formula: 'Приталивание изделия', val: `${g.total_waist_intake.toFixed(1)} см` }
    ];

    tbody.innerHTML = rows.map(r => `
        <tr class="hover:bg-stone-50 border-b border-stone-100">
            <td class="p-2.5 font-medium text-stone-900">
                <div>${r.name}</div>
                <div class="text-[10px] text-stone-400 mono">${r.abbr}</div>
            </td>
            <td class="p-2.5 text-stone-500 text-[11px]">${r.formula}</td>
            <td class="p-2.5 text-right font-bold text-indigo-700 mono text-xs">${r.val}</td>
        </tr>
    `).join('');
}

function updateExportDimensions(g) {
    const maxBackX = Math.max(g.X_G4, g.B3.x, g.P1.x, g.H_back_side ? g.H_back_side.x : g.B3.x);
    const backW = maxBackX.toFixed(1);
    const backH = (g.Y_H + g.H_back_neck).toFixed(1);
    const minFrontX = Math.min(g.P5_open.x, g.P5_closed.x, g.X_G4, g.B4.x, g.H_front_side ? g.H_front_side.x : g.B4.x);
    const frontW = (g.X_G3 - minFrontX).toFixed(1);
    const frontH = (g.Y_H + 1.2 - g.Y_V1).toFixed(1);

    const elBack = document.getElementById('dim-back');
    const elFront = document.getElementById('dim-front');
    const elSleeve = document.getElementById('dim-sleeve');
    const elAll = document.getElementById('dim-all');

    if (elBack) elBack.textContent = `${backW} × ${backH} см`;
    if (elFront) elFront.textContent = `${frontW} × ${frontH} см`;
    if (elSleeve) elSleeve.textContent = `${g.W_sleeve.toFixed(1)} × ${g.L_sleeve.toFixed(1)} см`;
    if (elAll) elAll.textContent = `${Math.round(g.W_grid + g.W_sleeve + 24)} × ${Math.round(Math.max(g.Y_H, g.L_sleeve) + 15)} см`;

    const tileW = 18.0;
    const tileH = 26.7;
    const calcTiles = (wCm, hCm) => {
        const c = Math.max(1, Math.ceil((parseFloat(wCm) + 3) / tileW));
        const r = Math.max(1, Math.ceil((parseFloat(hCm) + 3) / tileH));
        return { c, r, total: c * r };
    };

    const tBack = calcTiles(backW, backH);
    const tFront = calcTiles(frontW, frontH);
    const tSleeve = calcTiles(g.W_sleeve, g.L_sleeve);
    const tAll = calcTiles(g.W_grid + g.W_sleeve + 24, Math.max(g.Y_H, g.L_sleeve) + 12);

    const setBadge = (id, t) => {
        const el = document.getElementById(id);
        if (el) el.textContent = `${t.total} л. (${t.c}×${t.r})`;
    };

    setBadge('pages-back', tBack);
    setBadge('pages-front', tFront);
    setBadge('pages-sleeve', tSleeve);
    setBadge('pages-all', tAll);
    setBadge('modal-pages-back', tBack);
    setBadge('modal-pages-front', tFront);
    setBadge('modal-pages-sleeve', tSleeve);
    setBadge('modal-pages-all', tAll);
}

function openExportModal() {
    const modal = document.getElementById('export-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeExportModal() {
    const modal = document.getElementById('export-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}
