import { allAbilities } from "./jsLists/allAbilites.js";
import { combatLog } from "./combatLog.js";

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

export {effect};