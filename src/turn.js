import { combatLog } from "./combatLog.js";
import { char } from "./char.js";
import { effect } from "./effect.js";
import { DOM } from "./dom.js";

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
        DOM.update.chars(char.group.PCs, char.group.NPCs);
        DOM.update.topBar();
        combatLog.startPCTurn();
    },
    getAttackablePCs: function (attackablePCs) { // * Checks if a PC is alive, if so, add them to the list of attackable PCs.
        for(let i = 0; i < char.group.PCs.charList.length; i++) { 
            if(char.group.PCs.charList[i].hp > 1) {
                attackablePCs.push(char.group.PCs.charList[i]);
            }
        }
    },
    getAttackingNPC: function () { // *
        const attackingNPC = char.group.NPCs.charList[effect.diceMinus1(char.group.NPCs.charList.length)];
        return attackingNPC
    },
    NPCMakeAttack: function (attackingNPC, attackablePCs) {
        attackingNPC.useAbility(1, attackablePCs[effect.diceMinus1(attackablePCs.length)]);
    }
}

export {turn};