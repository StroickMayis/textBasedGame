const allBackgrounds = [];

function defineAllBackgrounds() {
    allBackgrounds[0] = {
        index: 0,
        name: `None`,
        parry: 0,
        dodge: 0,
        disrupt: 0,
        block: 0,
    }
    allBackgrounds[1] = {
        index: 1,
        name: `Peasant`,
        parry: 0,
        dodge: 0,
        disrupt: 0,
        block: 0,
    }
    allBackgrounds[2] = {
        index: 2,
        name: `Mercenary`,
        parry: 1,
        dodge: 0,
        disrupt: 0,
        block: 0,
    }
}

defineAllBackgrounds();

export { allBackgrounds } ;