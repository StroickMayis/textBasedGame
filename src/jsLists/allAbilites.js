import { logicLib } from "../logicLib.js";
import { turn } from "../turn.js";
import { effect } from "../effect.js";
import { combatLog } from "../combatLog.js";


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
};

defineAllAbilities();

export { allAbilities } ;