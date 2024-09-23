const logicLib = {

    getResistTypeNameFromIndexNumber: function (typeNumber) {
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
    },
    isTargetDead: function (target) {
        if (target.hp < 1) {
            console.log(`Target is dead.`)
            return true
        }
    },
    isAttackingAllies: function (caster, target) {
        if (caster.groupName === `PC` && target.groupName === `PC`) {
            console.log(`Don't attack your allies!`);
            return true
        }
        if (caster.groupName === `NPC` && target.groupName === `NPC`) {
            return true
        }
        return false;
    },
    isHealingEnemies: function (caster, target) {
        if (caster.groupName === `PC` && target.groupName === `NPC`) {
            console.log(`Don't heal the enemy!`);
            return true
        }
        if (caster.groupName === `NPC` && target.groupName === `PC`) {
            return true
        }
        return false;
    },
    isBuffingEnemies: function (caster, target) {
        if (caster.groupName === `PC` && target.groupName === `NPC`) {
            console.log(`Don't buff the enemy!`);
            return true
        }
        if (caster.groupName === `NPC` && target.groupName === `PC`) {
            return true
        }
        return false;
    },
    isHealingDeadTarget: function (target, abilityName) {
        if (target.hp < 1) {
            console.log(`${abilityName} is not powerful enough to ressurect ${target.name}.`)
            return true
        }
    },
    isTargetInRangeOfCaster: function (caster, target, abilityRange) {
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
        
    },
}

export {logicLib};
