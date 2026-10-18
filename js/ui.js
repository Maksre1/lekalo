// js/ui.js - Пользовательский интерфейс с понятными подсказками и мобильной адаптацией

// Активный режим отображения на смартфонах ('canvas' | 'sidebar')
let mobileView = 'canvas';

function buildInputs() {
    const renderGroup = (containerId, list) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = list.map(item => `
            <div class="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs card-hover">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1 pr-2">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="text-xs font-bold text-stone-900">${item.label}</span>
                            <span class="text-[10px] mono px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 font-bold">${item.abbr}</span>
                            <button type="button" onclick="showMeasurementHint('${item.label}', '${item.abbr}', '${item.hint.replace(/'/g, "\\'")}')" class="text-stone-400 hover:text-indigo-600 p-0.5 transition cursor-pointer" title="Как измерить?">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke-width="2"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v-4m0-4h.01"/>
                                </svg>
                            </button>
                        </div>
                        <p class="text-[11px] text-stone-500 line-clamp-1 mt-0.5">${item.hint}</p>
                    </div>
                    <!-- Блок ввода с кнопками + / - -->
                    <div class="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50/80 shadow-xs shrink-0">
                        <button type="button" onclick="adjustValue('${item.key}', -${item.step})" class="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-bold active:bg-stone-300/60 transition cursor-pointer">−</button>
                        <input type="number" id="num-${item.key}" value="${state[item.key]}" min="${item.min}" max="${item.max}" step="${item.step}"
                            oninput="syncInput('${item.key}', this.value)"
                            class="w-12 text-center mono text-xs font-bold bg-white border-x border-stone-200 py-1 focus:outline-none focus:bg-indigo-50/50">
                        <button type="button" onclick="adjustValue('${item.key}', ${item.step})" class="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-bold active:bg-stone-300/60 transition cursor-pointer">+</button>
                    </div>
                </div>
                <input type="range" id="rng-${item.key}" value="${state[item.key]}" min="${item.min}" max="${item.max}" step="${item.step}"
                    oninput="syncInput('${item.key}', this.value)" class="w-full mt-1.5">
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
    if (typeof StorageManager !== 'undefined') StorageManager.save();
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

    if (tabName === 'style') {
        if (state.garmentType === 'skirt' && typeof renderSkirtStyleCatalog === 'function') {
            renderSkirtStyleCatalog();
        } else if (state.garmentType === 'dress' && typeof renderDressStyleCatalog === 'function') {
            renderDressStyleCatalog();
        } else if (state.garmentType === 'panties') {
            if (typeof renderPantiesStyleCatalog === 'function') renderPantiesStyleCatalog();
            else if (typeof renderPantiesActiveDetails === 'function') renderPantiesActiveDetails();
        }
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
    if (typeof renderDressActiveDetails === 'function') {
        renderDressActiveDetails();
    }
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
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
    if (typeof StorageManager !== 'undefined') StorageManager.save();
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
    if (typeof StorageManager !== 'undefined') StorageManager.save();
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
    if (typeof StorageManager !== 'undefined') StorageManager.save();
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
    if (!g || state.garmentType !== 'dress' || !g.bustFitLabel) {
        return;
    }
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

    let rows = [];
    const garment = state.garmentType || 'dress';

    if (garment === 'skirt') {
        const skirtG = (g && g.type === 'skirt') ? g : calculateSkirtGeometry();
        if (skirtG.isCircular) {
            rows = [
                { name: 'Модель юбки', abbr: 'Фасон', formula: skirtG.isSun ? 'Солнце (360°)' : 'Полусолнце (180°)', val: skirtG.style },
                { name: 'Обхват талии', abbr: 'От', formula: 'Талия фигуры', val: `${skirtG.ot} см` },
                { name: 'Прибавка по талии', abbr: 'Пт', formula: 'Свобода пояса', val: `+${skirtG.pt} см` },
                { name: 'Радиус выемки талии', abbr: 'R талии', formula: '(От + 2*Пт) / k*π', val: `${skirtG.rWaist.toFixed(1)} см` },
                { name: 'Длина юбки', abbr: 'Дю', formula: 'От талии до низа', val: `${skirtG.skirtLength} см` },
                { name: 'Внешний радиус подола', abbr: 'R низа', formula: 'R талии + Дю', val: `${skirtG.rHem.toFixed(1)} см` },
                { name: 'Длина пояса', abbr: 'Пояс', formula: 'От + 2*Пт + припуск 3 см', val: `${skirtG.beltLength.toFixed(1)} см` }
            ];
        } else {
            rows = [
                { name: 'Ширина сетки юбки', abbr: 'Сб+Пб', formula: 'Полуобхват бедер + прибавка', val: `${skirtG.W_grid.toFixed(1)} см` },
                { name: 'Линия талии', abbr: 'Ст+Пт', formula: 'Полуобхват талии + прибавка', val: `${skirtG.St.toFixed(1)} см` },
                { name: 'Сумма вытачек', abbr: 'ΣВ', formula: 'Разница бедра - талия', val: `${skirtG.totalDart.toFixed(1)} см` },
                { name: 'Боковая вытачка', abbr: 'Вбок (50%)', formula: 'Вытачка в боковой шов', val: `${skirtG.sideDart.toFixed(1)} см` },
                { name: 'Задняя вытачка', abbr: 'Взад (32%)', formula: 'Вытачка заднего полотнища', val: `${skirtG.backDart.toFixed(1)} см` },
                { name: 'Передняя вытачка', abbr: 'Впер (18%)', formula: 'Вытачка переднего полотнища', val: `${skirtG.frontDart.toFixed(1)} см` },
                { name: 'Длина юбки', abbr: 'Дю', formula: 'От талии до подола', val: `${skirtG.skirtLength} см` },
                { name: 'Клеш подола', abbr: 'Расклешение', formula: skirtG.style === 'a-line' ? 'Трапеция (+6.5 см)' : (skirtG.style === 'pencil' ? 'Заужение (-3.2 см)' : 'Прямой'), val: `${skirtG.flareOffset > 0 ? '+' : ''}${skirtG.flareOffset} см` }
            ];
        }
    } else if (garment === 'panties') {
        const pantG = (g && g.type === 'panties') ? g : calculatePantiesGeometry();
        rows = [
            { name: 'Модель трусиков', abbr: 'Фасон', formula: pantG.model.toUpperCase(), val: pantG.model },
            { name: 'Обхват бедер фигуры', abbr: 'Об', formula: 'Реальный замер по ягодицам', val: `${pantG.ob} см` },
            { name: 'Расчетный обхват (ткань)', abbr: 'Об_расч', formula: 'С учетом растяжения ткани', val: `${pantG.obCalc.toFixed(1)} см` },
            { name: 'Растяжимость ткани', abbr: 'К_растяж', formula: 'Уменьшение выкройки', val: `-${(100 - pantG.stretch * 100).toFixed(0)}%` },
            { name: 'Ширина верха переда', abbr: 'Шпер', formula: 'Половина со сгибом', val: `${pantG.frontTopHalfW.toFixed(1)} см` },
            { name: 'Ширина верха спинки', abbr: 'Шспин', formula: 'Половина со сгибом', val: `${pantG.backTopHalfW.toFixed(1)} см` },
            { name: 'Длина бокового шва', abbr: 'Бок', formula: 'Высота соединения боков', val: `${pantG.sideSeam.toFixed(1)} см` },
            { name: 'Длина ластовицы', abbr: 'Ластовица', formula: 'Хлопковая вставка', val: `${pantG.gussetLen} см` }
        ];
    } else {
        rows = [
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
    }

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
    const garment = state.garmentType || 'dress';
    const tileW = 18.0;
    const tileH = 26.7;
    const calcTiles = (wCm, hCm) => {
        const c = Math.max(1, Math.ceil((parseFloat(wCm) + 3) / tileW));
        const r = Math.max(1, Math.ceil((parseFloat(hCm) + 3) / tileH));
        return { c, r, total: c * r };
    };

    const setBadge = (id, t) => {
        const el = document.getElementById(id);
        if (el) el.textContent = `${t.total} л. (${t.c}×${t.r})`;
    };

    const elBack = document.getElementById('dim-back');
    const elFront = document.getElementById('dim-front');
    const elSleeve = document.getElementById('dim-sleeve');
    const elAll = document.getElementById('dim-all');
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    if (garment === 'skirt') {
        const skirtG = (g && g.type === 'skirt') ? g : calculateSkirtGeometry();
        setText('export-title-back', '1. Заднее полотнище юбки');
        setText('export-title-front', '2. Переднее полотнище юбки');
        setText('export-title-sleeve', '3. Пояс юбки (со сгибом)');
        setText('export-title-all', '4. Полный комплект юбки');
        setText('modal-title-back', '1. Заднее полотнище юбки');
        setText('modal-title-front', '2. Переднее полотнище юбки');
        setText('modal-title-sleeve', '3. Пояс юбки (со сгибом)');
        setText('modal-title-all', '4. Полный комплект юбки');
        setText('modal-desc-back', 'Вытачки на талии, средний шов (молния/шлица) и боковой срез.');
        setText('modal-desc-front', 'Сгиб ткани по линии середины переда, передняя вытачка.');
        setText('modal-desc-sleeve', 'Прямоугольный притачной пояс с припуском под застёжку.');
        setText('modal-desc-all', 'Все детали юбки с припусками на швы и контрольными метками.');

        const backW = (skirtG.X_side + Math.max(0, skirtG.flareOffset)).toFixed(1);
        const frontW = (skirtG.W_grid - skirtG.X_side + Math.max(0, -skirtG.flareOffset)).toFixed(1);
        const skirtH = skirtG.skirtLength.toFixed(1);

        if (elBack) elBack.textContent = `${backW} × ${skirtH} см`;
        if (elFront) elFront.textContent = `${frontW} × ${skirtH} см`;
        if (elSleeve) elSleeve.textContent = `${skirtG.beltLength.toFixed(1)} × ${skirtG.beltWidth} см`;
        if (elAll) elAll.textContent = `${skirtG.widthCm} × ${skirtG.heightCm} см`;

        const tBack = calcTiles(backW, skirtH);
        const tFront = calcTiles(frontW, skirtH);
        const tBelt = calcTiles(skirtG.beltLength, skirtG.beltWidth);
        const tAll = calcTiles(skirtG.widthCm, skirtG.heightCm);

        setBadge('pages-back', tBack);
        setBadge('pages-front', tFront);
        setBadge('pages-sleeve', tBelt);
        setBadge('pages-all', tAll);
        setBadge('modal-pages-back', tBack);
        setBadge('modal-pages-front', tFront);
        setBadge('modal-pages-sleeve', tBelt);
        setBadge('modal-pages-all', tAll);
        return;
    }

    if (garment === 'panties') {
        const pantG = (g && g.type === 'panties') ? g : calculatePantiesGeometry();
        setText('export-title-back', `1. Спинка трусиков (${pantG.model})`);
        setText('export-title-front', '2. Передняя деталь');
        setText('export-title-sleeve', '3. Ластовица (хлопок)');
        setText('export-title-all', '4. Весь комплект (1-2 листа А4)');
        setText('modal-title-back', `1. Спинка трусиков (${pantG.model})`);
        setText('modal-title-front', '2. Передняя деталь');
        setText('modal-title-sleeve', '3. Ластовица (хлопок)');
        setText('modal-title-all', '4. Весь комплект (1-2 листа А4)');
        setText('modal-desc-back', 'Анатомический вырез спинки с учетом растяжимости ткани.');
        setText('modal-desc-front', 'Передняя деталь со сгибом и вырезами для ног.');
        setText('modal-desc-sleeve', 'Двойная хлопковая гигиеническая деталь со сгибом.');
        setText('modal-desc-all', 'Перед, спинка и ластовица — быстро помещаются на 1-2 листах А4!');

        if (elBack) elBack.textContent = `${pantG.backTopHalfW.toFixed(1)} × ${pantG.backHeight} см`;
        if (elFront) elFront.textContent = `${pantG.frontTopHalfW.toFixed(1)} × ${pantG.frontHeight} см`;
        if (elSleeve) elSleeve.textContent = `${pantG.gussetBackHalfW.toFixed(1)} × ${pantG.gussetLen} см`;
        if (elAll) elAll.textContent = `${pantG.widthCm} × ${pantG.heightCm} см`;

        const tBack = calcTiles(pantG.backTopHalfW, pantG.backHeight);
        const tFront = calcTiles(pantG.frontTopHalfW, pantG.frontHeight);
        const tGusset = calcTiles(pantG.gussetBackHalfW, pantG.gussetLen);
        const tAll = calcTiles(pantG.widthCm, pantG.heightCm);

        setBadge('pages-back', tBack);
        setBadge('pages-front', tFront);
        setBadge('pages-sleeve', tGusset);
        setBadge('pages-all', tAll);
        setBadge('modal-pages-back', tBack);
        setBadge('modal-pages-front', tFront);
        setBadge('modal-pages-sleeve', tGusset);
        setBadge('modal-pages-all', tAll);
        return;
    }

    // Платье (по умолчанию)
    setText('export-title-back', '1. Спинка (со сгибом)');
    setText('export-title-front', '2. Полочка (перед)');
    setText('export-title-sleeve', '3. Рукав втачной');
    setText('export-title-all', '4. Весь комплект (все детали)');
    setText('modal-title-back', '1. Деталь «Спинка»');
    setText('modal-title-front', '2. Деталь «Полочка»');
    setText('modal-title-sleeve', '3. Деталь «Рукав»');
    setText('modal-title-all', '4. Полный комплект выкройки');
    setText('modal-desc-back', 'Контур со сгибом, плечевая и талиевая вытачки.');
    setText('modal-desc-front', 'Контур переда, нагрудная вытачка и приталивание.');
    setText('modal-desc-sleeve', 'Анатомический окат, точно согласованный с проймой.');
    setText('modal-desc-all', 'Все детали единым файлом для сквозной печати.');

    const maxBackX = Math.max(g.X_G4, g.B3.x, g.P1.x, g.H_back_side ? g.H_back_side.x : g.B3.x);
    const backW = maxBackX.toFixed(1);
    const backH = (g.Y_H + g.H_back_neck).toFixed(1);
    const minFrontX = Math.min(g.P5_open.x, g.P5_closed.x, g.X_G4, g.B4.x, g.H_front_side ? g.H_front_side.x : g.B4.x);
    const frontW = (g.X_G3 - minFrontX).toFixed(1);
    const frontH = (g.Y_H + 1.2 - g.Y_V1).toFixed(1);

    if (elBack) elBack.textContent = `${backW} × ${backH} см`;
    if (elFront) elFront.textContent = `${frontW} × ${frontH} см`;
    if (elSleeve) elSleeve.textContent = `${g.W_sleeve.toFixed(1)} × ${g.L_sleeve.toFixed(1)} см`;
    if (elAll) elAll.textContent = `${Math.round(g.W_grid + g.W_sleeve + 24)} × ${Math.round(Math.max(g.Y_H, g.L_sleeve) + 15)} см`;

    const tBack = calcTiles(backW, backH);
    const tFront = calcTiles(frontW, frontH);
    const tSleeve = calcTiles(g.W_sleeve, g.L_sleeve);
    const tAll = calcTiles(g.W_grid + g.W_sleeve + 24, Math.max(g.Y_H, g.L_sleeve) + 12);

    setBadge('pages-back', tBack);
    setBadge('pages-front', tFront);
    setBadge('pages-sleeve', tSleeve);
    setBadge('pages-all', tAll);
    setBadge('modal-pages-back', tBack);
    setBadge('modal-pages-front', tFront);
    setBadge('modal-pages-sleeve', tSleeve);
    setBadge('modal-pages-all', tAll);
}

// Управление динамическими контекстными вкладками (чистый интерфейс без лишнего)
function updateContextualTabs(garmentType) {
    const tabsBar = document.getElementById('tabs-header-bar');
    const tabMeasures = document.getElementById('tab-measures');
    const tabStyle = document.getElementById('tab-style');
    const tabFit = document.getElementById('tab-fit');
    const tabLayout = document.getElementById('tab-layout');
    const tabExport = document.getElementById('tab-export');
    if (!tabsBar || !tabMeasures || !tabStyle || !tabExport) return;

    // Сброс тепловой карты для поясных и бельевых изделий
    if (garmentType !== 'dress' && state.showFitHeatmap) {
        state.showFitHeatmap = false;
        const btnHeatmap = document.getElementById('btn-toggle-heatmap');
        if (btnHeatmap) {
            btnHeatmap.className = "w-full py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center gap-2 transition cursor-pointer";
            btnHeatmap.innerHTML = `<span>🌡️ Показать карту прилегания (Heatmap)</span>`;
        }
    }

    if (garmentType === 'panties') {
        // Трусики: только 3 логичных шага: Мерки -> Модель -> Печать
        tabsBar.className = "grid grid-cols-3 border-b border-stone-200 bg-stone-50 text-[11px] font-medium text-stone-500";
        tabMeasures.textContent = "1. Мерки";
        tabStyle.textContent = "2. Модель";
        tabExport.textContent = "3. Печать";
        if (tabFit) tabFit.classList.add('hidden');
        if (tabLayout) tabLayout.classList.add('hidden');
        if (tabExport) tabExport.classList.remove('hidden');

        // Если была открыта скрытая вкладка, переключаем на модель
        const panelFit = document.getElementById('panel-fit');
        const panelLayout = document.getElementById('panel-layout');
        if ((panelFit && !panelFit.classList.contains('hidden')) || (panelLayout && !panelLayout.classList.contains('hidden'))) {
            switchTab('style');
        }
    } else if (garmentType === 'skirt') {
        // Юбка: 4 шага: Мерки -> Фасон -> Ткань -> Печать (Посадка скрыта)
        tabsBar.className = "grid grid-cols-4 border-b border-stone-200 bg-stone-50 text-[11px] font-medium text-stone-500";
        tabMeasures.textContent = "1. Мерки";
        tabStyle.textContent = "2. Фасон";
        if (tabLayout) {
            tabLayout.textContent = "3. Ткань";
            tabLayout.classList.remove('hidden');
        }
        tabExport.textContent = "4. Печать";
        if (tabFit) tabFit.classList.add('hidden');
        if (tabExport) tabExport.classList.remove('hidden');

        // Если была открыта Посадка, переключаем на фасон
        const panelFit = document.getElementById('panel-fit');
        if (panelFit && !panelFit.classList.contains('hidden')) {
            switchTab('style');
        }
    } else {
        // Платье / Топ: все 5 шагов
        tabsBar.className = "grid grid-cols-5 border-b border-stone-200 bg-stone-50 text-[11px] font-medium text-stone-500";
        tabMeasures.textContent = "1. Мерки";
        tabStyle.textContent = "2. Фасон";
        if (tabFit) {
            tabFit.textContent = "3. Посадка";
            tabFit.classList.remove('hidden');
        }
        if (tabLayout) {
            tabLayout.textContent = "4. Ткань";
            tabLayout.classList.remove('hidden');
        }
        tabExport.textContent = "5. Печать";
        tabExport.classList.remove('hidden');
    }
}

// Управление типами изделий (Платье, Юбка, Трусики)
function setGarmentType(type) {
    state.garmentType = type;
    updateContextualTabs(type);

    ['dress', 'skirt', 'panties'].forEach(t => {
        const btn = document.getElementById(`btn-garment-${t}`);
        const headerBtn = document.getElementById(`header-garment-${t}`);
        const isActive = (t === type);
        const activeClass = "garment-tab-btn py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 bg-white text-indigo-700 shadow-sm cursor-pointer";
        const inactiveClass = "garment-tab-btn py-1.5 px-2 rounded-lg text-xs font-medium text-stone-700 hover:text-stone-900 transition flex items-center justify-center gap-1 cursor-pointer";

        if (btn) btn.className = isActive ? activeClass : inactiveClass;
        if (headerBtn) {
            headerBtn.className = isActive
                ? "px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm transition flex items-center gap-1 shrink-0 cursor-pointer"
                : "px-2.5 py-1 text-xs font-medium rounded-lg text-stone-700 hover:bg-stone-200 transition flex items-center gap-1 shrink-0 cursor-pointer";
        }
    });

    const badge = document.getElementById('garment-type-badge');
    if (badge) {
        badge.textContent = type === 'skirt' ? 'Поясное (Юбка)' : (type === 'panties' ? 'Белье (Трусики)' : 'Плечевое (Платье)');
    }

    const dressMeasures = document.getElementById('measures-dress-container');
    const skirtMeasures = document.getElementById('measures-skirt-container');
    const pantiesMeasures = document.getElementById('measures-panties-container');
    if (dressMeasures) dressMeasures.classList.toggle('hidden', type !== 'dress');
    if (skirtMeasures) skirtMeasures.classList.toggle('hidden', type !== 'skirt');
    if (pantiesMeasures) pantiesMeasures.classList.toggle('hidden', type !== 'panties');

    const dressStyle = document.getElementById('style-dress-container');
    const skirtStyle = document.getElementById('style-skirt-container');
    const pantiesStyle = document.getElementById('style-panties-container');
    if (dressStyle) dressStyle.classList.toggle('hidden', type !== 'dress');
    if (skirtStyle) skirtStyle.classList.toggle('hidden', type !== 'skirt');
    if (pantiesStyle) pantiesStyle.classList.toggle('hidden', type !== 'panties');

    if (type === 'skirt' && typeof renderSkirtStyleCatalog === 'function') {
        renderSkirtStyleCatalog();
    } else if (type === 'dress' && typeof renderDressStyleCatalog === 'function') {
        renderDressStyleCatalog();
    } else if (type === 'panties') {
        if (typeof renderPantiesStyleCatalog === 'function') renderPantiesStyleCatalog();
        else if (typeof renderPantiesActiveDetails === 'function') renderPantiesActiveDetails();
    }

    resetView();
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();

    const titleRu = type === 'skirt' ? '🩱 Выбрана Юбка (А-силуэт, клеш, прямая, мини)' : (type === 'panties' ? '🩲 Выбраны Женские трусики' : '👗 Выбрано Платье / Блуза');
    showNotification(titleRu);
}

function setSkirtStyle(style) {
    if (typeof selectSkirtStyle === 'function') {
        const info = (typeof getStyleInfo === 'function') ? getStyleInfo('skirt', style) : null;
        selectSkirtStyle(style, info ? info.recLength : 60);
    } else {
        state.skirtStyle = style;
        renderPattern();
    }
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function setSkirtLength(val) {
    state.skirtLength = Number(val);
    const numEl = document.getElementById('num-skirtLength');
    const rngEl = document.getElementById('rng-skirtLength');
    const lblEl = document.getElementById('label-skirtLength');
    if (numEl && document.activeElement !== numEl) numEl.value = val;
    if (rngEl && document.activeElement !== rngEl) rngEl.value = val;
    if (lblEl) lblEl.textContent = val + ' см';
    if (typeof renderSkirtActiveDetails === 'function') {
        renderSkirtActiveDetails();
    }
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function setSkirtRise(rise) {
    state.skirtRise = rise;
    document.querySelectorAll('.skirt-rise-btn').forEach(btn => {
        const isActive = btn.dataset.rise === rise;
        btn.className = isActive
            ? "skirt-rise-btn flex-1 py-1.5 px-2 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm transition text-center"
            : "skirt-rise-btn flex-1 py-1.5 px-2 text-xs font-medium rounded-lg text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition text-center";
    });
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function setPantiesModel(model) {
    state.pantiesModel = model;
    if (typeof renderPantiesStyleCatalog === 'function') {
        renderPantiesStyleCatalog();
    } else if (typeof renderPantiesActiveDetails === 'function') {
        renderPantiesActiveDetails();
    }
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function setPantiesRise(rise) {
    state.pantiesRise = rise;
    document.querySelectorAll('.panties-rise-btn').forEach(btn => {
        const isActive = btn.dataset.rise === rise;
        btn.className = isActive
            ? "panties-rise-btn flex-1 py-1.5 px-2 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm transition text-center"
            : "panties-rise-btn flex-1 py-1.5 px-2 text-xs font-medium rounded-lg text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition text-center";
    });
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function setPantiesLegCut(legCut) {
    state.pantiesLegCut = legCut;
    document.querySelectorAll('.panties-leg-btn').forEach(btn => {
        const isActive = btn.dataset.leg === legCut;
        btn.className = isActive
            ? "panties-leg-btn flex-1 py-1.5 px-2 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm transition text-center"
            : "panties-leg-btn flex-1 py-1.5 px-2 text-xs font-medium rounded-lg text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition text-center";
    });
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function setPantiesStretch(stretch) {
    state.pantiesStretch = Number(stretch);
    document.querySelectorAll('.panties-stretch-btn').forEach(btn => {
        const isActive = Number(btn.dataset.stretch) === Number(stretch);
        btn.className = isActive
            ? "panties-stretch-btn flex-1 py-1.5 px-1 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm transition text-center"
            : "panties-stretch-btn flex-1 py-1.5 px-1 text-xs font-medium rounded-lg text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition text-center";
    });
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
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

// --- УПРАВЛЕНИЕ ЛИЧНЫМ ПРОФИЛЕМ МЕРОК (LOCALSTORAGE & JSON) ---
const PROFILE_STORAGE_KEY = 'lekalo_user_profile';

function initUserProfile() {
    updateProfileBadge();
    try {
        const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (raw) {
            const btn = document.getElementById('btn-my-profile');
            if (btn) btn.classList.add('ring-2', 'ring-amber-300');
        }
    } catch (_) {}
}

function saveMyProfile() {
    const keys = [
        'garmentType',
        'og', 'ot', 'ob', 'osh', 'dts', 'dtp', 'vg', 'cg', 'vb', 'di', 'shp', 'op', 'dr', 'oz',
        'pg', 'pt', 'pb', 'pspr', 'pop', 'posture',
        'dartPosition', 'necklineType', 'necklineDepth', 'sleeveLengthType', 'silhouette',
        'skirtLength', 'skirtStyle', 'skirtRise', 'skirtPt', 'skirtPb',
        'pantiesModel', 'pantiesRise', 'pantiesLegCut', 'pantiesStretch'
    ];
    const profileData = {
        name: 'Мои мерки',
        savedAt: new Date().toLocaleDateString('ru-RU') + ' ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        data: {}
    };
    keys.forEach(k => {
        profileData.data[k] = state[k];
    });

    try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
        updateProfileBadge();
        const btn = document.getElementById('btn-my-profile');
        if (btn) btn.classList.add('ring-2', 'ring-amber-300');
        showNotification('⭐ Ваши мерки сохранены в памяти браузера!');
    } catch (e) {
        console.error('Ошибка сохранения профиля:', e);
        alert('Не удалось сохранить в память браузера.');
    }
}

function applyMyProfile() {
    try {
        const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (!raw) {
            saveMyProfile();
            return;
        }
        const profile = JSON.parse(raw);
        if (!profile || !profile.data) return;

        Object.keys(profile.data).forEach(k => {
            state[k] = profile.data[k];
            const numEl = document.getElementById(`num-${k}`);
            const rngEl = document.getElementById(`rng-${k}`);
            if (numEl) numEl.value = profile.data[k];
            if (rngEl) rngEl.value = profile.data[k];
        });

        // Снимаем выделение со стандартных размеров ГОСТ и подсвечиваем "Мои мерки"
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.className = "preset-btn flex-1 sm:flex-initial px-2 py-1 text-xs mono font-medium rounded-lg text-stone-700 hover:bg-white transition text-center";
        });
        const myBtn = document.getElementById('btn-my-profile');
        if (myBtn) {
            myBtn.className = "px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500 text-white ring-2 ring-amber-300 shadow-sm transition flex items-center gap-1 shrink-0 cursor-pointer";
        }

        if (state.garmentType) setGarmentType(state.garmentType);
        if (state.posture) setPosture(state.posture);
        if (state.dartPosition) setDartPosition(state.dartPosition);
        if (state.necklineType) setNecklineType(state.necklineType);
        if (state.sleeveLengthType) setSleeveLength(state.sleeveLengthType);
        if (state.silhouette) setSilhouette(state.silhouette);
        if (state.skirtStyle) setSkirtStyle(state.skirtStyle);
        if (state.skirtRise) setSkirtRise(state.skirtRise);
        if (state.pantiesModel) setPantiesModel(state.pantiesModel);
        if (state.pantiesRise) setPantiesRise(state.pantiesRise);
        if (state.pantiesLegCut) setPantiesLegCut(state.pantiesLegCut);
        if (state.pantiesStretch) setPantiesStretch(state.pantiesStretch);

        renderPattern();
        updateProfileBadge();
        showNotification(`⭐ Загружен ваш профиль (${profile.savedAt || ''})`);
    } catch (e) {
        console.error('Ошибка загрузки профиля:', e);
    }
}

function updateProfileBadge() {
    const badge = document.getElementById('profile-saved-badge');
    if (!badge) return;
    try {
        const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (raw) {
            const p = JSON.parse(raw);
            badge.textContent = `Сохранен: ${p.savedAt || 'Да'}`;
            badge.className = "text-[10px] text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded font-mono font-medium";
        } else {
            badge.textContent = 'Не сохранен';
            badge.className = "text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-mono font-medium";
        }
    } catch (_) {}
}

function exportProfileJson() {
    const keys = [
        'garmentType',
        'og', 'ot', 'ob', 'osh', 'dts', 'dtp', 'vg', 'cg', 'vb', 'di', 'shp', 'op', 'dr', 'oz',
        'pg', 'pt', 'pb', 'pspr', 'pop', 'posture',
        'dartPosition', 'necklineType', 'necklineDepth', 'sleeveLengthType', 'silhouette',
        'skirtLength', 'skirtStyle', 'skirtRise', 'skirtPt', 'skirtPb',
        'pantiesModel', 'pantiesRise', 'pantiesLegCut', 'pantiesStretch'
    ];
    const exportData = {
        app: 'Конструктор выкроек САПР 1:1',
        name: 'Мои индивидуальные мерки',
        exportedAt: new Date().toISOString(),
        measurements: {}
    };
    keys.forEach(k => {
        exportData.measurements[k] = state[k];
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moi_merki_OG${state.og}_OT${state.ot}_OB${state.ob}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('📥 Файл с вашими мерками скачан на диск!');
}

function importProfileJson(inputEl) {
    const file = inputEl.files && inputEl.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const parsed = JSON.parse(e.target.result);
            const m = parsed.measurements || parsed.data || parsed;
            Object.keys(m).forEach(k => {
                if (k in state) {
                    state[k] = m[k];
                    const numEl = document.getElementById(`num-${k}`);
                    const rngEl = document.getElementById(`rng-${k}`);
                    if (numEl) numEl.value = m[k];
                    if (rngEl) rngEl.value = m[k];
                }
            });
            saveMyProfile();
            renderPattern();
            showNotification('📤 Ваши мерки успешно загружены из файла!');
        } catch (err) {
            alert('Ошибка чтения файла мерок. Убедитесь, что это правильный .json файл.');
        }
    };
    reader.readAsText(file);
    inputEl.value = '';
}

function showNotification(text) {
    let el = document.getElementById('cad-toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'cad-toast';
        el.className = 'fixed bottom-16 md:bottom-6 right-6 z-50 bg-stone-900/95 backdrop-blur text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xl border border-stone-700/60 flex items-center gap-2 transform transition-all duration-300 opacity-0 translate-y-3 pointer-events-none';
        document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.remove('opacity-0', 'translate-y-3');
    el.classList.add('opacity-100', 'translate-y-0');
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
        el.classList.remove('opacity-100', 'translate-y-0');
        el.classList.add('opacity-0', 'translate-y-3');
    }, 2800);
}

