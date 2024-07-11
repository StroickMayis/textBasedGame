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
    damageDisplay: function (damage) {
        let damageRollDisplay = [];
        damageRollDisplay[0] = ``;
        if (sumOfArray(damage) < 1) {
            damageRollDisplay[1] = 1;
        } else {
            damageRollDisplay[1] = sumOfArray(damage);
        }
        let damageBonus = popArrayPopValue(damage);
        let damageCopy = popArrayArrayValue(damage);
        for (let i = 0; i < damageCopy.length; i++) {
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
    critHeal: function (caster, target, healAmountRoll, healBonus, healAmount) {
        console.log(`${caster.name} CRITICALLY HEALS ${target.name} and rolls a ${healAmountRoll} with a ${healBonus} bonus times 2 for a total of ${healAmount} healing!`)
    },
    healAttempt: function (caster, target, healRoll, healBonus) {
        console.log(`${caster.name} attempts to heal ${target.name} with a roll of: ${healRoll}.`)
    },
    heal: function (caster, target, healAmountRoll, healBonus, healAmount) {
        console.log(`${caster.name} heals ${target.name} with a heal roll of ${healAmountRoll} and a ${healBonus} bonus for a total of ${healAmount} healing!`)
    },
    healFail: function (caster, target) {
        console.log(`${caster.name} fails to heal ${target.name}!`)
    },
    noAP: function (abilityName, abilityAPCost) {
        console.log(`Not enough AP to cast ${abilityName}. Total AP: ${turn.AP} - Ability Cost: ${abilityAPCost} `)
    },
    charIsDead: function (char, ability) {
        console.log(`${char.name} cannot cast ${ability.name} while he is dead!`);
    },
}

/* #endregion Combat Log*/

/* #region  Ability Effects & Logic */

const turn = {
    AP: 100,
    end: function () {
        this.AP = 100;
        while(this.AP > 0) {
            // const attackingNPC = NPCs.charList[dice(NPCs.charList.length - 1)];
            // attackingNPC.useAbility( attackingNPC.abilities[dice(attackingNPC.abilities.length - 1)] ,PCs.charList[dice(PCs.charList.length - 1)]);
            const attackingNPC = NPCs.charList[0];
            attackingNPC.useAbility( 0 , PCs.charList[diceMinus1(PCs.charList.length)]);
        };
        this.AP = 100;
        DOM.update();
        DOM.updateTopBar();
    },
}

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
    heal: function (caster, target) {
        const healRoll = dice(100);
        const healAmountRoll = dice(4);
        const healBonus = caster.stats.willpower;
        const healAmount = healAmountRoll + healBonus;
        if(healRoll === 100) {
            combatLog.critHeal(caster, target, healAmountRoll, healBonus, healAmount);
            if(healAmount < 1) {
                target.hp += 2;
            } else {
                target.hp += healAmount * 2;
            }
        } else {
            combatLog.healAttempt(caster, target, healRoll, healBonus);
            if(healRoll > 1) {
                combatLog.heal(caster, target, healAmountRoll, healBonus, healAmount);
                if(healAmount < 1) {
                    target.hp += 1;
                } else {
                    target.hp += healAmount;
                }
            } else {
                combatLog.healFail(caster, target);
            }
        }
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

function diceMinus1(dMax) {
    return Math.floor(Math.random() * dMax + 1) - 1;
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

function isAttackingAllies(caster, target) {
    if(caster.groupName === `PC` && target.groupName === `PC`) {
        console.log(`Don't attack your allies!`);
        return true
    }
    if(caster.groupName === `NPC` && target.groupName === `NPC`) {
        return true
    }
    return false;
};

function isHealingEnemies(caster,target) {
    if(caster.groupName === `PC` && target.groupName === `NPC`) {
        console.log(`Don't heal the enemy!`);
        return true
    }
    if(caster.groupName === `NPC` && target.groupName === `PC`) {
        return true
    }
    return false;
};

function isHealingDeadTarget(target,abilityName) {
    if(target.hp < 1) {
        console.log(`${abilityName} is not powerful enough to ressurect ${target.name}.`)
        return true
    }
}

function forceHPtoZero(char) {
    if(char.hp < 0) {
        char.hp = 0;
    }
}

/* #endregion Ability Effects & Logic*/

/* #region All Lists */

const allAbilities = [];
function defineAllAbilities() {
    allAbilities[0] = {
        name: `Attack`,
        effect: function (caster, target) { 
            if(!isAttackingAllies(caster, target)) {
                if(turn.AP >= this.APCost) {
                    effect.attack(caster, target); turn.AP -= this.APCost
                } else {
                    combatLog.noAP(this.name, this.APCost);
                }
            } 
        },
        APCost: 25,
    }
    allAbilities[1] = {
        name: `Powerful Strike`,
        effect: function (caster, target) { 
            if(!isAttackingAllies(caster, target)) {
                if(turn.AP >= this.APCost) {
                    effect.attack(caster, target); turn.AP -= this.APCost
                } else {
                    combatLog.noAP(this.name, this.APCost);
                }
            } 
        },
        APCost: 25,
    }
    allAbilities[2] = {
        name: `Precision Strike`,
        effect: function (caster, target) { 
            if(!isAttackingAllies(caster, target)) {
                if(turn.AP >= this.APCost) {
                    effect.attack(caster, target); turn.AP -= this.APCost
                } else {
                    combatLog.noAP(this.name, this.APCost);
                }
            } 
        },
        APCost: 25,
    }
    allAbilities[3] = {
        name: `Healing Word`,
        effect: function (caster, target) { 
            if(!isHealingEnemies(caster, target)) {
                if(!isHealingDeadTarget(target, this.name)) {
                    if(turn.AP >= this.APCost) {
                        effect.heal(caster, target); turn.AP -= this.APCost
                    } else {
                        combatLog.noAP(this.name, this.APCost);
                    }
                } 
            } 
        },
        APCost: 50,
    }
    allAbilities[4] = {
        name: `Guard`,
        effect: function (caster, target) { 
            if(!isAttackingAllies(caster, target)) {
                if(turn.AP >= this.APCost) {
                    effect.attack(caster, target); turn.AP -= this.APCost
                } else {
                    combatLog.noAP(this.name, this.APCost);
                }
            } 
        },
        APCost: 25,
    }
    allAbilities[5] = {
        name: `Leaping Strike`,
        effect: function (caster, target) { 
            if(!isAttackingAllies(caster, target)) {
                if(turn.AP >= this.APCost) {
                    effect.attack(caster, target); turn.AP -= this.APCost
                } else {
                    combatLog.noAP(this.name, this.APCost);
                }
            } 
        },
        APCost: 25,
    }
    allAbilities[6] = {
        name: `Riposte`,
        effect: function (caster, target) { 
            if(!isAttackingAllies(caster, target)) {
                if(turn.AP >= this.APCost) {
                    effect.attack(caster, target); turn.AP -= this.APCost
                } else {
                    combatLog.noAP(this.name, this.APCost);
                }
            } 
        },
        APCost: 25,
    }
    allAbilities[7] = {
        name: `Advise`,
        effect: function (caster, target) { 
            if(!isAttackingAllies(caster, target)) {
                if(turn.AP >= this.APCost) {
                    effect.attack(caster, target); turn.AP -= this.APCost
                } else {
                    combatLog.noAP(this.name, this.APCost);
                }
            } 
        },
        APCost: 25,
    }
    allAbilities[8] = {
        name: `Flesh Eating`,
        effect: function (caster, target) { 
            if(!isAttackingAllies(caster, target)) {
                if(turn.AP >= this.APCost) {
                    effect.attack(caster, target); turn.AP -= this.APCost
                } else {
                    combatLog.noAP(this.name, this.APCost);
                }
            } 
        },
        APCost: 25,
    }
    allAbilities[9] = {
        name: `Flicker`,
        effect: function (caster, target) { 
            if(!isAttackingAllies(caster, target)) {
                if(turn.AP >= this.APCost) {
                    effect.attack(caster, target); turn.AP -= this.APCost
                } else {
                    combatLog.noAP(this.name, this.APCost);
                }
            } 
        }, 
        APCost: 25,
    }
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

const PCs = {
    name: `PC`,
    charList: [],
}

const NPCs = {
    name: `NPC`,
    charList: [],
}

const unassignedGroup = {
    name: `Unassigned`,
    charList: [],
}

/* #endregion Groups */

/* #region  Char Creation */

function Char(name, race) {
    this.name = `${name}`;
    this.groupName = ``;
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
        if(this.hp > 0) {
            if (this.abilities.includes(+abilityIndex)) {
                allAbilities[abilityIndex].effect(this, target);
            }
        } else {
            combatLog.charIsDead(this, allAbilities[abilityIndex]);
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
        targetChar.groupName = group.name;
        group.charList.push(targetChar);
        unassignedGroup.charList.pop();
    }
    createChar(name, race);
    addTalents(talent1, talent2);
    assignGroup(group);
};

/* #endregion Char Creation*/

/* #region  DOM */

const DOM = {
    equipmentList: document.querySelector(`.equipmentList`),
    endTurnButton: document.querySelector(`.endTurnButton`),
    APCount: document.querySelector(`.APCount`),
    casterSelectionDisplay: document.querySelector(`.casterSelectionDisplay`),
    targetSelectionDisplay: document.querySelector(`.targetSelectionDisplay`),
    PCBar: document.querySelector(`.PCBar`),
    NPCBar: document.querySelector(`.NPCBar`),
    abilityListContainer: document.querySelector(`.abilityListContainer`),
    botBar: document.querySelector(`.botBar`),
    midBar: document.querySelector(`.midBar`),
    casterSelection: null,
    targetSelection: null,
    casterSelectionState: null,
    targetSelectionState: null,

    listenForEndTurnButton: function () {
        this.endTurnButton.addEventListener(`click`, (e) => {
            turn.end();
        })
    },

    attemptAbilityCast: function (target) {
        const abilityNameSubDiv = target.querySelector(`.abilityName`);
        const abilityDatasetIndex = abilityNameSubDiv.dataset.abilityIndex;
        if((this.casterSelectionState && this.targetSelectionState) !== null) {
            this.casterSelectionState.useAbility(abilityDatasetIndex, this.targetSelectionState)
        } else {
            console.log(`invalid targets`);
        }
        this.update();
        this.updateTopBar();
    },

    listenForBotBar: function () {
        this.botBar.addEventListener(`click`, (e) => {
            switch(e.target.className) {
                case `ability`:
                    this.attemptAbilityCast(e.target);
                break;
                case `slideLeft`:

                break;
                case `slideRight`:

                break;
            }
        })
    },

    updateTopBar: function () {
        if(this.casterSelectionState) {
            this.casterSelectionDisplay.textContent = `Caster: ${this.casterSelectionState.name}`;
        } else {
            this.casterSelectionDisplay.textContent = `Caster: None Selected`;
        }

        if(this.targetSelectionState) {
            this.targetSelectionDisplay.textContent = `Target: ${this.targetSelectionState.name}`;
        } else {
            this.targetSelectionDisplay.textContent = `Target: None Selected`;
        }
        this.APCount.textContent = `Action Points: ${turn.AP}`;
    },

    updateBotBar: function (selectedPC) {
        if (selectedPC && !this.abilityListContainer.hasChildNodes()) {
            selectedPC.abilities.forEach((element) => this.createAbility(element));
        } else if (!selectedPC) {
            this.abilityListContainer.innerHTML = ``;
        }
    },

    createAbility: function (abilityIndex) {
        const i = document.createElement(`div`);
        i.className = `ability`;
        i.innerHTML = `<div data-ability-index=${abilityIndex} class="abilityName">${allAbilities[abilityIndex].name}</div>`;
        this.abilityListContainer.append(i);          
    },

    // selectTarget: function (target) {
    //     this.targetSelection = target;
    //     let targetGroup = target.className;
    //     const targetGroupIndex = target.dataset.groupIndex;
    //     if(targetGroup === `NPC`) {
    //         this.targetSelectionState = NPCs.charList[targetGroupIndex];
    //         target.style.borderColor = `red`;
    //     };
    //     if(targetGroup === `PC`) {
    //         this.targetSelectionState = PCs.charList[targetGroupIndex];
    //         target.style.borderColor = `yellow`;
    //     }
    // },

    selectCaster: function (target) {
        if(this.casterSelection !== null && target !== this.casterSelection) {
            this.deselectCaster();
        }
        const targetGroupIndex = target.dataset.groupIndex;
        this.casterSelectionState = PCs.charList[targetGroupIndex];
        this.casterSelection = target;
        if(this.casterSelectionState.hp === 0) {
            this.casterSelection.style.borderColor = `rgb(75,75,150)`; 
        } else {
            this.casterSelection.style.borderColor = `blue`; 
        }
        this.updateBotBar();
        this.updateEquipmentList();
    },

    deselectCaster: function () {
        if(this.casterSelection) {
            if(this.casterSelection === this.targetSelection) {
                this.targetSelection.style.borderColor = `yellow`;
                this.casterSelection = null;
                this.casterSelectionState = null;
           } else {
                if(this.casterSelectionState.hp === 0) {
                    this.casterSelection.style.borderColor = `rgb(50,50,50)`;
                } else {
                    this.casterSelection.style.borderColor = `white`;
                }
                this.casterSelection = null;
                this.casterSelectionState = null;
           } 
        }

        // if(this.casterSelection) {
        //    if(this.casterSelectionState.hp === 0) {
        //         this.casterSelection.style.borderColor = `rgb(50,50,50)`;
        //    } else {
        //         this.casterSelection.style.borderColor = `white`;
        //    }
        //    this.casterSelection = null;
        //    this.casterSelectionState = null;
        // }
        this.updateBotBar(); 
    },

    listenForCasterSelection: function () {
        this.PCBar.addEventListener(`click`, (e) => {

            if(e.target.className === `PC`) {
                this.selectCaster(e.target);
            } else {
                this.deselectCaster();
            }
            this.updateTopBar();
            this.updateBotBar(this.casterSelectionState);
        })
    },

    listenForTargetSelection: function () {
        this.midBar.addEventListener(`contextmenu`, (e) => {
            e.preventDefault();
            if(e.target.className === `PC` || e.target.className === `NPC`) {
                this.selectTarget(e.target);
            } else {
                this.deselectTarget();
            }
            this.updateTopBar();
        })
    },

    selectTarget: function (target) {
        if(this.targetSelection !== null && target !== this.targetSelection) {
            this.deselectTarget();
        }
        this.targetSelection = target;
        let targetGroup = target.className;
        const targetGroupIndex = target.dataset.groupIndex;
        if(targetGroup === `NPC`) {
            this.targetSelectionState = NPCs.charList[targetGroupIndex];
            target.style.borderColor = `red`;
        };
        if(targetGroup === `PC`) {
            this.targetSelectionState = PCs.charList[targetGroupIndex];
            target.style.borderColor = `yellow`;
        }
    },

    deselectTarget: function () {
        if(this.targetSelection) {
            if(this.targetSelection === this.casterSelection) {
                if(this.targetSelectionState.hp === 0) {
                    this.targetSelection.style.borderColor = `rgb(75,75,150)`;
                } else {
                    this.targetSelection.style.borderColor = `blue`;
                }
                this.targetSelection = null;
                this.targetSelectionState = null;
           } else {
                if(this.targetSelectionState.hp === 0) {
                    this.targetSelection.style.borderColor = `rgb(50,50,50)`;
                } else {
                    this.targetSelection.style.borderColor = `white`;
                }
                this.targetSelection = null;
                this.targetSelectionState = null;
           } 
        }
    },

    update: function () {
        this.PCBar.innerHTML = ``;
        this.NPCBar.innerHTML = ``;
        for(let i = (PCs.charList.length - 1); i >= 0; i--) {
            this.createChar(PCs.charList[i], i)
        };
        for(let i = (NPCs.charList.length - 1); i >= 0; i--) {
            this.createChar(NPCs.charList[i], i)
        };
    }, 

    updateEquipmentList: function () {
        this.equipmentList.innerHTML = ``;
        for(let i = 0; i <= (Object.keys(this.casterSelectionState.equipment).length - 1); i++) {
            this.createEquipmentDisplay(this.casterSelectionState, i)
        };
    },

    createChar: function (char, charListIndex) {
        const i = document.createElement(`div`);
        i.className = `${char.groupName}`;
        i.id = `index${charListIndex}`;
        i.dataset.groupIndex = charListIndex;
        forceHPtoZero(char);
        if(char.hp === 0) {
            i.style.borderColor = `rgb(50,50,50)`;
            i.innerHTML = `<div class="name">${char.name}</div>
                           <div class="HP">HP: ${char.hp} (Dead)</div>
                           <div class="race">Race: ${char.raceName}</div>
                           <div class="talents">Talents: ${char.talent1Name} & ${char.talent2Name}</div>`;
        } else {
            i.innerHTML = `<div class="name">${char.name}</div>
                           <div class="HP">HP: ${char.hp}</div>
                           <div class="race">Race: ${char.raceName}</div>
                           <div class="talents">Talents: ${char.talent1Name} & ${char.talent2Name}</div>`;
        }
        
        switch(char.groupName) {
            case `PC`:
                if(this.casterSelectionState === char) {
                    if(this.casterSelectionState.hp === 0) {
                        i.style.borderColor = `rgb(75,75,150)`;
                    } else {
                        i.style.borderColor = `blue`;
                    }
                    this.casterSelection = i;
                } else if(this.targetSelectionState === char){
                    i.style.borderColor = `yellow`;
                    this.targetSelection = i;
                }
                this.PCBar.append(i)
            break;

            case `NPC`:
                if(this.targetSelectionState === char) {
                    i.style.borderColor = `red`;
                    this.targetSelection = i;
                }
                this.NPCBar.append(i)
            break;

            case `Unassigned`:
                console.log(`Error: Tried to put char with unassigned group onto DOM.`);
            break;

            default:
                console.log(`Error: Something weird happened here.`);
            break;
        }
    },

    createEquipmentDisplay: function (char, keyNumberOfItem) {
        const i = document.createElement(`div`);
        const arrayOfAllKeysInEquipment = Object.keys(char.equipment);
        const itemKeyName = arrayOfAllKeysInEquipment[keyNumberOfItem];
        const item = char.equipment[itemKeyName];
        if(item === null) {
            i.innerHTML = `<div class="slotName">${itemKeyName}: None</div>`;
        } else {
            i.innerHTML = `<div class="slotName">${itemKeyName}: ${item.name} Damage: ${item.damageDiceMultiplier}D${item.damage}</div>`;
        }
        this.equipmentList.append(i);
    },
};

/* #endregion DOM*/

defineAllAbilities();
defineAllWeapons();
defineAllRaces();
defineAllTalents();
   
characterCreator(`Stroick`, allRaces[0], allTalents[0], allTalents[1], PCs);
characterCreator(`Kliftin`, allRaces[1], allTalents[2], allTalents[6], PCs);
characterCreator(`Dahmer Hobo`, allRaces[3], allTalents[6], allTalents[7], NPCs);
characterCreator(`Evil`, allRaces[2], allTalents[4], allTalents[5], NPCs);

const stroick = PCs.charList[0];
const evil = NPCs.charList[0];
const kliftin = PCs.charList[1];


DOM.update();
DOM.listenForCasterSelection();
DOM.listenForBotBar();
DOM.listenForEndTurnButton();
DOM.listenForTargetSelection();