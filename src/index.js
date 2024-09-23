import { drop, forEach } from "lodash";
import {combatLog} from './combatLog.js';
import {logicLib} from './logicLib.js';
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
import "./images/attack.png";
import "./images/powerfulStrike.png";
import "./images/precisionStrike.png";
import "./images/healingWord.png";
import "./images/guard.png";
import "./images/leapingStrike.png";
import "./images/reflexiveFocus.png";
import "./images/revealWeakness.png";
import "./images/fleshEating.png";
import "./images/riposte.png";
import "./images/taunt.png";
import "./images/dahmerHobo.jpg";
import "./images/stroick.jpg";
import "./images/kliftin.jpg";
import "./images/evil.jpg";
import "./images/logo.png";
import "./images/logoTrans.png";
import "./images/audioPlaying.png";
import "./images/audioMuted.png";
import "./audio/mainMenuMusic.mp3";
import "./audio/introAudio.mp3";


"use strict";

/* #region Notes*/

// TODO: Must make ID's for everything, to make them easier to handle.
// TODO: I am copying data too much, all characters should REFERENCE ability data etc, this will make it easier to code and should improve performance.
// TODO: Need to do full ability and attack logic rewrite, to make it easier to work with, need to make it super ultra modular.
// TODO: Eventually make tooltips for absolutely everything, tooltips within tooltips. Want to make tooltips for stats that break down where they all came from.
// TODO: important dialogues should literally be html dialogues/modals.
// TODO: add some local storage to the game.

/* #endregion Notes*/

/* #region  Ability Effects & Logic */ 

const turn = {
    AP: 100,
    end: function () {
        combatLog.startNPCTurn();
        turn.AP = 100;
        while (turn.AP > 0) { 
            let attackablePCs = [];
            turn.getAttackablePCs(attackablePCs);
            if(!attackablePCs[0]) {
                break;
            }
            const attackingNPC = turn.getAttackingNPC();
            turn.NPCMakeAttack(attackingNPC, attackablePCs);
        };
        turn.AP = 100;
        DOM.update();
        DOM.updateTopBar();
        combatLog.startPCTurn();
    },
    getAttackablePCs: function (attackablePCs) { // * Checks if a PC is alive, if so, add them to the list of attackable PCs.
        for(let i = 0; i < PCs.charList.length; i++) { 
            if(PCs.charList[i].hp > 1) {
                attackablePCs.push(PCs.charList[i]);
            }
        }
    },
    getAttackingNPC: function () { // *
        const attackingNPC = NPCs.charList[effect.diceMinus1(NPCs.charList.length)];
        return attackingNPC
    },
    NPCMakeAttack: function (attackingNPC, attackablePCs) {
        attackingNPC.useAbility(1, attackablePCs[effect.diceMinus1(attackablePCs.length)]);
    }
}

const effect = {
    meleeAttack: function (caster, target, mods) {
        const ability = allAbilities[mods.abilityIndex];
        let riposte = false;
        let damageSum;

        /* #region  CASTER ATTACK */
        let attackRollAdvantages = effect.calcTargetAttackAdvatages(caster);
        let attackRoll = effect.rollWithAdvantageCount(100, attackRollAdvantages);
        const attack = attackRoll + mods.attackBonus;
        /* #endregion */

        /* #region  TARGET DEFEND */
        let defendRollAdvantages = effect.calcTargetDefendAdvatages(target);
        let defendRoll = effect.rollWithAdvantageCount(20, defendRollAdvantages);
        const defend = defendRoll + mods.getDefendBonus();
        /* #endregion */

        combatLog.attackAttempt(caster, target, attackRoll, defendRoll, mods.attackBonus, mods.getDefendBonus(), ability, attackRollAdvantages, defendRollAdvantages);

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
                target.useAbility(10, caster);
            }
            return;
        }
        /* #endregion */

        const damageRollArr = effect.concatRollDice(mods.damageRollDice.mainHandWeapon, mods.damageRollDice.offHandWeapon, mods.damageRollDice.ability);
        damageRollArr.push(mods.damageBonus);
        // sum of damage array will return something like this: if input is equal to [[0,3][0,4][4,8]] then output is [7,0,0,0,8,0,0,0,0]
        let totalDamagePerResist = effect.sumOfDamageArray(damageRollArr);

        if (attackRoll >= mods.critThreshold) { // * ON CRIT
            combatLog.critHit(caster, target, damageRollArr);
            totalDamagePerResist = effect.resistArrayMultiply(totalDamagePerResist, 2); // ! Crit multiplier, currently just locked at 2. Can make dynamic later.
        } else { // * ON HIT
            combatLog.hit(caster, target, damageRollArr)
        } 

        if (target.buffs.guarded) {
            const guardDefense = effect.getGuardDefense(`melee`, target.buffs.guarded.caster);
            const targetDamage = effect.calcTotalDamageAfterResists(totalDamagePerResist, target.resistsArray, caster, target, `guarded`);
            combatLog.totalDamage(caster, target, effect.sumOfArray(targetDamage));
            target.hp -= effect.sumOfArray(targetDamage);
            if (attack > guardDefense) {
                combatLog.guardFailsDefend(caster, target, target.buffs.guarded.caster);
                const guardDamage = effect.calcTotalDamageAfterResists(totalDamagePerResist, target.buffs.guarded.caster.resistsArray, caster, target.buffs.guarded.caster, `guarding`);
                combatLog.totalDamage(caster, target.buffs.guarded.caster, effect.sumOfArray(guardDamage));
                target.buffs.guarded.caster.hp -= effect.sumOfArray(guardDamage);
            } else {
                combatLog.guardDefend(caster, target, target.buffs.guarded.caster);
            }
        } else {
            damageSum = effect.calcTotalDamageAfterResists(totalDamagePerResist, target.resistsArray, caster, target, false); // * also calls combatLog()
            combatLog.totalDamage(caster, target, effect.sumOfArray(damageSum));
            target.hp -= effect.sumOfArray(damageSum); 
        }

        if (riposte) {
            combatLog.riposte(target, caster);
            target.useAbility(10, caster);
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
    //     const attackRoll = effect.dice(100);
    //     const defendRoll = effect.dice(20);
    //     const attackBonus = caster.stats.dexterity;
    //     const defendBonus = this.determineDefendBonus(caster, target);
    //     const damage = this.determineDamage(caster);
    //     const attack = attackRoll + attackBonus;
    //     const defend = defendRoll + defendBonus;
    //     if (attackRoll === 100) {
    //         combatLog.critHit(caster, target, damage);
    //         if (effect.sumOfArray(damage) < 1) {
    //             target.hp -= 2;
    //         } else {
    //             target.hp -= effect.sumOfArray(damage) * 2;
    //         }
    //     } else {
    //         combatLog.attackAttempt(caster, target, attackRoll, defendRoll, attackBonus, defendBonus);
    //         if (attack >= defend) {
    //             combatLog.hit(caster, target, damage);
    //             if (effect.sumOfArray(damage) < 1) {
    //                 target.hp -= 1;
    //             } else {
    //                 target.hp -= effect.sumOfArray(damage);
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
    //     const attackRoll = effect.dice(100);
    //     const defendRoll = effect.dice(20);
    //     const attackBonus = caster.stats.dexterity;
    //     const defendBonus = this.determineDefendBonus(caster, target);
    //     const damage = this.determineDamage(caster);
    //     const attack = attackRoll + attackBonus;
    //     const defend = defendRoll + defendBonus;
    //     if (attackRoll === 100) {
    //         combatLog.critHit(caster, target, damage);
    //         if (effect.sumOfArray(damage) < 1) {
    //             target.hp -= 2;
    //         } else {
    //             target.hp -= effect.sumOfArray(damage) * 2;
    //         }
    //     } else {
    //         combatLog.attackAttempt(caster, target, attackRoll, defendRoll, attackBonus, defendBonus);
    //         if (attack >= defend) {
    //             combatLog.hit(caster, target, damage);
    //             if (effect.sumOfArray(damage) < 1) {
    //                 target.hp -= 1;
    //             } else {
    //                 target.hp -= effect.sumOfArray(damage);
    //             }
    //         } else {
    //             combatLog.defend(caster, target);
    //         }
    //     }
    // },

    heal: function (caster, target) {
        const healRoll = effect.dice(100);
        const healAmountRoll = effect.dice(4);
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
    resistArrayMultiply: function (inputResistArray, multiplier) { // * Takes input like so: [7,0,0,0,8,0,0,0,0] and outputs all of those numbers multiplied by the amount specified.
        let outputResistArray = [0,0,0,0,0,0,0,0,0];
        for(let i = 0; i < 9; i++) {
            if (inputResistArray[i] > 0) {
                outputResistArray[i] = inputResistArray[i] * multiplier;
            }
        }
        return outputResistArray;
    
    },
    calcTotalDamageAfterResists: function (damage, resists, caster, target, guardState) { // * Takes two 9 index long resist arrays, outputs the aftermath of damage. 
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
                effect.divideGuardDamage(damageSum, i, guardState);
                combatLog.damageResist(i, damage[i], resists[i], damageSum[i], caster, target, guardState);
            } else if (damageSum[i] < 0){ // * if the damage is negative, then 1 damage is taken, because you cannot deal negative damage on an attack.
                effect.divideGuardDamage(damageSum, i, guardState);
                combatLog.damageResist(i, damage[i], resists[i], damageSum[i], caster, target, guardState);
                damageSum[i] += 1;
            } else {
                damageSum[i] = 0;
            }
        }
        return damageSum;
    },
    divideGuardDamage: function (damageSum, i, guardState) { // * checks for any kinds of guard states and divides accordingly. NOTE!: Alters the actual objects via reference.
        if (guardState === `guarded`) { 
            damageSum[i] = Math.ceil(damageSum[i] / 2);
        } else if(guardState === `guarding`) {
            damageSum[i] = Math.floor(damageSum[i] / 2);
        } else {
            return;
        }
        return;
    },
    calcTargetAttackAdvatages: function (caster) { // * Takes target as input, returns the total advantage count for their defend roll, counting buffs and debuffs.
        let attackRollAdvantages = [];
        Object.keys(caster.buffs).forEach((buffKey) => {
            if (caster.buffs[buffKey].attackRollAdvantage) {
                attackRollAdvantages.push(caster.buffs[buffKey].attackRollAdvantage);
            }
        });
        Object.keys(caster.debuffs).forEach((buffKey) => {
            if (caster.debuffs[buffKey].attackRollAdvantage) {
                attackRollAdvantages.push(caster.debuffs[buffKey].attackRollAdvantage);
            }
        });
        return effect.sumOfArray(attackRollAdvantages);
    },
    calcTargetDefendAdvatages: function (target) { // * Takes target as input, returns the total advantage count for their defend roll, counting buffs and debuffs.
        let defendRollAdvantages = [];
        Object.keys(target.buffs).forEach((buffKey) => {
            if (target.buffs[buffKey].defendRollAdvantage) {
                defendRollAdvantages.push(target.buffs[buffKey].defendRollAdvantage);
            }
        });
        Object.keys(target.debuffs).forEach((buffKey) => {
            if (target.debuffs[buffKey].defendRollAdvantage) {
                defendRollAdvantages.push(target.debuffs[buffKey].defendRollAdvantage);
            }
        });
        return effect.sumOfArray(defendRollAdvantages);
    },
    rollWithAdvantageCount: function (diceSize, advantageCount) { // * Takes a dice size input, and a advantage or disadvantage count input (pos 1 will be a regular roll, lower will be disadvantage and higher will be advantage) returns the highest or lowest number respectiveley.
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
            arrOfRolls.push(effect.dice(diceSize))
        };
        if (isAdvantageCountPos) {
            return Math.max(...arrOfRolls);
        } else {
            return Math.min(...arrOfRolls);
        }
    },
    getGuardDefense: function (attackType, guarder) {
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
    },
    concatRollDice: function (...args) { // * Takes multiple 2D dice array input like rollDice does, but outputs will ignore null inputs.
        let outputArr = [];
        args.forEach((el) => {
            if (el) {
                let i = effect.rollDice(el);
                outputArr = outputArr.concat(i);
            }
        });
        return outputArr;
    },
    rollDice: function (diceArr) { // * Takes a 2D dice array input like so: [ [2,4] , [3,6] ] - equivilent to 2d4 + 3d6. Outputs array of each individual roll result, now with resistances.
        if (diceArr === null) {
            return null;
        }
        let rollArr = [];
        for (let i = 0; i < diceArr.length; i++) {
            for (let x = 0; x < diceArr[i][1]; x++) {
    
                rollArr.push([diceArr[i][0],effect.dice(diceArr[i][2])]);
            }
        }
        return rollArr;
    },
    dice: function (dMax) { // * Takes an integer number X as input and outputs a random number between 1 and X like a single dice roll.
        return Math.floor(Math.random() * dMax + 1);
    },
    diceMinus1: function (dMax) { // * Takes an integer number X as input and outputs a random number between 0 and X.
        return Math.floor(Math.random() * dMax + 1) - 1;
    },
    sumOfDamageArray: function (arrayOfNumbers) { // * Takes a 2D array of numbers and adds the index [1's] up, then returns an array 9 indexes long representing each damage resist type, and how much of that type was summed.
        if (arrayOfNumbers === null) {
            return null;
        }
        let sum = [0,0,0,0,0,0,0,0,0];
        for (let i = 0; i < arrayOfNumbers.length; i++) {
            sum[arrayOfNumbers[i][0]] += arrayOfNumbers[i][1];
        }
        return sum;
    },
    sumOfArray: function (arrayOfNumbers) { // * Takes a 1D array of numbers and adds them up, then returns the sum.
        let sum = 0;
        arrayOfNumbers.forEach((el) => { if (el === null) { el = 0 } sum += el });
        return sum;
    },
};

/* #endregion Ability Effects & Logic*/

/* #region All Lists */

const allAbilities = [];
function defineAllAbilities() {
    allAbilities[0] = {
        name: `empty`,
        effect: function (caster, target) {
            return;
            if (!logicLib.isAttackingAllies(caster, target)) {
                if (!logicLib.isTargetDead(target)) {
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
                        if(logicLib.isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                            effect.meleeAttack(caster, target, mods); turn.AP -= this.APCost
                        } else {
                            combatLog.targetNotInRange(target, this.name);
                        }
                    } else {
                        combatLog.noAP(this.name, this.APCost, turn.AP);
                    }
                }
            }
        },
        APCost: 0,
        icon: `url("./images/quickAccess.png")`,
        index: 0,
        targetDesc: `N/A`,
        typeDesc: `N/A`,
        desc: `N/A`,
    }
    allAbilities[1] = {
        name: `Attack`,
        effect: function (caster, target) {
            if (!logicLib.isAttackingAllies(caster, target)) {
                if (!logicLib.isTargetDead(target)) {
                    if (turn.AP >= this.APCost) {
                        const mods = {
                            abilityIndex: 1,
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
                        if(logicLib.isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                            effect.meleeAttack(caster, target, mods); turn.AP -= this.APCost
                        } else {
                            combatLog.targetNotInRange(target, this.name);
                        }
                    } else {
                        combatLog.noAP(this.name, this.APCost, turn.AP);
                    }
                }
            }
        },
        APCost: 20,
        icon: `url("./images/attack.png")`,
        index: 1,
        targetDesc: `1 Foe`,
        typeDesc: `Attack`,
        desc: `Attack a foe with all of the default bonues.`,
    }
    allAbilities[2] = {
        name: `Powerful Strike`,
        effect: function (caster, target) {
            if (!logicLib.isAttackingAllies(caster, target)) {
                if (!logicLib.isTargetDead(target)) {
                    if (turn.AP >= this.APCost) {
                        const mods = {
                            abilityIndex: 2,
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
                        if(logicLib.isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                            effect.meleeAttack(caster, target, mods); turn.AP -= this.APCost
                        } else {
                            combatLog.targetNotInRange(target, this.name);
                        }
                    } else {
                        combatLog.noAP(this.name, this.APCost, turn.AP);
                    }
                }
            }
        },
        APCost: 25,
        icon: `url("./images/powerfulStrike.png")`,
        index: 2,
        targetDesc: `1 Foe`,
        typeDesc: `Attack`,
        desc: `Use strength as your attack bonus for this attack, and strength damage bonus is increased by 50%.`,
    }
    allAbilities[3] = {
        name: `Precision Strike`,
        effect: function (caster, target) {
            if (!logicLib.isAttackingAllies(caster, target)) {
                if (!logicLib.isTargetDead(target)) {
                    if (turn.AP >= this.APCost) {
                        const mods = {
                            abilityIndex: 3,
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
                        if(logicLib.isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                            effect.meleeAttack(caster, target, mods); turn.AP -= this.APCost
                        } else {
                            combatLog.targetNotInRange(target, this.name);
                        }
                    } else {
                        combatLog.noAP(this.name, this.APCost, turn.AP);
                    }
                }
            }
        },
        APCost: 25,
        icon: `url("./images/precisionStrike.png")`,
        index: 3,
        targetDesc: `1 Foe`,
        typeDesc: `Attack`,
        desc: `Double Dexterity for your attack bonus for this attack, and dexterity damage bonus is increased by 50%.`,
    }
    allAbilities[4] = {
        name: `Healing Word`,
        effect: function (caster, target) {
            if (!logicLib.isHealingEnemies(caster, target)) {
                if (!logicLib.isHealingDeadTarget(target, this.name)) {
                    if (turn.AP >= this.APCost) {
                        const mods = {
                            abilityIndex: 4,
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
                        if(logicLib.isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                            effect.heal(caster, target); turn.AP -= this.APCost
                        } else {
                            combatLog.targetNotInRange(target, this.name);
                        }
                    } else {
                        combatLog.noAP(this.name, this.APCost, turn.AP);
                    }
                }
            }
        },
        APCost: 10,
        icon: `url("./images/healingWord.png")`,
        index: 4,
        targetDesc: `1 Ally`,
        typeDesc: `Healing`,
        desc: `Heal you or an ally for 1d4 + 1/4 Willpower in Health.`,
    }
    allAbilities[5] = {
        name: `Guard`,
        effect: function (caster, target) {
            if (!logicLib.isBuffingEnemies(caster, target)) {
                if (!logicLib.isTargetDead(target)) {
                    if (!target.buffs.guarded) {
                        if (turn.AP >= this.APCost) {
                            const mods = {
                                abilityIndex: 5,
                                abilityRange: 1,
                                buffNameForTarget: `Guarded`,
                                buffNameForCaster: `Guarding`,
                                buffDescForTarget: `Guarded by ${caster.name}`,
                                buffDescForCaster: `Guarding ${target.name}`,
                            };
                            if(logicLib.isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                                effect.guard(caster, target, mods); turn.AP -= this.APCost
                            } else {
                                combatLog.targetNotInRange(target, this.name);
                            }
                        } else {
                            combatLog.noAP(this.name, this.APCost, turn.AP);
                        }
                    }
                }
            }
        },
        APCost: 50,
        icon: `url("./images/guard.png")`,
        index: 5,
        targetDesc: `1 Ally`,
        typeDesc: `Guard`,
        desc: `An ally of your choice will split off half of the damage they take and you will then take it instead. You can have a chance to defend this damage.`,
    }
    allAbilities[6] = {
        name: `Leaping Strike`,
        effect: function (caster, target) {
            if (!logicLib.isAttackingAllies(caster, target)) {
                if (!logicLib.isTargetDead(target)) {
                    if (turn.AP >= this.APCost) {
                        const mods = {
                            abilityIndex: 6,
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
                        if(logicLib.isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                            effect.meleeAttack(caster, target, mods); turn.AP -= this.APCost
                        } else {
                            combatLog.targetNotInRange(target, this.name);
                        }
                    } else {
                        combatLog.noAP(this.name, this.APCost, turn.AP);
                    }
                }
            }
        },
        APCost: 20,
        icon: `url("./images/leapingStrike.png")`,
        index: 6,
        targetDesc: `1 Foe`,
        typeDesc: `Attack`,
        desc: `Make a leaping regular attack with an added 1 row of range.`,
    }
    allAbilities[7] = {
        name: `Reflexive Focus`, // TODO: Make this ability drain 5 ap every turn that it is active, also need a way to see that it is active and a way to disable it.
        effect: function (caster, target) {
            if (!caster.buffs.reflexiveFocus) {
                if (turn.AP >= this.APCost) {
                    const mods = {
                        abilityIndex: 7,
                        name: `Reflexive Focus`,
                        desc: `${caster.name} is focused on his defenses, giving advantage on defense rolls. `,
                        buffNameForBuffObj: `reflexiveFocus`,
                        defendRollAdvantage: 1,
                    };
                    effect.casterOnlyBuff(caster, mods); turn.AP -= this.APCost
                } else {
                    combatLog.noAP(this.name, this.APCost, turn.AP);
                }
            } else {
                // TODO: Need a combat log for the target
            }
        },
        APCost: 5,
        icon: `url("./images/reflexiveFocus.png")`,
        index: 7,
        targetDesc: `Self`,
        typeDesc: `Buff`,
        desc: `Focus on your defenses, giving advantage on defense rolls while this is active.`,
    }
    allAbilities[8] = {
        name: `Reveal Weakness`,
        effect: function (caster, target) {
            if (!logicLib.isAttackingAllies(caster, target)) {
                if (!logicLib.isTargetDead(target)) {
                    if (turn.AP >= this.APCost) {
                        const mods = {
                            abilityIndex: 8,
                            name: `Reveal Weakness`,
                            desc: `${caster.name} has revealed ${target.name}'s weakness, giving him disadvantage on defense, and he takes 1 extra damage from all attacks. `,
                            debuffNameForBuffObj: `revealWeakness`,
                            defendRollAdvantage: -1,
                            abilityRange: 5,
                        };
                        if(logicLib.isTargetInRangeOfCaster(caster, target, mods.abilityRange)) {
                            effect.debuff(caster, target, mods); turn.AP -= this.APCost
                        } else {
                            combatLog.targetNotInRange(target, this.name);
                        }
                    } else {
                        combatLog.noAP(this.name, this.APCost, turn.AP);
                    }
                }
            }
        },
        APCost: 75,
        icon: `url("./images/revealWeakness.png")`,
        index: 8,
        targetDesc: `1 Foe`,
        typeDesc: `Debuff`,
        desc: `Foe has disadvantage on defense, and takes 1 extra damage every time they take damage.`,
    }
    allAbilities[9] = { // TODO: Need to flush this ability out.
        name: `Taunt`,
        effect: function (caster, target) {
            return;
            if (!logicLib.isAttackingAllies(caster, target)) {
                if (turn.AP >= this.APCost) {
                    effect.attack(caster, target); turn.AP -= this.APCost
                } else {
                    combatLog.noAP(this.name, this.APCost, turn.AP);
                }
            }
        },
        APCost: 50,
        icon: `url("./images/taunt.png")`,
        index: 9,
        targetDesc: `1 Foe`,
        typeDesc: `Debuff`,
        desc: `Taunt 1 foe ( with less willpower than you have Charisma ) at a time for 3 turns, making them deal half damage to anyone but you, if they hit you for any amount of damage this ability ends.`,
    }
    allAbilities[10] = {
        name: `Riposte`,
        effect: function (caster, target) {
            if (!logicLib.isAttackingAllies(caster, target)) {
                if (!logicLib.isTargetDead(target)) {
                    const mods = {
                        isRiposte: true,
                        abilityIndex: 10,
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
        icon: `url("./images/riposte.png")`,
        index: 10,
        targetDesc: `1 Foe`,
        typeDesc: `Attack`,
        desc: `Make a counter attack on a foe if your defense roll is at least 50% of their attack roll.`,
    }
}
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
const allArmors = []; 
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
const allTalents = [];
function defineAllTalents() {
    allTalents[0] = {
        index: 0,
        name: `None`,
        statBonusName: `None`,
        statBonusAmount: null,
        ability: null,
    };
    allTalents[1] = {
        index: 1,
        name: `Strong`,
        statBonusName: `strength`,
        statBonusAmount: 4,
        ability: 2,
    };
    allTalents[2] = {
        index: 2,
        name: `Dexterous`,
        statBonusName: `dexterity`,
        statBonusAmount: 4,
        ability: 3,
    };
    allTalents[3] = {
        index: 3,
        name: `Soulful`,
        statBonusName: `willpower`,
        statBonusAmount: 4,
        ability: 4,
    };
    allTalents[4] = {
        index: 4,
        name: `Resilient`,
        statBonusName: `vitality`,
        statBonusAmount: 4,
        ability: 5,
    };
    allTalents[5] = {
        index: 5,
        name: `Agile`,
        statBonusName: `agility`,
        statBonusAmount: 4,
        ability: 6,
    };
    allTalents[6] = {
        index: 6,
        name: `Responsive`,
        statBonusName: `initiative`,
        statBonusAmount: 4,
        ability: 7,
    };
    allTalents[7] = {
        index: 7,
        name: `Genius`,
        statBonusName: `intelligence`,
        statBonusAmount: 4,
        ability: 8,
    };
    allTalents[8] = {
        index: 8,
        name: `Charismatic`,
        statBonusName: `charisma`,
        statBonusAmount: 4,
        ability: 9,
    };
    allTalents[9] = {
        index: 9,
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
function defineAllLists() { // * Defines all of the above lists.
    defineAllAbilities();
    defineAllWeapons();
    defineAllRaces();
    defineAllTalents();
    defineAllArmors();
    defineAllFeats();
    defineAllBackgrounds();
    defineAllItems();
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
    this.abilities = [1];
    this.hotBar = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    this.stats = {
        strength: race.stats.strength,
        dexterity: race.stats.dexterity,
        willpower: race.stats.willpower,
        vitality: race.stats.vitality,
        agility: race.stats.agility,
        initiative: race.stats.initiative,
        intelligence: race.stats.intelligence,
        charisma: race.stats.charisma,
    }
    this.resistsArray = [race.resistsArray[0],race.resistsArray[1],race.resistsArray[2],race.resistsArray[3],race.resistsArray[4],race.resistsArray[5],race.resistsArray[6],race.resistsArray[7],race.resistsArray[8]],
    this.buffs = {};
    this.debuffs = {};
    this.row = 1;
    this.level = 0;
    this.background = ``;
    this.icon;
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
        this.parry = effect.sumOfArray([this.equipment.mainHand.parry, this.equipment.offHand.parry, this.equipment.armor.parry]);
        this.dodge = effect.sumOfArray([this.equipment.mainHand.dodge, this.equipment.offHand.dodge, this.equipment.armor.dodge]);
        this.disrupt = effect.sumOfArray([this.equipment.mainHand.disrupt, this.equipment.offHand.disrupt, this.equipment.armor.disrupt]);
        this.block = effect.sumOfArray([this.equipment.mainHand.block, this.equipment.offHand.block, this.equipment.armor.block]);
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
            if (this.abilities.includes(+abilityIndex) || +abilityIndex === 10) {
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

function characterCreator(name, race, talent1, talent2, group, icon) {
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
        if(talent1StatBonusAmount) {
            targetChar.addStatBonus(talent1StatBonusName, talent1StatBonusAmount);
        }
        if(talent2StatBonusAmount) {
            targetChar.addStatBonus(talent2StatBonusName, talent2StatBonusAmount);
        }
        if(talent1Ability) {
            targetChar.abilities.push(talent1Ability);
        }
        if(talent2Ability) {
            targetChar.abilities.push(talent2Ability);
        }
    }
    function addEquipment() {
        const targetChar = unassignedGroup.charList[unassignedGroup.charList.length - 1];
        targetChar.addEquipment(`armor`, allArmors[0]);
    }
    function addIcon(icon) {
        const targetChar = unassignedGroup.charList[unassignedGroup.charList.length - 1];
        targetChar.icon = icon;
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
    addIcon(icon);
    assignGroup(group);
};

/* #endregion Char Creation*/

/* #region  DOM */

const DOM = {
    body: document.querySelector(`body`),
    mainMenu: document.querySelector(`.mainMenu`),
    charCreationMasterContainer: document.querySelector(`.charCreation.masterContainer`),
    charCreationStatsPreview: document.querySelector(`.charCreation.statsPreview`),
    charCreationConfirmButton: document.querySelector(`.charCreation.confirm`),
    charCreationChoices: document.querySelector(`.charCreation.choices`),
    charCreationRaceBar: document.querySelector(`.charCreation.raceBar`),
    charCreationBackground: document.querySelector(`.charCreation.background`),
    charCreationTalent1: document.querySelector(`.charCreation.talent1`),
    charCreationTalent2: document.querySelector(`.charCreation.talent2`),
    mainMenuButton: document.querySelectorAll(`.mainMenuButton`),
    newGameButton: document.querySelector(`.newGameButton`),
    loadGameButton: document.querySelector(`.loadGameButton`),
    settingsGameButton: document.querySelector(`.settingsGameButton`),
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
    isIntroActive: false,
    introTimeout: null,
    mainMenuMusic: new Audio(`./audio/mainMenuMusic.mp3`),
    introAudio: new Audio(`./audio/introAudio.mp3`),
    isPlayerDoneCreatingChar: false,
    currentcharCreationOptionSelection: null,
    currentcharCreationChoiceSelection: null,
    charCreationCharData: {
        name: ``,
        icon: `url("./images/kliftin.jpg")`,
        race: allRaces[0],
        background: allBackgrounds[0],
        talent1: allTalents[0],
        talent2: allTalents[0],
    },

    updateCharCreationStatsPreview: function () {
        let char = PCs.charList[0];

        DOM.charCreationStatsPreview.innerHTML = ``;
        // ! Below is the code that I want to refactor for char creation screen
        const equipDisplay = document.createElement(`div`);
        equipDisplay.className = `equipDisplay charCreation`;
        // * Main Container
        DOM.charCreationStatsPreview.append(equipDisplay);

        // * Subcontainers
        const equipLeft = document.createElement(`div`);
        equipLeft.className = `equipLeft charCreation`;
        const equipCenter = document.createElement(`div`);
        equipCenter.className = `equipCenter charCreation`;
        const equipRight = document.createElement(`div`);
        equipRight.className = `equipRight charCreation`;
        equipDisplay.append(equipLeft, equipCenter, equipRight);

        // * Main Armor Slots on the left
        const headSlot = document.createElement(`div`);
            this.charCreationCreateEquipmentSlot(headSlot, char, `head`);
        const torsoSlot = document.createElement(`div`);
            this.charCreationCreateEquipmentSlot(torsoSlot, char, `torso`);
        const armsSlot = document.createElement(`div`);
            this.charCreationCreateEquipmentSlot(armsSlot, char, `arms`);
        const legsSlot = document.createElement(`div`);
            this.charCreationCreateEquipmentSlot(legsSlot, char, `legs`);
        equipLeft.append(headSlot, torsoSlot, armsSlot, legsSlot);

        // * Middle Subcontainers
        const statsDisplay = document.createElement(`div`);
        statsDisplay.className = `statsDisplay charCreation`;

            const statsDisplayLeft = document.createElement(`div`);
            statsDisplayLeft.className = `statsDisplayLeft charCreation`;

                const strengthDisplay = document.createElement(`div`);
                strengthDisplay.textContent = `STR: ${char.stats.strength}`;

                const dexterityDisplay = document.createElement(`div`);
                dexterityDisplay.textContent = `DEX: ${char.stats.dexterity}`;

                const willpowerDisplay = document.createElement(`div`);
                willpowerDisplay.textContent = `WIL: ${char.stats.willpower}`;

                const vitalityDisplay = document.createElement(`div`);
                vitalityDisplay.textContent = `VIT: ${char.stats.vitality}`;

                const divider1 = document.createElement(`div`);
                divider1.textContent = `-`;

                const parryDisplay = document.createElement(`div`);
                parryDisplay.textContent = `PARRY: ${char.parry}`;

                const dodgeDisplay = document.createElement(`div`);
                dodgeDisplay.textContent = `DODGE: ${char.dodge}`;

                const divider3 = document.createElement(`div`);
                divider3.textContent = `-`;

                const flatResistDisplay = document.createElement(`div`);
                flatResistDisplay.textContent = `FLAT R: ${char.resistsArray[0]}`;

                const iceResistDisplay = document.createElement(`div`);
                iceResistDisplay.textContent = `ICE R: ${char.resistsArray[2]}`;

                const corrosiveResistDisplay = document.createElement(`div`);
                corrosiveResistDisplay.textContent = `CORRO. R: ${char.resistsArray[4]}`;

                const spiritualResistDisplay = document.createElement(`div`);
                spiritualResistDisplay.textContent = `SPIRIT R: ${char.resistsArray[6]}`;

                const arcaneResistDisplay = document.createElement(`div`);
                arcaneResistDisplay.textContent = `ARCANE R: ${char.resistsArray[8]}`;
                
                statsDisplayLeft.append(strengthDisplay, dexterityDisplay, willpowerDisplay, vitalityDisplay, divider1, parryDisplay, dodgeDisplay, divider3, flatResistDisplay, iceResistDisplay, corrosiveResistDisplay, spiritualResistDisplay, arcaneResistDisplay);

            const statsDisplayRight = document.createElement(`div`);
            statsDisplayRight.className = `statsDisplayRight charCreation`;

                const agilityDisplay = document.createElement(`div`);
                agilityDisplay.textContent = `AGI: ${char.stats.agility}`;

                const initiativeDisplay = document.createElement(`div`);
                initiativeDisplay.textContent = `INI: ${char.stats.initiative}`;

                const intelligenceDisplay = document.createElement(`div`);
                intelligenceDisplay.textContent = `INT: ${char.stats.intelligence}`;

                const charismaDisplay = document.createElement(`div`);
                charismaDisplay.textContent = `CHA: ${char.stats.charisma}`;

                const divider2 = document.createElement(`div`);
                divider2.textContent = `-`;

                const disruptDisplay = document.createElement(`div`);
                disruptDisplay.textContent = `DISRUPT: ${char.disrupt}`;

                const blockDisplay = document.createElement(`div`);
                blockDisplay.textContent = `BLOCK: ${char.block}`;

                const divider4 = document.createElement(`div`);
                divider4.textContent = `-`;

                const piercingResistDisplay = document.createElement(`div`);
                piercingResistDisplay.textContent = `PIERCE R: ${char.resistsArray[1]}`;

                const fireResistDisplay = document.createElement(`div`);
                fireResistDisplay.textContent = `FIRE R: ${char.resistsArray[3]}`;

                const poisonResistDisplay = document.createElement(`div`);
                poisonResistDisplay.textContent = `POISON R: ${char.resistsArray[5]}`;

                const lightningResistDisplay = document.createElement(`div`);
                lightningResistDisplay.textContent = `LIGHTN. R: ${char.resistsArray[7]}`;
                
                statsDisplayRight.append( agilityDisplay, initiativeDisplay, intelligenceDisplay, charismaDisplay, divider2, disruptDisplay, blockDisplay, divider4, piercingResistDisplay, fireResistDisplay, poisonResistDisplay, lightningResistDisplay);

        statsDisplay.append(statsDisplayLeft, statsDisplayRight);

        const weaponsDisplay = document.createElement(`div`);
        weaponsDisplay.className = `weaponsDisplay charCreation`;

            const mainHandWeaponSlot = document.createElement(`div`);
                this.charCreationCreateEquipmentSlot(mainHandWeaponSlot, char, `mainHand`);
            const offHandWeaponSlot = document.createElement(`div`);
                this.charCreationCreateEquipmentSlot(offHandWeaponSlot, char, `offHand`);
            weaponsDisplay.append(mainHandWeaponSlot, offHandWeaponSlot);

        equipCenter.append(statsDisplay, weaponsDisplay);

        // * Amulet & Quick Access Slots on the right.
        const amulet1Slot = document.createElement(`div`);
            this.charCreationCreateEquipmentSlot(amulet1Slot, char, `amulet1`);
        const amulet2Slot = document.createElement(`div`);
            this.charCreationCreateEquipmentSlot(amulet2Slot, char, `amulet2`);
        const quickAccess1Slot = document.createElement(`div`);
            this.charCreationCreateEquipmentSlot(quickAccess1Slot, char, `quickAccess1`);
        const quickAccess2Slot = document.createElement(`div`);
            this.charCreationCreateEquipmentSlot(quickAccess2Slot, char, `quickAccess2`);
        equipRight.append(amulet1Slot, amulet2Slot, quickAccess1Slot, quickAccess2Slot);

        const inventoryContainer = document.createElement(`div`);
        inventoryContainer.className = `inventoryContainer charCreation`;
        this.charCreationStatsPreview.appendChild(inventoryContainer);
        this.charCreationGenerateInventory(inventoryContainer, char); // ! Here I will eventually want to replace the first param with something like -   char.invSpace   -.
    },
    endIntro: function () { // * Ends the intro and takes player to charCreation screen.
        DOM.isIntroActive = false;
        const intro = document.querySelector(`.intro`);
        intro.remove();
        clearTimeout(DOM.introTimeout);
        DOM.introTimeout = null;
        DOM.introAudio.pause();
        DOM.introAudio.currentTime = 0;
        DOM.charCreationMasterContainer.style.display = `flex`; // * Shows charCreation screen

        DOM.charCreationCharData.race = allRaces[0]; // ! IDK why I have to define these even though I already do it on the definition of the DOM object above...
        DOM.charCreationCharData.background = allBackgrounds[0];
        DOM.charCreationCharData.talent1 = allTalents[0];
        DOM.charCreationCharData.talent2 = allTalents[0];

        characterCreator(DOM.charCreationCharData.name, DOM.charCreationCharData.race, DOM.charCreationCharData.talent1, DOM.charCreationCharData.talent2, PCs, DOM.charCreationCharData.icon);
        DOM.updateCharCreationStatsPreview();
    },
    endCharCreation: function () {
        DOM.charCreationMasterContainer.style.display = `none`; // * Hides charCreation screen
    },
    createCharCreationChoices: function (choiceType, choiceTypeString) {
            DOM.charCreationChoices.innerHTML = ``;
            choiceType.forEach((ele) => {
                if(ele == DOM.charCreationCharData.race || ele == DOM.charCreationCharData.background || ele == DOM.charCreationCharData.talent1 || ele == DOM.charCreationCharData.talent2) {
                    return;
                }
                let x = document.createElement(`button`);
                x.className = `charCreation choice`;
                x.dataset.index = ele.index;
                x.dataset.choiceType = choiceTypeString;
                x.textContent = ele.name;
                DOM.charCreationChoices.append(x);
            })
    },
    updateCharCreationChoices: function (type) {
        switch(type) {
            case `races`:
                DOM.createCharCreationChoices(allRaces, `race`);
            break;
            case `backgrounds`:
                DOM.createCharCreationChoices(allBackgrounds, `background`);
            break;
            case `talent1`:
                DOM.createCharCreationChoices(allTalents, `talent1`);
            break;
            case `talent2`:
                DOM.createCharCreationChoices(allTalents, `talent2`);
            break;
        }
    },
    updateCharCreationCharData: function (choiceType, index) {
        switch(choiceType) {
            case `race`:
                DOM.charCreationCharData.race = allRaces[index];
                console.log(`nut`)
                if(allRaces[index].name === `None`) {
                    console.log(`nut1`)
                    DOM.charCreationRaceBar.textContent = `Race`;
                } else {
                    DOM.charCreationRaceBar.textContent = `${allRaces[index].name}`;
                }
            break;
            case `background`:
                DOM.charCreationCharData.background = allBackgrounds[index];
                if(allBackgrounds[index].name === `None`) {
                    DOM.charCreationBackground.textContent = `Background`;
                } else {
                    DOM.charCreationBackground.textContent = `${allBackgrounds[index].name}`;
                }
            break;
            case `talent1`:
                DOM.charCreationCharData.talent1 = allTalents[index];
                if(allTalents[index].name === `None`) {
                    DOM.charCreationTalent1.textContent = `Talent 1`;
                } else {
                    DOM.charCreationTalent1.textContent = `${allTalents[index].name}`;
                }
            break;
            case `talent2`:
                DOM.charCreationCharData.talent2 = allTalents[index];
                if(allTalents[index].name === `None`) {
                    DOM.charCreationTalent2.textContent = `Talent 2`;
                } else {
                    DOM.charCreationTalent2.textContent = `${allTalents[index].name}`;
                }
            break;
        }
        PCs.charList.splice(0, 1);
        characterCreator(DOM.charCreationCharData.name, DOM.charCreationCharData.race, DOM.charCreationCharData.talent1, DOM.charCreationCharData.talent2, PCs, DOM.charCreationCharData.icon);
        DOM.updateCharCreationStatsPreview();
    },
    listenForClicks: function () {
        DOM.body.addEventListener(`click`, (e) => {
            // TODO: Write the scrolling text part first, then create the layout for the char creation screen, then it should take you to the game.
            if(DOM.isIntroActive) { // * Ability to skip the intro of the game by clicking.
                DOM.endIntro();
            }
            if(e.target.classList.contains(`charCreation`) && e.target.classList.contains(`choice`)) { 
                DOM.updateCharCreationCharData(e.target.dataset.choiceType, e.target.dataset.index);
                if(DOM.currentcharCreationChoiceSelection) {
                    DOM.currentcharCreationChoiceSelection.style.borderColor = `white`;
                }
                e.target.style.borderColor = `blue`;
                DOM.currentcharCreationChoiceSelection = e.target;
            }
            if(e.target.classList.contains(`charCreation`) && e.target.classList.contains(`raceBar`)) { 
                DOM.updateCharCreationChoices(`races`);
                if(DOM.currentcharCreationOptionSelection) {
                    DOM.currentcharCreationOptionSelection.style.borderColor = `white`;
                }
                e.target.style.borderColor = `blue`;
                DOM.currentcharCreationOptionSelection = e.target;
            }
            if(e.target.classList.contains(`charCreation`) && e.target.classList.contains(`background`)) { 
                DOM.updateCharCreationChoices(`backgrounds`);
                if(DOM.currentcharCreationOptionSelection) {
                    DOM.currentcharCreationOptionSelection.style.borderColor = `white`;
                }
                e.target.style.borderColor = `blue`;
                DOM.currentcharCreationOptionSelection = e.target;
            }
            if(e.target.classList.contains(`charCreation`) && e.target.classList.contains(`talent1`)) { 
                DOM.updateCharCreationChoices(`talent1`);
                if(DOM.currentcharCreationOptionSelection) {
                    DOM.currentcharCreationOptionSelection.style.borderColor = `white`;
                }
                e.target.style.borderColor = `blue`;
                DOM.currentcharCreationOptionSelection = e.target;
            }
            if(e.target.classList.contains(`charCreation`) && e.target.classList.contains(`talent2`)) { 
                DOM.updateCharCreationChoices(`talent2`);
                if(DOM.currentcharCreationOptionSelection) {
                    DOM.currentcharCreationOptionSelection.style.borderColor = `white`;
                }
                e.target.style.borderColor = `blue`;
                DOM.currentcharCreationOptionSelection = e.target;
            }
            if(e.target.classList.contains(`charCreation`) && e.target.classList.contains(`confirm`)) { 
                DOM.endCharCreation();
            }
            if(e.target.classList.contains(`audioButton`)) { // * Audio Mute/Unmute button
                DOM.mainMenuMusic.play();
                DOM.mainMenuMusic.loop = true;
                const audioButton = document.querySelector(`.audioButton`);
                if(audioButton.alt === `audioMuted`) {
                    audioButton.src = `./images/audioPlaying.png`;
                    audioButton.alt = `audioPlaying`;
                    DOM.mainMenuMusic.muted = false;
                } else {
                    audioButton.src = `./images/audioMuted.png`;
                    audioButton.alt = `audioMuted`;
                    DOM.mainMenuMusic.muted = true;
                }
            }
            if(e.target.classList.contains(`newGameButton`)) { // * New game Button
                DOM.isIntroActive = true;
                DOM.mainMenu.style.display = `none`;
                const intro = document.createElement(`div`);
                const introText = document.createElement(`div`);
                const skipText = document.createElement(`div`);
                intro.className = `intro`;
                introText.className = `introText`;
                skipText.className = `skipText`;
                introText.innerHTML = `You are one of the condemned.<br>
Cast like a shadow, into the depths.<br>
Your body aches, your head throbs, and your gut wrenches as you are thrown down by cosmic force.<br>
Falling through the vastness of space, time & experience.<br>
Visions are given to you which you cannot grasp.<br>
Falling into the flesh which you inhabit, you begin to <em>feel</em> it.. though you are not conscious.<br>
Cold, wet, filthy & exhausted you are, even in sleep.<br>
Still falling, you see the end, a <em>festering</em> puddle.<br>
It approaches quicker and quicker...<br>
A great <em>crash</em> awakes you violently.<br>
You look around at your dark cell.<br>
Beyond the damp iron bars, little can be seen.<br>
A puddle of water sits at your feet.<br>
You realize you had been startled awake by a splash in the puddle from a leak in the ceiling above.<br>
One candle on the wall lights your empty cell.<br>
Nothing else, no cot, no clothes, only you in the <em>dirt</em>.<br>
Were you only dreaming? It felt so.. vivid. Where are you?<br>
You sit up, and looking into the puddle at your feet you think you see yourself...<br>
<em>Who are you?</em><br>
`;
                skipText.textContent = `[ Press any button to skip... ]`;
                intro.append(skipText);
                intro.append(introText);
                DOM.body.append(intro);
                DOM.introTimeout = setTimeout( function() {DOM.endIntro()} , 126000);
                DOM.mainMenuMusic.pause();
                DOM.mainMenuMusic.currentTime = 0;
                DOM.introAudio.play();
            }
            if(e.target.classList.contains(`loadGameButton`)) {
                console.log(`2`)

            }
            if(e.target.classList.contains(`settingsGameButton`)) {
                console.log(`3`)

            }
            if(e.target.classList.contains(`endTurnButton`)) {
                turn.end();
            }
            if(e.target.className === `up` && this.casterSelectionState !== null) {
                if(this.casterSelectionState.row > 1) {
                    this.casterSelectionState.row -= 1;
                }
                this.update();
            }
            if(e.target.className === `down` && this.casterSelectionState !== null) {
                if(this.casterSelectionState.row < 3) {
                    this.casterSelectionState.row += 1;
                }
                this.update();
            }
            if(e.target.className === `ability`) {
                this.attemptAbilityCast(e.target);
            }
            if (e.target.className === `PC`) {
                this.selectCaster(e.target);
                this.updateTopBar();
                this.updateBotBar(this.casterSelectionState);
            } else if(e.target.classList.contains(`PCBarRow1,PCBarRow2,PCBarRow3`)) { // TODO: this is gonna be a problem
                this.deselectCaster();
                this.updateTopBar();
                this.updateBotBar(this.casterSelectionState);
            }
            if(e.target.className === `inventory`) {
                this.clearTabSelectionDisplay();
                this.selectedUtilDivisionTabState = `inventory`;
                this.selectedUtilDivisionTab = e.target;
                this.updateUtilDivisionDisplay();
                this.updateTabSelectionDisplay();
            }
            if(e.target.className === `charInfo`) {
                this.clearTabSelectionDisplay();
                this.selectedUtilDivisionTabState = `charInfo`;
                this.selectedUtilDivisionTab = e.target;
                this.updateUtilDivisionDisplay();
                this.updateTabSelectionDisplay();
            }
            if(e.target.className === `party`) {
                this.clearTabSelectionDisplay();
                this.selectedUtilDivisionTabState = `party`;
                this.selectedUtilDivisionTab = e.target;
                this.updateUtilDivisionDisplay();
                this.updateTabSelectionDisplay();
            } 
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
            if( (e.target.classList.contains(`inventoryItem`) || e.target.classList.contains(`equipmentItem`) || e.target.classList.contains(`ability`) || e.target.classList.contains(`utilDivisionAbility`)) && !(e.target.dataset.itemType === `item` && e.target.dataset.itemIndex === `0`) ) {
                this.clearTooltips();
                this.timeout = setTimeout( function() {DOM.displayItemTooltip(e.target)} , 500);
            } else if (!e.target.classList.contains(`tooltip`) && !e.target.classList.contains(`tooltipContent`)) {
                this.clearTooltips();
            }
        });
    },
    formatDamageDiceToText: function (damageDice) { // * Input will look like:   [[0, 1, 4],[1, 2, 6]]   : this would mean 1d4 Flat & 2d6 Piercing.
        let outputText = ``;
        for(let i = 0; i < damageDice.length; i++) {
            outputText += `${damageDice[i][1]}d${damageDice[i][2]} ${logicLib.getResistTypeNameFromIndexNumber(damageDice[i][0])}`;
            if(i < damageDice.length - 1) {
                outputText += ` & `;
            }
        }
        return outputText; 
    },
    displayItemTooltip: function (target) {
        let tooltips = document.getElementsByClassName(`tooltip`);
        if(tooltips.length > 0) {
            return;
        }
        const x = document.createElement(`div`);
        let item;
        let ability;
        let damageDiceDisplay;
        let resistsDisplay;

        if(target.classList.contains(`utilDivisionAbility`)) { //  * If hover is over an ability
            ability = allAbilities[target.dataset.abilityIndex];
            x.className = `tooltip`;
            x.innerHTML = `
                        <div class="tooltipContent">${ability.name}:</div>
                        <div class="tooltipContent">-</div>
                        <div class="tooltipContent">AP: ${ability.APCost}</div>
                        <div class="tooltipContent">Type: ${ability.typeDesc}</div>
                        <div class="tooltipContent">Target: ${ability.targetDesc}</div>
                        <div class="tooltipContent">${ability.desc}</div>`;
        }
        if(target.classList.contains(`ability`)) { //  * If hover is over an ability
            ability = allAbilities[target.dataset.abilityIndex];
            x.className = `tooltip hotBarTooltip`;
            x.innerHTML = `
                        <div class="tooltipContent hotBarTooltipContent">${ability.name}:</div>
                        <div class="tooltipContent hotBarTooltipContent">-</div>
                        <div class="tooltipContent hotBarTooltipContent">AP: ${ability.APCost}</div>
                        <div class="tooltipContent hotBarTooltipContent">Type: ${ability.typeDesc}</div>
                        <div class="tooltipContent hotBarTooltipContent">Target: ${ability.targetDesc}</div>
                        <div class="tooltipContent hotBarTooltipContent">${ability.desc}</div>`;
        }

        if(target.dataset) {
            switch(target.dataset.itemType) {
                case `weapon`:
                    item = allWeapons[target.dataset.itemIndex];
                    damageDiceDisplay = DOM.formatDamageDiceToText(item.damage); 
                    x.className = `tooltip`;
                    x.innerHTML = `
                                <div class="tooltipContent">${item.name}:</div>
                                <div class="tooltipContent">-</div>
                                <div class="tooltipContent">Damage: ${damageDiceDisplay}</div>`;
                break;
                case `armor`:
                    item = allArmors[target.dataset.itemIndex];
                    resistsDisplay = DOM.formatResistArrayToText(item.resists); 
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
    formatResistArrayToText: function (resistArray) { // * input will look like the following:       resists: [0,0,-5,-5,-5,-5,-5,-5,-5], output will exclude resists that are 0.
        let resistNames = [`Flat`, `Piercing`, `Ice`,`Fire`,`Corrosive`,`Poison`,`Spiritual`,`Lightning`,`Arcane`];
        let outputText = ``;
        for(let i = 0; i < 9; i++) {
            if(resistArray[i] !== 0) {
                resistNames[i] += ` : ${resistArray[i]}`;
                outputText += `${resistNames[i]}<br>`
            }    
        }
        return outputText;
    },
    attemptAbilityCast: function (target) {
        const abilityDatasetIndex = target.dataset.abilityIndex;
        if ((this.casterSelectionState && this.targetSelectionState) !== null) {
            this.casterSelectionState.useAbility(abilityDatasetIndex, this.targetSelectionState)
        } else {
            console.log(`invalid targets`);
        }
        this.update();
        this.updateTopBar();
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
            this.createHotBar(this.casterSelectionState);
        } else if (!selectedPC) {
            this.abilityListContainer.innerHTML = ``;
            this.createHotBar(this.casterSelectionState);
        }
    },
    createHotBar: function (char) {
        if(!char) { // * sets hotbar/botbar back to a bunch of blanks.
            for (let i = 0; i < 36; i++) {
                const x = document.createElement(`div`);
                x.className = `ability`;
                x.dataset.hotBarIndex = i;
                x.style.backgroundImage = allAbilities[0].icon;
                x.style.backgroundRepeat = `no-repeat`;
                x.style.backgroundSize = `100%`;
                this.abilityListContainer.append(x); 
            }
            return;
        } else { // * Generates the hotbar when a character is selected.
            for (let i = 0; i < char.hotBar.length; i++) {
                const x = document.createElement(`div`);
                x.className = `ability`;
                x.dataset.hotBarIndex = i; 
                x.dataset.abilityIndex = char.hotBar[i];
                x.style.backgroundImage = allAbilities[char.hotBar[i]].icon;
                x.style.backgroundRepeat = `no-repeat`;
                x.style.backgroundSize = `100%`;
                if(char.hotBar[i] !== 0) {
                    x.draggable = true;
                }
                this.abilityListContainer.append(x);
            } 
        }
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
        this.updateBotBar();
        this.updateUtilDivisionDisplay();
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
    forceHPtoZero: function (char) {
        if (char.hp < 0) {
            char.hp = 0;
        }
    },
    createChar: function (char, charListIndex) {
        const i = document.createElement(`div`);
        i.className = `${char.groupName}`;
        i.id = `index${charListIndex}`;
        i.dataset.groupIndex = charListIndex;
        i.style.backgroundImage = char.icon;
        i.style.backgroundRepeat = `no-repeat`;
        i.style.backgroundSize = `100%`;
        i.style.textShadow = `1px 1px 10px black, 1px 1px 10px black, 1px 1px 10px black, 1px 1px 10px black`;
        i.style.fontSize = `17px`;
        i.style.display = `flex`;
        i.style.flexDirection = `column`;
        i.style.justifyContent = `space-between`;
        DOM.forceHPtoZero(char);
        if (char.hp === 0) {
            i.style.borderColor = `rgb(50,50,50)`;
            i.innerHTML = `<div class="name">${char.name}</div>
                           <div class="HP">HP: ${char.hp} (Dead)</div>`;
            i.style.opacity = `65%`;
        } else {
            i.innerHTML = `<div class="name">${char.name}</div>
                           <div class="HP">HP: ${char.hp}</div>`;
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
            if(e.target.classList.contains(`inventoryItem`) || e.target.classList.contains(`equipmentItem`) || e.target.classList.contains(`ability`)) {
                e.preventDefault();
            }
            if(this.dragTarget.classList.contains(`ability`)) {
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


                // ! The block of code below is for abilities to and around the hotBar, not for items.
                case `utilDivisionAbility`: // ***** If drag is from utilDivision Ability list
                    switch(dropTarget.classList[0]) {
                        case `ability`: // *** If drop is to hotBar
                            char.hotBar[dropTarget.dataset.hotBarIndex] = +this.dragTarget.dataset.abilityIndex;
                        break;
                    }
                break;
                case `ability`: // ***** If drag is from the hotbar
                    switch(dropTarget.classList[0]) {
                        case `ability`: // *** If drop is to hotBar
                            char.hotBar[dropTarget.dataset.hotBarIndex] = +this.dragTarget.dataset.abilityIndex;
                            char.hotBar[this.dragTarget.dataset.hotBarIndex] = 0;
                        break;
                            default:
                            char.hotBar[this.dragTarget.dataset.hotBarIndex] = 0;
                    }
                break;



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
                                DOM.updateCharStats(char, `add`, dragTargetCharData);
                                // do the swap and add stats
                            } else { // ! If drop contains item
                                char.inventory[this.dragTarget.dataset.inventoryIndex] = dropTargetCharData;
                                char.equipment[dropTarget.dataset.equipmentSlotName] = tempStorage;
                                DOM.updateCharStats(char, `add`, dragTargetCharData);
                                DOM.updateCharStats(char, `remove`, dropTargetCharData);
                                // do the swap and add drag stats, subtract drop stats
                            }

                        break;
                    }
                break;
                case `equipmentItem` : // ***** If drag is from equipment
                    switch(dropTarget.classList[0]) {
                        case `inventoryItem`: // *** If drop is to inventory

                            if(dropTargetCharData.isDefaultItem) { // ! If drop is empty
                                DOM.putDefaultItemInPlaceOfDrag(char, dragTargetCharData, this.dragTarget)
                                char.inventory[dropTarget.dataset.inventoryIndex] = tempStorage;
                                DOM.updateCharStats(char, `remove`, dragTargetCharData);
                                // do the swap and remove drag stats
                            } else { // ! If drop contains item
                                char.equipment[this.dragTarget.dataset.equipmentSlotName] = dropTargetCharData;
                                char.inventory[dropTarget.dataset.inventoryIndex] = tempStorage;
                                DOM.updateCharStats(char, `remove`, dragTargetCharData);
                                DOM.updateCharStats(char, `add`, dropTargetCharData);
                                // do the swap and remove drag stats, add drop stats
                            }

                        break; 
                        case `equipmentItem`: // *** If drop is to equipment

                            if(dropTargetCharData.isDefaultItem) { // ! If drop is empty
                                DOM.putDefaultItemInPlaceOfDrag(char, dragTargetCharData, this.dragTarget)
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
            this.updateBotBar();
            this.updateUtilDivisionDisplay();
            this.dragTarget = null;
        }) 
    },
    getFirstEmptyInventorySlot: function (char) { // * returns a number representing the first empty inventory index.
        for(let i = 0; i < char.inventory.length; i++) {
            if(char.inventory[i].isDefaultItem) {
                return i;
            }
        }
        return false;
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
                        dropTargetCharData = char.inventory[DOM.getFirstEmptyInventorySlot(char)];
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
                            DOM.updateCharStats(char, `add`, dragTargetCharData);
                            // do the swap and add stats
                        } else { // ! If drop contains item
                            char.inventory[dragTarget.dataset.inventoryIndex] = dropTargetCharData;
                            char.equipment[dragTargetCharData.itemEquipType[0]] = tempStorage;
                            DOM.updateCharStats(char, `add`, dragTargetCharData);
                            DOM.updateCharStats(char, `remove`, dropTargetCharData);
                            // do the swap and add drag stats, subtract drop stats
                        }
                    break;
                    case `equipmentItem` : // ***** If drag is from equipment
                        DOM.putDefaultItemInPlaceOfDrag(char, dragTargetCharData, dragTarget)
                        char.inventory[DOM.getFirstEmptyInventorySlot(char)] = dragTargetCharData;
                        DOM.updateCharStats(char, `remove`, dragTargetCharData);
                        // do the swap and remove drag stats
                    break;
                }
            }
            this.updateUtilDivisionDisplay();
        })
    },
    updateCharStats: function (char, addOrRemove, item) { 
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
    },
    putDefaultItemInPlaceOfDrag: function(char, dragTargetCharData, dragTarget) {
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
    },
    updateUtilDivisionDisplay: function () { // * is called when you select a different char or tab.
        switch(this.selectedUtilDivisionTabState) {
            case `inventory`:
                this.utilDivisionDisplay.innerHTML = `Equipment:`;
                if (this.casterSelectionState) {
                    this.createUtilDivisionDisplay(this.casterSelectionState);
                }
            break;
            case `charInfo`:
                this.utilDivisionDisplay.innerHTML = `Character Info:`;
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
    charCreationGenerateInventory: function (inventoryContainer, char) { 
        for (let i = 0; i < char.inventory.length; i++) {
            const x = document.createElement(`div`);
            if(char.inventory[i]) {
                x.className = `charCreation inventoryItem`;
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
    charCreationCreateEquipmentSlot: function (ele, char, slotName) {
        ele.className = `equipmentItem ${slotName} charCreation`;
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
    createUtilDivisionDisplay: function (char) { // * Holds most of the logic for the DOM structure of the UtilDivisionDisplay
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

                    const statsDisplayLeft = document.createElement(`div`);
                    statsDisplayLeft.className = `statsDisplayLeft`;

                        const strengthDisplay = document.createElement(`div`);
                        strengthDisplay.textContent = `STR: ${char.stats.strength}`;

                        const dexterityDisplay = document.createElement(`div`);
                        dexterityDisplay.textContent = `DEX: ${char.stats.dexterity}`;

                        const willpowerDisplay = document.createElement(`div`);
                        willpowerDisplay.textContent = `WIL: ${char.stats.willpower}`;

                        const vitalityDisplay = document.createElement(`div`);
                        vitalityDisplay.textContent = `VIT: ${char.stats.vitality}`;

                        const divider1 = document.createElement(`div`);
                        divider1.textContent = `-`;

                        const parryDisplay = document.createElement(`div`);
                        parryDisplay.textContent = `PARRY: ${char.parry}`;

                        const dodgeDisplay = document.createElement(`div`);
                        dodgeDisplay.textContent = `DODGE: ${char.dodge}`;

                        const divider3 = document.createElement(`div`);
                        divider3.textContent = `-`;

                        const flatResistDisplay = document.createElement(`div`);
                        flatResistDisplay.textContent = `FLAT R: ${char.resistsArray[0]}`;

                        const iceResistDisplay = document.createElement(`div`);
                        iceResistDisplay.textContent = `ICE R: ${char.resistsArray[2]}`;

                        const corrosiveResistDisplay = document.createElement(`div`);
                        corrosiveResistDisplay.textContent = `CORRO. R: ${char.resistsArray[4]}`;

                        const spiritualResistDisplay = document.createElement(`div`);
                        spiritualResistDisplay.textContent = `SPIRIT R: ${char.resistsArray[6]}`;

                        const arcaneResistDisplay = document.createElement(`div`);
                        arcaneResistDisplay.textContent = `ARCANE R: ${char.resistsArray[8]}`;
                        
                        statsDisplayLeft.append(strengthDisplay, dexterityDisplay, willpowerDisplay, vitalityDisplay, divider1, parryDisplay, dodgeDisplay, divider3, flatResistDisplay, iceResistDisplay, corrosiveResistDisplay, spiritualResistDisplay, arcaneResistDisplay);

                    const statsDisplayRight = document.createElement(`div`);
                    statsDisplayRight.className = `statsDisplayRight`;

                        const agilityDisplay = document.createElement(`div`);
                        agilityDisplay.textContent = `AGI: ${char.stats.agility}`;

                        const initiativeDisplay = document.createElement(`div`);
                        initiativeDisplay.textContent = `INI: ${char.stats.initiative}`;

                        const intelligenceDisplay = document.createElement(`div`);
                        intelligenceDisplay.textContent = `INT: ${char.stats.intelligence}`;

                        const charismaDisplay = document.createElement(`div`);
                        charismaDisplay.textContent = `CHA: ${char.stats.charisma}`;

                        const divider2 = document.createElement(`div`);
                        divider2.textContent = `-`;

                        const disruptDisplay = document.createElement(`div`);
                        disruptDisplay.textContent = `DISRUPT: ${char.disrupt}`;

                        const blockDisplay = document.createElement(`div`);
                        blockDisplay.textContent = `BLOCK: ${char.block}`;

                        const divider4 = document.createElement(`div`);
                        divider4.textContent = `-`;

                        const piercingResistDisplay = document.createElement(`div`);
                        piercingResistDisplay.textContent = `PIERCE R: ${char.resistsArray[1]}`;

                        const fireResistDisplay = document.createElement(`div`);
                        fireResistDisplay.textContent = `FIRE R: ${char.resistsArray[3]}`;

                        const poisonResistDisplay = document.createElement(`div`);
                        poisonResistDisplay.textContent = `POISON R: ${char.resistsArray[5]}`;

                        const lightningResistDisplay = document.createElement(`div`);
                        lightningResistDisplay.textContent = `LIGHTN. R: ${char.resistsArray[7]}`;
                        
                        statsDisplayRight.append( agilityDisplay, initiativeDisplay, intelligenceDisplay, charismaDisplay, divider2, disruptDisplay, blockDisplay, divider4, piercingResistDisplay, fireResistDisplay, poisonResistDisplay, lightningResistDisplay);

                statsDisplay.append(statsDisplayLeft, statsDisplayRight);

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
            case `charInfo`:
                const charInfoLevelDisplay = document.createElement(`div`);
                charInfoLevelDisplay.className = `charInfoLevelDisplay`;
                charInfoLevelDisplay.textContent = `Level: ${char.level}`;
                this.utilDivisionDisplay.append(charInfoLevelDisplay);

                const charInfoRaceDisplay = document.createElement(`div`);
                charInfoRaceDisplay.className = `charInfoRaceDisplay`;
                charInfoRaceDisplay.textContent = `Race: ${char.raceName}`;
                this.utilDivisionDisplay.append(charInfoRaceDisplay);

                const charInfoBackgroundDisplay = document.createElement(`div`);
                charInfoBackgroundDisplay.className = `charInfoBackgroundDisplay`;
                charInfoBackgroundDisplay.textContent = `Background: -placeholder-`;
                this.utilDivisionDisplay.append(charInfoBackgroundDisplay);

                const charInfoTalent1Display = document.createElement(`div`);
                charInfoTalent1Display.className = `charInfoTalent1Display`;
                charInfoTalent1Display.textContent = `Talent 1: ${char.talent1Name}`;
                this.utilDivisionDisplay.append(charInfoTalent1Display);

                const charInfoTalent2Display = document.createElement(`div`);
                charInfoTalent2Display.className = `charInfoTalent2Display`;
                charInfoTalent2Display.textContent = `Talent 2: ${char.talent2Name}`;
                this.utilDivisionDisplay.append(charInfoTalent2Display);

                for (let i = 0; i < (Object.keys(this.casterSelectionState.abilities).length); i++) {
                    const x = document.createElement(`div`);
                    x.className = `utilDivisionAbility`;
                    x.style.backgroundImage = allAbilities[char.abilities[i]].icon;
                    x.dataset.abilityIndex = allAbilities[char.abilities[i]].index;
                    x.style.backgroundRepeat = `no-repeat`;
                    x.style.backgroundSize = `100%`;
                    x.draggable = true;
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
            case `charInfo`:
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
            case `charInfo`:
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
    startDOM: function () { // Runs all of the nessesary DOM functions.
        DOM.update();
        DOM.listenForClicks();
        DOM.listenForTargetSelection();
        DOM.listenForMouseOver();
        DOM.listenForDrag();
        DOM.listenForDragover();
        DOM.listenForDrop();
        DOM.listenForRightClickEquip();
        DOM.selectedUtilDivisionTab = DOM.inventoryTab;
        DOM.updateUtilDivisionDisplay();
        DOM.updateTabSelectionDisplay();
        DOM.updateBotBar();
    },
};

/* #endregion DOM*/

defineAllLists();

// characterCreator(`Stroick`, allRaces[1], allTalents[4], allTalents[6], PCs, `url("./images/stroick.jpg")`);
// characterCreator(`Kliftin`, allRaces[2], allTalents[3], allTalents[7], PCs, `url("./images/kliftin.jpg")`);
// characterCreator(`Dahmer Hobo`, allRaces[4], allTalents[7], allTalents[8], NPCs, `url("./images/dahmerHobo.jpg")`);
// characterCreator(`Evil`, allRaces[3], allTalents[5], allTalents[6], NPCs, `url("./images/evil.jpg")`);

// const stroick = PCs.charList[0];
// const evil = NPCs.charList[1];
// const kliftin = PCs.charList[1];
// const hobo = NPCs.charList[0];

// stroick.inventory[0] = allWeapons[2];
// stroick.inventory[1] = allArmors[8];
// stroick.inventory[2] = allArmors[9];

DOM.startDOM();

// console.log(stroick);