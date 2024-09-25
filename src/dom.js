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
    selectors: {
        body: document.querySelector(`body`),
        mainMenu: {
            masterContainer: document.querySelector(`.mainMenu`),
            button: document.querySelectorAll(`.mainMenuButton`),
            newGameButton: document.querySelector(`.newGameButton`),
            loadGameButton: document.querySelector(`.loadGameButton`),
            settingsGameButton: document.querySelector(`.settingsGameButton`),
        },
        charCreation: {
            masterContainer: document.querySelector(`.charCreation.masterContainer`),
            statsPreview: document.querySelector(`.charCreation.statsPreview`),
            confirmButton: document.querySelector(`.charCreation.confirm`),
            choices: document.querySelector(`.charCreation.choices`),
            raceBar: document.querySelector(`.charCreation.raceBar`),
            background: document.querySelector(`.charCreation.background`),
            talent1: document.querySelector(`.charCreation.talent1`),
            talent2: document.querySelector(`.charCreation.talent2`),
            nameInput: document.querySelector(`.charCreation.charNameInput`),
        },
        chatDivision: {
            moveRowButtons: document.querySelector(`.moveRowButtons`),
        },
        gameDivision: {
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
        },
        utilDivision: {
            inventoryTab: document.querySelector(`.inventory`),
            tabs: document.querySelector(`.utilDivisionTabs`),
            display: document.querySelector(`.utilDivisionDisplay`),
            endTurnButton: document.querySelector(`.endTurnButton`),
        },   
    },

    // Below are all some kind of state/var.
    // TODO: Could modularize this too.

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
    charCreationCharData: {
        name: ``,
        icon: `url("./images/kliftin.jpg")`,
        race: allRaces[0],
        background: allBackgrounds[0],
        talent1: allTalents[0],
        talent2: allTalents[0],
    },

    // * Methods are listed in objects Below:
    listen: {
        click: function () {
            DOM.selectors.body.addEventListener(`click`, (e) => {
                if(DOM.isIntroActive) { // * Ability to skip the intro of the game by clicking.
                    DOM.charCreation.endIntro();
                }
                if(e.target.classList.contains(`charCreation`) && e.target.classList.contains(`choice`)) { 
                    DOM.charCreation.updateCharData(e.target.dataset.choiceType, e.target.dataset.index);
                    if(DOM.currentcharCreationChoiceSelection) {
                        DOM.currentcharCreationChoiceSelection.style.borderColor = `white`;
                    }
                    e.target.style.borderColor = `blue`;
                    DOM.currentcharCreationChoiceSelection = e.target;
                }
                if(e.target.classList.contains(`charCreation`) && e.target.classList.contains(`raceBar`)) { 
                    DOM.charCreation.updateChoices(`races`);
                    if(DOM.currentcharCreationOptionSelection) {
                        DOM.currentcharCreationOptionSelection.style.borderColor = `white`;
                    }
                    e.target.style.borderColor = `blue`;
                    DOM.currentcharCreationOptionSelection = e.target;
                }
                if(e.target.classList.contains(`charCreation`) && e.target.classList.contains(`background`)) { 
                    DOM.charCreation.updateChoices(`backgrounds`);
                    if(DOM.currentcharCreationOptionSelection) {
                        DOM.currentcharCreationOptionSelection.style.borderColor = `white`;
                    }
                    e.target.style.borderColor = `blue`;
                    DOM.currentcharCreationOptionSelection = e.target;
                }
                if(e.target.classList.contains(`charCreation`) && e.target.classList.contains(`talent1`)) { 
                    DOM.charCreation.updateChoices(`talent1`);
                    if(DOM.currentcharCreationOptionSelection) {
                        DOM.currentcharCreationOptionSelection.style.borderColor = `white`;
                    }
                    e.target.style.borderColor = `blue`;
                    DOM.currentcharCreationOptionSelection = e.target;
                }
                if(e.target.classList.contains(`charCreation`) && e.target.classList.contains(`talent2`)) { 
                    DOM.charCreation.updateChoices(`talent2`);
                    if(DOM.currentcharCreationOptionSelection) {
                        DOM.currentcharCreationOptionSelection.style.borderColor = `white`;
                    }
                    e.target.style.borderColor = `blue`;
                    DOM.currentcharCreationOptionSelection = e.target;
                }
                if(e.target.classList.contains(`charCreation`) && e.target.classList.contains(`confirm`)) { 
                    DOM.charCreation.end();
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
                    DOM.selectors.mainMenu.masterContainer.style.display = `none`;
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
                    DOM.selectors.body.append(intro);
                    DOM.introTimeout = setTimeout( function() {DOM.charCreation.endIntro()} , 126000);
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
                if(e.target.className === `up` && DOM.casterSelectionState !== null) {
                    if(DOM.casterSelectionState.row > 1) {
                        DOM.casterSelectionState.row -= 1;
                    }
                    DOM.update.chars(charJS.group.PCs, charJS.group.NPCs);
                }
                if(e.target.className === `down` && DOM.casterSelectionState !== null) {
                    if(DOM.casterSelectionState.row < 3) {
                        DOM.casterSelectionState.row += 1;
                    }
                    DOM.update.chars(charJS.group.PCs, charJS.group.NPCs);
                }
                if(e.target.className === `ability`) {
                    DOM.char.attemptAbilityCast(e.target);
                }
                if (e.target.className === `PC`) {
                    DOM.char.selectCaster(e.target);
                    DOM.update.topBar();
                    DOM.update.botBar(DOM.casterSelectionState);
                } else if(e.target.classList.contains(`PCBarRow1`) || e.target.classList.contains(`PCBarRow2`) || e.target.classList.contains(`PCBarRow3`)) { 
                    DOM.char.deselectCaster();
                    DOM.update.topBar();
                    DOM.update.botBar(DOM.casterSelectionState);
                }
                if(e.target.className === `inventory`) {
                    DOM.listen.clearTabSelectionDisplay();
                    DOM.selectedUtilDivisionTabState = `inventory`;
                    DOM.selectedUtilDivisionTab = e.target;
                    DOM.update.utilDivisionDisplay();
                    DOM.update.tabSelectionDisplay();
                }
                if(e.target.className === `charInfo`) {
                    DOM.listen.clearTabSelectionDisplay();
                    DOM.selectedUtilDivisionTabState = `charInfo`;
                    DOM.selectedUtilDivisionTab = e.target;
                    DOM.update.utilDivisionDisplay();
                    DOM.update.tabSelectionDisplay();
                }
                if(e.target.className === `party`) {
                    DOM.listen.clearTabSelectionDisplay();
                    DOM.selectedUtilDivisionTabState = `party`;
                    DOM.selectedUtilDivisionTab = e.target;
                    DOM.update.utilDivisionDisplay();
                    DOM.update.tabSelectionDisplay();
                } 
            })
        },
        mouseOver: function () { // * Listens for mouseover on the whole page body.
            DOM.selectors.body.addEventListener(`mouseover`, (e) => { // TODO: Need to fix tooltip to not disappear when clicking on it, maybe.. look at ROR.
                if( (e.target.classList.contains(`inventoryItem`) || e.target.classList.contains(`equipmentItem`) || e.target.classList.contains(`ability`) || e.target.classList.contains(`utilDivisionAbility`)) && !(e.target.dataset.itemType === `item` && e.target.dataset.itemIndex === `0`) ) {
                    DOM.tooltip.clear();
                    DOM.timeout = setTimeout( function() {DOM.tooltip.show(e.target)} , 500);
                } else if (!e.target.classList.contains(`tooltip`) && !e.target.classList.contains(`tooltipContent`)) {
                    DOM.tooltip.clear();
                }
            });
        },
        targetSelection: function () {
            DOM.selectors.gameDivision.midBar.addEventListener(`contextmenu`, (e) => {
                e.preventDefault();
                if (e.target.className === `PC` || e.target.className === `NPC`) {
                    DOM.char.selectTarget(e.target);
                } else {
                    DOM.char.deselectTarget();
                }
                DOM.update.topBar();
            })
        },
        rightClickEquip: function () { // * Where the right click swapping logic is.
            DOM.selectors.utilDivision.display.addEventListener(`contextmenu`, (e) => {
                e.preventDefault();
                if ( ( e.target.classList.contains(`inventoryItem`) || e.target.classList.contains(`equipmentItem`) )  &&  e.target.draggable === true) {
                    let dragTarget = e.target; // * dragTarget is the other variable, it represents the item being dragged.
                    let dragTargetCharData;
                    let dropTargetCharData;
                    let tempStorage;
                    let char = DOM.casterSelectionState;
                    switch(dragTarget.classList[0]) { // * links dom element properties to the char data for DRAGTARGET
                        case `equipmentItem` :
                            dragTargetCharData = char.equipment[dragTarget.dataset.equipmentSlotName];
                            dropTargetCharData = char.inventory[DOM.listen.getFirstEmptyInventorySlot(char)];
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
                                DOM.update.charStats(char, `add`, dragTargetCharData);
                                // do the swap and add stats
                            } else { // ! If drop contains item
                                char.inventory[dragTarget.dataset.inventoryIndex] = dropTargetCharData;
                                char.equipment[dragTargetCharData.itemEquipType[0]] = tempStorage;
                                DOM.update.charStats(char, `add`, dragTargetCharData);
                                DOM.update.charStats(char, `remove`, dropTargetCharData);
                                // do the swap and add drag stats, subtract drop stats
                            }
                        break;
                        case `equipmentItem` : // ***** If drag is from equipment
                            DOM.listen.putDefaultItemInPlaceOfDrag(char, dragTargetCharData, dragTarget)
                            char.inventory[DOM.listen.getFirstEmptyInventorySlot(char)] = dragTargetCharData;
                            DOM.update.charStats(char, `remove`, dragTargetCharData);
                            // do the swap and remove drag stats
                        break;
                    }
                }
                DOM.update.utilDivisionDisplay();
            })
        },
        drag: function () { // * Using this to make sure things are not draggable if they aren't supposed to be, also sets DOM.dragTarget and clears tooltips.
            DOM.selectors.body.addEventListener(`dragstart`, (e) => {
                if(e.target.draggable === false) {
                    e.preventDefault();
                }
                DOM.dragTarget = e.target;
                DOM.tooltip.clear();
            });
        },
        dragover: function () { // * Only for changing the symbol that indicates dropability when hovering over things.
            DOM.selectors.body.addEventListener(`dragover`, (e) => {
                DOM.tooltip.clear();
                if(e.target.classList.contains(`inventoryItem`) || e.target.classList.contains(`equipmentItem`) || e.target.classList.contains(`ability`)) {
                    e.preventDefault();
                }
                if(DOM.dragTarget.classList.contains(`ability`)) {
                    e.preventDefault();
                }
            })
        },
        drop: function () { // * Where most of the drag & drop item swapping logic is.
            DOM.selectors.body.addEventListener(`drop`, (e) => {
                let dropTarget = e.target; // * dragTarget is the other variable, it represents the item being dragged.
                let dragTargetCharData;
                let dropTargetCharData;
                let tempStorage;
                let char = DOM.casterSelectionState;
                switch(DOM.dragTarget.classList[0]) { // * links dom element properties to the char data for DRAGTARGET
                    case `equipmentItem` :
                        dragTargetCharData = char.equipment[DOM.dragTarget.dataset.equipmentSlotName];
                    break;
                    case `inventoryItem` :
                        dragTargetCharData = char.inventory[DOM.dragTarget.dataset.inventoryIndex];
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
                } else if (DOM.dragTarget.classList[0] === `equipmentItem` && dropTarget.classList[0] === `inventoryItem` && !dropTargetCharData.isDefaultItem) {
                    console.log(`! Cannot place an item with equip type: ${dragTargetCharData.itemEquipType} into an equipment slot with item type: ${dropTargetCharData.itemEquipType}.`)
                    return;
                }
    
                tempStorage = dragTargetCharData;
    
                switch(DOM.dragTarget.classList[0]) {
    
    
                    // ! The block of code below is for abilities to and around the hotBar, not for items.
                    case `utilDivisionAbility`: // ***** If drag is from utilDivision Ability list
                        switch(dropTarget.classList[0]) {
                            case `ability`: // *** If drop is to hotBar
                                char.hotBar[dropTarget.dataset.hotBarIndex] = +DOM.dragTarget.dataset.abilityIndex;
                            break;
                        }
                    break;
                    case `ability`: // ***** If drag is from the hotbar
                        switch(dropTarget.classList[0]) {
                            case `ability`: // *** If drop is to hotBar
                                char.hotBar[dropTarget.dataset.hotBarIndex] = +DOM.dragTarget.dataset.abilityIndex;
                                char.hotBar[DOM.dragTarget.dataset.hotBarIndex] = 0;
                            break;
                                default:
                                char.hotBar[DOM.dragTarget.dataset.hotBarIndex] = 0;
                        }
                    break;
    
    
    
                    case `inventoryItem` : // ***** If drag is from inventory
                        switch(dropTarget.classList[0]) {
                            case `inventoryItem`: // *** If drop is to inventory
                                if(dropTargetCharData.isDefaultItem) { // ! If drop is empty
                                    char.inventory[DOM.dragTarget.dataset.inventoryIndex] = allItems[0];
                                    char.inventory[dropTarget.dataset.inventoryIndex] = tempStorage;
                                    // do the swap
                                } else { // ! If drop contains item
                                    char.inventory[DOM.dragTarget.dataset.inventoryIndex] = dropTargetCharData;
                                    char.inventory[dropTarget.dataset.inventoryIndex] = tempStorage;
                                    // do the swap
                                }
    
                            break;
                            case `equipmentItem`: // *** If drop is to equipment
                                if(dropTargetCharData.isDefaultItem) { // ! If drop is empty
                                    char.inventory[DOM.dragTarget.dataset.inventoryIndex] = allItems[0];
                                    char.equipment[dropTarget.dataset.equipmentSlotName] = tempStorage;
                                    DOM.update.charStats(char, `add`, dragTargetCharData);
                                    // do the swap and add stats
                                } else { // ! If drop contains item
                                    char.inventory[DOM.dragTarget.dataset.inventoryIndex] = dropTargetCharData;
                                    char.equipment[dropTarget.dataset.equipmentSlotName] = tempStorage;
                                    DOM.update.charStats(char, `add`, dragTargetCharData);
                                    DOM.update.charStats(char, `remove`, dropTargetCharData);
                                    // do the swap and add drag stats, subtract drop stats
                                }
    
                            break;
                        }
                    break;
                    case `equipmentItem` : // ***** If drag is from equipment
                        switch(dropTarget.classList[0]) {
                            case `inventoryItem`: // *** If drop is to inventory
    
                                if(dropTargetCharData.isDefaultItem) { // ! If drop is empty
                                    DOM.listen.putDefaultItemInPlaceOfDrag(char, dragTargetCharData, DOM.dragTarget)
                                    char.inventory[dropTarget.dataset.inventoryIndex] = tempStorage;
                                    DOM.update.charStats(char, `remove`, dragTargetCharData);
                                    // do the swap and remove drag stats
                                } else { // ! If drop contains item
                                    char.equipment[DOM.dragTarget.dataset.equipmentSlotName] = dropTargetCharData;
                                    char.inventory[dropTarget.dataset.inventoryIndex] = tempStorage;
                                    DOM.update.charStats(char, `remove`, dragTargetCharData);
                                    DOM.update.charStats(char, `add`, dropTargetCharData);
                                    // do the swap and remove drag stats, add drop stats
                                }
    
                            break; 
                            case `equipmentItem`: // *** If drop is to equipment
    
                                if(dropTargetCharData.isDefaultItem) { // ! If drop is empty
                                    DOM.listen.putDefaultItemInPlaceOfDrag(char, dragTargetCharData, DOM.dragTarget)
                                    char.equipment[DOM.dragTarget.dataset.equipmentSlotName] = tempStorage;
                                    // do the swap
                                } else { // ! If drop contains item
                                    char.equipment[DOM.dragTarget.dataset.equipmentSlotName] = dropTargetCharData;
                                    char.inventory[dropTarget.dataset.inventoryIndex] = tempStorage;
                                    // do the swap
                                }
    
                            break;
                        }
                    break;
                }
                DOM.update.botBar();
                DOM.update.utilDivisionDisplay();
                DOM.dragTarget = null;
            }) 
        },

        // * Below are assistant methods only utilized within tooltip at the moment:
        getFirstEmptyInventorySlot: function (char) { // * returns a number representing the first empty inventory index.
            for(let i = 0; i < char.inventory.length; i++) {
                if(char.inventory[i].isDefaultItem) {
                    return i;
                }
            }
            return false;
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
        clearTabSelectionDisplay: function () {
            switch(DOM.selectedUtilDivisionTabState) {
                case `inventory`:
                    DOM.selectedUtilDivisionTab.style.borderColor = `rgb(255,255,255)`;  
                break;
                case `charInfo`:
                    DOM.selectedUtilDivisionTab.style.borderColor = `rgb(255,255,255)`;  
                break;
                case `party`:
                    DOM.selectedUtilDivisionTab.style.borderColor = `rgb(255,255,255)`;  
                break;
                default:
                    DOM.selectedUtilDivisionTab.style.borderColor = `rgb(255,255,255)`;  
            }
        },
    },
    charCreation: {
        updateStatsPreview: function () {
            let char = charJS.group.PCs.charList[0];
    
            DOM.selectors.charCreation.statsPreview.innerHTML = ``;
            // ! Below is the code that I want to refactor for char creation screen
            const equipDisplay = document.createElement(`div`);
            equipDisplay.className = `equipDisplay charCreation`;
            // * Main Container
            DOM.selectors.charCreation.statsPreview.append(equipDisplay);
    
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
                DOM.charCreation.createEquipmentSlot(headSlot, char, `head`);
            const torsoSlot = document.createElement(`div`);
                DOM.charCreation.createEquipmentSlot(torsoSlot, char, `torso`);
            const armsSlot = document.createElement(`div`);
                DOM.charCreation.createEquipmentSlot(armsSlot, char, `arms`);
            const legsSlot = document.createElement(`div`);
                DOM.charCreation.createEquipmentSlot(legsSlot, char, `legs`);
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
                    DOM.charCreation.createEquipmentSlot(mainHandWeaponSlot, char, `mainHand`);
                const offHandWeaponSlot = document.createElement(`div`);
                    DOM.charCreation.createEquipmentSlot(offHandWeaponSlot, char, `offHand`);
                weaponsDisplay.append(mainHandWeaponSlot, offHandWeaponSlot);
    
            equipCenter.append(statsDisplay, weaponsDisplay);
    
            // * Amulet & Quick Access Slots on the right.
            const amulet1Slot = document.createElement(`div`);
                DOM.charCreation.createEquipmentSlot(amulet1Slot, char, `amulet1`);
            const amulet2Slot = document.createElement(`div`);
                DOM.charCreation.createEquipmentSlot(amulet2Slot, char, `amulet2`);
            const quickAccess1Slot = document.createElement(`div`);
                DOM.charCreation.createEquipmentSlot(quickAccess1Slot, char, `quickAccess1`);
            const quickAccess2Slot = document.createElement(`div`);
                DOM.charCreation.createEquipmentSlot(quickAccess2Slot, char, `quickAccess2`);
            equipRight.append(amulet1Slot, amulet2Slot, quickAccess1Slot, quickAccess2Slot);
    
            const inventoryContainer = document.createElement(`div`);
            inventoryContainer.className = `inventoryContainer charCreation`;
            DOM.selectors.charCreation.statsPreview.appendChild(inventoryContainer);
            DOM.charCreation.createInventory(inventoryContainer, char); // ! Here I will eventually want to replace the first param with something like -   char.invSpace   -.
        },
        endIntro: function () { // * Ends the intro and takes player to charCreation screen.
            DOM.isIntroActive = false;
            const intro = document.querySelector(`.intro`);
            intro.remove();
            clearTimeout(DOM.introTimeout);
            DOM.introTimeout = null;
            DOM.introAudio.pause();
            DOM.introAudio.currentTime = 0;
            DOM.selectors.charCreation.masterContainer.style.display = `flex`; // * Shows charCreation screen
    
            DOM.charCreationCharData.race = allRaces[0]; // ! IDK why I have to define these even though I already do it on the definition of the DOM object above...
            DOM.charCreationCharData.background = allBackgrounds[0];
            DOM.charCreationCharData.talent1 = allTalents[0];
            DOM.charCreationCharData.talent2 = allTalents[0];
    
            console.log(`1`)
            charJS.characterCreator(DOM.charCreationCharData.name, DOM.charCreationCharData.race, DOM.charCreationCharData.talent1, DOM.charCreationCharData.talent2, charJS.group.PCs, DOM.charCreationCharData.icon);
            DOM.charCreation.updateStatsPreview();
            DOM.jailAmbienceAudio.play();
        },
        end: function () {
            DOM.charCreationCharData.name = DOM.selectors.charCreation.nameInput.value;
            charJS.group.PCs.charList.splice(0, 1);

            console.log(`2`)
            charJS.characterCreator(DOM.charCreationCharData.name, DOM.charCreationCharData.race, DOM.charCreationCharData.talent1, DOM.charCreationCharData.talent2, charJS.group.PCs, DOM.charCreationCharData.icon);
            DOM.selectors.charCreation.masterContainer.style.display = `none`; // * Hides charCreation screen
            DOM.update.chars();
        },
        createChoices: function (choiceType, choiceTypeString) {
                DOM.selectors.charCreation.choices.innerHTML = ``;
                choiceType.forEach((ele) => {
                    if(ele == DOM.charCreationCharData.race || ele == DOM.charCreationCharData.background || ele == DOM.charCreationCharData.talent1 || ele == DOM.charCreationCharData.talent2) {
                        return;
                    }
                    let x = document.createElement(`button`);
                    x.className = `charCreation choice`;
                    x.dataset.index = ele.index;
                    x.dataset.choiceType = choiceTypeString;
                    x.textContent = ele.name;
                    DOM.selectors.charCreation.choices.append(x);
                })
        },
        updateChoices: function (type) {
            switch(type) {
                case `races`:
                    DOM.charCreation.createChoices(allRaces, `race`);
                break;
                case `backgrounds`:
                    DOM.charCreation.createChoices(allBackgrounds, `background`);
                break;
                case `talent1`:
                    DOM.charCreation.createChoices(allTalents, `talent1`);
                break;
                case `talent2`:
                    DOM.charCreation.createChoices(allTalents, `talent2`);
                break;
            }
        },
        updateCharData: function (choiceType, index) {
            switch(choiceType) {
                case `race`:
                    DOM.charCreationCharData.race = allRaces[index];
                    if(allRaces[index].name === `None`) {
                        DOM.selectors.charCreation.raceBar.textContent = `Race`;
                    } else {
                        DOM.selectors.charCreation.raceBar.textContent = `${allRaces[index].name}`;
                    }
                break;
                case `background`:
                    DOM.charCreationCharData.background = allBackgrounds[index];
                    if(allBackgrounds[index].name === `None`) {
                        DOM.selectors.charCreation.background.textContent = `Background`;
                    } else {
                        DOM.selectors.charCreation.background.textContent = `${allBackgrounds[index].name}`;
                    }
                break;
                case `talent1`:
                    DOM.charCreationCharData.talent1 = allTalents[index];
                    if(allTalents[index].name === `None`) {
                        DOM.selectors.charCreation.talent1.textContent = `Talent 1`;
                    } else {
                        DOM.selectors.charCreation.talent1.textContent = `${allTalents[index].name}`;
                    }
                break;
                case `talent2`:
                    DOM.charCreationCharData.talent2 = allTalents[index];
                    if(allTalents[index].name === `None`) {
                        DOM.selectors.charCreation.talent2.textContent = `Talent 2`;
                    } else {
                        DOM.selectors.charCreation.talent2.textContent = `${allTalents[index].name}`;
                    }
                break;
            }
            DOM.charCreationCharData.name = DOM.selectors.charCreation.nameInput.value;
            charJS.group.PCs.charList.splice(0, 1);

            console.log(`3`)
            charJS.characterCreator(DOM.charCreationCharData.name, DOM.charCreationCharData.race, DOM.charCreationCharData.talent1, DOM.charCreationCharData.talent2, charJS.group.PCs, DOM.charCreationCharData.icon);
            DOM.charCreation.updateStatsPreview();
        },
        createInventory: function (inventoryContainer, char) { 
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
    },
    tooltip: {
        clear: function () {
            clearTimeout(DOM.timeout);
            let tooltips = document.getElementsByClassName(`tooltip`);
            while(tooltips.length > 0) {
            tooltips[0].parentNode.removeChild(tooltips[0]);
            }
            return;
        },    
        show: function (target) {
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
                        damageDiceDisplay = DOM.tooltip.formatDamageDiceToText(item.damage); 
                        x.className = `tooltip`;
                        x.innerHTML = `
                                    <div class="tooltipContent">${item.name}:</div>
                                    <div class="tooltipContent">-</div>
                                    <div class="tooltipContent">Damage: ${damageDiceDisplay}</div>`;
                    break;
                    case `armor`:
                        item = allArmors[target.dataset.itemIndex];
                        resistsDisplay = DOM.tooltip.formatResistArrayToText(item.resists); 
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
            DOM.timeout = null;
        },

        // * Below are assistant methods only utilized within tooltip at the moment:
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
    },
    update: {
        topBar: function () {
            if (DOM.casterSelectionState) {
                DOM.selectors.gameDivision.casterSelectionDisplay.textContent = `Caster: ${DOM.casterSelectionState.name}`;
            } else {
                DOM.selectors.gameDivision.casterSelectionDisplay.textContent = `Caster: None Selected`;
            }
    
            if (DOM.targetSelectionState) {
                DOM.selectors.gameDivision.targetSelectionDisplay.textContent = `Target: ${DOM.targetSelectionState.name}`;
            } else {
                DOM.selectors.gameDivision.targetSelectionDisplay.textContent = `Target: None Selected`;
            }
            DOM.selectors.gameDivision.APCount.textContent = `Action Points: ${turn.AP}`;
        },
        botBar: function (selectedPC) {
            if (selectedPC && !DOM.selectors.gameDivision.abilityListContainer.hasChildNodes()) {
                DOM.create.hotBar(DOM.casterSelectionState);
            } else if (!selectedPC) {
                DOM.selectors.gameDivision.abilityListContainer.innerHTML = ``;
                DOM.create.hotBar(DOM.casterSelectionState);
            }
        },
        chars: function () {
            DOM.selectors.gameDivision.NPCBarRow3.innerHTML = ``;
            DOM.selectors.gameDivision.NPCBarRow2.innerHTML = ``;
            DOM.selectors.gameDivision.NPCBarRow1.innerHTML = ``;
            DOM.selectors.gameDivision.PCBarRow1.innerHTML = ``;
            DOM.selectors.gameDivision.PCBarRow2.innerHTML = ``;
            DOM.selectors.gameDivision.PCBarRow3.innerHTML = ``;
            for (let i = (charJS.group.PCs.charList.length - 1); i >= 0; i--) {
                DOM.create.char(charJS.group.PCs.charList[i], i) // ! DOM should not directly access the PC charlist, but should interact with a function (maybe on pccharlist object) to get the pcs by reference.
            };
            for (let i = (charJS.group.NPCs.charList.length - 1); i >= 0; i--) {
                DOM.create.char(charJS.group.NPCs.charList[i], i)
            };
        },
        charStats: function (char, addOrRemove, item) { 
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
        utilDivisionDisplay: function () { // * is called when you select a different char or tab.
            switch(DOM.selectedUtilDivisionTabState) {
                case `inventory`:
                    DOM.selectors.utilDivision.display.innerHTML = `Equipment:`;
                    if (DOM.casterSelectionState) {
                        DOM.create.utilDivisionDisplay(DOM.casterSelectionState);
                    }
                break;
                case `charInfo`:
                    DOM.selectors.utilDivision.display.innerHTML = `Character Info:`;
                    if (DOM.casterSelectionState) {
                        DOM.create.utilDivisionDisplay(DOM.casterSelectionState);
                    }
                break;
                case `party`:
                    DOM.selectors.utilDivision.display.innerHTML = `Party:`;
                    if (DOM.casterSelectionState) {
                        DOM.create.utilDivisionDisplay(DOM.casterSelectionState);
                    }
                break;
            }
        },
        tabSelectionDisplay: function () {
            switch(DOM.selectedUtilDivisionTabState) {
                case `inventory`:
                    DOM.selectedUtilDivisionTab.style.borderColor = `rgb(100,100,200)`;  
                break;
                case `charInfo`:
                    DOM.selectedUtilDivisionTab.style.borderColor = `rgb(100,100,200)`;  
                break;
                case `party`:
                    DOM.selectedUtilDivisionTab.style.borderColor = `rgb(100,100,200)`;  
                break;
                default:
                    DOM.selectedUtilDivisionTab.style.borderColor = `rgb(255,255,255)`;  
            }
        },
    },
    create: {
        char: function (char, charListIndex) {
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
            DOM.create.forceHPtoZero(char);
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
                    if (DOM.casterSelectionState === char) {
                        if (DOM.casterSelectionState.hp === 0) {
                            i.style.borderColor = `rgb(75,75,150)`;
                        } else {
                            i.style.borderColor = `blue`;
                        }
                        DOM.casterSelection = i;
                    } else if (DOM.targetSelectionState === char) {
                        i.style.borderColor = `yellow`;
                        DOM.targetSelection = i;
                    }
                    DOM.create.appendPCCharToRow(char, i);
                    break;
    
                case `NPC`:
                    if (DOM.targetSelectionState === char) {
                        i.style.borderColor = `red`;
                        DOM.targetSelection = i;
                    }
                    DOM.create.appendNPCCharToRow(char, i);
                    break;
    
                case `Unassigned`:
                    console.log(`Error: Tried to put char with unassigned group onto DOM.`);
                    break;
    
                default:
                    console.log(`Error: Something weird happened here.`);
                    break;
            }
        },
        equipmentSlot: function (ele, char, slotName) {
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
        hotBar: function (char) {
            if(!char) { // * sets hotbar/botbar back to a bunch of blanks.
                for (let i = 0; i < 36; i++) {
                    const x = document.createElement(`div`);
                    x.className = `ability`;
                    x.dataset.hotBarIndex = i;
                    x.style.backgroundImage = allAbilities[0].icon;
                    x.style.backgroundRepeat = `no-repeat`;
                    x.style.backgroundSize = `100%`;
                    DOM.selectors.gameDivision.abilityListContainer.append(x); 
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
                    DOM.selectors.gameDivision.abilityListContainer.append(x);
                } 
            }
        },
        inventory: function (inventoryContainer, char) {
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
        utilDivisionDisplay: function (char) { // * Holds most of the logic for the DOM structure of the UtilDivisionDisplay
            switch(DOM.selectedUtilDivisionTabState) {
                case `inventory`:
                    const equipDisplay = document.createElement(`div`);
                    equipDisplay.className = `equipDisplay`;
                    // * Main Container
                    DOM.selectors.utilDivision.display.append(equipDisplay);
    
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
                        DOM.create.equipmentSlot(headSlot, char, `head`);
                    const torsoSlot = document.createElement(`div`);
                        DOM.create.equipmentSlot(torsoSlot, char, `torso`);
                    const armsSlot = document.createElement(`div`);
                        DOM.create.equipmentSlot(armsSlot, char, `arms`);
                    const legsSlot = document.createElement(`div`);
                        DOM.create.equipmentSlot(legsSlot, char, `legs`);
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
                            DOM.create.equipmentSlot(mainHandWeaponSlot, char, `mainHand`);
                        const offHandWeaponSlot = document.createElement(`div`);
                            DOM.create.equipmentSlot(offHandWeaponSlot, char, `offHand`);
                        weaponsDisplay.append(mainHandWeaponSlot, offHandWeaponSlot);
    
                    equipCenter.append(statsDisplay, weaponsDisplay);
    
                    // * Amulet & Quick Access Slots on the right.
                    const amulet1Slot = document.createElement(`div`);
                        DOM.create.equipmentSlot(amulet1Slot, char, `amulet1`);
                    const amulet2Slot = document.createElement(`div`);
                        DOM.create.equipmentSlot(amulet2Slot, char, `amulet2`);
                    const quickAccess1Slot = document.createElement(`div`);
                        DOM.create.equipmentSlot(quickAccess1Slot, char, `quickAccess1`);
                    const quickAccess2Slot = document.createElement(`div`);
                        DOM.create.equipmentSlot(quickAccess2Slot, char, `quickAccess2`);
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
                    // DOM.selectors.utilDivision.display.append(x);
                    // x.append(z);
                
                    const inventoryContainer = document.createElement(`div`);
                    inventoryContainer.className = `inventoryContainer`;
                    DOM.selectors.utilDivision.display.appendChild(inventoryContainer);
                    DOM.create.inventory(inventoryContainer, char); // ! Here I will eventually want to replace the first param with something like -   char.invSpace   -.
                break;
                case `charInfo`:
                    const charInfoLevelDisplay = document.createElement(`div`);
                    charInfoLevelDisplay.className = `charInfoLevelDisplay`;
                    charInfoLevelDisplay.textContent = `Level: ${char.level}`;
                    DOM.selectors.utilDivision.display.append(charInfoLevelDisplay);
    
                    const charInfoRaceDisplay = document.createElement(`div`);
                    charInfoRaceDisplay.className = `charInfoRaceDisplay`;
                    charInfoRaceDisplay.textContent = `Race: ${char.raceName}`;
                    DOM.selectors.utilDivision.display.append(charInfoRaceDisplay);
    
                    const charInfoBackgroundDisplay = document.createElement(`div`);
                    charInfoBackgroundDisplay.className = `charInfoBackgroundDisplay`;
                    charInfoBackgroundDisplay.textContent = `Background: -placeholder-`;
                    DOM.selectors.utilDivision.display.append(charInfoBackgroundDisplay);
    
                    const charInfoTalent1Display = document.createElement(`div`);
                    charInfoTalent1Display.className = `charInfoTalent1Display`;
                    charInfoTalent1Display.textContent = `Talent 1: ${char.talent1Name}`;
                    DOM.selectors.utilDivision.display.append(charInfoTalent1Display);
    
                    const charInfoTalent2Display = document.createElement(`div`);
                    charInfoTalent2Display.className = `charInfoTalent2Display`;
                    charInfoTalent2Display.textContent = `Talent 2: ${char.talent2Name}`;
                    DOM.selectors.utilDivision.display.append(charInfoTalent2Display);
    
                    for (let i = 0; i < (Object.keys(DOM.casterSelectionState.abilities).length); i++) {
                        const x = document.createElement(`div`);
                        x.className = `utilDivisionAbility`;
                        x.style.backgroundImage = allAbilities[char.abilities[i]].icon;
                        x.dataset.abilityIndex = allAbilities[char.abilities[i]].index;
                        x.style.backgroundRepeat = `no-repeat`;
                        x.style.backgroundSize = `100%`;
                        x.draggable = true;
                        DOM.selectors.utilDivision.display.append(x);
                    }
                break;
                case `party`:
                    for (let i = 0; i < (Object.keys(DOM.casterSelectionState.stats).length); i++) {
                        const x = document.createElement(`div`);
                        const arrayOfAllKeysInStats1 = Object.keys(char.stats);
                        const statKeyName1 = arrayOfAllKeysInStats1[i];
                        const stat1 = char.stats[statKeyName1];
                        x.innerHTML = `<div>-</div>
                                    <div class="statName">${statKeyName1}:</div>
                                    <div>${stat1}</div>`
                        DOM.selectors.utilDivision.display.append(x);
                    }
                break;
            }
        },

        // * Below are assistant methods only utilized within tooltip at the moment:
        forceHPtoZero: function (char) {
            if (char.hp < 0) {
                char.hp = 0;
            }
        },
        appendPCCharToRow: function (char, i) {
            switch (char.row) {
                case 1: 
                    DOM.selectors.gameDivision.PCBarRow1.append(i);
                break;
                case 2: 
                    DOM.selectors.gameDivision.PCBarRow2.append(i);
                break;
                case 3: 
                    DOM.selectors.gameDivision.PCBarRow3.append(i);
                break;
            }
        },
        appendNPCCharToRow: function (char, i) {
            switch (char.row) {
                case 1: 
                    DOM.selectors.gameDivision.NPCBarRow1.append(i);
                break;
                case 2: 
                    DOM.selectors.gameDivision.NPCBarRow2.append(i);
                break;
                case 3: 
                    DOM.selectors.gameDivision.NPCBarRow3.append(i);
                break;
            }
        }, 
    },
    char: {
        selectCaster: function (target) {
            if (DOM.casterSelection !== null && target !== DOM.casterSelection) {
                DOM.char.deselectCaster();
            }
            const targetGroupIndex = target.dataset.groupIndex;
            DOM.casterSelectionState = charJS.group.PCs.charList[targetGroupIndex];
            DOM.casterSelection = target;
            if (DOM.casterSelectionState.hp === 0) {
                DOM.casterSelection.style.borderColor = `rgb(75,75,150)`;
            } else {
                DOM.casterSelection.style.borderColor = `blue`;
            }
            DOM.update.botBar();
            DOM.update.utilDivisionDisplay();
        },
        deselectCaster: function () {
            if (DOM.casterSelection) {
                if (DOM.casterSelection === DOM.targetSelection) {
                    DOM.targetSelection.style.borderColor = `yellow`;
                    DOM.casterSelection = null;
                    DOM.casterSelectionState = null;
                } else {
                    if (DOM.casterSelectionState.hp === 0) {
                        DOM.casterSelection.style.borderColor = `rgb(50,50,50)`;
                    } else {
                        DOM.casterSelection.style.borderColor = `white`;
                    }
                    DOM.casterSelection = null;
                    DOM.casterSelectionState = null;
                }
            }
            DOM.update.botBar();
            DOM.update.utilDivisionDisplay();
        },
        selectTarget: function (target) {
            if (DOM.targetSelection !== null && target !== DOM.targetSelection) {
                DOM.char.deselectTarget();
            }
            DOM.targetSelection = target;
            let targetGroup = target.className;
            const targetGroupIndex = target.dataset.groupIndex;
            if (targetGroup === `NPC`) {
                DOM.targetSelectionState = charJS.group.NPCs.charList[targetGroupIndex];
                target.style.borderColor = `red`;
            };
            if (targetGroup === `PC`) {
                DOM.targetSelectionState = charJS.group.PCs.charList[targetGroupIndex];
                target.style.borderColor = `yellow`;
            }
        },
        deselectTarget: function () {
            if (DOM.targetSelection) {
                if (DOM.targetSelection === DOM.casterSelection) {
                    if (DOM.targetSelectionState.hp === 0) {
                        DOM.targetSelection.style.borderColor = `rgb(75,75,150)`;
                    } else {
                        DOM.targetSelection.style.borderColor = `blue`;
                    }
                    DOM.targetSelection = null;
                    DOM.targetSelectionState = null;
                } else {
                    if (DOM.targetSelectionState.hp === 0) {
                        DOM.targetSelection.style.borderColor = `rgb(50,50,50)`;
                    } else {
                        DOM.targetSelection.style.borderColor = `white`;
                    }
                    DOM.targetSelection = null;
                    DOM.targetSelectionState = null;
                }
            }
        },
        attemptAbilityCast: function (target) {
            const abilityDatasetIndex = target.dataset.abilityIndex;
            if ((DOM.casterSelectionState && DOM.targetSelectionState) !== null) {
                DOM.casterSelectionState.useAbility(abilityDatasetIndex, DOM.targetSelectionState)
            } else {
                console.log(`invalid targets`);
            }
            DOM.update.chars(charJS.group.PCs, charJS.group.NPCs);
            DOM.update.topBar();
        },
    }, 

    startDOM: function (PCs, NPCs) { // Runs all of the nessesary DOM functions.
        DOM.update.chars(PCs, NPCs);
        DOM.listen.click();
        DOM.listen.targetSelection();
        DOM.listen.mouseOver();
        DOM.listen.drag();
        DOM.listen.dragover();
        DOM.listen.drop();
        DOM.listen.rightClickEquip();
        DOM.selectedUtilDivisionTab = DOM.selectors.utilDivision.inventoryTab;
        DOM.update.utilDivisionDisplay();
        DOM.update.tabSelectionDisplay();
        DOM.update.botBar();
    },
};

export { DOM } ;