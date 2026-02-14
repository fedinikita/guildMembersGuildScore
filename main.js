const membersName = ["Морэа"];
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
    .catch(err => {console.log(err);return null});

const fecthCharId = (name) => promiseDecorator(fetch("https://api.allodswiki.ru/api/v1/armory/avatars", {
        headers, 
        body: `{"filter":{"name":"${name}","server":${serverId}}}`,
        method: "POST",
    }));

const fetchCharEquip = (id) => promiseDecorator(fetch(`https://api.allodswiki.ru/api/v1/armory/avatars/${id}`));

async function processCharacter(name) {
    const charId = (await fecthCharId(name)).data[0]?.id || null;
    if (charId) {
        const equip = await fetchCharEquip(charId);
        if (equip) {
            const gs = equip.data.gear_score;
            const classOfChar = classMap[equip.data.class] || equip.data.class;
            const nbSlug = "nasledie-bogov";
            const items = equip.data.items;
            const itemsKeys = Object.keys(items);

            let nbLevel;

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
    // Получаем данные всех персонажей
    const results = await Promise.all(membersName.map(name => processCharacter(name)));
    
    // Фильтруем null значения (если персонаж не найден)
    const validResults = results.filter(result => result !== null);
    
    // Сортируем по GS от большего к меньшему
    const sortedResults = validResults.sort((a, b) => b.gs - a.gs);
    
    // Выводим отсортированные результаты с нумерацией
    console.log("=== РЕЙТИНГ ПЕРСОНАЖЕЙ В ГИЛЬДИИ ПО ГС ===");
    sortedResults.forEach((character, index) => {
        console.log(`${index + 1}. ${character.name}`);
        console.log(`   ГС: ${character.gs}`);
        console.log(`   Класс: ${character.classOfChar}`);
        console.log(`   НБ: ${character.nbLevel}`);
        console.log("---");
    });
};

main();