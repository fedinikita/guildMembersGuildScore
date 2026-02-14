const membersName = ["Морэа", "Крава", "ТестовыйПерс"]; // Замените на своих персонажей

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

const promiseDecorator = promise => promise
    .then(response => response.json())
    .then(response => response)
    .catch(err => {
        console.log(err);
        return null
    });

const fetchCharId = (name) => promiseDecorator(fetch("https://api.allodswiki.ru/api/v1/armory/avatars", {
        headers, 
        body: `{"filter":{"name":"${name}","server":${serverId}}}`,
        method: "POST",
    }));

const fetchCharEquip = (id) => promiseDecorator(fetch(`https://api.allodswiki.ru/api/v1/armory/avatars/${id}`));

async function processCharacter(name) {
    const charId = (await fetchCharId(name))?.data[0]?.id || null;
    if (charId) {
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
            };
            
            return {
                name,
                gs,
                classOfChar,
                nbLevel
            };
        }
    }
    return null;
};

async function main() {
    const app = document.getElementById('app');
    
    try {
        // Получаем данные всех персонажей
        const results = await Promise.all(membersName.map(name => processCharacter(name)));
        
        // Фильтруем null значения (если персонаж не найден)
        const validResults = results.filter(result => result !== null);
        
        if (validResults.length === 0) {
            app.innerHTML = '<div class="error">❌ Не найдено ни одного персонажа</div>';
            return;
        }
        
        // Сортируем по GS от большего к меньшему
        const sortedResults = validResults.sort((a, b) => b.gs - a.gs);
        
        // Считаем статистику
        const avgGs = Math.round(sortedResults.reduce((sum, char) => sum + char.gs, 0) / sortedResults.length);
        const maxGs = Math.max(...sortedResults.map(char => char.gs));
        const minGs = Math.min(...sortedResults.map(char => char.gs));
        
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
        
        // Логируем в консоль для отладки
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
};

// Запускаем приложение
main();