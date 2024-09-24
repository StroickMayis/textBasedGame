const allFeats = [];

function defineAllFeats() {
    allFeats[0] = {
        name: `Brute Force`,
        parry: 0,
        dodge: 0,
        disrupt: 0,
        block: 0,
    }
    allFeats[1] = {
        name: `Heavy Strikes`,
        parry: 1,
        dodge: 0,
        disrupt: 0,
        block: 0,
    }
}

defineAllFeats();

export {allFeats};