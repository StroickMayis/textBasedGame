const allRaces = [];

function defineAllRaces() {
    allRaces[0] = {
        index: 0,
        name: `None`,
        stats: {
            strength: 0,
            dexterity: 0,
            willpower: 0,
            vitality: 0,
            agility: 0,
            initiative: 0,
            intelligence: 0,
            charisma: 0,
        },
        resistsArray: [0,0,0,0,0,0,0,0,0],   
    };
    allRaces[1] = {
        index: 1,
        name: `Man`,
        stats: {
            strength: 0,
            dexterity: 0,
            willpower: 0,
            vitality: 0,
            agility: 0,
            initiative: 0,
            intelligence: 4,
            charisma: 0,
        },
        resistsArray: [0,0,-5,-5,-5,-5,-5,-5,-5],   
    };
    allRaces[2] = {
        index: 2,
        name: `Elf`,
        stats: {
            strength: -2,
            dexterity: 2,
            willpower: 0,
            vitality: -4,
            agility: 0,
            initiative: 0,
            intelligence: 8,
            charisma: 0,
        },
        resistsArray: [0,0,-5,-5,-5,-5,-5,-5,-5],   
    };
    allRaces[3] = {
        index: 3,
        name: `Dwarf`,
        stats: {
            strength: 2,
            dexterity: 0,
            willpower: 2,
            vitality: 4,
            agility: -8,
            initiative: 0,
            intelligence: 4,
            charisma: 0,
        },
        resistsArray: [0,0,-3,-3,-3,-3,-3,-3,-3],   

    };
    allRaces[4] = {
        index: 4,
        name: `Saurus`,
        stats: {
            strength: 14,
            dexterity: -2,
            willpower: 4,
            vitality: 14,
            agility: 2,
            initiative: 4,
            intelligence: -14,
            charisma: -18,
        },
        resistsArray: [5,5,0,0,0,0,-5,0,-5],   
    };
}

defineAllRaces();

export {allRaces};