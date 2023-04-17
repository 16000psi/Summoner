import {Imp, HornedDemon, Flamelurker, Infernal, Sedimentite, StormDemon, Voidwalker, Succubus, SoulEater, SpiderDemon, VoidTerror,AbyssalDemon, AlchemicalTrickster, DreamWeaver, PortaEntity, CrystalDemon, Spellthief, SceptreDemon, Mort, FleshTower, NoxiousSpirit, SentientOoze, Plaguebearer, Swarmsoul, Satyr, RuneDemon, FadedWarrior, Chupacabra, DrownedCourtier, TitanicVisage} from "./data/demonClasses.mjs"

import inquirer from "inquirer"

import {burned, poisoned} from "./data/statusEffects.mjs"

import {stack} from "./engine/executionStack.mjs"

import {Summoner} from "./data/summonerClass.mjs"




class Battle {

    constructor (player, enemy) {

        this.turn = 1
        this.whoseTurn = null

        this.turnPhase = 0

        this.player = player
        this.enemy = enemy

        this.playerDemonInventory = this.player.demonInventory
        this.enemyDemonInventory = this.enemy.demonInventory

        this.playerActiveDemon = null
        this.enemyActiveDemon = null

        this.playerAction = null
        this.enemyAction = null

    }

    //Battle logic methods

    initialiseBattle () {

        this.playerActiveDemon = this.summonActiveDemon(this.playerDemonInventory)
        this.enemyActiveDemon = this.summonActiveDemon(this.enemyDemonInventory)
    }

    summonActiveDemon (summonerInventory) {

        for (let i in summonerInventory) {

            if (summonerInventory[i].active === true) {
                return summonerInventory[i]
            }
        }

    }

    playerChooseAction() {

        this.playerAction = this.playerActiveDemon.attack
        
    }

    enemyChooseAction() {

        this.enemyAction = this.enemyActiveDemon.attack

    }

    whichActionFirst () {

        let playerSpeed = this.playerActiveDemon.speed

        let enemySpeed = this.enemyActiveDemon.speed

        if (this.playerAction.quick === true) {
            playerSpeed += 80
        }

        if (this.enemyAction.quick === true) {
            enemySpeed += 80
        }

        if (playerSpeed > enemySpeed) {
            this.whoseTurn = "player"
        }

        else if (playerSpeed <= enemySpeed) {
            this.whoseTurn = "enemy"
        }

    }

    executeAction() {



        if (this.whoseTurn === "player") {
            if (this.playerAction.actionType === "move") {

                this.attack(this.playerActiveDemon, this.enemyActiveDemon, this.playerAction)
            }
        }

        else if (this.whoseTurn === "enemy") {
            if (this.enemyAction.actionType === "move") {

                this.attack(this.enemyActiveDemon, this.playerActiveDemon, this.playerAction)
            }
        }


        this.turn ++

    }

    attack(attacker, defender, move) {


        defender.HP -= move.basePower


    }

    endOfActionCheck () {


        if (this.playerActiveDemon.checkIfDied() === true) {  // if player demon remove status effects

            this.playerActiveDemon.clearStatusEffects()

        }

        if (this.enemyActiveDemon.checkIfDied() === true) {   // if enemy demon remove status effects

            this.enemyActiveDemon.clearStatusEffects()
        }

        let selfOrOpponent = null

        for (let i in this.playerActiveDemon.statusEffects) {  // executes player status effects

            if (this.whoseTurn === "player") {

                selfOrOpponent = "self"
            }

            else {

                selfOrOpponent = "opponent"
            }


            this.playerActiveDemon.executeStatusEffect(this.playerActiveDemon.statusEffects[i], selfOrOpponent)
        }

        for (let i in this.enemyActiveDemon.statusEffects) {  // executes player status effects

            if (this.whoseTurn === "player") {

                selfOrOpponent = "opponent"
            }

            else {

                selfOrOpponent = "self"
            }


            this.enemyActiveDemon.executeStatusEffect(this.enemyActiveDemon.statusEffects[i], selfOrOpponent)
        }

        if (this.playerActiveDemon.checkIfDied() === true) {  // if player demon dead

            console.log("player active wokemon switcher engaged")

        }

        if (this.enemyActiveDemon.checkIfDied() === true) {   // if enemy demon dead

            console.log("enemy active wokemon switcher engaged")

        }

        if (this.whoseTurn === "player") {
            this.whoseTurn = "enemy"
        }

        else if (this.whoseTurn === "enemy") {
            this.whoseTurn = "player"
        }




    }

    battleLost() {
        console.log("ooh nooo! you lost :(")
    }

    battleWon() {
        console.log("woooo you won!!! woooo")
    }

    checkIfOver () {
        console.log(this.playerDemonInventory)
    }

    returnCurrentAction () {

        if (this.whoseTurn === "player") {

            return this.playerAction

        }

        else if (this.whoseTurn === "enemy") {

            return this.enemyAction
        }
    }

    advanceTurn () {

        this.turn ++

        if (this.turnPhase === 0) {

            if (this.whoseTurn === "enemy") {

                this.whoseTurn = "player"
            }

            else if (this.whoseTurn === "player") {

                this.whoseTurn = "enemy"
            }

            this.turnPhase = 1
        }
        else if (this.turnPhase === 1) {

            this.whoseTurn = null

            this.turnPhase = 0
        }

    }

    enemyChangeActiveDemon () {

        let demon = null

        for (let i in this.enemyDemonInventory) {

            if (this.enemyDemonInventory[i].HP > 0) {

                demon = this.enemyDemonInventory[i]

            }
        }

        this.enemy.changeActiveDemon(demon)
        this.enemyActiveDemon = this.summonActiveDemon(this.enemyDemonInventory)
        

    
    }

    playerChangeActiveDemon () {

        let demon = null

        for (let i in this.playerDemonInventory) {

            if (this.playerDemonInventory[i].HP > 0) {

                demon = this.playerDemonInventory[i]

            }
        }

        this.player.changeActiveDemon(demon)
        this.playerActiveDemon = this.summonActiveDemon(this.playerDemonInventory)

    
    }


    // Battle handler methods 

    startBattle() {

        this.currentBattle.initialiseBattle()  // at this point, "this" refers to the stack object.


        this.remAddEx(this.currentBattle.declareBattleSummons) 

    }

    declareBattleSummons() {


        console.log("")
        console.log(`You summoned ${this.currentBattle.playerActiveDemon.species}, the enemy summoned ${this.currentBattle.enemyActiveDemon.species}.`)
        console.log("")


        inquirer
        .prompt
        ([
            {
                name: "declareBattleSummons",
                message: "Enter to continue..."
            }
        ])
        .then (answers => {
            if (answers.declareBattleSummons === "") {

                this.remAddEx(this.currentBattle.selectBattleAction)
                return
            }

            else {

                this.execute()
                return
            }
        })


    }

    selectBattleAction () {

        console.log("")
        console.log(`Press A to attack`)
        console.log("")


        inquirer
        .prompt
        ([
            {
                name: "declareBattleSummons",
                message: "Enter to continue"
            }
        ])
        .then (answers => {

            
            if (answers.declareBattleSummons.toUpperCase() === "A") {

                

                this.remAddEx(this.currentBattle.battleActionHandler)


                return
            }

            else {

                this.execute()
                return
            }
        })
    }

    battleActionHandler() {

        this.currentBattle.playerChooseAction()
        this.currentBattle.enemyChooseAction()
        this.currentBattle.whichActionFirst()

        this.remAddEx(this.currentBattle.preBattleActionPrompt)

        
    }

    preBattleActionPrompt () {

        console.log("")
        console.log(this.currentBattle.returnCurrentAction())
        console.log("")


        inquirer
        .prompt
        ([
            {
                name: "preBattleActionPrompt",
                message: "Enter to continue..."
            }
        ])
        .then (answers => {

            if (answers.preBattleActionPrompt === "") {

                this.remAddEx(this.currentBattle.battleExecutionHandler)

                return




            }

            else {

                this.execute()
                return
            }
        })


    }

    battleExecutionHandler() {

        


        let playerDemonDied = false
        let enemyDemonDied = false

        console.log("")
        console.log(this.currentBattle.playerActiveDemon.species + "  " + this.currentBattle.enemyActiveDemon.species)
        console.log(this.currentBattle.playerActiveDemon.HP + " " + this.currentBattle.enemyActiveDemon.HP)

        this.currentBattle.executeAction()

        console.log(this.currentBattle.playerActiveDemon.HP + " " + this.currentBattle.enemyActiveDemon.HP)


        if (this.currentBattle.playerActiveDemon.checkIfDied()) {
            playerDemonDied = true
        }
        if (this.currentBattle.enemyActiveDemon.checkIfDied()) {
            enemyDemonDied = true
        }

        let playerSelfOrOpponent = null
        let enemySelfOrOpponent = null

        if (this.currentBattle.whoseTurn === "player") {

            playerSelfOrOpponent = "self"
            enemySelfOrOpponent = "opponent"
        }

        else if (this.currentBattle.whoseTurn === "enemy"){

            playerSelfOrOpponent = "opponent"
            enemySelfOrOpponent = "self"
        }

        if (playerDemonDied === false) {
            this.currentBattle.playerActiveDemon.executeStatusEffects(playerSelfOrOpponent)
        }
        if (enemyDemonDied === false) {
            this.currentBattle.enemyActiveDemon.executeStatusEffects(enemySelfOrOpponent)
        }

        if (this.currentBattle.playerActiveDemon.checkIfDied()) {
            playerDemonDied = true
        }
        if (this.currentBattle.enemyActiveDemon.checkIfDied()) {
            enemyDemonDied = true
        }

        if (playerDemonDied || enemyDemonDied) {

            this.remAddEx(this.currentBattle.demonDied)

            return

        } else {

            this.remove()
            this.add(this.currentBattle.postBattleActionHandler)
            this.add(this.currentBattle.postBattleActionContinue)
            this.execute()

            return
        }


    }

    postBattleActionContinue () {

        console.log("")
        console.log("postbattleactioncontinue!! :)")
        console.log("")

        inquirer
        .prompt
        ([
            {
                name: "postBattleActionContinue",
                message: "Enter to continue..."
            }
        ])

        .then ( answers => {
            if (answers.postBattleActionContinue === "") {

                this.remove()
                this.execute()



            }

            else {

                this.execute()
            }
        })
    }

    postBattleActionHandler () {


        console.log(this.currentBattle.turnPhase + " <<< turn phase")

        if (this.currentBattle.turnPhase === 0) {  // if only one action this turn

            console.log("phase 1")

            this.currentBattle.advanceTurn()

            this.remAddEx(this.currentBattle.preBattleActionPrompt)

            return

            


        }

        else if (this.currentBattle.turnPhase === 1) {  // if both actions this turn

            this.currentBattle.advanceTurn()

            console.log("phase 2")

            this.remAddEx(this.currentBattle.selectBattleAction)

            return


        }

        
    }

    demonDied () {


        if (this.currentBattle.player.checkIfDemonsDead() === true) {  // if player lost

            this.remAddEx(this.currentBattle.battleLostMenu)
            return

        } 

        else if (this.currentBattle.enemy.checkIfDemonsDead() === true) {  // if player won

            this.remAddEx(this.currentBattle.battleWonMenu)
            return
        }

        let skipLastTurnHalf = false

        if (this.currentBattle.turnPhase === 1) { // if demon with upcoming action died, skip it

            if ((this.currentBattle.playerActiveDemon.checkIfDied() === true && this.currentBattle.whoseTurn === "enemy")
            || this.currentBattle.enemyActiveDemon.checkIfDied() === true && this.currentBattle.whoseTurn === "player") {

                skipLastTurnHalf = true
            }
        }

        this.remove()

        this.add(this.currentBattle.postBattleActionHandler)

        
        

        if (skipLastTurnHalf) {
            
            this.currentBattle.turnPhase = 1
            
            
            
        }
        
        
        if (this.currentBattle.enemyActiveDemon.checkIfDied() === true) {
            
            this.currentBattle.enemyChangeActiveDemon()
            
            this.add(this.currentBattle.enemyNewSummonMenu)
            
        }
        
        
        if (this.currentBattle.playerActiveDemon.checkIfDied() === true) {

            console.log("HERE")
            
            this.add(this.currentBattle.summonNewDemonMenu)
            
        }
        
        
        
        this.add(this.currentBattle.postBattleActionContinue)

        this.execute()
        
        
    }
    
    battleLostMenu () {
        
        console.log("")
        
        console.log("booo hooo you lost haha")

        console.log("")

        inquirer
        .prompt
        ([
            {
                name: "battleLostMenu",
                message: "Enter to continue..."
            }
        ])
        .then (answers => {
            if (answers.battleLostMenu === "") {

                this.remove()
                this.execute()

                return
            }

            else { 

                this.execute()

                return
            }
        })
    }

    battleWonMenu () {

        console.log("")

        console.log("omg amazing! u won! wowww")

        console.log("")

        inquirer
        .prompt
        ([
            {
                name: "battleWonMenu",
                message: "Enter to continue..."
            }
        ])
        .then (answers => {
            if (answers.battleWonMenu === "") {

                this.remove()
                this.execute()

                return
            }

            else { 

                this.execute()

                return
            }
        })


    }

    enemyNewSummonMenu() {
        

        console.log("")
        console.log("enemy summoned:")
        console.log(this.currentBattle.enemyActiveDemon)
        console.log("")
        
        inquirer
        .prompt
        ([
            {
                name: "enemyNewSummonMenu",
                message: "Enter to continue..."
            }
        ])
        .then (answers => {
            if (answers.enemyNewSummonMenu === "") {

                this.remove()
                this.execute()

                return
            }

            else { 

                this.execute()

                return
            }
        })


    }

    summonNewDemonMenu() {
        

        console.log("")
        console.log("this is a placeholder for when you would usually summon a demon")
        
        console.log("")
        
        inquirer
        .prompt
        ([
            {
                name: "summonNewDemonMenu",
                message: "Enter to continue..."
            }
        ])
        .then (answers => {
            if (answers.summonNewDemonMenu === "") {

                this.currentBattle.playerChangeActiveDemon()

                this.remAddEx(this.currentBattle.playerSummonDeclaration)

                return
            }

            else { 

                this.execute()

                return
            }
        })


    }

    playerSummonDeclaration() {

        console.log("you summoned")
        console.log(this.currentBattle.playerActiveDemon)

        inquirer
        .prompt
        ([
            {
                name: "playerSummonDeclaration",
                message: "Enter to continue..."
            }
        ])
        .then (answers => {
            if (answers.playerSummonDeclaration === "") {

                this.currentBattle.playerChangeActiveDemon()

                this.remove()
                this.execute()

                return
            }

            else { 

                this.execute()

                return
            }
        })
    }

}


const examplePlayer = new Summoner([new Imp(30, true), new VoidTerror(30)])
examplePlayer.demonInventory[0].HP = 1
const exampleEnemy = new Summoner([new DrownedCourtier(30, true), new CrystalDemon(30)])

const myBattle = new Battle (examplePlayer, exampleEnemy)

stack.newBattle(myBattle)


stack.execute()



