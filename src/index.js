import { forEach } from "lodash";
import "./index.css"; 
import printMe from './print.js';

"use strict";

printMe();

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
        let targetDamageSplit = Math.floor((damageDisplayArray[1] * 2) / 2);
        let guardDamageSplit = Math.ceil((damageDisplayArray[1] * 2) / 2);
        if (target.buffs.guarded) {
            console.log(`${caster.name} CRITICALLY HITS ${target.name} and rolls a ${damageDisplayArray[0]} times 2 for a total of ${damageDisplayArray[1] * 2} damage, but because ${target.name} is guarded, the damage is split between him and his guard ${target.buffs.guarded.caster.name}, ${target.name} takes ${targetDamageSplit} and ${target.buffs.guarded.caster.name} takes ${guardDamageSplit}.`);
        } else {
            console.log(`${caster.name} CRITICALLY HITS ${target.name} and rolls a ${damageDisplayArray[0]} times 2 for a total of ${damageDisplayArray[1] * 2} damage!`)
        }
    },
    attackAttempt: function (caster, target, attackRoll, defendRoll, attackBonus, defendBonus, ability) {
        const attack = attackRoll + attackBonus;
        const defend = defendRoll + defendBonus;
        console.log(`${caster.name} attacks ${target.name} with: ${caster.equipment.mainHand.name} using: ${ability.name}, 
            with an attack roll of: ${attackRoll} and attack bonus of ${attackBonus} 
            against a defend roll of ${defendRoll} and a defend bonus of ${defendBonus}. 
            Total Attack: ${attack} vs. Total Defend: ${defend}`);
    },
    damageDisplay: function (damage) {
        // TODO: To log the damage rolls organized by resist, I do a for each of the main array, and within the foreach I switch off of the number in the 0 index of the damage roll sub array, within that switch I push the index 1 of the sub array to my resistance sort array. Then I say to console log each index of the resistance sorted array IF it isnt empty. This can be a for loop with a nested if. For 9 times console log if the array aint empty.
        let resistanceSortArr = [[],[],[],[],[],[],[],[],[]];
        damage.forEach((ele) => {
            switch(ele[0]) {
                case 0:
                    resistanceSortArr[0].push(ele[1]);
                    break;
                case 1:
                    resistanceSortArr[1].push(ele[1]);
                    break;
                case 2:
                    resistanceSortArr[2].push(ele[1]);
                    break;
                case 3:
                    resistanceSortArr[3].push(ele[1]);
                    break;
                case 4:
                    resistanceSortArr[4].push(ele[1]);
                    break;
                case 5:
                    resistanceSortArr[5].push(ele[1]);
                    break;
                case 6:
                    resistanceSortArr[6].push(ele[1]);
                    break;
                case 7:
                    resistanceSortArr[7].push(ele[1]);
                    break;
                case 8:
                    resistanceSortArr[8].push(ele[1]);
                    break;
            }
        })

        // TODO: I need to make sure that the console log takes the actual amounts of damage resisted into account. I need to refer to line 144, because that is where I will do the damage total, I need to delete the damage total here.
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
        let damageDisplayArray = this.damageDisplay(damage); // * damageDisplayArray is an array
        let targetDamageSplit = Math.floor((damageDisplayArray[1]) / 2);
        let guardDamageSplit = Math.ceil((damageDisplayArray[1]) / 2);
        if (target.buffs.guarded) {
            console.log(`${caster.name} hits ${target.name} and rolls a ${damageDisplayArray[0]} for a total of ${damageDisplayArray[1]} damage, but because ${target.name} is guarded, the damage is split between him and his guard ${target.buffs.guarded.caster.name}, ${target.name} takes ${targetDamageSplit} and ${target.buffs.guarded.caster.name} will take ${guardDamageSplit} but has a chance to defend it.`);
        } else {
            console.log(`${caster.name} hits ${target.name} and rolls a ${damageDisplayArray[0]} for a total of ${damageDisplayArray[1]} damage.`);
        }

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
        console.log(`${guard.name} does not defend the incoming damage from ${caster.name} redirected to him from his guard target ${target.name}, ${guard.name} takes the damage.`)
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
    damageResist: {
        0: function (damage, resist, damageSum, caster, target) { //* Takes in the damage and resist number for this specific resistance and logs out the aftermath.
            console.log(`${caster.name} deals out ${damage} flat damage against ${target.name}'s ${resist} flat resistance. ${target.name} takes ${damageSum} flat damage.`);
        },
        1: function (damage, resist, damageSum, caster, target) { //* Takes in the damage and resist number for this specific resistance and logs out the aftermath.
            console.log(`${caster.name} deals out ${damage} piercing damage against ${target.name}'s ${resist} piercing resistance. ${target.name} takes ${damageSum} piercing damage.`);
        },
        2: function (damage, resist, damageSum, caster, target) { //* Takes in the damage and resist number for this specific resistance and logs out the aftermath.
            console.log(`${caster.name} deals out ${damage} ice damage against ${target.name}'s ${resist} ice resistance. ${target.name} takes ${damageSum} ice damage.`);
        },
        3: function (damage, resist, damageSum, caster, target) { //* Takes in the damage and resist number for this specific resistance and logs out the aftermath.
            console.log(`${caster.name} deals out ${damage} fire damage against ${target.name}'s ${resist} fire resistance. ${target.name} takes ${damageSum} fire damage.`);
        },
        4: function (damage, resist, damageSum, caster, target) { //* Takes in the damage and resist number for this specific resistance and logs out the aftermath.
            console.log(`${caster.name} deals out ${damage} corrosive damage against ${target.name}'s ${resist} corrosive resistance. ${target.name} takes ${damageSum} corrosive damage.`);
        },
        5: function (damage, resist, damageSum, caster, target) { //* Takes in the damage and resist number for this specific resistance and logs out the aftermath.
            console.log(`${caster.name} deals out ${damage} poison damage against ${target.name}'s ${resist} poison resistance. ${target.name} takes ${damageSum} poison damage.`);
        },
        6: function (damage, resist, damageSum, caster, target) { //* Takes in the damage and resist number for this specific resistance and logs out the aftermath.
            console.log(`${caster.name} deals out ${damage} spiritual damage against ${target.name}'s ${resist} spiritual resistance. ${target.name} takes ${damageSum} spiritual damage.`);
        },
        7: function (damage, resist, damageSum, caster, target) { //* Takes in the damage and resist number for this specific resistance and logs out the aftermath.
            console.log(`${caster.name} deals out ${damage} lightning damage against ${target.name}'s ${resist} lightning resistance. ${target.name} takes ${damageSum} lightning damage.`);
        },
        8: function (damage, resist, damageSum, caster, target) { //* Takes in the damage and resist number for this specific resistance and logs out the aftermath.
            console.log(`${caster.name} deals out ${damage} arcane damage against ${target.name}'s ${resist} arcane resistance. ${target.name} takes ${damageSum} arcane damage.`);
        },
    }
}

/* #endregion Combat Log*/

/* #region  Ability Effects & Logic */ 

const turn = {
    AP: 100,
    end: function () {
        combatLog.startNPCTurn();
        this.AP = 100;
        while (this.AP > 0) { // TODO: Need to fix this big time.
            // const attackingNPC = NPCs.charList[dice(NPCs.charList.length - 1)];
            // attackingNPC.useAbility( attackingNPC.abilities[dice(attackingNPC.abilities.length - 1)] ,PCs.charList[dice(PCs.charList.length - 1)]);
            const attackingNPC = NPCs.charList[diceMinus1(NPCs.charList.length)];
            attackingNPC.useAbility(0, PCs.charList[diceMinus1(PCs.charList.length)]);
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
        console.log(`Damage Bonus Log: ${mods.damageBonus}`);
        damageRollArr.push(mods.damageBonus);
        const totalDamagePerResist = sumOfDamageArray(damageRollArr);

        if (attackRoll >= mods.critThreshold) { // * ON CRIT
            combatLog.critHit(caster, target, damageRollArr);

            if (sumOfArray(damageRollArr) < 1) {
                target.hp -= 2;
            } else { // * Resistances and buff and debuff checks all go here

                if (target.buffs.guarded) {
                    totalDamage = sumOfArray(damageRollArr) * mods.critMultiplier;
                    targetDamage = Math.floor(totalDamage / 2);
                    guardDamage = Math.ceil(totalDamage / 2);
                    target.hp -= targetDamage;
                    target.buffs.guarded.caster.hp -= guardDamage
                } else {
                    target.hp -= sumOfArray(damageRollArr) * mods.critMultiplier;
                }
            }
            return;
        }
        console.log(damageRollArr)
        combatLog.hit(caster, target, damageRollArr); // * ON HIT

        if (riposte) {
            combatLog.riposte(target, caster);
            target.useAbility(9, caster);
        }

        if (target.buffs.guarded) {
            const guardDefense = getGuardDefense(`melee`, target.buffs.guarded.caster);
            targetDamage = calcTargetWithGuardDamage(totalDamagePerResist, target.resistsArray, caster, target);
            target.hp -= targetDamage;
            if (attack > guardDefense) {
                combatLog.guardFailsDefend(caster, target, target.buffs.guarded.caster);
                guardDamage = calcGuardDamage(totalDamagePerResist, target.buffs.guarded.caster.resistsArray, caster, target.buffs.guarded.caster);
                target.buffs.guarded.caster.hp -= guardDamage;
            } else {
                combatLog.guardDefend(caster, target, target.buffs.guarded.caster);
            }
        } else {
            damageSum = calcTotalDamageAfterResists(totalDamagePerResist, target.resistsArray, caster, target); // * also calls combatLog()
            target.hp -= sumOfArray(damageSum); 
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
function calcGuardDamage(damage, resists, caster, target) { // * Takes two 9 index long resist arrays, outputs the aftermath of damage divided for the guard.
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
            damageSum[i] = Math.floor(damageSum[i] / 2);
            combatLog.damageResist[i](damage[i], resists[i], damageSum[i], caster, target);
        } else if (damageSum[i] < 0){ // * if the damage is negative, then 1 damage is taken, because you cannot deal negative damage on an attack.
            damageSum[i] = Math.floor(damageSum[i] / 2);
            combatLog.damageResist[i](damage[i], resists[i], damageSum[i], caster, target);
            damageSum[i] += 1;
        } else {
            damageSum[i] = 0;
        }
    }
    return damageSum;
}

function calcTargetWithGuardDamage(damage, resists, caster, target) { // * Takes two 9 index long resist arrays, outputs the aftermath of damage divided for target with guard.
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
            damageSum[i] = Math.ceil(damageSum[i] / 2);
            combatLog.damageResist[i](damage[i], resists[i], damageSum[i], caster, target);
        } else if (damageSum[i] < 0){ // * if the damage is negative, then 1 damage is taken, because you cannot deal negative damage on an attack.
            damageSum[i] = Math.ceil(damageSum[i] / 2);
            combatLog.damageResist[i](damage[i], resists[i], damageSum[i], caster, target);
            damageSum[i] += 1;
        } else {
            damageSum[i] = 0;
        }
    }
    return damageSum;
}

function calcTotalDamageAfterResists(damage, resists, caster, target) { // * Takes two 9 index long resist arrays, outputs the aftermath of damage.
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
            combatLog.damageResist[i](damage[i], resists[i], damageSum[i], caster, target);
        } else if (damageSum[i] < 0){ // * if the damage is negative, then 1 damage is taken, because you cannot deal negative damage on an attack.
            combatLog.damageResist[i](damage[i], resists[i], damageSum[i], caster, target);
            damageSum[i] += 1;
        } else {
            damageSum[i] = 0;
        }
    }
    return damageSum;
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

function sumOfDamageArray(arrayOfNumbers) { // * Takes a 2D array of numbers and adds the index [1's] up, then returns an array 9 indexes long representing each damage resist type, and how much of that type was sumed.
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

const allWeapons = [];
function defineAllWeapons() {
    allWeapons[0] = {
        name: `Unarmed`,
        type: `melee`,
        damage: [[0, 1, 4]],
        range: 1,
        parry: 0,
        dodge: 0,
        disrupt: 0,
        block: 0,
    }
    allWeapons[1] = {
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

const allArmors = [];
function defineAllArmors() {
    allArmors[0] = {
        name: `None`,
        parry: 0,
        dodge: 0,
        disrupt: 0,
        block: 0,
    }
    allArmors[1] = {
        name: `Chainmail`,
        parry: 1,
        dodge: 0,
        disrupt: 0,
        block: 0,
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
        resists: {
            flat: 0,
            piercing: 0,
            ice: -5,
            fire: -5,
            corrosive: -5,
            poison: -5,
            spiritual: -5,
            lighting: -5,
            arcane: -5,
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
        resists: {
            flat: 0,
            piercing: 0,
            ice: -5,
            fire: -5,
            corrosive: -5,
            poison: -5,
            spiritual: -5,
            lighting: -5,
            arcane: -5,
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
        resists: {
            flat: 0,
            piercing: 0,
            ice: -3,
            fire: -3,
            corrosive: -3,
            poison: -3,
            spiritual: -3,
            lighting: -3,
            arcane: -3,
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
        resists: {
            flat: 5,
            piercing: 5,
            ice: 0,
            fire: 0,
            corrosive: 0,
            poison: 0,
            spiritual: -5,
            lighting: 0,
            arcane: -5,
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
    this.resists = race.resists;
    this.resistsArray = race.resistsArray; 
    this.buffs = {};
    this.debuffs = {};
    this.row = 1;
    this.equipment = {
        mainHand: allWeapons[0],
        offHand: allWeapons[0],
        armor: allArmors[0],
    };
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
    moveRowButtons: document.querySelector(`.moveRowButtons`),
    equipmentList: document.querySelector(`.equipmentList`),
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
        this.updateEquipmentList();
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
        this.updateEquipmentList();
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

    updateEquipmentList: function () {
        this.equipmentList.innerHTML = `Equipment:`;
        if (this.casterSelectionState) {
            for (let i = 0; i <= (Object.keys(this.casterSelectionState.equipment).length - 1); i++) {
                this.createEquipmentDisplay(this.casterSelectionState, i)
            };
        }
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

    createEquipmentDisplay: function (char, keyNumberOfItem) {
        const i = document.createElement(`div`);
        const arrayOfAllKeysInEquipment = Object.keys(char.equipment);
        const itemKeyName = arrayOfAllKeysInEquipment[keyNumberOfItem];
        const item = char.equipment[itemKeyName];
        if (item === null) {
            i.innerHTML = `<div class="slotName">${itemKeyName}: None</div>`;
        } else if (item.damage) {
            i.innerHTML = `<div class="slotName">${itemKeyName}: ${item.name} Damage: ${item.damage[0][0]}D${item.damage[0][1]}</div>`;
        } else {
            i.innerHTML = `<div class="slotName">${itemKeyName}: ${item.name} </div>`;
        }
        this.equipmentList.append(i);
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

characterCreator(`Stroick`, allRaces[0], allTalents[0], allTalents[5], PCs);
characterCreator(`Kliftin`, allRaces[1], allTalents[2], allTalents[6], PCs);
characterCreator(`Dahmer Hobo`, allRaces[3], allTalents[6], allTalents[7], NPCs);
characterCreator(`Evil`, allRaces[2], allTalents[4], allTalents[5], NPCs);

const stroick = PCs.charList[0];
const evil = NPCs.charList[1];
const kliftin = PCs.charList[1];
const hobo = NPCs.charList[0];

DOM.update();
DOM.listenForCasterSelection();
DOM.listenForBotBar();
DOM.listenForEndTurnButton();
DOM.listenForTargetSelection();
DOM.listenForMoveRowButtons();
