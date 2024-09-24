import {allAbilities} from './jsLists/allAbilites.js';
import {allArmors} from './jsLists/allArmors.js';
import {allBackgrounds} from './jsLists/allBackgrounds.js';
import {allFeats} from './jsLists/allFeats.js';
import {allItems} from './jsLists/allItems.js';
import {allRaces} from './jsLists/allRaces.js';
import {allTalents} from './jsLists/allTalents.js';
import {allWeapons} from './jsLists/allWeapons.js';
import {effect} from './effect.js';

const char = {
    Char: function (name, race) {
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
    },
    characterCreator: function (name, race, talent1, talent2, group, icon) {
        function createChar(name, race) {
            char.group.unassignedGroup.charList.push(new char.Char(name, race));
        }
        function addTalents(talent1, talent2) {
            // targetChar is always equal to the latest created character in the unnassignedGroup.charList array.
            const targetChar = char.group.unassignedGroup.charList[char.group.unassignedGroup.charList.length - 1];
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
            const targetChar = char.group.unassignedGroup.charList[char.group.unassignedGroup.charList.length - 1];
            targetChar.addEquipment(`armor`, allArmors[0]);
        }
        function addIcon(icon) {
            const targetChar = char.group.unassignedGroup.charList[char.group.unassignedGroup.charList.length - 1];
            targetChar.icon = icon;
        }
        function assignGroup(group) {
            const targetChar = char.group.unassignedGroup.charList[char.group.unassignedGroup.charList.length - 1];
            targetChar.groupName = group.name;
            group.charList.push(targetChar);
            char.group.unassignedGroup.charList.pop();
        }
        createChar(name, race);
        addTalents(talent1, talent2);
        addEquipment();
        addIcon(icon);
        assignGroup(group);
    },
    group: {
        PCs: { // Index 0 is always the main/player character
            name: `PC`,
            charList: [],
        },
        NPCs: {
            name: `NPC`,
            charList: [],
        },
        unassignedGroup: {
            name: `Unassigned`,
            charList: [],
        },
    }
}

export {char};