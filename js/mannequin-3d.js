// js/mannequin-3d.js — Интерактивный 3D-манекен портновского ателье на Three.js
// Отображает фигуру и параметрическую одежду, мгновенно реагируя на изменение длины, посадки и фасона

class StudioMannequin {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.mannequinGroup = null;
        this.garmentMesh = null;
        this.autoRotate = false;
        this.animId = null;

        this.init();
    }

    init() {
        if (typeof THREE === 'undefined') {
            console.warn('Three.js не загружен, повторная попытка через 500мс');
            setTimeout(() => this.init(), 500);
            return;
        }

        const width = this.container.clientWidth || 360;
        const height = this.container.clientHeight || 480;

        // 1. Сцена и камера
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xfbfbfa);

        this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
        this.camera.position.set(0, 0.9, 3.4);

        // 2. Рендерер с мягким антиалиасингом
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // 3. Управление камерой (OrbitControls)
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.06;
            this.controls.minDistance = 1.8;
            this.controls.maxDistance = 5.2;
            this.controls.maxPolarAngle = Math.PI / 2 + 0.15;
            this.controls.target.set(0, 0.75, 0);
            this.controls.update();
        }

        // 4. Студийное освещение
        this.setupLights();

        // 5. Построение манекена и подставки
        this.buildMannequin();

        // 6. Построение начальной одежды
        this.updateGarment(window.state || {});

        // 7. Анимационный цикл
        this.animate = this.animate.bind(this);
        this.animate();

        // 8. Ресайз
        window.addEventListener('resize', () => this.onResize());
    }

    setupLights() {
        // Мягкий полусферический свет студии
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.85);
        hemiLight.position.set(0, 10, 0);
        this.scene.add(hemiLight);

        // Основной рисующий студийный свет
        const keyLight = new THREE.DirectionalLight(0xfff8f0, 0.95);
        keyLight.position.set(2.5, 4, 3.5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.bias = -0.001;
        this.scene.add(keyLight);

        // Заполняющий контровой свет
        const rimLight = new THREE.DirectionalLight(0xdbeafe, 0.5);
        rimLight.position.set(-3, 2, -3);
        this.scene.add(rimLight);

        // Мягкая подсветка спереди снизу
        const bounceLight = new THREE.DirectionalLight(0xffffff, 0.25);
        bounceLight.position.set(0, -2, 2);
        this.scene.add(bounceLight);

        // Тень на полу (круглый подиум)
        const shadowPlaneGeo = new THREE.CircleGeometry(0.85, 32);
        const shadowPlaneMat = new THREE.MeshBasicMaterial({
            color: 0xe2e8f0,
            transparent: true,
            opacity: 0.55
        });
        const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = -0.65;
        this.scene.add(shadowPlane);
    }

    buildMannequin() {
        this.mannequinGroup = new THREE.Group();

        // Материал портновского манекена (текстурированная ткань цвета слоновой кости)
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0xf5f3ee,
            roughness: 0.65,
            metalness: 0.05
        });

        // Материал стойки (матовый темный металл / дерево)
        const standMat = new THREE.MeshStandardMaterial({
            color: 0x27272a,
            roughness: 0.35,
            metalness: 0.6
        });

        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            roughness: 0.3,
            metalness: 0.8
        });

        // 1. Стойка манекена
        // Основание (круглый блин на полу)
        const baseGeo = new THREE.CylinderGeometry(0.28, 0.30, 0.03, 32);
        const baseMesh = new THREE.Mesh(baseGeo, standMat);
        baseMesh.position.y = -0.63;
        baseMesh.receiveShadow = true;
        this.mannequinGroup.add(baseMesh);

        // Вертикальный шток
        const poleGeo = new THREE.CylinderGeometry(0.018, 0.018, 1.35, 16);
        const poleMesh = new THREE.Mesh(poleGeo, standMat);
        poleMesh.position.y = 0.05;
        this.mannequinGroup.add(poleMesh);

        // 2. Анатомический торс манекена (LatheGeometry)
        // Точки профиля женской фигуры от бедер до шеи (в сантиметрах/метрах)
        const points = [];
        // Формат: (radius, y)
        points.push(new THREE.Vector2(0.05, 0.05));   // Низ торса
        points.push(new THREE.Vector2(0.22, 0.12));   // Нижняя часть бедер
        points.push(new THREE.Vector2(0.255, 0.28));  // Выступающая линия бедер (Об)
        points.push(new THREE.Vector2(0.24, 0.45));   // Высокие бедра
        points.push(new THREE.Vector2(0.185, 0.65));  // Анатомическая талия (От)
        points.push(new THREE.Vector2(0.205, 0.80));  // Под грудью
        points.push(new THREE.Vector2(0.245, 0.96));  // Выступающая линия груди (Ог)
        points.push(new THREE.Vector2(0.21, 1.12));   // Ключицы
        points.push(new THREE.Vector2(0.19, 1.22));   // Плечи/основание шеи
        points.push(new THREE.Vector2(0.095, 1.28));  // Шея
        points.push(new THREE.Vector2(0.09, 1.36));   // Верх шеи
        points.push(new THREE.Vector2(0.02, 1.37));   // Верхняя крышка

        const torsoGeo = new THREE.LatheGeometry(points, 48);
        const torsoMesh = new THREE.Mesh(torsoGeo, bodyMat);
        torsoMesh.castShadow = true;
        torsoMesh.receiveShadow = true;
        this.mannequinGroup.add(torsoMesh);

        // Верхний декоративный набалдашник (латунь/золото)
        const capGeo = new THREE.CylinderGeometry(0.075, 0.095, 0.04, 32);
        const capMesh = new THREE.Mesh(capGeo, goldMat);
        capMesh.position.y = 1.37;
        this.mannequinGroup.add(capMesh);

        const finialGeo = new THREE.SphereGeometry(0.035, 24, 24);
        const finialMesh = new THREE.Mesh(finialGeo, goldMat);
        finialMesh.position.y = 1.41;
        this.mannequinGroup.add(finialMesh);

        // Конструктивные линии ателье (тонкие контрастные линии на манекене)
        const lineMat = new THREE.LineBasicMaterial({ color: 0xa1a1aa, transparent: true, opacity: 0.6 });
        
        // Линия талии
        const waistRingGeo = new THREE.BufferGeometry().setFromPoints(
            new THREE.Path().absarc(0, 0, 0.188, 0, Math.PI * 2, true).getPoints(48)
        );
        const waistLine = new THREE.LineLoop(waistRingGeo, lineMat);
        waistLine.rotation.x = Math.PI / 2;
        waistLine.position.y = 0.65;
        this.mannequinGroup.add(waistLine);

        // Линия бедер
        const hipRingGeo = new THREE.BufferGeometry().setFromPoints(
            new THREE.Path().absarc(0, 0, 0.258, 0, Math.PI * 2, true).getPoints(48)
        );
        const hipLine = new THREE.LineLoop(hipRingGeo, lineMat);
        hipLine.rotation.x = Math.PI / 2;
        hipLine.position.y = 0.28;
        this.mannequinGroup.add(hipLine);

        // Добавляем ноги-подставки для наглядности длины юбок
        const legMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.7 });
        const leftLegGeo = new THREE.CylinderGeometry(0.08, 0.055, 0.85, 24);
        const leftLeg = new THREE.Mesh(leftLegGeo, legMat);
        leftLeg.position.set(-0.11, -0.32, 0);
        this.mannequinGroup.add(leftLeg);

        const rightLegGeo = new THREE.CylinderGeometry(0.08, 0.055, 0.85, 24);
        const rightLeg = new THREE.Mesh(rightLegGeo, legMat);
        rightLeg.position.set(0.11, -0.32, 0);
        this.mannequinGroup.add(rightLeg);

        this.scene.add(this.mannequinGroup);
    }

    // Обновление параметрической одежды на манекене
    updateGarment(st) {
        if (!this.scene) return;

        // Удаляем предыдущую одежду
        if (this.garmentMesh) {
            this.scene.remove(this.garmentMesh);
            if (this.garmentMesh.geometry) this.garmentMesh.geometry.dispose();
            this.garmentMesh = null;
        }

        const garmentType = st.garmentType || 'skirt';

        if (garmentType === 'skirt') {
            this.buildSkirtMesh(st);
        } else if (garmentType === 'panties') {
            this.buildPantiesMesh(st);
        } else {
            this.buildDressMesh(st);
        }
    }

    buildSkirtMesh(st) {
        const style = st.skirtStyle || 'mini-trapeze';
        const lengthCm = Number(st.skirtLength) || 45;
        const rise = st.skirtRise || 'mid';

        // Расчет вертикальных координат по пропорциям манекена
        // Талия манекена = 0.65, линия бедер = 0.28
        let waistY = 0.65;
        if (rise === 'high') waistY = 0.68;
        if (rise === 'low') waistY = 0.52;

        // 1 см на выкройке = ~0.015 единиц манекена
        const lengthUnits = Math.min(1.15, Math.max(0.20, (lengthCm / 60) * 0.65));
        const hemY = waistY - lengthUnits;

        // Радиусы верха и низа
        const topRadius = (rise === 'low') ? 0.225 : 0.195;
        let bottomRadius = topRadius * 1.35; // базовая трапеция

        // Поправки радиуса подола под фасон
        if (style === 'pencil' || style === 'mini-micro') {
            bottomRadius = topRadius * 1.05; // зауженная
        } else if (style === 'straight') {
            bottomRadius = topRadius * 1.12; // прямая
        } else if (style === 'half-sun' || style === 'mini-skater') {
            bottomRadius = topRadius * 2.1; // расклешенная
        } else if (style === 'sun') {
            bottomRadius = topRadius * 2.8; // солнце
        } else if (style === 'mini-pleated') {
            bottomRadius = topRadius * 1.6; // плиссе
        } else {
            bottomRadius = topRadius * 1.42; // А-силуэт
        }

        // Построение полигонального конуса юбки с небольшими мягкими складками ткани
        const segments = 48;
        const skirtGeo = new THREE.CylinderGeometry(
            topRadius,
            bottomRadius,
            lengthUnits,
            segments,
            8,
            true
        );

        // Смещение вершин для естественного провисания ткани и складок
        const pos = skirtGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const y = pos.getY(i);
            const factor = (lengthUnits / 2 - y) / lengthUnits; // 0 сверху, 1 снизу

            if (style === 'mini-pleated') {
                // Плиссированные складки
                const angle = Math.atan2(pos.getZ(i), pos.getX(i));
                const wave = Math.sin(angle * 18) * 0.014 * factor;
                pos.setX(i, pos.getX(i) + wave * Math.cos(angle));
                pos.setZ(i, pos.getZ(i) + wave * Math.sin(angle));
            } else if (style === 'half-sun' || style === 'sun' || style === 'mini-skater') {
                // Мягкие волны фалд
                const angle = Math.atan2(pos.getZ(i), pos.getX(i));
                const wave = Math.sin(angle * 6) * 0.022 * factor;
                pos.setX(i, pos.getX(i) + wave * Math.cos(angle));
                pos.setZ(i, pos.getZ(i) + wave * Math.sin(angle));
            }
        }
        skirtGeo.computeVertexNormals();

        // Премиальный материал ткани (графитовый бархат / костюмный твил)
        const skirtMat = new THREE.MeshStandardMaterial({
            color: 0x27272a, // графит/обсидиан
            roughness: 0.55,
            metalness: 0.1,
            side: THREE.DoubleSide
        });

        const skirtMesh = new THREE.Mesh(skirtGeo, skirtMat);
        skirtMesh.position.y = waistY - lengthUnits / 2;
        skirtMesh.castShadow = true;

        // Добавляем акцентный пояс
        const beltGeo = new THREE.CylinderGeometry(topRadius + 0.003, topRadius + 0.002, 0.045, segments, 1, true);
        const beltMat = new THREE.MeshStandardMaterial({
            color: 0x18181b,
            roughness: 0.4,
            metalness: 0.2,
            side: THREE.DoubleSide
        });
        const beltMesh = new THREE.Mesh(beltGeo, beltMat);
        beltMesh.position.y = waistY - 0.022;

        const group = new THREE.Group();
        group.add(skirtMesh);
        group.add(beltMesh);

        this.garmentMesh = group;
        this.scene.add(this.garmentMesh);
    }

    buildPantiesMesh(st) {
        const model = st.pantiesModel || 'slips';
        const rise = st.pantiesRise || 'mid';

        let waistY = 0.56;
        if (rise === 'high') waistY = 0.65;
        if (rise === 'low') waistY = 0.46;

        const height = (waistY - 0.18);
        const radiusTop = (rise === 'high') ? 0.19 : 0.235;
        const radiusBottom = (model === 'thong') ? 0.10 : 0.16;

        const pantiesGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 36, 4, true);
        const pantiesMat = new THREE.MeshStandardMaterial({
            color: 0x3f3f46,
            roughness: 0.5,
            side: THREE.DoubleSide
        });

        const group = new THREE.Group();
        const pMesh = new THREE.Mesh(pantiesGeo, pantiesMat);
        pMesh.position.y = waistY - height / 2;
        group.add(pMesh);

        this.garmentMesh = group;
        this.scene.add(this.garmentMesh);
    }

    buildDressMesh(st) {
        // Топ/платье на торс
        const topRadius = 0.21;
        const waistRadius = 0.19;
        const geo = new THREE.CylinderGeometry(topRadius, waistRadius, 0.52, 36, 4, true);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x312e81, // благородный индиго
            roughness: 0.5,
            side: THREE.DoubleSide
        });

        const group = new THREE.Group();
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 0.90;
        group.add(mesh);

        this.garmentMesh = group;
        this.scene.add(this.garmentMesh);
    }

    // Поворот камеры на предустановленные углы
    setViewAngle(angleDeg) {
        if (!this.controls) return;
        const rad = (angleDeg * Math.PI) / 180;
        const dist = 3.4;
        this.camera.position.x = Math.sin(rad) * dist;
        this.camera.position.z = Math.cos(rad) * dist;
        this.camera.position.y = 0.9;
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
        window.mannequinInstance.updateGarment(window.state || {});
    }
}
