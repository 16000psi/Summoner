import {Imp, HornedDemon, Flamelurker, Infernal, Sedimentite, StormDemon, Voidwalker, Succubus, SoulEater, SpiderDemon, VoidTerror,AbyssalDemon, AlchemicalTrickster, DreamWeaver, PortaEntity, CrystalDemon, Spellthief, SceptreDemon, Mort, FleshTower, NoxiousSpirit, SentientOoze, Plaguebearer, Swarmsoul, Satyr, RuneDemon, FadedWarrior, Chupacabra, DrownedCourtier, TitanicVisage} from "./demonClasses.mjs"

class Summoner {

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


    changeActiveDemon (chosenDemon) {

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