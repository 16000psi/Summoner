import {Imp, HornedDemon, Flamelurker, Infernal, Sedimentite, StormDemon, Voidwalker, Succubus, SoulEater, SpiderDemon, VoidTerror,AbyssalDemon, AlchemicalTrickster, DreamWeaver, PortaEntity, CrystalDemon, Spellthief, SceptreDemon, Mort, FleshTower, NoxiousSpirit, SentientOoze, Plaguebearer, Swarmsoul, Satyr, RuneDemon, FadedWarrior, Chupacabra, DrownedCourtier, TitanicVisage} from "./demonClasses.mjs"

class Summoner {

    // Class defines the summoner, which can be player or AI.  Demons are stored in the demon inventory. 

    constructor (demonInventory, name = "none", isPlayer = false) {

        this.isPlayer = isPlayer

        this.demonInventory = demonInventory

        this.name = name
    }

    checkIfDemonsDead () {

        for (let i in this.demonInventory) {

            if (this.demonInventory[i].HP > 1) {

                return false
            }
        }

        return true
    }

    getActiveDemon () {

        // unused duplicate from battle, for use later (trying to abstract a lot of the battle logic into other classes as battle is totally unwieldly and makes no sense)


        for (let i in this.demonInventory) {

            if (this.demonInventory[i].active == true) {
                return this.demonInventory[i]
            }

        }
    }


    changeActiveDemon (chosenDemon) {

        // Changes the active demon.  demon.active is a boolean which should only be true on one living demon per inventory.  active is the demon currently used in battle.

        this.demonInventory.map((demon) => {
            demon.active = false
            return demon
        })

        chosenDemon.active = true


    }

    killAllDemons () {

        for (let i in this.demonInventory) {
            this.demonInventory[i].kill()
        }
    }



}

const example = new Summoner ([new Imp(30, true), new VoidTerror(30)])

console.log(example.demonInventory)



export {Summoner}