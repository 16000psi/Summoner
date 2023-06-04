class Demon {
    constructor(level, baseHP, baseAtt, baseDef, baseSpAtt, baseSpDef, baseSpeed, active = false) {

        this.level = level
        this.XP = 0

        this.active = active

        // Base stats represent the average maximum stat that a demon can reach at level 30.

        this.baseHP = baseHP
        this.baseAtt = baseAtt
        this.baseDef = baseDef
        this.baseSpAtt = baseSpAtt
        this.baseSpDef = baseSpDef
        this.baseSpeed = baseSpeed

        // the actual stats are calculated from the level and relevant base stat

        this.maxHP = this.deriveStatFromLevel(this.baseHP, level)
        this.att = this.deriveStatFromLevel(this.baseAtt, level)
        this.def = this.deriveStatFromLevel(this.baseDef, level)
        this.spAtt = this.deriveStatFromLevel(this.baseSpAtt, level)
        this.spDef = this.deriveStatFromLevel(this.baseSpDef, level)
        this.speed = this.deriveStatFromLevel(this.baseSpeed, level)

        this.HP = this.maxHP

        this.statusEffects = []

        // this.attack is currently just a placeholder for when i reimplement moves and proper attacks.

        this.attack = {
            actionType: "move",
            quick: false,
            basePower: 25
        }

    }

    levelUp() {

        // This function is used to determine if a demon has gained enough xp to increase in level, and execute that increase in level. It calls
        // increaseStatsOnLevelUp in order to execute that increase.

        let levelsAndXP = [[0, 0], [1, 100], [2, 225], [3, 350], [4, 500], [5, 700], [6, 950], [7, 1250], [8, 1675], [9, 2100], [10, 2600], [11, 3200], [12, 4000], [13, 5000], [14, 6200], [15, 7500], [16, 8100], [17, 9700], [18, 11700], [19, 14000], [20, 17000], [21, 21000], [22, 25000], [23, 30000], [24, 33000], [25, 37000], [26, 42000], [27, 45000], [28, 50000], [29, 60000], [30, Infinity],]




        this.XP -= levelsAndXP[this.level][1]
        this.level++

        this.increaseStatsOnLevelUp()


        if (this.XP > levelsAndXP[this.level][1]) {

            this.levelUp()
        }

    }

    increaseStatsOnLevelUp() {

        // modifies a demons stats on level up.  Gives a proportion of the demons base stat with some randomness to each stat. 

        function perStat(baseStat) {

            let statPerLevel = baseStat / 30   // the average stats per level

            let deviation = statPerLevel * 0.3 // 30% of unmodified single level to act as maximum for deviation

            let perLevelDeviated = statPerLevel + (Math.random() * deviation)  // adds reviation

            perLevelDeviated -= (Math.random() * deviation)  // removes deviation

            return perLevelDeviated
        }

        this.maxHP += perStat(this.baseHP)
        this.att += perStat(this.baseAtt)
        this.def += perStat(this.baseDef)
        this.spAtt += perStat(this.baseSpAtt)
        this.spDef += perStat(this.baseSpDef)
        this.speed += perStat(this.baseSpeed)



    }

    deriveStatFromLevel(baseStat, level) {

        // used when generating demons - takes the base stats and adds variation.

        let statPerLevel = baseStat / 30   // the average stats per level

        let exactStat = statPerLevel * level  // what the stat should be without deviation at the dedons level

        let deviation = exactStat * 0.3 // 30% of unmodified total to act as maximum for deviation

        let result = exactStat += (Math.random() * deviation)  // adds positive deviation

        result = exactStat -= (Math.random() * deviation)    // adds negative deviation

        return result

    }

    checkIfDied() {

        // checks if the demon is dead


        if (this.HP < 1) {


            return true
        }

        else {
            return false
        }
    }

    addStatusEffect(statusEffect) {

        // Status effects are dealt with in a stack which is executed in between rounds of battle. 
        // They persist for a certain ammount of turns.  This is how they are added to a demon by moves.

        this.statusEffects.push(statusEffect)

    }

    clearStatusEffects() {

        // cures the demon of all status effects.

        this.statusEffects = []
    }

    executeStatusEffects(selfOrOpponent) {

        /* This function goes through all of a demons status effects, and executes each one.  The status effect itself
        has an overTime method which makes changes to the status effect such as getting more severe or getting closer to
        no longer being in effect.  Some status effects occur on attacking turns, and others on defending turns. */

        for (let i in this.statusEffects) {

            let statusEffect = this.statusEffects[i]


            if (statusEffect.onTurn === selfOrOpponent) { // if status effect activates on relevant turn

                this.HP -= statusEffect.damage
                statusEffect.overTime()

            }

        }

    }

    kill() {

        // have a guess.  In future this should also remove status effects.

        this.HP = 0
    }


}

// Demon type classes


class DestructionDemon extends Demon {

    type = "Destruction"

}

class AbyssDemon extends Demon {

    type = "Abyss"

}

class ArcaneDemon extends Demon {

    type = "Arcane"

}

class DecayDemon extends Demon {

    type = "Decay"

}

class AncientDemon extends Demon {

    type = "Ancient"

}



// Individual demons

// Destruction demons

class Imp extends DestructionDemon {

    constructor(level, active) {
        super(level, 70, 92, 45, 132, 98, 116, active)
    }
    species = "Imp"
}

class HornedDemon extends DestructionDemon {

    constructor(level, active) {
        super(level, 110, 140, 92, 60, 60, 92, active)
    }
    species = "Horned Demon"
}

class Flamelurker extends DestructionDemon {

    constructor(level, active) {
        super(level, 60, 125, 120, 92, 50, 105, active)
    }
    species = "Flamelurker"
}

class Infernal extends DestructionDemon {

    constructor(level, active) {
        super(level, 92, 87, 113, 81, 103, 76, active)
    }
    species = "Infernal"
}

class Sedimentite extends DestructionDemon {

    constructor(level, active) {
        super(level, 160, 110, 65, 65, 110, 40, active)
    }
    species = "Sedimentite"
}

class StormDemon extends DestructionDemon {

    constructor(level, active) {
        super(level, 80, 92, 100, 120, 60, 100, active)
    }
    species = "Storm Demon"
}


// Abyss demons

class Voidwalker extends AbyssDemon {

    constructor(level, active) {
        super(level, 130, 95, 75, 92, 88, 72, active)
    }
    species = "Voidwalker"
}

class Succubus extends AbyssDemon {

    constructor(level, active) {
        super(level, 105, 100, 70, 88, 92, 97, active)
    }
    species = "Succubus"
}

class SoulEater extends AbyssDemon {

    constructor(level, active) {
        super(level, 75, 78, 48, 156, 90, 92, active)
    }
    species = "Soul Eater"
}

class SpiderDemon extends AbyssDemon {

    constructor(level, active) {
        super(level, 102, 145, 130, 26, 33, 120, active)
    }
    species = "Spider Demon"
}

class VoidTerror extends AbyssDemon {

    constructor(level, active) {
        super(level, 103, 110, 78, 119, 63, 78, active)
    }
    species = "Void Terror"
}

class AbyssalDemon extends AbyssDemon {

    constructor(level, active) {
        super(level, 85, 115, 87, 103, 92, 76, active)
    }
    species = "Abyssal Demon"
}


// Arcane demons

class AlchemicalTrickster extends ArcaneDemon {

    constructor(level, active) {
        super(level, 70, 60, 92, 100, 117, 113, active)
    }
    species = "Alchemical Trickster"
}

class DreamWeaver extends ArcaneDemon {

    constructor(level, active) {
        super(level, 85, 80, 80, 95, 80, 130, active)
    }
    species = "Dream Weaver"
}

class PortaEntity extends ArcaneDemon {

    constructor(level, active) {
        super(level, 170, 50, 100, 50, 70, 110, active)
    }
    species = "Portal Entity"
}

class CrystalDemon extends ArcaneDemon {

    constructor(level, active) {
        super(level, 100, 90, 120, 67, 130, 50, active)
    }
    species = "Crystal Demon"
}

class Spellthief extends ArcaneDemon {

    constructor(level, active) {
        super(level, 70, 74, 67, 78, 134, 132, active)
    }
    species = "Spellthief"
}

class SceptreDemon extends ArcaneDemon {

    constructor(level, active) {
        super(level, 100, 30, 110, 125, 150, 40, active)
    }
    species = "Sceptre Demon"
}


// Decay demons

class Mort extends DecayDemon {

    constructor(level, active) {
        super(level, 98, 88, 88, 97, 79, 103, active)
    }
    species = "Mort"
}

class FleshTower extends DecayDemon {

    constructor(level, active) {
        super(level, 240, 100, 30, 100, 60, 20, active)
    }
    species = "Flesh Tower"
}

class NoxiousSpirit extends DecayDemon {

    constructor(level, active) {
        super(level, 92, 97, 92, 115, 51, 107, active)
    }
    species = "Noxious Spirit"
}

class SentientOoze extends DecayDemon {

    constructor(level, active) {
        super(level, 130, 103, 103, 103, 75, 40, active)
    }
    species = "Sentient Ooze"
}

class Plaguebearer extends DecayDemon {

    constructor(level, active) {
        super(level, 169, 57, 92, 93, 76, 68, active)
    }
    species = "Plaguebearer"
}

class Swarmsoul extends DecayDemon {

    constructor(level, active) {
        super(level, 40, 180, 45, 57, 119, 112, active)
    }
    species = "Swarmsoul"
}


// Ancient demons

class Satyr extends AncientDemon {

    constructor(level, active) {
        super(level, 95, 120, 60, 80, 88, 112, active)
    }
    species = "Satyr"
}

class RuneDemon extends AncientDemon {

    constructor(level, active) {
        super(level, 103, 65, 156, 58, 88, 68, active)
    }
    species = "Rune Demon"
}

class FadedWarrior extends AncientDemon {

    constructor(level, active) {
        super(level, 143, 133, 129, 58, 39, 52, active)
    }
    species = "Faded Warrior"
}

class Chupacabra extends AncientDemon {

    constructor(level, active) {
        super(level, 66, 139, 134, 32, 50, 133, active)
    }
    species = "Chupacabra"
}

class DrownedCourtier extends AncientDemon {

    constructor(level, active) {
        super(level, 99, 134, 34, 126, 74, 92, active)
    }
    species = "Drowned Courtier"
}

class TitanicVisage extends AncientDemon {

    constructor(level, active) {
        super(level, 92, 78, 109, 68, 110, 99, active)
    }
    species = "Titanic Visage"
}


export { Imp, HornedDemon, Flamelurker, Infernal, Sedimentite, StormDemon, Voidwalker, Succubus, SoulEater, SpiderDemon, VoidTerror, AbyssalDemon, AlchemicalTrickster, DreamWeaver, PortaEntity, CrystalDemon, Spellthief, SceptreDemon, Mort, FleshTower, NoxiousSpirit, SentientOoze, Plaguebearer, Swarmsoul, Satyr, RuneDemon, FadedWarrior, Chupacabra, DrownedCourtier, TitanicVisage }

// const example = new Imp(0, true)

// console.log(example)

// example.levelUp()

// console.log(example)

