function Char(name, race) {
    this.name = `${name}`;
    this.race = `${race.name}`;
    this.hp = 10;
    this.actions = {
        attack: (target) => {target.hp -= 1},
    };
    this.stats = race.stats;
    this.resists = race.resists;
    this.inventory = {
        hands: [null,null,null,null],
        backpack: false,
        saddlebag: false,
        properties: false,
    };
    this.equipment = {
        head: null,
        torso: null,
        arms: null,
        waist: null,
        amulet1: null,
        amulet2: null,
    }
};

const classes = {
    fighter: function Fighter(name) {
        this.name = `${name}`;
        this.hp = 10;
        this.actions = {
            attack: (target) => {target.hp -= 1},
        };
        this.stats = {
            strength: 0,
            dexterity: 0,
            willpower: 0,
            vitality: 0,
            agility: 0,
            initiative: 0,
            intelligence: 0,
            charisma: 0,
        };
        this.inventory = {
            hands: [null,null,null,null],
            backpack: false,
            saddlebag: false,
            properties: false,
        };
        this.equipment = {
            head: null,
            torso: null,
            arms: null,
            waist: null,
            amulet1: null,
            amulet2: null,
        }
    }
}

const race = {
    man: {
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
    },
    elf: {
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
    },
    dwarf: {
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
    },
    saurus: {
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
    },
}


function characterCreator() {
    party.charList.push(new Char(`Stroick`, race.man,));
}

// Index 0 is always the main/player character
const party = {
    charList: [],
}

const encounter = {
    charList: [],
}

party.charList.push(new Char(`Stroick`));
party.charList.push(new Char(`Kyle`));
encounter.charList.push(new Char(`Zombie`));

encounter.charList[0].actions.attack(party.charList[1]);
console.log(party.charList)
console.log(encounter.charList)
