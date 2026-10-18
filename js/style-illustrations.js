// js/style-illustrations.js - Каталог фасонов, фэшн-иллюстрации и векторные эскизы
// Содержит подробные данные о каждом фасоне: силуэт, расход, ткани, время пошива и превью

const STYLE_CATALOG = {
    skirt: [
        // --- МИНИ-ЮБКИ ---
        {
            id: 'mini-trapeze',
            name: 'Мини-трапеция',
            category: 'mini',
            badge: 'Хит',
            badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
            image: 'img/styles/skirt_mini_aline.jpg',
            recLength: 40,
            summary: 'Короткая юбка А-силуэта с идеальным балансом расклешения. Визуально удлиняет ноги и отлично держит форму.',
            fabrics: 'Плотный хлопок, твид, деним, вельвет, экокожа, костюмная шерсть',
            difficulty: 'Легко (для начинающих)',
            time: '1.5 – 2 часа',
            cutTip: 'Раскрой в сгиб ткани, переднее и заднее полотнища + пояс со сгибом',
            vectorType: 'mini-trapeze'
        },
        {
            id: 'mini-pleated',
            name: 'Теннисная плиссе',
            category: 'mini',
            badge: 'Тренд',
            badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            image: 'img/styles/skirt_mini_pleated.jpg',
            recLength: 38,
            summary: 'Стильная мини-юбка с кокеткой по бедрам и круговыми складками. Знаковый фасон preppy и теннисного стиля.',
            fabrics: 'Костюмная поливискоза с шерстью, габардин, хлопковый твил (ткани, хорошо держащие стрелки складок)',
            difficulty: 'Средняя (требуется аккуратная заутюжка)',
            time: '2.5 – 3 часа',
            cutTip: 'Кокетка по фигуре + широкая полоса ткани в складку (коэффициент 1:3)',
            vectorType: 'mini-pleated'
        },
        {
            id: 'mini-wrap',
            name: 'Мини с запахом',
            category: 'mini',
            badge: 'Модель 2026',
            badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
            image: 'img/styles/skirt_mini_wrap.jpg',
            recLength: 40,
            summary: 'Асимметричная мини-юбка с диагональным запахом и застежкой на пуговицы. Очень комфортна при ходьбе.',
            fabrics: 'Шерстяной твид, лен, плотный хлопок, микровельвет, замша',
            difficulty: 'Легко',
            time: '2 часа',
            cutTip: 'Переднее полотнище с увеличенным нахлестом +12 см',
            vectorType: 'mini-wrap'
        },
        {
            id: 'mini-slit',
            name: 'Мини с разрезом',
            category: 'mini',
            badge: 'Элегантно',
            badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
            image: null,
            recLength: 40,
            summary: 'Прямая короткая юбка с аккуратным вертикальным разрезом по ноге (8-10 см). Минимализм и женственность.',
            fabrics: 'Костюмная ткань, деним, экокожа, плотный трикотаж понте-рома',
            difficulty: 'Легко',
            time: '1.5 часа',
            cutTip: 'Разрез по вертикали передней вытачки с аккуратной закрепкой',
            vectorType: 'mini-slit'
        },
        {
            id: 'mini-skater',
            name: 'Мини-скейтер (клеш)',
            category: 'mini',
            badge: 'Легкий пошив',
            badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            image: null,
            recLength: 40,
            summary: 'Летящая короткая юбка-солнце с пышными фалдами. Кружащийся романтичный силуэт.',
            fabrics: 'Неопрен, хлопок, шелк, легкая шерсть, плательная вискоза',
            difficulty: 'Очень легко (без боковых вытачек)',
            time: '1 час',
            cutTip: 'Круговой раскрой без вытачек, пояс на резинке или притачной',
            vectorType: 'mini-skater'
        },
        {
            id: 'mini-laceup',
            name: 'Мини со шнуровкой',
            category: 'mini',
            badge: 'Акцент',
            badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
            image: null,
            recLength: 36,
            summary: 'Соблазнительный открытый боковой разрез с люверсами и перекрестной шнуровкой. Эффектная дизайнерская деталь.',
            fabrics: 'Плотный хлопковый твил, экокожа, деним, замша, костюмка с эластаном',
            difficulty: 'Легко',
            time: '1.5 часа',
            cutTip: 'Боковой шов с открытым вырезом под люверсы d=4мм или кулиску',
            vectorType: 'mini-laceup'
        },
        {
            id: 'mini-ruched',
            name: 'Мини с кулиской',
            category: 'mini',
            badge: 'Тренд',
            badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
            image: null,
            recLength: 38,
            summary: 'Облегающая юбка с боковой кулиской. Шнурками регулируется длина от 38 см до эффектного микро 28 см со сборкой.',
            fabrics: 'Эластичный трикотаж (рибана, лапша, масло, бифлекс), вискоза с эластаном',
            difficulty: 'Очень легко (без молний)',
            time: '1 час',
            cutTip: 'Раскрой из трикотажа, припуск 2.5 см на боковую кулиску со шнурком',
            vectorType: 'mini-ruched'
        },
        {
            id: 'mini-micro',
            name: 'Y2K микро-юбка',
            category: 'mini',
            badge: 'Микро 30 см',
            badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
            image: null,
            recLength: 30,
            summary: 'Ультракороткая прямая мини-юбка в эстетике 2000-х с низкой посадкой на косточках бедер.',
            fabrics: 'Деним, твид, вельвет, плотный хлопок, экокожа',
            difficulty: 'Легко',
            time: '1 час',
            cutTip: 'Длина 30 см, посадка на бедрах (low-rise)',
            vectorType: 'mini-micro'
        },

        // --- МИДИ И МАКСИ ---
        {
            id: 'a-line',
            name: 'Трапеция миди',
            category: 'midi',
            badge: 'База',
            badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
            image: null,
            recLength: 65,
            summary: 'Универсальная миди-юбка А-силуэта. Подходит для любого типа фигуры, скрывает бедра и подчеркивает талию.',
            fabrics: 'Лен, шерсть, деним, хлопок, вельвет',
            difficulty: 'Легко',
            time: '2 часа',
            cutTip: 'Расклешение +6.5 см по боковому срезу',
            vectorType: 'a-line'
        },
        {
            id: 'half-sun',
            name: 'Полусолнце',
            category: 'midi',
            badge: 'Хит',
            badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            image: null,
            recLength: 65,
            summary: 'Струящаяся юбка с мягкими складками, экономнее юбки-солнце по расходу ткани.',
            fabrics: 'Штапель, вискоза, плательная шерсть, шелк, лен',
            difficulty: 'Легко',
            time: '1.5 часа',
            cutTip: 'Раскрой по дуге 180 градусов, один или два шва',
            vectorType: 'half-sun'
        },
        {
            id: 'sun',
            name: 'Солнце (360°)',
            category: 'midi',
            badge: 'Праздничный',
            badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
            image: null,
            recLength: 65,
            summary: 'Максимально пышная юбка с волнами по всему кругу. Идеальна для танцев и вечерних образов.',
            fabrics: 'Шифон, тафта, шелк, фатин, тонкий хлопок',
            difficulty: 'Легко',
            time: '2 часа',
            cutTip: 'Круг 360 градусов, выравнивание подола на фигуре',
            vectorType: 'sun'
        },
        {
            id: 'pencil',
            name: 'Карандаш',
            category: 'midi',
            badge: 'Офис',
            badgeColor: 'bg-stone-100 text-stone-700 border-stone-200',
            image: null,
            recLength: 65,
            summary: 'Облегающая юбка с заужением книзу и шлицей сзади для свободы шага.',
            fabrics: 'Костюмная шерсть с эластаном, плотный твид, экокожа',
            difficulty: 'Средняя (обработка шлицы и потайной молнии)',
            time: '2.5 часа',
            cutTip: 'Заужение -3.2 см к низу, шлица 18-20 см сзади',
            vectorType: 'pencil'
        },
        {
            id: 'straight',
            name: 'Прямая классика',
            category: 'midi',
            badge: 'Основа',
            badgeColor: 'bg-stone-100 text-stone-700 border-stone-200',
            image: null,
            recLength: 60,
            summary: 'Базовая прямая юбка ЦНИИШП со шлицей сзади. Идеальная основа для любого гардероба.',
            fabrics: 'Любые костюмные и плательные ткани',
            difficulty: 'Легко',
            time: '2 часа',
            cutTip: 'Прямой боковой срез, вытачки 50/32/18%',
            vectorType: 'straight'
        },
        // --- СЦЕНИЧЕСКИЕ, СТРИМ И БУДУАРНЫЕ ДИЗАЙНЫ ---
        {
            id: 'wrap-micro-pleated',
            name: 'Микро с запахом и складками',
            category: 'mini',
            badge: 'Микро-плиссе',
            badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            image: null,
            recLength: 26,
            summary: 'Ультракороткая сценическая микро-юбка с запахом и мелкими складками (18–28 см). Идеальна для кадров сидя и активных движений.',
            fabrics: 'Костюмная поливискоза, габардин, хлопковый твил, шотландка',
            difficulty: 'Средняя',
            time: '2 часа',
            cutTip: 'Длина 24-28 см, мелкие складки плиссе 1.5-2 см и функциональный нахлест с запахом',
            vectorType: 'skirt-wrap-micro-pleated'
        },
        {
            id: 'double-high-slit',
            name: 'Юбка с двумя высокими разрезами',
            category: 'midi',
            badge: 'Двойной разрез',
            badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
            image: null,
            recLength: 75,
            summary: 'Вечерняя струящаяся юбка с двумя экстремально высокими разрезами по передним рельефам до линии бедер/талии. Полная свобода и выразительность в кадре.',
            fabrics: 'Шелковый атлас, вискоза, струящийся креп, тонкий трикотаж масло',
            difficulty: 'Легко',
            time: '1.5 – 2 часа',
            cutTip: 'Два разреза по вертикалям передних вытачек от талии/бедер с усиленной закрепкой',
            vectorType: 'skirt-double-high-slit'
        },
        {
            id: 'ruched-drawstring',
            name: 'Юбка с асимметричной кулиской',
            category: 'mini',
            badge: 'Драпировка',
            badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
            image: null,
            recLength: 42,
            summary: 'Асимметричная драпированная юбка с кулиской и шнурком. Регулирует посадку и создает объемную диагональную сборку с коэффициентом 1.6x.',
            fabrics: 'Бифлекс, вискозный трикотаж с эластаном, стрейч-сетка, тонкий сатин',
            difficulty: 'Легко',
            time: '1 час',
            cutTip: 'Припуск на вертикальную кулиску +3 см, шнур со стопорами или концевиками',
            vectorType: 'skirt-ruched-drawstring'
        },
        {
            id: 'booty-shorts',
            name: 'Микро-шорты с вырезом ягодиц',
            category: 'mini',
            badge: 'Booty Cut',
            badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
            image: null,
            recLength: 22,
            summary: 'Экстремально короткие шорты с высокой фигурной дугой задней половинки, подчеркивающей контур ягодиц. Комфортная посадка без пережимания.',
            fabrics: 'Эластичный деним стрейч, бифлекс, плотный рубчик, хлопок с эластаном',
            difficulty: 'Легко',
            time: '1 – 1.5 часа',
            cutTip: 'Высокая подрезка задней половинки, отделка эластичным кантом или подгибкой',
            vectorType: 'skirt-booty-shorts'
        },
        {
            id: 'garter-peplum',
            name: 'Пояс-баска с пажами для чулок',
            category: 'mini',
            badge: 'Пажи для чулок',
            badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
            image: null,
            recLength: 16,
            summary: 'Будуарный пояс-баска длиной 12–16 см с 4–6 регулируемыми пажами (подвязками) для чулок с клипсами. Эффектный акцент на талию и бедра.',
            fabrics: 'Корсетный жаккард, плотная экокожа, бархат, эластичная кордовая сетка',
            difficulty: 'Средняя',
            time: '1.5 часа',
            cutTip: 'Баска 14 см, 4-6 эластичных лент 20 мм с регуляторами и металлическими клипсами',
            vectorType: 'skirt-garter-peplum'
        }
    ],

    panties: [
        {
            id: 'slips',
            name: 'Слипы',
            badge: 'База',
            badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            image: null,
            summary: 'Самый удобный анатомический фасон на каждый день. Закрытая спинка и комфортный вырез по ноге.',
            fabrics: 'Кулирная гладь с лайкрой (95% хлопок, 5% эластан), микрофибра, модал',
            difficulty: 'Очень легко',
            time: '30 минут',
            cutTip: 'Расход 30-35 см ткани, шьется эластичным зигзагом или оверлоком',
            vectorType: 'panties-slips'
        },
        {
            id: 'braziliana',
            name: 'Бразилиана',
            badge: 'Хит',
            badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
            image: null,
            summary: 'Кокетливый фасон с соблазнительным V-образным вырезом сзади, открывающим половину ягодиц.',
            fabrics: 'Эластичное кружево, микрофибра, шелковый трикотаж',
            difficulty: 'Легко',
            time: '30 минут',
            cutTip: 'Спинка со сгибом или со швом для красивой отделки кружевом',
            vectorType: 'panties-braziliana'
        },
        {
            id: 'high-waist',
            name: 'Высокие ретро',
            badge: 'Тренд',
            badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
            image: null,
            summary: 'Винтажный силуэт с посадкой до талии/пупка. Эффектно моделирует фигуру и поддерживает живот.',
            fabrics: 'Утягивающий трикотаж, плотный хлопковый трикотаж, кружево',
            difficulty: 'Легко',
            time: '40 минут',
            cutTip: 'Высокая талия, мягкая эластичная тесьма или бейка',
            vectorType: 'panties-high-waist'
        },
        {
            id: 'thong',
            name: 'Стринги',
            badge: 'Минимум',
            badgeColor: 'bg-stone-100 text-stone-700 border-stone-200',
            image: null,
            summary: 'Минималистичные трусики с узкой задней планкой. Незаметны под облегающей одеждой.',
            fabrics: 'Микрофибра, тонкое кружево, бельевой эластан',
            difficulty: 'Легко',
            time: '25 минут',
            cutTip: 'Минимальный расход — всего 20 см ткани',
            vectorType: 'panties-thong'
        },
        {
            id: 'dolphin-shorts',
            name: 'Шортики Dolphin',
            badge: 'Ретро-спорт',
            badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            image: null,
            summary: 'Спортивные микро-шорты с закругленными боковыми разрезами и контрастным кантом. Уютный домашний и курортный стиль.',
            fabrics: 'Хлопковый трикотаж (кулирка), махра, велюр, микрофибра',
            difficulty: 'Легко',
            time: '35 минут',
            cutTip: 'Закругленные бока, окантовка трикотажной косой бейкой контрастного цвета',
            vectorType: 'dolphin-shorts'
        },
        {
            id: 'strappy',
            name: 'Стрепы / V-waist',
            badge: 'Модерн',
            badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
            image: null,
            summary: 'Изящные трусики с V-образным поясом и декоративными эластичными стрепами на бедрах.',
            fabrics: 'Эластичная сетка, тонкое кружево, бретелечная резинка-стрепы 10-12 мм',
            difficulty: 'Легко',
            time: '30 минут',
            cutTip: 'V-образная талия, боковые стрепы регулируются под обхват',
            vectorType: 'panties-strappy'
        },
        {
            id: 'tie-side-thong',
            name: 'Стринги на тонких завязках',
            badge: 'Side-Tie',
            badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
            image: null,
            summary: 'Трусики-стринги с боковыми регулируемыми завязками из эластичного рулика (по 32 см). Полная трансформация и моментальная регулировка под любой обхват.',
            fabrics: 'Эластичная микрофибра, бельевой шелк, кружево, бифлекс',
            difficulty: 'Очень легко',
            time: '25 минут',
            cutTip: '4 завязки из эластичного спагетти-рулика длиной по 32 см',
            vectorType: 'panties-tie-side-thong'
        },
        {
            id: 'cage-lingerie',
            name: 'Портупейные трусики (Cage)',
            badge: 'Стреп-каркас',
            badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
            image: null,
            summary: 'Архитектурный будуарный дизайн с перекрестными эластичными лентами-портупеями вокруг бедер и талии с кольцами.',
            fabrics: 'Бельевая стреп-лента 10-15 мм, ажурные кружевные треугольники, O-Ring Ø15 мм',
            difficulty: 'Легко',
            time: '35 минут',
            cutTip: 'Отрицательная прибавка k=0.85, стрепы регулируются под ребра и талию',
            vectorType: 'panties-cage-lingerie'
        },
        {
            id: 'high-leg-bodysuit',
            name: 'Слитное боди с высоким бедром',
            badge: 'High-Leg',
            badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            image: null,
            summary: 'Слитный боди-купальник с экстремально высоким французским вырезом бедра до линии талии. Визуально вытягивает ноги и силуэт.',
            fabrics: 'Бифлекс, матовый спандекс, рибана, эластичная сетка power net',
            difficulty: 'Легко',
            time: '1 час',
            cutTip: 'Коэффициент вертикального растяжения k=0.90, высокий дугообразный срез бедра',
            vectorType: 'panties-high-leg-bodysuit'
        }
    ],

    dress: [
        // --- 1. БАЗОВЫЕ И ДЕЛОВЫЕ ---
        {
            id: 'dress-sheath',
            name: 'Платье-футляр (Little Black Dress)',
            category: 'basic',
            badge: 'База',
            badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            image: null,
            summary: 'Эталонное приталенное платье-футляр. Французская вытачка под проймой, аккуратный круглый вырез и элегантный рукав 3/4.',
            fabrics: 'Костюмная шерсть, плотный креповый шелк, джерси, поливискоза',
            difficulty: 'Легко',
            time: '2.5 – 3 часа',
            cutTip: 'Потайная молния 50 см по спинке, шлица 16 см для комфортного шага',
            vectorType: 'dress-sheath',
            preset: { dartPosition: 'side', necklineType: 'round', necklineDepth: 0, sleeveLengthType: 'three-quarter', silhouette: 'straight' }
        },
        {
            id: 'dress-business',
            name: 'Деловое миди ЦНИИШП',
            category: 'basic',
            badge: 'Офис',
            badgeColor: 'bg-stone-100 text-stone-700 border-stone-200',
            image: null,
            summary: 'Строгий лаконичный силуэт с вытачкой в плечевой шов, широким вырезом «лодочка» и длинным анатомическим рукавом.',
            fabrics: 'Тонкая шерсть, габардин, хлопок с эластаном, плотный твил',
            difficulty: 'Легко',
            time: '2.5 часа',
            cutTip: 'Классическая плечевая вытачка, рукав с локтевой вытачкой для идеальной посадки',
            vectorType: 'dress-business',
            preset: { dartPosition: 'shoulder', necklineType: 'boat', necklineDepth: 0, sleeveLengthType: 'long', silhouette: 'straight' }
        },
        {
            id: 'dress-relief',
            name: 'Платье с рельефом из проймы',
            category: 'basic',
            badge: 'Элегантно',
            badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            image: null,
            summary: 'Грациозный силуэт с плавными дугообразными рельефами из проймы и четким геометричным вырезом «каре».',
            fabrics: 'Плательный лен, костюмный твил, вискозный креп, плотный хлопок',
            difficulty: 'Средняя (дугообразные швы)',
            time: '3 часа',
            cutTip: 'Припосаживание рельефа по груди для безупречной посадки без заломов',
            vectorType: 'dress-relief',
            preset: { dartPosition: 'armhole', necklineType: 'square', necklineDepth: 1, sleeveLengthType: 'three-quarter', silhouette: 'straight' }
        },

        // --- 2. КОКТЕЙЛЬНЫЕ И ВЕЧЕРНИЕ ---
        {
            id: 'dress-cocktail-v',
            name: 'Коктейльное с V-декольте',
            category: 'cocktail',
            badge: 'Хит',
            badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
            image: null,
            summary: 'Приталенное коктейльное платье с выразительным V-образным декольте, удлиняющим шею, и талиевыми вытачками.',
            fabrics: 'Шелковый атлас, бархат, шелк-дюшес, вискозный сатин',
            difficulty: 'Легко',
            time: '2 часа',
            cutTip: 'Обтачка горловины дублируется тонким клеевым флизелином',
            vectorType: 'dress-cocktail-v',
            preset: { dartPosition: 'waist', necklineType: 'v-neck', necklineDepth: 2.5, sleeveLengthType: 'short', silhouette: 'straight' }
        },
        {
            id: 'dress-keyhole',
            name: 'Платье с вырезом-капелькой',
            category: 'cocktail',
            badge: 'Модель 2026',
            badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
            image: null,
            summary: 'Трендовый фокус в портретной зоне: изящный вырез-капелька по центру декольте и французская вытачка под проймой.',
            fabrics: 'Вискозный креп, модал, шелковый трикотаж, крепдешин',
            difficulty: 'Средняя',
            time: '2.5 часа',
            cutTip: 'Окантовка капельки тонкой бейкой или потайная обтачка',
            vectorType: 'dress-keyhole',
            preset: { dartPosition: 'side', necklineType: 'keyhole', necklineDepth: 0.5, sleeveLengthType: 'three-quarter', silhouette: 'straight' }
        },
        {
            id: 'dress-deep-v',
            name: 'Вечернее с глубоким V-вырезом',
            category: 'cocktail',
            badge: 'Тренд',
            badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
            image: null,
            summary: 'Смелое соблазнительное декольте. Идеальный баланс полочки без отставания от тела благодаря выверенной формуле ЦНИИШП.',
            fabrics: 'Тяжелый шелковый креп, струящаяся вискоза, купро',
            difficulty: 'Средняя',
            time: '2.5 часа',
            cutTip: 'Кромка выреза фиксируется нитепрошивной тесьмой от растяжения',
            vectorType: 'dress-deep-v',
            preset: { dartPosition: 'side', necklineType: 'deep-v', necklineDepth: 5.5, sleeveLengthType: 'long', silhouette: 'straight' }
        },

        // --- 3. ПОВСЕДНЕВНЫЕ И ЛЕТНИЕ ---
        {
            id: 'dress-trapeze',
            name: 'Платье А-силуэта (Трапеция)',
            category: 'casual',
            badge: 'Хит',
            badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
            image: null,
            summary: 'Летящее свободное платье-трапеция. Прекрасно драпируется, обеспечивает максимальный комфорт и скрывает нюансы фигуры.',
            fabrics: 'Умягченный лен, муслин, хлопковый поплин, штапель, вискоза',
            difficulty: 'Очень легко',
            time: '1.5 – 2 часа',
            cutTip: 'Расклешение +7 см по боковым швам, свободный раскрой',
            vectorType: 'dress-trapeze',
            preset: { dartPosition: 'side', necklineType: 'boat', necklineDepth: 1, sleeveLengthType: 'short', silhouette: 'flare' }
        },
        {
            id: 'dress-tunic',
            name: 'Летнее мини / Платье-туника',
            category: 'casual',
            badge: 'Легкий пошив',
            badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            image: null,
            summary: 'Прямое лаконичное платье-мини на каждый день. Быстрый и простой пошив всего за один вечер.',
            fabrics: 'Хлопок, вареный лен, батист, трикотажное полотно',
            difficulty: 'Очень легко (для начинающих)',
            time: '1.5 часа',
            cutTip: 'Прямой боковой шов, круглая горловина на обтачке',
            vectorType: 'dress-tunic',
            preset: { dartPosition: 'shoulder', necklineType: 'round', necklineDepth: 1, sleeveLengthType: 'short', silhouette: 'straight' }
        },
        {
            id: 'dress-flare-midi',
            name: 'Миди с клешением от талии',
            category: 'casual',
            badge: 'Романтика',
            badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
            image: null,
            summary: 'Приталенный лиф с талиевой вытачкой и струящийся расклешенный подол длины миди. Женственный силуэт «песочные часы».',
            fabrics: 'Плательный штапель с принтом, тенсель, вискоза с хлопком',
            difficulty: 'Легко',
            time: '2.5 часа',
            cutTip: 'Совмещение вытачки полочки с расклешением низа',
            vectorType: 'dress-flare-midi',
            preset: { dartPosition: 'waist', necklineType: 'v-neck', necklineDepth: 2, sleeveLengthType: 'three-quarter', silhouette: 'flare' }
        }
    ],

    top: [
        // --- 1. ПОВСЕДНЕВНАЯ БАЗА (С ЗАЩИТОЙ ОТ ЗАДИРАНИЯ) ---
        {
            id: 'tank-top',
            name: 'Базовая майка в рубчик',
            category: 'daily',
            badge: 'Анти-задир',
            badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
            image: null,
            summary: 'Анатомическая майка с широкими комфортными бретелями и округлым вырезом. Система «Анти-задир» плавно удлиняет подол переда по дуге, компенсируя подъем от груди при движении.',
            fabrics: 'Хлопковый рубчик кашкорсе 95/5, рибана с лайкрой, трикотаж лапша',
            difficulty: 'Очень легко',
            time: '40 минут',
            cutTip: 'Переднее полотнище со скругленным удлиненным низом (+2.5 см), срезы окантованы бейкой',
            vectorType: 'top-tank-top'
        },
        {
            id: 'smart-tee',
            name: 'Анатомическая футболка',
            category: 'daily',
            badge: 'Анатомический крой',
            badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            image: null,
            summary: 'Базовая футболка с коротким анатомическим рукавом и высокой подмышкой, предотвращающей заломы и провисание ткани. Идеальная посадка по плечам.',
            fabrics: 'Кулирная гладь пенье 95/5, модал с эластаном, мерсеризованный хлопок',
            difficulty: 'Легко',
            time: '1 час',
            cutTip: 'Втачной короткий рукав 19 см, горловина обработана эластичной планкой из рибаны',
            vectorType: 'top-smart-tee'
        },
        {
            id: 'oversize-tee',
            name: 'Свободная оверсайз-футболка (Boyfriend Tee)',
            category: 'daily',
            badge: 'Оверсайз',
            badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
            image: null,
            recLength: 68,
            summary: 'Трендовый объемный крой со спущенной линией плеча (+4.5 см), свободной проймой и удлиненным рукавом до локтя (25 см). Идеальная свобода движений и современный расслабленный силуэт.',
            fabrics: 'Плотный хлопковый кулир 220–240 г/м² (пенье), футер 2-нитка петля, умягченный лен, вареный хлопок',
            difficulty: 'Легко',
            time: '1 час',
            cutTip: 'Спущенное плечо +4.5 см, прибавка к Ог +6 см, удлиненный свободный рукав 25 см',
            vectorType: 'top-oversize-tee'
        },
        {
            id: 'racerback',
            name: 'Спортивная майка-борцовка',
            category: 'daily',
            badge: 'Спорт & Фитнес',
            badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
            image: null,
            summary: 'Спинка заужена между лопатками до фигурной Т-образной планки. Обеспечивает полную свободу движения лопаток и плечевого пояса на тренировках.',
            fabrics: 'Бифлекс, эластичный супрем, компрессионный трикотаж, микрофибра',
            difficulty: 'Легко',
            time: '50 минут',
            cutTip: 'Фигурная пройма спинки окантовывается эластичной резинкой или трикотажной бейкой',
            vectorType: 'top-racerback'
        },
        {
            id: 'halter-top',
            name: 'Топ с американской проймой',
            category: 'daily',
            badge: 'Открытые плечи',
            badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
            image: null,
            summary: 'Изящный диагональный срез проймы от подмышки прямо к основанию шеи. Эффектно открывает плечевые косточки и визуально сужает талию.',
            fabrics: 'Плотный хлопковый трикотаж, вискозный шелк, умягченный лен, фактурный рубчик',
            difficulty: 'Легко',
            time: '1 час',
            cutTip: 'Плечевой шов исключен, горловина фиксируется воротником-петлей или завязками',
            vectorType: 'top-halter-top'
        },

        // --- 2. ЧУВСТВЕННАЯ И ВЕЧЕРНЯЯ ЛИНЕЙКА ---
        {
            id: 'camisole',
            name: 'Шелковый камисоль',
            category: 'sensual',
            badge: 'Шелк & Кружево',
            badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
            image: null,
            summary: 'Струящийся топ на тонких бретелях-спагетти с изящным V-вырезом декольте и спинки. Классика бельевого стиля для вечерних и повседневных образов.',
            fabrics: 'Натуральный шелк, атлас, шелковый сатин, струящаяся вискоза купро, кружево шантильи',
            difficulty: 'Средняя (тонкие ткани)',
            time: '1.5 часа',
            cutTip: 'Раскрой по косой или прямой нити, бретели из рулика 7 мм с регуляторами длины',
            vectorType: 'top-camisole'
        },
        {
            id: 'bustier-crop',
            name: 'Топ-корсаж с подгрудным рельефом',
            category: 'sensual',
            badge: 'Корсажный лиф',
            badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
            image: null,
            summary: 'Скульптурный кроп-топ с акцентным фигурным швом точно под основанием груди и вертикальными рельефами. Создает четкую архитектурную посадку.',
            fabrics: 'Плотный хлопковый жаккард, костюмный креп с эластаном, экокожа, тафта',
            difficulty: 'Средняя',
            time: '2 часа',
            cutTip: 'Нижний подгрудный срез на 7.5 см ниже вершины груди, отрицательная прибавка -1.5 см',
            vectorType: 'top-bustier-crop'
        },
        {
            id: 'low-back',
            name: 'Топ с открытой спиной',
            category: 'sensual',
            badge: 'Cross-Strap',
            badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            image: null,
            summary: 'Глубокий соблазнительный вырез сзади до поясницы с тонкими перекрестными бретелями крест-накрест. Завораживающий акцент на спину.',
            fabrics: 'Эластичный бархат, шелковый крепдешин, вискозный трикотаж, плотный атлас',
            difficulty: 'Легко',
            time: '1.5 часа',
            cutTip: 'Спинка срезана до талии, перекрестные бретели фиксируют боковые швы от сползания',
            vectorType: 'top-low-back'
        },
        {
            id: 'asymmetric-tee',
            name: 'Асимметричная футболка на одно плечо',
            category: 'sensual',
            badge: 'Одно плечо',
            badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            image: null,
            recLength: 56,
            summary: 'Изящный ниспадающий вырез с одним полностью открытым плечом, мягкой драпировкой и свободным рукавом (22 см). Стильный асимметричный силуэт, акцентирующий ключицы.',
            fabrics: 'Тонкая струящаяся вискоза с лайкрой, шелковистый модал, бамбуковый трикотаж, тенсель',
            difficulty: 'Легко',
            time: '1 час',
            cutTip: 'Асимметричный срез горловины: одно плечо спущено на 4 см ниже ключицы, рукав 22 см',
            vectorType: 'top-asymmetric-tee'
        },
        {
            id: 'ruched-baby-tee',
            name: 'Трендовая Baby-Tee на кулисках',
            category: 'sensual',
            badge: 'Кулиски Y2K',
            badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
            image: null,
            recLength: 42,
            summary: 'Культовый укороченный силуэт 2000-х с миниатюрным рукавом (14 см) и боковыми вертикальными кулисками. Длина и драпировка талии легко регулируются шнурками.',
            fabrics: 'Эластичный хлопковый рубчик 2x2, рибана с лайкрой, масло, вискозный бифлекс',
            difficulty: 'Легко',
            time: '1 час 15 мин',
            cutTip: 'Боковой припуск 2.5 см под кулиску со шнурком, короткий рукав 14 см',
            vectorType: 'top-ruched-baby-tee'
        },

        // --- 3. ОТКРОВЕННЫЕ, БУДУАРНЫЕ И ЭРОТИЧЕСКИЕ ДИЗАЙНЫ ---
        {
            id: 'open-cup',
            name: 'Топ с открытой грудью (Open-Cup)',
            category: 'boudoir',
            badge: 'Shelf Bra',
            badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
            image: null,
            summary: 'Будуарный дизайн с открытой верхней зоной чашек. Анатомическая полочка-балконет надежно поддерживает грудь снизу, оставляя декольте полностью открытым.',
            fabrics: 'Эластичный бархат, кордовое кружево, бельевая сетка, эластичный спандекс',
            difficulty: 'Средняя',
            time: '1.5 часа',
            cutTip: 'Чашка срезана по основанию груди, подгрудный каркас усилен бельевой резинкой (k=0.82)',
            vectorType: 'top-open-cup'
        },
        {
            id: 'plunging-mesh',
            name: 'Боди-топ из сетки с глубоким декольте',
            category: 'boudoir',
            badge: 'Plunging V',
            badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
            image: null,
            summary: 'Экстремально глубокий V-вырез до самого пояса с конструктивной стабилизирующей вытачкой (1.2 см), исключающей отставание ткани. Фиксируется декоративными портупеями.',
            fabrics: 'Эластичная сетка power mesh, тюль с эластаном, микрофибра, стрейч-бифлекс',
            difficulty: 'Средняя',
            time: '1.5 часа',
            cutTip: 'Вытачка 1.2 см по кромке выреза, 2-3 поперечные эластичные перемычки для надежной фиксации',
            vectorType: 'top-plunging-mesh'
        },
        {
            id: 'strappy-cage',
            name: 'Кружевной микро-топ с портупеями',
            category: 'boudoir',
            badge: 'Портупеи',
            badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
            image: null,
            summary: 'Комбинация открытых кружевных треугольников и геометрии перекрестных эластичных лент-портупей по ребрам и под грудью. Плотное облегание за счет отрицательных прибавок.',
            fabrics: 'Бельевая эластичная лента 10-15 мм, ажурное кружево, кольца Ø15 мм, регуляторы',
            difficulty: 'Легко',
            time: '1 час',
            cutTip: 'Отрицательная прибавка -3.5 см, расчет длины резинок с коэффициентом растяжимости 0.82',
            vectorType: 'top-strappy-cage'
        },
        {
            id: 'o-ring-top',
            name: 'Кроп-топ с кольцом и перемычками',
            category: 'boudoir',
            badge: 'O-Ring деталь',
            badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
            image: null,
            summary: 'Дерзкий графичный дизайн с центральным соединительным металлическим кольцом на груди. От кольца расходятся 4 регулируемые стреп-ленты к шее и поясу.',
            fabrics: 'Стреп-ленты, эластичная экокожа, бельевой спандекс, металлофурнитура O-Ring Ø30 мм',
            difficulty: 'Легко',
            time: '1 час',
            cutTip: 'Центральное кольцо Ø30 мм в межгрудной впадине, 4 стрепа с запасом под притачивание',
            vectorType: 'top-o-ring-top'
        },
        {
            id: 'extreme-crop',
            name: 'Ультра-короткий кроп-топ',
            category: 'boudoir',
            badge: 'Underbust',
            badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
            image: null,
            summary: 'Экстремально короткий топ в обтяжку с нижним срезом ровно по подгрудной складке (Вг). Идеально сидит при наклонах и движении.',
            fabrics: 'Эластичный рубчик кашкорсе, микрофибра, латекс/экокожа с эластаном',
            difficulty: 'Очень легко',
            time: '30 минут',
            cutTip: 'Нижний срез точно по подгрудной линии (Вг + 1.5 см на подгибку), отрицательная прибавка',
            vectorType: 'top-extreme-crop'
        },
        {
            id: 'front-laceup',
            name: 'Топ на передней шнуровке',
            category: 'sensual',
            badge: 'Шнуровка',
            badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
            image: null,
            summary: 'Разрезная полочка с регулируемым раскрытием декольте на люверсах или навесных петлях. Удобно надевать и регулировать глубину декольте.',
            fabrics: 'Хлопковый твил, экокожа, шелковый атлас, корсетный сатин',
            difficulty: 'Легко',
            time: '1.5 часа',
            cutTip: 'Разрезная полочка с планкой под петли/люверсы, шнур 120 см',
            vectorType: 'top-front-laceup'
        },
        {
            id: 'keyhole-halter',
            name: 'Холтер-топ с капелькой и ошейником',
            category: 'boudoir',
            badge: 'Choker & Drop',
            badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
            image: null,
            summary: 'Воротник-чокер на шее с застежкой сзади и овальный вырез-капелька по центру груди. Эффектный акцент в стрим-кадре.',
            fabrics: 'Бархат, эластичная замша, экокожа, плотный трикотаж масло',
            difficulty: 'Средняя',
            time: '1.5 часа',
            cutTip: 'Воротник-чокер высотой 3.5 см, капелька 10x6 см с эластичной обтачкой',
            vectorType: 'top-keyhole-halter'
        },
        {
            id: 'curtain-top',
            name: 'Топ со сборками-шторками',
            category: 'sensual',
            badge: 'Curtain',
            badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
            image: null,
            summary: 'Топ на кулисках-шторках сверху и снизу. Ширина чашек регулируется вручную от полного покрытия до минималистичных треугольников.',
            fabrics: 'Шелк, струящийся шифон, тонкий бифлекс, жатый муслин',
            difficulty: 'Легко',
            time: '1 час',
            cutTip: 'Две горизонтальные кулиски сверху и снизу с продетыми шнурками',
            vectorType: 'top-curtain-top'
        },
        {
            id: 'underboob-crop-tee',
            name: 'Ультра-кроп футболка «Underboob»',
            category: 'boudoir',
            badge: '🔥 Underboob',
            badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
            image: null,
            recLength: 26,
            summary: 'Экстремально дерзкая укороченная футболка для ярких стримов и съемки. Закрытый воротник-стойка и короткие рукава (13 см) контрастируют с арочным низом, обнажающим нижний контур груди.',
            fabrics: 'Плотный хлопок с эластаном 95/5, полупрозрачная эластичная сетка power mesh, латексный бифлекс',
            difficulty: 'Легко',
            time: '45 минут',
            cutTip: 'Арочная дуга подола по центру на 2 см выше подгрудной линии, обработка эластичной силиконовой бейкой',
            vectorType: 'top-underboob-crop-tee'
        },
        {
            id: 'cutout-laceup-tee',
            name: 'Футболка с декольте-шнуровкой «Peek-a-Boo»',
            category: 'boudoir',
            badge: 'Камера & Стрим',
            badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
            image: null,
            recLength: 40,
            summary: 'Укороченная футболка с коротким рукавом (16 см), овальным вырезом декольте и перекрестной шнуровкой. Идеальный фокус портретной зоны для стримов и камеры с регулировкой раскрытия.',
            fabrics: 'Хлопковый трикотаж пенье с эластаном, замшевый стрейч, экокожа на трикотаже, атласный шнур',
            difficulty: 'Средняя',
            time: '1.5 часа',
            cutTip: 'Овальный вырез декольте 14x7 см, 4 пары петель под шнуровку, притачной короткий рукав 16 см',
            vectorType: 'top-cutout-laceup-tee'
        },
        {
            id: 'backless-mesh-tee',
            name: 'Футболка с открытой спиной на завязках',
            category: 'boudoir',
            badge: 'Открытая спина',
            badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
            image: null,
            recLength: 46,
            summary: 'Спереди — лаконичная стильная футболка с коротким рукавом (18 см), а сзади — чувственный вырез спинки до самой талии, соединяемый двумя парами тонких шелковых завязок на лопатках и пояснице.',
            fabrics: 'Эластичная дышащая сетка, микромасло, мокрый шелк с эластаном, тонкая вискоза',
            difficulty: 'Легко',
            time: '1 час',
            cutTip: 'Спинка срезана до талии с запасом 1.5 см на окантовку, 2 пары завязок по 35 см',
            vectorType: 'top-backless-mesh-tee'
        }
    ],

    corset: [
        {
            id: 'underbust-corset',
            name: 'Подгрудный корсет (Underbust)',
            category: 'corset',
            badge: 'Утяжка -5 см',
            badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
            image: null,
            summary: 'Анатомический корсет под грудь из 6–8 профилированных вертикальных панелей. Создает соблазнительную талию «песочные часы» с утяжкой 4–6 см.',
            fabrics: 'Корсетный сатин, плотный жаккард, шелковый атлас, тик, спиральные кости 8 мм',
            difficulty: 'Высокая (корсетная техника)',
            time: '4 – 5 часов',
            cutTip: '8 деталей по долевой + люверсы d=4мм + кулиски под кости',
            vectorType: 'corset-underbust-corset'
        },
        {
            id: 'waspie-belt',
            name: 'Шнурованный пояс-корсаж (Waspie)',
            category: 'corset',
            badge: 'Waspie',
            badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
            image: null,
            summary: 'Фигурный пояс шириной 14 см с высоким мысом по центру переда и выемками над бедрами для свободного движения. Собирается на шнуровку.',
            fabrics: 'Экокожа, бархат, корсетная парча, деним, регилин/китовый ус',
            difficulty: 'Средняя',
            time: '2 часа',
            cutTip: '6 профилированных панелей, выемки над бедрами, люверсы',
            vectorType: 'corset-waspie-belt'
        },
        {
            id: 'boudoir-kimono',
            name: 'Шелковое кимоно (Boudoir Robe)',
            category: 'wrap',
            badge: 'Шелк / Кружево',
            badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
            image: null,
            summary: 'Роскошное распашное кимоно без вытачек со спущенным плечом, широкими летящими рукавами и глубоким запахом под пояс.',
            fabrics: 'Натуральный шелк, атлас, кружевное полотно шантильи, шифон',
            difficulty: 'Легко',
            time: '2 часа',
            cutTip: 'Спущенная линия плеча, широкий рукав 38 см, пояс 160×7 см',
            vectorType: 'corset-boudoir-kimono'
        },
        {
            id: 'bell-peignoir',
            name: 'Сетчатый пеньюар Bell-Sleeve',
            category: 'wrap',
            badge: 'Bell-Sleeve',
            badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
            image: null,
            summary: 'Воздушная накидка на завязках под грудью (ампир). Рукав аккуратно облегает руку до локтя и затем конически расширяется в 2.1 раза.',
            fabrics: 'Эластичная евросетка, полупрозрачный шифон, кружево, органза',
            difficulty: 'Легко',
            time: '2 часа',
            cutTip: 'Рукав-колокол клеш от локтя, кулиска под грудью',
            vectorType: 'corset-bell-peignoir'
        },
        {
            id: 'super-crop-shrug',
            name: 'Экстремальное болеро / Худи',
            category: 'wrap',
            badge: 'Super-Crop',
            badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            image: null,
            summary: 'Ультракороткое болеро, закрывающее только плечи и спину до лопаток, оставляя грудь полностью открытой. Рукава с отверстием под палец и капюшоном.',
            fabrics: 'Трикотаж рубчик, рибана, футер 2-нитка, бифлекс, сетка-стрейч',
            difficulty: 'Легко',
            time: '1.5 часа',
            cutTip: 'Глубокий фигурный вырез над грудью, прорезь под палец 4.5 см, капюшон',
            vectorType: 'corset-super-crop-shrug'
        },
        {
            id: 'lounge-romper',
            name: 'Домашний микро-ромпер (Teddy)',
            category: 'romper',
            badge: 'Teddy Romper',
            badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
            image: null,
            summary: 'Приталенный комбинезон-пижама, объединяющий открытый топ на бретелях с передней планкой на кнопках и мини-шортики с ластовицей.',
            fabrics: 'Хлопковый трикотаж пенье, шелковый сатин, вискоза, кулирка',
            difficulty: 'Средняя',
            time: '2.5 часа',
            cutTip: 'Планка на 5 кнопок, кулиска талии, ластовица, бретели с регуляторами',
            vectorType: 'corset-lounge-romper'
        },
        {
            id: 'french-maid-apron',
            name: 'Кокетливый мини-передник',
            category: 'roleplay',
            badge: 'French Maid',
            badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            image: null,
            summary: 'Фигурный полукруглый фартук с кокетливым нагрудником, длинным поясом-бантом и автоматическим расчетом длины кружевных оборок (k=1.8).',
            fabrics: 'Белый батист, поплин, фатин, хлопковое кружево со сборкой',
            difficulty: 'Легко',
            time: '2 часа',
            cutTip: 'Полукруглый фартук 34 см, пояс-бант 140 см, полосы оборок k=1.8',
            vectorType: 'corset-french-maid-apron'
        }
    ]
};

// Генератор точных векторных фэшн-эскизов (SVG)
function getStyleVectorSvg(type, size = 64) {
    const stroke = '#18181b';
    const strokeWidth = 1.6;
    const fill = '#f8fafc';
    const accent = '#6366f1';

    let content = '';

    switch (type) {
        case 'mini-trapeze':
            content = `
                <!-- Мини-трапеция -->
                <path d="M 28 20 L 52 20 L 52 26 L 28 26 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 28 26 L 19 66 Q 40 70 61 66 L 52 26 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <!-- Вытачки -->
                <line x1="34" y1="26" x2="34" y2="38" stroke="${stroke}" stroke-width="1.1"/>
                <line x1="46" y1="26" x2="46" y2="38" stroke="${stroke}" stroke-width="1.1"/>
                <!-- Подгибка -->
                <path d="M 21 62 Q 40 66 59 62" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="3,2" fill="none"/>
            `;
            break;

        case 'mini-pleated':
            content = `
                <!-- Теннисная юбка плиссе -->
                <path d="M 28 18 L 52 18 L 52 23 L 28 23 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Кокетка -->
                <path d="M 28 23 L 52 23 L 55 35 L 25 35 Z" fill="#f1f5f9" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Складки плиссе -->
                <path d="M 25 35 L 17 68 Q 40 72 63 68 L 55 35 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <line x1="29" y1="35" x2="23" y2="69" stroke="${stroke}" stroke-width="1.1"/>
                <line x1="34" y1="35" x2="30" y2="70" stroke="${stroke}" stroke-width="1.1"/>
                <line x1="40" y1="35" x2="40" y2="70.5" stroke="${stroke}" stroke-width="1.1"/>
                <line x1="46" y1="35" x2="50" y2="70" stroke="${stroke}" stroke-width="1.1"/>
                <line x1="51" y1="35" x2="57" y2="69" stroke="${stroke}" stroke-width="1.1"/>
            `;
            break;

        case 'mini-wrap':
            content = `
                <!-- Мини с запахом -->
                <path d="M 27 20 L 53 20 L 53 25 L 27 25 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Нижнее полотнище -->
                <path d="M 27 25 L 20 66 L 50 66 L 53 25 Z" fill="#f1f5f9" stroke="${stroke}" stroke-width="1.1"/>
                <!-- Верхний запах с диагональю -->
                <path d="M 27 25 L 53 25 L 60 62 L 32 68 L 22 45 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Пуговицы на поясе -->
                <circle cx="31" cy="22.5" r="1.3" fill="${accent}"/>
                <circle cx="35" cy="22.5" r="1.3" fill="${accent}"/>
            `;
            break;

        case 'mini-slit':
            content = `
                <!-- Мини с разрезом -->
                <path d="M 28 20 L 52 20 L 52 26 L 28 26 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 28 26 L 24 66 L 56 66 L 52 26 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Вытачки -->
                <line x1="34" y1="26" x2="34" y2="38" stroke="${stroke}" stroke-width="1.1"/>
                <line x1="46" y1="26" x2="46" y2="38" stroke="${stroke}" stroke-width="1.1"/>
                <!-- Разрез на ноге -->
                <line x1="46" y1="66" x2="46" y2="52" stroke="#e11d48" stroke-width="1.6"/>
                <circle cx="46" cy="51" r="1.5" fill="#e11d48"/>
            `;
            break;

        case 'mini-skater':
            content = `
                <!-- Мини-скейтер / клеш -->
                <path d="M 28 20 L 52 20 L 52 25 L 28 25 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 28 25 Q 12 50 14 65 Q 26 73 40 70 Q 54 73 66 65 Q 68 50 52 25 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Волны клеша -->
                <path d="M 28 25 Q 27 48 26 71" stroke="#94a3b8" stroke-width="0.9" fill="none"/>
                <path d="M 40 25 Q 40 48 40 70" stroke="#94a3b8" stroke-width="0.9" fill="none"/>
                <path d="M 52 25 Q 53 48 54 71" stroke="#94a3b8" stroke-width="0.9" fill="none"/>
            `;
            break;

        case 'mini-laceup':
            content = `
                <!-- Мини со шнуровкой по бедру -->
                <path d="M 28 20 L 52 20 L 52 26 L 28 26 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 28 26 L 24 45 L 29 65 L 56 65 L 52 26 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Шнуровка крест-накрест -->
                <line x1="24" y1="48" x2="28" y2="52" stroke="#f43f5e" stroke-width="1.3"/>
                <line x1="28" y1="48" x2="25" y2="52" stroke="#f43f5e" stroke-width="1.3"/>
                <line x1="25" y1="54" x2="29" y2="58" stroke="#f43f5e" stroke-width="1.3"/>
                <line x1="29" y1="54" x2="26" y2="58" stroke="#f43f5e" stroke-width="1.3"/>
                <circle cx="24" cy="48" r="1.1" fill="#f43f5e"/>
                <circle cx="28" cy="48" r="1.1" fill="#f43f5e"/>
                <circle cx="25" cy="54" r="1.1" fill="#f43f5e"/>
                <circle cx="29" cy="54" r="1.1" fill="#f43f5e"/>
                <circle cx="26" cy="60" r="1.1" fill="#f43f5e"/>
                <circle cx="29.5" cy="60" r="1.1" fill="#f43f5e"/>
                <path d="M 26 61 Q 23 65 25 67 M 29 61 Q 31 65 29 67" stroke="#f43f5e" stroke-width="1" fill="none"/>
            `;
            break;

        case 'mini-ruched':
            content = `
                <!-- Мини с боковой кулиской (сборка) -->
                <path d="M 28 20 L 52 20 L 52 25 L 28 25 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 28 25 L 25 65 Q 40 68 53 62 L 52 25 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Складки сборки -->
                <path d="M 33 35 Q 43 37 52 34" stroke="#a855f7" stroke-width="1.1" fill="none"/>
                <path d="M 30 44 Q 42 46 52.5 42" stroke="#a855f7" stroke-width="1.1" fill="none"/>
                <path d="M 27 53 Q 41 55 53 51" stroke="#a855f7" stroke-width="1.1" fill="none"/>
                <!-- Кулиска справа с завязками -->
                <line x1="52" y1="25" x2="53" y2="62" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="2,2"/>
                <path d="M 53 62 Q 51 69 49 73 M 53 62 Q 56 69 55 74" stroke="#7c3aed" stroke-width="1.2" fill="none"/>
                <circle cx="49" cy="73" r="1" fill="#7c3aed"/>
                <circle cx="55" cy="74" r="1" fill="#7c3aed"/>
            `;
            break;

        case 'mini-micro':
            content = `
                <!-- Y2K микро-юбка (30 см) -->
                <path d="M 27 28 L 53 28 L 53 34 L 27 34 Z" fill="#cbd5e1" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Ультракороткое полотнище -->
                <path d="M 27 34 L 25 54 L 55 54 L 53 34 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Пряжка ремня и шлевки Y2K -->
                <rect x="38" y="29" width="4" height="4" fill="#f59e0b" stroke="${stroke}" stroke-width="0.8"/>
                <line x1="31" y1="28" x2="31" y2="34" stroke="${stroke}" stroke-width="1"/>
                <line x1="49" y1="28" x2="49" y2="34" stroke="${stroke}" stroke-width="1"/>
                <!-- Кармашки микро -->
                <path d="M 28 37 L 34 37 L 34 43 L 28 43" stroke="#94a3b8" stroke-width="0.8" fill="none"/>
                <path d="M 52 37 L 46 37 L 46 43 L 52 43" stroke="#94a3b8" stroke-width="0.8" fill="none"/>
            `;
            break;

        case 'a-line':
            content = `
                <!-- Трапеция миди -->
                <path d="M 29 18 L 51 18 L 51 23 L 29 23 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 29 23 L 14 74 Q 40 78 66 74 L 51 23 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <line x1="35" y1="23" x2="35" y2="39" stroke="${stroke}" stroke-width="1.1"/>
                <line x1="45" y1="23" x2="45" y2="39" stroke="${stroke}" stroke-width="1.1"/>
                <path d="M 16 70 Q 40 74 64 70" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="3,2" fill="none"/>
            `;
            break;

        case 'half-sun':
        case 'sun':
            content = `
                <!-- Солнце / полусолнце -->
                <path d="M 30 18 L 50 18 L 50 23 L 30 23 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 30 23 Q 8 48 10 74 Q 25 80 40 77 Q 55 80 70 74 Q 72 48 50 23 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Складки солнца -->
                <path d="M 25 76 Q 30 45 35 23" stroke="#94a3b8" stroke-width="0.9" fill="none"/>
                <path d="M 40 77 Q 40 50 40 23" stroke="#94a3b8" stroke-width="0.9" fill="none"/>
                <path d="M 55 76 Q 50 45 45 23" stroke="#94a3b8" stroke-width="0.9" fill="none"/>
            `;
            break;

        case 'pencil':
            content = `
                <!-- Карандаш миди -->
                <path d="M 30 18 L 50 18 L 50 24 L 30 24 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 30 24 Q 24 35 25 45 L 29 74 L 51 74 L 55 45 Q 56 35 50 24 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <line x1="35" y1="24" x2="35" y2="38" stroke="${stroke}" stroke-width="1.1"/>
                <line x1="45" y1="24" x2="45" y2="38" stroke="${stroke}" stroke-width="1.1"/>
                <!-- Шлица сзади -->
                <line x1="40" y1="74" x2="40" y2="60" stroke="#64748b" stroke-width="1.1" stroke-dasharray="3,2"/>
            `;
            break;

        case 'straight':
            content = `
                <!-- Прямая классическая -->
                <path d="M 30 18 L 50 18 L 50 24 L 30 24 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 30 24 Q 25 35 26 45 L 26 74 L 54 74 L 54 45 Q 55 35 50 24 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <line x1="35" y1="24" x2="35" y2="38" stroke="${stroke}" stroke-width="1.1"/>
                <line x1="45" y1="24" x2="45" y2="38" stroke="${stroke}" stroke-width="1.1"/>
            `;
            break;

        case 'panties-slips':
            content = `
                <!-- Трусики слипы -->
                <path d="M 20 28 Q 40 29 60 28 L 59 36 Q 47 48 44 60 L 36 60 Q 33 48 21 36 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <!-- Ластовица пунктир -->
                <path d="M 35 52 Q 40 53 45 52" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="2,2"/>
                <!-- Эластичная отделка -->
                <path d="M 20 28 Q 40 29 60 28" stroke="${accent}" stroke-width="1.2" fill="none"/>
            `;
            break;

        case 'panties-braziliana':
            content = `
                <!-- Бразилиана с V-вырезом -->
                <path d="M 18 28 Q 40 32 62 28 L 61 34 Q 45 42 42 61 L 38 61 Q 35 42 19 34 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 18 28 Q 40 32 62 28" stroke="#f43f5e" stroke-width="1.3" fill="none"/>
                <!-- V-линия сзади -->
                <path d="M 40 32 L 40 55" stroke="#f43f5e" stroke-width="0.8" stroke-dasharray="2,2"/>
            `;
            break;

        case 'panties-high-waist':
            content = `
                <!-- Ретро высокая талия -->
                <path d="M 23 16 Q 40 17 57 16 L 58 35 Q 48 46 44 62 L 36 62 Q 32 46 22 35 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <line x1="23" y1="16" x2="57" y2="16" stroke="${accent}" stroke-width="1.4"/>
                <!-- Вертикальные рельефы -->
                <line x1="33" y1="18" x2="31" y2="40" stroke="#cbd5e1" stroke-width="0.8"/>
                <line x1="47" y1="18" x2="49" y2="40" stroke="#cbd5e1" stroke-width="0.8"/>
            `;
            break;

        case 'panties-thong':
            content = `
                <!-- Стринги -->
                <path d="M 16 28 Q 40 32 64 28 L 63 32 Q 44 38 42 62 L 38 62 Q 36 38 17 32 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <line x1="16" y1="28" x2="64" y2="28" stroke="${stroke}" stroke-width="1.2"/>
            `;
            break;

        case 'dolphin-shorts':
            content = `
                <!-- Микро-шортики Dolphin -->
                <path d="M 22 25 L 58 25 L 58 30 L 22 30 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 22 30 L 20 46 Q 22 56 31 56 L 40 50 L 49 56 Q 58 56 60 46 L 58 30 Z" fill="#ecfdf5" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 20 42 Q 22 55 31 55 L 40 50 L 49 55 Q 58 55 60 42" stroke="#10b981" stroke-width="1.8" fill="none"/>
                <path d="M 20 42 Q 23 48 27 50" stroke="#10b981" stroke-width="1.2" fill="none"/>
                <path d="M 60 42 Q 57 48 53 50" stroke="#10b981" stroke-width="1.2" fill="none"/>
                <circle cx="40" cy="27.5" r="1.2" fill="#10b981"/>
            `;
            break;

        case 'panties-strappy':
            content = `
                <!-- Стрепы / V-waist трусики -->
                <path d="M 22 26 Q 40 35 58 26 L 56 32 Q 44 42 42 61 L 38 61 Q 36 42 24 32 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 22 26 Q 40 35 58 26" stroke="#f43f5e" stroke-width="1.6" fill="none"/>
                <line x1="22" y1="26" x2="14" y2="23" stroke="#f43f5e" stroke-width="1.4"/>
                <line x1="23" y1="31" x2="15" y2="30" stroke="#f43f5e" stroke-width="1.4"/>
                <line x1="58" y1="26" x2="66" y2="23" stroke="#f43f5e" stroke-width="1.4"/>
                <line x1="57" y1="31" x2="65" y2="30" stroke="#f43f5e" stroke-width="1.4"/>
                <circle cx="22" cy="26" r="1" fill="#f43f5e"/>
                <circle cx="58" cy="26" r="1" fill="#f43f5e"/>
            `;
            break;

        case 'dress-shoulder':
            content = `
                <!-- Платье: вытачка в плечо -->
                <path d="M 26 18 Q 40 24 54 18 L 59 34 L 54 36 L 52 48 L 52 74 L 28 74 L 28 48 L 26 36 L 21 34 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Плечевая вытачка -->
                <line x1="45" y1="19.5" x2="41" y2="38" stroke="#2563eb" stroke-width="1.6"/>
            `;
            break;

        case 'dress-side':
            content = `
                <!-- Платье: французская вытачка -->
                <path d="M 26 18 Q 40 24 54 18 L 59 34 L 54 36 L 52 48 L 52 74 L 28 74 L 28 48 L 26 36 L 21 34 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Французская вытачка под проймой -->
                <line x1="53" y1="41" x2="41" y2="38" stroke="#e11d48" stroke-width="1.6"/>
            `;
            break;

        case 'dress-waist':
            content = `
                <!-- Платье: вытачка в талию -->
                <path d="M 26 18 Q 40 24 54 18 L 59 34 L 54 36 L 52 48 L 52 74 L 28 74 L 28 48 L 26 36 L 21 34 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Талиевая вытачка -->
                <line x1="41" y1="48" x2="41" y2="38" stroke="#d97706" stroke-width="1.6"/>
            `;
            break;

        case 'dress-armhole':
            content = `
                <!-- Платье: вытачка в пройму -->
                <path d="M 26 18 Q 40 24 54 18 L 59 34 L 54 36 L 52 48 L 52 74 L 28 74 L 28 48 L 26 36 L 21 34 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Вытачка из проймы -->
                <path d="M 52 28 Q 45 32 41 38" stroke="#059669" stroke-width="1.6" fill="none"/>
            `;
            break;

        case 'dress-keyhole':
            content = `
                <!-- Топ с вырезом-капелькой -->
                <path d="M 26 18 Q 40 22 54 18 L 59 34 L 54 36 L 52 48 L 52 68 L 28 68 L 28 48 L 26 36 L 21 34 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 33 19.5 Q 40 21 47 19.5" stroke="${stroke}" stroke-width="1.6" fill="none"/>
                <!-- Капелька по центру -->
                <path d="M 40 24 C 36 27 36 34 40 36 C 44 34 44 27 40 24 Z" fill="#f43f5e" fill-opacity="0.25" stroke="#f43f5e" stroke-width="1.4"/>
            `;
            break;

        case 'dress-halter':
            content = `
                <!-- Топ-холтер с открытыми плечами -->
                <path d="M 34 14 Q 40 12 46 14 L 47 20 L 33 20 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 33 20 L 47 20 L 54 38 L 52 48 L 52 68 L 28 68 L 28 48 L 26 38 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <line x1="33" y1="20" x2="26" y2="38" stroke="#d97706" stroke-width="1.4"/>
                <line x1="47" y1="20" x2="54" y2="38" stroke="#d97706" stroke-width="1.4"/>
            `;
            break;

        case 'dress-bustier':
            content = `
                <!-- Мягкий топ-бюстье / корсетный силуэт -->
                <path d="M 28 26 Q 34 20 40 24 Q 46 20 52 26 L 53 45 L 51 66 L 29 66 L 27 45 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 28 26 Q 34 32 40 24" stroke="#a855f7" stroke-width="1.3" fill="none"/>
                <path d="M 40 24 Q 46 32 52 26" stroke="#a855f7" stroke-width="1.3" fill="none"/>
                <line x1="35" y1="30" x2="35" y2="66" stroke="#c084fc" stroke-width="1.1" stroke-dasharray="2,2"/>
                <line x1="45" y1="30" x2="45" y2="66" stroke="#c084fc" stroke-width="1.1" stroke-dasharray="2,2"/>
            `;
            break;

        case 'dress-sheath':
            content = `
                <!-- Платье-футляр -->
                <path d="M 24 19 L 14 38 L 20 40 L 26 31 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 56 19 L 66 38 L 60 40 L 54 31 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 27 18 Q 40 23 53 18 L 54 31 Q 50 44 51 52 L 49 76 L 31 76 L 29 52 Q 30 44 26 31 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 33 18 Q 40 22 47 18" stroke="${stroke}" stroke-width="1.4" fill="none"/>
                <line x1="51" y1="36" x2="42" y2="34" stroke="#4f46e5" stroke-width="1.3"/>
                <line x1="36" y1="42" x2="36" y2="52" stroke="#94a3b8" stroke-width="0.9"/>
                <line x1="44" y1="42" x2="44" y2="52" stroke="#94a3b8" stroke-width="0.9"/>
                <line x1="40" y1="76" x2="40" y2="67" stroke="#64748b" stroke-width="1" stroke-dasharray="2,2"/>
            `;
            break;

        case 'dress-business':
            content = `
                <!-- Деловое миди ЦНИИШП -->
                <path d="M 24 18 L 12 50 L 17 51 L 26 32 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 56 18 L 68 50 L 63 51 L 54 32 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 26 18 L 54 18 L 54 32 Q 52 44 52 54 L 52 77 L 28 77 L 28 54 Q 28 44 26 32 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 28 18 Q 40 20 52 18" stroke="${stroke}" stroke-width="1.5" fill="none"/>
                <line x1="45" y1="18.5" x2="42" y2="32" stroke="#2563eb" stroke-width="1.3"/>
                <line x1="28" y1="46" x2="52" y2="46" stroke="#475569" stroke-width="1.2"/>
                <rect x="38" y="44.5" width="4" height="3" fill="#cbd5e1" stroke="#475569" stroke-width="0.8"/>
            `;
            break;

        case 'dress-relief':
            content = `
                <!-- Платье с рельефом из проймы -->
                <path d="M 24 19 L 15 39 L 20 40 L 26 31 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 56 19 L 65 39 L 60 40 L 54 31 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 26 18 L 54 18 L 54 31 Q 51 44 51 54 L 50 76 L 30 76 L 29 54 Q 29 44 26 31 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 33 18 L 33 24 L 47 24 L 47 18" stroke="${stroke}" stroke-width="1.4" fill="none"/>
                <path d="M 26 27 Q 35 34 35 76" stroke="#059669" stroke-width="1.2" fill="none"/>
                <path d="M 54 27 Q 45 34 45 76" stroke="#059669" stroke-width="1.2" fill="none"/>
            `;
            break;

        case 'dress-cocktail-v':
            content = `
                <!-- Коктейльное с V-декольте -->
                <path d="M 24 19 L 17 29 L 23 31 L 26 26 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 56 19 L 63 29 L 57 31 L 54 26 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 26 18 L 54 18 L 54 26 Q 49 42 50 50 L 48 72 L 32 72 L 30 50 Q 31 42 26 26 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 32 18 L 40 32 L 48 18" stroke="#e11d48" stroke-width="1.6" fill="none"/>
                <line x1="36" y1="46" x2="38" y2="35" stroke="#e11d48" stroke-width="1.2"/>
                <line x1="44" y1="46" x2="42" y2="35" stroke="#e11d48" stroke-width="1.2"/>
            `;
            break;

        case 'dress-deep-v':
            content = `
                <!-- Вечернее с глубоким V-вырезом -->
                <path d="M 24 18 L 12 52 L 18 53 L 26 31 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 56 18 L 68 52 L 62 53 L 54 31 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 26 18 L 54 18 L 54 31 Q 50 42 51 52 L 50 78 L 30 78 L 29 52 Q 30 42 26 31 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 30 18 L 40 44 L 50 18" stroke="#9333ea" stroke-width="1.6" fill="none"/>
                <circle cx="40" cy="44" r="1.3" fill="#9333ea"/>
            `;
            break;

        case 'dress-trapeze':
            content = `
                <!-- Платье А-силуэта (Трапеция) -->
                <path d="M 26 19 L 17 29 L 23 31 L 28 26 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 54 19 L 63 29 L 57 31 L 52 26 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 28 18 Q 40 21 52 18 L 52 26 L 64 74 Q 40 78 16 74 L 28 26 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 31 18 Q 40 21 49 18" stroke="${stroke}" stroke-width="1.4" fill="none"/>
                <path d="M 19 70 Q 40 74 61 70" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="3,2" fill="none"/>
            `;
            break;

        case 'dress-tunic':
            content = `
                <!-- Прямое мини / платье-туника -->
                <path d="M 26 19 L 17 30 L 23 32 L 28 26 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 54 19 L 63 30 L 57 32 L 52 26 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 28 18 L 52 18 L 52 26 L 54 62 L 26 62 L 28 26 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 34 18 Q 40 22 46 18" stroke="${stroke}" stroke-width="1.4" fill="none"/>
                <rect x="30" y="45" width="8" height="9" rx="1.5" fill="#f1f5f9" stroke="#94a3b8" stroke-width="0.8"/>
                <rect x="42" y="45" width="8" height="9" rx="1.5" fill="#f1f5f9" stroke="#94a3b8" stroke-width="0.8"/>
            `;
            break;

        case 'dress-flare-midi':
            content = `
                <!-- Миди с клешением от талии -->
                <path d="M 25 19 L 16 38 L 21 39 L 27 30 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 55 19 L 64 38 L 59 39 L 53 30 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 27 18 L 53 18 L 53 30 Q 48 38 48 44 L 32 44 Q 32 38 27 30 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 32 44 Q 16 62 18 78 Q 40 82 62 78 Q 64 62 48 44 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 34 18 L 40 28 L 46 18" stroke="#db2777" stroke-width="1.4" fill="none"/>
                <path d="M 32 44 Q 30 62 28 79" stroke="#94a3b8" stroke-width="0.8" fill="none"/>
                <path d="M 40 44 Q 40 64 40 81" stroke="#94a3b8" stroke-width="0.8" fill="none"/>
                <path d="M 48 44 Q 50 62 52 79" stroke="#94a3b8" stroke-width="0.8" fill="none"/>
            `;
            break;

        // --- ВЕКТОРНЫЕ ЭСКИЗЫ МАЕК И ТОПОВ ---
        case 'top-tank-top':
            content = `
                <!-- Базовая майка в рубчик -->
                <path d="M 28 18 L 34 18 Q 36 29 40 29 Q 44 29 46 18 L 52 18 L 52 26 Q 48 42 50 56 Q 40 62 30 56 Q 32 42 28 26 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <!-- Рубчик фактура -->
                <line x1="36" y1="34" x2="36" y2="54" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="2,2"/>
                <line x1="40" y1="32" x2="40" y2="56" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="2,2"/>
                <line x1="44" y1="34" x2="44" y2="54" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="2,2"/>
                <!-- Дуга Анти-задир -->
                <path d="M 30 56 Q 40 61 50 56" stroke="#e11d48" stroke-width="1.2" fill="none"/>
            `;
            break;

        case 'top-smart-tee':
            content = `
                <!-- Анатомическая футболка -->
                <path d="M 25 19 L 16 32 L 22 34 L 27 26 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 55 19 L 64 32 L 58 34 L 53 26 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 27 18 L 53 18 L 53 26 L 52 56 L 28 56 L 27 26 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 34 18 Q 40 23 46 18" stroke="${stroke}" stroke-width="1.6" fill="none"/>
                <path d="M 28 56 Q 40 59 52 56" stroke="#10b981" stroke-width="1.0" fill="none"/>
            `;
            break;

        case 'top-oversize-tee':
            content = `
                <!-- Свободная оверсайз-футболка -->
                <path d="M 23 20 L 10 33 L 16 36 L 24 28 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 57 20 L 70 33 L 64 36 L 56 28 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 23 19 L 57 19 L 57 28 L 56 62 L 24 62 L 23 28 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 33 19 Q 40 24 47 19" stroke="${stroke}" stroke-width="1.6" fill="none"/>
                <!-- Накладной нагрудный кармашек -->
                <path d="M 45 32 L 51 32 L 51 38 L 48 40 L 45 38 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8"/>
                <line x1="24" y1="59" x2="56" y2="59" stroke="#64748b" stroke-width="0.8" stroke-dasharray="2,2"/>
            `;
            break;

        case 'top-asymmetric-tee':
            content = `
                <!-- Асимметричная футболка на одно плечо -->
                <path d="M 26 19 L 17 32 L 23 34 L 28 26 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Спущенное правое плечо -->
                <path d="M 53 26 L 62 36 L 56 38 L 50 30 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 28 18 Q 42 22 53 26 L 50 30 L 51 57 L 27 54 L 28 26 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <!-- Диагональный срез декольте -->
                <path d="M 28 18 Q 40 24 53 26" stroke="#6366f1" stroke-width="1.8" fill="none"/>
                <!-- Обнаженное плечо -->
                <circle cx="54" cy="22" r="3.0" fill="none" stroke="#6366f1" stroke-width="1.0" stroke-dasharray="2,2"/>
            `;
            break;

        case 'top-ruched-baby-tee':
            content = `
                <!-- Трендовая Baby-Tee на кулисках Y2K -->
                <path d="M 27 19 L 20 28 L 24 30 L 29 25 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 53 19 L 60 28 L 56 30 L 51 25 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 29 18 L 51 18 L 51 25 L 49 46 L 31 46 L 29 25 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 35 18 Q 40 22 45 18" stroke="${stroke}" stroke-width="1.5" fill="none"/>
                <!-- Боковые драпировки и кулиски -->
                <path d="M 31 28 Q 33 30 31 32 Q 33 34 31 36 Q 33 38 31 40 Q 33 42 31 44" stroke="#db2777" stroke-width="1.4" fill="none"/>
                <path d="M 49 28 Q 47 30 49 32 Q 47 34 49 36 Q 47 38 49 40 Q 47 42 49 44" stroke="#db2777" stroke-width="1.4" fill="none"/>
                <!-- Завязки шнурков снизу -->
                <path d="M 31 46 Q 30 52 27 54" stroke="#db2777" stroke-width="1.4" fill="none"/>
                <path d="M 49 46 Q 50 52 53 54" stroke="#db2777" stroke-width="1.4" fill="none"/>
            `;
            break;

        case 'top-underboob-crop-tee':
            content = `
                <!-- Ультра-кроп футболка «Underboob» -->
                <path d="M 26 19 L 19 27 L 23 29 L 28 24 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 54 19 L 61 27 L 57 29 L 52 24 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Высокий закрытый воротник + ультра-кроп с дугой Underboob -->
                <path d="M 28 18 L 52 18 L 52 24 L 51 36 Q 40 27 29 36 L 28 24 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 35 18 Q 40 21 45 18" stroke="${stroke}" stroke-width="1.8" fill="none"/>
                <!-- Арочная линия Underboob -->
                <path d="M 29 36 Q 40 27 51 36" stroke="#e11d48" stroke-width="2.2" fill="none"/>
                <!-- Контур обнаженной груди -->
                <circle cx="35" cy="34" r="4.0" fill="none" stroke="#f43f5e" stroke-width="1.0" stroke-dasharray="2,2"/>
                <circle cx="45" cy="34" r="4.0" fill="none" stroke="#f43f5e" stroke-width="1.0" stroke-dasharray="2,2"/>
            `;
            break;

        case 'top-cutout-laceup-tee':
            content = `
                <!-- Футболка с декольте-шнуровкой «Peek-a-Boo» -->
                <path d="M 26 19 L 18 30 L 23 32 L 28 25 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 54 19 L 62 30 L 57 32 L 52 25 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 28 18 L 52 18 L 52 25 L 50 48 L 30 48 L 28 25 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 35 18 Q 40 21 45 18" stroke="${stroke}" stroke-width="1.5" fill="none"/>
                <!-- Овальный вырез декольте Peek-a-Boo -->
                <ellipse cx="40" cy="31" rx="5.5" ry="8.5" fill="#fff1f2" stroke="#e11d48" stroke-width="1.5"/>
                <!-- Перекрестная шнуровка -->
                <line x1="36" y1="26" x2="44" y2="30" stroke="#e11d48" stroke-width="1.2"/>
                <line x1="44" y1="26" x2="36" y2="30" stroke="#e11d48" stroke-width="1.2"/>
                <line x1="36" y1="31" x2="44" y2="35" stroke="#e11d48" stroke-width="1.2"/>
                <line x1="44" y1="31" x2="36" y2="35" stroke="#e11d48" stroke-width="1.2"/>
            `;
            break;

        case 'top-backless-mesh-tee':
            content = `
                <!-- Футболка с открытой спиной на завязках -->
                <path d="M 26 19 L 18 30 L 23 32 L 27 25 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 54 19 L 62 30 L 57 32 L 53 25 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Контур спинки с глубоким вырезом -->
                <path d="M 28 18 L 52 18 L 52 25 L 49 52 L 31 52 L 28 25 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Глубокий овальный вырез спины до талии -->
                <path d="M 34 18 Q 36 38 40 46 Q 44 38 46 18 Z" fill="#f8fafc" stroke="#8b5cf6" stroke-width="1.6"/>
                <!-- Завязки с бантиками на лопатках и талии -->
                <line x1="36" y1="28" x2="44" y2="28" stroke="#8b5cf6" stroke-width="1.5"/>
                <circle cx="40" cy="28" r="1.5" fill="#8b5cf6"/>
                <line x1="38" y1="42" x2="42" y2="42" stroke="#8b5cf6" stroke-width="1.5"/>
                <circle cx="40" cy="42" r="1.5" fill="#8b5cf6"/>
            `;
            break;

        case 'top-racerback':
            content = `
                <!-- Майка-борцовка (Racerback) -->
                <path d="M 30 18 L 35 18 L 38 30 L 42 30 L 45 18 L 50 18 L 50 26 Q 44 38 48 55 Q 40 58 32 55 Q 36 38 30 26 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <path d="M 35 18 Q 40 27 45 18" stroke="${stroke}" stroke-width="1.4" fill="none"/>
                <!-- Т-образный вырез сзади -->
                <path d="M 39 30 L 39 42" stroke="#2563eb" stroke-width="1.3" stroke-dasharray="2,2"/>
                <path d="M 41 30 L 41 42" stroke="#2563eb" stroke-width="1.3" stroke-dasharray="2,2"/>
            `;
            break;

        case 'top-halter-top':
            content = `
                <!-- Топ с американской проймой -->
                <path d="M 34 18 L 46 18 L 51 28 Q 47 42 49 54 L 31 54 Q 33 42 29 28 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <!-- Диагональный срез -->
                <line x1="34" y1="18" x2="29" y2="28" stroke="#d97706" stroke-width="1.8"/>
                <line x1="46" y1="18" x2="51" y2="28" stroke="#d97706" stroke-width="1.8"/>
                <circle cx="40" cy="19" r="2.5" fill="#d97706"/>
            `;
            break;

        case 'top-camisole':
            content = `
                <!-- Шелковый камисоль -->
                <line x1="32" y1="18" x2="34" y2="28" stroke="${stroke}" stroke-width="1.0"/>
                <line x1="48" y1="18" x2="46" y2="28" stroke="${stroke}" stroke-width="1.0"/>
                <path d="M 34 28 L 40 37 L 46 28 L 50 31 L 49 55 L 31 55 L 30 31 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <!-- Кружевная кромка -->
                <path d="M 34 28 Q 37 32 40 37 Q 43 32 46 28" stroke="#9333ea" stroke-width="1.2" stroke-dasharray="2,1.5" fill="none"/>
            `;
            break;

        case 'top-bustier-crop':
            content = `
                <!-- Топ-корсаж с подгрудным рельефом -->
                <path d="M 30 22 L 50 22 L 50 30 Q 48 37 47 43 L 33 43 Q 32 37 30 30 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <!-- Подгрудная анатомическая дуга -->
                <path d="M 30 31 Q 35 36 40 32 Q 45 36 50 31" stroke="#e11d48" stroke-width="1.5" fill="none"/>
                <!-- Вертикальные корсетные ребра -->
                <line x1="36" y1="33" x2="36" y2="43" stroke="#e11d48" stroke-width="1.0"/>
                <line x1="44" y1="33" x2="44" y2="43" stroke="#e11d48" stroke-width="1.0"/>
            `;
            break;

        case 'top-low-back':
            content = `
                <!-- Вечерний топ с открытой спиной (Cross-Strap) -->
                <path d="M 30 20 L 50 20 L 49 32 Q 48 42 48 54 L 32 54 Q 32 42 31 32 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Перекрестные бретели сзади -->
                <line x1="31" y1="21" x2="48" y2="45" stroke="#4f46e5" stroke-width="1.3"/>
                <line x1="49" y1="21" x2="32" y2="45" stroke="#4f46e5" stroke-width="1.3"/>
                <circle cx="40" cy="33" r="1.5" fill="#4f46e5"/>
            `;
            break;

        case 'top-open-cup':
            content = `
                <!-- Топ с открытой грудью (Shelf Bra) -->
                <line x1="30" y1="18" x2="30" y2="34" stroke="${stroke}" stroke-width="1.2"/>
                <line x1="50" y1="18" x2="50" y2="34" stroke="${stroke}" stroke-width="1.2"/>
                <!-- Балконет под грудью -->
                <path d="M 30 34 Q 35 39 40 35 Q 45 39 50 34 L 49 44 L 31 44 Z" fill="#fff1f2" stroke="#e11d48" stroke-width="${strokeWidth}"/>
                <!-- Открытая грудь -->
                <circle cx="35" cy="29" r="3.5" fill="none" stroke="#f43f5e" stroke-width="1.0" stroke-dasharray="2,2"/>
                <circle cx="45" cy="29" r="3.5" fill="none" stroke="#f43f5e" stroke-width="1.0" stroke-dasharray="2,2"/>
                <line x1="31" y1="44" x2="49" y2="44" stroke="#e11d48" stroke-width="1.8"/>
            `;
            break;

        case 'top-plunging-mesh':
            content = `
                <!-- Боди-топ из сетки с глубоким декольте -->
                <path d="M 28 18 L 52 18 L 51 28 Q 47 40 48 55 L 32 55 Q 33 40 29 28 Z" fill="#f1f5f9" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- V-вырез до пояса -->
                <path d="M 35 18 L 40 48 L 45 18" stroke="#e11d48" stroke-width="1.6" fill="none"/>
                <!-- Перемычки-портупеи -->
                <line x1="37" y1="28" x2="43" y2="28" stroke="#e11d48" stroke-width="1.2"/>
                <line x1="38" y1="36" x2="42" y2="36" stroke="#e11d48" stroke-width="1.2"/>
            `;
            break;

        case 'top-strappy-cage':
            content = `
                <!-- Кружевной микро-топ с портупеями -->
                <path d="M 31 24 L 36 33 L 26 33 Z" fill="#fdf2f8" stroke="#db2777" stroke-width="1.2"/>
                <path d="M 49 24 L 54 33 L 44 33 Z" fill="#fdf2f8" stroke="#db2777" stroke-width="1.2"/>
                <!-- Портупейные ленты -->
                <line x1="31" y1="18" x2="31" y2="24" stroke="#db2777" stroke-width="1.2"/>
                <line x1="49" y1="18" x2="49" y2="24" stroke="#db2777" stroke-width="1.2"/>
                <line x1="24" y1="34" x2="56" y2="34" stroke="#db2777" stroke-width="2.0"/>
                <line x1="26" y1="40" x2="54" y2="40" stroke="#db2777" stroke-width="1.5"/>
                <line x1="28" y1="46" x2="52" y2="46" stroke="#db2777" stroke-width="1.5"/>
            `;
            break;

        case 'top-o-ring-top':
            content = `
                <!-- Кроп-топ с кольцом O-Ring и перемычками -->
                <circle cx="40" cy="32" r="4.5" fill="#ffffff" stroke="#d97706" stroke-width="1.8"/>
                <line x1="37" y1="29" x2="28" y2="18" stroke="#d97706" stroke-width="1.5"/>
                <line x1="43" y1="29" x2="52" y2="18" stroke="#d97706" stroke-width="1.5"/>
                <line x1="36" y1="34" x2="26" y2="42" stroke="#d97706" stroke-width="1.8"/>
                <line x1="44" y1="34" x2="54" y2="42" stroke="#d97706" stroke-width="1.8"/>
                <path d="M 26 42 Q 40 45 54 42" stroke="#d97706" stroke-width="2.0" fill="none"/>
            `;
            break;

        case 'skirt-wrap-micro-pleated':
            content = `
                <!-- Микро с запахом и складками -->
                <path d="M 28 20 L 52 20 L 52 24 L 28 24 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 28 24 L 22 52 L 48 52 L 52 24 Z" fill="#f1f5f9" stroke="${stroke}" stroke-width="1.0"/>
                <path d="M 28 24 L 52 24 L 58 50 L 36 53 L 26 42 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Мелкие складки -->
                <line x1="30" y1="28" x2="28" y2="52" stroke="#6366f1" stroke-width="0.9"/>
                <line x1="35" y1="28" x2="33" y2="52.5" stroke="#6366f1" stroke-width="0.9"/>
                <line x1="40" y1="28" x2="39" y2="52.5" stroke="#6366f1" stroke-width="0.9"/>
                <line x1="45" y1="28" x2="45" y2="51.5" stroke="#6366f1" stroke-width="0.9"/>
                <line x1="50" y1="28" x2="51" y2="50.5" stroke="#6366f1" stroke-width="0.9"/>
            `;
            break;

        case 'skirt-double-high-slit':
            content = `
                <!-- Юбка с двумя высокими разрезами -->
                <path d="M 29 18 L 51 18 L 51 23 L 29 23 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 29 23 L 20 76 L 27 76 L 31 38 L 49 38 L 53 76 L 60 76 L 51 23 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <!-- Центральное полотнище -->
                <path d="M 32 38 L 33 76 L 47 76 L 48 38 Z" fill="#f8fafc" stroke="${stroke}" stroke-width="1.0"/>
                <!-- Линии разрезов с акцентными точками -->
                <line x1="31" y1="38" x2="31" y2="76" stroke="#f43f5e" stroke-width="1.4"/>
                <line x1="49" y1="38" x2="49" y2="76" stroke="#f43f5e" stroke-width="1.4"/>
                <circle cx="31" cy="38" r="1.3" fill="#f43f5e"/>
                <circle cx="49" cy="38" r="1.3" fill="#f43f5e"/>
            `;
            break;

        case 'skirt-ruched-drawstring':
            content = `
                <!-- Юбка с асимметричной кулиской -->
                <path d="M 28 20 L 52 20 L 52 24 L 28 24 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 28 24 L 22 68 Q 38 70 54 52 L 52 24 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Диагональные складки сборки 1.6x -->
                <path d="M 25 36 Q 38 33 53 30" stroke="#a855f7" stroke-width="1.1" fill="none"/>
                <path d="M 24 48 Q 38 45 53.5 40" stroke="#a855f7" stroke-width="1.1" fill="none"/>
                <path d="M 23 60 Q 38 56 54 50" stroke="#a855f7" stroke-width="1.1" fill="none"/>
                <!-- Кулиска справа с завязками -->
                <line x1="52" y1="24" x2="54" y2="52" stroke="#a855f7" stroke-width="1.6" stroke-dasharray="2,2"/>
                <path d="M 54 52 Q 52 59 50 64 M 54 52 Q 57 59 56 65" stroke="#7c3aed" stroke-width="1.3" fill="none"/>
            `;
            break;

        case 'skirt-booty-shorts':
            content = `
                <!-- Микро-шорты с вырезом ягодиц -->
                <path d="M 24 24 L 56 24 L 56 29 L 24 29 Z" fill="#e2e8f0" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 24 29 L 22 42 Q 28 47 36 43 L 40 40 L 44 43 Q 52 47 58 42 L 56 29 Z" fill="#fdf2f8" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Фигурная дуга среза Booty Cut -->
                <path d="M 22 42 Q 28 47 36 43" stroke="#ec4899" stroke-width="1.6" fill="none"/>
                <path d="M 44 43 Q 52 47 58 42" stroke="#ec4899" stroke-width="1.6" fill="none"/>
                <line x1="40" y1="29" x2="40" y2="40" stroke="#94a3b8" stroke-width="1.0"/>
            `;
            break;

        case 'skirt-garter-peplum':
            content = `
                <!-- Пояс-баска с пажами для чулок -->
                <path d="M 27 24 L 53 24 L 53 28 L 27 28 Z" fill="#fde68a" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 27 28 L 22 42 Q 40 46 58 42 L 53 28 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- 4 пажа для чулок -->
                <line x1="30" y1="41" x2="30" y2="58" stroke="#d97706" stroke-width="1.4"/>
                <line x1="37" y1="43" x2="37" y2="60" stroke="#d97706" stroke-width="1.4"/>
                <line x1="43" y1="43" x2="43" y2="60" stroke="#d97706" stroke-width="1.4"/>
                <line x1="50" y1="41" x2="50" y2="58" stroke="#d97706" stroke-width="1.4"/>
                <!-- Клипсы -->
                <rect x="28.5" y="58" width="3" height="4" rx="0.5" fill="#f59e0b" stroke="${stroke}" stroke-width="0.8"/>
                <rect x="35.5" y="60" width="3" height="4" rx="0.5" fill="#f59e0b" stroke="${stroke}" stroke-width="0.8"/>
                <rect x="41.5" y="60" width="3" height="4" rx="0.5" fill="#f59e0b" stroke="${stroke}" stroke-width="0.8"/>
                <rect x="48.5" y="58" width="3" height="4" rx="0.5" fill="#f59e0b" stroke="${stroke}" stroke-width="0.8"/>
            `;
            break;

        case 'panties-tie-side-thong':
            content = `
                <!-- Стринги на тонких завязках -->
                <path d="M 26 28 Q 40 33 54 28 L 52 33 Q 44 42 42 61 L 38 61 Q 36 42 28 33 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Боковые завязки-бантики -->
                <path d="M 26 28 Q 18 24 13 29 M 26 28 Q 17 32 14 36" stroke="#f43f5e" stroke-width="1.4" fill="none"/>
                <path d="M 54 28 Q 62 24 67 29 M 54 28 Q 63 32 66 36" stroke="#f43f5e" stroke-width="1.4" fill="none"/>
                <circle cx="26" cy="28" r="1.3" fill="#f43f5e"/>
                <circle cx="54" cy="28" r="1.3" fill="#f43f5e"/>
            `;
            break;

        case 'panties-cage-lingerie':
            content = `
                <!-- Портупейные трусики Cage -->
                <path d="M 26 30 Q 40 35 54 30 L 52 35 Q 44 44 42 61 L 38 61 Q 36 44 28 35 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Стреп-ленты на бедрах и талии -->
                <line x1="20" y1="22" x2="60" y2="22" stroke="#db2777" stroke-width="1.4"/>
                <line x1="20" y1="22" x2="26" y2="30" stroke="#db2777" stroke-width="1.2"/>
                <line x1="60" y1="22" x2="54" y2="30" stroke="#db2777" stroke-width="1.2"/>
                <line x1="16" y1="28" x2="27" y2="34" stroke="#db2777" stroke-width="1.2"/>
                <line x1="64" y1="28" x2="53" y2="34" stroke="#db2777" stroke-width="1.2"/>
                <circle cx="40" cy="22" r="1.5" fill="#fbcfe8" stroke="#db2777" stroke-width="1"/>
            `;
            break;

        case 'panties-high-leg-bodysuit':
            content = `
                <!-- Слитное боди с высоким бедром -->
                <path d="M 30 14 L 35 14 L 37 28 Q 40 30 43 28 L 45 14 L 50 14 L 52 28 Q 50 40 50 48 Q 44 48 42 66 L 38 66 Q 36 48 30 48 Q 30 40 28 28 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <!-- Высокая арка бедра до талии -->
                <path d="M 30 48 Q 36 48 38 66" stroke="#4f46e5" stroke-width="1.6" fill="none"/>
                <path d="M 50 48 Q 44 48 42 66" stroke="#4f46e5" stroke-width="1.6" fill="none"/>
                <path d="M 35 14 Q 40 24 45 14" stroke="${stroke}" stroke-width="1.3" fill="none"/>
            `;
            break;

        case 'top-extreme-crop':
            content = `
                <!-- Ультра-короткий кроп-топ (Underbust) -->
                <path d="M 29 18 L 34 18 Q 36 26 40 26 Q 44 26 46 18 L 51 18 L 52 27 Q 48 34 49 39 L 31 39 Q 32 34 28 27 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <line x1="31" y1="39" x2="49" y2="39" stroke="#e11d48" stroke-width="2.0"/>
                <!-- Подгрудные дуги чашек -->
                <path d="M 32 36 Q 36 33 40 37 Q 44 33 48 36" stroke="#e11d48" stroke-width="1.2" fill="none"/>
            `;
            break;

        case 'top-front-laceup':
            content = `
                <!-- Топ на передней шнуровке -->
                <path d="M 28 18 L 34 18 L 36 26 L 36 50 L 30 50 Q 31 38 28 26 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <path d="M 52 18 L 46 18 L 44 26 L 44 50 L 50 50 Q 49 38 52 26 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Шнуровка крест-накрест между 36 и 44 -->
                <line x1="36" y1="28" x2="44" y2="34" stroke="#d97706" stroke-width="1.4"/>
                <line x1="44" y1="28" x2="36" y2="34" stroke="#d97706" stroke-width="1.4"/>
                <line x1="36" y1="36" x2="44" y2="42" stroke="#d97706" stroke-width="1.4"/>
                <line x1="44" y1="36" x2="36" y2="42" stroke="#d97706" stroke-width="1.4"/>
                <line x1="36" y1="44" x2="44" y2="50" stroke="#d97706" stroke-width="1.4"/>
                <line x1="44" y1="44" x2="36" y2="50" stroke="#d97706" stroke-width="1.4"/>
                <!-- Бантик снизу -->
                <circle cx="40" cy="51" r="1.3" fill="#d97706"/>
            `;
            break;

        case 'top-keyhole-halter':
            content = `
                <!-- Холтер-топ с капелькой и ошейником -->
                <!-- Воротник-чокер -->
                <path d="M 33 14 L 47 14 L 47 19 L 33 19 Z" fill="#312e81" stroke="${stroke}" stroke-width="1.4"/>
                <path d="M 33 19 L 28 29 Q 32 38 31 46 L 49 46 Q 48 38 52 29 L 47 19 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Овальный вырез-капелька -->
                <ellipse cx="40" cy="28" rx="4" ry="5.5" fill="#fdf2f8" stroke="#9333ea" stroke-width="1.5"/>
                <circle cx="40" cy="16.5" r="1.2" fill="#fde68a"/>
            `;
            break;

        case 'top-curtain-top':
            content = `
                <!-- Топ со сборками-шторками -->
                <path d="M 28 22 L 52 22 L 50 44 L 30 44 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <!-- Верхняя и нижняя кулиски со сборками -->
                <line x1="26" y1="22" x2="54" y2="22" stroke="#ec4899" stroke-width="2.0"/>
                <line x1="26" y1="44" x2="54" y2="44" stroke="#ec4899" stroke-width="2.0"/>
                <line x1="35" y1="24" x2="34" y2="42" stroke="#f472b6" stroke-width="1.0" stroke-dasharray="2,2"/>
                <line x1="45" y1="24" x2="46" y2="42" stroke="#f472b6" stroke-width="1.0" stroke-dasharray="2,2"/>
                <path d="M 26 22 Q 22 20 20 23 M 54 22 Q 58 20 60 23" stroke="#ec4899" stroke-width="1.2" fill="none"/>
                <path d="M 26 44 Q 22 46 20 49 M 54 44 Q 58 46 60 49" stroke="#ec4899" stroke-width="1.2" fill="none"/>
            `;
            break;

        case 'corset-underbust-corset':
            content = `
                <!-- Подгрудный корсет -->
                <path d="M 24 30 Q 32 26 40 32 Q 48 26 56 30 L 53 58 Q 40 64 27 58 Z" fill="#ffe4e6" stroke="#e11d48" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <!-- Талиевый перехват и косточки -->
                <path d="M 27 43 Q 40 45 53 43" stroke="#e11d48" stroke-width="1.2" stroke-dasharray="2,2" fill="none"/>
                <line x1="32" y1="28" x2="33" y2="59" stroke="#be123c" stroke-width="1.3"/>
                <line x1="40" y1="32" x2="40" y2="63" stroke="#be123c" stroke-width="1.5"/>
                <line x1="48" y1="28" x2="47" y2="59" stroke="#be123c" stroke-width="1.3"/>
                <!-- Застежка/люверсы по центру -->
                <circle cx="40" cy="38" r="1.5" fill="#be123c"/>
                <circle cx="40" cy="46" r="1.5" fill="#be123c"/>
                <circle cx="40" cy="54" r="1.5" fill="#be123c"/>
            `;
            break;

        case 'corset-waspie-belt':
            content = `
                <!-- Пояс-корсаж Waspie -->
                <path d="M 25 36 Q 40 30 55 36 L 53 52 Q 40 58 27 52 Z" fill="#fef3c7" stroke="#d97706" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <line x1="33" y1="34" x2="34" y2="53" stroke="#b45309" stroke-width="1.4"/>
                <line x1="40" y1="30" x2="40" y2="57" stroke="#b45309" stroke-width="1.6"/>
                <line x1="47" y1="34" x2="46" y2="53" stroke="#b45309" stroke-width="1.4"/>
                <!-- Шнуровка крест-накрест -->
                <line x1="38" y1="36" x2="42" y2="42" stroke="#d97706" stroke-width="1.2"/>
                <line x1="42" y1="36" x2="38" y2="42" stroke="#d97706" stroke-width="1.2"/>
                <line x1="38" y1="44" x2="42" y2="50" stroke="#d97706" stroke-width="1.2"/>
                <line x1="42" y1="44" x2="38" y2="50" stroke="#d97706" stroke-width="1.2"/>
            `;
            break;

        case 'corset-boudoir-kimono':
            content = `
                <!-- Шелковое кимоно -->
                <path d="M 28 20 L 52 20 L 58 35 L 50 35 L 53 66 L 27 66 L 30 35 L 22 35 Z" fill="#f3e8ff" stroke="#7e22ce" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <!-- Запах кимоно -->
                <path d="M 33 20 L 48 45 L 30 66" stroke="#9333ea" stroke-width="1.4" fill="none"/>
                <!-- Пояс с бантом -->
                <rect x="28" y="42" width="24" height="4" rx="1" fill="#7e22ce"/>
                <circle cx="48" cy="44" r="2.5" fill="#a855f7"/>
                <path d="M 49 45 L 53 56" stroke="#7e22ce" stroke-width="1.6"/>
            `;
            break;

        case 'corset-bell-peignoir':
            content = `
                <!-- Сетчатый пеньюар Bell-Sleeve -->
                <path d="M 32 20 L 48 20 L 49 32 L 60 68 L 20 68 L 31 32 Z" fill="#fdf2f8" stroke="#db2777" stroke-width="${strokeWidth}" stroke-dasharray="100" stroke-linejoin="round"/>
                <!-- Рукава-колокол -->
                <path d="M 32 20 L 18 36 L 10 58 Q 16 60 22 56 L 26 36" fill="#fce7f3" stroke="#db2777" stroke-width="1.4"/>
                <path d="M 48 20 L 62 36 L 70 58 Q 64 60 58 56 L 54 36" fill="#fce7f3" stroke="#db2777" stroke-width="1.4"/>
                <!-- Завязки под грудью -->
                <line x1="31" y1="33" x2="49" y2="33" stroke="#f43f5e" stroke-width="1.8"/>
                <circle cx="40" cy="33" r="2" fill="#e11d48"/>
                <path d="M 39 34 L 37 42 M 41 34 L 43 42" stroke="#e11d48" stroke-width="1.3"/>
            `;
            break;

        case 'corset-super-crop-shrug':
            content = `
                <!-- Экстремальное болеро с капюшоном -->
                <path d="M 30 20 Q 40 16 50 20 L 52 28 Q 40 32 28 28 Z" fill="#ecfdf5" stroke="#059669" stroke-width="${strokeWidth}"/>
                <!-- Длинные рукава с прорезью -->
                <path d="M 30 20 L 16 48 L 12 66 L 18 67 L 24 48 L 28 28" fill="#d1fae5" stroke="#059669" stroke-width="1.4"/>
                <path d="M 50 20 L 64 48 L 68 66 L 62 67 L 56 48 L 52 28" fill="#d1fae5" stroke="#059669" stroke-width="1.4"/>
                <!-- Прорези для пальцев -->
                <line x1="14" y1="61" x2="16" y2="61" stroke="#047857" stroke-width="2.0"/>
                <line x1="64" y1="61" x2="66" y2="61" stroke="#047857" stroke-width="2.0"/>
                <!-- Капюшон сзади -->
                <path d="M 32 20 Q 40 10 48 20" stroke="#059669" stroke-width="1.5" stroke-dasharray="2,2" fill="none"/>
            `;
            break;

        case 'corset-lounge-romper':
            content = `
                <!-- Домашний микро-ромпер -->
                <path d="M 32 18 L 32 24 L 30 42 L 26 58 Q 33 62 40 54 Q 47 62 54 58 L 50 42 L 48 24 L 48 18 Z" fill="#fff1f2" stroke="#e11d48" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                <!-- Бретели -->
                <line x1="33" y1="18" x2="33" y2="24" stroke="#e11d48" stroke-width="1.2"/>
                <line x1="47" y1="18" x2="47" y2="24" stroke="#e11d48" stroke-width="1.2"/>
                <!-- Планка с кнопками -->
                <line x1="40" y1="24" x2="40" y2="42" stroke="#be123c" stroke-width="1.2"/>
                <circle cx="40" cy="28" r="1.2" fill="#be123c"/>
                <circle cx="40" cy="34" r="1.2" fill="#be123c"/>
                <circle cx="40" cy="40" r="1.2" fill="#be123c"/>
                <!-- Кулиска талии -->
                <line x1="30" y1="42" x2="50" y2="42" stroke="#f43f5e" stroke-width="1.4" stroke-dasharray="2,1"/>
            `;
            break;

        case 'corset-french-maid-apron':
            content = `
                <!-- Кокетливый мини-передник -->
                <!-- Нагрудник -->
                <path d="M 34 22 L 46 22 L 48 34 L 32 34 Z" fill="#f8fafc" stroke="#4338ca" stroke-width="1.4"/>
                <!-- Бретели с оборками -->
                <line x1="34" y1="22" x2="30" y2="34" stroke="#4338ca" stroke-width="1.2"/>
                <line x1="46" y1="22" x2="50" y2="34" stroke="#4338ca" stroke-width="1.2"/>
                <!-- Пояс -->
                <rect x="26" y="34" width="28" height="4" fill="#3730a3"/>
                <!-- Полукруглый фартук с кружевной оборкой -->
                <path d="M 28 38 Q 28 58 40 58 Q 52 58 52 38 Z" fill="#ffffff" stroke="#4338ca" stroke-width="${strokeWidth}"/>
                <!-- Рюши по краю -->
                <path d="M 26 38 Q 25 60 40 60 Q 55 60 54 38" stroke="#818cf8" stroke-width="1.4" stroke-dasharray="3,2" fill="none"/>
                <!-- Бант сзади -->
                <path d="M 26 36 L 20 40 M 54 36 L 60 40" stroke="#3730a3" stroke-width="1.6"/>
            `;
            break;

        default:
            content = `<rect x="25" y="25" width="30" height="30" fill="#e2e8f0" stroke="${stroke}"/>`;
    }

    return `
        <svg viewBox="0 0 80 84" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" class="block shrink-0 drop-shadow-sm">
            <rect width="80" height="84" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
            ${content}
        </svg>
    `;
}

// Возвращает объект описания фасона по ID
function getStyleInfo(garmentType, styleId) {
    const list = STYLE_CATALOG[garmentType] || [];
    return list.find(item => item.id === styleId) || list[0];
}

// --- ИНТЕРАКТИВНЫЙ КАТАЛОГ И ИЛЛЮСТРАЦИИ В ИНТЕРФЕЙСЕ ---

function renderSkirtStyleCatalog() {
    const container = document.getElementById('skirt-catalog-container');
    if (!container) return;

    const styles = STYLE_CATALOG.skirt;
    const miniStyles = styles.filter(s => s.category === 'mini');
    const midiStyles = styles.filter(s => s.category === 'midi');

    const renderCard = (item) => {
        const isActive = state.skirtStyle === item.id;
        const photoBadge = item.image
            ? `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="camera" class="w-2.5 h-2.5"></i><span>Фото</span></span>`
            : `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="pen-tool" class="w-2.5 h-2.5"></i><span>Эскиз</span></span>`;

        const visualContent = item.image
            ? `<div class="relative w-full h-full group/thumb">
                   <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded-xl" onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');">
                   <div class="hidden w-full h-full flex items-center justify-center">${getStyleVectorSvg(item.vectorType, 60)}</div>
                   ${photoBadge}
                   <div class="absolute inset-0 bg-[#2C2825]/20 opacity-0 group-hover/thumb:opacity-100 rounded-xl flex items-center justify-center transition">
                       <span class="text-white text-xs bg-[#2C2825]/75 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
                   </div>
               </div>`
            : `<div class="relative w-full h-full group/thumb flex items-center justify-center">
                   ${getStyleVectorSvg(item.vectorType, 60)}
                   ${photoBadge}
                   <div class="absolute inset-0 bg-[#2C2825]/10 opacity-0 group-hover/thumb:opacity-100 rounded-xl flex items-center justify-center transition">
                       <span class="text-[#2C2825] text-xs bg-white/90 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
                   </div>
               </div>`;

        return `
            <div onclick="selectSkirtStyle('${item.id}', ${item.recLength})"
                 data-skirt-style="${item.id}"
                 class="skirt-style-card group flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer card-hover ${isActive ? 'border-2 border-[#E05A47] bg-[#FFF5F3] shadow-soft' : 'border-[#F0ECE1] bg-white hover:border-[#E3DDD0]'}">
                <div onclick="event.stopPropagation(); openLightbox('${item.image || ''}', '${item.name}', '${item.summary.replace(/'/g, "\\'")}', '${item.vectorType}');"
                     title="Нажмите для увеличения изображения"
                     class="w-16 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#F0ECE1] flex items-center justify-center relative cursor-zoom-in">
                    ${visualContent}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1">
                        <span class="text-xs font-bold text-[#2C2825] group-hover:text-[#E05A47] truncate">${item.name}</span>
                        <div class="flex items-center gap-1 shrink-0">
                            <span class="text-[9px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}">${item.badge}</span>
                            <button type="button" onclick="event.stopPropagation(); openLookbookModal('skirt', '${item.id}');" class="text-[10px] text-[#E05A47] hover:text-[#D04835] font-semibold hover:underline cursor-pointer">Детали ↗</button>
                        </div>
                    </div>
                    <p class="text-[11px] text-[#78716C] line-clamp-2 mt-1 leading-snug">${item.summary}</p>
                    <div class="flex items-center gap-2 mt-2 text-[10px] text-[#78716C]">
                        <span class="inline-flex items-center gap-1 font-medium"><i data-lucide="clock" class="w-3 h-3 text-[#A8A29E]"></i>${item.time}</span>
                        <span>•</span>
                        <span class="font-bold text-[#E05A47] bg-white border border-[#FCDAD5] px-1.5 py-0.5 rounded-md">~${item.recLength} см</span>
                    </div>
                </div>
            </div>
        `;
    };

    container.innerHTML = `
        <!-- Секция: МИНИ-ЮБКИ -->
        <div class="space-y-2">
            <div class="flex items-center justify-between border-b border-[#F0ECE1] pb-1.5">
                <div class="text-[11px] font-bold uppercase tracking-wider text-[#E05A47] flex items-center gap-1.5">
                    <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                    <span>Мини-юбки (30 – 45 см)</span>
                </div>
                <span class="text-[10px] text-[#78716C] font-medium">${miniStyles.length} моделей</span>
            </div>
            <div class="grid grid-cols-1 gap-2">
                ${miniStyles.map(renderCard).join('')}
            </div>
        </div>

        <!-- Секция: МИДИ И МАКСИ -->
        <div class="space-y-2 pt-2">
            <div class="flex items-center justify-between border-b border-[#F0ECE1] pb-1.5">
                <div class="text-[11px] font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-1.5">
                    <i data-lucide="scissors" class="w-3.5 h-3.5"></i>
                    <span>Миди и макси (50 – 100 см)</span>
                </div>
                <span class="text-[10px] text-[#78716C] font-medium">${midiStyles.length} моделей</span>
            </div>
            <div class="grid grid-cols-1 gap-2">
                ${midiStyles.map(renderCard).join('')}
            </div>
        </div>
    `;

    renderSkirtActiveDetails();
    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

function renderSkirtActiveDetails() {
    const target = document.getElementById('skirt-active-details');
    if (!target) return;

    const info = getStyleInfo('skirt', state.skirtStyle);
    if (!info) return;

    const curLen = Number(state.skirtLength) || 60;
    const isLenDiff = Math.abs(curLen - info.recLength) > 4;

    const photoBadge = info.image
        ? `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="camera" class="w-2.5 h-2.5"></i><span>Фото</span></span>`
        : `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="pen-tool" class="w-2.5 h-2.5"></i><span>Эскиз</span></span>`;

    const visual = info.image
        ? `<div onclick="openLookbookModal('skirt', '${info.id}')" title="Нажмите, чтобы открыть фото в полном размере" class="relative w-24 h-28 rounded-2xl overflow-hidden border border-[#F0ECE1] shadow-xs shrink-0 bg-[#FAF8F5] cursor-zoom-in group/img">
               <img src="${info.image}" alt="${info.name}" class="w-full h-full object-cover transition group-hover/img:scale-105" onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');">
               <div class="hidden w-full h-full flex items-center justify-center">${getStyleVectorSvg(info.vectorType, 84)}</div>
               ${photoBadge}
               <div class="absolute inset-0 bg-[#2C2825]/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition">
                   <span class="text-white text-xs bg-[#2C2825]/75 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
               </div>
           </div>`
        : `<div onclick="openLookbookModal('skirt', '${info.id}')" title="Нажмите, чтобы открыть эскиз в Лукбуке" class="relative w-24 h-28 shrink-0 rounded-2xl overflow-hidden border border-[#F0ECE1] shadow-xs bg-[#FAF8F5] flex items-center justify-center cursor-zoom-in group/img">
               ${getStyleVectorSvg(info.vectorType, 84)}
               ${photoBadge}
               <div class="absolute inset-0 bg-[#2C2825]/10 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition">
                   <span class="text-[#2C2825] text-xs bg-white/90 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
               </div>
           </div>`;

    target.innerHTML = `
        <div class="bg-gradient-to-br from-[#FFF5F3] to-[#FAF8F5] border border-[#FCDAD5] rounded-2xl p-3.5 shadow-xs space-y-3">
            <div class="flex items-start gap-3">
                ${visual}
                <div class="flex-1 min-w-0 space-y-1.5">
                    <div class="flex items-center justify-between gap-1 flex-wrap">
                        <h4 class="text-xs font-bold text-[#2C2825]">${info.name}</h4>
                        <div class="flex items-center gap-1">
                            <span class="text-[9px] font-semibold px-2 py-0.5 rounded-full border ${info.badgeColor}">${info.badge}</span>
                            <button onclick="openLookbookModal('skirt', '${info.id}')" class="text-[10px] text-[#E05A47] hover:text-[#D04835] font-bold bg-white border border-[#FCDAD5] hover:border-[#E05A47] px-2 py-0.5 rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer">
                                <i data-lucide="book-open" class="w-3 h-3"></i><span>Лукбук</span>
                            </button>
                        </div>
                    </div>
                    <p class="text-[11px] text-[#78716C] leading-snug">${info.summary}</p>
                    <div class="text-[10px] text-[#78716C] pt-0.5 space-y-1">
                        <div><b>Ткани:</b> ${info.fabrics}</div>
                        <div><b>Крой:</b> ${info.cutTip}</div>
                        <div class="flex items-center gap-3 pt-0.5 text-[#2C2825] font-medium">
                            <span><b>Сложность:</b> ${info.difficulty}</span>
                            <span>•</span>
                            <span><b>Пошив:</b> ${info.time}</span>
                        </div>
                    </div>
                </div>
            </div>

            ${isLenDiff ? `
                <div class="flex items-center justify-between bg-white/95 border border-[#F0ECE1] rounded-xl p-2.5 text-[11px] shadow-xs">
                    <span class="text-[#2C2825] font-medium">Длина на лекале <b>${curLen} см</b> (для этого фасона советуем <b>${info.recLength} см</b>)</span>
                    <button onclick="setSkirtLength(${info.recLength}); renderSkirtActiveDetails();" class="px-2.5 py-1 bg-[#E05A47] hover:bg-[#D04835] text-white rounded-lg font-bold text-[10px] transition shrink-0 ml-2 shadow-xs cursor-pointer">
                        Сделать ${info.recLength} см
                    </button>
                </div>
            ` : ''}
        </div>
    `;

    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

function selectSkirtStyle(styleId, recLength) {
    state.skirtStyle = styleId;
    const info = getStyleInfo('skirt', styleId);

    if (info && info.category === 'mini' && state.skirtLength > 50) {
        state.skirtLength = recLength || info.recLength || 40;
        const numEl = document.getElementById('num-skirtLength');
        const lblEl = document.getElementById('label-skirtLength');
        if (numEl) numEl.value = state.skirtLength;
        if (lblEl) lblEl.textContent = state.skirtLength + ' см';
    }

    document.querySelectorAll('[data-skirt-style]').forEach(el => {
        const isMatch = el.dataset.skirtStyle === styleId;
        el.className = `skirt-style-card group flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer card-hover ${isMatch ? 'border-2 border-[#E05A47] bg-[#FFF5F3] shadow-soft' : 'border-[#F0ECE1] bg-white hover:border-[#E3DDD0]'}`;
    });

    renderSkirtActiveDetails();
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
    if (typeof showNotification === 'function') {
        showNotification(`Выбран фасон: ${info ? info.name : styleId}`);
    }
}

function renderPantiesActiveDetails() {
    const target = document.getElementById('panties-active-details');
    if (!target) return;

    const info = getStyleInfo('panties', state.pantiesModel || 'slips');
    if (!info) return;

    const photoBadge = info.image
        ? `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="camera" class="w-2.5 h-2.5"></i><span>Фото</span></span>`
        : `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="pen-tool" class="w-2.5 h-2.5"></i><span>Эскиз</span></span>`;

    target.innerHTML = `
        <div class="bg-gradient-to-br from-[#FFF5F3] to-[#FAF8F5] border border-[#FCDAD5] rounded-2xl p-3.5 shadow-xs space-y-3">
            <div class="flex items-start gap-3">
                <div onclick="openLightbox('${info.image || ''}', '${info.name}', '${info.summary.replace(/'/g, "\\'")}', '${info.vectorType}');" title="Нажмите, чтобы увеличить изображение" class="shrink-0 w-24 h-28 rounded-2xl overflow-hidden border border-[#F0ECE1] shadow-xs bg-[#FAF8F5] flex items-center justify-center cursor-zoom-in group/img relative">
                    ${info.image
                        ? `<img src="${info.image}" alt="${info.name}" class="w-full h-full object-cover transition group-hover/img:scale-105" onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');">
                           <div class="hidden w-full h-full flex items-center justify-center">${getStyleVectorSvg(info.vectorType, 72)}</div>`
                        : getStyleVectorSvg(info.vectorType, 72)}
                    ${photoBadge}
                    <div class="absolute inset-0 bg-[#2C2825]/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition">
                        <span class="text-white text-xs bg-[#2C2825]/75 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
                    </div>
                </div>
                <div class="flex-1 min-w-0 space-y-1.5">
                    <div class="flex items-center justify-between gap-1 flex-wrap">
                        <h4 class="text-xs font-bold text-[#2C2825]">${info.name}</h4>
                        <div class="flex items-center gap-1">
                            <span class="text-[9px] font-semibold px-2 py-0.5 rounded-full border ${info.badgeColor}">${info.badge}</span>
                            <button onclick="openLookbookModal('panties', '${info.id}')" class="text-[10px] text-[#E05A47] hover:text-[#D04835] font-bold bg-white border border-[#FCDAD5] hover:border-[#E05A47] px-2 py-0.5 rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer">
                                <i data-lucide="book-open" class="w-3 h-3"></i><span>Лукбук</span>
                            </button>
                        </div>
                    </div>
                    <p class="text-[11px] text-[#78716C] leading-snug">${info.summary}</p>
                    <div class="text-[10px] text-[#78716C] pt-0.5 space-y-1">
                        <div><b>Ткани:</b> ${info.fabrics}</div>
                        <div><b>Крой:</b> ${info.cutTip}</div>
                        <div class="flex items-center gap-3 pt-0.5 text-[#2C2825] font-medium">
                            <span><b>Сложность:</b> ${info.difficulty}</span>
                            <span>•</span>
                            <span><b>Пошив:</b> ${info.time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

function renderPantiesStyleCatalog() {
    const container = document.getElementById('panties-catalog-container');
    if (!container) return;

    const styles = STYLE_CATALOG.panties || [];

    const renderCard = (item) => {
        const isActive = (state.pantiesModel || 'slips') === item.id;
        const photoBadge = item.image
            ? `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="camera" class="w-2.5 h-2.5"></i><span>Фото</span></span>`
            : `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="pen-tool" class="w-2.5 h-2.5"></i><span>Эскиз</span></span>`;

        const visualContent = item.image
            ? `<div class="relative w-full h-full group/thumb">
                   <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded-xl" onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');">
                   <div class="hidden w-full h-full flex items-center justify-center">${getStyleVectorSvg(item.vectorType, 60)}</div>
                   ${photoBadge}
                   <div class="absolute inset-0 bg-[#2C2825]/20 opacity-0 group-hover/thumb:opacity-100 rounded-xl flex items-center justify-center transition">
                       <span class="text-white text-xs bg-[#2C2825]/75 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
                   </div>
               </div>`
            : `<div class="relative w-full h-full group/thumb flex items-center justify-center">
                   ${getStyleVectorSvg(item.vectorType, 60)}
                   ${photoBadge}
                   <div class="absolute inset-0 bg-[#2C2825]/10 opacity-0 group-hover/thumb:opacity-100 rounded-xl flex items-center justify-center transition">
                       <span class="text-[#2C2825] text-xs bg-white/90 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
                   </div>
               </div>`;

        return `
            <div onclick="setPantiesModel('${item.id}')"
                 data-model="${item.id}"
                 class="panties-style-card group flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer card-hover ${isActive ? 'border-2 border-[#E05A47] bg-[#FFF5F3] shadow-soft' : 'border-[#F0ECE1] bg-white hover:border-[#E3DDD0]'}">
                <div onclick="event.stopPropagation(); openLightbox('${item.image || ''}', '${item.name}', '${item.summary.replace(/'/g, "\\'")}', '${item.vectorType}');"
                     title="Нажмите для увеличения изображения"
                     class="w-16 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#F0ECE1] flex items-center justify-center relative cursor-zoom-in">
                    ${visualContent}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1">
                        <span class="text-xs font-bold text-[#2C2825] group-hover:text-[#E05A47] truncate">${item.name}</span>
                        <div class="flex items-center gap-1 shrink-0">
                            <span class="text-[9px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}">${item.badge}</span>
                            <button type="button" onclick="event.stopPropagation(); openLookbookModal('panties', '${item.id}');" class="text-[10px] text-[#E05A47] hover:text-[#D04835] font-semibold hover:underline cursor-pointer">Детали ↗</button>
                        </div>
                    </div>
                    <p class="text-[11px] text-[#78716C] line-clamp-2 mt-1 leading-snug">${item.summary}</p>
                    <div class="flex items-center gap-2 mt-2 text-[10px] text-[#78716C]">
                        <span class="inline-flex items-center gap-1 font-medium"><i data-lucide="clock" class="w-3 h-3 text-[#A8A29E]"></i>${item.time}</span>
                        <span>•</span>
                        <span class="text-[#78716C] font-medium">${item.difficulty}</span>
                    </div>
                </div>
            </div>
        `;
    };

    container.innerHTML = `
        <div class="grid grid-cols-1 gap-2">
            ${styles.map(renderCard).join('')}
        </div>
    `;

    renderPantiesActiveDetails();
    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

function renderDressActiveDetails() {
    const target = document.getElementById('dress-active-details');
    if (!target) return;

    const info = getStyleInfo('dress', state.dressStyle || 'dress-sheath');
    if (!info) return;

    const photoBadge = info.image
        ? `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="camera" class="w-2.5 h-2.5"></i><span>Фото</span></span>`
        : `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="pen-tool" class="w-2.5 h-2.5"></i><span>Эскиз</span></span>`;

    const visual = info.image
        ? `<div onclick="openLookbookModal('dress', '${info.id}')" title="Нажмите, чтобы открыть фото в полном размере" class="relative w-24 h-28 rounded-2xl overflow-hidden border border-[#F0ECE1] shadow-xs shrink-0 bg-[#FAF8F5] cursor-zoom-in group/img">
               <img src="${info.image}" alt="${info.name}" class="w-full h-full object-cover transition group-hover/img:scale-105" onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');">
               <div class="hidden w-full h-full flex items-center justify-center">${getStyleVectorSvg(info.vectorType, 84)}</div>
               ${photoBadge}
               <div class="absolute inset-0 bg-[#2C2825]/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition">
                   <span class="text-white text-xs bg-[#2C2825]/75 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
               </div>
           </div>`
        : `<div onclick="openLookbookModal('dress', '${info.id}')" title="Нажмите, чтобы открыть эскиз в Лукбуке" class="relative w-24 h-28 shrink-0 rounded-2xl overflow-hidden border border-[#F0ECE1] shadow-xs bg-[#FAF8F5] flex items-center justify-center cursor-zoom-in group/img">
               ${getStyleVectorSvg(info.vectorType, 84)}
               ${photoBadge}
               <div class="absolute inset-0 bg-[#2C2825]/10 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition">
                   <span class="text-[#2C2825] text-xs bg-white/90 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
               </div>
           </div>`;

    target.innerHTML = `
        <div class="bg-gradient-to-br from-[#FFF5F3] to-[#FAF8F5] border border-[#FCDAD5] rounded-2xl p-3.5 shadow-xs space-y-3">
            <div class="flex items-start gap-3">
                ${visual}
                <div class="flex-1 min-w-0 space-y-1.5">
                    <div class="flex items-center justify-between gap-1 flex-wrap">
                        <h4 class="text-xs font-bold text-[#2C2825]">${info.name}</h4>
                        <div class="flex items-center gap-1">
                            <span class="text-[9px] font-semibold px-2 py-0.5 rounded-full border ${info.badgeColor}">${info.badge}</span>
                            <button onclick="openLookbookModal('dress', '${info.id}')" class="text-[10px] text-[#E05A47] hover:text-[#D04835] font-bold bg-white border border-[#FCDAD5] hover:border-[#E05A47] px-2 py-0.5 rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer">
                                <i data-lucide="book-open" class="w-3 h-3"></i><span>Лукбук</span>
                            </button>
                        </div>
                    </div>
                    <p class="text-[11px] text-[#78716C] leading-snug">${info.summary}</p>
                    <div class="text-[10px] text-[#78716C] pt-0.5 space-y-1">
                        <div><b>Ткани:</b> ${info.fabrics}</div>
                        <div><b>Крой:</b> ${info.cutTip}</div>
                        <div class="flex items-center gap-3 pt-0.5 text-[#2C2825] font-medium">
                            <span><b>Сложность:</b> ${info.difficulty}</span>
                            <span>•</span>
                            <span><b>Пошив:</b> ${info.time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

function selectDressStyle(styleId) {
    state.dressStyle = styleId;
    const info = getStyleInfo('dress', styleId);
    if (info && info.preset) {
        if (info.preset.dartPosition) state.dartPosition = info.preset.dartPosition;
        if (info.preset.necklineType) state.necklineType = info.preset.necklineType;
        if (typeof info.preset.necklineDepth === 'number') state.necklineDepth = info.preset.necklineDepth;
        if (info.preset.sleeveLengthType) state.sleeveLengthType = info.preset.sleeveLengthType;
        if (info.preset.silhouette) state.silhouette = info.preset.silhouette;
    }

    syncDressControlsUI();

    document.querySelectorAll('[data-dress-style]').forEach(el => {
        const isMatch = el.dataset.dressStyle === styleId;
        el.className = `dress-style-card group flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer card-hover ${isMatch ? 'border-2 border-[#E05A47] bg-[#FFF5F3] shadow-soft' : 'border-[#F0ECE1] bg-white hover:border-[#E3DDD0]'}`;
    });

    renderDressActiveDetails();
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();
    if (typeof showNotification === 'function') {
        showNotification(`Выбран фасон: ${info ? info.name : styleId}`);
    }
}

function syncDressControlsUI() {
    document.querySelectorAll('.dart-btn').forEach(btn => {
        const isMatch = btn.dataset.dart === state.dartPosition;
        btn.className = isMatch
            ? "dart-btn p-2.5 rounded-xl text-left border-2 border-[#E05A47] bg-[#FFF5F3] font-semibold text-[#2C2825] transition cursor-pointer"
            : "dart-btn p-2.5 rounded-xl text-left border border-[#F0ECE1] bg-white hover:border-[#E3DDD0] text-[#78716C] transition cursor-pointer";
    });

    document.querySelectorAll('.neckline-btn').forEach(btn => {
        const isMatch = btn.dataset.neckline === state.necklineType;
        btn.className = isMatch
            ? "neckline-btn p-2.5 rounded-xl text-left border-2 border-[#E05A47] bg-[#FFF5F3] font-semibold text-[#2C2825] transition cursor-pointer"
            : "neckline-btn p-2.5 rounded-xl text-left border border-[#F0ECE1] bg-white hover:border-[#E3DDD0] text-[#78716C] transition cursor-pointer";
    });

    const depthVal = document.getElementById('neckline-depth-val');
    const rngDepth = document.getElementById('rng-neckline-depth');
    if (depthVal) depthVal.textContent = state.necklineDepth || 0;
    if (rngDepth) rngDepth.value = state.necklineDepth || 0;

    document.querySelectorAll('.sleeve-length-btn').forEach(btn => {
        const isMatch = btn.dataset.sleeve === state.sleeveLengthType;
        btn.className = isMatch
            ? "sleeve-length-btn flex-1 py-1.5 px-2 text-xs font-bold rounded-lg bg-[#E05A47] text-white shadow-xs transition text-center"
            : "sleeve-length-btn flex-1 py-1.5 px-2 text-xs font-medium rounded-lg text-[#78716C] bg-white border border-[#F0ECE1] hover:text-[#2C2825] transition text-center";
    });

    document.querySelectorAll('.silhouette-btn').forEach(btn => {
        const isMatch = btn.dataset.silhouette === state.silhouette;
        btn.className = isMatch
            ? "silhouette-btn flex-1 py-1.5 px-2 text-xs font-bold rounded-lg bg-[#E05A47] text-white shadow-xs transition text-center"
            : "silhouette-btn flex-1 py-1.5 px-2 text-xs font-medium rounded-lg text-[#78716C] bg-white border border-[#F0ECE1] hover:text-[#2C2825] transition text-center";
    });
}

function renderDressStyleCatalog() {
    const container = document.getElementById('dress-catalog-container');
    if (!container) return;

    const styles = STYLE_CATALOG.dress || [];
    const basicStyles = styles.filter(s => s.category === 'basic');
    const cocktailStyles = styles.filter(s => s.category === 'cocktail');
    const casualStyles = styles.filter(s => s.category === 'casual');

    const renderCard = (item) => {
        const isActive = (state.dressStyle || 'dress-sheath') === item.id;
        const photoBadge = item.image
            ? `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="camera" class="w-2.5 h-2.5"></i><span>Фото</span></span>`
            : `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="pen-tool" class="w-2.5 h-2.5"></i><span>Эскиз</span></span>`;

        const visualContent = item.image
            ? `<div class="relative w-full h-full group/thumb">
                   <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded-xl" onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');">
                   <div class="hidden w-full h-full flex items-center justify-center">${getStyleVectorSvg(item.vectorType, 60)}</div>
                   ${photoBadge}
                   <div class="absolute inset-0 bg-[#2C2825]/20 opacity-0 group-hover/thumb:opacity-100 rounded-xl flex items-center justify-center transition">
                       <span class="text-white text-xs bg-[#2C2825]/75 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
                   </div>
               </div>`
            : `<div class="relative w-full h-full group/thumb flex items-center justify-center">
                   ${getStyleVectorSvg(item.vectorType, 60)}
                   ${photoBadge}
                   <div class="absolute inset-0 bg-[#2C2825]/10 opacity-0 group-hover/thumb:opacity-100 rounded-xl flex items-center justify-center transition">
                       <span class="text-[#2C2825] text-xs bg-white/90 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
                   </div>
               </div>`;

        return `
            <div onclick="selectDressStyle('${item.id}')"
                 data-dress-style="${item.id}"
                 class="dress-style-card group flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer card-hover ${isActive ? 'border-2 border-[#E05A47] bg-[#FFF5F3] shadow-soft' : 'border-[#F0ECE1] bg-white hover:border-[#E3DDD0]'}">
                <div onclick="event.stopPropagation(); openLightbox('${item.image || ''}', '${item.name}', '${item.summary.replace(/'/g, "\\'")}', '${item.vectorType}');"
                     title="Нажмите для увеличения изображения"
                     class="w-16 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#F0ECE1] flex items-center justify-center relative cursor-zoom-in">
                    ${visualContent}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1">
                        <span class="text-xs font-bold text-[#2C2825] group-hover:text-[#E05A47] truncate">${item.name}</span>
                        <div class="flex items-center gap-1 shrink-0">
                            <span class="text-[9px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}">${item.badge}</span>
                            <button type="button" onclick="event.stopPropagation(); openLookbookModal('dress', '${item.id}');" class="text-[10px] text-[#E05A47] hover:text-[#D04835] font-semibold hover:underline cursor-pointer">Детали ↗</button>
                        </div>
                    </div>
                    <p class="text-[11px] text-[#78716C] line-clamp-2 mt-1 leading-snug">${item.summary}</p>
                    <div class="flex items-center gap-2 mt-2 text-[10px] text-[#78716C]">
                        <span class="inline-flex items-center gap-1 font-medium"><i data-lucide="clock" class="w-3 h-3 text-[#A8A29E]"></i>${item.time}</span>
                        <span>•</span>
                        <span class="text-[#78716C]">${item.difficulty}</span>
                    </div>
                </div>
            </div>
        `;
    };

    container.innerHTML = `
        <!-- Секция 1: БАЗОВЫЕ И ДЕЛОВЫЕ -->
        <div class="space-y-2">
            <div class="flex items-center justify-between border-b border-[#F0ECE1] pb-1.5">
                <div class="text-[11px] font-bold uppercase tracking-wider text-[#E05A47] flex items-center gap-1.5">
                    <i data-lucide="briefcase" class="w-3.5 h-3.5"></i>
                    <span>Базовые и деловые</span>
                </div>
                <span class="text-[10px] text-[#78716C] font-medium">${basicStyles.length} модели</span>
            </div>
            <div class="grid grid-cols-1 gap-2">
                ${basicStyles.map(renderCard).join('')}
            </div>
        </div>

        <!-- Секция 2: КОКТЕЙЛЬНЫЕ И ВЕЧЕРНИЕ -->
        <div class="space-y-2 pt-2">
            <div class="flex items-center justify-between border-b border-[#F0ECE1] pb-1.5">
                <div class="text-[11px] font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-1.5">
                    <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                    <span>Коктейльные и вечерние</span>
                </div>
                <span class="text-[10px] text-[#78716C] font-medium">${cocktailStyles.length} модели</span>
            </div>
            <div class="grid grid-cols-1 gap-2">
                ${cocktailStyles.map(renderCard).join('')}
            </div>
        </div>

        <!-- Секция 3: ПОВСЕДНЕВНЫЕ И ЛЕТНИЕ -->
        <div class="space-y-2 pt-2">
            <div class="flex items-center justify-between border-b border-[#F0ECE1] pb-1.5">
                <div class="text-[11px] font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-1.5">
                    <i data-lucide="sun" class="w-3.5 h-3.5"></i>
                    <span>Повседневные и летние</span>
                </div>
                <span class="text-[10px] text-[#78716C] font-medium">${casualStyles.length} модели</span>
            </div>
            <div class="grid grid-cols-1 gap-2">
                ${casualStyles.map(renderCard).join('')}
            </div>
        </div>
    `;

    renderDressActiveDetails();
    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

// --- ИНТЕРАКТИВНОЕ МОДАЛЬНОЕ ОКНО ЛУКБУКА И ФОТО-ГАЛЕРЕИ ---

let currentLookbookGarment = 'skirt';
let currentLookbookStyleId = 'mini-trapeze';

function getStylingTip(garmentType, styleId) {
    const tips = {
        'mini-trapeze': 'Держит форму в положении сидя. Отлично сочетается с оверсайз-жакетом, укороченным кардиганом или кроп-топом.',
        'mini-pleated': 'Классический силуэт preppy. Кокетка на бедрах обеспечивает комфортную посадку, а складки эффектно играют при ходьбе.',
        'mini-wrap': 'Диагональная линия запаха визуально удлиняет ноги и создает динамичный силуэт.',
        'mini-slit': 'Аккуратный разрез придает образу пикантности, оставаясь в рамках минималистичной элегантности.',
        'mini-skater': 'Романтичный силуэт с красивыми струящимися фалдами при движении.',
        'mini-laceup': 'Шнуровка на боку — выразительный акцент. Можно затягивать плотно или оставлять свободную шнуровку с лентами.',
        'mini-ruched': 'Шнурками по бокам можно регулировать длину: от базовой длины 38 см до эффектного микро со сборкой.',
        'mini-micro': 'Эстетика Y2K. Рекомендуется сочетать с высокими гольфами, плотными колготками или массивной обувью.',
        'a-line': 'Универсальная база для повседневных образов. Скрывает нюансы фигуры и акцентирует талию.',
        'half-sun': 'Мягкие драпировки ткани смотрятся очень женственно и легко.',
        'sun': 'Максимальная пышность и легкость ткани для праздничных и вечерних образов.',
        'pencil': 'Строгий и соблазнительный силуэт, выгодно подчеркивающий плавный изгиб бедер.',
        'straight': 'Классика делового стиля. Подходит под любые строгие блейзеры и рубашки.',
        'slips': 'Анатомический комфорт на каждый день под любой тип повседневной одежды.',
        'braziliana': 'Кокетливый V-образный вырез сзади визуально приподнимает линию ягодиц.',
        'high-waist': 'Ретро-силуэт с акцентом на тонкую талию и плоский животик в винтажном стиле.',
        'thong': 'Полная незаметность под облегающими юбками, платьями и брюками.',
        'dolphin-shorts': 'Непринужденный домашний и курортный стиль. Контрастный кант и закругленные бока создают милый ретро-образ.',
        'strappy': 'Двойные стрепы на бедрах визуально сужают талию и создают гармоничный силуэт «песочные часы».',
        'dress-sheath': 'Эталонное базовое платье. Французская вытачка не перегружает полочку, создавая гладкий элегантный силуэт.',
        'dress-business': 'Идеально для офиса и деловых встреч. Вырез лодочка подчеркивает шею, а прямой крой гарантирует комфорт в течение всего дня.',
        'dress-relief': 'Вертикальные рельефы из проймы визуально вытягивают силуэт и создают безупречное прилегание по фигуре.',
        'dress-cocktail-v': 'V-образное декольте визуально стройнит и гармонично сочетается с короткими рукавами и приталенным лифом.',
        'dress-keyhole': 'Изящный вырез-капелька — деликатный акцент в портретной зоне, не требующий массивных украшений.',
        'dress-deep-v': 'Выразительное вечернее декольте с длинными рукавами создает потрясающий баланс открытости и утонченности.',
        'dress-trapeze': 'Свободный крой трапеции дарит легкость и комфорт в движении. Отлично подходит для льна, хлопка и шелка.',
        'dress-tunic': 'Универсальное платье-туника прямого кроя для быстрого пошива. Подходит как для дома, так и для летних прогулок.',
        'dress-flare-midi': 'Классический силуэт New Look: приталенный лиф и женственная струящаяся юбка А-силуэта с красивыми волнами.',
        'shoulder': 'Чистая базовая посадка полочки, идеально под пиджак или строгий блейзер.',
        'side': 'Французская вытачка переносит объем в бок, оставляя грудь и плечи идеально гладкими.',
        'waist': 'Идеально для приталенных платьев с ремешком или акцентным поясом.',
        'armhole': 'Элегантная плавная линия от проймы, подчеркивающая рельеф груди.',
        'keyhole': 'Вырез-капелька подчеркивает изящество ключиц и линии декольте.',
        'halter': 'Открытые плечи и спина — эффектно и элегантно для вечерних платьев.',
        'bustier': 'Корсетный силуэт подчеркивает фигуру без жестких неудобных косточек.',
        // Майки и футболки
        'smart-tee': 'Анатомический крой с высокой подмышкой предотвращает заломы ткани. Отлично смотрится заправленной в юбку или джинсы.',
        'oversize-tee': 'Спущенное плечо и удлиненный рукав создают расслабленный трендовый оверсайз. Отлично сочетается с микро-юбками и велосипедками.',
        'asymmetric-tee': 'Асимметричный срез горловины деликатно обнажает одно плечо. Идеальный баланс чувственности и непринужденности.',
        'ruched-baby-tee': 'Кулиски со шнурками позволяют регулировать степень сборки и высоту топа от талии до ультра-кропа.',
        'underboob-crop-tee': 'Ультра-кроп с арочным вырезом Underboob — эффектный акцент для стримов, фотосессий и дерзких образов.',
        'cutout-laceup-tee': 'Вырез-капля со шнуровкой создает выразительный фокус в кадре. Степень открытости легко регулируется затяжкой шнура.',
        'backless-mesh-tee': 'Интригующий контраст: лаконичный перед и полностью открытая чувственная спина с тончайшими завязками.',
        'tank-top': 'Базовая майка в рубчик кашкорсе. Система «Анти-задир» гарантирует идеальную посадку по фигуре при движении.',
        'racerback': 'Спинка-борцовка дарит свободу лопаткам на тренировках и подчеркивает спортивную осанку.',
        'halter-top': 'Американская пройма эффектно подчеркивает плечи и ключицы.',
        'camisole': 'Струящийся шелковый камисоль — элегантный топ для пиджака или самостоятельного вечернего выхода.',
        'bustier-crop': 'Корсетный подгрудный рельеф создает четкую архитектурную форму лифа.',
        'low-back': 'Глубокий вечерний вырез на спине с тонкими перекрестными бретелями.',
        'open-cup': 'Открытая чашка балконет надежно поддерживает грудь снизу, оставляя зону декольте свободной.',
        'plunging-mesh': 'Сетчатый боди-топ со стабилизированным глубоким декольте и акцентными стрепами.',
        'strappy-cage': 'Графика эластичных портупей формирует четкий геометрический силуэт.',
        'o-ring-top': 'Металлическое кольцо O-Ring в центре притягивает взгляд и структурирует силуэт топа.'
    };
    return tips[styleId] || 'Стильный фасон с отличной посадкой по индивидуальным меркам.';
}

function openLookbookModal(garmentType, styleId) {
    const gType = garmentType || state.garmentType || 'skirt';
    currentLookbookGarment = gType;

    const list = STYLE_CATALOG[gType] || STYLE_CATALOG.skirt;
    let targetId = styleId;
    if (!targetId) {
        if (gType === 'skirt') targetId = state.skirtStyle || 'mini-trapeze';
        else if (gType === 'panties') targetId = state.pantiesModel || 'slips';
        else if (gType === 'top') targetId = state.topStyle || 'smart-tee';
        else if (gType === 'corset') targetId = state.corsetStyle || 'underbust-corset';
        else targetId = state.dressStyle || 'dress-sheath';
    }

    let item = list.find(s => s.id === targetId);
    if (!item) item = list[0];
    currentLookbookStyleId = item.id;

    const modal = document.getElementById('lookbook-modal');
    if (!modal) return;

    // Заполнение заголовка
    const titleEl = document.getElementById('lb-modal-title');
    const badgeEl = document.getElementById('lb-modal-badge');
    const typeBadgeEl = document.getElementById('lb-modal-type-badge');
    const breadcrumbEl = document.getElementById('lb-modal-breadcrumb');

    if (titleEl) titleEl.textContent = item.name;
    if (badgeEl) {
        badgeEl.textContent = item.badge || 'Фасон';
        badgeEl.className = `text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-indigo-100 text-indigo-700 border-indigo-200'}`;
    }
    if (typeBadgeEl) {
        if (item.image) {
            typeBadgeEl.textContent = 'Фэшн-фотография';
            typeBadgeEl.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full border bg-[#FFF5F3] text-[#E05A47] border-[#FCDAD5]';
        } else {
            typeBadgeEl.textContent = 'Векторный эскиз';
            typeBadgeEl.className = 'text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-[#FAF8F5] text-[#78716C] border-[#F0ECE1]';
        }
    }
    if (breadcrumbEl) {
        const typeRu = gType === 'skirt' ? 'Юбка' : (gType === 'panties' ? 'Белье' : 'Платье / Топ');
        const catRu = item.category === 'mini' ? 'Мини-модель' : (item.category === 'midi' ? 'Миди / Макси' : 'Фасон');
        breadcrumbEl.textContent = `${typeRu} • ${catRu}`;
    }

    // Заполнение визуала (фото или SVG)
    const imgEl = document.getElementById('lb-modal-img');
    const svgEl = document.getElementById('lb-modal-svg');
    const tagEl = document.getElementById('lb-modal-img-tag');

    if (item.image) {
        if (imgEl) {
            imgEl.src = item.image;
            imgEl.alt = item.name;
            imgEl.classList.remove('hidden');
        }
        if (svgEl) {
            svgEl.classList.add('hidden');
            svgEl.innerHTML = '';
        }
        if (tagEl) {
            tagEl.innerHTML = `<i data-lucide="camera" class="w-3 h-3"></i><span>Фото</span>`;
            tagEl.className = 'absolute bottom-2.5 right-2.5 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md flex items-center gap-1';
        }
    } else {
        if (imgEl) {
            imgEl.classList.add('hidden');
            imgEl.src = '';
        }
        if (svgEl) {
            svgEl.classList.remove('hidden');
            svgEl.innerHTML = getStyleVectorSvg(item.vectorType, 180);
        }
        if (tagEl) {
            tagEl.innerHTML = `<i data-lucide="pen-tool" class="w-3 h-3"></i><span>Эскиз</span>`;
            tagEl.className = 'absolute bottom-2.5 right-2.5 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md flex items-center gap-1';
        }
    }

    // Текстовые поля
    const descEl = document.getElementById('lb-modal-desc');
    if (descEl) descEl.textContent = item.summary || 'Стильный фасон с выверенными пропорциями.';

    const lenEl = document.getElementById('lb-modal-length');
    if (lenEl) {
        lenEl.textContent = item.recLength ? `${item.recLength} см` : (gType === 'panties' ? 'По меркам' : 'Базовая');
    }

    const diffEl = document.getElementById('lb-modal-difficulty');
    if (diffEl) diffEl.textContent = item.difficulty || 'Легко';

    const timeEl = document.getElementById('lb-modal-time');
    if (timeEl) timeEl.textContent = item.time || '1–2 часа';

    const fabEl = document.getElementById('lb-modal-fabrics');
    if (fabEl) fabEl.textContent = item.fabrics || 'Хлопок, вискоза, деним, костюмные ткани';

    const cutEl = document.getElementById('lb-modal-cuttip');
    if (cutEl) cutEl.textContent = item.cutTip || 'Классический раскрой по долевой с припусками на швы.';

    const tipEl = document.getElementById('lb-modal-tip');
    if (tipEl) tipEl.textContent = item.stylingTip || getStylingTip(gType, item.id);

    const countEl = document.getElementById('lb-modal-count');
    if (countEl) countEl.textContent = `${list.length} моделей`;

    const applyBtn = document.getElementById('lb-modal-apply-btn');
    if (applyBtn) {
        applyBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i><span>Применить «${item.name}» на чертёж</span>`;
    }

    // Рендер миниатюр
    renderLookbookThumbs(gType, item.id);

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

function renderLookbookThumbs(garmentType, activeStyleId) {
    const container = document.getElementById('lb-modal-thumbs');
    if (!container) return;

    const list = STYLE_CATALOG[garmentType] || [];
    container.innerHTML = list.map(item => {
        const isActive = item.id === activeStyleId;
        const hasPhoto = Boolean(item.image);
        return `
            <button type="button" onclick="openLookbookModal('${garmentType}', '${item.id}')"
                    class="shrink-0 text-left p-2 rounded-xl border transition cursor-pointer flex items-center gap-2 ${isActive ? 'border-2 border-[#E05A47] bg-[#FFF5F3] shadow-xs' : 'border-[#F0ECE1] bg-white hover:border-[#E3DDD0]'}">
                <div class="w-8 h-10 rounded-lg overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#F0ECE1] flex items-center justify-center relative">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">` : `<div class="transform scale-65">${getStyleVectorSvg(item.vectorType, 36)}</div>`}
                    ${hasPhoto ? `<span class="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-[#E05A47] shadow-xs" title="Есть фото"></span>` : ''}
                </div>
                <div class="pr-1">
                    <span class="text-[10px] font-bold block truncate max-w-[85px] ${isActive ? 'text-[#2C2825]' : 'text-[#78716C]'}">${item.name}</span>
                    <span class="text-[9px] text-[#A8A29E] block">${hasPhoto ? 'Фото' : 'Эскиз'}</span>
                </div>
            </button>
        `;
    }).join('');

    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

function closeLookbookModal() {
    const modal = document.getElementById('lookbook-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function applyLookbookStyle() {
    const gType = currentLookbookGarment;
    const sId = currentLookbookStyleId;
    const info = getStyleInfo(gType, sId);

    if (gType === 'skirt') {
        if (typeof selectSkirtStyle === 'function') {
            selectSkirtStyle(sId, info ? info.recLength : 60);
        }
    } else if (gType === 'panties') {
        if (typeof setPantiesModel === 'function') {
            setPantiesModel(sId);
        }
    } else if (gType === 'dress') {
        if (typeof selectDressStyle === 'function') {
            selectDressStyle(sId);
        } else if (['shoulder', 'side', 'waist', 'armhole'].includes(sId)) {
            if (typeof setDartPosition === 'function') setDartPosition(sId);
        } else if (['keyhole', 'deep-v', 'round', 'v-neck', 'boat', 'square'].includes(sId)) {
            if (typeof setNecklineType === 'function') setNecklineType(sId);
        }
    }

    closeLookbookModal();
    if (typeof showNotification === 'function') {
        showNotification(`Фасон «${info ? info.name : sId}» применён на выкройку!`);
    }
}

// --- ЛАЙТБОКС ДЛЯ УВЕЛИЧЕННОГО ПРОСМОТРА ФОТО И ЭСКИЗОВ ---

function openLightbox(src, title, subtitle, svgVectorType) {
    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;
    const titleEl = document.getElementById('lightbox-title');
    const subEl = document.getElementById('lightbox-subtitle');
    const imgEl = document.getElementById('lightbox-img');
    const svgEl = document.getElementById('lightbox-svg');

    if (titleEl) titleEl.textContent = title || 'Фасон';
    if (subEl) subEl.textContent = subtitle || 'Детальный просмотр модели';

    if (src) {
        if (imgEl) {
            imgEl.src = src;
            imgEl.classList.remove('hidden');
        }
        if (svgEl) {
            svgEl.classList.add('hidden');
            svgEl.innerHTML = '';
        }
    } else if (svgVectorType) {
        if (imgEl) {
            imgEl.classList.add('hidden');
            imgEl.src = '';
        }
        if (svgEl) {
            svgEl.innerHTML = getStyleVectorSvg(svgVectorType, 300);
            svgEl.classList.remove('hidden');
        }
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// --- КАТАЛОГ И АКТИВНЫЕ ДЕТАЛИ МАЕК И ТОПОВ ---

function renderTopActiveDetails() {
    const target = document.getElementById('top-active-details');
    if (!target) return;

    const info = getStyleInfo('top', state.topStyle || 'tank-top');
    if (!info) return;

    const gTop = (typeof calculateTopGeometry === 'function') ? calculateTopGeometry() : null;
    const antiRideupHtml = (gTop && gTop.antiRideupDrop > 0)
        ? `<div class="p-2.5 rounded-xl bg-[#FFF5F3] border border-[#FCDAD5] flex items-center justify-between text-xs">
               <span class="text-[#2C2825] font-semibold flex items-center gap-1.5"><i data-lucide="shield-check" class="w-4 h-4 text-[#E05A47]"></i>Система «Анти-задир»</span>
               <span class="text-[#E05A47] font-bold mono">+${gTop.antiRideupDrop} см по дуге низа</span>
           </div>`
        : '';

    const elasticSpecHtml = (gTop && (info.category === 'boudoir' || info.id === 'camisole'))
        ? `<div class="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#F0ECE1] space-y-1.5 text-[11px] text-[#78716C]">
               <div class="font-bold text-[#2C2825] flex items-center gap-1.5"><i data-lucide="scissors" class="w-3.5 h-3.5 text-[#E05A47]"></i>Расчет эластичных лент и резинок:</div>
               <div class="grid grid-cols-2 gap-1.5 pt-0.5">
                   <div class="p-1.5 rounded-lg bg-white border border-[#F0ECE1]">
                       <div class="text-[9px] uppercase tracking-wider text-[#A8A29E]">Пояс под грудью</div>
                       <div class="font-bold mono text-[#2C2825]">${gTop.elasticSpec.underbustBandLength} см <span class="text-[9px] font-normal text-[#78716C]">(k=${gTop.elasticSpec.stretchCoeff})</span></div>
                   </div>
                   <div class="p-1.5 rounded-lg bg-white border border-[#F0ECE1]">
                       <div class="text-[9px] uppercase tracking-wider text-[#A8A29E]">Бретели (2 шт.)</div>
                       <div class="font-bold mono text-[#2C2825]">${gTop.elasticSpec.strapFinishedLength} см <span class="text-[9px] font-normal text-[#78716C]">(с регулятором)</span></div>
                   </div>
               </div>
               ${gTop.elasticSpec.ringDiameterMm ? `<div class="text-[10px] text-[#57534E] pt-0.5">• Фурнитура: кольца <b>Ø${gTop.elasticSpec.ringDiameterMm} мм</b>, регуляторы бретелей <b>${gTop.elasticSpec.slidersCount} шт.</b></div>` : ''}
           </div>`
        : '';

    const photoBadge = `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="pen-tool" class="w-2.5 h-2.5"></i><span>Эскиз</span></span>`;

    const visual = `<div onclick="openLookbookModal('top', '${info.id}')" title="Нажмите, чтобы открыть эскиз в Лукбуке" class="relative w-24 h-28 shrink-0 rounded-2xl overflow-hidden border border-[#F0ECE1] shadow-xs bg-[#FAF8F5] flex items-center justify-center cursor-zoom-in group/img">
           ${getStyleVectorSvg(info.vectorType, 84)}
           ${photoBadge}
           <div class="absolute inset-0 bg-[#2C2825]/10 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition">
               <span class="text-[#2C2825] text-xs bg-white/90 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
           </div>
       </div>`;

    target.innerHTML = `
        <div class="bg-gradient-to-br from-[#FFF5F3] to-[#FAF8F5] border border-[#FCDAD5] rounded-2xl p-3.5 shadow-xs space-y-3">
            <div class="flex items-start gap-3">
                ${visual}
                <div class="flex-1 min-w-0 space-y-1.5">
                    <div class="flex items-center justify-between gap-1 flex-wrap">
                        <h4 class="text-xs font-bold text-[#2C2825]">${info.name}</h4>
                        <div class="flex items-center gap-1">
                            <span class="text-[9px] font-semibold px-2 py-0.5 rounded-full border ${info.badgeColor}">${info.badge}</span>
                            <button onclick="openLookbookModal('top', '${info.id}')" class="text-[10px] text-[#E05A47] hover:text-[#D04835] font-bold bg-white border border-[#FCDAD5] hover:border-[#E05A47] px-2 py-0.5 rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer">
                                <i data-lucide="book-open" class="w-3 h-3"></i><span>Лукбук</span>
                            </button>
                        </div>
                    </div>
                    <p class="text-[11px] text-[#78716C] leading-snug">${info.summary}</p>
                    <div class="text-[10px] text-[#78716C] pt-0.5 space-y-1">
                        <div><b>Ткани:</b> ${info.fabrics}</div>
                        <div><b>Крой:</b> ${info.cutTip}</div>
                        <div class="flex items-center gap-3 pt-0.5 text-[#2C2825] font-medium">
                            <span><b>Сложность:</b> ${info.difficulty}</span>
                            <span>•</span>
                            <span><b>Пошив:</b> ${info.time}</span>
                        </div>
                    </div>
                </div>
            </div>
            ${antiRideupHtml}
            ${elasticSpecHtml}
        </div>
    `;

    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

function selectTopStyle(styleId) {
    state.topStyle = styleId;
    // Рукав строится и отображается для всей линейки футболок
    const TEE_STYLES = ['smart-tee', 'oversize-tee', 'asymmetric-tee', 'ruched-baby-tee', 'underboob-crop-tee', 'cutout-laceup-tee', 'backless-mesh-tee'];
    state.showSleeve = TEE_STYLES.includes(styleId);

    const sleeveInputs = document.getElementById('measures-sleeve');
    if (sleeveInputs && sleeveInputs.parentElement) {
        sleeveInputs.parentElement.classList.toggle('hidden', !state.showSleeve);
    }
    const chkSleeve = document.getElementById('chk-sleeve');
    if (chkSleeve) chkSleeve.checked = Boolean(state.showSleeve);

    document.querySelectorAll('.top-style-card').forEach(el => {
        const isMatch = el.dataset.topStyle === styleId;
        el.className = `top-style-card group flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer card-hover ${isMatch ? 'border-2 border-[#E05A47] bg-[#FFF5F3] shadow-soft' : 'border-[#F0ECE1] bg-white hover:border-[#E3DDD0]'}`;
    });

    renderTopActiveDetails();
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();

    const info = getStyleInfo('top', styleId);
    showNotification(`Выбран фасон: «${info ? info.name : styleId}»`);
}

function renderTopStyleCatalog() {
    const container = document.getElementById('top-catalog-container');
    if (!container) return;

    const styles = STYLE_CATALOG.top || [];
    const dailyStyles = styles.filter(s => s.category === 'daily');
    const sensualStyles = styles.filter(s => s.category === 'sensual');
    const boudoirStyles = styles.filter(s => s.category === 'boudoir');

    const renderCard = (item) => {
        const isActive = (state.topStyle || 'tank-top') === item.id;
        const photoBadge = `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="pen-tool" class="w-2.5 h-2.5"></i><span>Эскиз</span></span>`;

        const visualContent = `<div class="relative w-full h-full group/thumb flex items-center justify-center">
            ${getStyleVectorSvg(item.vectorType, 60)}
            ${photoBadge}
            <div class="absolute inset-0 bg-[#2C2825]/10 opacity-0 group-hover/thumb:opacity-100 rounded-xl flex items-center justify-center transition">
                <span class="text-[#2C2825] text-xs bg-white/90 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
            </div>
        </div>`;

        return `
            <div onclick="selectTopStyle('${item.id}')"
                 data-top-style="${item.id}"
                 class="top-style-card group flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer card-hover ${isActive ? 'border-2 border-[#E05A47] bg-[#FFF5F3] shadow-soft' : 'border-[#F0ECE1] bg-white hover:border-[#E3DDD0]'}">
                <div onclick="event.stopPropagation(); openLightbox('', '${item.name}', '${item.summary.replace(/'/g, "\\'")}', '${item.vectorType}');"
                     title="Нажмите для увеличения эскиза"
                     class="w-16 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#F0ECE1] flex items-center justify-center relative cursor-zoom-in">
                    ${visualContent}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1">
                        <span class="text-xs font-bold text-[#2C2825] group-hover:text-[#E05A47] truncate">${item.name}</span>
                        <div class="flex items-center gap-1 shrink-0">
                            <span class="text-[9px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}">${item.badge}</span>
                            <button type="button" onclick="event.stopPropagation(); openLookbookModal('top', '${item.id}');" class="text-[10px] text-[#E05A47] hover:text-[#D04835] font-semibold hover:underline cursor-pointer">Детали ↗</button>
                        </div>
                    </div>
                    <p class="text-[11px] text-[#78716C] line-clamp-2 mt-1 leading-snug">${item.summary}</p>
                    <div class="flex items-center gap-2 mt-2 text-[10px] text-[#78716C]">
                        <span class="inline-flex items-center gap-1 font-medium"><i data-lucide="clock" class="w-3 h-3 text-[#A8A29E]"></i>${item.time}</span>
                        <span>•</span>
                        <span class="text-[#78716C] font-medium">${item.difficulty}</span>
                    </div>
                </div>
            </div>
        `;
    };

    container.innerHTML = `
        <!-- 1. Повседневная база -->
        <div class="space-y-2">
            <div class="text-[11px] font-bold uppercase tracking-wider text-[#78716C] flex items-center justify-between pt-1">
                <span class="flex items-center gap-1.5"><i data-lucide="sun" class="w-3.5 h-3.5 text-amber-500"></i>1. Повседневная база (с защитой от задирания)</span>
                <span class="text-[10px] font-semibold text-[#E05A47]">${dailyStyles.length} модели</span>
            </div>
            <div class="grid grid-cols-1 gap-2">${dailyStyles.map(renderCard).join('')}</div>
        </div>

        <!-- 2. Чувственная и вечерняя линейка -->
        <div class="space-y-2 pt-2">
            <div class="text-[11px] font-bold uppercase tracking-wider text-[#78716C] flex items-center justify-between pt-1">
                <span class="flex items-center gap-1.5"><i data-lucide="sparkles" class="w-3.5 h-3.5 text-purple-500"></i>2. Чувственная и вечерняя линейка</span>
                <span class="text-[10px] font-semibold text-[#E05A47]">${sensualStyles.length} модели</span>
            </div>
            <div class="grid grid-cols-1 gap-2">${sensualStyles.map(renderCard).join('')}</div>
        </div>

        <!-- 3. Откровенные, будуарные и эротические дизайны -->
        <div class="space-y-2 pt-2">
            <div class="text-[11px] font-bold uppercase tracking-wider text-[#78716C] flex items-center justify-between pt-1">
                <span class="flex items-center gap-1.5"><i data-lucide="heart" class="w-3.5 h-3.5 text-rose-500"></i>3. Будуарные и эротические дизайны (Open-Cup & Strappy)</span>
                <span class="text-[10px] font-semibold text-[#E05A47]">${boudoirStyles.length} модели</span>
            </div>
            <div class="grid grid-cols-1 gap-2">${boudoirStyles.map(renderCard).join('')}</div>
        </div>
    `;

    renderTopActiveDetails();
    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

// --- КАТАЛОГ И АКТИВНЫЕ ДЕТАЛИ КОРСЕТОВ И СЦЕНИЧЕСКИХ ОБРАЗОВ ---

function renderCorsetActiveDetails() {
    const target = document.getElementById('corset-active-details');
    if (!target) return;

    const info = getStyleInfo('corset', state.corsetStyle || 'underbust-corset');
    if (!info) return;

    const g = (typeof calculateCorsetGeometry === 'function') ? calculateCorsetGeometry() : null;

    let extraSpecHtml = '';
    if (g && g.spec) {
        if (g.style === 'underbust-corset' || g.style === 'waspie-belt') {
            extraSpecHtml = `
                <div class="p-2.5 rounded-xl bg-[#FFF5F3] border border-[#FCDAD5] space-y-1.5 text-[11px] text-[#78716C]">
                    <div class="font-bold text-[#2C2825] flex items-center justify-between">
                        <span class="flex items-center gap-1.5"><i data-lucide="shield" class="w-3.5 h-3.5 text-[#E05A47]"></i>Спецификация корсета:</span>
                        <span class="text-[#E05A47] font-bold mono">Утяжка: -${g.reduction} см</span>
                    </div>
                    <div class="grid grid-cols-2 gap-1.5 pt-0.5">
                        <div class="p-1.5 rounded-lg bg-white border border-[#F0ECE1]">
                            <div class="text-[9px] uppercase tracking-wider text-[#A8A29E]">Талия в корсете</div>
                            <div class="font-bold mono text-[#2C2825]">${g.targetWaist} см <span class="text-[9px] font-normal text-[#78716C]">(было ${state.ot})</span></div>
                        </div>
                        <div class="p-1.5 rounded-lg bg-white border border-[#F0ECE1]">
                            <div class="text-[9px] uppercase tracking-wider text-[#A8A29E]">Косточки / Люверсы</div>
                            <div class="font-bold mono text-[#2C2825]">${g.spec.boningTotal || 16} костей / ${g.spec.eyeletsCount || 20} шт.</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (g.style === 'french-maid-apron') {
            extraSpecHtml = `
                <div class="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#F0ECE1] space-y-1 text-[11px] text-[#78716C]">
                    <div class="font-bold text-[#2C2825] flex items-center gap-1.5"><i data-lucide="scissors" class="w-3.5 h-3.5 text-[#E05A47]"></i>Расчет длины кружевных оборок:</div>
                    <div class="grid grid-cols-2 gap-1.5 pt-0.5">
                        <div class="p-1.5 rounded-lg bg-white border border-[#F0ECE1]">
                            <div class="text-[9px] uppercase text-[#A8A29E]">Оборка подола (k=${g.spec.gatherCoeff})</div>
                            <div class="font-bold mono text-[#2C2825]">${g.spec.ruffleTotalLength} см × 5 см</div>
                        </div>
                        <div class="p-1.5 rounded-lg bg-white border border-[#F0ECE1]">
                            <div class="text-[9px] uppercase text-[#A8A29E]">Оборки бретелей (2 шт.)</div>
                            <div class="font-bold mono text-[#2C2825]">${g.spec.strapRuffleLength} см × 4 см</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (g.style === 'super-crop-shrug') {
            extraSpecHtml = `
                <div class="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#F0ECE1] flex items-center justify-between text-xs">
                    <span class="text-[#2C2825] font-semibold flex items-center gap-1.5"><i data-lucide="sparkles" class="w-4 h-4 text-[#059669]"></i>Прорезь для большого пальца</span>
                    <span class="text-[#059669] font-bold mono">4.5 см на рукаве 65 см</span>
                </div>
            `;
        }
    }

    const photoBadge = `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="pen-tool" class="w-2.5 h-2.5"></i><span>Эскиз</span></span>`;

    const visual = `<div onclick="openLookbookModal('corset', '${info.id}')" title="Нажмите, чтобы открыть эскиз в Лукбуке" class="relative w-24 h-28 shrink-0 rounded-2xl overflow-hidden border border-[#F0ECE1] shadow-xs bg-[#FAF8F5] flex items-center justify-center cursor-zoom-in group/img">
           ${getStyleVectorSvg(info.vectorType, 84)}
           ${photoBadge}
           <div class="absolute inset-0 bg-[#2C2825]/10 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition">
               <span class="text-[#2C2825] text-xs bg-white/90 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
           </div>
       </div>`;

    target.innerHTML = `
        <div class="bg-gradient-to-br from-[#FFF5F3] to-[#FAF8F5] border border-[#FCDAD5] rounded-2xl p-3.5 shadow-xs space-y-3">
            <div class="flex items-start gap-3">
                ${visual}
                <div class="flex-1 min-w-0 space-y-1.5">
                    <div class="flex items-center justify-between gap-1 flex-wrap">
                        <h4 class="text-xs font-bold text-[#2C2825]">${info.name}</h4>
                        <div class="flex items-center gap-1">
                            <span class="text-[9px] font-semibold px-2 py-0.5 rounded-full border ${info.badgeColor}">${info.badge}</span>
                            <button onclick="openLookbookModal('corset', '${info.id}')" class="text-[10px] text-[#E05A47] hover:text-[#D04835] font-bold bg-white border border-[#FCDAD5] hover:border-[#E05A47] px-2 py-0.5 rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer">
                                <i data-lucide="book-open" class="w-3 h-3"></i><span>Лукбук</span>
                            </button>
                        </div>
                    </div>
                    <p class="text-[11px] text-[#78716C] leading-snug">${info.summary}</p>
                    <div class="text-[10px] text-[#78716C] pt-0.5 space-y-1">
                        <div><b>Ткани:</b> ${info.fabrics}</div>
                        <div><b>Крой:</b> ${info.cutTip}</div>
                        <div class="flex items-center gap-3 pt-0.5 text-[#2C2825] font-medium">
                            <span><b>Сложность:</b> ${info.difficulty}</span>
                            <span>•</span>
                            <span><b>Пошив:</b> ${info.time}</span>
                        </div>
                    </div>
                </div>
            </div>
            ${extraSpecHtml}
        </div>
    `;

    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

function selectCorsetStyle(styleId) {
    state.corsetStyle = styleId;
    state.showSleeve = false; // у корсетов рукав не классический

    document.querySelectorAll('.corset-style-card').forEach(el => {
        const isMatch = el.dataset.corsetStyle === styleId;
        el.className = `corset-style-card group flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer card-hover ${isMatch ? 'border-2 border-[#E05A47] bg-[#FFF5F3] shadow-soft' : 'border-[#F0ECE1] bg-white hover:border-[#E3DDD0]'}`;
    });

    renderCorsetActiveDetails();
    renderPattern();
    if (typeof StorageManager !== 'undefined') StorageManager.save();

    const info = getStyleInfo('corset', styleId);
    showNotification(`Выбран образ: «${info ? info.name : styleId}»`);
}

function renderCorsetStyleCatalog() {
    const container = document.getElementById('corset-catalog-container');
    if (!container) return;

    const styles = STYLE_CATALOG.corset || [];
    const corsetGroup = styles.filter(s => s.category === 'corset');
    const wrapGroup = styles.filter(s => s.category === 'wrap');
    const roleplayGroup = styles.filter(s => s.category === 'romper' || s.category === 'roleplay');

    const renderCard = (item) => {
        const isActive = (state.corsetStyle || 'underbust-corset') === item.id;
        const photoBadge = `<span class="absolute bottom-1 right-1 bg-[#2C2825]/85 backdrop-blur-xs text-white text-[8px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"><i data-lucide="pen-tool" class="w-2.5 h-2.5"></i><span>Эскиз</span></span>`;

        const visualContent = `<div class="relative w-full h-full group/thumb flex items-center justify-center">
            ${getStyleVectorSvg(item.vectorType, 60)}
            ${photoBadge}
            <div class="absolute inset-0 bg-[#2C2825]/10 opacity-0 group-hover/thumb:opacity-100 rounded-xl flex items-center justify-center transition">
                <span class="text-[#2C2825] text-xs bg-white/90 p-1 rounded-full"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></span>
            </div>
        </div>`;

        return `
            <div onclick="selectCorsetStyle('${item.id}')"
                 data-corset-style="${item.id}"
                 class="corset-style-card group flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer card-hover ${isActive ? 'border-2 border-[#E05A47] bg-[#FFF5F3] shadow-soft' : 'border-[#F0ECE1] bg-white hover:border-[#E3DDD0]'}">
                <div onclick="event.stopPropagation(); openLightbox('', '${item.name}', '${item.summary.replace(/'/g, "\\'")}', '${item.vectorType}');"
                     title="Нажмите для увеличения эскиза"
                     class="w-16 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#F0ECE1] flex items-center justify-center relative cursor-zoom-in">
                    ${visualContent}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1">
                        <span class="text-xs font-bold text-[#2C2825] group-hover:text-[#E05A47] truncate">${item.name}</span>
                        <div class="flex items-center gap-1 shrink-0">
                            <span class="text-[9px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}">${item.badge}</span>
                            <button type="button" onclick="event.stopPropagation(); openLookbookModal('corset', '${item.id}');" class="text-[10px] text-[#E05A47] hover:text-[#D04835] font-semibold hover:underline cursor-pointer">Детали ↗</button>
                        </div>
                    </div>
                    <p class="text-[11px] text-[#78716C] line-clamp-2 mt-1 leading-snug">${item.summary}</p>
                    <div class="flex items-center gap-2 mt-2 text-[10px] text-[#78716C]">
                        <span class="inline-flex items-center gap-1 font-medium"><i data-lucide="clock" class="w-3 h-3 text-[#A8A29E]"></i>${item.time}</span>
                        <span>•</span>
                        <span class="text-[#78716C] font-medium">${item.difficulty}</span>
                    </div>
                </div>
            </div>
        `;
    };

    container.innerHTML = `
        <!-- 1. Корсетная группа (Утяжка и акцент на талию) -->
        <div class="space-y-2">
            <div class="text-[11px] font-bold uppercase tracking-wider text-[#78716C] flex items-center justify-between pt-1">
                <span class="flex items-center gap-1.5"><i data-lucide="shield" class="w-3.5 h-3.5 text-rose-500"></i>1. Корсетная группа (Утяжка талии)</span>
                <span class="text-[10px] font-semibold text-[#E05A47]">${corsetGroup.length} модели</span>
            </div>
            <div class="grid grid-cols-1 gap-2">${corsetGroup.map(renderCard).join('')}</div>
        </div>

        <!-- 2. Накидки и трансформеры -->
        <div class="space-y-2 pt-2">
            <div class="text-[11px] font-bold uppercase tracking-wider text-[#78716C] flex items-center justify-between pt-1">
                <span class="flex items-center gap-1.5"><i data-lucide="feather" class="w-3.5 h-3.5 text-purple-500"></i>2. Накидки и трансформеры (Верхний слой)</span>
                <span class="text-[10px] font-semibold text-[#E05A47]">${wrapGroup.length} модели</span>
            </div>
            <div class="grid grid-cols-1 gap-2">${wrapGroup.map(renderCard).join('')}</div>
        </div>

        <!-- 3. Слитные силуэты и Ролевые элементы -->
        <div class="space-y-2 pt-2">
            <div class="text-[11px] font-bold uppercase tracking-wider text-[#78716C] flex items-center justify-between pt-1">
                <span class="flex items-center gap-1.5"><i data-lucide="wand-2" class="w-3.5 h-3.5 text-amber-500"></i>3. Слитные силуэты и Ролевые элементы</span>
                <span class="text-[10px] font-semibold text-[#E05A47]">${roleplayGroup.length} модели</span>
            </div>
            <div class="grid grid-cols-1 gap-2">${roleplayGroup.map(renderCard).join('')}</div>
        </div>
    `;

    renderCorsetActiveDetails();
    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

// Закрытие модальных окон по клавише Escape
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
        closeLookbookModal();
    }
});


