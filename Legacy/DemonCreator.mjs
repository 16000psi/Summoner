const destruction = "destruction"
const scourge = "scourge"
const nature = "nature"
const light = "light"
const abyss = "abyss"
const somatic = "somatic" 

function statGen (factor, level) {


    let result = 0

    let base = factor * level

    result += base

    result +=(((base) / 10) * Math.random())

    result -= (((base) / 10) * Math.random())

    if (result > 100) {
        result = 100

    } else if (result < 0) {
        result = 0
    }

    return Math.round(result)
}

function moveGen (level, species) {

    let moveSlotsLevel = Math.floor (((level - 5)/ 5))  // get the number of extra moves on top of the one minimum

    let possibleMoves = []   // array for all the moves which contain demon name in the canTeach array

    let knownMoves = []    // result

    let knownMoveNames = []         // used for comparison later on to stop moves being added twice

    for (let i of Object.keys(MOVES)) {           // makes list of all teachable moves
        if (MOVES[i].canLearn.includes(species)) {

            possibleMoves.push(MOVES[i])

        }
    }

    // this bit adds the first move 

    let firstSelected = possibleMoves[[Math.floor(Math.random() * possibleMoves.length)]]
    knownMoves.push(firstSelected)
    knownMoveNames.push(firstSelected.name)



    for (let i = 0; i < moveSlotsLevel && i < 3 && i < (possibleMoves.length - 1); i ++) {  // loops up to three more times adding moves

        let nextSelectedMove = (possibleMoves[[Math.floor(Math.random() * possibleMoves.length)]])

        if (!(knownMoveNames.includes(nextSelectedMove.name))) {               // as long as the moves havent already been added

            knownMoves.push(nextSelectedMove)
            knownMoveNames.push(nextSelectedMove.name)
        }

        else if (knownMoveNames.includes(nextSelectedMove.name)) {  // if move was already added, do another loop and don't count this one

            i --
        }
    }

    let emptyObjectsToAdd = 4 - knownMoves.length

    for (let i = 0; i < emptyObjectsToAdd; i ++) {   // adds empty objects up to four

        knownMoves.push({})
    }



    return knownMoves

}

function ppGen (knownMoves) {

    let result = []

    for (let i of knownMoves) {

        if (Object.keys(i).length > 0) {

            result.push(i.maxPP)



        } else {
            result.push(0)
        }
    }

    return result
}

const MOVES = {

    struggle :  {

        name: "Punch self in face",
        type: somatic,
        mode: "physical",
        baseDamageMod: 1,
        selfDamageMod: 0,
        selfEffect: "none",
        enemyEffect: "none",
        maxPP: 100000000,
        message: "ATTACKER punches DEFENDER in the face.",
        tomeCost: 300000,
        canLearn: ["all"]
        


    },

    tackle : {

        name: "Tackle",
        type: somatic,
        mode: "physical",
        baseDamageMod: 1.4,
        selfDamageMod: 0.02,
        selfEffect: "none",
        enemyEffect: "none",
        maxPP: 10,
        message: "ATTACKER tackles DEFENDER to the ground!",
        tomeName: "Treatise On Wrestling",
        tomeCost: 300,
        canLearn: ["Imp", "Void Walker", "Fetid Shadow"]
    },

    fireball : {

        name: "Fireball",
        type: destruction,
        mode: "mental",
        baseDamageMod: 1.7,
        selfDamageMod: 0.05,
        selfEffect: "none",
        enemyEffect: "random 0.9",
        maxPP: 10,
        message: "ATTACKER launches a fireball at DEFENDER!",
        tomeName: "On The Kinetics of Fire Throwing",
        tomeCost: 500,
        canLearn: ["Imp", "Void Walker", "Noble Spirit"]
    },

    enshroud : {

        name: "Enshroud",
        type: abyss,
        mode: "physical",
        baseDamageMod: 0.8,
        selfDamageMod: 0,
        selfEffect: "none",
        enemyEffect: "agi 0.8",
        maxPP: 10,
        message: "ATTACKER envelopes DEFENDER in a mass of smoke!",
        tomeName: "The Tendrils Of The Abyss",
        tomeCost: 300,
        canLearn: ["Imp", "Void Walker", "Fetid Shadow"]
    },

    naturesGrasp: {

        name: "Natures Grasp",
        type: nature,
        mode: "physical",
        baseDamageMod: 1.2,
        selfDamageMod: 0,
        selfEffect: "none",
        enemyEffect: "none",
        maxPP: 10,
        message: "ATTACKER grips DEFENDER with a thorny appendage!",
        tomeName: "The Trough Of Bowland",
        tomeCost: 300,
        canLearn: [ "Void Walker", "Fetid Shadow", "Noble Spirit", "bastard"]
    },

    divineHammer : {

        name: "Divine Hammer",
        type: light,
        mode: "physical",
        baseDamageMod: 1.4,
        selfDamageMod: 0.02,
        selfEffect: "none",
        enemyEffect: "str 0.9",
        maxPP: 10,
        message: "ATTACKER strikes DEFENDER with rightcheous fury!",
        tomeName: "Absolution of The Damned",
        tomeCost: 300,
        canLearn: ["Void Walker", "Noble Spirit"]
    },

    witheringTorrent : {

        name: "Withering Torrent",
        type: scourge,
        mode: "mental",
        baseDamageMod: 1.1,
        selfDamageMod: 0.05,
        selfEffect: "none",
        enemyEffect: "random 0.8",
        maxPP: 10,
        message: "ATTACKER overwhelms DEFENDER with a wave of putrid decay!",
        tomeName: "Walls of Decay",
        tomeCost: 300,
        canLearn: ["Void Walker", "Fetid Shadow"]
    },

    scratch : {

        name: "Scratch",
        type: somatic,
        mode: "physical",
        baseDamageMod: 0.7,
        selfDamageMod: 0,
        selfEffect: "none",
        enemyEffect: "agi 0.95",
        maxPP: 10,
        message: "ATTACKER scratches DEFENDER!",
        tomeName: "Animalistic Straits",
        tomeCost: 300,
        canLearn: ["Imp", "Void Walker", "Fetid Shadow", "Noble Spirit"]
    },
}

const demonConstructors = {
    Imp : class {
        constructor(level) {
            this.nickName = "none"
            this.active = "true"
            this.type = "destruction"
            this.genus = "Imp"
            this.species = "Imp"
            this.maxHP = (level * 20) 
            this.hP = this.maxHP
            this.level = level
            this.xp = 0
            this.str = statGen (1.3, level)
            this.agi = statGen (2, level)
            this.def = statGen (1, level)
            this.pow = statGen (3, level)
            this.knownMoves = moveGen(level, this.species)
            this.movePP = ppGen(this.knownMoves)
        }
    }
}


const demon1 = new demonConstructors.Imp (16)

console.log(demon1.knownMoves, demon1.movePP)

/*


{  // Demon 1
    id: iDGenerator(iDListArray),
    nickname: "mega bastard",
    active: true,
    type: destruction,
    genus: "Imp",
    species: "Imp",
    maxHP: 456,
    hP: 456,
    level: 1,
    xp: 0,
    str: 34,
    agi: 54,
    def: 32,
    pow: 23,
    movePP: [3,23,4,2],
    knownMoves: [
        MOVES.tackle,
        MOVES.fireball,
        {},
        {}
    ]
}

*/

function statVarianceGenerator (factor, level) {

    let result = 0

    let base = factor * level

    result += base

    result += ((base) / 10) * Math.random
    result -= ((base) / 10) * Math.random

    return Math.round(result)
}