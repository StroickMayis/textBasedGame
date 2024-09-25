import {combatLog} from './combatLog.js';
import {logicLib} from './logicLib.js';
import {DOM} from './dom.js';
import {allAbilities} from './jsLists/allAbilites.js';
import {allArmors} from './jsLists/allArmors.js';
import {allBackgrounds} from './jsLists/allBackgrounds.js';
import {allFeats} from './jsLists/allFeats.js';
import {allItems} from './jsLists/allItems.js';
import {allRaces} from './jsLists/allRaces.js';
import {allTalents} from './jsLists/allTalents.js';
import {allWeapons} from './jsLists/allWeapons.js';
import {char} from './char.js';
import {effect} from './effect.js';
import "./styles/index.css"; 
import "./styles/intro.css"; 
import "./styles/charCreation.css"; 
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
import "./audio/jailAmbienceAudio.mp3";

"use strict";

// TODO: Must make ID's for everything, to make them easier to handle.
// TODO: I am copying data too much, all characters should REFERENCE ability data etc, this will make it easier to code and should improve performance.
// TODO: Need to do full ability and attack logic rewrite, to make it easier to work with, need to make it super ultra modular.
// TODO: Eventually make tooltips for absolutely everything, tooltips within tooltips. Want to make tooltips for stats that break down where they all came from.
// TODO: important dialogues should literally be html dialogues/modals.
// TODO: add some local storage to the game.
// TODO: Composition over inheritance for abilities.

// char.characterCreator(`Stroick`, allRaces[1], allTalents[4], allTalents[6], char.group.PCs, `url("./images/stroick.jpg")`);
// char.characterCreator(`Kliftin`, allRaces[2], allTalents[3], allTalents[7], char.group.PCs, `url("./images/kliftin.jpg")`);
// char.characterCreator(`Dahmer Hobo`, allRaces[4], allTalents[7], allTalents[8], char.group.NPCs, `url("./images/dahmerHobo.jpg")`);
char.characterCreator(`Evil`, allRaces[3], allTalents[5], allTalents[6], char.group.NPCs, `url("./images/evil.jpg")`);

// const stroick = char.group.PCs.charList[0];
// const evil = char.group.NPCs.charList[1];
// const kliftin = char.group.PCs.charList[2];
const hobo = char.group.NPCs.charList[0];

// stroick.inventory[0] = allWeapons[2];
// stroick.inventory[1] = allArmors[8];
// stroick.inventory[2] = allArmors[9];

DOM.startDOM(char.group.PCs, char.group.NPCs);

console.log(char.group.PCs);