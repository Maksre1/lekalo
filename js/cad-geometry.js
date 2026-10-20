// js/cad-geometry.js - Математическое ядро конструктора выкроек (ЕМКО / ЦНИИШП)

function rot(p, center, a) {
    const x = p.x - center.x;
    const y = p.y - center.y;
    const rx = x * Math.cos(a) - y * Math.sin(a);
    const ry = x * Math.sin(a) + y * Math.cos(a);
    return { x: center.x + rx, y: center.y + ry };
}

// Численный расчет длины кубической кривой Безье
function bezierCubicLen(p0, p1, p2, p3, steps = 100) {
    let len = 0;
    let prev = p0;
    for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const mt = 1 - t;
        const x = mt*mt*mt*p0.x + 3*mt*mt*t*p1.x + 3*mt*t*t*p2.x + t*t*t*p3.x;
        const y = mt*mt*mt*p0.y + 3*mt*mt*t*p1.y + 3*mt*t*t*p2.y + t*t*t*p3.y;
        len += Math.hypot(x - prev.x, y - prev.y);
        prev = { x, y };
    }
    return len;
}

// Численный расчет длины квадратичной кривой Безье
function bezierQuadLen(p0, p1, p2, steps = 100) {
    let len = 0;
    let prev = p0;
    for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const mt = 1 - t;
        const x = mt*mt*p0.x + 2*mt*t*p1.x + t*t*p2.x;
        const y = mt*mt*p0.y + 2*mt*t*p1.y + t*t*p2.y;
        len += Math.hypot(x - prev.x, y - prev.y);
        prev = { x, y };
    }
    return len;
}

function calculateGeometry() {
    // 0. Защита от пустых значений, деления на ноль и нечисловых параметров
    const og = Math.max(40, Number(state.og) || 92);
    const ot = Math.max(30, Number(state.ot) || 74);
    const ob = Math.max(40, Number(state.ob) || 98);
    const osh = Math.max(20, Number(state.osh) || 36);
    const dts = Math.max(25, Number(state.dts) || 40.0);
    const dtp = Math.max(25, Number(state.dtp) || 43.5);
    const vg = Math.max(15, Number(state.vg) || 26.5);
    const cg = Math.max(5, Number(state.cg) || 10.0);
    const vb = Math.max(10, Number(state.vb) || 19.5);
    const di = Math.max(35, Number(state.di) || 100.0);
    const shp = Math.max(6, Number(state.shp) || 12.8);
    const dr = Math.max(15, Number(state.dr) || 57.0);
    const op = Math.max(15, Number(state.op) || 28.5);
    const pg = (typeof state.pg === 'number' && !isNaN(state.pg)) ? state.pg : 5.0;
    const pt = (typeof state.pt === 'number' && !isNaN(state.pt)) ? state.pt : 2.0;
    const pb = (typeof state.pb === 'number' && !isNaN(state.pb)) ? state.pb : 3.0;
    const pspr = (typeof state.pspr === 'number' && !isNaN(state.pspr)) ? state.pspr : 2.0;
    const pop = (typeof state.pop === 'number' && !isNaN(state.pop)) ? state.pop : 5.5;

    // 0. Корректировки осанки (ЦНИИШП)
    const posture = state.posture || 'normal';
    const postureDts = posture === 'stooped' ? 1.0 : posture === 'erect' ? -0.8 : 0.0;
    const postureDtp = posture === 'stooped' ? -0.8 : posture === 'erect' ? 1.2 : 0.0;
    const postureBackDart = posture === 'stooped' ? 2.4 : posture === 'erect' ? 1.1 : 1.6;
    const postureBustK = posture === 'stooped' ? -0.5 : posture === 'erect' ? 0.6 : 0.0;
    const postureShDrop = posture === 'stooped' ? 2.6 : posture === 'erect' ? 1.9 : 2.2;
    const postureNeckDrop = posture === 'stooped' ? 0.3 : 0.0;

    // 1. Полуобхваты
    const Sg = og / 2;
    const St = ot / 2;
    const Sb = ob / 2;
    const Ssh = osh / 2;

    // 2. Базисная сетка (ЕМКО / ЦНИИШП с анатомической гармонизацией)
    const W_grid = Math.max(25, Sg + pg);
    const shsVal = parseFloat(state.shs);
    const shgVal = parseFloat(state.shg);

    // Минимально допустимая анатомическая ширина проймы для исключения схождения линий Г1 и Г2
    const W_arm_min = Math.max(8.5, 0.20 * Sg + 0.35 * Math.max(0, pg));

    // Целевые ширины спинки и полочки
    let W_back_target, W_front_target;
    if (shsVal > 20) {
        W_back_target = (shsVal / 2) + (0.22 * pg);
    } else {
        W_back_target = (Sg / 3) + 2.1 + (0.25 * pg);
    }

    if (shgVal > 20) {
        W_front_target = (shgVal / 2) + (0.20 * pg);
    } else {
        W_front_target = (Sg / 3) - 0.5 + (0.20 * pg);
    }

    let W_back, W_armhole, W_front;
    const W_body_avail = W_grid - W_arm_min;

    if (W_back_target + W_front_target > W_body_avail) {
        // Если сумма введенных мерок Шс и Шг превышает доступную ширину сетки за вычетом проймы,
        // пропорционально масштабируем спинку и полочку, гарантируя наличие проймы W_arm_min
        const scale = Math.max(0.4, W_body_avail / (W_back_target + W_front_target));
        W_back = Math.max(10.0, W_back_target * scale);
        W_front = Math.max(10.0, W_front_target * scale);
        W_armhole = Math.max(W_arm_min, W_grid - W_back - W_front);
        // Корректируем полочку для строгого равенства сумме W_grid
        W_front = W_grid - W_back - W_armhole;
    } else {
        W_back = W_back_target;
        W_front = W_front_target;
        W_armhole = W_grid - W_back - W_front;
    }

    // Вертикали по X (строго 0 < X_G < X_G4 < X_G2 < X_G3 = W_grid)
    const X_A = 0;
    const X_G = W_back;
    const X_G2 = W_back + W_armhole;
    const X_G3 = W_grid;
    const X_G4 = W_back + W_armhole * 0.5;

    // Горизонтали по Y
    const Y_A = 0;
    const effectiveGpr = (typeof AutoMeasurements !== 'undefined') ? AutoMeasurements.getEffective('gpr') : (0.28 * Sg + 5.5);
    const Y_G = effectiveGpr + pspr;
    const Y_T = dts + postureDts;
    const Y_B = Y_T + vb;
    const Y_H = Math.max(di, Y_B + 5.0);

    // 3. Спинка: горловина, плечо, вытачка
    const W_neck = (Ssh / 3) + 1.0;
    const H_back_neck = W_neck / 3.0 + postureNeckDrop;
    const A = { x: 0, y: 0 };
    const A3 = { x: W_neck, y: 0 };
    const A4 = { x: W_neck, y: -H_back_neck };
    const A5 = { x: W_neck * 0.55, y: 0 }; // Строго горизонтальная касательная на сгибе спинки
    const A1 = { x: X_G, y: 0 };

    const L_back_sh = state.shp + postureBackDart;

    // Расчет наклона плеча с учетом Впк (Высота плеча косая)
    let postureShDropCalc = postureShDrop;
    if (typeof AutoMeasurements !== 'undefined' && !AutoMeasurements.isAuto('vpk')) {
        const userVpk = Number(state.vpk);
        const approxP1x = Math.max(14.0, W_neck + Math.sqrt(Math.max(1, L_back_sh * L_back_sh - 2.2 * 2.2)));
        const vertDelta = Math.sqrt(Math.max(100, userVpk * userVpk - approxP1x * approxP1x));
        postureShDropCalc = Math.max(-0.5, Math.min(6.5, Y_T - vertDelta));
    }
    const dy_back_sh = postureShDropCalc - A4.y;
    const dx_back_sh = Math.sqrt(Math.max(1, L_back_sh * L_back_sh - dy_back_sh * dy_back_sh));
    const P1 = { x: A4.x + dx_back_sh, y: postureShDropCalc };

    // Плечевая вытачка спинки
    const back_sh_dart_len = 7.5;
    const sh_ux = (P1.x - A4.x) / L_back_sh;
    const sh_uy = (P1.y - A4.y) / L_back_sh;
    const sh_D1 = { x: A4.x + sh_ux * 4.0, y: A4.y + sh_uy * 4.0 };
    const sh_D2 = { x: A4.x + sh_ux * (4.0 + postureBackDart), y: A4.y + sh_uy * (4.0 + postureBackDart) };
    const sh_Apex = {
        x: (sh_D1.x + sh_D2.x) / 2 - sh_uy * back_sh_dart_len,
        y: (sh_D1.y + sh_D2.y) / 2 + sh_ux * back_sh_dart_len
    };

    // Точки проймы спинки
    const P2 = { x: X_G, y: P1.y + (Y_G - P1.y) * 0.58 };
    const bisector_back = 0.15 * W_armhole + 0.6;
    const P3 = { x: X_G + bisector_back * 0.707, y: Y_G - bisector_back * 0.707 };
    const G4 = { x: X_G4, y: Y_G };

    // 4. Полочка: кинематика нагрудной вытачки и плеча
    const Y_V1 = Y_T - (state.dtp + postureDtp);
    const V1 = { x: X_G3, y: Y_V1 };
    const V3 = { x: X_G3 - W_neck, y: Y_V1 };
    const V4 = { x: X_G3, y: Y_V1 + W_neck + 1.0 };
    // Точки Безье горловины полочки: горизонтальная касательная на линии полузаноса (V4)
    const V5_c1 = { x: V3.x, y: V3.y + (V4.y - V3.y) * 0.55 };
    const V5_c2 = { x: V3.x + W_neck * 0.55, y: V4.y };
    const V5 = { x: X_G3 - W_neck * 0.66, y: V1.y + (V4.y - V1.y) * 0.66 };
    const A2 = { x: X_G2, y: 0 };

    // Центр груди Г7
    const X_G6 = Math.max(X_G4 + 1.0, Math.min(X_G3 - 4.0, X_G3 - cg));
    const dx_vg = V3.x - X_G6;
    const dy_vg = Math.sqrt(Math.max(4, vg * vg - dx_vg * dx_vg));
    const G7 = { x: X_G6, y: V3.y + dy_vg };

    // Базовое (закрытое) положение плеча полочки
    const front_sh_drop = 3.6 + (postureShDropCalc - 2.2) * 0.6;
    const dx_closed = Math.sqrt(Math.max(1, shp * shp - front_sh_drop * front_sh_drop));
    const P5_closed = { x: V3.x - dx_closed, y: V3.y + front_sh_drop };
    const f_ux = (P5_closed.x - V3.x) / shp;
    const f_uy = (P5_closed.y - V3.y) / shp;

    // Первая сторона вытачки (4 см от горловины)
    const V7 = { x: V3.x + f_ux * 4.0, y: V3.y + f_uy * 4.0 };
    const L_dart_leg = Math.hypot(V7.x - G7.x, V7.y - G7.y);

    // 4.1 Анатомический расчет чашки груди и проекции молочной железы
    let cup_diff;
    if (shgVal > 20) {
        cup_diff = og - (shgVal * 2);
    } else {
        cup_diff = (Sg - 36) * 1.2 + 10.0;
    }
    cup_diff = Math.max(6.0, Math.min(28.0, cup_diff));

    // Расчет радиуса адаптивного укорочения вершины вытачки (R_apex)
    // Маленькая чашка A (cup_diff ~ 10-12) -> отступ ~ 1.6-1.8 см
    // Средняя чашка B/C (cup_diff ~ 14-16) -> отступ ~ 2.2-2.5 см
    // Пышная чашка D/E+ (cup_diff ~ 20-26) -> отступ ~ 3.0-3.5 см
    const R_apex = Math.max(1.5, Math.min(3.5, 1.5 + (cup_diff - 10.0) * 0.13));

    // Проекционный радиус основания грудной железы
    const R_breast_sphere = Math.max(6.0, Math.min(10.5, 6.0 + (cup_diff - 10.0) * 0.28));

    // Раствор нагрудной вытачки и угол поворота (адаптируется под объем чашки груди)
    let bust_dart_width;
    if (shgVal > 20) {
        bust_dart_width = Math.max(2.5, 7.2 + (cup_diff - 26) * 0.25 + postureBustK);
    } else {
        bust_dart_width = Math.max(2.5, (Sg - 38) * 0.40 + 4.0 + postureBustK);
    }
    const alpha = 2 * Math.asin(Math.min(0.85, bust_dart_width / (2 * L_dart_leg)));

    // Вторая сторона вытачки В9
    const angle_V7 = Math.atan2(V7.y - G7.y, V7.x - G7.x);
    const angle_V9 = angle_V7 - alpha;
    const V9 = {
        x: G7.x + L_dart_leg * Math.cos(angle_V9),
        y: G7.y + L_dart_leg * Math.sin(angle_V9)
    };
    // Укороченная вершина вытачки В8 (лежит строго на биссектрисе вытачки, что гарантирует абсолютное равенство сторон |V7-V8| === |V9-V8|)
    const angle_bisector = angle_V7 - alpha / 2;
    const R_apex_sh = Math.max(1.3, R_apex * 0.75);
    const V8 = {
        x: G7.x + (L_dart_leg - R_apex_sh) * Math.cos(angle_bisector),
        y: G7.y + (L_dart_leg - R_apex_sh) * Math.sin(angle_bisector)
    };

    // Повернутая плечевая точка P5_open и контрольная точка P6_open
    const P5_open = rot(P5_closed, G7, -alpha);
    const P6_closed = { x: X_G2, y: P5_closed.y + (Y_G - P5_closed.y) * 0.55 };
    const P6_open = rot(P6_closed, G7, -alpha);

    // Нижняя часть проймы переда
    const bisector_front = 0.12 * W_armhole + 0.5;
    const P7 = { x: X_G2 - bisector_front * 0.707, y: Y_G - bisector_front * 0.707 };

    // 5. Талиевые вытачки и бедра
    const total_waist_intake = Math.max(1.5, W_grid - (St + state.pt));
    const side_dart_w = total_waist_intake * 0.45;
    const back_dart_w = total_waist_intake * 0.30;
    const front_dart_w = total_waist_intake * 0.25;

    const front_waist_drop = 1.2;
    const T1 = { x: X_G3, y: Y_T };
    const T5 = { x: X_G3, y: Y_T + front_waist_drop };
    const B1 = { x: X_G3, y: Y_B };
    const B5 = { x: X_G3, y: Y_B + front_waist_drop };

    const T3 = { x: X_G4 - side_dart_w / 2, y: Y_T };
    const T4 = { x: X_G4 + side_dart_w / 2, y: Y_T };

    const hip_excess = (Sb + state.pb) - W_grid;
    const B3 = { x: X_G4 + hip_excess / 2, y: Y_B };
    const B4 = { x: X_G4 - hip_excess / 2, y: Y_B };

    // Ромб спинки
    const X_G8 = W_back * 0.48;
    const G8_top = { x: X_G8, y: Y_G + 1.0 };
    const T7 = { x: X_G8 - back_dart_w / 2, y: Y_T };
    const T8 = { x: X_G8 + back_dart_w / 2, y: Y_T };
    const B8_bot = { x: X_G8, y: Y_B - 3.0 };

    // Ромб полочки (вершина заканчивается под основанием груди)
    const front_dart_top = { x: X_G6, y: G7.y + Math.max(3.2, R_apex + 1.2) };
    const T9_y = Y_T + front_waist_drop * 0.5;
    const T10 = { x: X_G6 - front_dart_w / 2, y: T9_y };
    const T11 = { x: X_G6 + front_dart_w / 2, y: T9_y };
    const B_front_bot = { x: X_G6, y: Y_B + front_waist_drop * 0.5 - 4.0 };

    // 6. Анатомический втачной рукав с вариациями длины
    const sleeveLengthType = state.sleeveLengthType || 'long';
    let L_sleeve = state.dr;
    const effectiveOz = (typeof AutoMeasurements !== 'undefined') ? AutoMeasurements.getEffective('oz') : (Number(state.oz) || 16.5);
    const L_elbow = (typeof AutoMeasurements !== 'undefined') ? AutoMeasurements.getEffective('dr_l') : Math.round(state.dr * 0.56);
    let W_wrist = effectiveOz + 4.5; // комфортная ширина низа рукава (Шрн) с прибавкой

    if (sleeveLengthType === 'three-quarter') {
        L_sleeve = Math.round(state.dr * 0.72);
        W_wrist = Math.round(state.op * 0.88 + 2.0);
    } else if (sleeveLengthType === 'short') {
        L_sleeve = 22.0;
        W_wrist = Math.round(state.op + state.pop * 0.65);
    }

    const W_sleeve = state.op + state.pop;
    const d_vert = ((Y_G - P1.y) + (Y_G - P5_closed.y)) / 2;
    // Оптимальная высота оката: стабильная посадка +2.0..+3.2 см без избыточного сборения на больших размерах
    const H_cap = Math.min(17.2, Math.max(11.0, 0.70 * d_vert + 1.6));

    // 7. Моделирование выреза горловины (Neckline) с прецизионным сопряжением под 90°
    const necklineType = state.necklineType || 'round';
    const necklineDepth = Math.max(0, Math.min(8.0, Number(state.necklineDepth) || 0));

    // Нормаль к плечу полочки внутрь горловины (угол 90° к плечу полочки):
    const n_front_x = f_uy;
    const n_front_y = -f_ux;

    // Нормаль к плечу спинки внутрь ростка (угол 90° к плечу спинки):
    const n_back_x = -sh_uy;
    const n_back_y = sh_ux;

    // Точки горловины полочки и ростка спинки
    let V3_neck = { x: V3.x, y: V3.y };
    let V4_neck = { x: X_G3, y: V4.y + necklineDepth };
    let V_corner_sq = null;
    let keyhole = null;
    let A4_neck = { x: A4.x, y: A4.y };

    if (necklineType === 'boat') {
        // Лодочка: срез плеча укорачивается на 3.2 см с обеих сторон
        const shiftBoat = 3.2;
        V3_neck = { x: V3.x - shiftBoat * f_ux, y: V3.y - shiftBoat * f_uy };
        V4_neck = { x: X_G3, y: Y_V1 + 2.8 + necklineDepth * 0.4 };
        A4_neck = { x: A4.x + shiftBoat * sh_ux, y: A4.y + shiftBoat * sh_uy };
    } else if (necklineType === 'square') {
        // Каре: прямоугольный вырез
        V3_neck = { x: V3.x - 0.8, y: V3.y };
        const sqDepthY = V4.y + necklineDepth;
        V_corner_sq = { x: V3_neck.x, y: sqDepthY };
        V4_neck = { x: X_G3, y: sqDepthY };
    } else if (necklineType === 'keyhole') {
        // Вырез-капелька по центру полочки
        const kTopY = V4.y + 1.2;
        const kBotY = V4.y + 7.5 + necklineDepth * 0.5;
        const kHalfW = 2.2;
        keyhole = {
            topY: kTopY,
            botY: kBotY,
            halfW: kHalfW,
            centerX: X_G3,
            path: `M ${X_G3 * CM} ${kTopY * CM} C ${(X_G3 - kHalfW) * CM} ${(kTopY + 1.5) * CM}, ${(X_G3 - kHalfW) * CM} ${(kBotY - 1.5) * CM}, ${X_G3 * CM} ${kBotY * CM} C ${(X_G3 + kHalfW) * CM} ${(kBotY - 1.5) * CM}, ${(X_G3 + kHalfW) * CM} ${(kTopY + 1.5) * CM}, ${X_G3 * CM} ${kTopY * CM} Z`
        };
    } else if (necklineType === 'v-neck' || necklineType === 'deep-v') {
        const extraV = (necklineType === 'deep-v') ? 5.5 : 2.5;
        V3_neck = { x: V3.x - (necklineType === 'deep-v' ? 0.8 : 0.5), y: V3.y };
        V4_neck = { x: X_G3, y: V4.y + extraV + necklineDepth };
    }

    // --- ПРЕДОХРАНИТЕЛИ И РАСЧЕТ РЫЧАГОВ БЕЗЬЕ ГОРЛОВИНЫ ПОЛОЧКИ ---
    const dist_f = Math.hypot(V4_neck.x - V3_neck.x, V4_neck.y - V3_neck.y);
    const d_front_handle = Math.max(1.4, Math.min(3.8, dist_f * 0.35));

    let V_neck_c1, V_neck_c2;

    if (necklineType === 'v-neck' || necklineType === 'deep-v') {
        // В V-образном вырезе у шеи делается микро-сопряжение под 90° (длина 1.3-2.0 см),
        // чтобы вырез не топорщился на ключице, затем плавно уходит в диагональ к V4
        const v_stem = Math.max(1.1, Math.min(2.0, dist_f * 0.18));
        V_neck_c1 = {
            x: V3_neck.x + n_front_x * v_stem,
            y: V3_neck.y + n_front_y * v_stem
        };
        const dir_v_x = V4_neck.x - V3_neck.x;
        const dir_v_y = V4_neck.y - V3_neck.y;
        const dist_v = Math.hypot(dir_v_x, dir_v_y);
        V_neck_c2 = {
            x: V4_neck.x - (dir_v_x / dist_v) * (v_stem * 1.5),
            y: V4_neck.y - (dir_v_y / dist_v) * (v_stem * 1.5)
        };
    } else {
        // Круглый / Лодочка / Капелька: сопряжение 90° к плечу полочки и 0° по сгибу переда
        V_neck_c1 = {
            x: V3_neck.x + n_front_x * d_front_handle,
            y: V3_neck.y + n_front_y * d_front_handle
        };
        V_neck_c2 = {
            x: V4_neck.x - d_front_handle * 0.95,
            y: V4_neck.y
        };
    }

    // --- СОПРЯЖЕНИЕ РОСТКА СПИНКИ (CUBIC BEZIER) ---
    // В точке A=(0,0) строго горизонтальная касательная (0°), в точке A4_neck строго 90° к плечу спинки!
    const dist_b = Math.hypot(A4_neck.x - A.x, A4_neck.y - A.y);
    const d_back_handle = Math.max(1.2, Math.min(2.8, dist_b * 0.38));

    const A_neck_c1 = {
        x: A.x + Math.max(1.5, A4_neck.x * 0.42),
        y: 0
    };
    const A_neck_c2 = {
        x: A4_neck.x + n_back_x * d_back_handle,
        y: A4_neck.y + n_back_y * d_back_handle
    };
    // Сохраняем A5_neck для обратной совместимости
    const A5_neck = {
        x: (A_neck_c1.x + A_neck_c2.x) * 0.5,
        y: A_neck_c2.y * 0.5
    };

    // 8. Моделирование переноса нагрудной вытачки (Bust Dart Transfer)
    const dartPosition = state.dartPosition || 'shoulder';

    // Точки для французской вытачки в боковой шов ('side')
    const side_dart_start_y = Y_G + 3.8;
    const side_dart_leg = bust_dart_width * 0.88;
    const S_d1 = { x: X_G4, y: side_dart_start_y };
    const S_d2 = { x: X_G4, y: side_dart_start_y + side_dart_leg };
    const S_mid = { x: X_G4, y: (S_d1.y + S_d2.y) / 2 };
    const dx_s = G7.x - S_mid.x;
    const dy_s = G7.y - S_mid.y;
    const dist_s = Math.hypot(dx_s, dy_s);
    // Вершина боковой вытачки укорочена адаптивно на R_apex
    const S_apex = {
        x: G7.x - (dx_s / dist_s) * R_apex,
        y: G7.y - (dy_s / dist_s) * R_apex
    };

    // Точки для перевода вытачки в талию ('waist')
    const front_dart_w_waist = front_dart_w + bust_dart_width * 0.82;
    const T10_waist = { x: X_G6 - front_dart_w_waist / 2, y: T9_y };
    const T11_waist = { x: X_G6 + front_dart_w_waist / 2, y: T9_y };
    const G7_waist_apex = { x: X_G6, y: G7.y + Math.max(2.0, R_apex * 0.85) };

    // Точки для перевода вытачки в пройму ('armhole')
    const arm_dart_leg = bust_dart_width * 0.75;
    const P6_arm_d1 = { x: P6_closed.x - 0.2, y: P6_closed.y - arm_dart_leg / 2 };
    const P6_arm_d2 = { x: P6_closed.x - 0.2, y: P6_closed.y + arm_dart_leg / 2 };
    const dx_arm = G7.x - P6_closed.x;
    const dy_arm = G7.y - P6_closed.y;
    const dist_arm = Math.hypot(dx_arm, dy_arm);
    const Arm_apex = {
        x: G7.x - (dx_arm / dist_arm) * (R_apex * 0.9),
        y: G7.y - (dy_arm / dist_arm) * (R_apex * 0.9)
    };

    // 9. Силуэт изделия: прямой ('straight') или трапеция/клеш ('flare')
    const silhouette = state.silhouette || 'straight';
    const flare_w = silhouette === 'flare' ? 5.5 : 0.0;
    const H_back_side = { x: B3.x + flare_w, y: Y_H - (silhouette === 'flare' ? 0.6 : 0) };
    const H_front_side = { x: B4.x - flare_w, y: (Y_H + front_waist_drop) - (silhouette === 'flare' ? 0.6 : 0) };

    // 10. Расчет длин пройм и оката для проверки посадки
    // Пройма спинки
    const back_c1 = { x: X_G - 0.15, y: P1.y + 3.0 };
    const back_c2 = { x: P2.x, y: P2.y - 1.0 };
    const l_back_1 = bezierCubicLen(P1, back_c1, back_c2, P2);
    const l_back_2 = bezierQuadLen(P2, P3, G4);
    const len_back_armhole = l_back_1 + l_back_2;

    // Пройма полочки (в закрытом состоянии изделия)
    const ctrl_f = { x: X_G2 - 0.5, y: P5_closed.y + 3.0 };
    const l_front_1 = bezierQuadLen(P5_closed, ctrl_f, P6_closed);
    const l_front_2 = bezierQuadLen(P6_closed, P7, G4);
    const len_front_armhole = l_front_1 + l_front_2;

    const total_armhole_len = len_back_armhole + len_front_armhole;

    // Окат рукава (асимметричный: передняя выемка + спинка выпуклая)
    const halfW = W_sleeve / 2;
    // Передняя сторона оката (X > 0)
    const sl_p0_f = { x: 0, y: 0 };
    const sl_p1_f = { x: halfW * 0.45, y: 0.0 };
    const sl_p2_f = { x: halfW * 0.70, y: H_cap * 1.12 };
    const sl_p3_f = { x: halfW, y: H_cap };
    const len_sleeve_front = bezierCubicLen(sl_p0_f, sl_p1_f, sl_p2_f, sl_p3_f);

    // Локтевая сторона оката (X < 0)
    const sl_p0_b = { x: 0, y: 0 };
    const sl_p1_b = { x: -halfW * 0.50, y: 0.0 };
    const sl_p2_b = { x: -halfW * 0.78, y: H_cap * 0.88 };
    const sl_p3_b = { x: -halfW, y: H_cap };
    const len_sleeve_back = bezierCubicLen(sl_p0_b, sl_p1_b, sl_p2_b, sl_p3_b);

    const total_sleeve_cap_len = len_sleeve_front + len_sleeve_back;
    const sleeve_ease = total_sleeve_cap_len - total_armhole_len; // Посадка в см

    // 11. Метрики свободы и степени прилегания (Fit Indicators)
    const totalEaseBust = state.pg * 2;
    const totalEaseWaist = state.pt * 2;
    const totalEaseHips = state.pb * 2;
    const totalEaseSleeve = state.pop;

    let bustFitCategory = 'semi';
    let bustFitLabel = 'Полуприлегающий (комфорт)';
    let bustFitColor = '#10b981'; // emerald
    if (totalEaseBust < 4.0) {
        bustFitCategory = 'tight';
        bustFitLabel = 'Облегающий (бодикон)';
        bustFitColor = '#f43f5e';
    } else if (totalEaseBust <= 6.0) {
        bustFitCategory = 'fitted';
        bustFitLabel = 'Прилегающий (по фигуре)';
        bustFitColor = '#06b6d4';
    } else if (totalEaseBust <= 9.0) {
        bustFitCategory = 'semi';
        bustFitLabel = 'Полуприлегающий (рекомендован)';
        bustFitColor = '#10b981';
    } else if (totalEaseBust <= 14.0) {
        bustFitCategory = 'relaxed';
        bustFitLabel = 'Свободный (прямой)';
        bustFitColor = '#6366f1';
    } else {
        bustFitCategory = 'oversize';
        bustFitLabel = 'Оверсайз (свободный крой)';
        bustFitColor = '#8b5cf6';
    }

    return {
        type: 'dress',
        hasSleeve: (state.showSleeve !== false && state.sleeveLengthType !== 'sleeveless'),
        Sg, St, Sb, Ssh,
        W_grid, W_back, W_armhole, W_front,
        X_A, X_G, X_G2, X_G3, X_G4, X_G6, X_G8,
        Y_A, Y_G, Y_T, Y_B, Y_H, Y_V1,
        W_neck, H_back_neck,
        A, A1, A2, A3, A4, A5,
        P1, P2, P3, G4,
        sh_D1, sh_D2, sh_Apex, postureBackDart,
        V1, V3, V4, V5, V5_c1, V5_c2, V7, V8, V9, G7,
        P5_closed, P5_open, P6_closed, P6_open, P7,
        T1, T3, T4, T5, T7, T8, T10, T11,
        B1, B3, B4, B5, B8_bot, B_front_bot,
        front_dart_top, L_dart_leg, bust_dart_width, total_waist_intake,
        side_dart_w, back_dart_w, front_dart_w, hip_excess,
        W_sleeve, H_cap, L_sleeve, L_elbow, W_wrist, effectiveOz, effectiveGpr,
        len_back_armhole, len_front_armhole, total_armhole_len,
        len_sleeve_front, len_sleeve_back, total_sleeve_cap_len, sleeve_ease,
        posture,
        // Новые свойства моделирования и прилегания
        sleeveLengthType,
        necklineType, necklineDepth,
        V3_neck, V4_neck, V_neck_c1, V_neck_c2, V_corner_sq,
        keyhole,
        A4_neck, A5_neck, A_neck_c1, A_neck_c2,
        dartPosition,
        S_d1, S_d2, S_apex,
        T10_waist, T11_waist, G7_waist_apex,
        P6_arm_d1, P6_arm_d2, Arm_apex,
        silhouette, flare_w, H_back_side, H_front_side,
        totalEaseBust, totalEaseWaist, totalEaseHips, totalEaseSleeve,
        bustFitCategory, bustFitLabel, bustFitColor,
        // Анатомические параметры грудной железы и укорочения вытачки
        vg, cg, shg: shgVal, R_apex, R_breast_sphere, cup_diff
    };
}
