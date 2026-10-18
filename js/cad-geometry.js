// js/cad-geometry.js - Математическое ядро САПР (ЕМКО / ЦНИИШП)

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
    // 0. Корректировки осанки (ЦНИИШП)
    const posture = state.posture || 'normal';
    const postureDts = posture === 'stooped' ? 1.0 : posture === 'erect' ? -0.8 : 0.0;
    const postureDtp = posture === 'stooped' ? -0.8 : posture === 'erect' ? 1.2 : 0.0;
    const postureBackDart = posture === 'stooped' ? 2.4 : posture === 'erect' ? 1.1 : 1.6;
    const postureBustK = posture === 'stooped' ? -0.5 : posture === 'erect' ? 0.6 : 0.0;
    const postureShDrop = posture === 'stooped' ? 2.6 : posture === 'erect' ? 1.9 : 2.2;
    const postureNeckDrop = posture === 'stooped' ? 0.3 : 0.0;

    // 1. Полуобхваты
    const Sg = state.og / 2;
    const St = state.ot / 2;
    const Sb = state.ob / 2;
    const Ssh = state.osh / 2;

    // 2. Базисная сетка (ЕМКО)
    const W_grid = Sg + state.pg;
    const W_back = (Sg / 3) + 2.1 + (0.25 * state.pg);
    const W_armhole = 0.22 * Sg + 1.2 + (0.55 * state.pg);
    const W_front = W_grid - W_back - W_armhole;

    // Вертикали по X
    const X_A = 0;
    const X_G = W_back;
    const X_G2 = W_back + W_armhole;
    const X_G3 = W_grid;
    const X_G4 = W_back + W_armhole * 0.5;

    // Горизонтали по Y
    const Y_A = 0;
    const Y_G = 0.28 * Sg + 5.5 + state.pspr;
    const Y_T = state.dts + postureDts;
    const Y_B = Y_T + state.vb;
    const Y_H = Math.max(state.di, Y_B + 5.0);

    // 3. Спинка: горловина, плечо, вытачка
    const W_neck = (Ssh / 3) + 1.0;
    const H_back_neck = W_neck / 3.0 + postureNeckDrop;
    const A = { x: 0, y: 0 };
    const A3 = { x: W_neck, y: 0 };
    const A4 = { x: W_neck, y: -H_back_neck };
    const A5 = { x: W_neck * 0.55, y: 0 }; // Строго горизонтальная касательная на сгибе спинки
    const A1 = { x: X_G, y: 0 };

    const L_back_sh = state.shp + postureBackDart;
    const dy_back_sh = postureShDrop - A4.y;
    const dx_back_sh = Math.sqrt(Math.max(1, L_back_sh * L_back_sh - dy_back_sh * dy_back_sh));
    const P1 = { x: A4.x + dx_back_sh, y: postureShDrop };

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
    const X_G6 = Math.max(X_G2 + 2.0, X_G3 - state.cg);
    const dx_vg = V3.x - X_G6;
    const dy_vg = Math.sqrt(Math.max(4, state.vg * state.vg - dx_vg * dx_vg));
    const G7 = { x: X_G6, y: V3.y + dy_vg };

    // Базовое (закрытое) положение плеча полочки
    const front_sh_drop = 3.6;
    const dx_closed = Math.sqrt(Math.max(1, state.shp * state.shp - front_sh_drop * front_sh_drop));
    const P5_closed = { x: V3.x - dx_closed, y: V3.y + front_sh_drop };
    const f_ux = (P5_closed.x - V3.x) / state.shp;
    const f_uy = (P5_closed.y - V3.y) / state.shp;

    // Первая сторона вытачки (4 см от горловины)
    const V7 = { x: V3.x + f_ux * 4.0, y: V3.y + f_uy * 4.0 };
    const L_dart_leg = Math.hypot(V7.x - G7.x, V7.y - G7.y);

    // Раствор нагрудной вытачки и угол поворота
    const bust_dart_width = Math.max(2.5, (Sg - 38) * 0.40 + 4.0 + postureBustK);
    const alpha = 2 * Math.asin(Math.min(0.85, bust_dart_width / (2 * L_dart_leg)));

    // Вторая сторона вытачки В9
    const angle_V7 = Math.atan2(V7.y - G7.y, V7.x - G7.x);
    const angle_V9 = angle_V7 - alpha;
    const V9 = {
        x: G7.x + L_dart_leg * Math.cos(angle_V9),
        y: G7.y + L_dart_leg * Math.sin(angle_V9)
    };
    // Укороченная вершина вытачки В8 (на 1.5 см выше Г7, чтобы ткань не топорщилась)
    const V8 = {
        x: G7.x + (L_dart_leg - 1.5) * Math.cos(angle_V9),
        y: G7.y + (L_dart_leg - 1.5) * Math.sin(angle_V9)
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

    // Ромб полочки
    const front_dart_top = { x: X_G6, y: G7.y + 4.0 };
    const T9_y = Y_T + front_waist_drop * 0.5;
    const T10 = { x: X_G6 - front_dart_w / 2, y: T9_y };
    const T11 = { x: X_G6 + front_dart_w / 2, y: T9_y };
    const B_front_bot = { x: X_G6, y: Y_B + front_waist_drop * 0.5 - 4.0 };

    // 6. Анатомический втачной рукав с вариациями длины
    const sleeveLengthType = state.sleeveLengthType || 'long';
    let L_sleeve = state.dr;
    let W_wrist = state.oz + 2.0;

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

    // 7. Моделирование выреза горловины (Neckline)
    const necklineType = state.necklineType || 'round';
    const necklineDepth = Math.max(0, Math.min(8.0, Number(state.necklineDepth) || 0));

    // Точки горловины полочки
    let V3_neck = { x: V3.x, y: V3.y };
    let V4_neck = { x: X_G3, y: V4.y + necklineDepth };
    let V_neck_c1 = { x: V3_neck.x, y: V3_neck.y + (V4_neck.y - V3_neck.y) * 0.55 };
    let V_neck_c2 = { x: V3_neck.x + W_neck * 0.55, y: V4_neck.y };
    let V_corner_sq = null;

    if (necklineType === 'v-neck') {
        V3_neck = { x: V3.x - 0.5, y: V3.y };
        V4_neck = { x: X_G3, y: V4.y + 2.5 + necklineDepth };
        V_neck_c1 = { x: V3_neck.x + (V4_neck.x - V3_neck.x) * 0.35 + 0.6, y: V3_neck.y + (V4_neck.y - V3_neck.y) * 0.55 };
        V_neck_c2 = { x: V3_neck.x + (V4_neck.x - V3_neck.x) * 0.75 + 0.3, y: V4_neck.y - 0.5 };
    } else if (necklineType === 'boat') {
        // Лодочка: плечо открывается наружу к пройме на 3.2 см
        const shiftBoat = 3.2;
        V3_neck = { x: V3.x - shiftBoat * f_ux, y: V3.y - shiftBoat * f_uy };
        V4_neck = { x: X_G3, y: Y_V1 + 2.8 + necklineDepth * 0.4 };
        V_neck_c1 = { x: V3_neck.x, y: V3_neck.y + (V4_neck.y - V3_neck.y) * 0.55 };
        V_neck_c2 = { x: V3_neck.x + (X_G3 - V3_neck.x) * 0.55, y: V4_neck.y };
    } else if (necklineType === 'square') {
        // Каре: прямоугольный вырез
        V3_neck = { x: V3.x - 0.8, y: V3.y };
        const sqDepthY = V4.y + necklineDepth;
        V_corner_sq = { x: V3_neck.x, y: sqDepthY };
        V4_neck = { x: X_G3, y: sqDepthY };
    }

    // Горловина спинки при вырезе «лодочка»
    let A4_neck = { x: A4.x, y: A4.y };
    let A5_neck = { x: A5.x, y: A5.y };
    if (necklineType === 'boat') {
        const shiftBoatBack = 3.2;
        A4_neck = { x: A4.x + shiftBoatBack * sh_ux, y: A4.y + shiftBoatBack * sh_uy };
        A5_neck = { x: A4_neck.x * 0.55, y: A.y };
    }

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
    // Вершина вытачки укорочена на 2.5 см от центра груди
    const S_apex = {
        x: G7.x - (dx_s / dist_s) * 2.5,
        y: G7.y - (dy_s / dist_s) * 2.5
    };

    // Точки для перевода вытачки в талию ('waist')
    const front_dart_w_waist = front_dart_w + bust_dart_width * 0.82;
    const T10_waist = { x: X_G6 - front_dart_w_waist / 2, y: T9_y };
    const T11_waist = { x: X_G6 + front_dart_w_waist / 2, y: T9_y };
    const G7_waist_apex = { x: X_G6, y: G7.y + 2.0 };

    // Точки для перевода вытачки в пройму ('armhole')
    const arm_dart_leg = bust_dart_width * 0.75;
    const P6_arm_d1 = { x: P6_closed.x - 0.2, y: P6_closed.y - arm_dart_leg / 2 };
    const P6_arm_d2 = { x: P6_closed.x - 0.2, y: P6_closed.y + arm_dart_leg / 2 };
    const dx_arm = G7.x - P6_closed.x;
    const dy_arm = G7.y - P6_closed.y;
    const dist_arm = Math.hypot(dx_arm, dy_arm);
    const Arm_apex = {
        x: G7.x - (dx_arm / dist_arm) * 2.2,
        y: G7.y - (dy_arm / dist_arm) * 2.2
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
        W_sleeve, H_cap, L_sleeve, W_wrist,
        len_back_armhole, len_front_armhole, total_armhole_len,
        len_sleeve_front, len_sleeve_back, total_sleeve_cap_len, sleeve_ease,
        posture,
        // Новые свойства моделирования и прилегания
        sleeveLengthType,
        necklineType, necklineDepth,
        V3_neck, V4_neck, V_neck_c1, V_neck_c2, V_corner_sq,
        A4_neck, A5_neck,
        dartPosition,
        S_d1, S_d2, S_apex,
        T10_waist, T11_waist, G7_waist_apex,
        P6_arm_d1, P6_arm_d2, Arm_apex,
        silhouette, flare_w, H_back_side, H_front_side,
        totalEaseBust, totalEaseWaist, totalEaseHips, totalEaseSleeve,
        bustFitCategory, bustFitLabel, bustFitColor
    };
}
