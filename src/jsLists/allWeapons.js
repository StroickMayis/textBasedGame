const allWeapons = [];

function defineAllWeapons() {
    allWeapons[0] = {
        isDefaultItem: true,
        itemType: `weapon`,
        itemEquipType: [`mainHand`, `offHand`],
        index: 0,
        icon: `url("./images/mainHand.png")`,
        name: `Main Hand Unarmed`,
        type: `melee`,
        damage: [[0, 1, 4]],
        range: 1,
        parry: 0,
        dodge: 0,
        disrupt: 0,
        block: 0,
    }
    allWeapons[1] = {
        isDefaultItem: true,
        itemType: `weapon`,
        itemEquipType: [`mainHand`, `offHand`],
        index: 1,
        icon: `url("./images/offHand.png")`,
        name: `Off-Hand Unarmed`,
        type: `melee`,
        damage: [[0, 1, 4]],
        range: 1,
        parry: 0,
        dodge: 0,
        disrupt: 0,
        block: 0,
    }
    allWeapons[2] = {
        isDefaultItem: false,
        itemType: `weapon`,
        itemEquipType: [`mainHand`, `offHand`],
        index: 2,
        icon: `url("./images/dagger.png")`,
        name: `Dagger`,
        type: `melee`,
        damage: [[0, 2, 4]],
        range: 1,
        parry: 1,
        dodge: 0,
        disrupt: 0,
        block: 0,
    }
}

defineAllWeapons();

export {allWeapons};