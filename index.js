/* #region Notes*/

// timeToCast converts to the following:
// Reaction = 1
// Bonus Action = 2
// Action = 3
// Type of Weapons:
// Melee = 1
// Ranged = 2
// Magic = 3
// TODO: Must make ID's for everything, to make them easier to handle.
// TODO: I am copying data too much, all characters should REFERENCE ability data etc, this will make it easier to code and should improve performance.

/* #endregion Notes*/

/* #region  Combat Log */ 

const combatLog = {
    critHit: function (caster, target, damage) {
        let damageDisplayArray = this.damageDisplay(damage);
        console.log(`${caster.name} CRITICALLY HITS ${target.name} and rolls a ${damageDisplayArray[0]} times 2 for a total of ${damageDisplayArray[1] * 2} damage!`)
    },
    attackAttempt: function (caster, target, attackRoll, defendRoll, attackBonus, defendBonus) {
        const attack = attackRoll + attackBonus;
        const defend = defendRoll + defendBonus;
        console.log(`${caster.name} attacks ${target.name} with: ${caster.equipment.mainHand.name}, 
            with an attack roll of: ${attackRoll} and attack bonus of ${attackBonus} 
            against a defend roll of ${defendRoll} and a defend bonus of ${defendBonus}. 
            Total Attack: ${attack} vs. Total Defend: ${defend}`);
    },
    damageDisplay: function(damage) {
        let damageRollDisplay = [];
        damageRollDisplay[0] = ``;
        if (sumOfArray(damage) < 1) {
            damageRollDisplay[1] = 1;
        } else {
            damageRollDisplay[1] = sumOfArray(damage);
        }
        let damageBonus = popArrayPopValue(damage);
        let damageCopy = popArrayArrayValue(damage);
        for(let i = 0; i < damageCopy.length; i++) {
            damageRollDisplay[0] += `${damageCopy[i]} + `
        }
        damageRollDisplay[0] += `a ${damageBonus} bonus`;

        return damageRollDisplay;
    },
    hit: function (caster, target, damage) {
        let damageDisplayArray = this.damageDisplay(damage);
        console.log(`${caster.name} hits ${target.name} and rolls a ${damageDisplayArray[0]} for a total of ${damageDisplayArray[1]} damage!`);
    },
    defend: function (caster, target) {
        console.log(`${target.name} defends ${caster.name}'s attack!`);
    },

    
}

/* #endregion Combat Log*/

/* #region  Ability Effects & Logic */

const effect = {
    determineAttackType: function (caster) {
        let type;
        switch (caster.equipment.mainHand.type) {
            case `melee`:
                type = `melee`;
                break;
            case `ranged`:
                type = `ranged`;
                break;
            case `magic`:
                type = `magic`;
                break;
            default: return null;
        }
        return type;
    },
    determineDefendBonus: function (caster, target) {
        const parry = Math.floor((target.stats.initiative / 2) + (target.stats.dexterity / 4));
        const dodge = Math.floor((target.stats.initiative / 2) + (target.stats.agility / 4));
        const disrupt = Math.floor((target.stats.initiative / 2) + (target.stats.willpower / 4));
        const block = Math.floor(target.stats.initiative / 2);
        let defendBonus;
        switch (this.determineAttackType(caster)) {
            case `melee`:
                defendBonus = Math.max(parry, block)
                break;
            case `ranged`:
                defendBonus = Math.max(dodge, block)
                break;
            case `magic`:
                defendBonus = Math.max(disrupt, block)
                break;
        }
        return defendBonus;
    },
    multiplyWeaponDamageDice: function (weaponDamageDice, weaponDamageDiceMultiplier) {
        let damage = [];
        for (weaponDamageDiceMultiplier; weaponDamageDiceMultiplier > 0; weaponDamageDiceMultiplier--) {
            damage.push(dice(weaponDamageDice));
        }
        return damage;
    },
    determineDamage: function (caster) {
        let damage;

        let damageBonus;
        switch (this.determineAttackType(caster)) {
            case `melee`:
                damageBonus = caster.stats.strength
                break;
            case `ranged`:
                damageBonus = caster.stats.dexterity
                break;
            case `magic`:
                damageBonus = caster.stats.intelligence
                break;
            default: return null;
        }

        let weaponDamageDice = caster.equipment.mainHand.damage;
        let weaponDamageDiceMultiplier = caster.equipment.mainHand.damageDiceMultiplier;
        
        damage = this.multiplyWeaponDamageDice(weaponDamageDice, weaponDamageDiceMultiplier)
        damage.push(damageBonus);
        return damage;
    },
    attack: function (caster, target) {
        const attackRoll = dice(100);
        const defendRoll = dice(20);
        const attackBonus = caster.stats.dexterity;
        const defendBonus = this.determineDefendBonus(caster, target);
        const damage = this.determineDamage(caster);
        const attack = attackRoll + attackBonus;
        const defend = defendRoll + defendBonus;
        if (attackRoll === 100) {
            combatLog.critHit(caster, target, damage);
            if (sumOfArray(damage) < 1) {
                target.hp -= 2;
            } else {
                target.hp -= sumOfArray(damage) * 2;
            }
        } else {
            combatLog.attackAttempt(caster, target, attackRoll, defendRoll, attackBonus, defendBonus);
            if (attack >= defend) {
                combatLog.hit(caster, target, damage);
                if (sumOfArray(damage) < 1) {
                    target.hp -= 1;
                } else {
                    target.hp -= sumOfArray(damage);
                }
            } else {
                combatLog.defend(caster, target);
            }
        }
    },

}

function dice(dMax) {
    return Math.floor(Math.random() * dMax + 1);
}

function sumOfArray(arrayOfNumbers) {
    let sum = 0;
    arrayOfNumbers.forEach((el) => sum += el);
    return sum;
}

function popArrayPopValue(array) {
    arrayCopy = Object.assign([], array);
    return arrayCopy.pop();
}

function popArrayArrayValue(array) {
    arrayCopy = Object.assign([], array);
    arrayCopy.pop();
    return arrayCopy;
}

/* #endregion Ability Effects & Logic*/

/* #region All Lists */

const allAbilities = [];
function defineAllAbilities() {
    allAbilities[0] = {
        name: `Attack`,
        effect: function(caster, target) {effect.attack(caster, target)},
    }
    // allAbilities[1] = {
    //     name: `Powerful Strike`,
    //     effect: function(caster, target) {
    //         const bonus = caster.stats.strength * 2;
    //         target.hp -= 1 + bonus;
    //     }
    // }
}

const allWeapons = [];
function defineAllWeapons() {
    allWeapons[0] = {
        name: `Unarmed`,
        type: `melee`,
        damage: 4,
        damageDiceMultiplier: 1,
    }
    allWeapons[1] = {
        name: `Dagger`,
        type: `melee`,
        damage: 4,
        damageDiceMultiplier: 2,
    }
}

const allRaces = [];
function defineAllRaces() {
    allRaces[0] = {
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
        // resists: {
        //     flat: 0,
        //     piercing: 0,
        //     ice: -5,
        //     fire: -5,
        //     corrosive: -5,
        //     poison: -5,
        //     spiritual: -5,
        //     lighting: -5,
        //     arcane: -5,
        // },
    };
    allRaces[1] = {
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
        // resists: {
        //     flat: 0,
        //     piercing: 0,
        //     ice: -5,
        //     fire: -5,
        //     corrosive: -5,
        //     poison: -5,
        //     spiritual: -5,
        //     lighting: -5,
        //     arcane: -5,
        // },
    };
    allRaces[2] = {
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
        // resists: {
        //     flat: 0,
        //     piercing: 0,
        //     ice: -3,
        //     fire: -3,
        //     corrosive: -3,
        //     poison: -3,
        //     spiritual: -3,
        //     lighting: -3,
        //     arcane: -3,
        // },
    };
    allRaces[3] = {
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
        // resists: {
        //     flat: 5,
        //     piercing: 5,
        //     ice: 0,
        //     fire: 0,
        //     corrosive: 0,
        //     poison: 0,
        //     spiritual: -5,
        //     lighting: 0,
        //     arcane: -5,
        // },
    };
}

const allTalents = [];
function defineAllTalents() {
    allTalents[0] = {
        name: `Strong`,
        statBonusName: `strength`,
        statBonusAmount: 4,
        ability: 1,
    };
    allTalents[1] = {
        name: `Dexterous`,
        statBonusName: `dexterity`,
        statBonusAmount: 4,
        ability: 2,
    };
    allTalents[2] = {
        name: `Soulful`,
        statBonusName: `willpower`,
        statBonusAmount: 4,
        ability: 3,
    };
    allTalents[3] = {
        name: `Resilient`,
        statBonusName: `vitality`,
        statBonusAmount: 4,
        ability: 4,
    };
    allTalents[4] = {
        name: `Agile`,
        statBonusName: `agility`,
        statBonusAmount: 4,
        ability: 5,
    };
    allTalents[5] = {
        name: `Responsive`,
        statBonusName: `initiative`,
        statBonusAmount: 4,
        ability: 6,
    };
    allTalents[6] = {
        name: `Genius`,
        statBonusName: `intelligence`,
        statBonusAmount: 4,
        ability: 7,
    };
    allTalents[7] = {
        name: `Charismatic`,
        statBonusName: `charisma`,
        statBonusAmount: 4,
        ability: 8,
    };
    allTalents[8] = {
        name: `Sorcerous`,
    };
}

/* #endregion All Lists*/

/* #region  Groups */

// Index 0 is always the main/player character

const party = {
    charList: [],
}

const encounter = {
    charList: [],
}

const unassignedGroup = {
    charList: [],
}

/* #endregion Groups */

/* #region  Char Creation */

function Char(name, race) {
    this.name = `${name}`;
    
    this.raceName = `${race.name}`;
    this.talent1Name = ``;
    this.talent2Name = ``;
    this.hp = 100;
    this.abilities = [0],
        this.stats = race.stats;
    this.addStatBonus = function (statName, amount) {
        switch (statName) {
            case `strength`:
                this.stats.strength += amount;
                break;
            case `dexterity`:
                this.stats.dexterity += amount;
                break;
            case `willpower`:
                this.stats.willpower += amount;
                break;
            case `vitality`:
                this.stats.vitality += amount;
                break;
            case `agility`:
                this.stats.agility += amount;
                break;
            case `initiative`:
                this.stats.initiative += amount;
                break;
            case `intelligence`:
                this.stats.intelligence += amount;
                break;
            case `charisma`:
                this.stats.charisma += amount;
                break;
        }
    }
    this.useAbility = function (abilityIndex, target) {
        if (abilityIndex in this.abilities) {
            allAbilities[abilityIndex].effect(this, target);
        }
    }
    this.getTalentNames = function () {
        return this.talent1Name + this.talent2Name;
    }
    /*     
        this.inventory = {
            hands: [null,null,null,null],
            backpack: false,
            saddlebag: false,
            properties: false,
        };
        this.resists = race.resists; 
    */
    this.equipment = {
        mainHand: allWeapons[0],
        offHand: allWeapons[0],
        armor: null,
    }
};

function characterCreator(name, race, talent1, talent2, group) {
    function createChar(name, race) {
        unassignedGroup.charList.push(new Char(name, race));
    }
    function addTalents(talent1, talent2) {
        // targetChar is always equal to the latest created character in the unnassignedGroup.charList array.
        const targetChar = unassignedGroup.charList[unassignedGroup.charList.length - 1];
        const talent1StatBonusName = talent1.statBonusName;
        const talent1StatBonusAmount = talent1.statBonusAmount;
        const talent2StatBonusName = talent2.statBonusName;
        const talent2StatBonusAmount = talent2.statBonusAmount;
        const talent1Ability = talent1.ability;
        const talent2Ability = talent2.ability;
        targetChar.talent1Name = talent1.name;
        targetChar.talent2Name = talent2.name;
        targetChar.addStatBonus(talent1StatBonusName, talent1StatBonusAmount);
        targetChar.addStatBonus(talent2StatBonusName, talent2StatBonusAmount);
        targetChar.abilities.push(talent1Ability);
        targetChar.abilities.push(talent2Ability);
    }
    function assignGroup(group) {
        const targetChar = unassignedGroup.charList[unassignedGroup.charList.length - 1];
        group.charList.push(targetChar);
        unassignedGroup.charList.pop();
    }
    createChar(name, race);
    addTalents(talent1, talent2);
    assignGroup(group);
};

/* #endregion Char Creation*/


defineAllAbilities();
defineAllWeapons();
defineAllRaces();
defineAllTalents();

characterCreator(`Stroick`, allRaces[0], allTalents[0], allTalents[1], party);
characterCreator(`Evil`, allRaces[1], allTalents[4], allTalents[5], encounter);

const stroick = party.charList[0];
const evil = encounter.charList[0];