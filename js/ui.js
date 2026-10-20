// js/ui.js - Пользовательский интерфейс с понятными подсказками и мобильной адаптацией

// Активный режим отображения на смартфонах ('canvas' | 'sidebar')
let mobileView = 'canvas';

const SMART_AUTO_KEYS = ['shs', 'shg', 'vpk', 'gpr', 'dr_l', 'oz', 'skirtVb', 'skirtBalance'];

function isSmartAutoKey(key) {
    return SMART_AUTO_KEYS.includes(key);
}

function renderAutoBadgeHtml(key, isAuto) {
    if (isAuto) {
        return `
            <span class="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-[#F5F2EB] text-[#78716C] border border-[#E8E2D5] shrink-0 flex items-center gap-1 shadow-2xs" title="Рассчитано автоматически от базовых мерок">
                <i data-lucide="sparkles" class="w-2.5 h-2.5 text-[#E05A47]"></i>Авто
            </span>
        `;
    }
    return `
        <button type="button" onclick="resetToAuto('${key}')" class="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-[#FFF0ED] hover:bg-[#FFE5E0] text-[#E05A47] border border-[#FCDAD5] shrink-0 flex items-center gap-1 transition cursor-pointer active:scale-95 shadow-2xs" title="Вернуться к авторасчету по формуле">
            <i data-lucide="rotate-ccw" class="w-2.5 h-2.5"></i>Сбросить в Авто
        </button>
    `;
}

function updateAutoBadge(key) {
    if (!isSmartAutoKey(key)) return;
    const badgeEl = document.getElementById(`auto-badge-${key}`);
    const numEl = document.getElementById(`num-${key}`);
    const isAuto = typeof AutoMeasurements !== 'undefined' ? AutoMeasurements.isAuto(key) : false;

    if (badgeEl) {
        badgeEl.innerHTML = renderAutoBadgeHtml(key, isAuto);
    }
    if (numEl) {
        if (isAuto) {
            numEl.classList.remove('text-[#2C2825]', 'font-bold');
            numEl.classList.add('text-[#78716C]', 'font-medium');
        } else {
            numEl.classList.remove('text-[#78716C]', 'font-medium');
            numEl.classList.add('text-[#2C2825]', 'font-bold');
        }
    }
    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

function resetToAuto(key) {
    if (key === 'skirtBalance') {
        state[key] = 0.0;
    } else {
        state[key] = null;
    }
    const autoVal = typeof AutoMeasurements !== 'undefined' ? AutoMeasurements.getEffective(key) : '';
    const numEl = document.getElementById(`num-${key}`);
    if (numEl) {
        numEl.value = autoVal;
    }
    updateAutoBadge(key);
    renderPattern();
    syncAllAutoInputs();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
    showNotification(`Мерка «${key.toUpperCase()}» возвращена в автоматический расчет ✨`);
}

function syncAllAutoInputs() {
    if (typeof AutoMeasurements === 'undefined') return;
    SMART_AUTO_KEYS.forEach(k => {
        const isAuto = AutoMeasurements.isAuto(k);
        const numEl = document.getElementById(`num-${k}`);
        if (isAuto && numEl && document.activeElement !== numEl) {
            numEl.value = AutoMeasurements.getEffective(k);
        }
        updateAutoBadge(k);
    });
}

function syncSkirtOptionalInputs() {
    const vbEl = document.getElementById('num-skirtVb');
    if (vbEl && typeof AutoMeasurements !== 'undefined') {
        const isAutoVb = AutoMeasurements.isAuto('skirtVb');
        if (isAutoVb && document.activeElement !== vbEl) {
            vbEl.value = AutoMeasurements.getEffective('skirtVb');
        }
        updateAutoBadge('skirtVb');
    }

    const balEl = document.getElementById('num-skirtBalance');
    if (balEl && typeof AutoMeasurements !== 'undefined') {
        const isAutoBal = AutoMeasurements.isAuto('skirtBalance');
        if (isAutoBal && document.activeElement !== balEl) {
            balEl.value = 0;
        }
        updateAutoBadge('skirtBalance');
    }
}

function buildInputs() {
    const renderGroup = (containerId, list) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = list.map(item => {
            const isRec = Boolean(item.recommended);
            const isSmart = Boolean(item.isSmartAuto);
            const isAuto = isSmart && typeof AutoMeasurements !== 'undefined' ? AutoMeasurements.isAuto(item.key) : false;
            
            let val = '';
            if (isSmart && isAuto) {
                val = AutoMeasurements.getEffective(item.key);
            } else if (state[item.key] !== null && state[item.key] !== undefined && state[item.key] !== '') {
                val = state[item.key];
            }

            const cardClasses = isRec
                ? "py-2.5 px-3 rounded-xl bg-[#FFFBF9] border border-[#FADCD5] mb-2 flex items-center justify-between shadow-[0_2px_10px_-2px_rgba(224,90,71,0.08)] hover:border-[#F4B4A8] transition-colors"
                : "py-2.5 px-3 rounded-xl bg-white border border-[#F0ECE1] mb-2 flex items-center justify-between shadow-[0_2px_8px_-2px_rgba(44,40,37,0.03)] hover:border-[#E3DDD0] transition-colors";

            const recBadge = isRec ? `
                <span class="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-[#FFF0ED] text-[#E05A47] border border-[#FCDAD5] shrink-0 flex items-center gap-0.5" title="Рекомендуем измерить для безупречной посадки в груди">
                    <i data-lucide="sparkles" class="w-2.5 h-2.5 text-[#E05A47]"></i>Советуем
                </span>
            ` : '';

            const autoBadgeHtml = isSmart ? `<div id="auto-badge-${item.key}" class="shrink-0">${renderAutoBadgeHtml(item.key, isAuto)}</div>` : '';

            const inputColorClass = (isSmart && isAuto) ? 'text-[#78716C] font-medium' : 'text-[#2C2825] font-bold';

            return `
            <div class="${cardClasses}">
                <div class="flex items-center gap-1.5 min-w-0 pr-2">
                    <span class="text-xs font-semibold text-[#2C2825] truncate">${item.label}</span>
                    <span class="text-[10px] mono font-bold px-1.5 py-0.5 rounded-md bg-[#FFF5F3] text-[#E05A47] border border-[#FCDAD5] shrink-0">${item.abbr}</span>
                    ${autoBadgeHtml}
                    ${recBadge}
                    <div class="relative group/tip inline-flex items-center shrink-0">
                        <button type="button" onclick="showMeasurementHint('${item.label}', '${item.abbr}', '${item.hint.replace(/'/g, "\\'")}')" class="text-[#A8A29E] hover:text-[#E05A47] p-0.5 transition cursor-pointer flex items-center justify-center rounded-full hover:bg-[#FAF8F5]" aria-label="Справка">
                            <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
                        </button>
                        <div class="radix-tooltip-content hidden group-hover/tip:flex group-focus-within/tip:flex absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-40 w-56 p-2.5 rounded-xl bg-[#2C2825] text-white text-[11px] leading-snug shadow-xl flex-col gap-1 pointer-events-none">
                            <div class="font-bold flex items-center gap-1 text-[#F5F2EB]">${item.label} <span class="text-[#E05A47] font-mono">(${item.abbr})</span></div>
                            <div class="text-[#D6D3D1]">${item.hint}</div>
                            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2C2825] rotate-45"></div>
                        </div>
                    </div>
                </div>
                <!-- Тактильный степпер -->
                <div class="flex items-center border border-[#F0ECE1] rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0">
                    <button type="button" onclick="adjustValue('${item.key}', -${item.step})" class="w-7 h-7 flex items-center justify-center text-[#78716C] hover:text-[#2C2825] hover:bg-[#F0ECE1] font-bold active:scale-95 transition cursor-pointer" title="Уменьшить">−</button>
                    <div class="w-12 text-center mono text-xs bg-white border-x border-[#F0ECE1] py-1 ${inputColorClass}">
                        <input type="number" id="num-${item.key}" value="${val}" placeholder="${item.placeholder || ''}" min="${item.min}" max="${item.max}" step="${item.step}"
                            oninput="syncInput('${item.key}', this.value)"
                            class="w-full text-center bg-transparent focus:outline-none placeholder:text-[#A8A29E] placeholder:font-normal placeholder:italic">
                    </div>
                    <button type="button" onclick="adjustValue('${item.key}', ${item.step})" class="w-7 h-7 flex items-center justify-center text-[#78716C] hover:text-[#2C2825] hover:bg-[#F0ECE1] font-bold active:scale-95 transition cursor-pointer" title="Увеличить">+</button>
                </div>
            </div>
            `;
        }).join('');
    };

    renderGroup('measures-girths', inputConfig.girths);
    renderGroup('measures-lengths', inputConfig.lengths);
    renderGroup('measures-sleeve', inputConfig.sleeve);
    renderGroup('measures-ease', inputConfig.ease);

    syncSkirtOptionalInputs();

    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

function adjustValue(key, delta) {
    let cur = state[key];
    const isSmart = isSmartAutoKey(key);

    if (cur === null || cur === undefined || cur === '' || isNaN(parseFloat(cur))) {
        if (isSmart && typeof AutoMeasurements !== 'undefined') {
            cur = AutoMeasurements.getEffective(key);
        } else if (key === 'shs') cur = 35.0;
        else if (key === 'shg') cur = 33.0;
        else cur = 0;
    } else {
        cur = parseFloat(cur);
    }
    let next = Math.round((cur + delta) * 10) / 10;
    syncInput(key, next);
}

function syncInput(key, value) {
    const isSmart = isSmartAutoKey(key);

    if (value === '' || value === null || value === undefined) {
        if (isSmart) {
            state[key] = (key === 'skirtBalance') ? 0.0 : null;
            const numEl = document.getElementById(`num-${key}`);
            const autoVal = typeof AutoMeasurements !== 'undefined' ? AutoMeasurements.getEffective(key) : '';
            if (numEl && document.activeElement !== numEl) numEl.value = autoVal;
            updateAutoBadge(key);
        } else {
            state[key] = null;
            const numEl = document.getElementById(`num-${key}`);
            if (numEl && document.activeElement !== numEl) numEl.value = '';
        }
        renderPattern();
        syncAllAutoInputs();
        if (typeof StorageManager !== 'undefined') StorageManager.save();
        return;
    }

    const val = parseFloat(value);
    if (isNaN(val)) return;
    state[key] = val;

    const numEl = document.getElementById(`num-${key}`);
    const rngEl = document.getElementById(`rng-${key}`);
    if (numEl && document.activeElement !== numEl) numEl.value = val;
    if (rngEl && document.activeElement !== rngEl) rngEl.value = val;

    if (key === 'ot') {
        const otSkirt = document.getElementById('num-ot-skirt');
        if (otSkirt && document.activeElement !== otSkirt) otSkirt.value = val;
    }
    if (key === 'ob') {
        const obSkirt = document.getElementById('num-ob-skirt');
        if (obSkirt && document.activeElement !== obSkirt) obSkirt.value = val;
    }

    if (isSmart) {
        updateAutoBadge(key);
    }

    if (key === 'pg' && typeof updateEasePresetUI === 'function') {
        let detected = null;
        if (Math.abs(val - 2.5) < 0.2) detected = 'fitted';
        else if (Math.abs(val - 4.0) < 0.2) detected = 'semi';
        else if (Math.abs(val - 7.0) < 0.2) detected = 'loose';
        updateEasePresetUI(detected);
    }

    renderPattern();
    syncAllAutoInputs();
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
            btn.className = "posture-btn py-1.5 px-1 text-xs font-bold rounded-xl bg-[#E05A47] text-white shadow-xs transition flex flex-col items-center justify-center text-center cursor-pointer";
        } else {
            btn.className = "posture-btn py-1.5 px-1 text-xs font-medium rounded-xl text-[#78716C] bg-white border border-[#F0ECE1] hover:text-[#2C2825] transition flex flex-col items-center justify-center text-center cursor-pointer";
        }
    });

    const descEl = document.getElementById('posture-desc');
    if (descEl) {
        if (postureType === 'stooped') {
            descEl.innerHTML = '<b>Сутулая осанка:</b> Спинка удлинена на 1 см, вытачка спинки увеличена до 2.4 см для выпуклых лопаток.';
        } else if (postureType === 'erect') {
            descEl.innerHTML = '<b>Прямая (перегибистая):</b> Плечи расправлены, перед удлинен на 1.2 см, вытачка спинки уменьшена до 1.1 см.';
        } else {
            descEl.innerHTML = '<b>Обычная осанка:</b> Стандартный пропорциональный баланс спинки и полочки.';
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
        if (numEl) numEl.value = (p[k] !== null && p[k] !== undefined) ? p[k] : '';
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
        const isCurrent = btn.dataset.size === sizeKey;
        if (isCurrent) {
            btn.className = "preset-btn px-2.5 py-1 text-xs mono font-bold rounded-lg bg-[#E05A47] text-white shadow-xs transition text-center flex items-center justify-center gap-1 cursor-pointer";
        } else {
            btn.className = "preset-btn px-2 py-1 text-xs mono font-medium rounded-lg text-[#78716C] hover:bg-white transition text-center flex items-center justify-center gap-1 cursor-pointer";
        }
    });

    renderPattern();
    syncAllAutoInputs();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
    if (sizeKey === 'my') {
        showNotification('Применён ваш персональный пресет мерок (92/75/96)');
    }
}

const EASE_PRESETS = {
    fitted: { pg: 2.5, pt: 1.0, pb: 1.5, pspr: 2.0, pop: 4.0, name: 'Облегающий' },
    semi:   { pg: 4.0, pt: 2.0, pb: 2.0, pspr: 2.5, pop: 5.5, name: 'Умеренный' },
    loose:  { pg: 7.0, pt: 4.5, pb: 4.0, pspr: 3.5, pop: 7.5, name: 'Свободный' }
};

function updateEasePresetUI(activeKey) {
    document.querySelectorAll('.ease-preset-btn').forEach(btn => {
        const key = btn.dataset.ease;
        const isActive = (key === activeKey);
        const titleEl = btn.querySelector('.title-text');
        const subEl = btn.querySelector('.sub-text');

        if (isActive) {
            btn.className = "ease-preset-btn p-2.5 text-left border-2 border-[#E05A47] rounded-2xl bg-[#FFF5F3] shadow-xs transition cursor-pointer";
            if (titleEl) titleEl.className = "text-xs font-bold text-[#E05A47] title-text";
            if (subEl) subEl.className = "text-[10px] mono text-[#E05A47] font-semibold sub-text";
        } else {
            btn.className = "ease-preset-btn p-2.5 text-left border border-[#F0ECE1] rounded-2xl bg-white hover:bg-[#FAF8F5] transition cursor-pointer";
            if (titleEl) titleEl.className = "text-xs font-bold text-[#2C2825] title-text";
            if (subEl) subEl.className = "text-[10px] mono text-[#78716C] sub-text";
        }
    });
}

function applyEasePreset(presetOrPg, pt, pb, pspr, pop) {
    let presetKey = null;
    if (typeof presetOrPg === 'string' && EASE_PRESETS[presetOrPg]) {
        presetKey = presetOrPg;
        const p = EASE_PRESETS[presetKey];
        syncInput('pg', p.pg);
        syncInput('pt', p.pt);
        syncInput('pb', p.pb);
        syncInput('pspr', p.pspr);
        syncInput('pop', p.pop);
    } else {
        const pg = Number(presetOrPg);
        if (Math.abs(pg - 2.5) < 0.2) presetKey = 'fitted';
        else if (Math.abs(pg - 4.0) < 0.2) presetKey = 'semi';
        else if (Math.abs(pg - 7.0) < 0.2) presetKey = 'loose';
        syncInput('pg', pg);
        if (pt !== undefined) syncInput('pt', pt);
        if (pb !== undefined) syncInput('pb', pb);
        if (pspr !== undefined) syncInput('pspr', pspr);
        if (pop !== undefined) syncInput('pop', pop);
    }
    updateEasePresetUI(presetKey);
    if (presetKey && EASE_PRESETS[presetKey]) {
        showNotification(`Применен силуэт: ${EASE_PRESETS[presetKey].name} (Пг +${state.pg} см)`);
    }
}

function switchTab(tabName) {
    const tabs = ['measures', 'style', 'fit', 'layout'];
    tabs.forEach(t => {
        const panel = document.getElementById(`panel-${t}`);
        const btn = document.getElementById(`tab-${t}`);
        if (panel) panel.classList.add('hidden');
        if (btn) {
            btn.className = "py-2 rounded-xl text-[#78716C] hover:text-[#2C2825] font-medium transition flex flex-col items-center justify-center gap-1 cursor-pointer";
        }
    });
    const activePanel = document.getElementById(`panel-${tabName}`);
    const activeBtn = document.getElementById(`tab-${tabName}`);
    if (activePanel) activePanel.classList.remove('hidden');
    if (activeBtn) {
        activeBtn.className = "py-2 rounded-xl bg-white text-[#2C2825] font-bold shadow-xs transition flex flex-col items-center justify-center gap-1 cursor-pointer";
    }

    if (tabName === 'style') {
        if (state.garmentType === 'skirt' && typeof renderSkirtStyleCatalog === 'function') {
            renderSkirtStyleCatalog();
        } else if (state.garmentType === 'dress' && typeof renderDressStyleCatalog === 'function') {
            renderDressStyleCatalog();
        } else if (state.garmentType === 'panties') {
            if (typeof renderPantiesStyleCatalog === 'function') renderPantiesStyleCatalog();
            else if (typeof renderPantiesActiveDetails === 'function') renderPantiesActiveDetails();
        } else if (state.garmentType === 'top') {
            if (typeof renderTopStyleCatalog === 'function') renderTopStyleCatalog();
            else if (typeof renderTopActiveDetails === 'function') renderTopActiveDetails();
        } else if (state.garmentType === 'corset') {
            if (typeof renderCorsetStyleCatalog === 'function') renderCorsetStyleCatalog();
            else if (typeof renderCorsetActiveDetails === 'function') renderCorsetActiveDetails();
        }
    }

    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

// --- МОДЕЛИРОВАНИЕ ФАСОНОВ ---
function setDartPosition(pos) {
    state.dartPosition = pos;
    document.querySelectorAll('.dart-btn').forEach(btn => {
        if (btn.dataset.dart === pos) {
            btn.className = "dart-btn p-2.5 rounded-2xl text-left border-2 border-[#E05A47] bg-[#FFF5F3] font-semibold text-[#2C2825] shadow-xs transition cursor-pointer";
        } else {
            btn.className = "dart-btn p-2.5 rounded-2xl text-left border border-[#F0ECE1] bg-white hover:bg-[#FAF8F5] text-[#2C2825] transition cursor-pointer";
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
            btn.className = "neckline-btn p-2.5 rounded-2xl text-left border-2 border-[#E05A47] bg-[#FFF5F3] font-semibold text-[#2C2825] shadow-xs transition cursor-pointer";
        } else {
            btn.className = "neckline-btn p-2.5 rounded-2xl text-left border border-[#F0ECE1] bg-white hover:bg-[#FAF8F5] text-[#2C2825] transition cursor-pointer";
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
            btn.className = "sleeve-length-btn flex-1 py-1.5 px-2 text-xs font-bold rounded-xl bg-[#E05A47] text-white shadow-xs transition text-center cursor-pointer";
        } else {
            btn.className = "sleeve-length-btn flex-1 py-1.5 px-2 text-xs font-medium rounded-xl text-[#78716C] bg-white border border-[#F0ECE1] hover:text-[#2C2825] transition text-center cursor-pointer";
        }
    });
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function setSilhouette(sil) {
    state.silhouette = sil;
    document.querySelectorAll('.silhouette-btn').forEach(btn => {
        if (btn.dataset.silhouette === sil) {
            btn.className = "silhouette-btn flex-1 py-1.5 px-2 text-xs font-bold rounded-xl bg-[#E05A47] text-white shadow-xs transition text-center cursor-pointer";
        } else {
            btn.className = "silhouette-btn flex-1 py-1.5 px-2 text-xs font-medium rounded-xl text-[#78716C] bg-white border border-[#F0ECE1] hover:text-[#2C2825] transition text-center cursor-pointer";
        }
    });
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function updateStyleUI(g) {
    if (typeof updateEasePresetUI === 'function') {
        let detected = null;
        if (Math.abs(state.pg - 2.5) < 0.2) detected = 'fitted';
        else if (Math.abs(state.pg - 4.0) < 0.2) detected = 'semi';
        else if (Math.abs(state.pg - 7.0) < 0.2) detected = 'loose';
        updateEasePresetUI(detected);
    }
    document.querySelectorAll('.dart-btn').forEach(btn => {
        const active = btn.dataset.dart === state.dartPosition;
        if (active) {
            btn.className = "dart-btn p-2.5 rounded-2xl text-left border-2 border-[#E05A47] bg-[#FFF5F3] font-semibold text-[#2C2825] shadow-xs transition cursor-pointer";
        } else {
            btn.className = "dart-btn p-2.5 rounded-2xl text-left border border-[#F0ECE1] bg-white hover:bg-[#FAF8F5] text-[#2C2825] transition cursor-pointer";
        }
    });
    document.querySelectorAll('.neckline-btn').forEach(btn => {
        const active = btn.dataset.neckline === state.necklineType;
        if (active) {
            btn.className = "neckline-btn p-2.5 rounded-2xl text-left border-2 border-[#E05A47] bg-[#FFF5F3] font-semibold text-[#2C2825] shadow-xs transition cursor-pointer";
        } else {
            btn.className = "neckline-btn p-2.5 rounded-2xl text-left border border-[#F0ECE1] bg-white hover:bg-[#FAF8F5] text-[#2C2825] transition cursor-pointer";
        }
    });
    document.querySelectorAll('.sleeve-length-btn').forEach(btn => {
        const active = btn.dataset.sleeve === state.sleeveLengthType;
        if (active) {
            btn.className = "sleeve-length-btn flex-1 py-1.5 px-2 text-xs font-bold rounded-xl bg-[#E05A47] text-white shadow-xs transition text-center cursor-pointer";
        } else {
            btn.className = "sleeve-length-btn flex-1 py-1.5 px-2 text-xs font-medium rounded-xl text-[#78716C] bg-white border border-[#F0ECE1] hover:text-[#2C2825] transition text-center cursor-pointer";
        }
    });
    document.querySelectorAll('.silhouette-btn').forEach(btn => {
        const active = btn.dataset.silhouette === state.silhouette;
        if (active) {
            btn.className = "silhouette-btn flex-1 py-1.5 px-2 text-xs font-bold rounded-xl bg-[#E05A47] text-white shadow-xs transition text-center cursor-pointer";
        } else {
            btn.className = "silhouette-btn flex-1 py-1.5 px-2 text-xs font-medium rounded-xl text-[#78716C] bg-white border border-[#F0ECE1] hover:text-[#2C2825] transition text-center cursor-pointer";
        }
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
    } else if (garment === 'top') {
        const topG = (g && g.type === 'top') ? g : calculateTopGeometry();
        rows = [
            { name: 'Модель топа', abbr: 'Фасон', formula: (topG.style || '').toUpperCase(), val: topG.style },
            { name: 'Ширина сетки топа', abbr: 'Сг+Пг', formula: 'Полуобхват груди с прибавкой', val: `${topG.W_grid.toFixed(1)} см` },
            { name: 'Длина изделия', abbr: 'Ди', formula: 'От высшей точки плеча', val: `${topG.effectiveLength.toFixed(1)} см` },
            { name: 'Система «Анти-задир»', abbr: 'Дуга', formula: topG.antiRideupDrop > 0 ? `Удлинение переда +${topG.antiRideupDrop} см` : 'Прямой срез', val: `${topG.antiRideupDrop > 0 ? '+' : ''}${topG.antiRideupDrop} см` },
            { name: 'Длина бретелей', abbr: 'Бретели', formula: 'С учетом эластичности k=0.90', val: `${topG.elasticSpec ? topG.elasticSpec.strapFinishedLength : 38} см` },
            { name: 'Подгрудный пояс', abbr: 'Пояс', formula: 'Отрицательная прибавка k=0.82', val: `${topG.elasticSpec ? topG.elasticSpec.underbustBandLength : 72} см` },
            { name: 'Быстрое снятие', abbr: 'Планка', formula: topG.isQuickRelease ? 'Планка под кнопки +1.8 см' : 'Без планки', val: topG.isQuickRelease ? 'Да (+1.8 см)' : 'Нет' }
        ];
    } else if (garment === 'corset') {
        const corsetG = (g && g.type === 'corset') ? g : calculateCorsetGeometry();
        rows = [
            { name: 'Модель корсета/образа', abbr: 'Фасон', formula: (corsetG.style || '').toUpperCase(), val: corsetG.style },
            { name: 'Обхват талии фигуры', abbr: 'От', formula: 'Анатомический замер талии', val: `${corsetG.ot} см` },
            { name: 'Утяжка талии', abbr: 'Утяжка', formula: 'Корсетный перехват', val: `-${corsetG.reduction} см` },
            { name: 'Талия в корсете', abbr: 'От_цель', formula: 'От - Утяжка', val: `${corsetG.targetWaist} см` },
            { name: 'Количество деталей', abbr: 'Панели', formula: 'Профилированные рельефы', val: `${corsetG.spec.panelsCount || (corsetG.extraPieces ? corsetG.extraPieces.length : 8)} деталей` },
            { name: 'Косточки / Регилин', abbr: 'Кулиски', formula: 'Туннели шириной 8 мм', val: `${corsetG.spec.boningTotal || 16} шт.` },
            { name: 'Шнуровка / Люверсы', abbr: 'Застежка', formula: 'Планка с шагом 2.5 см', val: corsetG.spec.eyeletsCount ? `${corsetG.spec.eyeletsCount} люверсов` : 'Планка / Завязки' }
        ];
        if (corsetG.spec && corsetG.spec.ruffleTotalLength) {
            rows.push({ name: 'Длина кружевных оборок', abbr: 'Оборки', formula: `Периметр × k${corsetG.spec.gatherCoeff}`, val: `${corsetG.spec.ruffleTotalLength} см` });
        }
    } else {
        const dressG = (g && g.W_back !== undefined) ? g : calculateGeometry();
        rows = [
            { name: 'Ширина сетки', abbr: 'Г1-Г3', formula: 'Полуобхват груди + прибавка', val: `${dressG.W_grid.toFixed(1)} см` },
            { name: 'Ширина спинки', abbr: 'Шсп', formula: 'Спинка изделия', val: `${dressG.W_back.toFixed(1)} см` },
            { name: 'Ширина проймы', abbr: 'Шпр', formula: 'Подмышечная область', val: `${dressG.W_armhole.toFixed(1)} см` },
            { name: 'Ширина переда', abbr: 'Шпол', formula: 'Полочка с вытачкой', val: `${dressG.W_front.toFixed(1)} см` },
            { name: 'Длина проймы спинки', abbr: 'Дпр_спин', formula: 'Линия проймы сзади', val: `${dressG.len_back_armhole.toFixed(1)} см` },
            { name: 'Длина проймы переда', abbr: 'Дпр_перед', formula: 'Линия проймы спереди', val: `${dressG.len_front_armhole.toFixed(1)} см` },
            { name: 'Вся длина проймы', abbr: 'Дпр', formula: 'Сумма полочки и спинки', val: `${dressG.total_armhole_len.toFixed(1)} см` },
            { name: 'Длина оката рукава', abbr: 'Док', formula: 'Линия втачивания рукава', val: `${dressG.total_sleeve_cap_len.toFixed(1)} см` },
            { name: 'Посадка по окату', abbr: 'Ппос', formula: 'Док - Дпр (норма +2..+3.5 см)', val: `+${dressG.sleeve_ease.toFixed(1)} см` },
            { name: 'Раствор вытачки груди', abbr: 'В7-В9', formula: 'Раскрытие для груди', val: `${dressG.bust_dart_width.toFixed(1)} см` },
            { name: 'Талиевые вытачки', abbr: 'Сумма', formula: 'Приталивание изделия', val: `${dressG.total_waist_intake.toFixed(1)} см` }
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

    if (garment === 'top') {
        const topG = (g && g.type === 'top') ? g : calculateTopGeometry();
        setText('export-title-back', '1. Спинка топа (со сгибом)');
        setText('export-title-front', '2. Полочка (перед)');
        setText('export-title-sleeve', topG.hasSleeve ? '3. Рукав футболки' : '3. Бретели и портупеи');
        setText('export-title-all', '4. Полный комплект топа');
        setText('modal-title-back', '1. Спинка топа (со сгибом)');
        setText('modal-title-front', '2. Полочка (перед)');
        setText('modal-title-sleeve', topG.hasSleeve ? '3. Рукав футболки (2 дет.)' : '3. Бретели и пояс под грудью');
        setText('modal-title-all', '4. Полный комплект топа');
        setText('modal-desc-back', 'Вырез горловины, пройма и боковой срез со сгибом по центру спинки.');
        setText('modal-desc-front', topG.antiRideupDrop > 0
            ? `Полочка с защитой от задирания «Анти-задир» (+${topG.antiRideupDrop} см по дуге низа).`
            : 'Контур переда со сгибом ткани по центру.');
        setText('modal-desc-sleeve', topG.hasSleeve
            ? 'Анатомический короткий рукав 19 см с надсечками.'
            : `Спецификация бретелей: ${topG.elasticSpec.strapFinishedLength} см, подгрудный пояс: ${topG.elasticSpec.underbustBandLength} см.`);
        setText('modal-desc-all', 'Все лекала топа с контрольными метками и масштабом 1:1.');

        const backW = (topG.W_grid * 0.48).toFixed(1);
        const backH = topG.effectiveLength.toFixed(1);
        const frontW = (topG.W_grid * 0.52).toFixed(1);
        const frontH = (topG.effectiveLength + topG.antiRideupDrop).toFixed(1);

        if (elBack) elBack.textContent = `${backW} × ${backH} см`;
        if (elFront) elFront.textContent = `${frontW} × ${frontH} см`;
        if (elSleeve) elSleeve.textContent = topG.hasSleeve ? `${topG.W_sleeve.toFixed(1)} × 19 см` : `${topG.elasticSpec.strapFinishedLength} × 2 см`;
        if (elAll) elAll.textContent = `${topG.widthCm} × ${topG.heightCm} см`;

        const tBack = calcTiles(backW, backH);
        const tFront = calcTiles(frontW, frontH);
        const tSleeve = topG.hasSleeve ? calcTiles(topG.W_sleeve, 19) : { c: 1, r: 1, total: 1 };
        const tAll = calcTiles(topG.widthCm, topG.heightCm);

        setBadge('pages-back', tBack);
        setBadge('pages-front', tFront);
        setBadge('pages-sleeve', tSleeve);
        setBadge('pages-all', tAll);
        setBadge('modal-pages-back', tBack);
        setBadge('modal-pages-front', tFront);
        setBadge('modal-pages-sleeve', tSleeve);
        setBadge('modal-pages-all', tAll);
        return;
    }

    if (garment === 'corset') {
        const corsetG = (g && g.type === 'corset') ? g : calculateCorsetGeometry();
        setText('export-title-back', '1. Спинка / Панели спинки');
        setText('export-title-front', '2. Полочка / Передние детали');
        setText('export-title-sleeve', '3. Пояс / Рукава / Оборки');
        setText('export-title-all', '4. Полный комплект сценического изделия');
        setText('modal-title-back', '1. Спинка / Панели спинки');
        setText('modal-title-front', '2. Полочка / Передние детали');
        setText('modal-title-sleeve', '3. Пояс / Рукава / Оборки');
        setText('modal-title-all', '4. Полный комплект сценического изделия');
        setText('modal-desc-back', 'Панели спинки с кулисками под косточки и планкой шнуровки.');
        setText('modal-desc-front', 'Панели переда с анатомическим подгрудным вырезом.');
        setText('modal-desc-sleeve', 'Аксессуары, пояс, рукава или кружевные оборки.');
        setText('modal-desc-all', 'Все лекала с припусками на швы и туннелями под косточки.');

        const wStr = corsetG.widthCm.toFixed(1);
        const hStr = corsetG.heightCm.toFixed(1);
        if (elBack) elBack.textContent = `${(corsetG.widthCm * 0.45).toFixed(1)} × ${hStr} см`;
        if (elFront) elFront.textContent = `${(corsetG.widthCm * 0.55).toFixed(1)} × ${hStr} см`;
        if (elSleeve) elSleeve.textContent = `Спецификация`;
        if (elAll) elAll.textContent = `${wStr} × ${hStr} см`;

        const tAll = calcTiles(corsetG.widthCm, corsetG.heightCm);
        const tBack = calcTiles(corsetG.widthCm * 0.45, corsetG.heightCm);
        const tFront = calcTiles(corsetG.widthCm * 0.55, corsetG.heightCm);
        setBadge('pages-back', tBack);
        setBadge('pages-front', tFront);
        setBadge('pages-sleeve', '1-2 стр.');
        setBadge('pages-all', tAll);
        setBadge('modal-pages-back', tBack);
        setBadge('modal-pages-front', tFront);
        setBadge('modal-pages-sleeve', '1-2 стр.');
        setBadge('modal-pages-all', tAll);
        return;
    }

    // Платье (по умолчанию)
    const hasDressSleeve = Boolean(state.showSleeve !== false && state.sleeveLengthType !== 'sleeveless');
    const modalCardSleeve = document.getElementById('modal-card-sleeve');
    if (modalCardSleeve) {
        modalCardSleeve.classList.toggle('hidden', !hasDressSleeve);
    }

    setText('export-title-back', '1. Спинка (со сгибом)');
    setText('export-title-front', '2. Полочка (перед)');
    setText('export-title-sleeve', hasDressSleeve ? '3. Рукав втачной' : '3. Без рукава');
    setText('export-title-all', hasDressSleeve ? '4. Весь комплект (все детали)' : '4. Комплект (спинка + полочка)');
    setText('modal-title-back', '1. Деталь «Спинка»');
    setText('modal-title-front', '2. Деталь «Полочка»');
    setText('modal-title-sleeve', hasDressSleeve ? '3. Деталь «Рукав»' : '3. Без рукава (пройма обработана)');
    setText('modal-title-all', hasDressSleeve ? '4. Полный комплект выкройки' : '4. Комплект выкройки (без рукава)');
    setText('modal-desc-back', 'Контур со сгибом, плечевая и талиевая вытачки.');
    setText('modal-desc-front', 'Контур переда, нагрудная вытачка и приталивание.');
    setText('modal-desc-sleeve', hasDressSleeve ? 'Анатомический окат, точно согласованный с проймой.' : 'Модель без рукавов, детали рукава исключены из раскроя.');
    setText('modal-desc-all', hasDressSleeve ? 'Все детали единым файлом для сквозной печати.' : 'Спинка и полочка единым файлом для сквозной печати.');

    const maxBackX = Math.max(g.X_G4, g.B3.x, g.P1.x, g.H_back_side ? g.H_back_side.x : g.B3.x);
    const backW = maxBackX.toFixed(1);
    const backH = (g.Y_H + g.H_back_neck).toFixed(1);
    const minFrontX = Math.min(g.P5_open.x, g.P5_closed.x, g.X_G4, g.B4.x, g.H_front_side ? g.H_front_side.x : g.B4.x);
    const frontW = (g.X_G3 - minFrontX).toFixed(1);
    const frontH = (g.Y_H + 1.2 - g.Y_V1).toFixed(1);

    const allWidthCm = hasDressSleeve ? Math.round(g.W_grid + g.W_sleeve + 24) : Math.round(g.W_grid + 14);
    const allHeightCm = Math.round(Math.max(g.Y_H, hasDressSleeve ? g.L_sleeve : 0) + 12);

    if (elBack) elBack.textContent = `${backW} × ${backH} см`;
    if (elFront) elFront.textContent = `${frontW} × ${frontH} см`;
    if (elSleeve) elSleeve.textContent = hasDressSleeve ? `${g.W_sleeve.toFixed(1)} × ${g.L_sleeve.toFixed(1)} см` : 'Не требуется';
    if (elAll) elAll.textContent = `${allWidthCm} × ${allHeightCm} см`;

    const tBack = calcTiles(backW, backH);
    const tFront = calcTiles(frontW, frontH);
    const tSleeve = hasDressSleeve ? calcTiles(g.W_sleeve, g.L_sleeve) : { c: 0, r: 0, total: 0 };
    const tAll = calcTiles(allWidthCm, allHeightCm);

    setBadge('pages-back', tBack);
    setBadge('pages-front', tFront);
    setBadge('pages-sleeve', hasDressSleeve ? tSleeve : '—');
    setBadge('pages-all', tAll);
    setBadge('modal-pages-back', tBack);
    setBadge('modal-pages-front', tFront);
    setBadge('modal-pages-sleeve', hasDressSleeve ? tSleeve : '—');
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
    if (garmentType !== 'dress' && garmentType !== 'top' && state.showFitHeatmap) {
        state.showFitHeatmap = false;
        const btnHeatmap = document.getElementById('btn-toggle-heatmap');
        if (btnHeatmap) {
            btnHeatmap.className = "w-full py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center gap-2 transition cursor-pointer";
            btnHeatmap.innerHTML = `<span>🌡️ Показать карту прилегания (Heatmap)</span>`;
        }
    }

    if (tabFit) tabFit.classList.remove('hidden');
    if (tabsBar) tabsBar.className = "grid grid-cols-4 p-1 m-3.5 bg-[#F5F2EB] rounded-2xl border border-[#F0ECE1] text-xs";

    // Управление отображением плечевых прибавок (ГОСТ) в табе "Посадка"
    const fitDegreeContainer = document.getElementById('fit-degree-container');
    const easePresetsContainer = document.getElementById('ease-presets-container');
    const measuresEase = document.getElementById('measures-ease');

    const hasBustEase = (garmentType === 'dress' || garmentType === 'top');
    if (fitDegreeContainer) fitDegreeContainer.style.display = hasBustEase ? 'block' : 'none';
    if (easePresetsContainer) easePresetsContainer.style.display = hasBustEase ? 'block' : 'none';
    if (measuresEase) measuresEase.style.display = hasBustEase ? 'block' : 'none';

    syncStageControls();

    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

// Синхронизация состояния конструктора сценических деталей в UI
function syncStageControls() {
    const type = state.garmentType || 'dress';

    const stageContainer = document.getElementById('stage-details-container');
    const vCutCard = document.getElementById('v-cut-waist-card');
    const scrunchCard = document.getElementById('scrunch-effect-card');
    const quickReleaseCard = document.getElementById('quick-release-card');

    const chkVCut = document.getElementById('chk-v-cut-waist');
    if (chkVCut) chkVCut.checked = Boolean(state.vCutWaist);
    const vCutDepthEl = document.getElementById('v-cut-depth-controls');
    if (vCutDepthEl) vCutDepthEl.style.display = state.vCutWaist ? 'block' : 'none';
    const rangeVCut = document.getElementById('range-v-cut-depth');
    if (rangeVCut) rangeVCut.value = state.vCutDepth || 5.0;
    const labelVCut = document.getElementById('label-v-cut-depth');
    if (labelVCut) labelVCut.textContent = `${(state.vCutDepth || 5.0).toFixed(1)} см`;

    const chkScrunch = document.getElementById('chk-scrunch-effect');
    if (chkScrunch) chkScrunch.checked = Boolean(state.scrunchEffect);

    const chkQuick = document.getElementById('chk-quick-release');
    if (chkQuick) chkQuick.checked = Boolean(state.quickRelease);

    // Контекстная фильтрация сценических опций:
    // V-Cut и Scrunch работают ТОЛЬКО для белья (panties) и юбок (skirt)
    const supportsVCut = (type === 'panties' || type === 'skirt');
    const supportsScrunch = (type === 'panties' || type === 'skirt');
    // Quick-Release планка работает ТОЛЬКО для плечевых топов (top)
    const supportsQuickRelease = (type === 'top');

    const hasAnyStageFeature = supportsVCut || supportsScrunch || supportsQuickRelease;

    if (stageContainer) {
        stageContainer.style.display = hasAnyStageFeature ? 'block' : 'none';
    }
    if (vCutCard) {
        vCutCard.style.display = supportsVCut ? 'block' : 'none';
    }
    if (scrunchCard) {
        scrunchCard.style.display = supportsScrunch ? 'block' : 'none';
    }
    if (quickReleaseCard) {
        quickReleaseCard.style.display = supportsQuickRelease ? 'block' : 'none';
    }

    document.querySelectorAll('.gusset-btn').forEach(btn => {
        const isActive = btn.dataset.gusset === (state.gussetType || 'classic');
        btn.className = isActive
            ? "gusset-btn flex-1 py-1.5 px-2 text-xs font-bold rounded-xl bg-[#E05A47] text-white shadow-xs transition text-center cursor-pointer"
            : "gusset-btn flex-1 py-1.5 px-2 text-xs font-medium rounded-xl text-[#78716C] bg-white border border-[#F0ECE1] hover:text-[#2C2825] transition text-center cursor-pointer";
    });
}

// Управление типами изделий (Платье, Майки и топы, Юбки и Шорты, Белье, Корсеты и Образы)
function setGarmentType(type) {
    state.garmentType = type;
    updateContextualTabs(type);
    syncStageControls();

    ['dress', 'top', 'skirt', 'panties', 'corset'].forEach(t => {
        const headerBtn = document.getElementById(`header-garment-${t}`);
        const isActive = (t === type);
        if (headerBtn) {
            headerBtn.className = isActive
                ? "px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white text-[#2C2825] shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                : "px-3.5 py-1.5 text-xs font-medium rounded-xl text-[#78716C] hover:text-[#2C2825] transition flex items-center gap-1.5 shrink-0 cursor-pointer";
        }
    });

    const badge = document.getElementById('garment-type-badge');
    if (badge) {
        badge.textContent = type === 'skirt' ? 'Поясное (Юбки и Шорты)' : (type === 'panties' ? 'Белье (Трусики)' : (type === 'top' ? 'Плечевое (Майки и Топы)' : (type === 'corset' ? 'Сценическое (Образы и Корсеты)' : 'Плечевое (Платье)')));
    }

    const dressMeasures = document.getElementById('measures-dress-container');
    const skirtMeasures = document.getElementById('measures-skirt-container');
    const pantiesMeasures = document.getElementById('measures-panties-container');
    const corsetMeasures = document.getElementById('measures-corset-container');
    // Общие мерки корпуса для платья, топа и корсетов:
    if (dressMeasures) dressMeasures.classList.toggle('hidden', type !== 'dress' && type !== 'top' && type !== 'corset');
    if (skirtMeasures) skirtMeasures.classList.toggle('hidden', type !== 'skirt');
    if (pantiesMeasures) pantiesMeasures.classList.toggle('hidden', type !== 'panties');
    if (corsetMeasures) corsetMeasures.classList.toggle('hidden', type !== 'corset');

    // Скрытие или показ рукава для топов и платьев
    const sleeveInputs = document.getElementById('measures-sleeve');
    if (sleeveInputs && sleeveInputs.parentElement) {
        if (type === 'top') {
            const TEE_STYLES = ['smart-tee', 'oversize-tee', 'asymmetric-tee', 'ruched-baby-tee', 'underboob-crop-tee', 'underbust-cutout-top', 'cutout-laceup-tee', 'backless-mesh-tee'];
            const isTee = TEE_STYLES.includes(state.topStyle);
            sleeveInputs.parentElement.classList.toggle('hidden', !isTee);
            state.showSleeve = isTee;
        } else if (type === 'dress') {
            sleeveInputs.parentElement.classList.remove('hidden');
            state.showSleeve = (state.sleeveLengthType !== 'sleeveless');
        } else {
            // skirt, panties, corset
            sleeveInputs.parentElement.classList.add('hidden');
            state.showSleeve = false;
        }
    } else {
        if (type === 'skirt' || type === 'panties' || type === 'corset') {
            state.showSleeve = false;
        }
    }
    const chkSleeve = document.getElementById('chk-sleeve');
    if (chkSleeve) chkSleeve.checked = Boolean(state.showSleeve);

    const dressStyle = document.getElementById('style-dress-container');
    const topStyle = document.getElementById('style-top-container');
    const skirtStyle = document.getElementById('style-skirt-container');
    const pantiesStyle = document.getElementById('style-panties-container');
    const corsetStyle = document.getElementById('style-corset-container');
    if (dressStyle) dressStyle.classList.toggle('hidden', type !== 'dress');
    if (topStyle) topStyle.classList.toggle('hidden', type !== 'top');
    if (skirtStyle) skirtStyle.classList.toggle('hidden', type !== 'skirt');
    if (pantiesStyle) pantiesStyle.classList.toggle('hidden', type !== 'panties');
    if (corsetStyle) corsetStyle.classList.toggle('hidden', type !== 'corset');

    const bannerCatalogBtn = document.getElementById('btn-banner-open-catalog');
    if (bannerCatalogBtn) bannerCatalogBtn.href = `catalog.html?garment=${type}`;
    const headerCatalogBtn = document.getElementById('btn-header-catalog-pro');
    if (headerCatalogBtn) headerCatalogBtn.href = `catalog.html?garment=${type}`;

    if (type === 'skirt' && typeof renderSkirtStyleCatalog === 'function') {
        renderSkirtStyleCatalog();
    } else if (type === 'dress' && typeof renderDressStyleCatalog === 'function') {
        renderDressStyleCatalog();
    } else if (type === 'top') {
        if (typeof renderTopStyleCatalog === 'function') renderTopStyleCatalog();
        else if (typeof renderTopActiveDetails === 'function') renderTopActiveDetails();
    } else if (type === 'panties') {
        if (typeof renderPantiesStyleCatalog === 'function') renderPantiesStyleCatalog();
        else if (typeof renderPantiesActiveDetails === 'function') renderPantiesActiveDetails();
    } else if (type === 'corset') {
        if (typeof renderCorsetStyleCatalog === 'function') renderCorsetStyleCatalog();
        else if (typeof renderCorsetActiveDetails === 'function') renderCorsetActiveDetails();
    }

    resetView();
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();

    const titleRu = type === 'skirt' ? 'Выбрана выкройка юбки' : (type === 'panties' ? 'Выбрана выкройка белья' : (type === 'top' ? 'Выбрана выкройка майки / топа' : (type === 'corset' ? 'Выбраны Образы и Корсеты' : 'Выбрана выкройка платья')));
    showNotification(titleRu);

    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
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

// --- КИЛЛЕР-ФИЧИ (STAGE & TRANSFORM) ---
function toggleVCutWaist(val) {
    state.vCutWaist = Boolean(val);
    const depthEl = document.getElementById('v-cut-depth-controls');
    if (depthEl) depthEl.style.display = val ? 'block' : 'none';
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function setVCutDepth(val) {
    state.vCutDepth = parseFloat(val);
    const label = document.getElementById('label-v-cut-depth');
    if (label) label.textContent = `${state.vCutDepth.toFixed(1)} см`;
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function toggleScrunchEffect(val) {
    state.scrunchEffect = Boolean(val);
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function toggleQuickRelease(val) {
    state.quickRelease = Boolean(val);
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function setGussetType(type) {
    state.gussetType = type;
    document.querySelectorAll('.gusset-btn').forEach(btn => {
        const isActive = btn.dataset.gusset === type;
        btn.className = isActive
            ? "gusset-btn flex-1 py-1.5 px-2 text-xs font-bold rounded-xl bg-[#E05A47] text-white shadow-xs transition text-center cursor-pointer"
            : "gusset-btn flex-1 py-1.5 px-2 text-xs font-medium rounded-xl text-[#78716C] bg-white border border-[#F0ECE1] hover:text-[#2C2825] transition text-center cursor-pointer";
    });
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

// --- УПРАВЛЕНИЕ КОРСЕТАМИ И СЦЕНИЧЕСКИМИ ДЕТАЛЯМИ ---
function setCorsetReduction(val) {
    state.corsetReduction = parseFloat(val);
    const label = document.getElementById('label-corset-reduction');
    if (label) label.textContent = `-${state.corsetReduction.toFixed(1)} см`;
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function toggleShrugHood(val) {
    state.shrugWithHood = Boolean(val);
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function toggleZeroWasteAccessories(val) {
    state.zeroWasteAccessories = Boolean(val);
    const badge = document.getElementById('zero-waste-details-badge');
    if (badge) badge.classList.toggle('hidden', !state.zeroWasteAccessories);
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
    showNotification(state.zeroWasteAccessories ? 'Zero-Waste: аксессуары добавлены на раскладку!' : 'Раскладка ткани возвращена в стандартный вид');
}

function setTopLengthType(lenType) {
    state.topLengthType = lenType;
    const labelMap = {
        'crop': 'Кроп (выше талии)',
        'waist': 'До талии',
        'hip': 'До бедер',
        'long': 'Удлиненный'
    };
    const lbl = document.getElementById('label-topLengthType');
    if (lbl) lbl.textContent = labelMap[lenType] || lenType;

    document.querySelectorAll('.top-len-btn').forEach(btn => {
        const isActive = btn.dataset.topLen === lenType;
        btn.className = isActive
            ? "top-len-btn py-1 px-1 rounded-lg text-center transition font-bold bg-[#E05A47] text-white shadow-xs cursor-pointer"
            : "top-len-btn py-1 px-1 rounded-lg text-center transition font-medium text-[#78716C] hover:text-[#2C2825] cursor-pointer";
    });

    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
}

function toggleTopAntiRideup(enabled) {
    state.topAntiRideup = Boolean(enabled);
    const chk = document.getElementById('chk-top-antirideup');
    if (chk && chk.checked !== state.topAntiRideup) chk.checked = state.topAntiRideup;
    if (typeof renderTopActiveDetails === 'function') renderTopActiveDetails();
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
    syncAllAutoInputs();
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
        'og', 'shs', 'shg', 'ot', 'ob', 'osh', 'dts', 'dtp', 'vg', 'cg', 'vb', 'di', 'shp', 'op', 'dr', 'dr_l', 'oz', 'vpk', 'gpr',
        'pg', 'pt', 'pb', 'pspr', 'pop', 'posture',
        'dartPosition', 'necklineType', 'necklineDepth', 'sleeveLengthType', 'silhouette',
        'skirtLength', 'skirtStyle', 'skirtRise', 'skirtPt', 'skirtPb', 'skirtVb', 'skirtBalance',
        'topStyle', 'topLengthType', 'topAntiRideup', 'topElasticStretch', 'topUnderbustFit',
        'pantiesModel', 'pantiesRise', 'pantiesLegCut', 'pantiesStretch',
        'corsetStyle', 'corsetReduction', 'shrugWithHood', 'zeroWasteAccessories'
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
        showNotification('Ваши мерки сохранены в памяти браузера');
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
            if (numEl) numEl.value = (profile.data[k] !== null && profile.data[k] !== undefined) ? profile.data[k] : '';
        });

        // Выделяем кнопку Мой размер
        document.querySelectorAll('.preset-btn').forEach(btn => {
            if (btn.dataset.size === 'my') {
                btn.className = "preset-btn px-2.5 py-1 text-xs mono font-bold rounded-lg bg-[#E05A47] text-white shadow-xs transition text-center flex items-center justify-center gap-1 cursor-pointer";
            } else {
                btn.className = "preset-btn px-2 py-1 text-xs mono font-medium rounded-lg text-[#78716C] hover:bg-white transition text-center flex items-center justify-center gap-1 cursor-pointer";
            }
        });

        if (state.garmentType) setGarmentType(state.garmentType);
        if (state.posture) setPosture(state.posture);
        if (state.dartPosition) setDartPosition(state.dartPosition);
        if (state.necklineType) setNecklineType(state.necklineType);
        if (state.sleeveLengthType) setSleeveLength(state.sleeveLengthType);
        if (state.silhouette) setSilhouette(state.silhouette);
        if (state.skirtStyle) setSkirtStyle(state.skirtStyle);
        if (state.skirtRise) setSkirtRise(state.skirtRise);
        if (state.topStyle && typeof selectTopStyle === 'function') selectTopStyle(state.topStyle);
        if (state.pantiesModel) setPantiesModel(state.pantiesModel);
        if (state.pantiesRise) setPantiesRise(state.pantiesRise);
        if (state.pantiesLegCut) setPantiesLegCut(state.pantiesLegCut);
        if (state.pantiesStretch) setPantiesStretch(state.pantiesStretch);
        if (state.corsetStyle && typeof selectCorsetStyle === 'function') selectCorsetStyle(state.corsetStyle);
        if (typeof setCorsetReduction === 'function' && state.corsetReduction !== undefined) setCorsetReduction(state.corsetReduction);

        renderPattern();
        syncAllAutoInputs();
        updateProfileBadge();
        showNotification(`Загружен ваш профиль (${profile.savedAt || ''})`);
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
            badge.className = "text-[10px] text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] px-2 py-0.5 rounded-full mono font-medium";
        } else {
            badge.textContent = 'Не сохранен';
            badge.className = "text-[10px] text-[#78716C] bg-[#FAF8F5] border border-[#F0ECE1] px-2 py-0.5 rounded-full mono";
        }
    } catch (_) {}
}

function exportProfileJson() {
    const keys = [
        'garmentType',
        'og', 'shs', 'shg', 'ot', 'ob', 'osh', 'dts', 'dtp', 'vg', 'cg', 'vb', 'di', 'shp', 'op', 'dr', 'dr_l', 'oz', 'vpk', 'gpr',
        'pg', 'pt', 'pb', 'pspr', 'pop', 'posture',
        'dartPosition', 'necklineType', 'necklineDepth', 'sleeveLengthType', 'silhouette',
        'skirtLength', 'skirtStyle', 'skirtRise', 'skirtPt', 'skirtPb', 'skirtVb', 'skirtBalance',
        'topStyle', 'topLengthType', 'topAntiRideup', 'topElasticStretch', 'topUnderbustFit',
        'pantiesModel', 'pantiesRise', 'pantiesLegCut', 'pantiesStretch'
    ];
    const exportData = {
        app: 'Конструктор выкроек Лекало 1:1',
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
    showNotification('Файл с вашими мерками скачан на диск');
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
                    if (numEl) numEl.value = (m[k] !== null && m[k] !== undefined) ? m[k] : '';
                }
            });
            saveMyProfile();
            renderPattern();
            showNotification('Ваши мерки успешно загружены из файла');
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
        el.className = 'fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-md border border-[#F0ECE1] text-[#2C2825] text-xs font-semibold py-3 px-4 rounded-2xl sonner-toast flex items-center gap-2.5 transition-all duration-300 opacity-0 translate-y-3 pointer-events-none shadow-float';
        document.body.appendChild(el);
    }
    el.innerHTML = `
        <i data-lucide="sparkles" class="w-4 h-4 text-[#E05A47] shrink-0"></i>
        <span>${text}</span>
    `;
    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
    el.classList.remove('opacity-0', 'translate-y-3', 'pointer-events-none');
    el.classList.add('opacity-100', 'translate-y-0');
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
        el.classList.remove('opacity-100', 'translate-y-0');
        el.classList.add('opacity-0', 'translate-y-3', 'pointer-events-none');
    }, 2800);
}

// Управление Popover меню профиля в шапке
function toggleProfilePopover(forceState) {
    const popover = document.getElementById('profile-popover');
    if (!popover) return;
    const shouldShow = typeof forceState === 'boolean' ? forceState : popover.classList.contains('hidden');
    if (shouldShow) {
        popover.classList.remove('hidden');
    } else {
        popover.classList.add('hidden');
    }
    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

// Закрытие Popover и модальных окон при клике вне их области
document.addEventListener('click', (e) => {
    // 1. Профиль
    const popover = document.getElementById('profile-popover');
    const trigger = document.getElementById('btn-my-profile');
    if (popover && !popover.classList.contains('hidden')) {
        if (!popover.contains(e.target) && !trigger?.contains(e.target)) {
            popover.classList.add('hidden');
        }
    }

    // 2. Модальные окна (клик строго по затемненному фону backdrop)
    const modals = [
        { id: 'hint-modal', close: closeHintModal },
        { id: 'export-modal', close: closeExportModal },
        { id: 'lookbook-modal', close: (typeof closeLookbookModal === 'function' ? closeLookbookModal : null) },
        { id: 'lightbox-modal', close: (typeof closeLightbox === 'function' ? closeLightbox : null) }
    ];
    modals.forEach(m => {
        const el = document.getElementById(m.id);
        if (el && !el.classList.contains('hidden') && e.target === el) {
            if (typeof m.close === 'function') m.close();
        }
    });
});

// Закрытие всех модальных окон и поповеров по клавише Escape
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const popover = document.getElementById('profile-popover');
        if (popover && !popover.classList.contains('hidden')) {
            popover.classList.add('hidden');
        }
        if (typeof closeHintModal === 'function') closeHintModal();
        if (typeof closeExportModal === 'function') closeExportModal();
        if (typeof closeLookbookModal === 'function') closeLookbookModal();
        if (typeof closeLightbox === 'function') closeLightbox();
        if (window.OnboardingTour && OnboardingTour.isActive) OnboardingTour.close();
        if (window.OnboardingTour && typeof OnboardingTour.dismissWelcome === 'function') OnboardingTour.dismissWelcome(false);
    }
});

// Управление аккордеоном таблицы сопряжения швов
function toggleSeamAccordion() {
    const content = document.getElementById('accordion-seams-content');
    const chevron = document.getElementById('accordion-chevron');
    if (!content) return;
    const isHidden = content.classList.contains('hidden');
    if (isHidden) {
        content.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
    } else {
        content.classList.add('hidden');
        if (chevron) chevron.classList.remove('rotate-180');
    }
}

