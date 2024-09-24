const allTalents = [];

function defineAllTalents() {
    allTalents[0] = {
        index: 0,
        name: `None`,
        statBonusName: `None`,
        statBonusAmount: null,
        ability: null,
    };
    allTalents[1] = {
        index: 1,
        name: `Strong`,
        statBonusName: `strength`,
        statBonusAmount: 4,
        ability: 2,
    };
    allTalents[2] = {
        index: 2,
        name: `Dexterous`,
        statBonusName: `dexterity`,
        statBonusAmount: 4,
        ability: 3,
    };
    allTalents[3] = {
        index: 3,
        name: `Soulful`,
        statBonusName: `willpower`,
        statBonusAmount: 4,
        ability: 4,
    };
    allTalents[4] = {
        index: 4,
        name: `Resilient`,
        statBonusName: `vitality`,
        statBonusAmount: 4,
        ability: 5,
    };
    allTalents[5] = {
        index: 5,
        name: `Agile`,
        statBonusName: `agility`,
        statBonusAmount: 4,
        ability: 6,
    };
    allTalents[6] = {
        index: 6,
        name: `Responsive`,
        statBonusName: `initiative`,
        statBonusAmount: 4,
        ability: 7,
    };
    allTalents[7] = {
        index: 7,
        name: `Genius`,
        statBonusName: `intelligence`,
        statBonusAmount: 4,
        ability: 8,
    };
    allTalents[8] = {
        index: 8,
        name: `Charismatic`,
        statBonusName: `charisma`,
        statBonusAmount: 4,
        ability: 9,
    };
    allTalents[9] = {
        index: 9,
        name: `Sorcerous`,
    };
}

defineAllTalents();

export {allTalents};