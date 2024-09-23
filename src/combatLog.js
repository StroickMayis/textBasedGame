import { logicLib } from "./logicLib.js";

const combatLog = {

    createRollOutcomeString: function (rollOutcomeString) {
      // before the string is implied something along the lines of "rolls :"
      let output = ``;
      for(let i = 0; i < rollOutcomeString.length; i++) {
          output += rollOutcomeString[i];
          if(i + 1 !== rollOutcomeString.length)
          output += ` + `;
      }
      return output;
    },
    critHit: function (caster, target, damage) {
        console.log(`            - ${caster.name} -->  CRITICALLY HITS!!! --> ${target.name} -
            ▼             - ROLLS -            ▼`);
        combatLog.displayDamageRollsByResist(damage);
        console.log(`            ▼         - DAMAGE TOTALS (2X)-        ▼`)
    },
    attackAttempt: function (caster, target, attackRoll, defendRoll, attackBonus, defendBonus, ability, attackRollAdvantages, defendRollAdvantages) {
        const attack = attackRoll + attackBonus;
        const defend = defendRoll + defendBonus;
        let logModForAttackAdvantage = [``,``];
        let logModForDefendAdvantage = [``,``];
        if(attackRollAdvantages > 0) {
            logModForAttackAdvantage = [`${attackRollAdvantages} Advantage `, `'s`];
        }
        if(defendRollAdvantages > 0) {
            logModForDefendAdvantage = [`${defendRollAdvantages} Advantage `, `'s`];
        }
        if(attackRollAdvantages < 0) {
            logModForAttackAdvantage = [`${attackRollAdvantages * -1} Disadvantage `, `'s`];
        }
        if(defendRollAdvantages < 0) {
            logModForDefendAdvantage = [`${defendRollAdvantages * -1} Disadvantage `, `'s`];
        }
        console.log(`${caster.name} attacks --> ${target.name} 
            - Weapon: ${caster.equipment.mainHand.name} - Ability: ${ability.name} - 
            - ${logModForAttackAdvantage[0]}Attack Roll${logModForAttackAdvantage[1]} : ${attackRoll} + Bonus : ${attackBonus} -
            - ${logModForDefendAdvantage[0]}Defend Roll${logModForDefendAdvantage[1]} : ${defendRoll} + Bonus : ${defendBonus} -
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
                            console.log(`            Flat damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[0])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Flat damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[0])}`);
                        }
                    break;
                    case 1:
                        if(damageBonus[0] === i) {
                            console.log(`            Piercing damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[1])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Piercing damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[1])}`);
                        }
                    break;
                    case 2:
                        if(damageBonus[0] === i) {
                            console.log(`            Ice damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[2])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Ice damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[2])}`);
                        }
                    break;
                    case 3:
                        if(damageBonus[0] === i) {
                            console.log(`            Fire damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[3])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Fire damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[3])}`);
                        }
                    break;
                    case 4:
                        if(damageBonus[0] === i) {
                            console.log(`            Corrosive damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[4])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Corrosive damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[4])}`);
                        }
                    break;
                    case 5:
                        if(damageBonus[0] === i) {
                            console.log(`            Poison damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[5])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Poison damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[5])}`);
                        }
                    break;
                    case 6:
                        if(damageBonus[0] === i) {
                            console.log(`            Spiritual damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[6])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Spiritual damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[6])}`);
                        }
                    break;
                    case 7:
                        if(damageBonus[0] === i) {
                            console.log(`            Lightning damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[7])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Lightning damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[7])}`);
                        }
                    break;
                    case 8:
                        if(damageBonus[0] === i) {
                            console.log(`            Arcane damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[8])} + a bonus of ${damageBonus[1]}.`);
                        } else {
                            console.log(`            Arcane damage rolls: ${combatLog.createRollOutcomeString(resistanceSortArr[8])}`);
                        }
                    break;
                }
            }
        };
    },
    hit: function (caster, target, damage) {
        console.log(`            - ${caster.name} --> HITS --> ${target.name} -
            ▼             - ROLLS -            ▼`);
        combatLog.displayDamageRollsByResist(damage);
        console.log(`            ▼         - DAMAGE TOTALS -        ▼`)
    },
    damageResist: function (typeNumber, damage, resist, damageSum, caster, target, guardState) {
        const resistTypeName = logicLib.getResistTypeNameFromIndexNumber(typeNumber); // * Converts the index-style number of a resist ex. 0 = flat, into its name for console display.
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
        let damageDisplayArray = combatLog.damageDisplay(damage); // * damageDisplayArray is an array with the index[0]
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
    noAP: function (abilityName, abilityAPCost, currentAP) {
        console.log(`Not enough AP to cast ${abilityName}. Total AP: ${currentAP} - Ability Cost: ${abilityAPCost} `)
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

export {combatLog};