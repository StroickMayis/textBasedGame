import {allAbilities} from './jsLists/allAbilites.js';
import {allArmors} from './jsLists/allArmors.js';
import {allBackgrounds} from './jsLists/allBackgrounds.js';
import {allFeats} from './jsLists/allFeats.js';
import {allItems} from './jsLists/allItems.js';
import {allRaces} from './jsLists/allRaces.js';
import {allTalents} from './jsLists/allTalents.js';
import {allWeapons} from './jsLists/allWeapons.js';
import {char as charJS} from './char.js';
import {logicLib} from './logicLib.js';
import {turn} from './turn.js';

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
    charCreationNameInput: document.querySelector(`.charCreation.charNameInput`),
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
    jailAmbienceAudio: new Audio(`./audio/jailAmbienceAudio.mp3`),
    isPlayerDoneCreatingChar: false,
    currentcharCreationOptionSelection: null,
    currentcharCreationChoiceSelection: null,
    hasPlayerInteractedWithMainMenu: false,
    charCreationCharData: {
        name: ``,
        icon: `url("./images/kliftin.jpg")`,
        race: allRaces[0],
        background: allBackgrounds[0],
        talent1: allTalents[0],
        talent2: allTalents[0],
    },

    updateCharCreationStatsPreview: function () {
        let char = charJS.group.PCs.charList[0];

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

        charJS.characterCreator(DOM.charCreationCharData.name, DOM.charCreationCharData.race, DOM.charCreationCharData.talent1, DOM.charCreationCharData.talent2, charJS.group.PCs, DOM.charCreationCharData.icon);
        DOM.updateCharCreationStatsPreview();
        DOM.jailAmbienceAudio.play();
    },
    endCharCreation: function () {
        function charIsValid () {
            if(DOM.charCreationCharData.name !== `` && DOM.charCreationCharData.race !== allRaces[0] && DOM.charCreationCharData.talent1 !== allTalents[0] && DOM.charCreationCharData.talent2 !== allTalents[0]) {
                return true;
            } else {
                return false;
            }
        }
        DOM.charCreationCharData.name = DOM.charCreationNameInput.value;
        if(charIsValid()) {
            charJS.group.PCs.charList.splice(0, 1);
            charJS.characterCreator(DOM.charCreationCharData.name, DOM.charCreationCharData.race, DOM.charCreationCharData.talent1, DOM.charCreationCharData.talent2, charJS.group.PCs, DOM.charCreationCharData.icon);
            DOM.charCreationMasterContainer.style.display = `none`;
            DOM.update(charJS.group.PCs, charJS.group.NPCs);
        } else {
            console.log(`Character is Invalid`);
        }
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
                if(allRaces[index].name === `None`) {
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
        DOM.charCreationCharData.name = DOM.charCreationNameInput.value;
        charJS.group.PCs.charList.splice(0, 1);
        charJS.characterCreator(DOM.charCreationCharData.name, DOM.charCreationCharData.race, DOM.charCreationCharData.talent1, DOM.charCreationCharData.talent2, charJS.group.PCs, DOM.charCreationCharData.icon);
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
            if(!DOM.hasPlayerInteractedWithMainMenu && (e.target.classList.contains(`mainMenu`) || e.target.classList.contains(`mainMenuLogo`) || e.target.classList.contains(`loadGameButton`) || e.target.classList.contains(`settingsGameButton`))) { // * This unmutes the mainMenu music only once if you click anywhere else than NEWGAME.
                DOM.mainMenuMusic.play();
                DOM.mainMenuMusic.loop = true;
                const audioButton = document.querySelector(`.audioButton`);
                if(audioButton.alt === `audioMuted`) {
                    audioButton.src = `./images/audioPlaying.png`;
                    audioButton.alt = `audioPlaying`;
                    DOM.mainMenuMusic.muted = false;
                }
                DOM.hasPlayerInteractedWithMainMenu = true;
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
                this.update(charJS.group.PCs, charJS.group.NPCs);
            }
            if(e.target.className === `down` && this.casterSelectionState !== null) {
                if(this.casterSelectionState.row < 3) {
                    this.casterSelectionState.row += 1;
                }
                this.update(charJS.group.PCs, charJS.group.NPCs);
            }
            if(e.target.className === `ability`) {
                this.attemptAbilityCast(e.target);
            }
            if (e.target.className === `PC`) {
                this.selectCaster(e.target);
                this.updateTopBar();
                this.updateBotBar(this.casterSelectionState);
            } else if(e.target.classList.contains(`PCBarRow1`) || e.target.classList.contains(`PCBarRow2`) || e.target.classList.contains(`PCBarRow3`)) { 
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
        this.update(charJS.group.PCs, charJS.group.NPCs);
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
        this.casterSelectionState = charJS.group.PCs.charList[targetGroupIndex];
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
            this.targetSelectionState = charJS.group.NPCs.charList[targetGroupIndex];
            target.style.borderColor = `red`;
        };
        if (targetGroup === `PC`) {
            this.targetSelectionState = charJS.group.PCs.charList[targetGroupIndex];
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
    update: function (PCs, NPCs) {
        this.NPCBarRow3.innerHTML = ``;
        this.NPCBarRow2.innerHTML = ``;
        this.NPCBarRow1.innerHTML = ``;
        this.PCBarRow1.innerHTML = ``;
        this.PCBarRow2.innerHTML = ``;
        this.PCBarRow3.innerHTML = ``;
        for (let i = (PCs.charList.length - 1); i >= 0; i--) {
            this.createChar(PCs.charList[i], i) // ! DOM should not directly access the PC charlist, but should interact with a function (maybe on pccharlist object) to get the pcs by reference.
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
    startDOM: function (PCs, NPCs) { // Runs all of the nessesary DOM functions.
        DOM.update(charJS.group.PCs, charJS.group.NPCs);
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

export { DOM } ;