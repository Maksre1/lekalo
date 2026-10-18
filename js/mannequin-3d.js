// js/mannequin-3d.js — Интерактивный 3D-манекен портновского ателье на Three.js
// Отображает анатомический манекен с реалистичным освещением и параметрической одеждой,
// которая мгновенно реагирует на изменение мерок, фасона, длины и посадки в реальном времени.

const TORSO_PROFILE = [
    { y: -0.42, r: 0.055 }, // низ голени
    { y: -0.22, r: 0.070 }, // колено
    { y: -0.05, r: 0.090 }, // бедро над коленом
    { y: 0.06,  r: 0.120 }, // паховая зона / шаговый шов
    { y: 0.14,  r: 0.225 }, // нижняя часть бедер
    { y: 0.28,  r: 0.258 }, // линия максимального обхвата бедер (Об)
    { y: 0.45,  r: 0.240 }, // высокие бедра
    { y: 0.65,  r: 0.185 }, // естественная талия (От)
    { y: 0.80,  r: 0.208 }, // под грудью
    { y: 0.96,  r: 0.250 }, // выступающая линия груди (Ог)
    { y: 1.12,  r: 0.215 }, // верх груди / ключицы
    { y: 1.22,  r: 0.192 }, // плечевой скат
    { y: 1.28,  r: 0.096 }, // основание шеи
    { y: 1.36,  r: 0.090 }, // верх шеи
    { y: 1.38,  r: 0.020 }  // крышка шеи
];

// Функция интерполяции радиуса торса по высоте Y
function getTorsoRadius(y, stateObj) {
    // Масштабирование по реальным меркам пользователя
    const st = stateObj || (window.state || {});
    const scaleWaist = (Number(st.Ot) || 74) / 74;
    const scaleHips = (Number(st.Ob) || 98) / 98;
    const scaleBust = (Number(st.Og) || 92) / 92;

    if (y <= TORSO_PROFILE[0].y) return TORSO_PROFILE[0].r * scaleHips;
    if (y >= TORSO_PROFILE[TORSO_PROFILE.length - 1].y) return TORSO_PROFILE[TORSO_PROFILE.length - 1].r;

    for (let i = 0; i < TORSO_PROFILE.length - 1; i++) {
        const p1 = TORSO_PROFILE[i];
        const p2 = TORSO_PROFILE[i + 1];
        if (y >= p1.y && y <= p2.y) {
            const t = (y - p1.y) / (p2.y - p1.y);
            // Плавная Hermite интерполяция
            const smoothT = t * t * (3 - 2 * t);
            let baseR = p1.r + (p2.r - p1.r) * smoothT;

            // Зональное масштабирование
            let factor = 1.0;
            if (y < 0.45) {
                factor = scaleHips;
            } else if (y < 0.75) {
                const wT = (y - 0.45) / 0.30;
                factor = scaleHips * (1 - wT) + scaleWaist * wT;
            } else if (y < 1.15) {
                const bT = (y - 0.75) / 0.40;
                factor = scaleWaist * (1 - bT) + scaleBust * bT;
            } else {
                factor = scaleBust;
            }
            return baseR * factor;
        }
    }
    return 0.20;
}

class StudioMannequin {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.mannequinGroup = null;
        this.garmentGroup = null;
        this.autoRotate = false;
        this.animId = null;
        this.isInitialized = false;

        this.init();
    }

    init() {
        if (typeof THREE === 'undefined') {
            setTimeout(() => this.init(), 300);
            return;
        }

        const width = this.container.clientWidth || 360;
        const height = this.container.clientHeight || 520;

        // 1. Сцена и камера
        this.scene = new THREE.Scene();
        // Теплый студийный нейтральный фон (контраст с тканью и одеждой)
        this.scene.background = new THREE.Color(0xe9e5dc);

        this.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
        this.camera.position.set(0, 0.85, 3.25);

        // 2. Рендерер
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        if (this.renderer.outputEncoding !== undefined) {
            this.renderer.outputEncoding = THREE.sRGBEncoding;
        }
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);

        // 3. Управление камерой (OrbitControls)
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.08;
            this.controls.minDistance = 1.6;
            this.controls.maxDistance = 4.8;
            this.controls.maxPolarAngle = Math.PI / 2 + 0.12;
            this.controls.minPolarAngle = 0.1;
            this.controls.target.set(0, 0.70, 0);
            this.controls.update();
        }

        // 4. Студийное ателье-освещение (объем, контраст, мягкие тени)
        this.setupLights();

        // 5. Построение манекена
        this.buildMannequin();

        // 6. Построение начальной одежды
        this.updateGarment(typeof state !== 'undefined' ? state : (window.state || {}));

        // 7. Анимационный цикл
        this.animate = this.animate.bind(this);
        this.animate();

        // 8. Ресайз
        window.addEventListener('resize', () => this.onResize());
        this.isInitialized = true;
    }

    setupLights() {
        // Мягкий рассеянный свет студии (без выбеливания)
        const hemiLight = new THREE.HemisphereLight(0xfffbf5, 0x475569, 0.38);
        hemiLight.position.set(0, 10, 0);
        this.scene.add(hemiLight);

        // Основной рисующий теплый свет (сверху-справа)
        const keyLight = new THREE.DirectionalLight(0xfff5ea, 0.72);
        keyLight.position.set(2.4, 3.8, 3.0);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.bias = -0.001;
        this.scene.add(keyLight);

        // Контурный контровой свет (подчеркивает изгиб талии и бедер слева)
        const rimLight = new THREE.DirectionalLight(0xb0bec5, 0.45);
        rimLight.position.set(-2.8, 2.2, -2.8);
        this.scene.add(rimLight);

        // Заполняющий мягкий фронтальный свет
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.22);
        fillLight.position.set(-1.8, 1.2, 2.2);
        this.scene.add(fillLight);

        // Мягкая виньетка / тень на полу
        const shadowGeo = new THREE.CircleGeometry(0.85, 32);
        const shadowMat = new THREE.MeshBasicMaterial({
            color: 0x18181b,
            transparent: true,
            opacity: 0.16
        });
        const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = -0.635;
        this.scene.add(shadowPlane);
    }

    buildMannequin() {
        this.mannequinGroup = new THREE.Group();

        // Материал портновского манекена (натуральное льняное полотно цвета экрю/овсянки)
        const linenMat = new THREE.MeshStandardMaterial({
            color: 0xc8bea8,
            roughness: 0.88,
            metalness: 0.02
        });

        // Материал чугунной стойки и деревянного трипода
        const standMat = new THREE.MeshStandardMaterial({
            color: 0x18181b,
            roughness: 0.40,
            metalness: 0.55
        });

        // Винтажная матовая латунь (навершие, зажимы)
        const brassMat = new THREE.MeshStandardMaterial({
            color: 0xc89b3c,
            roughness: 0.35,
            metalness: 0.75
        });

        // Конструктивная тесьма ателье (черная/графитовая лента)
        const seamTapeMat = new THREE.LineBasicMaterial({
            color: 0x52525b,
            transparent: true,
            opacity: 0.65
        });

        // 1. Подставка манекена
        // Утяжеленное фигурное чугунное основание
        const baseGeo = new THREE.CylinderGeometry(0.26, 0.30, 0.04, 32);
        const baseMesh = new THREE.Mesh(baseGeo, standMat);
        baseMesh.position.y = -0.62;
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        this.mannequinGroup.add(baseMesh);

        // Нижняя декоративная муфта
        const collarGeo = new THREE.CylinderGeometry(0.045, 0.065, 0.06, 24);
        const collarMesh = new THREE.Mesh(collarGeo, brassMat);
        collarMesh.position.y = -0.57;
        this.mannequinGroup.add(collarMesh);

        // Вертикальная центральная стойка
        const poleGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.45, 16);
        const poleMesh = new THREE.Mesh(poleGeo, standMat);
        poleMesh.position.y = 0.10;
        poleMesh.castShadow = true;
        this.mannequinGroup.add(poleMesh);

        // 2. Анатомический торс манекена
        const torsoPoints = [];
        TORSO_PROFILE.forEach(p => {
            if (p.y >= 0.06) {
                torsoPoints.push(new THREE.Vector2(p.r, p.y));
            }
        });

        const torsoGeo = new THREE.LatheGeometry(torsoPoints, 48);
        const torsoMesh = new THREE.Mesh(torsoGeo, linenMat);
        torsoMesh.castShadow = true;
        torsoMesh.receiveShadow = true;
        this.mannequinGroup.add(torsoMesh);

        // 3. Анатомические ноги манекена (для оценки длины юбок: мини, миди, макси)
        const legGeo = new THREE.CylinderGeometry(0.082, 0.052, 0.72, 24);
        const leftLeg = new THREE.Mesh(legGeo, linenMat);
        leftLeg.position.set(-0.11, -0.28, 0);
        leftLeg.castShadow = true;
        this.mannequinGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeo, linenMat);
        rightLeg.position.set(0.11, -0.28, 0);
        rightLeg.castShadow = true;
        this.mannequinGroup.add(rightLeg);

        // 4. Латунное навершие шеи
        const neckCapGeo = new THREE.CylinderGeometry(0.075, 0.092, 0.035, 32);
        const neckCap = new THREE.Mesh(neckCapGeo, brassMat);
        neckCap.position.y = 1.37;
        this.mannequinGroup.add(neckCap);

        const finialGeo = new THREE.SphereGeometry(0.034, 24, 24);
        const finial = new THREE.Mesh(finialGeo, brassMat);
        finial.position.y = 1.405;
        this.mannequinGroup.add(finial);

        // 5. Конструктивные линии ателье (тесьма талии, бедер и центральный шов)
        // Линия талии (y = 0.65)
        const waistPts = [];
        for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.15) {
            waistPts.push(new THREE.Vector3(Math.cos(a) * 0.187, 0.65, Math.sin(a) * 0.187));
        }
        const waistLineGeo = new THREE.BufferGeometry().setFromPoints(waistPts);
        const waistLine = new THREE.Line(waistLineGeo, seamTapeMat);
        this.mannequinGroup.add(waistLine);

        // Линия бедер (y = 0.28)
        const hipPts = [];
        for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.15) {
            hipPts.push(new THREE.Vector3(Math.cos(a) * 0.260, 0.28, Math.sin(a) * 0.260));
        }
        const hipLineGeo = new THREE.BufferGeometry().setFromPoints(hipPts);
        const hipLine = new THREE.Line(hipLineGeo, seamTapeMat);
        this.mannequinGroup.add(hipLine);

        // Вертикальный шов середины переда
        const cfPts = [];
        for (let y = 0.14; y <= 1.28; y += 0.04) {
            const r = getTorsoRadius(y) + 0.001;
            cfPts.push(new THREE.Vector3(0, y, r));
        }
        const cfLineGeo = new THREE.BufferGeometry().setFromPoints(cfPts);
        const cfLine = new THREE.Line(cfLineGeo, seamTapeMat);
        this.mannequinGroup.add(cfLine);

        this.scene.add(this.mannequinGroup);
    }

    // Обновление одежды на манекене в реальном времени
    updateGarment(st) {
        if (!this.scene) return;

        const stateObj = st || (window.state || {});
        const garmentType = stateObj.garmentType || 'skirt';

        // Удаляем предыдущую одежду
        if (this.garmentGroup) {
            this.scene.remove(this.garmentGroup);
            this.disposeGroup(this.garmentGroup);
            this.garmentGroup = null;
        }

        this.garmentGroup = new THREE.Group();

        if (garmentType === 'skirt') {
            this.buildSkirtMesh(stateObj, this.garmentGroup);
        } else if (garmentType === 'panties') {
            this.buildPantiesMesh(stateObj, this.garmentGroup);
        } else {
            this.buildDressMesh(stateObj, this.garmentGroup);
        }

        this.scene.add(this.garmentGroup);
        this.updateTagBadge(stateObj);
    }

    // Освобождение памяти геометрий и материалов
    disposeGroup(group) {
        if (!group) return;
        group.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }

    // --- 1. ПАРАМЕТРИЧЕСКАЯ ЮБКА ---
    buildSkirtMesh(st, targetGroup) {
        const style = st.skirtStyle || 'mini-trapeze';
        const lengthCm = Number(st.skirtLength) || 45;
        const rise = st.skirtRise || 'mid';

        // Высота пояса в координатах манекена
        let waistY = 0.65;
        if (rise === 'high') waistY = 0.70;
        if (rise === 'low') waistY = 0.54;

        // Расчет длины юбки: 60 см = ~0.65 единиц Three.js
        const skirtLengthUnits = Math.max(0.18, Math.min(1.10, (lengthCm / 60) * 0.65));
        const hemY = waistY - skirtLengthUnits;

        // Построение замкнутой сетки полотнища юбки
        const rings = 28;
        const segments = 48;
        const indices = [];
        const vertices = [];
        const uvs = [];

        // Палитра тканей в зависимости от фасона (яркий, выразительный контраст с бежевым манекеном)
        let fabricColor = 0x1e293b; // полуночный графит / деним
        let roughness = 0.65;

        if (style === 'mini-pleated') {
            fabricColor = 0x1e1b4b; // глубокий темный индиго
        } else if (style === 'mini-wrap') {
            fabricColor = 0x9a3412; // терракотовый твил
        } else if (style === 'mini-slit') {
            fabricColor = 0x881337; // благородный бордо
        } else if (style === 'mini-skater' || style === 'half-sun') {
            fabricColor = 0x4338ca; // сапфировый
        } else if (style === 'sun') {
            fabricColor = 0x0f766e; // изумрудный
        } else if (style === 'mini-micro') {
            fabricColor = 0x2563eb; // Y2K кобальт
        } else if (style === 'pencil') {
            fabricColor = 0x27272a; // строгий графит
        }

        const hipY = 0.28;

        for (let i = 0; i <= rings; i++) {
            const t = i / rings; // 0 вверху (талия), 1 внизу (подол)
            const y = waistY - t * skirtLengthUnits;

            // Расчет радиуса на текущей высоте с гарантированным запасом над телом
            let baseR = getTorsoRadius(y, st) + 0.016;

            if (y < hipY) {
                const distBelowHip = hipY - y;
                const hipR = getTorsoRadius(hipY, st) + 0.018;

                if (style === 'pencil') {
                    // Заужение к коленям
                    baseR = Math.max(0.14, hipR - distBelowHip * 0.16);
                } else if (style === 'straight') {
                    baseR = hipR;
                } else if (style === 'mini-pleated') {
                    baseR = hipR + distBelowHip * 0.55;
                } else if (style === 'half-sun' || style === 'mini-skater') {
                    baseR = hipR + distBelowHip * 0.85;
                } else if (style === 'sun') {
                    baseR = hipR + distBelowHip * 1.35;
                } else if (style === 'mini-micro') {
                    baseR = hipR + distBelowHip * 0.22;
                } else {
                    // А-силуэт / трапеция
                    baseR = hipR + distBelowHip * 0.40;
                }
            }

            for (let j = 0; j <= segments; j++) {
                const u = j / segments;
                const angle = u * Math.PI * 2;

                let r = baseR;

                // Фактурные складки и волны для специфических фасонов
                if (style === 'mini-pleated') {
                    // Четкие плиссированные складки
                    const pleatWave = Math.sin(angle * 22) * 0.014 * t;
                    r += pleatWave;
                } else if (style === 'half-sun' || style === 'sun' || style === 'mini-skater') {
                    // Мягкие струящиеся фалды
                    const foldWave = Math.sin(angle * 6) * 0.022 * t;
                    r += foldWave;
                } else if (style === 'mini-wrap' && j < 12) {
                    // Нахлест полотнища с запахом спереди
                    r += 0.008 * (1 - j / 12);
                }

                const vx = Math.sin(angle) * r;
                const vz = Math.cos(angle) * r;
                vertices.push(vx, y, vz);
                uvs.push(u, t);
            }
        }

        // Построение полигонов (индексов)
        for (let i = 0; i < rings; i++) {
            for (let j = 0; j < segments; j++) {
                const a = i * (segments + 1) + j;
                const b = (i + 1) * (segments + 1) + j;
                const c = (i + 1) * (segments + 1) + (j + 1);
                const d = i * (segments + 1) + (j + 1);

                // Если фасон с разрезом (mini-slit), открываем разрез на левом бедре
                if (style === 'mini-slit' && i > rings * 0.35 && j >= 34 && j <= 36) {
                    continue;
                }

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        const skirtGeo = new THREE.BufferGeometry();
        skirtGeo.setIndex(indices);
        skirtGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        skirtGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        skirtGeo.computeVertexNormals();

        const skirtMat = new THREE.MeshStandardMaterial({
            color: fabricColor,
            roughness: roughness,
            metalness: 0.10,
            side: THREE.DoubleSide
        });

        const skirtMesh = new THREE.Mesh(skirtGeo, skirtMat);
        skirtMesh.castShadow = true;
        skirtMesh.receiveShadow = true;
        targetGroup.add(skirtMesh);

        // 3D Притачной пояс юбки
        const beltR = getTorsoRadius(waistY, st) + 0.020;
        const beltGeo = new THREE.CylinderGeometry(beltR, beltR, 0.045, segments, 1, true);
        const beltMat = new THREE.MeshStandardMaterial({
            color: 0x09090b,
            roughness: 0.45,
            metalness: 0.25,
            side: THREE.DoubleSide
        });
        const beltMesh = new THREE.Mesh(beltGeo, beltMat);
        beltMesh.position.y = waistY + 0.022;
        targetGroup.add(beltMesh);

        // Пряжка / пуговицы на поясе
        const buttonGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.006, 16);
        const buttonMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
        const btn1 = new THREE.Mesh(buttonGeo, buttonMat);
        btn1.rotation.x = Math.PI / 2;
        btn1.position.set(0, waistY + 0.022, beltR + 0.004);
        targetGroup.add(btn1);
    }

    // --- 2. ПАРАМЕТРИЧЕСКИЕ ТРУСИКИ / БЕЛЬЕ ---
    buildPantiesMesh(st, targetGroup) {
        const model = st.pantiesModel || 'slips';
        const rise = st.pantiesRise || 'mid';
        const legCut = st.pantiesLegCut || 'classic';

        // Посадка по талии
        let waistY = 0.58;
        if (rise === 'high') waistY = 0.67;
        if (rise === 'low') waistY = 0.48;

        const crotchY = 0.08;
        const rings = 20;
        const segments = 44;
        const vertices = [];
        const indices = [];
        const uvs = [];

        // Цвет белья
        let color = 0x18181b; // соблазнительный черный
        if (model === 'braziliana') color = 0x9f1239; // роковой бордовый
        if (model === 'dolphin-shorts') color = 0x059669; // ретро-изумруд
        if (model === 'strappy') color = 0xbe123c; // рубиновый

        for (let i = 0; i <= rings; i++) {
            const t = i / rings;
            const y = waistY - t * (waistY - crotchY);
            const baseR = getTorsoRadius(y, st) + 0.008;

            for (let j = 0; j <= segments; j++) {
                const u = j / segments;
                const angle = u * Math.PI * 2;
                const isSide = Math.abs(Math.sin(angle)) > 0.70;
                const isBack = Math.cos(angle) < -0.20;

                let r = baseR;
                let activeY = y;

                // Моделирование вырезов под модель
                if (model === 'dolphin-shorts') {
                    // Шортики свободнее
                    r += 0.012;
                } else if (model === 'thong' && isBack && t > 0.3) {
                    // Стринги: сужение задней планки
                    r = baseR * 0.4;
                } else if (model === 'braziliana' && isBack && t > 0.35) {
                    // V-вырез бразилиана
                    r = baseR * 0.75;
                }

                // Высокий вырез ноги на бедрах
                if (isSide && legCut === 'high' && t > 0.4 && t < 0.85) {
                    activeY += 0.035 * Math.sin((t - 0.4) / 0.45 * Math.PI);
                }

                const vx = Math.sin(angle) * r;
                const vz = Math.cos(angle) * r;
                vertices.push(vx, activeY, vz);
                uvs.push(u, t);
            }
        }

        for (let i = 0; i < rings; i++) {
            for (let j = 0; j < segments; j++) {
                const a = i * (segments + 1) + j;
                const b = (i + 1) * (segments + 1) + j;
                const c = (i + 1) * (segments + 1) + (j + 1);
                const d = i * (segments + 1) + (j + 1);

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setIndex(indices);
        geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geo.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.55,
            metalness: 0.15,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        targetGroup.add(mesh);

        // Эластичный поясок
        const bandR = getTorsoRadius(waistY, st) + 0.012;
        const bandGeo = new THREE.CylinderGeometry(bandR, bandR, 0.022, segments, 1, true);
        const bandMat = new THREE.MeshStandardMaterial({
            color: model === 'dolphin-shorts' ? 0xffffff : 0x09090b,
            roughness: 0.4,
            side: THREE.DoubleSide
        });
        const bandMesh = new THREE.Mesh(bandGeo, bandMat);
        bandMesh.position.y = waistY + 0.011;
        targetGroup.add(bandMesh);

        // Дополнительные стрепы для модели strappy
        if (model === 'strappy') {
            const strapR = bandR + 0.005;
            const strapGeo = new THREE.CylinderGeometry(strapR, strapR, 0.012, segments, 1, true);
            const strapMesh = new THREE.Mesh(strapGeo, bandMat);
            strapMesh.position.y = waistY + 0.045;
            targetGroup.add(strapMesh);
        }
    }

    // --- 3. ПАРАМЕТРИЧЕСКОЕ ПЛАТЬЕ / ТОП ---
    buildDressMesh(st, targetGroup) {
        const neckline = st.necklineType || 'round';
        const dart = st.dartPosition || 'shoulder';
        const hemY = 0.32; // топ / платье до середины бедер

        const rings = 28;
        const segments = 48;
        const vertices = [];
        const indices = [];
        const uvs = [];

        // Определение глубины выреза спереди
        let frontDrop = 0.08; // round
        if (neckline === 'v-neck') frontDrop = 0.18;
        if (neckline === 'deep-v') frontDrop = 0.30;
        if (neckline === 'boat') frontDrop = 0.04;
        if (neckline === 'square') frontDrop = 0.13;
        if (neckline === 'keyhole') frontDrop = 0.10;

        for (let j = 0; j <= segments; j++) {
            const u = j / segments;
            const angle = u * Math.PI * 2;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            // Плавная линия горловины: сзади (cosA <= 0) = 1.23, спереди (cosA > 0) опускается
            let topEdgeY = 1.23;
            if (cosA > 0) {
                topEdgeY = 1.23 - frontDrop * Math.pow(cosA, 1.3);
            }

            for (let i = 0; i <= rings; i++) {
                const t = i / rings;
                const y = topEdgeY - t * (topEdgeY - hemY);
                const r = getTorsoRadius(y, st) + 0.013;

                const vx = sinA * r;
                const vz = cosA * r;
                vertices.push(vx, y, vz);
                uvs.push(u, t);
            }
        }

        // Построение сетки индексов
        for (let j = 0; j < segments; j++) {
            for (let i = 0; i < rings; i++) {
                const a = j * (rings + 1) + i;
                const b = (j + 1) * (rings + 1) + i;
                const c = (j + 1) * (rings + 1) + (i + 1);
                const d = j * (rings + 1) + (i + 1);

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setIndex(indices);
        geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geo.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
            color: 0x312e81, // королевский сапфир
            roughness: 0.58,
            metalness: 0.12,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        targetGroup.add(mesh);

        // Линия вытачки (контрастный портновский шов)
        const dartColor = 0xf43f5e;
        const dartMat = new THREE.LineBasicMaterial({ color: dartColor, linewidth: 2 });
        const dartPts = [];

        if (dart === 'side') {
            // Французская вытачка из бокового шва под проймой
            dartPts.push(new THREE.Vector3(0.22, 0.86, 0.12));
            dartPts.push(new THREE.Vector3(0.11, 0.94, 0.23));
        } else if (dart === 'waist') {
            // В талию
            dartPts.push(new THREE.Vector3(0.09, 0.66, 0.19));
            dartPts.push(new THREE.Vector3(0.10, 0.93, 0.23));
        } else if (dart === 'armhole') {
            // В пройму
            dartPts.push(new THREE.Vector3(0.18, 1.05, 0.14));
            dartPts.push(new THREE.Vector3(0.11, 0.95, 0.23));
        } else {
            // В плечо
            dartPts.push(new THREE.Vector3(0.14, 1.20, 0.12));
            dartPts.push(new THREE.Vector3(0.10, 0.94, 0.23));
        }
        const dartGeo = new THREE.BufferGeometry().setFromPoints(dartPts);
        const dartLine = new THREE.Line(dartGeo, dartMat);
        targetGroup.add(dartLine);
    }

    // Обновление текстового бейджа под манекеном
    updateTagBadge(st) {
        const tag = document.getElementById('mannequin-style-tag');
        if (!tag) return;

        const garmentType = st.garmentType || 'skirt';
        if (garmentType === 'skirt') {
            const style = st.skirtStyle || 'mini-trapeze';
            const len = st.skirtLength || 45;
            tag.textContent = `Юбка: ${len} см (${style})`;
        } else if (garmentType === 'panties') {
            const model = st.pantiesModel || 'slips';
            const rise = st.pantiesRise === 'high' ? 'высокая' : (st.pantiesRise === 'low' ? 'низкая' : 'средняя');
            tag.textContent = `Белье: ${model} (${rise})`;
        } else {
            const dart = st.dartPosition || 'shoulder';
            tag.textContent = `Платье / Топ: вытачка ${dart}`;
        }
    }

    // Поворот камеры на предустановленные углы
    setViewAngle(angleDeg) {
        if (!this.controls) return;
        const rad = (angleDeg * Math.PI) / 180;
        const dist = 3.25;
        this.camera.position.x = Math.sin(rad) * dist;
        this.camera.position.z = Math.cos(rad) * dist;
        this.camera.position.y = 0.85;
        this.controls.update();
    }

    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
        if (this.controls) {
            this.controls.autoRotate = this.autoRotate;
            this.controls.autoRotateSpeed = 2.0;
        }
        return this.autoRotate;
    }

    onResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (width === 0 || height === 0) return;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        this.animId = requestAnimationFrame(this.animate);
        if (this.controls) this.controls.update();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Глобальный экземпляр
window.mannequinInstance = null;

function initMannequin() {
    if (!document.getElementById('mannequin-3d-canvas-box')) return;
    if (!window.mannequinInstance) {
        window.mannequinInstance = new StudioMannequin('mannequin-3d-canvas-box');
    }
}

function update3DMannequin() {
    if (window.mannequinInstance && typeof window.mannequinInstance.updateGarment === 'function') {
        const curState = (typeof state !== 'undefined') ? state : (window.state || {});
        window.mannequinInstance.updateGarment(curState);
    }
}
