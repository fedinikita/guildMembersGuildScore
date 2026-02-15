const membersName = [
    // А
    "Авиаль",
    "АгатаКристи",
    "АгентДжей",
    "Аддэлиада",
    "Адоэль",
    "Аквион",
    "АкулаМататус",
    "Альмара",
    "Анхель",
    "Арзак",
    "Ариошка",
    "АртуркаЛучник",
    "Ахутнги",

    // Б
    "Баббадук",
    "БЕНИЗИЛИН",
    "Бодренняя",
    "Братишка",
    "Булинька",
    "БульварДье",
    "Бульвар",
    "БухиеЁжики",

    // В
    "Ванга",
    "Васил",
    "Вельдоро",
    "ВЕРКИРИЙ",
    "Взяточница",

    // Г
    "Гермилиона",
    "ГибиБанда",
    "Гистрия",
    "Греночка",
    "Грибос",
    "Гридмен",
    "ГрыгорийПиво",
    "ГрязныеМюсли",
    "ГульСССРанг",

    // Д
    "Дакини",
    "ДаняДонк",
    "ДваПапы",
    "ДеАнте",
    "ДедаСаня",
    "ДикоСкромный",
    "Дия",
    "ДункинМаклауд",
    "Дынеед",

    // Е
    "Ексис",

    // З
    "ЗаглотБешеных",
    "Зазнайки",
    "Зараза",

    // И
    "Ионов",
    "Искренность",

    // К
    "КаваиХаваи",
    "Каракатекс",
    "КатькаМолотова",
    "Клафелинщица",
    "Крава",
    "КраваБард",
    "КриолУрский",
    "крипоч",
    "Ксандрокс",

    // Л
    "ЛадаВеста",
    "Лаеро",
    "Лами",
    "Леомакс",
    "ЛеснаяТварь",
    "ЛеснойЭл",
    "лещик",
    "ЛикораД",
    "Люксориус",

    // М
    "МагистрПоль",
    "МагМэн",
    "Малефис",
    "Мельк",
    "Мерджан",
    "Мишан",
    "Моисей",
    "Мортис",
    "Морэа",
    "Мэлисса",

    // Н
    "НеГулДан",
    "Неробаста",

    // О
    "ОтмеченыйЗмеем",
    "Отшлепыватель",

    // П
    "Пандорик",
    "Пескофф",
    "Подобушка",
    "ПолковникМяу",
    "ПольДиЛион",
    "Понеже",
    "ПоцелуйИуды",
    "Почтальон",
    "Пронтеры",
    "ПростиМеняБоже",
    "Протореан",
    "ПузиБлинчики",
    "Пьер",
    "Пэй",

    // Р
    "Ревенталь",
    "РейзонДетр",
    "Ренлисил",
    "РТБгвардейское",
    "Рыбка",

    // С
    "саваранна",
    "СамаМилота",
    "Свен",
    "Светлейшая",
    "Септалия",
    "Сергулёк",
    "Сия",
    "Скиллет",
    "СкуфиДу",
    "СладкаяПИ",
    "Слейман",
    "СмеетанА",
    "Снегирь",
    "Сотник",
    "СтепаОгурцов",
    "СтереоДримХ",
    "Судья",
    "СуперСтелла",
    "СынКолонны",

    // Т
    "Тарапунь",
    "Тигр",
    "Три",
    "Триппер",

    // У
    "УставшаяПанда",

    // Ф
    "Фельсория",
    "Фемто",
    "Фиераэль",
    "Форсек",
    "Фрая",

    // Х
    "ХаваиКаваи",
    "Харкон",
    "ХитроПопик",
    "ХитроПопики",
    "Хлорамфеникол",
    "ХмельнойСвятой",
    "ХотКот",
    "Хохь",
    "хХаяБа",

    // Ц
    "Царственная",
    "ЦарьПрироды",
    "Цератопус",

    // Ч
    "Чарка",

    // Ш
    "Шакаса",
    "Шарлиз",

    // Э
    "Эджворт",
    "ЭнрикоГонзалез"
];

const GUILDERS_LIST = "GUILDERS_LIST";
const CACHE_MINUTES = 60;

let wasError = false;

const classMap = {
    necromancer: "Некромант",
    paladin: "Паладин",
    psionic: "Мистик",
    warrior: "Воин",
    druid: "Друид",
    priest: "Жрец",
    engineer: "Инженер",
    bard: "Бард",
    stalker: "Разведчик",
    mage: "Маг",
    warlock: "Демонолог",
};

const serverId = 1;
const headers = {
    "content-type": "application/json",
};

// Конфигурация retry
const RETRY_CONFIG = {
    maxRetries: 3,           // Максимальное количество попыток
    initialDelay: 1000,      // Начальная задержка 1 секунда
    maxDelay: 10000,         // Максимальная задержка 10 секунд
    backoffFactor: 2         // Множитель задержки (экспоненциально)
};

// Функция задержки
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Функция с retry логикой
async function fetchWithRetry(url, options, retryCount = 0) {
    try {
        const response = await fetch(url, options);
        
        // Если статус 429 (Too Many Requests)
        if (response.status === 429) {
            // Получаем время ожидания из заголовка Retry-After (если есть)
            const retryAfter = response.headers.get('Retry-After');
            let waitTime = RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffFactor, retryCount);
            
            // Если сервер указал конкретное время ожидания
            if (retryAfter) {
                waitTime = parseInt(retryAfter) * 1000; // Retry-After обычно в секундах
            }
            
            // Ограничиваем максимальным временем ожидания
            waitTime = Math.min(waitTime, RETRY_CONFIG.maxDelay);
            
            console.log(`⚠️ 429 для ${url.split('/').pop()}. Попытка ${retryCount + 1}/${RETRY_CONFIG.maxRetries}. Ожидание ${waitTime}ms...`);
            
            if (retryCount < RETRY_CONFIG.maxRetries) {
                await delay(waitTime);
                return fetchWithRetry(url, options, retryCount + 1);
            } else {
                console.error(`❌ Превышено количество попыток для ${url}`);
                wasError = true;
                return null;
            }
        }
        
        return response;
    } catch (error) {
        console.error(`Ошибка сети для ${url}:`, error);
        
        if (retryCount < RETRY_CONFIG.maxRetries) {
            const waitTime = RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffFactor, retryCount);
            console.log(`🔄 Сетевая ошибка. Повтор через ${waitTime}ms...`);
            await delay(waitTime);
            return fetchWithRetry(url, options, retryCount + 1);
        }
        
        return null;
    }
}

const promiseDecorator = (promise) => promise
    .then(response => {
        if (!response) return null;
        return response.json();
    })
    .then(response => response)
    .catch(err => {
        console.log(err);
        return null;
    });

const fetchCharId = (name) => promiseDecorator(
    fetchWithRetry("https://api.allodswiki.ru/api/v1/armory/avatars", {
        headers,
        body: `{"filter":{"name":"${name}","server":${serverId}}}`,
        method: "POST",
    })
);

const fetchCharEquip = (id) => promiseDecorator(
    fetchWithRetry(`https://api.allodswiki.ru/api/v1/armory/avatars/${id}`)
);

async function processCharacter(name) {
    const charIdResponse = await fetchCharId(name);
    const charId = charIdResponse?.data[0]?.id || null;
    const charLvl = charIdResponse?.data[0]?.level;
    
    if (charId && charLvl >= 120) {
        const equip = await fetchCharEquip(charId);
        if (equip) {
            const gs = equip.data.gear_score;
            const classOfChar = classMap[equip.data.class] || equip.data.class;
            const nbSlug = "nasledie-bogov";
            const items = equip.data.items;
            const itemsKeys = Object.keys(items);

            let nbLevel = 0;

            for (let i = 0; i < itemsKeys.length; i++) {
                if (items[itemsKeys[i]].slug === nbSlug) {
                    nbLevel = items[itemsKeys[i]].level;
                    break;
                }
            }
            
            return {
                name,
                gs,
                classOfChar,
                nbLevel
            };
        }
    }
    return null;
}

async function main() {
    const app = document.getElementById('app');
    
    try {
        // Показываем прогресс
        app.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                Загрузка данных персонажей... (0/${membersName.length})
            </div>
        `;
        
        // Получаем данные всех персонажей с отслеживанием прогресса
        const results = [];
        // проверяе ls, и его свежесть. если просрочился на час, делаем походы снова.
        const freshCachedResults = JSON.parse(localStorage.getItem(GUILDERS_LIST));
        let sortedResults;
        
        if (!freshCachedResults || freshCachedResults.timemark + CACHE_MINUTES * 60 * 1000 < Date.now()) {
            for (let i = 0; i < membersName.length; i++) {
                const name = membersName[i];
                const result = await processCharacter(name);
                results.push(result);
                
                // Обновляем прогресс
                const loadingDiv = document.querySelector('.loading');
                if (loadingDiv) {
                    loadingDiv.innerHTML = `
                        <div class="spinner"></div>
                        Загрузка данных персонажей... (${i + 1}/${membersName.length})
                    `;
                }
            }
            
            // Фильтруем null значения (если персонаж не найден)
            const validResults = results.filter(result => result !== null);
            
            if (validResults.length === 0) {
                app.innerHTML = '<div class="error">❌ Не найдено ни одного персонажа</div>';
                return;
            }
            
            // Сортируем по GS от большего к меньшему
            sortedResults = validResults.sort((a, b) => b.gs - a.gs);
            !wasError && localStorage.setItem(GUILDERS_LIST, JSON.stringify({timemark: Date.now(), sortedResults}))
        } else {
            sortedResults = freshCachedResults.sortedResults;
        }
        
        // Считаем статистику
        const avgGs = Math.round(sortedResults.reduce((sum, char) => sum + char.gs, 0) / sortedResults.length);
        const maxGs = Math.max(...sortedResults.map(char => char.gs));
        
        // Формируем HTML
        let html = `
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-value">${sortedResults.length}</div>
                    <div class="stat-label">Персонажей</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${avgGs}</div>
                    <div class="stat-label">Средний ГС</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${maxGs}</div>
                    <div class="stat-label">Макс. ГС</div>
                </div>
            </div>
            <div class="rating-list">
        `;
        
        // Добавляем каждого персонажа
        sortedResults.forEach((character, index) => {
            const rank = index + 1;
            const topClass = rank <= 3 ? `top-${rank}` : '';
            
            html += `
                <div class="character-card ${topClass}">
                    <div class="character-header">
                        <div class="rank">#${rank}</div>
                        <div class="character-info">
                            <div class="character-name">${character.name}</div>
                            <div class="character-class">${character.classOfChar}</div>
                        </div>
                        <div class="gs-badge">⚡${character.gs}</div>
                    </div>
                    <div class="character-footer">
                        <div class="nb-level">
                            <strong>Наследие богов:</strong> ${character.nbLevel} ур.
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        app.innerHTML = html;
        
        // Логируем в консоль
        console.log("=== РЕЙТИНГ ПЕРСОНАЖЕЙ В ГИЛЬДИИ ПО ГС ===");
        sortedResults.forEach((character, index) => {
            console.log(`${index + 1}. ${character.name}`);
            console.log(`   ГС: ${character.gs}`);
            console.log(`   Класс: ${character.classOfChar}`);
            console.log(`   НБ: ${character.nbLevel}`);
            console.log("---");
        });
        
    } catch (error) {
        console.error('Ошибка:', error);
        app.innerHTML = '<div class="error">❌ Произошла ошибка при загрузке данных</div>';
    }
}

// Запускаем приложение
main();