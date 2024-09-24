const allItems = [];

function defineAllItems() {
    allItems[0] = {
        isDefaultItem: true,
        itemType: `item`,
        index: 0,
        icon: `url("./images/inventory.png")`,
        name: `emptySlot`,
        type: null,
        damage: null,
        range: null,
        parry: null,
        dodge: null,
        disrupt: null,
        block: null,
    }
    // allItems[1] = {
    //     itemType: `item`,
    //     index: 1,
    //     icon: ``,
    //     name: `Dagger`,
    //     type: `melee`,
    //     damage: [[0, 2, 4]],
    //     range: 1,
    //     parry: 1,
    //     dodge: 0,
    //     disrupt: 0,
    //     block: 0,
    // }
}

defineAllItems();

export {allItems};