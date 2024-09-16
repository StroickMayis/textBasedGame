import { drop, forEach } from "lodash";
import "./index.css"; 
import "./images/dagger.png";
import "./images/amulet.png";
import "./images/arms.png";
import "./images/head.png";
import "./images/inventory.png";
import "./images/legs.png";
import "./images/mainHand.png";
import "./images/offHand.png";
import "./images/torso.png";
import "./images/quickAccess.png";
import "./images/oldShirt.png";
import "./images/trustyBelt.png";
import printMe from './print.js';

"use strict";

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
// TODO: Search for TODO's throughout the code and do them.
// TODO: Should merge the branches in git at this point.

/* #endregion Notes*/

/* #region  Combat Log */

const combatLog = {
    critHit: function (caster, target, damage) {
        console.log(`            - ${caster.name} -->  CRITICALLY HITS!!! --> ${target.name} -
            ▼             - ROLLS -            ▼`);
        this.displayDamageRollsByResist(damage);
        console.log(`            ▼         - DAMAGE TOTALS (2X)-        ▼`)
    },
    attackAttempt: function (caster, target, attackRoll, defendRoll, attackBonus, defendBonus, ability) {
        const attack = attackRoll + attackBonus;
        const defend = defendRoll + defendBonus;
        console.log(`${caster.name} attacks --> ${target.name} 
            - Weapon: ${caster.equipment.mainHand.name} - Ability: ${ability.name} - 
            - Attack Roll : ${attackRoll} + Bonus : ${attackBonus} -
            - Defend Roll : ${defendRoll} + Bonus : ${defendBonus} -
            ▼          - HIT TOTALS: -         ▼
            - Attack   ${attack}   -->   ${defend}   Defense -`);
    },
    displayDamageRollsByResist: function (damage) {
        // input looks like: [[0,2][0,3][0,4]] last index is the damage bonus.
        //takes off the damage bonus and stores in this variable.
        let damageBonus = damage.pop();
        // So the below goes from [[0,2][0,3][0,4][2,6]] to [[2,3,4],[null],[6],[null],... etc] if that makes sense.
        let resistanceSortArr = [[null],[null],[null],[null],[null],[null],[null],[null],[null]];
        damage.forEach((ele) => {
            switch(ele[0]) {
                case 0:
                    if(resistanceSortArr[0][0] === null) {
                        resistanceSortArr[0] = [];
                    }
                    resistanceSortArr[0].push(ele[1]);
                    break;
                case 1:
                    if(resistanceSortArr[1][0] === null) {
                        resistanceSortArr[1] = [];
                    }
                    resistanceSortArr[1].push(ele[1]);
                    break;
                case 2:
                    if(resistanceSortArr[2][0] === null) {
                        resistanceSortArr[2] = [];
                    }
                    resistanceSortArr[2].push(ele[1]);
                    break;
                case 3:
                    if(resistanceSortArr[3][0] === null) {
                        resistanceSortArr[3] = [];
                    }
                    resistanceSortArr[3].push(ele[1]);
                    break;
                case 4:
                    if(resistanceSortArr[4][0] === null) {
                        resistanceSortArr[4] = [];
                    }
                    resistanceSortArr[4].push(ele[1]);
                    break;
                case 5:
                    if(resistanceSortArr[5][0] === null) {
                        resistanceSortArr[5] = [];
                    }
                    resistanceSortArr[5].push(ele[1]);
                    break;
                case 6:
                    if(resistanceSortArr[6][0] === null) {
                        resistanceSortArr[6] = [];
                    }
                    resistanceSortArr[6].push(ele[1]);
                    break;
                case 7:
                    if(resistanceSortArr[7][0] === null) {
                        resistanceSortArr[7] = [];
                    }
                    resistanceSortArr[7].push(ele[1]);
                    break;
                case 8:
                    if(resistanceSortArr[8][0] === null) {
                        resistanceSortArr[8] = [];
                    }
                    resistanceSortArr[8].push(ele[1]);
                    break;
            }
        });
        for(let i = 0; i < 9; i++) {
            if(resistanceSortArr[i][0] !== null) {
                switch(i) {
                    case 0:
                        if(damageBonus[0] === i) {
                            console.log(`            Flat damage rolls: ${createRollOutcomeString(resistanceSortArr[0])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Flat damage rolls: ${createRollOutcomeString(resistanceSortArr[0])}`);
                        }
                    break;
                    case 1:
                        if(damageBonus[0] === i) {
                            console.log(`            Piercing damage rolls: ${createRollOutcomeString(resistanceSortArr[1])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Piercing damage rolls: ${createRollOutcomeString(resistanceSortArr[1])}`);
                        }
                    break;
                    case 2:
                        if(damageBonus[0] === i) {
                            console.log(`            Ice damage rolls: ${createRollOutcomeString(resistanceSortArr[2])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Ice damage rolls: ${createRollOutcomeString(resistanceSortArr[2])}`);
                        }
                    break;
                    case 3:
                        if(damageBonus[0] === i) {
                            console.log(`            Fire damage rolls: ${createRollOutcomeString(resistanceSortArr[3])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Fire damage rolls: ${createRollOutcomeString(resistanceSortArr[3])}`);
                        }
                    break;
                    case 4:
                        if(damageBonus[0] === i) {
                            console.log(`            Corrosive damage rolls: ${createRollOutcomeString(resistanceSortArr[4])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Corrosive damage rolls: ${createRollOutcomeString(resistanceSortArr[4])}`);
                        }
                    break;
                    case 5:
                        if(damageBonus[0] === i) {
                            console.log(`            Poison damage rolls: ${createRollOutcomeString(resistanceSortArr[5])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Poison damage rolls: ${createRollOutcomeString(resistanceSortArr[5])}`);
                        }
                    break;
                    case 6:
                        if(damageBonus[0] === i) {
                            console.log(`            Spiritual damage rolls: ${createRollOutcomeString(resistanceSortArr[6])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Spiritual damage rolls: ${createRollOutcomeString(resistanceSortArr[6])}`);
                        }
                    break;
                    case 7:
                        if(damageBonus[0] === i) {
                            console.log(`            Lightning damage rolls: ${createRollOutcomeString(resistanceSortArr[7])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Lightning damage rolls: ${createRollOutcomeString(resistanceSortArr[7])}`);
                        }
                    break;
                    case 8:
                        if(damageBonus[0] === i) {
                            console.log(`            Arcane damage rolls: ${createRollOutcomeString(resistanceSortArr[8])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Arcane damage rolls: ${createRollOutcomeString(resistanceSortArr[8])}`);
                        }
                    break;
                }
            }
        };
    },
    hit: function (caster, target, damage) {
        console.log(`            - ${caster.name} --> HITS --> ${target.name} -
            ▼             - ROLLS -            ▼`);
        this.displayDamageRollsByResist(damage);
        console.log(`            ▼         - DAMAGE TOTALS -        ▼`)
    },
    damageResist: function (typeNumber, damage, resist, damageSum, caster, target, guardState) {
        const resistTypeName = getResistTypeNameFromIndexNumber(typeNumber); // * Converts the index-style number of a resist ex. 0 = flat, into its name for console display.
        if(guardState === `guarded`) {
            let targetDamage = Math.ceil(damage / 2);
            let targetGuardDamage = Math.floor(damage / 2);
            console.log(`            ${caster.name}'s' ${damage} ${resistTypeName} is split in half to guard : ${targetGuardDamage} --> ${target.buffs.guarded.caster.name},
        so the remaining ${targetDamage} --> ${target.name}'s ${resist} Resist = ${target.name} takes ${damageSum} ${resistTypeName} damage.`);
        
        } else if(guardState === `guarding`){
            let targetGuardDamage = Math.floor(damage / 2);
            console.log(`            ${target.name} takes half of the damage intended for ${target.buffs.guarding.target.name}, 
        so ${caster.name}'s ${targetGuardDamage} ${resistTypeName} --> ${target.name}'s ${resist} Resist = ${target.name} takes ${damageSum} ${resistTypeName} damage.`);

        } else {
            console.log(`            ${caster.name}'s ${damage} ${resistTypeName} --> ${target.name}'s ${resist} Resist = ${damageSum} ${resistTypeName} Damage`);
        }
    },
    totalDamage: function (caster, target, totalDamage) {
        console.log(`->          ${caster.name} deals a total of ${totalDamage} damage to ${target.name}`);
    },
    hitBackupCopy: function (caster, target, damage) {
        let damageDisplayArray = this.damageDisplay(damage); // * damageDisplayArray is an array with the index[0]
        let targetDamageSplit = Math.floor((damageDisplayArray[1]) / 2);
        let guardDamageSplit = Math.ceil((damageDisplayArray[1]) / 2);
        if (target.buffs.guarded) {
            console.log(`${caster.name} hits ${target.name} and rolls a ${damageDisplayArray[0]} for a total of ${damageDisplayArray[1]} damage, but because ${target.name} is guarded, the damage is split between him and his guard ${target.buffs.guarded.caster.name}, ${target.name} takes ${targetDamageSplit} and ${target.buffs.guarded.caster.name} will take ${guardDamageSplit} but has a chance to defend it.`);
        } else {
            console.log(`${caster.name} hits ${target.name} and rolls a ${damageDisplayArray[0]} for a total of ${damageDisplayArray[1]} damage.`);
        }

    },
    defend: function (caster, target) {
        console.log(`${target.name} defends ${caster.name}'s attack!`);
    },
    guardDefend: function (caster, target, guard) {
        console.log(`${guard.name} defends the incoming damage from ${caster.name} redirected to him from his guard target ${target}!`)
    },
    guardFailsDefend: function (caster, target, guard) {
        console.log(`            ${caster.name}'s SPLIT HITS --> ${guard.name} from guarding --> ${target.name}`);
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
    guard: function (caster, target) {
        console.log(`${caster.name} casts his Guard onto ${target.name}.`);
    },
    guardSwitch: function (caster, target) {
        console.log(`${caster.name} switches his Guard from ${caster.buffs.guarding.target.name} to ${target.name}.`);
    },
    riposte: function (caster, target) {
        console.log(`${caster.name} defends well enough to attempt a riposte on ${target.name}.`)
    },
    startNPCTurn: function () {
        console.log(`
            Start NPC Turn:
            `);
    },
    startPCTurn: function () {
        console.log(`
            Start PC Turn:
            `);
    },
    casterOnlyBuff: function (caster, buff) {
        console.log(`${caster.name} casts ${buff.name} on himself.`);
    },
    debuff: function (caster, target, targetDebuff) {
        console.log(`${caster.name} casts ${targetDebuff.name} onto ${target.name}.`)
    },
    targetNotInRange: function (target, abilityName) {
        console.log(`${target.name} is not in range for ${abilityName} to hit them!`);
    },
    
}

/* #endregion Combat Log*/

/* #region  Ability Effects & Logic */ 

const turn = {
    AP: 100,
    end: function () {
        combatLog.startNPCTurn();
        this.AP = 100;
        while (this.AP > 0) { 
            let attackablePCs = [];
            for(let i = 0; i < PCs.charList.length; i++) { // * Checks if a PC is alive, if so, add them to the list of attackable PCs.
                if(PCs.charList[i].hp > 1) {
                    attackablePCs.push(PCs.charList[i]);
                }
            }
            if(!attackablePCs[0]) {
                break;
            }
            const attackingNPC = NPCs.charList[diceMinus1(NPCs.charList.length)];
            attackingNPC.useAbility(0, attackablePCs[diceMinus1(attackablePCs.length)]);
        };
        this.AP = 100;
        DOM.update();
        DOM.updateTopBar();
        combatLog.startPCTurn();
    },
}

const effect = {
    meleeAttack: function (caster, target, mods) {
        const ability = allAbilities[mods.abilityIndex];
        let riposte = false;
        let damageSum;

        /* #region  CASTER ATTACK */
        let attackRollAdvantages = calcTargetAttackAdvatages(caster);
        let attackRoll = rollWithAdvantageCount(100, attackRollAdvantages);
        const attack = attackRoll + mods.attackBonus;
        /* #endregion */

        /* #region  TARGET DEFEND */
        let defendRollAdvantages = calcTargetDefendAdvatages(target);
        let defendRoll = rollWithAdvantageCount(20, defendRollAdvantages);
        const defend = defendRoll + mods.getDefendBonus();
        /* #endregion */

        combatLog.attackAttempt(caster, target, attackRoll, defendRoll, mods.attackBonus, mods.getDefendBonus(), ability);

        /* #region  CHECK & SET RIPOSTE */
        if (!mods.isRiposte) {
            if ((Math.ceil(attack / 2)) <= defend) {
                riposte = true
            }
        }
        /* #endregion */

        /* #region  IF TARGET DEFENDS ATTACK */
        if (attack <= defend) {
            combatLog.defend(caster, target);
            if (riposte) {
                combatLog.riposte(target, caster);
                target.useAbility(9, caster);
            }
            return;
        }
        /* #endregion */

        const damageRollArr = concatRollDice(mods.damageRollDice.mainHandWeapon, mods.damageRollDice.offHandWeapon, mods.damageRollDice.ability);
        damageRollArr.push(mods.damageBonus);
        // sum of damage array will return something like this: if input is equal to [[0,3][0,4][4,8]] then output is [7,0,0,0,8,0,0,0,0]
        let totalDamagePerResist = sumOfDamageArray(damageRollArr);

        if (attackRoll >= mods.critThreshold) { // * ON CRIT
            combatLog.critHit(caster, target, damageRollArr);
            totalDamagePerResist = resistArrayMultiply(totalDamagePerResist, 2); // ! Crit multiplier, currently just locked at 2. Can make dynamic later.
        } else { // * ON HIT
            combatLog.hit(caster, target, damageRollArr)
        } 

        if (target.buffs.guarded) {
            const guardDefense = getGuardDefense(`melee`, target.buffs.guarded.caster);
            const targetDamage = calcTotalDamageAfterResists(totalDamagePerResist, target.resistsArray, caster, target, `guarded`);
            combatLog.totalDamage(caster, target, sumOfArray(targetDamage));
            target.hp -= sumOfArray(targetDamage);
            if (attack > guardDefense) {
                combatLog.guardFailsDefend(caster, target, target.buffs.guarded.caster);
                const guardDamage = calcTotalDamageAfterResists(totalDamagePerResist, target.buffs.guarded.caster.resistsArray, caster, target.buffs.guarded.caster, `guarding`);
                combatLog.totalDamage(caster, target.buffs.guarded.caster, sumOfArray(guardDamage));
                target.buffs.guarded.caster.hp -= sumOfArray(guardDamage);
            } else {
                combatLog.guardDefend(caster, target, target.buffs.guarded.caster);
            }
        } else {
            damageSum = calcTotalDamageAfterResists(totalDamagePerResist, target.resistsArray, caster, target, false); // * also calls combatLog()
            combatLog.totalDamage(caster, target, sumOfArray(damageSum));
            target.hp -= sumOfArray(damageSum); 
        }

        if (riposte) {
            combatLog.riposte(target, caster);
            target.useAbility(9, caster);
        }
        
        return;
    },

    // rangedAttack: function (caster, target) {
    //     const mods = {
    //         attackRollDice: 100,
    //         attackBonus: caster.stats.dexterity,
    //         defendRollDice: 20,
    //         defendBonus

    //     }
    //     const attackRoll = dice(100);
    //     const defendRoll = dice(20);
    //     const attackBonus = caster.stats.dexterity;
    //     const defendBonus = this.determineDefendBonus(caster, target);
    //     const damage = this.determineDamage(caster);
    //     const attack = attackRoll + attackBonus;
    //     const defend = defendRoll + defendBonus;
    //     if (attackRoll === 100) {
    //         combatLog.critHit(caster, target, damage);
    //         if (sumOfArray(damage) < 1) {
    //             target.hp -= 2;
    //         } else {
    //             target.hp -= sumOfArray(damage) * 2;
    //         }
    //     } else {
    //         combatLog.attackAttempt(caster, target, attackRoll, defendRoll, attackBonus, defendBonus);
    //         if (attack >= defend) {
    //             combatLog.hit(caster, target, damage);
    //             if (sumOfArray(damage) < 1) {
    //                 target.hp -= 1;
    //             } else {
    //                 target.hp -= sumOfArray(damage);
    //             }
    //         } else {
    //             combatLog.defend(caster, target);
    //         }
    //     }
    // },

    // magicalAttack: function (caster, target) {
    //     const mods = {
    //         attackRollDice: 100,
    //         attackBonus: caster.stats.dexterity,
    //         defendRollDice: 20,
    //         defendBonus

    //     }
    //     const attackRoll = dice(100);
    //     const defendRoll = dice(20);
    //     const attackBonus = caster.stats.dexterity;
    //     const defendBonus = this.determineDefendBonus(caster, target);
    //     const damage = this.determineDamage(caster);
    //     const attack = attackRoll + attackBonus;
    //     const defend = defendRoll + defendBonus;
    //     if (attackRoll === 100) {
    //         combatLog.critHit(caster, target, damage);
    //         if (sumOfArray(damage) < 1) {
    //             target.hp -= 2;
    //         } else {
    //             target.hp -= sumOfArray(damage) * 2;
    //         }
    //     } else {
    //         combatLog.attackAttempt(caster, target, attackRoll, defendRoll, attackBonus, defendBonus);
    //         if (attack >= defend) {
    //             combatLog.hit(caster, target, damage);
    //             if (sumOfArray(damage) < 1) {
    //                 target.hp -= 1;
    //             } else {
    //                 target.hp -= sumOfArray(damage);
    //             }
    //         } else {
    //             combatLog.defend(caster, target);
    //         }
    //     }
    // },

    heal: function (caster, target) {
        const healRoll = dice(100);
        const healAmountRoll = dice(4);
        const healBonus = caster.stats.willpower;
        const healAmount = healAmountRoll + healBonus;
        if (healRoll === 100) {
            combatLog.critHeal(caster, target, healAmountRoll, healBonus, healAmount);
            if (healAmount < 1) {
                target.hp += 2;
            } else {
                target.hp += healAmount * 2;
            }
        } else {
            combatLog.healAttempt(caster, target, healRoll, healBonus);
            if (healRoll > 1) {
                combatLog.heal(caster, target, healAmountRoll, healBonus, healAmount);
                if (healAmount < 1) {
                    target.hp += 1;
                } else {
                    target.hp += healAmount;
                }
            } else {
                combatLog.healFail(caster, target);
            }
        }
    },
    guard: function (caster, target, mods) { // * For every attack made on the target, the caster takes half of that damage.
        const targetBuff = {
            name: mods.buffNameForTarget,
            desc: mods.buffDescForTarget,
            caster: caster,
        }
        const casterBuff = {
            name: mods.buffNameForCaster,
            desc: mods.buffDescForCaster,
            target: target,
        }
        target.buffs.guarded = targetBuff;
        if (caster.buffs.guarding) {
            combatLog.guardSwitch(caster, target);
            delete caster.buffs.guarding.target.buffs.guarded;
            delete caster.buffs.guarding;
            caster.buffs.guarding = casterBuff;
        } else {
            combatLog.guard(caster, target);
            caster.buffs.guarding = casterBuff;
        }
    },
    casterOnlyBuff: function (caster, mods) { // * Buff
        const buff = mods;
        caster.buffs[mods.buffNameForBuffObj] = buff;
        combatLog.casterOnlyBuff(caster, buff);
    },
    debuff: function (caster, target, mods) { // * Buff
        const targetDebuff = mods;
        target.debuffs[mods.debuffNameForBuffObj] = targetDebuff;
        combatLog.debuff(caster, target, targetDebuff);
    },
};

/* #region  LOGIC */

function getFirstEmptyInventorySlot(char) { // * returns a number representing the first empty inventory index.
    for(let i = 0; i < char.inventory.length; i++) {
        if(char.inventory[i].isDefaultItem) {
            return i;
        }
    }
    return false;
}
function putDefaultItemInPlaceOfDrag(char, dragTargetCharData, dragTarget) {
    switch(dragTargetCharData.itemType) {
        case `weapon`:
            if(dragTarget.classList.contains(`mainHand`)) {
                char.equipment[dragTarget.dataset.equipmentSlotName] = allWeapons[0];
            } else {
                char.equipment[dragTarget.dataset.equipmentSlotName] = allWeapons[1];
            }
        break;
        case `armor`:
            switch(dragTarget.classList[1]) {
                case `head`:
                    char.equipment[dragTarget.dataset.equipmentSlotName] = allArmors[0];
                break;
                case `torso`:
                    char.equipment[dragTarget.dataset.equipmentSlotName] = allArmors[1];
                break;
                case `arms`:
                    char.equipment[dragTarget.dataset.equipmentSlotName] = allArmors[2];
                break;
                case `legs`:
                    char.equipment[dragTarget.dataset.equipmentSlotName] = allArmors[3];
                break;
                case `amulet1`:
                    char.equipment[dragTarget.dataset.equipmentSlotName] = allArmors[4];
                break;
                case `amulet2`:
                    char.equipment[dragTarget.dataset.equipmentSlotName] = allArmors[5];
                break;
                case `quickAccess1`:
                    char.equipment[dragTarget.dataset.equipmentSlotName] = allArmors[6];
                break;
                case `quickAccess2`:
                    char.equipment[dragTarget.dataset.equipmentSlotName] = allArmors[7];
                break;
            }
        break;
    }
}
function updateCharStats(char, addOrRemove, item) { // TODO: this is only adding resist, but not taking it away when item is removed. Must Fix.
    if(addOrRemove === `add`) {
        if(item.resists) {
            for(let i = 0; i < 9; i++) {
                char.resistsArray[i] += item.resists[i];
            }
        }
        if(item.parry) {
            char.parry += item.parry;
        }
        if(item.dodge) {
            char.dodge += item.dodge;
        }
        if(item.disrupt) {
            char.disrupt += item.disrupt;
        }
        if(item.block) {
            char.block += item.block;
        }
    } else if (addOrRemove === `remove`) {
        if(item.resists) {
            for(let i = 0; i < 9; i++) {
                char.resistsArray[i] -= item.resists[i];
            }
        }
        if(item.parry) {
            char.parry -= item.parry;
        }
        if(item.dodge) {
            char.dodge -= item.dodge;
        }
        if(item.disrupt) {
            char.disrupt -= item.disrupt;
        }
        if(item.block) {
            char.block -= item.block;
        }
    }
    console.log(char.resistsArray)
}
function formatResistArrayToText (resistArray) { // * input will look like the following:       resists: [0,0,-5,-5,-5,-5,-5,-5,-5], output will exclude resists that are 0.
    let resistNames = [`Flat`, `Piercing`, `Ice`,`Fire`,`Corrosive`,`Poison`,`Spiritual`,`Lightning`,`Arcane`];
    let outputText = ``;
    for(let i = 0; i < 9; i++) {
        if(resistArray[i] !== 0) {
            resistNames[i] += ` : ${resistArray[i]}`;
            outputText += `${resistNames[i]}<br>`
        }    
    }
    return outputText;
}
function formatDamageDiceToText (damageDice) { // * Input will look like:   [[0, 1, 4],[1, 2, 6]]   : this would mean 1d4 Flat & 2d6 Piercing.
    let outputText = ``;
    for(let i = 0; i < damageDice.length; i++) {
        outputText += `${damageDice[i][1]}d${damageDice[i][2]} ${getResistTypeNameFromIndexNumber(damageDice[i][0])}`;
        if(i < damageDice.length - 1) {
            outputText += ` & `;
        }
    }
    return outputText; 
}
function getResistTypeNameFromIndexNumber(typeNumber) {
    let resistName;
        switch(typeNumber) {
            case 0:
                resistName = `Flat`;
            break;
            case 1:
                resistName = `Piercing`;
            break;
            case 2:
                resistName = `Ice`;
            break;
            case 3:
                resistName = `Fire`;
            break;
            case 4:
                resistName = `Corrosive`;
            break;
            case 5:
                resistName = `Poison`;
            break;
            case 6:
                resistName = `Spiritual`;
            break;
            case 7:
                resistName = `Lightning`;
            break;
            case 8:
                resistName = `Arcane`;
            break;
        }
        return resistName;
}
function resistArrayMultiply(inputResistArray, multiplier) { // * Takes input like so: [7,0,0,0,8,0,0,0,0] and outputs all of those numbers multiplied by the amount specified.
    let outputResistArray = [0,0,0,0,0,0,0,0,0];
    for(let i = 0; i < 9; i++) {
        if (inputResistArray[i] > 0) {
            outputResistArray[i] = inputResistArray[i] * multiplier;
        }
    }
    return outputResistArray;

}
function createRollOutcomeString(rollOutcomeString) {
    // before the string is implied something along the lines of "rolls :"
    let output = ``;
    for(let i = 0; i < rollOutcomeString.length; i++) {
        output += rollOutcomeString[i];
        if(i + 1 !== rollOutcomeString.length)
        output += ` + `;
    }
    return output;
}
function calcTotalDamageAfterResists(damage, resists, caster, target, guardState) { // * Takes two 9 index long resist arrays, outputs the aftermath of damage. 
    // ! NOTE ! : guardState should only take `guarded` `guarding` or false as is args. 
    let damageSum = [0,0,0,0,0,0,0,0,0];
    for(let i = 0; i < 9; i++) { // * cycles 9 times for each resist
        if(damage[i] > 0) { // * If the damage is more than 0
            if(resists[i] >=  damage[i]) {  // * If the resist is more than or equal to the damage, then 1 damage is taken.
                damageSum[i] += 1;
            } else if(resists[i] < 0){  // * If the resist is negative
                if((resists[i] * -1) > damage[i]) { // * If the resist is more negative than the damage is positive, we just multiply the damage by 2, because a vulnerability cant do more than the original damage.
                    damageSum[i] += damage[i] * 2;
                } else { // * If the resist is negative, and all of it will be taken as damage, because the damage is higher than it.
                    damageSum[i] += damage[i] + (resists[i] * -1);
                }
            } else { // * If the resist is positive, but is less than the total damage.
                damageSum[i] += (damage[i] - resists[i])
            }
            divideGuardDamage(damageSum, i, guardState);
            combatLog.damageResist(i, damage[i], resists[i], damageSum[i], caster, target, guardState);
        } else if (damageSum[i] < 0){ // * if the damage is negative, then 1 damage is taken, because you cannot deal negative damage on an attack.
            divideGuardDamage(damageSum, i, guardState);
            combatLog.damageResist(i, damage[i], resists[i], damageSum[i], caster, target, guardState);
            damageSum[i] += 1;
        } else {
            damageSum[i] = 0;
        }
    }
    return damageSum;
}
function divideGuardDamage(damageSum, i, guardState) { // * checks for any kinds of guard states and divides accordingly. NOTE!: Alters the actual objects via reference.
    if (guardState === `guarded`) { 
        damageSum[i] = Math.ceil(damageSum[i] / 2);
    } else if(guardState === `guarding`) {
        damageSum[i] = Math.floor(damageSum[i] / 2);
    } else {
        return;
    }
    return;
}
function calcTargetAttackAdvatages(caster) { // * Takes target as input, returns the total advantage count for their defend roll, counting buffs and debuffs.
    let attackRollAdvantages = [];
    Object.keys(caster.buffs).forEach((buffKey) => {
        if (caster.buffs[buffKey].attackRollAdvantage) {
            attackRollAdvantages.push(caster.buffs[buffKey].attackRollAdvantage);
        }
    });
    Object.keys(caster.debuffs).forEach((buffKey) => {
        if (caster.buffs[buffKey].attackRollAdvantage) {
            attackRollAdvantages.push(caster.buffs[buffKey].attackRollAdvantage);
        }
    });
    return sumOfArray(attackRollAdvantages);
}
function calcTargetDefendAdvatages(target) { // * Takes target as input, returns the total advantage count for their defend roll, counting buffs and debuffs.
    let defendRollAdvantages = [];
    Object.keys(target.buffs).forEach((buffKey) => {
        if (target.buffs[buffKey].defendRollAdvantage) {
            defendRollAdvantages.push(target.buffs[buffKey].defendRollAdvantage);
        }
    });
    Object.keys(target.debuffs).forEach((buffKey) => {
        if (target.buffs[buffKey].defendRollAdvantage) {
            defendRollAdvantages.push(target.buffs[buffKey].defendRollAdvantage);
        }
    });
    return sumOfArray(defendRollAdvantages);
}
function rollWithAdvantageCount(diceSize, advantageCount) { // * Takes a dice size input, and a advantage or disadvantage count input (pos 1 will be a regular roll, lower will be disadvantage and higher will be advantage) returns the highest or lowest number respectiveley.
    let arrOfRolls = [];
    let isAdvantageCountPos;
    if (advantageCount < 0) {
        advantageCount *= -1;
        isAdvantageCountPos = false;
    } else {
        isAdvantageCountPos = true;
    }
    advantageCount += 1;
    for (let i = 0; i < advantageCount; i++) {
        arrOfRolls.push(dice(diceSize))
    };
    if (isAdvantageCountPos) {
        return Math.max(...arrOfRolls);
    } else {
        return Math.min(...arrOfRolls);
    }
}
function getGuardDefense(attackType, guarder) {
    const guarderBlock = Math.floor((guarder.stats.initiative / 2) + guarder.block);
    let returnValue;
    switch (attackType) {
        case `melee`:
            const guarderParry = Math.floor((guarder.stats.initiative / 2) + (guarder.stats.dexterity / 4) + guarder.parry);
            returnValue = Math.max(guarderParry, guarderBlock);
            break;
        case `ranged`:
            const guarderDodge = Math.floor((guarder.stats.initiative / 2) + (guarder.stats.agility / 4) + guarder.dodge);
            returnValue = Math.max(guarderDodge, guarderBlock);
            break;
        case `magic`:
            const guarderDisrupt = Math.floor((guarder.stats.initiative / 2) + (guarder.stats.willpower / 4) + guarder.disrupt);
            returnValue = Math.max(guarderDisrupt, guarderBlock);
            break;
    }
    return returnValue;
}
function doesArrayOfObjectsIncludeIndexOf(array, propertyName, value) {
    array.forEach((ele) => {
        if (ele[propertyName] === value) {
            let index = array.indexOf(ele);
            return index;
        }
        return false;
    });
}
function doesArrayOfObjectsInclude(array, propertyName, value) {
    array.forEach((ele) => {
        if (ele[propertyName] === value) {
            return true;
        }
        return false;
    });
}
function concatRollDice(...args) { // * Takes multiple 2D dice array input like rollDice does, but outputs will ignore null inputs.
    let outputArr = [];
    args.forEach((el) => {
        if (el) {
            let i = rollDice(el);
            outputArr = outputArr.concat(i);
        }
    });
    return outputArr;
}
function rollDice(diceArr) { // * Takes a 2D dice array input like so: [ [2,4] , [3,6] ] - equivilent to 2d4 + 3d6. Outputs array of each individual roll result, now with resistances.
    if (diceArr === null) {
        return null;
    }
    let rollArr = [];
    for (let i = 0; i < diceArr.length; i++) {
        for (let x = 0; x < diceArr[i][1]; x++) {

            rollArr.push([diceArr[i][0],dice(diceArr[i][2])]);
        }
    }
    return rollArr;
}
function dice(dMax) { // * Takes an integer number X as input and outputs a random number between 1 and X like a single dice roll.
    return Math.floor(Math.random() * dMax + 1);
}
function diceMinus1(dMax) { // * Takes an integer number X as input and outputs a random number between 0 and X.
    return Math.floor(Math.random() * dMax + 1) - 1;
}
function sumOfDamageArray(arrayOfNumbers) { // * Takes a 2D array of numbers and adds the index [1's] up, then returns an array 9 indexes long representing each damage resist type, and how much of that type was summed.
    if (arrayOfNumbers === null) {
        return null;
    }
    let sum = [0,0,0,0,0,0,0,0,0];
    for (let i = 0; i < arrayOfNumbers.length; i++) {
        sum[arrayOfNumbers[i][0]] += arrayOfNumbers[i][1];
    }
    return sum;
}
function sumOfArray(arrayOfNumbers) { // * Takes a 1D array of numbers and adds them up, then returns the sum.
    let sum = 0;
    arrayOfNumbers.forEach((el) => { if (el === null) { el = 0 } sum += el });
    return sum;
}
function popArrayPopValue(array) {
    let arrayCopy = Object.assign([], array);
    return arrayCopy.pop();
}
function popArrayArrayValue(array) {
    let arrayCopy = Object.assign([], array);
    arrayCopy.pop();
    return arrayCopy;
}
function isTargetDead(target) {
    if (target.hp < 1) {
        console.log(`Target is dead.`)
        return true
    }
}
function isAttackingAllies(caster, target) {
    if (caster.groupName === `PC` && target.groupName === `PC`) {
        console.log(`Don't attack your allies!`);
        return true
    }
    if (caster.groupName === `NPC` && target.groupName === `NPC`) {
        return true
    }
    return false;
};
function isHealingEnemies(caster, target) {
    if (caster.groupName === `PC` && target.groupName === `NPC`) {
        console.log(`Don't heal the enemy!`);
        return true
    }
    if (caster.groupName === `NPC` && target.groupName === `PC`) {
        return true
    }
    return false;
};
function isBuffingEnemies(caster, target) {
    if (caster.groupName === `PC` && target.groupName === `NPC`) {
        console.log(`Don't buff the enemy!`);
        return true
    }
    if (caster.groupName === `NPC` && target.groupName === `PC`) {
        return true
    }
    return false;
};
function isHealingDeadTarget(target, abilityName) {
    if (target.hp < 1) {
        console.log(`${abilityName} is not powerful enough to ressurect ${target.name}.`)
        return true
    }
};
function forceHPtoZero(char) {
    if (char.hp < 0) {
        char.hp = 0;
    }
};
function isTargetInRangeOfCaster(caster, target, abilityRange) {
    let casterRowConverted;
    let targetRowConverted;
    if (caster.groupName !== target.groupName) {
        if(caster.groupName === `PC`) {
            switch (caster.row) {
                case 3:
                    casterRowConverted = 6;
                break;
                case 2:
                    casterRowConverted = 5;
                break;
                case 1:
                    casterRowConverted = 4;
                break;
            }
            switch (target.row) {
                case 3:
                    targetRowConverted = 1;
                break;
                case 2:
                    targetRowConverted = 2;
                break;
                case 1:
                    targetRowConverted = 3;
                break;
            }
            if(Math.abs(casterRowConverted - targetRowConverted) <= abilityRange) {
                return true;
            } else {
                return false;
            }
        }
        if(caster.groupName === `NPC`) {
            switch (caster.row) {
                case 3:
                    casterRowConverted = 1;
                break;
                case 2:
                    casterRowConverted = 2;
                break;
                case 1:
                    casterRowConverted = 3;
                break;
            }
            switch (target.row) {
                case 3:
                    targetRowConverted = 6;
                break;
                case 2:
                    targetRowConverted = 5;
                break;
                case 1:
                    targetRowConverted = 4;
                break;
            }
            if(Math.abs(casterRowConverted - targetRowConverted) <= abilityRange) {
                return true;
            } else {
                return false;
            }
        }
    } else {
        if(caster.groupName === `PC`) {
            switch (caster.row) {
                case 3:
                    casterRowConverted = 6;
                break;
                case 2:
                    casterRowConverted = 5;
                break;
                case 1:
                    casterRowConverted = 4;
                break;
            }
            switch (target.row) {
                case 3:
                    targetRowConverted = 6;
                break;
                case 2:
                    targetRowConverted = 5;
                break;
                case 1:
                    targetRowConverted = 4;
                break;
            }
            if((Math.abs(casterRowConverted - targetRowConverted) <= abilityRange)) {
                return true;
            } else {
                return false;
            }
        }
        if(caster.groupName === `NPC`) {
            switch (caster.row) {
                case 3:
                    casterRowConverted = 1;
                break;
                case 2:
                    casterRowConverted = 2;
                break;
                case 1:
                    casterRowConverted = 3;
                break;
            }
            switch (target.row) {
                case 3:
                    targetRowConverted = 1;
                break;
                case 2:
                    targetRowConverted = 2;
                break;
                case 1:
                    targetRowConverted = 3;
                break;
            }
            if((Math.abs(casterRowConverted - targetRowConverted) <= abilityRange)) {
                return true;
            } else {
                return false;
            }
        }
    }
    
};

/* #endregion END LOGIC*/

/* #endregion Ability Effects & Logic*/

/* #region All Lists */

const allAbilities = [];
function defineAllAbilities() {
    allAbilities[0] = {
        name: `Attack`,
        effect: function (caster, target) {
            if (!isAttackingAllies(caster, target)) {
                if (!isTargetDead(target)) {
                    if (turn.AP >= this.APCost) {
                        const mods = {
                            abilityIndex: 0,
                            abilityRange: caster.equipment.mainHand.range,
                            attackRollDice: 100,
                            attackBonus: caster.stats.dexterity,
                            damageRollDice: {
                                mainHandWeapon: caster.equipment.mainHand.damage,
                                offHandWeapon: caster.equipment.offHand.damage,
                                ability: null,
                            },
                            damageBonus: [0, caster.stats.strength],
                            critThreshold: 100,
                            critMultiplier: 2,
                            defendRollDice: 20,
                            targetParry: Math.floor((target.stats.initiative / 2) + (target.stats.dexterity / 4) + target.parry),
                            targetDodge: Math.floor((target.stats.initiative / 2) + (target.stats.agility / 4) + target.dodge),
                            targetDisrupt: Math.floor((target.stats.initiative / 2) + (target.stats.willpower / 4) + target.disrupt),
                            targetBlock: Math.floor((target.stats.initiative / 2) + target.block),
                            getDefendBonus: function () {
                                return Math.max(this.targetParry, this.targetBlock)
                            },
                        };
                        if(isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                            effect.meleeAttack(caster, target, mods); turn.AP -= this.APCost
                        } else {
                            combatLog.targetNotInRange(target, this.name);
                        }
                    } else {
                        combatLog.noAP(this.name, this.APCost);
                    }
                }
            }
        },
        APCost: 20,
    }
    allAbilities[1] = {
        name: `Powerful Strike`,
        effect: function (caster, target) {
            if (!isAttackingAllies(caster, target)) {
                if (!isTargetDead(target)) {
                    if (turn.AP >= this.APCost) {
                        const mods = {
                            abilityIndex: 1,
                            abilityRange: 1,
                            attackRollDice: 100,
                            attackBonus: caster.stats.strength,
                            damageRollDice: {
                                mainHandWeapon: caster.equipment.mainHand.damage,
                                offHandWeapon: caster.equipment.offHand.damage,
                                ability: null,
                            },
                            damageBonus: Math.floor(caster.stats.strength * 1.5),
                            critThreshold: 100,
                            critMultiplier: 2,
                            defendRollDice: 20,
                            targetParry: Math.floor((target.stats.initiative / 2) + (target.stats.dexterity / 4) + target.parry),
                            targetDodge: Math.floor((target.stats.initiative / 2) + (target.stats.agility / 4) + target.dodge),
                            targetDisrupt: Math.floor((target.stats.initiative / 2) + (target.stats.willpower / 4) + target.disrupt),
                            targetBlock: Math.floor((target.stats.initiative / 2) + target.block),
                            getDefendBonus: function () {
                                return Math.max(this.targetParry, this.targetBlock)
                            },
                        };
                        if(isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                            effect.meleeAttack(caster, target, mods); turn.AP -= this.APCost
                        } else {
                            combatLog.targetNotInRange(target, this.name);
                        }
                    } else {
                        combatLog.noAP(this.name, this.APCost);
                    }
                }
            }
        },
        APCost: 25,
    }
    allAbilities[2] = {
        name: `Precision Strike`,
        effect: function (caster, target) {
            if (!isAttackingAllies(caster, target)) {
                if (!isTargetDead(target)) {
                    if (turn.AP >= this.APCost) {
                        const mods = {
                            abilityIndex: 1,
                            abilityRange: caster.equipment.mainHand.range,
                            attackRollDice: 100,
                            attackBonus: caster.stats.dexterity * 2,
                            damageRollDice: {
                                mainHandWeapon: caster.equipment.mainHand.damage,
                                offHandWeapon: caster.equipment.offHand.damage,
                                ability: null,
                            },
                            damageBonus: [0, Math.floor(caster.stats.dexterity * 1.5)],
                            critThreshold: 100,
                            critMultiplier: 2,
                            defendRollDice: 20,
                            targetParry: Math.floor((target.stats.initiative / 2) + (target.stats.dexterity / 4) + target.parry),
                            targetDodge: Math.floor((target.stats.initiative / 2) + (target.stats.agility / 4) + target.dodge),
                            targetDisrupt: Math.floor((target.stats.initiative / 2) + (target.stats.willpower / 4) + target.disrupt),
                            targetBlock: Math.floor((target.stats.initiative / 2) + target.block),
                            getDefendBonus: function () {
                                return Math.max(this.targetParry, this.targetBlock)
                            },
                        };
                        if(isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                            effect.meleeAttack(caster, target, mods); turn.AP -= this.APCost
                        } else {
                            combatLog.targetNotInRange(target, this.name);
                        }
                    } else {
                        combatLog.noAP(this.name, this.APCost);
                    }
                }
            }
        },
        APCost: 25,
    }
    allAbilities[3] = {
        name: `Healing Word`,
        effect: function (caster, target) {
            if (!isHealingEnemies(caster, target)) {
                if (!isHealingDeadTarget(target, this.name)) {
                    if (turn.AP >= this.APCost) {
                        const mods = {
                            abilityIndex: 1,
                            abilityRange: 1,
                            attackRollDice: 100,
                            attackBonus: caster.stats.dexterity * 2,
                            damageRollDice: {
                                mainHandWeapon: caster.equipment.mainHand.damage,
                                offHandWeapon: caster.equipment.offHand.damage,
                                ability: null,
                            },
                            damageBonus: Math.floor(caster.stats.dexterity * 1.5),
                            critThreshold: 100,
                            critMultiplier: 2,
                            defendRollDice: 20,
                            targetParry: Math.floor((target.stats.initiative / 2) + (target.stats.dexterity / 4) + target.parry),
                            targetDodge: Math.floor((target.stats.initiative / 2) + (target.stats.agility / 4) + target.dodge),
                            targetDisrupt: Math.floor((target.stats.initiative / 2) + (target.stats.willpower / 4) + target.disrupt),
                            targetBlock: Math.floor((target.stats.initiative / 2) + target.block),
                            getDefendBonus: function () {
                                return Math.max(this.targetParry, this.targetBlock)
                            },
                        };
                        if(isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                            effect.heal(caster, target); turn.AP -= this.APCost
                        } else {
                            combatLog.targetNotInRange(target, this.name);
                        }
                    } else {
                        combatLog.noAP(this.name, this.APCost);
                    }
                }
            }
        },
        APCost: 10,
    }
    allAbilities[4] = {
        name: `Guard`,
        effect: function (caster, target) {
            if (!isBuffingEnemies(caster, target)) {
                if (!isTargetDead(target)) {
                    if (!target.buffs.guarded) {
                        if (turn.AP >= this.APCost) {
                            const mods = {
                                abilityIndex: 1,
                                abilityRange: 1,
                                buffNameForTarget: `Guarded`,
                                buffNameForCaster: `Guarding`,
                                buffDescForTarget: `Guarded by ${caster.name}`,
                                buffDescForCaster: `Guarding ${target.name}`,
                            };
                            if(isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                                effect.guard(caster, target, mods); turn.AP -= this.APCost
                            } else {
                                combatLog.targetNotInRange(target, this.name);
                            }
                        } else {
                            combatLog.noAP(this.name, this.APCost);
                        }
                    }
                }
            }
        },
        APCost: 50,
    }
    allAbilities[5] = {
        name: `Leaping Strike`,
        effect: function (caster, target) {
            if (!isAttackingAllies(caster, target)) {
                if (!isTargetDead(target)) {
                    if (turn.AP >= this.APCost) {
                        const mods = {
                            abilityIndex: 0,
                            abilityRange: 2,
                            attackRollDice: 100,
                            attackBonus: caster.stats.dexterity,
                            damageRollDice: {
                                mainHandWeapon: caster.equipment.mainHand.damage,
                                offHandWeapon: caster.equipment.offHand.damage,
                                ability: null,
                            },
                            damageBonus: [0, caster.stats.strength],
                            critThreshold: 100,
                            critMultiplier: 2,
                            defendRollDice: 20,
                            targetParry: Math.floor((target.stats.initiative / 2) + (target.stats.dexterity / 4) + target.parry),
                            targetDodge: Math.floor((target.stats.initiative / 2) + (target.stats.agility / 4) + target.dodge),
                            targetDisrupt: Math.floor((target.stats.initiative / 2) + (target.stats.willpower / 4) + target.disrupt),
                            targetBlock: Math.floor((target.stats.initiative / 2) + target.block),
                            getDefendBonus: function () {
                                return Math.max(this.targetParry, this.targetBlock)
                            },
                        };
                        if(isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                            effect.meleeAttack(caster, target, mods); turn.AP -= this.APCost
                        } else {
                            combatLog.targetNotInRange(target, this.name);
                        }
                    } else {
                        combatLog.noAP(this.name, this.APCost);
                    }
                }
            }
        },
        APCost: 20,
    }
    allAbilities[6] = {
        name: `Reflexive Focus`, // TODO: Make this ability drain 5 ap every turn that it is active, also need a way to see that it is active and a way to disable it.
        effect: function (caster, target) {
            if (!caster.buffs.reflexiveFocus) {
                if (turn.AP >= this.APCost) {
                    const mods = {
                        name: `Reflexive Focus`,
                        desc: `${caster.name} is focused on his defenses, giving advantage on defense rolls. `,
                        buffNameForBuffObj: `reflexiveFocus`,
                        defendRollAdvantage: 1,
                    };
                    effect.casterOnlyBuff(caster, mods); turn.AP -= this.APCost
                } else {
                    combatLog.noAP(this.name, this.APCost);
                }
            } else {
                // TODO: Need a combat log for the target
            }
        },
        APCost: 5,
    }
    allAbilities[7] = {
        name: `Reveal Weakness`,
        effect: function (caster, target) {
            if (!isAttackingAllies(caster, target)) {
                if (!isTargetDead(target)) {
                    if (turn.AP >= this.APCost) {
                        const mods = {
                            name: `Reveal Weakness`,
                            desc: `${caster.name} has revealed ${target.name}'s weakness, giving him disadvantage on defense, and he takes 1 extra damage from all attacks. `,
                            debuffNameForBuffObj: `revealWeakness`,
                            defendRollAdvantage: -1,
                            abilityRange: 5,
                        };
                        if(isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                            effect.debuff(caster, target, mods); turn.AP -= this.APCost
                        } else {
                            combatLog.targetNotInRange(target, this.name);
                        }
                    } else {
                        combatLog.noAP(this.name, this.APCost);
                    }
                }
            }
        },
        APCost: 75,
    }
    allAbilities[8] = {
        name: `Flesh Eating`,
        effect: function (caster, target) {
            if (!isAttackingAllies(caster, target)) {
                if (turn.AP >= this.APCost) {
                    effect.attack(caster, target); turn.AP -= this.APCost
                } else {
                    combatLog.noAP(this.name, this.APCost);
                }
            }
        },
        APCost: 25,
    }
    allAbilities[9] = {
        name: `Riposte`,
        effect: function (caster, target) {
            if (!isAttackingAllies(caster, target)) {
                if (!isTargetDead(target)) {
                    const mods = {
                        isRiposte: true,
                        abilityIndex: 9,
                        attackRollDice: 100,
                        attackBonus: caster.stats.dexterity,
                        damageRollDice: {
                            mainHandWeapon: caster.equipment.mainHand.damage,
                            offHandWeapon: caster.equipment.offHand.damage,
                            ability: null,
                        },
                        damageBonus: [0, caster.stats.strength],
                        critThreshold: 100,
                        critMultiplier: 2,
                        defendRollDice: 20,
                        targetParry: Math.floor((target.stats.initiative / 2) + (target.stats.dexterity / 4) + target.parry),
                        targetDodge: Math.floor((target.stats.initiative / 2) + (target.stats.agility / 4) + target.dodge),
                        targetDisrupt: Math.floor((target.stats.initiative / 2) + (target.stats.willpower / 4) + target.disrupt),
                        targetBlock: Math.floor((target.stats.initiative / 2) + target.block),
                        getDefendBonus: function () {
                            return Math.max(this.targetParry, this.targetBlock)
                        },
                    };
                    effect.meleeAttack(caster, target, mods); turn.AP -= this.APCost
                }
            }
        },
        APCost: 0,
    }
}
const allWeapons = []; // TODO: Weapons are the most up to date items, will need to fix this
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
const allArmors = []; // TODO: Need to fix all equipment icons. 
function defineAllArmors() {
    allArmors[0] = {
        isDefaultItem: true,
        itemType: `armor`,
        itemEquipType: [`head`],
        index: 0,
        icon: `url("./images/head.png")`,
        name: `Head`,
        // type: `melee`,
        resists: [0,0,0,0,0,0,0,0,0],
        damage: null,
        range: null,
        parry: null,
        dodge: null,
        disrupt: null,
        block: null,
    }
    allArmors[1] = {
        isDefaultItem: true,
        itemType: `armor`,
        itemEquipType: [`torso`],
        index: 1,
        icon: `url("./images/torso.png")`,
        name: `Torso`,
        // type: `melee`,
        resists: [0,0,0,0,0,0,0,0,0],
        damage: null,
        range: null,
        parry: null,
        dodge: null,
        disrupt: null,
        block: null,
    }
    allArmors[2] = {
        isDefaultItem: true,
        itemType: `armor`,
        itemEquipType: [`arms`],
        index: 2,
        icon: `url("./images/arms.png")`,
        name: `Arms`,
        // type: `melee`,
        resists: [0,0,0,0,0,0,0,0,0],
        damage: null,
        range: null,
        parry: null,
        dodge: null,
        disrupt: null,
        block: null,
    }
    allArmors[3] = {
        isDefaultItem: true,
        itemType: `armor`,
        itemEquipType: [`legs`],
        index: 3,
        icon: `url("./images/legs.png")`,
        name: `Legs`,
        // type: `melee`,
        resists: [0,0,0,0,0,0,0,0,0],
        damage: null,
        range: null,
        parry: null,
        dodge: null,
        disrupt: null,
        block: null,
    }
    allArmors[4] = {
        isDefaultItem: true,
        itemType: `armor`,
        itemEquipType: [`amulet1`],
        index: 4,
        icon: `url("./images/amulet.png")`,
        name: `Amulet 1`,
        // type: `melee`,
        resists: [0,0,0,0,0,0,0,0,0],
        damage: null,
        range: null,
        parry: null,
        dodge: null,
        disrupt: null,
        block: null,
    }
    allArmors[5] = {
        isDefaultItem: true,
        itemType: `armor`,
        itemEquipType: [`amulet2`],
        index: 5,
        icon: `url("./images/amulet.png")`,
        name: `Amulet 2`,
        // type: `melee`,
        resists: [0,0,0,0,0,0,0,0,0],
        damage: null,
        range: null,
        parry: null,
        dodge: null,
        disrupt: null,
        block: null,
    }
    allArmors[6] = {
        isDefaultItem: true,
        itemType: `armor`,
        itemEquipType: [`quickAccess1`],
        index: 6,
        icon: `url("./images/quickAccess.png")`,
        name: `Quick Access 1`,
        // type: `melee`,
        resists: [0,0,0,0,0,0,0,0,0],
        damage: null,
        range: null,
        parry: null,
        dodge: null,
        disrupt: null,
        block: null,
    }
    allArmors[7] = {
        isDefaultItem: true,
        itemType: `armor`,
        itemEquipType: [`quickAccess2`],
        index: 7,
        icon: `url("./images/quickAccess.png")`,
        name: `Quick Access 2`,
        // type: `melee`,
        resists: [0,0,0,0,0,0,0,0,0],
        damage: null,
        range: null,
        parry: null,
        dodge: null,
        disrupt: null,
        block: null,
    }
    allArmors[8] = {
        isDefaultItem: false,
        itemType: `armor`,
        itemEquipType: [`torso`],
        index: 8,
        icon: `url("./images/oldShirt.png")`,
        name: `Old Shirt`,
        // type: `melee`,
        resists: [1,0,0,0,0,0,0,0,0],
        damage: null,
        range: null,
        parry: null,
        dodge: null,
        disrupt: null,
        block: null,
    }
    allArmors[9] = {
        isDefaultItem: false,
        itemType: `armor`,
        itemEquipType: [`legs`],
        index: 9,
        icon: `url("./images/trustyBelt.png")`,
        name: `Trusty Belt`,
        // type: `melee`,
        resists: [0,0,1,1,0,0,0,0,0],
        damage: null,
        range: null,
        parry: null,
        dodge: 2,
        disrupt: null,
        block: null,
    }
}
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
        resistsArray: [0,0,-5,-5,-5,-5,-5,-5,-5],   
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
        resistsArray: [0,0,-5,-5,-5,-5,-5,-5,-5],   
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
        resistsArray: [0,0,-3,-3,-3,-3,-3,-3,-3],   

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
        resistsArray: [5,5,0,0,0,0,-5,0,-5],   
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
const allBackgrounds = [];
function defineAllBackgrounds() {
    allBackgrounds[0] = {
        name: `Peasant`,
        parry: 0,
        dodge: 0,
        disrupt: 0,
        block: 0,
    }
    allBackgrounds[1] = {
        name: `Mercenary`,
        parry: 1,
        dodge: 0,
        disrupt: 0,
        block: 0,
    }
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
    this.abilities = [0];
    this.stats = race.stats;
    this.resistsArray = race.resistsArray; 
    this.buffs = {};
    this.debuffs = {};
    this.row = 1;
    this.equipment = {
        mainHand: allWeapons[0],
        offHand: allWeapons[1],
        head: allArmors[0],
        torso: allArmors[1],
        arms: allArmors[2],
        legs: allArmors[3],
        amulet1: allArmors[4],
        amulet2: allArmors[5],
        quickAccess1: allArmors[6],
        quickAccess2: allArmors[7],
    };
    this.inventory = [allItems[0], allItems[0], allItems[0], allItems[0], allItems[0], allItems[0], allItems[0], allItems[0], allItems[0], allItems[0], allItems[0], allItems[0], allItems[0], allItems[0], allItems[0], allItems[0]];
    this.addEquipment = function (slotName, equipment) {
        this.equipment[slotName] = equipment;
        this.parry = sumOfArray([this.equipment.mainHand.parry, this.equipment.offHand.parry, this.equipment.armor.parry]);
        this.dodge = sumOfArray([this.equipment.mainHand.dodge, this.equipment.offHand.dodge, this.equipment.armor.dodge]);
        this.disrupt = sumOfArray([this.equipment.mainHand.disrupt, this.equipment.offHand.disrupt, this.equipment.armor.disrupt]);
        this.block = sumOfArray([this.equipment.mainHand.block, this.equipment.offHand.block, this.equipment.armor.block]);
    };
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
    };
    this.useAbility = function (abilityIndex, target) {
        if (this.hp > 0) {
            if (this.abilities.includes(+abilityIndex) || +abilityIndex === 9) {
                allAbilities[abilityIndex].effect(this, target);
            } else {
                console.log(`Err: Char does not have this ability`);
            }
        } else {
            combatLog.charIsDead(this, allAbilities[abilityIndex]);
        }
    };
    this.getTalentNames = function () {
        return this.talent1Name + this.talent2Name;
    };
    this.initCharReferenceForChildObjects = function (childObject) {
        this[childObject].char = this;
        delete this.initCharReferenceForChildObjects;
        return this;
    };
    /*     
        this.inventory = {
            hands: [null,null,null,null],
            backpack: false,
            saddlebag: false,
            properties: false,
        };
    */

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
    function addEquipment() {
        const targetChar = unassignedGroup.charList[unassignedGroup.charList.length - 1];
        targetChar.addEquipment(`armor`, allArmors[0]);
    }
    function assignGroup(group) {
        const targetChar = unassignedGroup.charList[unassignedGroup.charList.length - 1];
        targetChar.groupName = group.name;
        group.charList.push(targetChar);
        unassignedGroup.charList.pop();
    }
    createChar(name, race);
    addTalents(talent1, talent2);
    addEquipment();
    assignGroup(group);
};

/* #endregion Char Creation*/

/* #region  DOM */

const DOM = {
    body: document.querySelector(`body`),
    inventoryTab: document.querySelector(`.inventory`),
    utilDivisionTabs: document.querySelector(`.utilDivisionTabs`),
    moveRowButtons: document.querySelector(`.moveRowButtons`),
    utilDivisionDisplay: document.querySelector(`.utilDivisionDisplay`),
    endTurnButton: document.querySelector(`.endTurnButton`),
    APCount: document.querySelector(`.APCount`),
    casterSelectionDisplay: document.querySelector(`.casterSelectionDisplay`),
    targetSelectionDisplay: document.querySelector(`.targetSelectionDisplay`),
    PCBar: document.querySelector(`.PCBar`),
    PCBarRow1: document.querySelector(`.PCBarRow1`),
    PCBarRow2: document.querySelector(`.PCBarRow2`),
    PCBarRow3: document.querySelector(`.PCBarRow3`),
    NPCBarRow1: document.querySelector(`.NPCBarRow1`),
    NPCBarRow2: document.querySelector(`.NPCBarRow2`),
    NPCBarRow3: document.querySelector(`.NPCBarRow3`),
    NPCBar: document.querySelector(`.NPCBar`),
    abilityListContainer: document.querySelector(`.abilityListContainer`),
    botBar: document.querySelector(`.botBar`),
    midBar: document.querySelector(`.midBar`),
    casterSelection: null,
    targetSelection: null,
    casterSelectionState: null,
    targetSelectionState: null,
    selectedUtilDivisionTab: null,
    selectedUtilDivisionTabState: `inventory`,
    dragTarget: null,
    timeout: null,

    listenForEndTurnButton: function () {
        this.endTurnButton.addEventListener(`click`, (e) => {
            turn.end();
        })
    },
    listenForMoveRowButtons: function () {
        this.moveRowButtons.addEventListener(`click`, (e) => {
            if(e.target.className === `up` && this.casterSelectionState !== null) {
                if(this.casterSelectionState.row > 1) {
                    this.casterSelectionState.row -= 1;
                }
            }
            if(e.target.className === `down` && this.casterSelectionState !== null) {
                if(this.casterSelectionState.row < 3) {
                    this.casterSelectionState.row += 1;
                }
            }
            this.update();
        })
    },
    clearTooltips: function () {
        clearTimeout(this.timeout);
        let tooltips = document.getElementsByClassName(`tooltip`);
        while(tooltips.length > 0) {
        tooltips[0].parentNode.removeChild(tooltips[0]);
        }
        return;
    },
    listenForMouseOver: function () { // * Listens for mouseover on the whole page body.
        this.body.addEventListener(`mouseover`, (e) => { // TODO: Need to fix tooltip to not disappear when clicking on it, maybe.. look at ROR.
            // console.log(e.target.className)
            if( (e.target.classList.contains(`inventoryItem`) || e.target.classList.contains(`equipmentItem`)) && !(e.target.dataset.itemType === `item` && e.target.dataset.itemIndex === `0`) ) {
                this.clearTooltips();
                this.timeout = setTimeout( function() {DOM.displayItemTooltip(e.target)} , 600);
            } else if (e.target.className !== `tooltip` && e.target.className !== `tooltipContent` ) {
                this.clearTooltips();
            }
        });
    },
    displayItemTooltip: function (target) {
        let tooltips = document.getElementsByClassName(`tooltip`);
        if(tooltips.length > 0) {
            return;
        }
        const x = document.createElement(`div`);
        let item;
        let damageDiceDisplay;
        let resistsDisplay;
        if(target.dataset) {
            switch(target.dataset.itemType) {
                case `weapon`:
                    item = allWeapons[target.dataset.itemIndex];
                    damageDiceDisplay = formatDamageDiceToText(item.damage); 
                    x.className = `tooltip`;
                    x.innerHTML = `
                                <div class="tooltipContent">${item.name}:</div>
                                <div class="tooltipContent">-</div>
                                <div class="tooltipContent">Damage: ${damageDiceDisplay}</div>`;
                break;
                case `armor`:
                    item = allArmors[target.dataset.itemIndex];
                    resistsDisplay = formatResistArrayToText(item.resists); 
                    if(!resistsDisplay) {
                        resistsDisplay = `None`;
                    }
                    x.className = `tooltip`;
                    x.innerHTML = `
                                <div class="tooltipContent">${item.name}:</div>
                                <div class="tooltipContent">-</div>
                                <div class="tooltipContent">Resists:<br>${resistsDisplay}</div>`;
                break;
            }
        }

        target.append(x);
        this.timeout = null;
    },
    attemptAbilityCast: function (target) {
        const abilityNameSubDiv = target.querySelector(`.abilityName`);
        const abilityDatasetIndex = abilityNameSubDiv.dataset.abilityIndex;
        if ((this.casterSelectionState && this.targetSelectionState) !== null) {
            this.casterSelectionState.useAbility(abilityDatasetIndex, this.targetSelectionState)
        } else {
            console.log(`invalid targets`);
        }
        this.update();
        this.updateTopBar();
    },
    listenForBotBar: function () {
        this.botBar.addEventListener(`click`, (e) => {
            switch (e.target.className) {
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
        if (this.casterSelectionState) {
            this.casterSelectionDisplay.textContent = `Caster: ${this.casterSelectionState.name}`;
        } else {
            this.casterSelectionDisplay.textContent = `Caster: None Selected`;
        }

        if (this.targetSelectionState) {
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
    selectCaster: function (target) {
        if (this.casterSelection !== null && target !== this.casterSelection) {
            this.deselectCaster();
        }
        const targetGroupIndex = target.dataset.groupIndex;
        this.casterSelectionState = PCs.charList[targetGroupIndex];
        this.casterSelection = target;
        if (this.casterSelectionState.hp === 0) {
            this.casterSelection.style.borderColor = `rgb(75,75,150)`;
        } else {
            this.casterSelection.style.borderColor = `blue`;
        }
        this.updateBotBar();
        this.updateUtilDivisionDisplay();
    },
    deselectCaster: function () {
        if (this.casterSelection) {
            if (this.casterSelection === this.targetSelection) {
                this.targetSelection.style.borderColor = `yellow`;
                this.casterSelection = null;
                this.casterSelectionState = null;
            } else {
                if (this.casterSelectionState.hp === 0) {
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
        this.updateUtilDivisionDisplay();
    },
    listenForCasterSelection: function () {
        this.PCBar.addEventListener(`click`, (e) => {
            if (e.target.className === `PC`) {
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
            if (e.target.className === `PC` || e.target.className === `NPC`) {
                this.selectTarget(e.target);
            } else {
                this.deselectTarget();
            }
            this.updateTopBar();
        })
    },
    selectTarget: function (target) {
        if (this.targetSelection !== null && target !== this.targetSelection) {
            this.deselectTarget();
        }
        this.targetSelection = target;
        let targetGroup = target.className;
        const targetGroupIndex = target.dataset.groupIndex;
        if (targetGroup === `NPC`) {
            this.targetSelectionState = NPCs.charList[targetGroupIndex];
            target.style.borderColor = `red`;
        };
        if (targetGroup === `PC`) {
            this.targetSelectionState = PCs.charList[targetGroupIndex];
            target.style.borderColor = `yellow`;
        }
    },
    deselectTarget: function () {
        if (this.targetSelection) {
            if (this.targetSelection === this.casterSelection) {
                if (this.targetSelectionState.hp === 0) {
                    this.targetSelection.style.borderColor = `rgb(75,75,150)`;
                } else {
                    this.targetSelection.style.borderColor = `blue`;
                }
                this.targetSelection = null;
                this.targetSelectionState = null;
            } else {
                if (this.targetSelectionState.hp === 0) {
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
        this.NPCBarRow3.innerHTML = ``;
        this.NPCBarRow2.innerHTML = ``;
        this.NPCBarRow1.innerHTML = ``;
        this.PCBarRow1.innerHTML = ``;
        this.PCBarRow2.innerHTML = ``;
        this.PCBarRow3.innerHTML = ``;
        for (let i = (PCs.charList.length - 1); i >= 0; i--) {
            this.createChar(PCs.charList[i], i)
        };
        for (let i = (NPCs.charList.length - 1); i >= 0; i--) {
            this.createChar(NPCs.charList[i], i)
        };
    },
    createChar: function (char, charListIndex) {
        const i = document.createElement(`div`);
        i.className = `${char.groupName}`;
        i.id = `index${charListIndex}`;
        i.dataset.groupIndex = charListIndex;
        forceHPtoZero(char);
        if (char.hp === 0) {
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

        switch (char.groupName) {
            case `PC`:
                if (this.casterSelectionState === char) {
                    if (this.casterSelectionState.hp === 0) {
                        i.style.borderColor = `rgb(75,75,150)`;
                    } else {
                        i.style.borderColor = `blue`;
                    }
                    this.casterSelection = i;
                } else if (this.targetSelectionState === char) {
                    i.style.borderColor = `yellow`;
                    this.targetSelection = i;
                }
                this.appendPCCharToRow(char, i);
                break;

            case `NPC`:
                if (this.targetSelectionState === char) {
                    i.style.borderColor = `red`;
                    this.targetSelection = i;
                }
                this.appendNPCCharToRow(char, i);
                break;

            case `Unassigned`:
                console.log(`Error: Tried to put char with unassigned group onto DOM.`);
                break;

            default:
                console.log(`Error: Something weird happened here.`);
                break;
        }
    },
    listenForTabSelection: function () { // * Listens to the tab buttons at the top-right of the screen.
        this.utilDivisionTabs.addEventListener(`click`, (e) => {
            switch(e.target.className) {
                case `inventory`:
                    this.clearTabSelectionDisplay();
                    this.selectedUtilDivisionTabState = `inventory`;
                    this.selectedUtilDivisionTab = e.target;
                    this.updateUtilDivisionDisplay();
                    this.updateTabSelectionDisplay();
                break;
                case `stats`:
                    this.clearTabSelectionDisplay();
                    this.selectedUtilDivisionTabState = `stats`;
                    this.selectedUtilDivisionTab = e.target;
                    this.updateUtilDivisionDisplay();
                    this.updateTabSelectionDisplay();
                break;
                case `party`:
                    this.clearTabSelectionDisplay();
                    this.selectedUtilDivisionTabState = `party`;
                    this.selectedUtilDivisionTab = e.target;
                    this.updateUtilDivisionDisplay();
                    this.updateTabSelectionDisplay();
                break;
            }
        })
    },
    listenForDrag: function () { // * Using this to make sure things are not draggable if they aren't supposed to be, also sets DOM.dragTarget and clears tooltips.
        this.body.addEventListener(`dragstart`, (e) => {
            if(e.target.draggable === false) {
                e.preventDefault();
            }
            this.dragTarget = e.target;
            this.clearTooltips();
        });
    },
    listenForDragover: function () { // * Only for changing the symbol that indicates dropability when hovering over things.
        this.body.addEventListener(`dragover`, (e) => {
            this.clearTooltips();
            if(e.target.classList.contains(`inventoryItem`) || e.target.classList.contains(`equipmentItem`)) {
                e.preventDefault();
            }
        })
    },
    listenForDrop: function () { // * Where most of the drag & drop item swapping logic is.
        this.body.addEventListener(`drop`, (e) => {
            let dropTarget = e.target; // * dragTarget is the other variable, it represents the item being dragged.
            let dragTargetCharData;
            let dropTargetCharData;
            let tempStorage;
            let char = this.casterSelectionState;
            switch(this.dragTarget.classList[0]) { // * links dom element properties to the char data for DRAGTARGET
                case `equipmentItem` :
                    dragTargetCharData = char.equipment[this.dragTarget.dataset.equipmentSlotName];
                break;
                case `inventoryItem` :
                    dragTargetCharData = char.inventory[this.dragTarget.dataset.inventoryIndex];
                break;
            }
            switch(dropTarget.classList[0]) { // * links dom element properties to the char data for DROPTARGET
                case `equipmentItem` :
                    dropTargetCharData = char.equipment[dropTarget.dataset.equipmentSlotName];
                break;
                case `inventoryItem` :
                    dropTargetCharData = char.inventory[dropTarget.dataset.inventoryIndex];
                break;
            }
            if (dropTarget.classList.contains(`equipmentItem`) && !dragTargetCharData.itemEquipType.includes(dropTargetCharData.itemEquipType[0])) { // * Disallows items with non-matching equip types to be swapped.
                console.log(`! Cannot place an item with equip type: ${dragTargetCharData.itemEquipType} into an equipment slot with item type: ${dropTargetCharData.itemEquipType}.`)
                return;
            } else if (this.dragTarget.classList[0] === `equipmentItem` && dropTarget.classList[0] === `inventoryItem` && !dropTargetCharData.isDefaultItem) {
                console.log(`! Cannot place an item with equip type: ${dragTargetCharData.itemEquipType} into an equipment slot with item type: ${dropTargetCharData.itemEquipType}.`)
                return;
            }

            tempStorage = dragTargetCharData;

            switch(this.dragTarget.classList[0]) {
                case `inventoryItem` : // ***** If drag is from inventory
                    switch(dropTarget.classList[0]) {
                        case `inventoryItem`: // *** If drop is to inventory
                            if(dropTargetCharData.isDefaultItem) { // ! If drop is empty
                                char.inventory[this.dragTarget.dataset.inventoryIndex] = allItems[0];
                                char.inventory[dropTarget.dataset.inventoryIndex] = tempStorage;
                                // do the swap
                            } else { // ! If drop contains item
                                char.inventory[this.dragTarget.dataset.inventoryIndex] = dropTargetCharData;
                                char.inventory[dropTarget.dataset.inventoryIndex] = tempStorage;
                                // do the swap
                            }

                        break;
                        case `equipmentItem`: // *** If drop is to equipment
                            if(dropTargetCharData.isDefaultItem) { // ! If drop is empty
                                char.inventory[this.dragTarget.dataset.inventoryIndex] = allItems[0];
                                char.equipment[dropTarget.dataset.equipmentSlotName] = tempStorage;
                                updateCharStats(char, `add`, dragTargetCharData);
                                // do the swap and add stats
                            } else { // ! If drop contains item
                                char.inventory[this.dragTarget.dataset.inventoryIndex] = dropTargetCharData;
                                char.equipment[dropTarget.dataset.equipmentSlotName] = tempStorage;
                                updateCharStats(char, `add`, dragTargetCharData);
                                updateCharStats(char, `remove`, dropTargetCharData);
                                // do the swap and add drag stats, subtract drop stats
                            }

                        break;
                    }
                break;
                case `equipmentItem` : // ***** If drag is from equipment
                    switch(dropTarget.classList[0]) {
                        case `inventoryItem`: // *** If drop is to inventory

                            if(dropTargetCharData.isDefaultItem) { // ! If drop is empty
                                putDefaultItemInPlaceOfDrag(char, dragTargetCharData, this.dragTarget)
                                char.inventory[dropTarget.dataset.inventoryIndex] = tempStorage;
                                updateCharStats(char, `remove`, dragTargetCharData);
                                // do the swap and remove drag stats
                            } else { // ! If drop contains item
                                char.equipment[this.dragTarget.dataset.equipmentSlotName] = dropTargetCharData;
                                char.inventory[dropTarget.dataset.inventoryIndex] = tempStorage;
                                updateCharStats(char, `remove`, dragTargetCharData);
                                updateCharStats(char, `add`, dropTargetCharData);
                                // do the swap and remove drag stats, add drop stats
                            }

                        break; 
                        case `equipmentItem`: // *** If drop is to equipment

                            if(dropTargetCharData.isDefaultItem) { // ! If drop is empty
                                putDefaultItemInPlaceOfDrag(char, dragTargetCharData, this.dragTarget)
                                char.equipment[this.dragTarget.dataset.equipmentSlotName] = tempStorage;
                                // do the swap
                            } else { // ! If drop contains item
                                char.equipment[this.dragTarget.dataset.equipmentSlotName] = dropTargetCharData;
                                char.inventory[dropTarget.dataset.inventoryIndex] = tempStorage;
                                // do the swap
                            }

                        break;
                    }
                break;
            }
            this.updateUtilDivisionDisplay();
            this.dragTarget = null;
        }) 
    },
    listenForRightClickEquip: function () { // * Where the right click swapping logic is.
        this.utilDivisionDisplay.addEventListener(`contextmenu`, (e) => {
            e.preventDefault();
            if ( ( e.target.classList.contains(`inventoryItem`) || e.target.classList.contains(`equipmentItem`) )  &&  e.target.draggable === true) {
                let dragTarget = e.target; // * dragTarget is the other variable, it represents the item being dragged.
                let dragTargetCharData;
                let dropTargetCharData;
                let tempStorage;
                let char = this.casterSelectionState;
                switch(dragTarget.classList[0]) { // * links dom element properties to the char data for DRAGTARGET
                    case `equipmentItem` :
                        dragTargetCharData = char.equipment[dragTarget.dataset.equipmentSlotName];
                        dropTargetCharData = char.inventory[getFirstEmptyInventorySlot(char)];
                    break;
                    case `inventoryItem` :
                        dragTargetCharData = char.inventory[dragTarget.dataset.inventoryIndex];
                        dropTargetCharData = char.equipment[dragTargetCharData.itemEquipType[0]];
                    break;
                }
                
                tempStorage = dragTargetCharData;

                switch(dragTarget.classList[0]) {
                    case `inventoryItem` : // ***** If drag is from inventory
                        if(dropTargetCharData.isDefaultItem) { // ! If drop is empty
                            char.inventory[dragTarget.dataset.inventoryIndex] = allItems[0];
                            char.equipment[dragTargetCharData.itemEquipType[0]] = tempStorage;
                            updateCharStats(char, `add`, dragTargetCharData);
                            // do the swap and add stats
                        } else { // ! If drop contains item
                            char.inventory[dragTarget.dataset.inventoryIndex] = dropTargetCharData;
                            char.equipment[dragTargetCharData.itemEquipType[0]] = tempStorage;
                            updateCharStats(char, `add`, dragTargetCharData);
                            updateCharStats(char, `remove`, dropTargetCharData);
                            // do the swap and add drag stats, subtract drop stats
                        }
                    break;
                    case `equipmentItem` : // ***** If drag is from equipment
                        putDefaultItemInPlaceOfDrag(char, dragTargetCharData, dragTarget)
                        console.log(getFirstEmptyInventorySlot(char))
                        char.inventory[getFirstEmptyInventorySlot(char)] = dragTargetCharData;
                        updateCharStats(char, `remove`, dragTargetCharData);
                        // do the swap and remove drag stats
                    break;
                }
            }
            this.updateUtilDivisionDisplay();
        })
    },
    updateUtilDivisionDisplay: function () { // * is called when you select a different char or tab.
        switch(this.selectedUtilDivisionTabState) {
            case `inventory`:
                this.utilDivisionDisplay.innerHTML = `Equipment:`;
                if (this.casterSelectionState) {
                    this.createUtilDivisionDisplay(this.casterSelectionState);
                }
            break;
            case `stats`:
                this.utilDivisionDisplay.innerHTML = `Stats:`;
                if (this.casterSelectionState) {
                    this.createUtilDivisionDisplay(this.casterSelectionState);
                }
            break;
            case `party`:
                this.utilDivisionDisplay.innerHTML = `Party:`;
                if (this.casterSelectionState) {
                    this.createUtilDivisionDisplay(this.casterSelectionState);
                }
            break;
        }
    },
    generateInventory: function (inventoryContainer, char) { 
        for (let i = 0; i < char.inventory.length; i++) {
            const x = document.createElement(`div`);
            if(char.inventory[i]) {
                x.className = `inventoryItem`;
                x.dataset.itemType = char.inventory[i].itemType;
                x.dataset.itemIndex = char.inventory[i].index;
                x.dataset.inventoryIndex = i;
                x.style.backgroundImage = char.inventory[i].icon;
                x.style.backgroundRepeat = `no-repeat`;
                x.style.backgroundSize = `100%`;
                if(!char.inventory[i].isDefaultItem) {
                    x.draggable = true;
                } else {
                    x.draggable = false;
                }
            }
            inventoryContainer.append(x);
        }
    },
    createEquipmentSlot: function (ele, char, slotName) {
        ele.className = `equipmentItem ${slotName}`;
        const item = char.equipment[slotName];
        ele.dataset.itemType = item.itemType;
        ele.dataset.itemIndex = item.index;
        ele.dataset.equipmentSlotName = slotName;
        ele.style.backgroundImage = char.equipment[slotName].icon;
        ele.style.backgroundRepeat = `no-repeat`;
        ele.style.backgroundSize = `100%`;
        if(!item.isDefaultItem) {
            ele.draggable = true;
        } else {
            ele.draggable = false;
        }
    },
    createUtilDivisionDisplay: function (char) {
        switch(this.selectedUtilDivisionTabState) {
            case `inventory`:
                const equipDisplay = document.createElement(`div`);
                equipDisplay.className = `equipDisplay`;
                // * Main Container
                this.utilDivisionDisplay.append(equipDisplay);

                // * Subcontainers
                const equipLeft = document.createElement(`div`);
                equipLeft.className = `equipLeft`;
                const equipCenter = document.createElement(`div`);
                equipCenter.className = `equipCenter`;
                const equipRight = document.createElement(`div`);
                equipRight.className = `equipRight`;
                equipDisplay.append(equipLeft, equipCenter, equipRight);

                // * Main Armor Slots on the left
                const headSlot = document.createElement(`div`);
                    this.createEquipmentSlot(headSlot, char, `head`);
                const torsoSlot = document.createElement(`div`);
                    this.createEquipmentSlot(torsoSlot, char, `torso`);
                const armsSlot = document.createElement(`div`);
                    this.createEquipmentSlot(armsSlot, char, `arms`);
                const legsSlot = document.createElement(`div`);
                    this.createEquipmentSlot(legsSlot, char, `legs`);
                equipLeft.append(headSlot, torsoSlot, armsSlot, legsSlot);

                // * Middle Subcontainers
                const statsDisplay = document.createElement(`div`);
                statsDisplay.className = `statsDisplay`;
                const weaponsDisplay = document.createElement(`div`);
                weaponsDisplay.className = `weaponsDisplay`;

                    const mainHandWeaponSlot = document.createElement(`div`);
                        this.createEquipmentSlot(mainHandWeaponSlot, char, `mainHand`);
                    const offHandWeaponSlot = document.createElement(`div`);
                        this.createEquipmentSlot(offHandWeaponSlot, char, `offHand`);
                    weaponsDisplay.append(mainHandWeaponSlot, offHandWeaponSlot);

                equipCenter.append(statsDisplay, weaponsDisplay);

                // * Amulet & Quick Access Slots on the right.
                const amulet1Slot = document.createElement(`div`);
                    this.createEquipmentSlot(amulet1Slot, char, `amulet1`);
                const amulet2Slot = document.createElement(`div`);
                    this.createEquipmentSlot(amulet2Slot, char, `amulet2`);
                const quickAccess1Slot = document.createElement(`div`);
                    this.createEquipmentSlot(quickAccess1Slot, char, `quickAccess1`);
                const quickAccess2Slot = document.createElement(`div`);
                    this.createEquipmentSlot(quickAccess2Slot, char, `quickAccess2`);
                equipRight.append(amulet1Slot, amulet2Slot, quickAccess1Slot, quickAccess2Slot);


                // const x = document.createElement(`div`);
                // const z = document.createElement(`div`);
                // const arrayOfAllKeysInEquipment = Object.keys(char.equipment);
                // const itemKeyName = arrayOfAllKeysInEquipment[i];
                // const item = char.equipment[itemKeyName];
                // x.innerHTML = `<div>-</div>
                //             <div class="slotName">${itemKeyName}:</div>`;
                // x.className = `equipmentContainer`;

                // z.className = `equipmentItem`;
                // z.dataset.itemType = char.equipment[itemKeyName].itemType;
                // z.dataset.itemIndex = char.equipment[itemKeyName].index;
                // z.dataset.equipmentSlotName = itemKeyName;
                // z.style.backgroundImage = char.equipment[itemKeyName].icon;
                // z.style.backgroundRepeat = `no-repeat`;
                // z.style.backgroundSize = `100%`;
                // if(!item.isDefaultItem) {
                //     z.draggable = true;
                // } else {
                //     z.draggable = false;
                // }
                // this.utilDivisionDisplay.append(x);
                // x.append(z);
            
                const inventoryContainer = document.createElement(`div`);
                inventoryContainer.className = `inventoryContainer`;
                this.utilDivisionDisplay.appendChild(inventoryContainer);
                this.generateInventory(inventoryContainer, char); // ! Here I will eventually want to replace the first param with something like -   char.invSpace   -.
            break;
            case `stats`:
                for (let i = 0; i < (Object.keys(this.casterSelectionState.stats).length); i++) {
                    const x = document.createElement(`div`);
                    const arrayOfAllKeysInStats = Object.keys(char.stats);
                    const statKeyName = arrayOfAllKeysInStats[i];
                    const stat = char.stats[statKeyName];
                    x.innerHTML = `<div>-</div>
                                <div class="statName">${statKeyName}:</div>
                                <div>${stat}</div>`
                    this.utilDivisionDisplay.append(x);
                }
            break;
            case `party`:
                for (let i = 0; i < (Object.keys(this.casterSelectionState.stats).length); i++) {
                    const x = document.createElement(`div`);
                    const arrayOfAllKeysInStats1 = Object.keys(char.stats);
                    const statKeyName1 = arrayOfAllKeysInStats1[i];
                    const stat1 = char.stats[statKeyName1];
                    x.innerHTML = `<div>-</div>
                                <div class="statName">${statKeyName1}:</div>
                                <div>${stat1}</div>`
                    this.utilDivisionDisplay.append(x);
                }
            break;
        }
    },
    updateTabSelectionDisplay: function () {
        switch(this.selectedUtilDivisionTabState) {
            case `inventory`:
                this.selectedUtilDivisionTab.style.borderColor = `rgb(100,100,200)`;  
            break;
            case `stats`:
                this.selectedUtilDivisionTab.style.borderColor = `rgb(100,100,200)`;  
            break;
            case `party`:
                this.selectedUtilDivisionTab.style.borderColor = `rgb(100,100,200)`;  
            break;
            default:
                this.selectedUtilDivisionTab.style.borderColor = `rgb(255,255,255)`;  
        }
    },
    clearTabSelectionDisplay: function () {
        switch(this.selectedUtilDivisionTabState) {
            case `inventory`:
                this.selectedUtilDivisionTab.style.borderColor = `rgb(255,255,255)`;  
            break;
            case `stats`:
                this.selectedUtilDivisionTab.style.borderColor = `rgb(255,255,255)`;  
            break;
            case `party`:
                this.selectedUtilDivisionTab.style.borderColor = `rgb(255,255,255)`;  
            break;
            default:
                this.selectedUtilDivisionTab.style.borderColor = `rgb(255,255,255)`;  
        }
    },
    appendPCCharToRow: function (char, i) {
        switch (char.row) {
            case 1: 
                this.PCBarRow1.append(i);
            break;
            case 2: 
                this.PCBarRow2.append(i);
            break;
            case 3: 
                this.PCBarRow3.append(i);
            break;
        }
    },
    appendNPCCharToRow: function (char, i) {
        switch (char.row) {
            case 1: 
                this.NPCBarRow1.append(i);
            break;
            case 2: 
                this.NPCBarRow2.append(i);
            break;
            case 3: 
                this.NPCBarRow3.append(i);
            break;
        }
    },
};

/* #endregion DOM*/

defineAllAbilities();
defineAllWeapons();
defineAllRaces();
defineAllTalents();
defineAllArmors();
defineAllFeats();
defineAllBackgrounds();
defineAllItems();

characterCreator(`Stroick`, allRaces[0], allTalents[3], allTalents[5], PCs);
characterCreator(`Kliftin`, allRaces[1], allTalents[2], allTalents[6], PCs);
characterCreator(`Dahmer Hobo`, allRaces[3], allTalents[6], allTalents[7], NPCs);
characterCreator(`Evil`, allRaces[2], allTalents[4], allTalents[5], NPCs);

const stroick = PCs.charList[0];
const evil = NPCs.charList[1];
const kliftin = PCs.charList[1];
const hobo = NPCs.charList[0];

stroick.inventory[0] = allWeapons[2];
stroick.inventory[1] = allArmors[8];
stroick.inventory[2] = allArmors[9];

DOM.update();
DOM.listenForCasterSelection();
DOM.listenForBotBar();
DOM.listenForEndTurnButton();
DOM.listenForTargetSelection();
DOM.listenForMoveRowButtons();
DOM.listenForTabSelection();
DOM.listenForMouseOver();
DOM.listenForDrag();
DOM.listenForDragover();
DOM.listenForDrop();
DOM.listenForRightClickEquip();

DOM.selectedUtilDivisionTab = DOM.inventoryTab;
DOM.updateUtilDivisionDisplay();
DOM.updateTabSelectionDisplay();

console.log(stroick);