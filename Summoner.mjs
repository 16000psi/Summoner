
import inquirer from 'inquirer';

////  UTILITIES

let debugMode = true // flag which turns debug mode on and off.  Debug mode settings are below. Can be set on title menu buy entering 'debug'


const debugModePreservesConsole = false // If debug mode prints something instead of clearing the console
const debugModePrintDemonIDs = false // If debug mode and console preserve enabled, prints Demon IDs instead of clearing console
const debugModePrintEnemyPP = false // If debug mode prints PP of enemy moves 
const debugModeChangesInventory = true  // if debug mode uses premade Demon inventory instead of empty one
const debugModeChangesEnemyInventory = true  // if debug mode uses premade enemy Demon inventory instead of empty one
const debugModeLaunchBattle = false // if debug mode launches battle on player turn rather than intro page
const debugModeLaunchEnemyTurn = false // if debug mode launches enemy turn 
const debugModeAttacksAlwaysMiss = false  // If debug mode all attacks miss or are resisted
const debugModeNoAttacksAvailable = false // If debug mode no attacks will be available and only option will be punch self in face
const debugModeAllAttacksFatalForDefender = false // If debug mode every successful attack will kill the defender
const debugModeAllAttacksFatalForAttacker = false // If debug mode every successful attack will kill the attacker
const debugModeAlwaysEnemyTurn = false // If debug mode then every combat turn will be for the enemy
const debugModeAlwaysPlayerTurn = false  // If debug mode then every combat turn will be for the player
const debugModeGodMode = true // if debug mode gives player demons 10000 stats in battle
const debugModeBonusXP = 0 // if debugmode gives this ammount of xp extra after battle 

// Global variables for preventing spelling mistakes

const destruction = "destruction"
const scourge = "scourge"
const nature = "nature"
const light = "light"
const abyss = "abyss"
const somatic = "somatic"  // used only for attacks to which nothing is resistant / weak

// GLOBAL VARIABLES FOR ATTACK FUNCTIONS

const superEffectiveMod = 2
const uneffectiveMod = 0.5


function consoleClear(GS){    /// Function to be used instead of console.clear which can also print useful info in debug mode

    if ((!(debugMode)) || (!(debugModePreservesConsole))) {
        console.clear()
    } else if (debugModePreservesConsole === true && debugModePrintDemonIDs === false && debugModePrintEnemyPP === false) {
        console.log("")
        console.log("")
        console.log("")
    }

     else if (debugModePreservesConsole === true && debugModePrintDemonIDs === true) {  // prints Demon IDs instead of clearing console if enabled

        let DemonIDsList = []

        for (let i in GS.pWI) {

            if (Object.keys(GS.pWI[i]).length > 0) {
                DemonIDsList.push(GS.pWI[i].id)
            }
        }

        for (let i in GS.enemy.eWI) {

            if (Object.keys(GS.enemy.eWI[i]).length > 0) {
                DemonIDsList.push(GS.enemy.eWI[i].id)
            }

        }
        console.log("")
        console.log(DemonIDsList)
        console.log("")
    }

    else if (debugMode === true && debugModePrintEnemyPP === true) {

        console.log("")
        console.log(enemyActiveDemonLoader(GS).movePP)
        console.log("")


    }
}


//// LAUNCHER

function launcher (GS) {
    if (debugModeLaunchBattle && debugMode) {
        battleIntro(GS)
    } else if ((debugMode) && (debugModeLaunchEnemyTurn)) {

        initialStats(GS)
        enemyTurn (GS)
    } else {
        introPage(GS)
    }



    GS.libraryInventory = refreshLibraryInventory(GS)  // SETS LIBRARY INVENTORY

}



//// Intro and main menu functions


function introPage (GS) {    // introPage

    consoleClear(GS)
    inquirer
    .prompt([
        {
            name: "introPage",
            message: "Intro pagee text (press enter)"

        },
    ])
    .then(answers => {
        if (answers.introPage.toUpperCase() === "DEBUG") {
            debugMode = true
        }

   //     let GS = gameState  /// LOADS GAMESTATE


        if (answers.introPage !== NaN) {
            mainMenu(GS)

        }
    })


}

function mainMenu (GS) {


    consoleClear(GS)

    console.log("-        SUMMONER        -")
    console.log("")
    console.log(`${GS.playerName}    Soul Energy: ${GS.soulEnergy}`)
    console.log("")
    console.log(`Day ${GS.day}                    ${timeOfDay(GS)}`)
    console.log("")

    if (GS.displayAccessError !== "none") {  // diplsay access error is set as something other than none if player tries to access somewhere closed.
                                                 // This is so the menu can neatly tell the player what has happened.

        console.log(GS.displayAccessError)              

        console.log("")

        GS.displayAccessError = "none"



    }


    /// Following bit determines which places are open and if sleep is available and sets menu message accordingly.

    let sleepAvailable = false
    let sleepAvailableMessage = ""

    let libraryAvailable = false
    let libraryAccessMessage = "mainMenu() says: I'm broken.  Something about the time or library access logic is wrong."


    if (GS.time >= 5 && GS.time < 7) {

        sleepAvailable = true
        libraryAvailable = false
        sleepAvailableMessage = "It is getting late.\nTo sleep, enter S. "

        libraryAccessMessage = "\nThe library is closed at this hour."

        
        
    } 

    else if (GS.time >= 7) {
        sleepAvailable = true
        libraryAvailable = false

        sleepAvailableMessage = "You are falling asleep where you stand.\nTo sleep, enter S. "
        libraryAccessMessage = "\nThe library is closed at this ungodly hour."
    }

    else if (GS.time < 5 && GS.time > 0) {
        sleepAvailable = false
        libraryAvailable = true
        sleepAvailableMessage = ""
    }

    else if (GS.time < 1) {
        sleepAvailable = false
        libraryAvailable = false
        sleepAvailableMessage = ""

        libraryAccessMessage = "\nIt is too early for the Library to be open.  Try again at 9am."
    }

    ///

    let menuMessage = sleepAvailableMessage + "To view your Demons, enter A. To go to the Library, enter L"


    inquirer
    .prompt([
        {
            name: "mainMenu",
            message: menuMessage

        },
    ])
    .then ( answers  => {

        consoleClear(GS)
        


        if (answers.mainMenu.toUpperCase() === "A") {  // view demon menu
            demonInventory(GS)
            demonInventoryMenu (GS)

        }

        else if (answers.mainMenu.toUpperCase() === "L") {  // go to the library

            if (libraryAvailable) {                    // if it's the library's open hours

                goneToTheLibrary(GS)

            }

            else if (!(libraryAvailable)) {   // if the library is closed, set display error to something so that it will be displayed with the menu being repeated

                GS.displayAccessError = libraryAccessMessage

                mainMenu(GS)
                
            }
        }

        else if (answers.mainMenu.toUpperCase() === "S") {  // go to sleep

            if (sleepAvailable) {   // if correct time of day, initiate sleep

                sleepInitiated(GS)
            }

            else if (!(sleepAvailable)) {   // if it's not, just reload the main menu

                mainMenu(GS)
            }
        }

        else if (answers.mainMenu.toUpperCase() === "WAIT") {  // if debugmode enabled, player can wait 3 hours by entering wait

            if (debugMode) {

                GS.time += 1
                mainMenu(GS)
            }
            else if (!(debugMode)) {

                mainMenu(GS)
            }
        }
        
        else if                                                              // invalid input
        (answers.mainMenu.toUpperCase() !== "A" &&
        answers.mainMenu.toUpperCase() !== "S"
        ) 
        {
            mainMenu(GS)
        }
    })
}

//// Time and Sleep functions

function timeOfDay (GS) {  // takes time number 0-7 and returns a "xpm" string from 6am to 3am.

    let t = GS.time

    if (t > 7) {  // sets time to 7 / 3am if it's somehow bigger than that
        t = 7
    }

    switch (t) {
        case 0:
            return "6am"
        case 1:
            return "9am"
        case 2:
            return "12pm"
        case 3:
            return "3pm"
        case 4:
            return "6pm"
        case 5:
            return "9pm"
        case 6:
            return "12am"
        case 7:
            return "3am"

    }

    
}

function calculateWakeUpTime (GS) { // sets the waking up time based on when the player went to bad with chances of sleeping in

    if (GS.time > 7) {  // sets time to 7 / 3am if for some reason it's bigger than that
        GS.time = 7
    }

    GS.time -= 5

    let sleepIn = Math.round(Math.random()) 
    let sleepInLate = Math.round(Math.random())

    if (GS.time === 2) {  // if user went to bed at 3 am

        if (sleepIn && sleepInLate) {  // 25% chance of getting up at 3pm
            GS.time = 3
        }
        else if (sleepIn || sleepInLate) {   // 50% chance of getting up at 12pm
            GS.time = 2
        }
        else {                        // 25% chance of getting up at 9am
            GS.time = 1
        }

    }

    else if (GS.time === 1) {  // if user went to bed at 12 am

        if (Math.random() > 0.9) {  // 10% chance of getting up at 12. If this random roll fails then there is a ...
            GS.time = 2
        }

        else if (sleepIn || sleepInLate) {  // 75% chance of getting up at 9am
            GS.time = 1
        }
        else {                        // 25% chance of getting up at 6am
            GS.time = 0
        }


    }



}

function sleepInitiated (GS) { // enter to continue that displays when player decides to go to sleep.  

    consoleClear(GS)

    console.log("")
    console.log("You enter your bedchamber to try and get some sleep.")
    console.log("")

    inquirer
    .prompt
    ([
        {
            name: "sleepInitiated",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {
        
        if (answers.sleepInitiated === "") {

            sleeping (GS)

        }
        else if (answers.sleepInitiated !== "") {
            sleepInitiated(GS)
        }
    })
}

function sleeping (GS) {  // Displays dreams / nigthmares.  Also advances day.    UNFINISHED


    let sleepString = "PLACEHOLDER SLEEP STRING "

    consoleClear(GS)

    console.log("")
    console.log(sleepString)
    console.log("")

    inquirer
    .prompt ([
        {
            name: "sleeping",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.sleeping === "") {

            calculateWakeUpTime(GS)  



            GS.day += 1       // advances the day

            dayPassedRefreshInventories (GS)

            morningMessage(GS)


        }

        else if (answers.sleeping !== "") {

            sleeping(GS)
        }


    })
}

function morningMessage (GS) {  // Continue and message that gets displayed indicating when the player woke up

    consoleClear(GS)

    let awakenText = "Wow, what a night!  morningMessage() says : 'I'm broken.  Somthing isnt setting the time of day correctly.'"
    let message = "This isn't right either!!"

    if (GS.time === 3) {
        awakenText = "You manage to drag yourself from your chambers mid-afternoon, \nafter sleeping-in spectacularly."
        message = "What a pitty. "
    }
    else if (GS.time === 2) {
        awakenText = "You awake from whatever type of slumber you were having at midday, \nget dressed hurriedly and leave your bedroom."
        message = ""
    }
    else if (GS.time === 1) {
        awakenText = "You get up and dress yourself after your night's rest."
        message = ""
    }
    else if (GS.time === 0) {
        awakenText = "You awake bright and early."
        message = "The day is young. "
    }

    console.log("")
    console.log(awakenText)
    console.log("")

    message = message + "Enter to continue..."

    inquirer
    .prompt
    ([
        {
            name: "morningMessage",
            message: message
        }
    ])
    .then (answers => {

        if (answers.morningMessage === "") {

            mainMenu(GS)



        }
        else if (answers.morningMessage !== "") {
            morningMessage(GS)
        }
    })



}

function dayPassedRefreshInventories (GS) {  // called every new day.  Checks to see if inventories need changing and does that

    /// Library inventory   --- refreshes the library inbventory every three days

    let day = parseInt(GS.day)
    let refreshDay = day % 3
    if (refreshDay === 0) {


        GS.libraryInventory = refreshLibraryInventory(GS)
    }



}


//// Library Functions

function goneToTheLibrary (GS) {  // takes stage of the story player is at and launches appropriate library related function

    if (GS.playerHasAccessedLibrary === false) {

        introductionToLibrary1 (GS)
    }

    else if (GS.playerHasAccessedLibrary) {

        consoleClear(GS)
        
        console.log("")

        console.log("You walk accross the grounds to the library.")
        console.log("You push open the heavy barrier door end enter.")

        console.log("")

        inquirer
        .prompt
        ([
            {
                name: "goneToTheLibrary",
                message: "Enter to continue..."
            }
        ])
        .then (answers => {

            if (answers.goneToTheLibrary === "") {

                libraryMainMenu(GS)
            }
            else if (answers.goneToTheLibrary !== "") {

                goneToTheLibrary(GS)
            }
        })


    }
}

function libraryMainMenu (GS) {

    consoleClear(GS)

    console.log("")
    console.log("The library fire is roaring and the librarian is examining several books at the desk.")
    console.log("")

    if (GS.displayAccessError !== "none") {  

        console.log(GS.displayAccessError)
        console.log("")

        GS.displayAccessError = "none"
    }

    

    inquirer
    .prompt 
    ([
        {
            name: "libraryMainMenu",
            message: "Enter B to take out books, and X to exit."
        }
    ])
    .then (answers => {

        if (answers.libraryMainMenu.toUpperCase() === "B") {  // NEED TO IMPLEMENT LIBRARY

            if (GS.libraryAccessEnabled === true) {

                viewAvailableBooks(GS)
            }

            else if (GS.libraryAccessEnabled === false) {

                GS.displayAccessError = "You are not permitted to take out books yet. Come back later."

                libraryMainMenu(GS)


            }
        }

        else if (answers.libraryMainMenu.toUpperCase() === "X") {   // if user decides to exit

            leavingLibraryMessage(GS)
        }

        else if (answers.libraryMainMenu.toUpperCase() !== "X") {

            libraryMainMenu(GS)
        }
    })
}

function viewAvailableBooks (GS) {  // Displays the three viewable books and menu for viewing in detail

    consoleClear(GS)

    console.log("-     BOOK RETURN PILE     -")
    console.log("")

    for (let i in GS.libraryInventory) {

        let move = GS.libraryInventory[i]

        console.log(move.tomeName)
        console.log("")
    }

    inquirer
    .prompt
    ([
        {
            name: "viewAvailableBooks",
            message: "Enter 1 - 3 to view book.  X to exit."

        }
    ])
    .then (answers => {

        if (answers.viewAvailableBooks === "1" || answers.viewAvailableBooks === "2" || answers.viewAvailableBooks === "3") {

            let selectionIndex = (parseInt(answers.viewAvailableBooks) - parseInt(1))

            bookViewer(GS, selectionIndex)


        }
        else if (answers.viewAvailableBooks.toUpperCase() === "X") {

            libraryMainMenu(GS)
        }

        else if (answers.viewAvailableBooks !== "1" && answers.viewAvailableBooks !== "2" & answers.viewAvailableBooks !== "3" && answers.viewAvailableBooks.toUpperCase() !== "X") {

            viewAvailableBooks(GS)
        }
    })


}

function bookViewer (GS, selectionIndex) {  // Shows details of tome and the number of demons that can learn the move


    let teachableTallyMessage = ""

    let menuMessage = ""

    let move = GS.libraryInventory[selectionIndex]

    let teachableTally = tallyTeachableDemons(GS, move)

    let moveCanBeTaught = false

    if (teachableTally === 0) {

        teachableTallyMessage = "None of your demons can learn this move."

        menuMessage = "Enter X to exit."
    }

    else if (teachableTally > 0) {

        moveCanBeTaught = true

        teachableTallyMessage = `${teachableTally} of your demons can learn this move.`

        menuMessage = "Enter T to view the demons that can learn this move. Enter X to exit."
    }



    

    consoleClear(GS)

   


    console.log(`-   ${move.tomeName.toUpperCase()}  -`)
    console.log("")
    console.log(`This tome teaches ${move.name}.`)
    console.log("")
    console.log(`It costs ${move.tomeCost} SE to teach this move.`)
    console.log(teachableTallyMessage)
    console.log("")

    inquirer
    .prompt
    ([
        {
            name: "bookViewer",
            message: menuMessage
        }
    ])
    .then (answers => {
        if (answers.bookViewer.toUpperCase() === "T") {

            if (moveCanBeTaught) {

                teachableDemonsMenu (GS, move, selectionIndex)


            }

            else if (!(moveCanBeTaught)) {

                bookViewer(GS, selectionIndex)
            }

            
        }

        else if (answers.bookViewer.toUpperCase() === "X") {

            viewAvailableBooks(GS)

        }
        else if (answers.bookViewer.toUpperCase() !== "T" && answers.bookViewer.toUpperCase() !== "X") {

            bookViewer(GS, selectionIndex)
        }
    })
}

function teachableDemonsMenu (GS, move, bookViewerSelectionIndex) { // Menu for selecting the demon to teach a move

    consoleClear(GS)

    let teachableDemons = viewTeachableDemons(GS, move)

    if (displayAccessError !== "none") {

        console.log(displayAccessError)
        console.log("")

        displayAccessError = "none"
    }


    let menuMessage = ""

    if (teachableDemons.length === 1) {

        menuMessage = "Enter 1 to select the Demon to teach.  Enter X to exit."
    }

    else if (teachableDemons.length > 1) {

        menuMessage = `Enter 1-${teachableDemons.length} to select the Demon to teach.  Enter X to exit.`
    }

    let canTeach = false

    if (GS.soulEnergy >= move.tomeCost) {

        canTeach = true

        

        menuMessage = "Enter 1-4 to select slot. Enter X to cancel."
    }

    else if (GS.soulEnergy < move.tomeCost) {

        canTeach = false

        menuMessage = "You do not have enough Soul Energy to teach this move. \n Enter X to cancel."
    }


    inquirer
    .prompt
    ([
        {
            name: "teachableDemonsMenu",
            message: menuMessage
        }
    ])
    .then (answers => {

        let selectionIndex = (parseInt(answers.teachableDemonsMenu) - parseInt(1))

        if (parseInt(answers.teachableDemonsMenu) > teachableDemons.length) {  // if selection number is larger than the length of the array

            teachableDemonsMenu(GS, move, bookViewerSelectionIndex)           // rerun the menu
        }

        else if (answers.teachableDemonsMenu === "1" || answers.teachableDemonsMenu === "2" ||
        answers.teachableDemonsMenu === "3" || answers.teachableDemonsMenu === "4" ||
        answers.teachableDemonsMenu === "5" || answers.teachableDemonsMenu === "6" ) {   // if user selects a number

            if (testIfMoveKnown(move, teachableDemons[selectionIndex])) {   // if the move is already known

                canTeach = false

                displayAccessError = `This Demon already known ${move.name}.`

                teachableDemonsMenu(GS, move, bookViewerSelectionIndex)

                return   // stop "too many listeners" crash



            }




            if (canTeach) {

                if (teachableDemons[selectionIndex].hP < 1) {  // if demon is 0 hp.  

                displayAccessError = "This Demon needs to recover before you can teach it anything."

                teachableDemonsMenu(GS, move, bookViewerSelectionIndex)
                }

                else if (teachableDemons[selectionIndex].hP >= 1) {   // if demon is alive

                teachMoveMenu(GS, move, teachableDemons[selectionIndex], bookViewerSelectionIndex)
                }

            }

            else if (!(canTeach)) {

                teachableDemonsMenu(GS, move, bookViewerSelectionIndex)


            }

        }

        else if (answers.teachableDemonsMenu.toUpperCase() === "X") {  // if user exits exit to book desciption

            bookViewer (GS, bookViewerSelectionIndex)


        }

        else if (answers.teachableDemonsMenu.toUpperCase() !== "X" &&
        answers.teachableDemonsMenu !== "1" && answers.teachableDemonsMenu !== "2" &&
        answers.teachableDemonsMenu !== "3" && answers.teachableDemonsMenu !== "4" &&
        answers.teachableDemonsMenu !== "5" && answers.teachableDemonsMenu !== "6") {   // if selection invalid

            teachableDemonsMenu(GS, move, bookViewerSelectionIndex)

        }
    })
}

function teachMoveMenu (GS, move, demon, bookViewerSelectionIndex) {

    consoleClear(GS)

    displayDemonMoves(demon)


    inquirer
    .prompt
    ([
        {
            name: "teachMoveMenu",
            message: "Enter 1-4 to select slot. Enter X to cancel."
        }
    ])
    .then ( answers => {

        if (answers.teachMoveMenu === "1" || answers.teachMoveMenu === "2" || answers.teachMoveMenu === "3" || answers.teachMoveMenu === "4") {  // valid number for slot

            let selectionIndex = (parseInt(answers.teachMoveMenu) - parseInt(1))

            confirmTeachMove(GS, move, demon, bookViewerSelectionIndex, selectionIndex)
        }

        else if (answers.teachMoveMenu.toUpperCase() === "X") {  // exits

            teachableDemonsMenu(GS, move, bookViewerSelectionIndex)


        }

        else if (answers.teachMoveMenu !== "1" && answers.teachMoveMenu !== "2" && answers.teachMoveMenu !== "3" &&
         answers.teachMoveMenu !== "4" && answers.teachMoveMenu.toUpperCase() !== "X") {   // invalid selection

            teachMoveMenu (GS, move, demon, bookViewerSelectionIndex)


         }
    })
}

function confirmTeachMove(GS, move, demon, bookViewerSelectionIndex, teachMoveMenuSelectionIndex) {

    consoleClear(GS)

    displayDemonMoves(demon)

    let menuMessage = ""



    if (Object.keys(demon.knownMoves[teachMoveMenuSelectionIndex]).length > 0) {  // checks if move is present

        menuMessage = `This will overwrite ${demon.knownMoves[teachMoveMenuSelectionIndex].name} with ${move.name}.  This action cannot be undone.\nTeaching Demons is hard work and will likely take several hours. \nEnter Y to confirm or X to cancel.`
    }

    else if (Object.keys(demon.knownMoves[teachMoveMenuSelectionIndex]).length === 0) {

        menuMessage = `Teach ${demonName(demon)} ${move.name}?\nTeaching Demons is hard work and will likely take several hours. \nEnter Y to confirm or X to cancel.`
    }

    inquirer
    .prompt
    ([
        {
            name: "confirmTeachMove",
            message: menuMessage
        }
    ])

    .then (answers => {

        if (answers.confirmTeachMove.toUpperCase() === "Y") {

            demon.knownMoves[teachMoveMenuSelectionIndex] = move

            moveBeingTaught1 (GS, demon, move)


        }

        else if (answers.confirmTeachMove.toUpperCase() === "X") {

            teachMoveMenu (GS, move, demon, bookViewerSelectionIndex)

            
        }

        else if (answers.confirmTeachMove.toUpperCase() !== "Y" && answers.confirmTeachMove.toUpperCase() !== "X") {

            confirmTeachMove(GS, move, demon, bookViewerSelectionIndex, teachMoveMenuSelectionIndex)


        }
    })

}



function moveTaughtContinue (GS, demon, move) {

    consoleClear(GS)
    displayDemonMoves(demon)

    console.log("")

    console.log(`${demonName(demon)} successfully taught ${move.name}`)
    console.log("")

    inquirer
    .prompt
    ([
        {
            name: "moveTaughtContinue",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.moveTaughtContinue === "") {

            GS.time += 4

            if (GS.time > 7) {   // advances time
                GS.time = 7
            }

            GS.soulEnergy -= move.tomeCost    // takes soul energy away

            mainMenu(GS)
        }

        else if (answers.moveTaughtContinue !== "") {

            moveTaughtContinue (GS, demon, move)


        }
    })
}

function viewTeachableDemons (GS, move) {  // prints teachable demons for move and also returns an array containing demon objects that are teachable.

    console.log(`-   ${move.tomeName.toUpperCase()}  -`)
    console.log("")


    let teachableDemons = []

    for (let i in GS.pWI) {

        if (move.canLearn.includes(GS.pWI[i].species)) {

         

            teachableDemons.push(GS.pWI[i])


        }


    }

    for (let i in teachableDemons) {

        let nameString = ""

        if (teachableDemons[i].nickname !== "none") {

            nameString = (parseInt(i) + 1) + ": " + teachableDemons[i].species + " - \"" + demonName(teachableDemons[i]) + "\""


        }

        else {

            nameString = (parseInt(i) + 1) + ": " + teachableDemons[i].species 

        }

        console.log(`${nameString}`)

        if (testIfMoveKnown(move, teachableDemons[i])) {  // print if move is already known

            console.log("Move already known.")
        }

        else if (!(testIfMoveKnown(move, GS.pWI[i]))) {  // if move not already known

            if (teachableDemons[i].hP < 1) {           // print if demon is dead
                console.log("0 HP.  Must recover before teaching.")
            }

            else {
                console.log("")
            }

        }
        
    }

    console.log("")

    

    return teachableDemons

}

function testIfMoveKnown (move, demon) {  // returns a boolean for if the move is already known

    for (let i in demon.knownMoves) {

        if (Object.keys(demon.knownMoves[i].length > 0)) {

            if (move.name === demon.knownMoves[i].name) {

                return true
            }
        }
    }

    return false
}

function tallyTeachableDemons (GS, move) {  // returns a number which is the number of demons in the inventory that can learn a move


    let result = 0

    for (let i in GS.pWI) {

        if (Object.keys(GS.pWI[i]).length > 0) {

            if (testIfTeachable(GS.pWI[i], move)) {

                result ++
            }
        }
    }

    return result




}

function testIfTeachable (demon, move) {  // returns a boolean for  if a demon can learn a move



    if (move.canLearn.includes(demon.species)) {


        return true

    }

    else {

        return false

        
    }

    
}

function refreshLibraryInventory (GS) {  // returns an array of three moves (books) that are meant to replace the library inventory every 3 days

    let allowedMoves = []
    let resultNewInventory = []

    for (let i in Object.keys(MOVES)) {    /// pushes all moves except struggle onto the allowed moves inventory

        if (Object.keys(MOVES)[i] !== "struggle") {

            allowedMoves.push(MOVES[Object.keys(MOVES)[i]])
        }


    }

    let selectedMoveNames = []

    while (selectedMoveNames.length < 4) {

        let chosenMoveName = "none"

        let chosenMove = allowedMoves[Math.floor(Math.random() * allowedMoves.length)] // randomly selects a move from allowed moves

        chosenMoveName = chosenMove.name

        if (!(selectedMoveNames.includes(chosenMoveName))) {

            selectedMoveNames.push(chosenMoveName)
            resultNewInventory.push(chosenMove)
        }




    }

    if (resultNewInventory.length > 3) {
        resultNewInventory.pop()
    }

    return resultNewInventory


}










//// Demon Inventory Menu Functions

function demonInventoryMenu  (GS) { // Selection menu logic for Demon inventory
    inquirer
    .prompt([
        {
            name: "demonInventoryMenu",
            message: "Input 1-6 to view Demon. A to change active Demon. S to swap Demon positions. X to exit"
        }
    ])
    .then ( answers => {             
        if (answers.demonInventoryMenu.toUpperCase() === "X") {     // exit to main menu

            mainMenu(GS)

        }
        let selection = answers.demonInventoryMenu 
        if (selection === "1" || selection === "2" || selection === "3" || selection === "4" || selection === "5" || selection === "6") { // if selecting to view Demon 


            if (demonPressenceTester(GS, answers.demonInventoryMenu )){   // If Demon in slot, progress to Demon view

                consoleClear(GS)
                demonViewer (GS, answers.demonInventoryMenu )
                demonViewerMenu(GS, answers.demonInventoryMenu )


            } else {  // If no Demon in slot
                consoleClear(GS)
                demonInventory(GS)
                console.log("Demon slot Empty")
                demonInventoryMenu (GS)
            }
        }


        else if (answers.demonInventoryMenu .toUpperCase() === "A") {    // if user selects change active Demon
            consoleClear(GS)
            demonInventory(GS)   // prints inventory
            activeDemonChanger(GS)   // launches changing prompt interface

        }


        else if (answers.demonInventoryMenu .toUpperCase() === "S" ) {  // if user selects swap Demon

            consoleClear(GS)
            demonInventory(GS)
            swapDemon(GS)


        }
        

        else if (selection !== 1 && selection !== 2 && selection !== 3 && selection !== 4 && selection !== 5 && 
            selection !== 6 && selection.toUpperCase() !== "A" && selection.toUpperCase() !== "S" && selection.toUpperCase() !== "X" ) {   // if user selection invalid

            consoleClear(GS)
            demonInventory(GS)
            demonInventoryMenu (GS)
        }
        

    })
}

function demonInventory (GS) {    // Prints info for Demon inventory
    let invArray = Object.entries(GS.pWI)
    let resultDisplay = []
    for (let i in invArray) { // Extracts and processes info from inv array
        let slotNumber = (parseInt(i) + parseInt(1))   // adds 1 to index to diplay slot number

        let inventoryDispEntry = "Slot " + slotNumber + " is empty."  // text for if slot is empty


        if (Object.keys(invArray[i][1]).length !== 0) {   // if slot isnt empty make a string with its info

            inventoryDispEntry = `Slot ${slotNumber}: level ${invArray[i][1].level} ${invArray[i][1].species}. HP: ${invArray[i][1].hP}/${invArray[i][1].maxHP}`


            if (invArray[i][1].nickname !== "none") {  // if there is a nickname add that to the string

                inventoryDispEntry = inventoryDispEntry + " - '" + invArray[i][1].nickname + "'"
            }
        }

        if (invArray[i][1].active) {  // if active Demon display that

            inventoryDispEntry = inventoryDispEntry + " - " + "ACTIVE"
        }


        invArray[i][1] = inventoryDispEntry  // adds entry to result array to be displayed
        resultDisplay.push(inventoryDispEntry)
    }
    for (let j in resultDisplay) { // Prints the info 
        console.log(resultDisplay[j])
    }

}

function demonPressenceTester (GS, selection) {  // tests if the selected slot in the Demon menu has a Demon in it
    let selectionIndex = (parseInt(selection)) - (parseInt(1))  // takes the selection into array indexing
    let invArray = Object.entries(GS.pWI)
    if (Object.keys(invArray[selectionIndex][1]).length !== 0) {   // if the object has a non zero number of keys (isnt empty)
        return true                                                //  then it is there!
    } else {                                                     // otherwise there must be no Demon in that slot
        return false
    }

}

function demonAliveTester (GS, selection) { // tests if selected slot in Demon menu has a Demon in it and that Demon has health

    let selectionIndex = (parseInt(selection)) - (parseInt(1))  // takes the selection into array indexing
    let invArray = Object.entries(GS.pWI)
    if (Object.keys(invArray[selectionIndex][1]).length !== 0) {   // if the object has a non zero number of keys (isnt empty)


        if (invArray[selectionIndex][1].hP > 0) {
                                              //  then it is there!

            return true  
        }

    } else {                                                     // otherwise there must be no Demon in that slot
        return false
    }



}

function demonViewerMenu (GS, selection) {  // prompt and conditional logic for Demon viewer menu

    inquirer
    .prompt
    ([
        {
            name: "viewerMenuSelection",
            message: "Press N to change nickname.  Press X to exit"

        }
    ])
    .then ( answers => {

        let a = answers.viewerMenuSelection.toUpperCase()   // sets selection variable to use in long conditionals for readability

        if (answers.viewerMenuSelection.toUpperCase() === "N") {  // if user wants to change nickname

            consoleClear(GS)                     
            demonViewer (GS, selection)
            nicknameChanger(GS, selection)       // launches nickname changer 
        }

        else if (answers.viewerMenuSelection.toUpperCase() === "X") {  // goes back to inventory if user input X

            consoleClear(GS)
            demonInventory(GS)
            demonInventoryMenu (GS)
        }

        else if (a !== "N" && a !== "X") {   // if the selection wasnt valid

            consoleClear(GS)
            demonViewer (GS, selection)
            demonViewerMenu(GS, selection)

        }



        

    })


}

function demonViewer (GS, selection) {      // display for Demon viewer
    let selectionIndex = (parseInt(selection)) - (parseInt(1))  // takes the selection into array indexing
    let selectedDemonObj = GS.pWI[selectionIndex]
    consoleClear(GS)

    console.log("Demon VIEWER")
    console.log("")
    if (selectedDemonObj.nickname !== "none") {    // if there is a nickname display it
        console.log(selectedDemonObj.nickname)
    }
    console.log(`Level ${selectedDemonObj.level} ${selectedDemonObj.species}.`)
    console.log("")
    console.log(`HP:  ${selectedDemonObj.hP}/${selectedDemonObj.maxHP}      XP: ${selectedDemonObj.xp}`)
    console.log(`Strength:  ${selectedDemonObj.str}          Agility:  ${selectedDemonObj.agi}`)
    console.log(`Defence:   ${selectedDemonObj.def}    Mental Acuity:  ${selectedDemonObj.pow}`)

}

function nicknameChanger(GS, selection) {   // takes user input and changes nickname of Demon

    inquirer
    .prompt 
    ([
        {
            name: "nicknameChanger",
            message: "Enter new nickname for Demon (enter 'none' to delete nickname):"
        }
    ])

    .then (answers => {

        let selectionIndex = (parseInt(selection)) - (parseInt(1))  // takes the selection into array indexing

        GS.pWI[selectionIndex].nickname = answers.nicknameChanger;   // alters the nickanem of the selected Demon in the game state

        consoleClear(GS)
        demonViewer (GS, selection)
        demonViewerMenu(GS, selection)
    })
}

function activeDemonChanger(GS) { // interface and logic for changing the active Demon // UNFINISHED - make it so that active Demon cannot have 0 hP
    inquirer
    .prompt
    ([
        {
            name: "activeDemonChanger",
            message: "1-6 to select active Demon, X to cancel."
        }
    ])
    .then( answers => {
        let selection = answers.activeDemonChanger
        if (selection === "1" || selection === "2" || selection === "3" || selection === "4" || selection === "5" || selection === "6") { // if user selects to change active



            let selectionIndex = (parseInt(selection) - 1)  // changes selection index to 0 indexing


            if (demonPressenceTester(GS, answers.activeDemonChanger) && GS.pWI[selectionIndex].hP === 0) {  // if demon has no health:

                consoleClear(GS)
                demonInventory(GS)
                console.log("Demon is too weak to be able to fight.")
                activeDemonChanger(GS)   // launches active changer interface

            }



            else if (demonPressenceTester(GS, answers.activeDemonChanger)){   // If Demon in slot, execute change active code

                for (let i in GS.pWI) {                             // erases active stance from all Demon
                    if (Object.keys(GS.pWI[i]).length === 0) {
    
                    } else {
                        GS.pWI[i].active = false
                    }
                }
    
                

                GS.pWI[selectionIndex].active = true             // change selected to active

                consoleClear(GS);
                demonInventory(GS);
                demonInventoryMenu (GS);


            } else {  // If no Demon in slot
                consoleClear(GS)
                demonInventory(GS)
                console.log("Demon slot Empty")
                activeDemonChanger(GS)   // launches active changer interface
            }

        }

        else if (answers.activeDemonChanger.toUpperCase() === "X") {  // if user chooses to exit then go to Demon inv menu
            consoleClear(GS)
            demonInventory(GS)
            demonInventoryMenu (GS)
        } else if (answers.activeDemonChanger !== NaN) {
            consoleClear(GS)
            demonInventory(GS)
            activeDemonChanger(GS)
        }



    })
}

function swapDemon (GS) { // menu and logic for swapping Demon
    inquirer
    .prompt
    ([
        {
            name: "swapSelection1",
            message: "Choose first Demon to move (1-6). X to cancel."

        }
    ])
    .then ( answers => {

        let selection = answers.swapSelection1
        if (selection === "1" || selection === "2" || selection === "3" || selection === "4" || selection === "5" || selection === "6") {  // if selection was number

            if (demonPressenceTester(GS, answers.swapSelection1)) {  // if there is a Demon in the selected slot

                let selectionIndexswap1 = ((parseInt(answers.swapSelection1)) - (parseInt(1))) // changing selection into zero indexing
                let tempDemon1 = GS.pWI[selectionIndexswap1]    // Copies selected Demon into temp slot 1 

                consoleClear(GS)
                demonInventory(GS)
                console.log(`You have selected the Demon in slot ${selection}`)

                inquirer
                .prompt
                ([
                    {
                        name: "swapSelection2",
                        message: "Choose a slot to swap with (1-6). X to cancel"
                    }
                ])

                .then ( answers => {               // what happens after the second input

                    let selection2 = answers.swapSelection2

                    if (selection2 === "1" || selection2 === "2" || selection2 === "3" || selection2 === "4" || selection2 === "5" || selection2 === "6") { // if selection valid number

                        let selectionIndexswap2 = ((parseInt(answers.swapSelection2)) - (parseInt(1)))    // changing second selection to zero indexing.

                        if (selectionIndexswap1 === selectionIndexswap2) {     // If both selections are the same (swap with self) cancel and take to Demon inv.
                            consoleClear(GS)
                            demonInventory(GS)
                            console.log("You selected the same slot twice and nothing has happened")
                            demonInventoryMenu (GS)


                        } else if (!(demonPressenceTester(GS, answers.swapSelection2))){             // if there is not a Demon present in the selected slot

                            GS.pWI[selectionIndexswap2] = tempDemon1                // pastes first selected Demon into empty slot
                            GS.pWI[selectionIndexswap1] = {}                          // erases the first slot


                            consoleClear(GS)                                            // taking back to menu
                            demonInventory(GS)
                            console.log("Demon successfully swapped into empty slot.")
                            demonInventoryMenu (GS)
                    
                        } else if (demonPressenceTester(GS, answers.swapSelection2)) {           // if there is a Demon present in the selected slot

                            let tempDemon2 = GS.pWI[selectionIndexswap2]        // copying second selection

                            GS.pWI[selectionIndexswap1] = tempDemon2         // pasting second Demon into first selection
                            GS.pWI[selectionIndexswap2] = tempDemon1         // pasting first Demon into second selection

                            consoleClear(GS)
                            demonInventory(GS)
                            console.log("Demon successfully swapped.")
                            demonInventoryMenu (GS)                           // back to inventory menu



                        }




                    }

                    else if (answers.swapSelection2.toUpperCase() === "X") {  // if user wants to exit (2nd selection)

                        consoleClear(GS)
                        demonInventory(GS)
                        demonInventoryMenu (GS)
                    }

                    else if (answers.swapSelection2 !== NaN) {    // if user input was invalid

                        consoleClear(GS)
                        demonInventory(GS)
                        console.log("Invalid input. Please select first Demon to swap again.")
                        swapDemon(GS)
                    }
                 })


            }
            
            else if (!(demonPressenceTester(GS, answers.swapSelection1))) { // if there is no Demon in the selected slot (1st seleciton)

                consoleClear(GS)
                demonInventory(GS)
                console.log("There is no Demon in that slot...")
                swapDemon(GS)

            }

        }

        else if (answers.swapSelection1.toUpperCase() === "X") {       // if user wants to exit (1st selection)

            consoleClear(GS)
            demonInventory(GS)
            demonInventoryMenu (GS)
        }

        else if (answers.swapSelection1 !== NaN) {           // if user input was invalid (not 1-6 or X) (1st selection)

            consoleClear(GS)
            demonInventory(GS)
            swapDemon(GS)
        }



    })
}

function displayDemonMoves (demon) {  // Diplays the moves a demon knows.

    console.log(`-   ${demonName(demon).toUpperCase()} MOVES   -`)

    console.log("")

    for (let i in demon.knownMoves) {


        if (Object.keys(demon.knownMoves[i]).length < 1) {  // empty slot

            console.log (`${(parseInt(i) + parseInt(1))}: - - - SLOT EMPTY - - - `)
            console.log ("")
        }

        else {   // slot with move in 

            console.log((`${(parseInt(i) + parseInt(1))}: ${demon.knownMoves[i].name}`))
            console.log("")
        }

        
    }

    console.log("")


}


//////////// Battle Functions
 
function battleIntro (GS) { // Intro splash to battle mode with logic for extracting messages and names from enemy WM / lone Demon  // also initialises stats

    initialStats(GS)   // Creates an array containing the stats of each demon going into the battle [str,agi,def,pow] in order to be reset at the end (to stop debuffs / buffs being permantent)


    if (debugMode === true && debugModeGodMode === true) {  // makes demon godlike if debug mode and god mode on

        for (let i in Object.keys(GS.pWI)) {

            if ( Object.keys(GS.pWI[i]).length > 0) {

                GS.pWI[i].str = 10000
                GS.pWI[i].agi = 10000
                GS.pWI[i].def = 10000
                GS.pWI[i].pow = 10000
            }
        }





    }

    




    function loneDemonIntroMessage () {  // subfunction which takes the battle intro message from the last Demon in the enemy inv
                                                    // (should always only be one as this is intended for random encounters)

        let result = ""

        for (let i in GS.enemy.eWI) {                  // iterates through the enemy inventory


            if (Object.keys(GS.enemy.eWI[i]).length !== 0) {
                result = GS.enemy.eWI[i].introMessage

            }
        }                            // function will take the last Demon for the name (there should only be one)

        return result

    }



    if (GS.enemy.enemyName !== "none") {   // if fighting a named enemy (landlord with an inventory of Demon)
        consoleClear(GS)
        console.log("")
        console.log(`${GS.enemy.enemyName} wants to fight your Demons!` )
        console.log("")


    } else if (GS.enemy.enemyName === "none") {     // if fighting a non-named enemy (intended to be single Demon)


        consoleClear(GS)

        console.log("")
        console.log(`${findEnemyName(GS)} wants to fight your tennants!`)
        console.log("")

    }

    inquirer
    .prompt
    ([
        {
            name: "battleIntro",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.battleIntro !== NaN) { // for any input

            if (enemyIntroMessage !== "none") {  // if the enemy has a master intro message (if the enemy is a named landlord)

                consoleClear(GS)

                console.log("")
                console.log(`${enemyName}: ${enemyIntroMessage}`)
                console.log("")

                
            } else if (enemyIntroMessage === "none") {  // if no master intro message, assumes single Demon in inv (lone encounter) 
                                                       // uses subfunction at start of this function to extract Demon intro message 
                consoleClear(GS)

                console.log("")
                console.log(`${findEnemyName(GS)}: ${loneDemonIntroMessage()}`)
                console.log("")

            }

            inquirer
            .prompt
            ([
                {
                    name: "introMessageContinue",
                    message: "Enter to continue..."
                }
            ])
            .then (answers => {

                if (answers.introMessageContinue !== NaN) {  // press enter to continue takes to battle menu

                    consoleClear(GS)
                    battleMenu(GS)
                    battleMenuLogic(GS)
                }



            })

        }
    })

}

function battleMenu (GS) {  // Displays information about the enemy, their active wkmn, the player and their active wkmn

    console.log("~           - ENEMY -           ~")


    console.log(`${nameDisplay(findEnemyName(GS))}  ${checkLivingDemon(GS.enemy.eWI)} / 6 Dmns`)  // enemy name and Demon no
    console.log(`DMN: ${demonNameDisplay(enemyActiveDemonLoader(GS))}   lvl ${enemyActiveDemonLoader(GS).level}`)

    if (enemyActiveDemonLoader(GS).nickname !== "none") {  // if there was a nickname displayed above also display species name next to HP

        console.log (`HP = ${enemyActiveDemonLoader(GS).hP} / ${enemyActiveDemonLoader(GS).maxHP}          ${enemyActiveDemonLoader(GS).species}`)


    } else {                                                    // otherwise just display HP
 
        console.log (`HP = ${enemyActiveDemonLoader(GS).hP} / ${enemyActiveDemonLoader(GS).maxHP} `)
    }

    console.log("")


    console.log("~           - PLAYER -           ~")


    console.log(`${nameDisplay(playerName)}  ${checkLivingDemon(GS.pWI)} / 6 Dmns`)        // player name and Demon no
    console.log(`DMN: ${demonNameDisplay(playerActiveDemonLoader(GS))}   lvl ${playerActiveDemonLoader(GS).level}`)

    if (playerActiveDemonLoader(GS).nickname !== "none") {      // if there was a nickname displayed above also diplay species name next to HP

        console.log (`HP = ${playerActiveDemonLoader(GS).hP} / ${playerActiveDemonLoader(GS).maxHP}         ${playerActiveDemonLoader(GS).species}`)


    } else {                                                      // otherwise just display HP

        console.log (`HP = ${playerActiveDemonLoader(GS).hP} / ${playerActiveDemonLoader(GS).maxHP} `)
    }

    console.log("")

 

}

function battleMenuLogic (GS) {  // TO COMPLETE

    inquirer
    .prompt ([
        {
            name: "battleMenuLogic",
            message: "A to attack. C to change Demon. I to use an Item. X to run."
        }
    ])
    .then (answers => {

        if (answers.battleMenuLogic.toUpperCase() === "A") {  // If user selects attack menu


            if ((debugMode === true && debugModeNoAttacksAvailable === true)) { // if debug mode on and relevant setting on, will act as if no moves available

                noAttacksSelection (GS)
            }



            else if (attackPossibleTester(playerActiveDemonLoader(GS))) {  // if Demon has available move

                consoleClear(GS)
                attackMenu(GS)
                attackSelection(GS)

            }
            
            
            else {                                 // if no available move (attack with struggle prompt)

                noAttacksSelection(GS)


                
            }




        }

        else if (answers.battleMenuLogic.toUpperCase() === "C") {  // if user wants to change Demon

            consoleClear(GS)
            demonInventory(GS)

            battleActiveDemonChanger(GS, "player", false)
        }
    })
}

function attackMenu (GS) { // Prints interface for menu selection

    console.log("-           MOVES           -")
    console.log("")

    for (let i in movesExtractor(playerActiveDemonLoader(GS))) {
        if (Object.keys(movesExtractor(playerActiveDemonLoader(GS))[i][0]).length > 1) {
            console.log(`${((parseInt(i)) + (parseInt(1)))}: PP ${movesExtractor(playerActiveDemonLoader(GS))[i][1]} / ${movesExtractor(playerActiveDemonLoader(GS))[i][2]}       ${movesExtractor(playerActiveDemonLoader(GS))[i][0].name}`)


        } else {

            console.log (`${((parseInt(i)) + (parseInt(1)))}:- - - - - EMPTY - - - - -`)


        }
        console.log("")
    } 


}

function attackSelection (GS) { // Menu logic for selecting a move to attack with 

    inquirer
    .prompt ([
        {
            name: "attackSelection",
            message: "Enter 1-4 to select attack, or X to cancel."
        }
    ])
    .then ( answers => {

        if (answers.attackSelection.toUpperCase() === "X") {  // user exits to main battle menu
            consoleClear(GS)
            battleMenu(GS)
            battleMenuLogic(GS)
        }

        else if (answers.attackSelection === "1") {  // attack in first slot

            if (selectedAttackValid(GS, answers.attackSelection)){  // if attack valid

                let moveObj = selectedMoveExtractor(playerActiveDemonLoader(GS), answers.attackSelection)

                consoleClear(GS)
                attackMenu(GS)
 
            //    console.log(`Use attack ${moveObj.name} against ${demonName(enemyActiveDemonLoader(GS))}?`)

                confirmMovePrompt(GS, answers.attackSelection)


                


                


            } else {                                            // if attack not valid repeat menu with message
                
                consoleClear(GS)
                attackMenu(GS)
                console.log("You have selected an invalid attack...")
                attackSelection(GS)

            }

        }

        else if (answers.attackSelection === "2") {  // attack in second slot

            if (selectedAttackValid(GS, answers.attackSelection)){  // if attack valid

                let moveObj = selectedMoveExtractor(playerActiveDemonLoader(GS), answers.attackSelection)

                consoleClear(GS)
                attackMenu(GS)
 
            //    console.log(`Use attack ${moveObj.name} against ${demonName(enemyActiveDemonLoader(GS))}?`)

                confirmMovePrompt(GS, answers.attackSelection)


                


                


            } else {                                            // if attack not valid repeat menu with message
                
                consoleClear(GS)
                attackMenu(GS)
                console.log("You have selected an invalid attack...")
                attackSelection(GS)

            }



            

            
        }

        else if (answers.attackSelection === "3") {  // attack in third slot

            if (selectedAttackValid(GS, answers.attackSelection)){  // if attack valid

                let moveObj = selectedMoveExtractor(playerActiveDemonLoader(GS), answers.attackSelection)

                consoleClear(GS)
                attackMenu(GS)
 
            //    console.log(`Use attack ${moveObj.name} against ${demonName(enemyActiveDemonLoader(GS))}?`)

                confirmMovePrompt(GS, answers.attackSelection)


                


                


            } else {                                            // if attack not valid repeat menu with message
                
                consoleClear(GS)
                attackMenu(GS)
                console.log("You have selected an invalid attack...")
                attackSelection(GS)

            }

            
        }

        else if (answers.attackSelection === "4") {  // attack in fourth slot

            if (selectedAttackValid(GS, answers.attackSelection)){  // if attack valid

                let moveObj = selectedMoveExtractor(playerActiveDemonLoader(GS), answers.attackSelection)

                consoleClear(GS)
                attackMenu(GS)
 
            //    console.log(`Use attack ${moveObj.name} against ${demonName(enemyActiveDemonLoader(GS))}?`)

                confirmMovePrompt(GS, answers.attackSelection)


                


                


            } else {                                            // if attack not valid repeat menu with message
                
                consoleClear(GS)
                attackMenu(GS)
                console.log("You have selected an invalid attack...")
                attackSelection(GS)

            }

            
        }

        else if (         // if not a valid response repeat the menu

            answers.attackSelection.toUpperCase() !== "X" &&
            answers.attackSelection !== "1" &&
            answers.attackSelection !== "2" &&
            answers.attackSelection !== "3" &&
            answers.attackSelection !== "4"

            ) {

                consoleClear(GS)
                attackMenu(GS)
                attackSelection(GS)


            }
    })



}

function noAttacksSelection (GS) { // For if there is no available attack to select 

    consoleClear(GS)
    attackMenu(GS)
    console.log("  !! No available moves !!")
    console.log("")

    inquirer
    .prompt
    ([
        {
            name: "noAttacksAvailablePrompt",
            message: "Enter 1 to punch self in face or X to go back"
        }
    ])
    .then (answers => {

        if (answers.noAttacksAvailablePrompt.toUpperCase() === "X") {  // if player cancels

            consoleClear(GS)
            battleMenu(GS)
            battleMenuLogic(GS)

        } 

        else if (answers.noAttacksAvailablePrompt === "1") {  // if player agrees to use struggle

            attackExecutor(GS, playerActiveDemonLoader(GS), playerActiveDemonLoader(GS), MOVES.struggle, "player")
        }

        else if (answers.noAttacksAvailablePrompt.toUpperCase() !== "X" && answers.noAttacksAvailablePrompt !== "1") {  // if invalid input

            noAttacksSelection(GS)
            
                        
        }
    })
}

function confirmMovePrompt (GS, selection) { // confirms if player wants to attack using specified move and launches attack executor if so 

    let moveObj = selectedMoveExtractor(playerActiveDemonLoader(GS), selection)
    console.log(`Use attack ${moveObj.name} against ${demonName(enemyActiveDemonLoader(GS))}?`)

    inquirer
    .prompt
    ([
        {
            name: "confirmMovePrompt",
            message: "Enter to continue or input X to cancel."
        }
    ])

    .then ( answers => {
        
        if (answers.confirmMovePrompt.toUpperCase() === "X") {  // if cancels repeat attack menu

            consoleClear(GS)
            attackMenu(GS)
            attackSelection(GS)
        }

        else if (answers.confirmMovePrompt === "") {   // if yes, attack 

            movePPReducer(GS, selection - 1, "player")   // reduces the PP of the used attack

            attackExecutor(GS, playerActiveDemonLoader(GS), enemyActiveDemonLoader(GS), moveObj, "player")


        }

        else if (answers.confirmMovePrompt !== "" && answers.confirmMovePrompt.toUpperCase() !== "X") {

            consoleClear(GS)
            attackMenu(GS)
            confirmMovePrompt(GS, selection)
        }
    })

    
}

function battleActiveDemonChanger (GS, whoseTurnIsIt, bothDied){ // Interface for changing Demon during battle

    inquirer
    .prompt
    ([
        {
            name: "battleActiveDemonChanger",
            message: "1-6 to change active Demon."
        }
    ])
    .then( answers => {
        let selection = answers.battleActiveDemonChanger
        if (selection === "1" || selection === "2" || selection === "3" || selection === "4" || selection === "5" || selection === "6") { // if user selects to change active


            demonAliveTester (GS, selection)



            if (demonPressenceTester(GS, answers.battleActiveDemonChanger)){   // If Demon in slot


                if (demonAliveTester (GS, answers.battleActiveDemonChanger)) { // If Demon in slot isnt dead

                    for (let i in GS.pWI) {                             // erases active stance from all Demon
                        if (Object.keys(GS.pWI[i]).length === 0) {
        
                        } else {
                            GS.pWI[i].active = false
                        }
                    }
        
                    let selectionIndex = (parseInt(selection) - 1)  // changes selection index to 0 indexing
    
                    GS.pWI[selectionIndex].active = true             // change selected to active


                    /// Then takes to press enter to continue page

                    battleActiveChangedContinue (GS, whoseTurnIsIt, bothDied)



    

                } else {   // If Demon in selected slot but it is inconcious

                    consoleClear(GS)
                    demonInventory(GS)
                    console.log("Selected Demon is unconcious!")
                    battleActiveDemonChanger(GS, whoseTurnIsIt, bothDied)   // launches battle active changer interface


                }


            } else {  // If no Demon in slot
                consoleClear(GS)
                demonInventory(GS)
                console.log("Demon slot Empty")
                battleActiveDemonChanger(GS, whoseTurnIsIt, bothDied)   // launches battle active changer interface
            }

        }

        else if (answers.activeDemonChanger !== NaN) {
            consoleClear(GS)
            demonInventory(GS)
            battleActiveDemonChanger(GS, whoseTurnIsIt, bothDied)

 
        }



    })


}

function battleActiveChangedContinue (GS, whoseTurnIsIt, bothDied) { // press enter to continue after Demon changed in battle

    consoleClear(GS)
    demonInventory(GS)
    console.log("Active Demon successfully changed.")

    inquirer
    .prompt
    ([
        {
            name: "battleActiveChangedContinue",
            message: "Press enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.battleActiveChangedContinue === "") {

            if (bothDied) {
                enemyNewDemonSummon(GS, whoseTurnIsIt)
            }

            else {

                nextTurn(GS, whoseTurnIsIt)
            }


            


        }

        else if (answers.battleActiveChangedContinue !== "") {

            battleActiveChangedContinue(GS,whoseTurnIsIt, bothDied)
        }
    })
}

function nextTurn (GS, whoseTurnIsIt) { // activates the next turn of the player or enemy depending on whose it just was

    if (debugMode) {
        if (debugModeAlwaysEnemyTurn) {
            whoseTurnIsIt = "player"
        }
        if (debugModeAlwaysPlayerTurn) {
            whoseTurnIsIt = "enemy"
        }
    }

    if (whoseTurnIsIt === "player") {

        enemyTurn(GS)
    }
    else if (whoseTurnIsIt === "enemy") {

        consoleClear(GS)
        battleMenu(GS)
        battleMenuLogic(GS)
    }


}


////////// Battle Utility Functions


function selectedAttackValid (GS, seleciton) {  // Returns a boolean for if the selected attack menu slot contains a move with PP 

    let arr = movesExtractor(playerActiveDemonLoader(GS))

    let selectionIndex = ((parseInt(seleciton)) - (parseInt(1)))  // changing selection to array indexing


    if (Object.keys(arr[selectionIndex][0]).length > 0 && arr[selectionIndex][1] > 0) {  // if there is move in slot and corresponding pp slot > 0 (move also has PP left)
        return true
    } else {
        return false
    }


}

function movesExtractor (Demon) { // returns a 4x3 array  = [{move}, current pp, max pp] x 4 of active Demon. Arg is Demon object

    let arr = []
    for (let i in Demon.knownMoves) {

        arr.push([

            Demon.knownMoves[i],
            Demon.movePP[i],
            Demon.knownMoves[i].maxPP

        ])
    }
    return arr

}

function selectedMoveExtractor (Demon, seleciton) { // returns the move object that is selected from the attack menu

    let selectionIndex = ((parseInt(seleciton)) - (parseInt(1)))
    let result = Demon.knownMoves[selectionIndex]
    return result

}

function attackPossibleTester (Demon) { // sees if Demon has any available pp for moves and returns a boolean. 

    let availableMoves = 0
    let arr = movesExtractor(Demon)

    for (let i in arr) {
        if (Object.keys(arr[i][0]).length > 0 && arr[i][1] > 0) { // for every slot that has a move with a corresponding pp aray slot > 0 (move with PP remaining)
            availableMoves += 1
        }
    }

    return !!availableMoves  // num to boolean











}

function findEnemyName (GS) {  // function which returns enemy name if enemy has name, if not then looks at eWI  
                                     // and takes the nickname of the last Demon (if there is no nickname then just takes species)
                                    // and returns it.

    let result = ""

    if (enemyName !== "none") {    // if enemy has a name just return that
        return enemyName
    }

    for (let i in GS.enemy.eWI) {                   // iterates through the enemy inventory
        if (Object.keys(GS.enemy.eWI[i]).length !== 0) {
            if (GS.enemy.eWI[i].nickname !== "none") {        // if there is a nickname
                result = GS.enemy.eWI[i].nickname
            } else if (GS.enemy.eWI[i].nickname === "none") {     // if there isnt
            result = GS.enemy.eWI[i].species
            }
        }
    }                               // function will take the last Demon for the name (there should only be one)

    let resultArr = result.split('')
    resultArr[0] = resultArr[0].toUpperCase()    // capitalises first letter for the look of it all

    return resultArr.join('')

}

function nameDisplay (name) {  // creates strings from names for display in battle menu.  Uses name as argument (or function which retreives name)
    let result = []
    let arr = name.split('')


    if (arr.length > 18) {        // if name longer than 18 characters, truncate it and add a "..."
        for (let i in arr) {
            if (i <= 18) {
                result.push(arr[i])
            }
        }
        result.push("...")
    }

    else if (arr.length <= 18) {  // if name under 22 characters, add spaces until it's length is 22

        let spacesAdded = 22 - (parseInt(name.length))

        for (let j in arr) {
            result.push(arr[j])
        }

        for (let n = 0; n < spacesAdded; n++) {
            result.push (" ")
        }
        
    }


    return result.join('')
}

function demonName (Demon) { // finds if Demon has nickname or not and returns that if so.  If not returns species.

    if (Demon.nickname === "none") {
        return Demon.species
    } else {
        return Demon.nickname
    }
}

function demonNameDisplay (Demon) {  // creates display string for Demon name.  Argument is Demon object (active Demon)

    let name = ""

    if (Demon.nickname === "none") {             // if Demon does not have nickname use its species
        name = Demon.species
        
    } else {                                          // else use its nickname
        name = Demon.nickname
    }



    let result = []
    let arr = name.split('')


    if (arr.length > 14) {        // if name longer than 18 characters, truncate it and add a "..."
        for (let i in arr) {
            if (i <= 14) {
                result.push(arr[i])
            }
        }
        result.push("...")
    }

    else if (arr.length <= 14) {  // if name under 22 characters, add spaces until it's length is 22

        let spacesAdded = 18 - (parseInt(name.length))

        for (let j in arr) {
            result.push(arr[j])
        }

        for (let n = 0; n < spacesAdded; n++) {
            result.push (" ")
        }
        
    }


    return result.join('')
}

function checkLivingDemon (demonInventory) { // Counts number of Demon with >0 health.  Argument is Demon inventory (enemy or player)
    let result = 0
    let arr = Object.values(demonInventory)  

    for (let i in arr){                              // if Demon slot not empty
        if (Object.entries(arr[i]).length !== 0) {

            if (arr[i].hP > 0) {                   // and health above zero
                result += 1                             // ... add one to the tally.
            } 
        }

    }
    return result
}

function playerActiveDemonLoader (GS) { // returns the active Demon object from the player inventory
    let arr = GS.pWI
    for (let i in arr) {
        if (arr[i].active === true) {
            return arr[i]
        }
    }
    return "Error: no active Demon"
}

function enemyActiveDemonLoader (GS) { // returns the active Demon object from the enemy inventory
    let arr = GS.enemy.eWI
    for (let i in arr) {
        if (arr[i].active === true) {
            return arr[i]
        }
    }
    return "Error: no active Demon"
}

function movePPReducer (GS, i, whoseTurnIsIt) { // reduces move PP in Demon object, i is index of move in knownMoves / movePP

    if (whoseTurnIsIt === "enemy") {

        enemyActiveDemonLoader(GS).movePP[i] = (enemyActiveDemonLoader(GS).movePP[i] - 1)
    }

    else if (whoseTurnIsIt === "player") {
        

        playerActiveDemonLoader(GS).movePP[i] = (playerActiveDemonLoader(GS).movePP[i] - 1)

    }

}

function initialStats (GS) {  // adds array to demon containing their stats at the beginning of battle so they can be used to redefine the stats after the battle [str, agi, def, pow]

    let pWI = GS.pWI

    for (let i in pWI) {
        if (Object.keys(pWI[i]).length > 0) {

            

            let demonStats = [GS.pWI[i].str, GS.pWI[i].agi, GS.pWI[i].def, GS.pWI[i].pow]

            GS.pWI[i].initialStats = demonStats

            GS.pWI[i].attacksInBattle = 0   // Creates attacks in battle property for each wokemon to calculate XP later

        }
    }


    
}

function reinitialiseStats (GS) {  // takes stats back to where they were at the start of the battle and then deletes the extra initial stats property

    let pWI = GS.pWI

    for (let i in pWI) {
        if (Object.keys(pWI[i]).length > 0) {

            GS.pWI[i].str = GS.pWI[i].initialStats[0]
            GS.pWI[i].agi = GS.pWI[i].initialStats[1]
            GS.pWI[i].def = GS.pWI[i].initialStats[2]
            GS.pWI[i].pow = GS.pWI[i].initialStats[3]

            delete GS.pWI[i].initialStats

        }
    }


}

function moveMessageMenu (GS, attacker, defender, attackResult, whoseTurnIsIt) { // Displays the move message and asks for enter to continue

    consoleClear(GS)
    console.log("")
    console.log(attackResult.moveMessage)
    console.log("")

    if (attackResult.successText !== "nothing happened" && attackResult.successText !== "It is normally effective") {  // displays if super or unnaffective

        console.log(attackResult.successText)
        console.log("")
    }




    inquirer
    .prompt
    ([
        {
            name: "moveMessageMenu",
            message: "Enter to continue...",
        }
    ])

    .then (answers => {


        if (answers.moveMessageMenu === "") {

            moveConsequencesMenu(GS, attacker, defender, attackResult, whoseTurnIsIt)

        }

        else if (answers.moveMessageMenu !== ""){

            moveMessageMenu(GS, attacker, defender, attackResult, whoseTurnIsIt)
        }

    })

}

function moveConsequencesMenu (GS, attacker, defender, attackResult, whoseTurnIsIt) { // Display and continue for what happens after a successful attack


    // below bit creates parts of the string used to tell player what happened, this time for damage / healing

    let defenderDOrH = "is nothinged (moveConsequencesMenu says: 'I'm broken'."
    let attackerDOrH = "is nothinged (moveConsequencesMenu says: 'I'm broken'."


    if (attackResult.damage > 0) {

        defenderDOrH = "is damaged"

    } else if (attackResult.damage < 0) {

        defenderDOrH = "is healed"
        
    } else if (attackResult.damage === 0) {

        defenderDOrH = "is unnaffected"
    
    }

    if (attackResult.selfDamage > 0) {

        attackerDOrH = "is damaged"

    } else if (attackResult.selfDamage < 0) {

        attackerDOrH = "is healed"

    } else if (attackResult.selfDamage === 0) {

        attackerDOrH = "is unnaffected"
    
    }

    if (attackResult.damage < 0) {  // makes damage positive for display
        attackResult.damage *= -1
    }

    if (attackResult.selfDamage < 0) {  // makes  self damage positive for display
        attackResult.selfDamage *= -1
    }






    // below bit prints the results

    consoleClear(GS)
    console.log("")

    if (defenderDOrH !== "is unnaffected") { // if defender damaged or healed display that

        console.log(`Defending ${demonName(defender)} ${defenderDOrH} for ${attackResult.damage} points!`)
    } 

    else if (defenderDOrH === "is unnaffected") {  // if defender not damaged or healed then also display that

        console.log(`Defending ${demonName(defender)} is unhurt in the attack`)
    }


    if (attackerDOrH !== "is unnaffected") {  // only if attacker damaged or healed is that displayed

        console.log(`Attacking ${demonName(attacker)} ${attackerDOrH} for ${attackResult.selfDamage} points!`)
    }

    console.log("")


    // below adds the effect text 



    if (attackResult.defenderEffectText !== "no special effect") {

        let defenderEffectStr = attackResult.defenderEffectText.replace("Defender", demonName(defender))

        console.log("Defending " + defenderEffectStr)

    }

    if (attackResult.attackerEffectText !== "no special effect") {

        let attackerEffectStr = attackResult.attackerEffectText.replace("Attacker", demonName(attacker))

        console.log("Attacking " + attackerEffectStr)

    }

    console.log("")


    inquirer
    .prompt
    ([
        {
            name: "moveConsequencesMenu",
            message: "Press Enter to continue..."
        }
    ])

    .then (answers => {

        if (answers.moveConsequencesMenu === "") {              /// If answer valid



            if (attacker.hP === 0 || defender.hP === 0) {             // IF Demon died, display that and deal with one of 7 consequences            

                demonDiedDisplay(GS, attacker, defender)
                demonDiedMenu(GS, attacker, defender, whoseTurnIsIt)

            }

            else {            // If no Demon died, it's the next turn

                nextTurn(GS, whoseTurnIsIt)

            }


        }

        else if (answers.moveConsequencesMenu !== "") {

            moveConsequencesMenu (GS, attacker, defender, attackResult, whoseTurnIsIt)


        }
    })










}





////////// Attack Functions

function attackExecutor (GS, attacker, defender, move, whoseTurnIsIt) {  // Caluclates damage and launches relevant menu for successful attack

    attacker.attacksInBattle ++


    let attackResult = attack(attacker,defender,move)

    if (attackResult.missFlag === 1) {  // If attack misses 

        moveMissedMenu(GS, attackResult, whoseTurnIsIt)


    }

    else if (attackResult.missFlag === 0) {  // If attack hits 

        
        // makes appropriate changes to the game state refecting the attack

        defender.hP -= attackResult.damage     // applies damage
        attacker.hP -= attackResult.selfDamage // applies self damage



        // makes sure health cannot go below 0 or above max health for both attacker and defender

        if (defender.hP < 0) {
            defender.hP = 0
        }

        if (defender.hP > defender.maxHP) {
            defender.hP = defender.maxHP
        }

        if (attacker.hP < 0) {
            attacker.hP = 0
        }

        if (attacker.hP > attacker.maxHP) {
            attacker.hP = attacker.maxHP
        }



        // changes stats of attacker and defender reflecting move effect  
        
        defender.str = Math.ceil(defender.str * attackResult.defenderStrMod) 
        defender.agi = Math.ceil(defender.agi * attackResult.defenderAgiMod)
        defender.def = Math.ceil(defender.def * attackResult.defenderDefMod)
        defender.pow = Math.ceil(defender.pow * attackResult.defenderPowMod)

        attacker.str = Math.ceil(attacker.str * attackResult.attackerStrMod)
        attacker.agi = Math.ceil(attacker.str * attackResult.attackerAgiMod)
        attacker.def = Math.ceil(attacker.def * attackResult.attackerDefMod)
        attacker.pow = Math.ceil(attacker.pow * attackResult.attackerPowMod)


        // For debugging, if flag on then attacks will be fatal (for attacker / defender or both)


        if (debugMode === true && debugModeAllAttacksFatalForDefender === true) {
            defender.hP = 0
        }

        if (debugMode === true && debugModeAllAttacksFatalForAttacker === true) {
            attacker.hP = 0
        }



        moveMessageMenu(GS, attacker, defender, attackResult, whoseTurnIsIt)

        


    }



}

function attack (attacker, defender, move) { // returns object containing damage, stat changes and strings to be displayed, calling many below functions to do the calculations

    let result = {

        missFlag: 0,
        selfDamage: 0,
        damage: 0,
        defenderStrMod: 1,
        defenderAgiMod: 1,
        defenderDefMod: 1,
        defenderPowMod: 1,
        attackerStrMod: 1,
        attackerAgiMod: 1,
        attackerDefMod: 1,
        attackerPowMod: 1,
        defenderEffectText: "no special effect",
        attackerEffectText: "no special effect",
        successText: "nothing happened",
        moveMessage: "nothing is happening here"

    } 
    
    if (!(hitOrMiss(attacker, defender, move))) {  // if the attack misses adjust sucessText and return result

        result.missFlag = 1  // changes miss flag to 1 / true 

        if (move.mode === "physical") {        // sets effect text if physical

            result.successText = "The attack missed!!"

        }

        else if (move.mode === "mental") {      // sets effect text if mental

            result.successText = "The attack was resisted!!"

        }


        return result    // returns result without calculating anything else as the attack was unsuccessful 


    }


    result.successText = successTextGenerator(defender, move)  // sets the successtext to reflect how effective the move type was against defender type


    result.damage = damageCalculator (attacker, defender, move) // sets the damage for the attack


    result.selfDamage = selfDamageCalculator (attacker, move)  // sets the self damage / self healing for the attack



    let enemyEffectStatModifiers = moveEffectLogic(move.enemyEffect)  // creates arrays containing the stat modifications

    let selfEffectStatModifiers = moveEffectLogic(move.selfEffect)

    result.defenderStrMod = enemyEffectStatModifiers[0]    // takes the array results and uses them as stat modifiers
    result.defenderAgiMod = enemyEffectStatModifiers[1]
    result.defenderDefMod = enemyEffectStatModifiers[2]
    result.defenderPowMod = enemyEffectStatModifiers[3]
    result.attackerStrMod = selfEffectStatModifiers[0]
    result.attackerAgiMod = selfEffectStatModifiers[1]
    result.attackerDefMod = selfEffectStatModifiers[2]
    result.attackerPowMod = selfEffectStatModifiers[3]

    result.defenderEffectText = effectTextGenerator("Defender", enemyEffectStatModifiers[4], move.enemyEffect)  // generates the text for the stat modifications

    result.attackerEffectText = effectTextGenerator("Attacker", selfEffectStatModifiers[4], move.selfEffect)



    result.moveMessage = moveMessageGenerator (attacker, defender, move)  // generates message to be generated once attack hits before battle menu is shown

    return result
}

function hitOrMiss (attacker, defender, move) { // determines if the attack missed / resisted or is successful. boolean output

    if (debugModeAttacksAlwaysMiss === true && debugMode === true) {  // makes attacks always miss if debug option turned on

        return false
    }

    if (move.mode === "physical") {  // calculates hit chance for physical attacks

            /* Following code determines if miss.  First gets difference /100 of defender and attacker agi.
            If this is a negative number, it divides it by ten (to make it favour high agi less).  It adds 0.1
            to this figure and rolls randomly against it, if it is below this, then the attack misses. Then there
            is a roll against the attackers agi / 200 to hit anyway. */


        let agiDifference = (defender.agi - attacker.agi ) / 100
        if (agiDifference < 0) {
            agiDifference /= 10 
        }

        if (Math.random() < (agiDifference + 0.1)) {    // Calculating chance of missing.

            if (Math.random() > (attacker.agi/200)) {  // chance of attack hitting anyway.

                
                return false    // the attack has missed
            }
        }

        return true  // the roll was passed  and the attack hits
    }

    if (move.mode === "mental") {     // calculates resist chance for mental attacks


        /* The following bit determines if mental attack is resisted.  It works the same as with physical attacks
        above, but is based on power rather than agility and has a higher base chance (0.2) of missing. */

        let powDifference = (defender.pow - attacker.pow ) / 100
        if (powDifference < 0) {
            powDifference /= 10 
        }

        if (Math.random() < (powDifference + 0.2)) {    // Calculating chance of being resisted.

            if (Math.random() > (attacker.pow/200)) {  // chance of attack hitting anyway.

                return false       // If both rolls successful and attack is resisted
            }
        }

        return true      // if roll untrue and attack not resisted


    }



}

function checkWeakness (defender, move){   // returns multiplier 2 if super effective, 0.5 if unneffective and 1 if neither


    if (defender.type === abyss) {
        if (move.type === light) {
            return superEffectiveMod
        }
        if (move.type === destruction) {
            return uneffectiveMod
        }
    }
    if (defender.type === destruction) {
        if (move.type === abyss) {
            return superEffectiveMod
        }
        if (move.type === nature) {

            return uneffectiveMod
        }
    }
    if (defender.type === scourge) {
        if (move.type === nature) {
            return superEffectiveMod
        }
        if (move.type === light) {
            return uneffectiveMod
        }
    }
    if (defender.type === nature) {
        if (move.type === destruction) {
            return superEffectiveMod
        }
        if (move.type === scourge) {
            return uneffectiveMod
        }
    }
    if (defender.type === light) {
        if (move.type === scourge) {
            return superEffectiveMod
        }
        if (move.type === abyss) {
            return uneffectiveMod
        }
    }
    return 1     // if neither effective nor unaffective
}

function successTextGenerator (defender, move) { // returns the string to say how effective the successfull attack was

    let cWresult = checkWeakness(defender,move)

    if (cWresult === uneffectiveMod) {
        
        return "It's not very effective..."
    }

    else if (cWresult === 1)  {

        return "It is normally effective"
    }

    else if (cWresult === superEffectiveMod)  {

        return "It is super effective!!"
    }

    else {

        return "successTextGenerator says: 'Something is broken'."
    }
}

function effectTextGenerator (name, stat, moveEffect) {  // returns string to be displayed describing type & magnitude of effect


    if (moveEffect === "none") {   // if there isnt an effect
        return "no special effect"

    }


    else {


        if (stat === "str") {    // this bit un abbreviates the stat
            
            stat = "strengh"
        }

        else if (stat === "agi") {

            stat = "agility"
        }

        else if (stat === "def") {

            stat = "defence"
        }

        else if (stat === "pow") {

            stat = "mental acuity"
        }




        let num = moveEffect.split(' ')[1]

        let severity = "effectTextGenerator error: severity not set"

        let sign = "effectTextGenerator error: sign not set."

        num -= 1        // getting the value to be the difference from 1

        if (num < 0) {    // flips sign if difference is negative
            num *= -1

            sign = "reduced"   // if negative stat is being reduced
        }

        else {

            sign = "increased"   // if positive stat is being increased
        }



        if (num === 0) {                   // sets severity text. must have space at beginning if a word (to account for "normal" case with no severity)

            severity = " error: effectTextGenerator reading 0"
        }

        else if (num > 0 && num <= 0.08) {

            severity = " slightly"

        }

        else if (num > 0.08 && num <= 0.18) {

            severity = ""

        }

        else if (num > 0.18 && num <= 0.28) {

            severity = " severely"

        }

        else if (num > 0.28 && num <= 0.38) {

            severity = " massively"

        }

        else if (num > 0.38 && num <= 0.48) {

            severity = " humongously"

        }

        else if (num > 0.48) {

            severity = " mind-blowingly"

        }

        if (stat === "all") {

            return `${name}'s stats have been${severity} ${sign}!!!`
        }

        else if (stat !==  "all") {

            return `${name}'s ${stat} has been${severity} ${sign}!!!`
        
        }

    }
}

function moveMessageGenerator (attacker, defender, move) {  // generates message

    let attackerName = demonName(attacker)

    let defenderName = demonName(defender)

    let result = move.message.replace("ATTACKER", attackerName)

    return result.replace("DEFENDER", defenderName)


}

function damageCalculator (attacker, defender, move) {  // code where damage is calculated

    let modifier = move.baseDamageMod
    modifier *= checkWeakness(defender, move)  // Checks if the move is strong / weak to defender type and applies damage mod



    if (move.mode === "physical") {  // calculates hit chance and damage for physical attacks


        modifier *= (attacker.str / 100)     // damage is str / 100, 


        modifier *= (1 - ((defender.def / 2) / 100))  // defenders defence negates up to 50% of the resulting damage

                                                      // 1 - def / 2 = maximum * 0.5 damage modifier


        modifier += (move.baseDamageMod * 0.1)  // 1/10th of the base damage of the move is added after this 

        modifier += ((modifier / 10) * Math.random()) // adds up to 10% random damage for variance

    }

    if (move.mode === "mental") {

        let powDifference = attacker.pow - defender.pow





        modifier *= (attacker.pow / 100)  // damage is base * pow / 100
        modifier += powDifference // add the difference between the attacker pow and defender pow
        modifier += ((attacker.pow / 200) - ((defender.def + defender.pow) / 400)) // add a bonus negated by the defender's def and power
        if (modifier < 0.2) {  // if oponent is much stronger, some damage still done
            modifier = move.baseDamageMod * 0.2
        }
        modifier += ((modifier / 10) * Math.random()) // adds up to 10% random damage for variance
 



    }

    return Math.ceil(modifier * 100);    // SETS DAMAGE FOR ATTACK


}

function selfDamageCalculator (attacker, move) { // calculates self damage / healing (if -).  Presently just move selfdamage * max health +/- 10%

    let damage = move.selfDamageMod * attacker.maxHP

    damage += ((damage/ 10) * Math.random()) 

    return Math.ceil(damage)



}

function moveEffectLogic (moveEffect) {  // takes moves effect (self or enemy) and returns stat changes as [s*,a*,d*,p*,str] array, with stat indicator str in [4]

    let result = [1,1,1,1]  // str, agi def pow multiplier

    if (moveEffect !== "none") {    // if there is an effect

  
        let effectStat = moveEffect.split(' ')[0]
        let effectAmmount = moveEffect.split(' ')[1]
  
  
        if (effectStat === "random") {   // if effect is random, stat is randomly selected

            let randSel = Math.floor(Math.random() * (3 - 0 + 1))

            switch (randSel) {  

              case 0: effectStat = "str";
              break;
              case 1: effectStat = "agi";
              break;
              case 2: effectStat = "def";
              break;
              case 3: effectStat = "pow";
              break; 
            
            }
        }

        switch (effectStat) {              // applies stat change to chosen stat

            case "str": result[0] *= effectAmmount;
            result.push("str");
            break;
            case "agi": result[1] *= effectAmmount;
            result.push("agi");
            break;
            case "def": result[2] *= effectAmmount;
            result.push("def");
            break;
            case "pow": result[3] *= effectAmmount;
            result.push("pow");
            break;
        }


        if (effectStat === "all") {     // applies effect to all stats if effect affects all

            result = result.map(x => x * effectAmmount)

            result.push("all")


        }
        
    } else {
        result.push("none")
    }

    return result
}

function moveMissedMenu(GS, attackResult, whoseTurnIsIt){  // Menu for if the attack misses.

    consoleClear(GS)
    console.log("")
    console.log("")
    console.log(`-   ${attackResult.successText}   -`)
    console.log("")
    console.log("")

    inquirer
    .prompt
    ([
        {
        name : "moveMissedMenu",
        message : "Press Enter to continue..."
        }
    ])

    .then (answers => {

        if (answers.moveMissedMenu === "") {

            nextTurn(GS, whoseTurnIsIt)


        }

        else if (answers.moveMissedMenu !== "") {

            moveMissedMenu(GS, attackResult, whoseTurnIsIt)


        }

    })


}

function demonDiedDisplay (GS, attacker, defender) { // Displays info about Demon dying



    consoleClear(GS)
    console.log("")



    if (defender.hP === 0) {

        console.log(`Defending ${demonName(defender)} has been knocked out`)

    }


    if (attacker.hP === 0) {

        console.log(`Attacking ${demonName(attacker)} has been knocked out.`)

    }

    console.log("")



    




}

function demonDiedLogic (GS, attacker, defender) {  // returns a string saying what to do after Demon died, i.e. both dead, you lost / enemy dead, continue etc...

    let deadDefenderID = "0"
    let deadAttackerID = "0"


    if (defender.hP === 0) {


        deadDefenderID = defender.id
    }


    if (attacker.hP === 0) {

        deadAttackerID = attacker.id
    }

    console.log("")

    let result = ""

    for (let i in Object.keys(GS.pWI)) {                   // If dead Demon belongs to player

        if (GS.pWI[i].id === deadDefenderID || GS.pWI[i].id === deadAttackerID) {



            if (checkLivingDemon(GS.pWI) <= 0) { // If the player has lost the battle if they have 0 Demon left

                return result = "battle lost"


            }



            else if (checkLivingDemon(GS.pWI) > 0) {  // If player still has living Demon





                // first check if the enemy Demon also died, and also if the battle is won


                for (let i in Object.keys(GS.enemy.eWI)) {             // If both players Demon have died 

                    if (GS.enemy.eWI[i].id === deadDefenderID || GS.enemy.eWI[i].id === deadAttackerID) {

                        


                        if (checkLivingDemon(GS.enemy.eWI) <= 0) { // if the enemy has been defeated


                            return result = "both Demon dead, battle won"



            
                        }


            
                        else if (checkLivingDemon(GS.enemy.eWI) > 0) {  // if enemy still has living Demon 


                            return result = "both Demon dead, battle continues"

            
            
            
            
                        }
            

            
                    }
            
                }


                // If only the player's Demon died but the battle is not lost

                return result = "player Demon dead, battle continues"






            }  




        }
    }

    for (let i in Object.keys(GS.enemy.eWI)) {             // If dead Demon belongs to enemy and player Demon didn't die

        if (GS.enemy.eWI[i].id === deadDefenderID || GS.enemy.eWI[i].id === deadAttackerID) {

            if (checkLivingDemon(GS.enemy.eWI) > 0) {  // if enemy still has living Demon 

                return result = "enemy Demon dead, battle continues"









            }

            else if (checkLivingDemon(GS.enemy.eWI) <= 0) { // if the enemy has been defeated

                return result = "battle won"





            }

        }

    }




}

function demonDiedMenu (GS, attacker, defender, whoseTurnIsIt) {

    inquirer
    .prompt
    ([
        {
            name: "demonDiedMenu",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.demonDiedMenu === "") {    // If user input valid

            switch(demonDiedLogic(GS, attacker,defender)){ // Demon died logic works out what is going on and outputs a string to use as a switch
  
                case "battle lost":  // to finish

                    reinitialiseStats(GS)
                    console.log("battle lost")




                    break;

                case "player Demon dead, battle continues": 

                    consoleClear(GS)
                    demonInventory(GS)

                    battleActiveDemonChanger(GS, whoseTurnIsIt, false)



                    break;

                case "battle won":   

                    reinitialiseStats(GS)

                    consoleClear(GS)
                    battleWon(GS, xPDistributor(GS))





                    break;

                case "enemy Demon dead, battle continues":  

                    enemyNewDemonSummon(GS, whoseTurnIsIt)    




                    break;

                case "both Demon dead, battle won":  

                    reinitialiseStats(GS)

                    autoPickActiveDemon(GS.pWI)


                    battleWon(GS, xPDistributor(GS))




                    break;

                case "both Demon dead, battle continues": 

                    consoleClear(GS)

                    demonInventory(GS)

                    battleActiveDemonChanger(GS, whoseTurnIsIt, true)
                
                
                    console.log("both Demon dead, battle continues")



                    break;

            }


        }

        else if (answers.demonDiedMenu !== "") {   // If user input invalid, just repeat the menu 

            consoleClear(GS)
            demonDiedDisplay(GS, attacker, defender)

            demonDiedMenu(GS, attacker,defender, whoseTurnIsIt)
        }





    })

    
}

function enemyNewDemonSummon (GS, whoseTurnIsIt) { // if the enemy summons a new Demon but fight continues, display this menu

    let newDemon = autoPickActiveDemon(GS.enemy.eWI)

    consoleClear(GS)

    console.log("")
    console.log(`${findEnemyName(GS)} sends ${demonName(newDemon)} out to fight!`)
    console.log("")


    inquirer
    .prompt
    ([
        {
            name: "enemyNewDemonSummon",
            message: "Press enter to continue..."
        }
    ])
    .then ( answers => {

        if (answers.enemyNewDemonSummon === "") {

            nextTurn(GS, whoseTurnIsIt)



        }

        else if (answers.enemyNewDemonSummon !== "") {

            enemyNewDemonSummon(GS, whoseTurnIsIt)

            
        }

    })


}



/// End of Battle functions

function battleLost (GS) {

    

    console.log ("You have lost the battle")
}

function battleWon (GS, xpDistributionArray) {  // streen taken to when battle won



    console.log("")

    console.log ("You have won the battle")

    console.log("")

    inquirer
    .prompt
    ([
        {
            name: "battleWon",
            message: "Congratulations Summoner.  Press Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.battleWon === "") {


            xPDistributorMenu(GS, xpDistributionArray)


        }

        else if (answers.battleWon !== "") {
            
            consoleClear(GS)
            battleWon(GS)
        }

    })




}

function xPDistributor (GS) {  // calculates xp to award each wokemon returning an array [xp,xp,xp,xp,xp,xp]. depends on attacksinbattle property which is generated in initialstats()

    let result = [0, 0, 0, 0, 0, 0]

    let xPTotal = 0

    let playerTotalAttacks = 0


    for (let i in GS.enemy.eWI) {

        if (Object.keys(GS.enemy.eWI[i]).length > 0) {

            xPTotal += (GS.enemy.eWI[i].level * 5) + 20    // FORMULA FOR TOTAL XP PER WOKEMON IN EWI
        }
    }

    if (debugMode === true && debugModeBonusXP > 0) {  // if debug mode adds xp to total from relevant setting
        xPTotal += debugModeBonusXP
    }

    for (let i in GS.pWI) {           // Adds up the number of total attacks done by all player demons

        if (Object.keys(GS.pWI[i]).length > 0) {
            playerTotalAttacks += GS.pWI[i].attacksInBattle
        }
    }

    let xPPerAttack = Math.floor(xPTotal / playerTotalAttacks)  // divides total xp awarded by the number of player attacks

    for (let i in GS.pWI) {

        if (Object.keys(GS.pWI[i]).length > 0) {


            result[i] = Math.floor(xPPerAttack * GS.pWI[i].attacksInBattle)      // assigns each wokemon xp per attack in battle 
            delete GS.pWI[i].attacksInBattle                                    // deletes attacks in battle property from the demon
        }
    }

    return result  // returns array as xp per demon in slot as in [323, 0, 0, 32, 63636, 0]
}

function xPDistributorMenu (GS, xpDistributionArray) {  // lists demons xp gain and continue.  If level up occurs goes to tha level up menu UNFINISHED

    consoleClear(GS)

    console.log("")

    for (let i in GS.pWI) {

        if (xpDistributionArray[i] > 0 && Object.keys(GS.pWI[i]).length > 0) {

            let demon = demonName(GS.pWI[i])

            console.log(`${demon} has gained ${xpDistributionArray[i]} experience points.`)
        }
    }

    console.log("")

    inquirer
    .prompt
    ([ 
        {
            name: "xPDistributorMenu",
            message: "Press Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.xPDistributorMenu === "") {

            let levelsGainedArray = xPDistributoraApplier (GS, xpDistributionArray)  // applies gained xp and sees if any demon leveled up

            let levelUpFlag = false

            for (let i in levelsGainedArray) {

                

                if (levelsGainedArray[i] > 0) {

                    levelUpFlag = true

                    
                }

                
            }
            if (levelUpFlag === true) {

                levelUpMenu(GS, levelsGainedArray)
            }

            else {

                soulEnergyMenu(soulEnergyCalculator (GS))
            }




        }

        else if (answers.xPDistributorMenu !== "") {

            xPDistributorMenu (GS, xpDistributionArray)
        }
    })

}

function xPDistributoraApplier (GS, xpDistributionArray) {  // logic for leveling up wokemon as well as xp table. returns array of 6 containing no of times each wokemon levelled up

    let levelsGainedArray = [0,0,0,0,0,0]

    let levelsAndXP = [[0, 0], [1 , 100],[2 , 225],[3 , 350],[4 , 500],[5 , 700],[6 , 950],[7 , 1250],[8 , 1675],[9 , 2100],[10 , 2600],
                       [11 , 3200],[12 , 4000],[13 , 5000],[14 , 6200],[15 , 7500],[16 , 8100],[17 , 9700],[18 , 11700],[19 , 14000],[20 , 17000],
                       [21 , 21000],[22 , 25000],[23 , 30000],[24 , 33000],[25 , 37000],[26 , 42000],[27 , 45000],[28 , 50000],[29 , 60000],[30 , Infinity], ]

    for (let i in xpDistributionArray) {


        if (Object.keys(GS.pWI[i]).length > 0) {

            GS.pWI[i].xp += xpDistributionArray[i]          // gives xp to ech demon

            let demonLevel = GS.pWI[i].level

            if (GS.pWI[i].xp > levelsAndXP[demonLevel][1]){    // if demon xp greater than what levelsAndXp says is required for the current level (level up ammount)

                for (let j in levelsAndXP) {    // for every level in levelsandxp 

                    if (demonLevel=== levelsAndXP[j][0] && GS.pWI[i].xp > levelsAndXP[j][1]) {   // check if current xp is over that required to advance

                        levelsGainedArray[i] ++   // adds level to relevant slot in output array

                        GS.pWI[i].xp -= levelsAndXP[demonLevel][1]    // roll over xp to next level (remove xp required for current level up from xp)

                        GS.pWI[i].level ++
                        
                        demonLevel ++

        
                    }
                }



            }  
        }
    }

    return levelsGainedArray





}

function levelUpMenu (GS, levelsGainedArray) {  // menu for if something levelled up

    consoleClear(GS)
    console.log("")

    for (let i in levelsGainedArray) {

        if (levelsGainedArray[i] > 0 && Object.keys(GS.pWI[i]).length > 0) {

            console.log(`${demonName(GS.pWI[i])} has risen to level ${GS.pWI[i].level}.`)
        }
    }
    console.log("")

    inquirer
    .prompt
    ([
        {
            name: "levelUpMenu",
            message: "Press Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.levelUpMenu === "") {

            let isevolution = (evolvedTester(GS, levelsGainedArray))   // checks if an evolution has occurred

            console.log(isevolution)

            if (isevolution) {   // if evolution did occurr go to that menu

                evolvedMenu(GS, levelsGainedArray)
                
                

            }


            else if (!(isevolution)){   // if not just progress to thing that happens after battle is won
                
                
                soulEnergyMenu(GS, soulEnergyCalculator(GS))
            }



        }

        else if (answers.levelUpMenu !== "") {

            levelUpMenu(GS, levelsGainedArray)
        }
    })

    
}

function evolvedTester (GS, levelsGainedArray) { // if level up has occurred returns boolean for if a demon evolved (level became >= 10 or >= 20)

    /* formula is basically take current level, get the remainder from dividing by 10.
        if the levels gained is greater than that then we know that the demon must have levelled greater than that.

        In almost all cases this should be levels gained 1.  Level is 10 or 20, so remainder 10 is zero.  1 is greater than zero so evolved true.
        In cases where no evolution, e.g. levels gained is 1 and level is 15, 1 will not be  greater than the remainder so this flag will be false.

        Also need to not let this return true if the demon is level 30 (no evolution at that level)

    */

    for (let i in levelsGainedArray) {

        if (levelsGainedArray[i] > 0 && Object.keys(GS.pWI[i].length > 0) && GS.pWI[i].level !== 30) {

            let levelsOverX0 = (GS.pWI[i].level % 10)  // levels over a multiple of 10
            let gained = levelsGainedArray[i]              // levels gained from the battle

            if (gained > levelsOverX0) {
                return true
            }

            
        }
    }
    return false
}

function evolvedMenu (GS, levelsGainedArray) { // UNFINISHED

    consoleClear(GS)
    console.log("")
    console.log("PLACEHOLDER FOR EVOLUTION MENU")
    console.log("")

    inquirer
    .prompt
    ([
        {
            name: "evolvedMenu",
            message: "Press Enter to continue..."
        }
    ])

    .then (answers => {

        if (answers.evolvedMenu === "") {

            soulEnergyMenu(GS, soulEnergyCalculator(GS))


        }

        else if (answers.evolvedMenu !== "") {

            evolvedMenu(GS, levelsGainedArray)
        }
    })
}

function soulEnergyCalculator (GS) { // Calculated the ammount of soul energy the player gains from the battle

    let result = 0


    for (let i in GS.enemy.eWI) {

        if (Object.keys(GS.enemy.eWI[i]).length > 0) {

            result += (GS.enemy.eWI[i].level * 2) + 5    // FORMULA FOR TOTAL MONEY PER DEMON IN EWI
        }
    }

    result += GS.enemy.enemyBonusSoulEnergy // adds bonus soul energy coming from named summoners




    return result  // returns soulEnergy

}

function soulEnergyMenu (GS, soulEnergyAmmount) { // Displays the soul energy gained from battle (also will contain other things) -- UNFINISHED

    consoleClear(GS)

    console.log("")
    console.log(`You have gained ${soulEnergyAmmount} Soul Energy from vanquishing you opponent.`)
    console.log("")

    inquirer
    .prompt
    ([
        {
            name: "soulEnergyMenu",
            message: "Press Enter to continue..."
        }
    ])
    .then (answers => {
        if (answers.soulEnergyMenu === "") {  // ADD END OF BATTLE WON THINGS HERE e.g. time of day change, story point increase

            GS.soulEnergy += soulEnergyAmmount  // updated player soul energy with ammount gained from battle

            mainMenu(GS)


        }
        else if (answers.soulEnergyMenu !== "") {

            soulEnergyMenu(GS, soulEnergyAmmount)
        }
    })
}






///////  AI functions

function enemyTurn (GS) {  // Enter to continue for enemy turn and acts on logic in enemyTurnLogic using switch

    consoleClear(GS)
    battleMenu(GS)

    console.log(`Enemy ${demonName(enemyActiveDemonLoader(GS))} is getting ready to make a move...`)

    inquirer
    .prompt
    ([
        {
            name : "enemyTurn",
            message : "Press Enter to continue ..."
        }
    ])
    .then (answers => {

        if (answers.enemyTurn === "") {

            switch (enemyTurnLogic(GS)) {

                case "enemy attacks":

                let move = enemyMoveChoice(GS)

                    if (move.name === "Punch self in face") {

                        attackExecutor(GS, enemyActiveDemonLoader(GS), enemyActiveDemonLoader(GS), MOVES.struggle, "enemy")
                    }

                    else {

                        attackExecutor(GS, enemyActiveDemonLoader(GS), playerActiveDemonLoader(GS), move, "enemy" )
                    }
                    break;


                case "enemy changes Demon":
                    break;

                case "enemy uses item":
            }


        }

        else if (answers.enemyTurn !== "") {

            enemyTurn(GS)
        }
    })
}

function enemyTurnLogic (GS) { // Actual "AI" for what the enemy does. outputs string for switch in enemyTurn.  UNFINISHED


    return "enemy attacks"

}

function enemyMoveChoice (GS){  // presently randomly selects enemy move and returns struggle if no move -- make better

    let Demon = enemyActiveDemonLoader(GS)

    let moves = movesExtractor(Demon)

    let candidateMoves = []

    let validMoveFlag = false

    let chosenMoveIndex = null

    for (let i in moves) {
        if ((Object.entries(moves[i][0]).length > 0) && (moves[i][1] > 0)) {

            validMoveFlag = true

            chosenMoveIndex = i

            candidateMoves.push(moves[i][0])
   
        }

    } if (validMoveFlag) {

        movePPReducer(GS, chosenMoveIndex, "enemy")

        return candidateMoves[Math.floor(Math.random() * (candidateMoves.length))]
    }

    else return MOVES.struggle
}

function autoPickActiveDemon (demonInventory) {  // selects the first living Demon from the inventory as active

    for (let i in demonInventory) {                             // erases active stance from all Demon
        if (Object.keys(demonInventory[i]).length === 0) {                // if no Demon in slot

        } else {
            demonInventory[i].active = false
        }
    }

    for (let i in demonInventory) {
        if (Object.keys(demonInventory[i]).length > 0 && demonInventory[i].hP > 0) {     // sets first living Demon to active and returns it as object


            demonInventory[i].active = true

            return demonInventory[i]

        }


    }
}



/////// Demon creation functions


let iDListArray = [1] // Contains list of IDs (must be initialised containing a 1 for the generator to function)

function iDGenerator (iDList) {  // generates a new ID for every Demon BUT I've just realised this will break after game load

    let lastID = iDList[0]

    let ID = (iDList[0] + 1)
    iDList.unshift(ID)
    return ID.toString()


}



//// Tutorials / message chains

function leavingLibraryMessage (GS) {  

    consoleClear(GS)

    console.log("")
    console.log("You leave the library and head back to your quarters.")
    console.log("")

    inquirer
    .prompt
    ([
        {
            name: "leavingLibraryMessage",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {
        if (answers.leavingLibraryMessage === "") {

            mainMenu(GS)
        }
        else if (answers.leavingLibraryMessage !== "") {

            leavingLibraryMessage(GS)
        }
    })
}

function introductionToLibrary1 (GS) {  // when player first visits the libary

    consoleClear(GS)

    console.log("")
    console.log("You walk accross the grounds and find the library, a large annex on the side")
    console.log("of the old chapel.  You walk up the small set of stone stairs leading to the")
    console.log("entrance, a large, heavy door made of ebony wood.  The door has several large")
    console.log("gouges that catch your eye, and a dozen or so small gilded runes made from a ")
    console.log("light - coloured metal which have tarnished over many years exposed to the ")
    console.log("elements.")
    console.log("")
    console.log("With some effort, you push the door open and are greeted by a rush of warm air.")
    console.log("You enter the library.")
    console.log("")

    inquirer
    .prompt
    ([
        {
            name: "introductionToLibrary1",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.introductionToLibrary1 === "") {

            introductionToLibrary2(GS)
        }

        else if (answers.introductionToLibrary1 !== "") {

            introductionToLibrary1(GS)
        }
    })
}

function introductionToLibrary2 (GS) {

    consoleClear(GS)

    console.log("")
    console.log("You step into a large room and shut the heavy door behind you.  The room is")
    console.log("well lit with torches and on your right is a lit fireplace surrounded by several")
    console.log("battered but comfy looking bits of seating. In front of you is a grand oak desk,")
    console.log("with someone you imagine to be the librarian stood behind it, pondering something")
    console.log("as they examine a pile of several large tomes.  Most of the room behind the desk")
    console.log("is taken up by many huge, densely arranged bookshelves which are each twice as")
    console.log("tall as you.")
    console.log("")
    console.log("The librarian looks up and notices you standing, examining you with a frown.")
    console.log("")

    inquirer
    .prompt
    ([
        {
            name: "introductionToLibrary2",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.introductionToLibrary2 === "") {

            introductionToLibrary3(GS)
        }

        else if (answers.introductionToLibrary2 !== "") {

            introductionToLibrary2(GS)
        }
    })
}

function introductionToLibrary3 (GS) {

    consoleClear(GS)

    console.log("")
    console.log("'You must be a new accolyte' the librarian says, almost as if dissapointed, ")
    console.log("either by the concept of having to interact with someone or simply by your")
    console.log("unimpressive stature.")
    console.log("'I hope you are not thinking of taking any of my books.' the librarian barks")
    console.log("impulsively.")
    console.log("'Or rather', the librarian stammers, 'the library's books. We have thousands")
    console.log("of books here, and some are very ancient and powerful. *Accolytes* such as  ")
    console.log("yourself are not allowed to access the full library, lest you do something")
    console.log("stupid with a volume, or even worse, think yourself powerful enough to be able.")
    console.log("to enact a ritual or spell detailed in a book.'")

    inquirer
    .prompt
    ([
        {
            name: "introductionToLibrary3",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.introductionToLibrary3 === "") {

            introductionToLibrary4(GS)
        }

        else if (answers.introductionToLibrary3 !== "") {

            introductionToLibrary3(GS)
        }
    })
}

function introductionToLibrary4 (GS) {

    consoleClear(GS)

    console.log("")
    console.log("There is a pause, as if the librarian hopes you will leave.  You examine the")
    console.log("library for a second.  The stone floors and walls are covered in rugs and faded")
    console.log("paintings, but you notice that the stonework itself is battered and decrepit,")
    console.log("with several large areas that seem to have been damaged by fire years ago.")
    console.log("")
    console.log("You must have had a curious look on your face, which the librarian clearly takes")
    console.log("some kind of offence to. ")
    console.log("")
    console.log("'A bit *poky* for you is it?' the librarian sneers. 'I imagine it's not what")
    console.log("you are used to.'")

    inquirer
    .prompt
    ([
        {
            name: "introductionToLibrary4",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.introductionToLibrary4 === "") {

            introductionToLibrary5(GS)
        }

        else if (answers.introductionToLibrary4 !== "") {

            introductionToLibrary4(GS)
        }
    })
}

function introductionToLibrary5 (GS) {

    consoleClear(GS)

    console.log("")
    console.log("You get the impression that many accolytes at the Academy must be from esteemed")
    console.log("families with sately homes, any the librarian assumes no different of you.")
    console.log("")
    console.log("'If you are curious - which I will say, can be more than fatal for accolytes -")
    console.log("this library building was the scene of a battle many years ago, staged when a")
    console.log("power-crazed accolyte was corrupted by the void and thought it wise to try to")
    console.log("kill everyone at the Academy.  The library was the last refuge for those that ")
    console.log("survived the initial onslaught of Demons summoned by the accolyte.  The large")
    console.log("ebony door is actually a powerful magical barrier that was erected in order to")
    console.log("delay the entry of the accolyte and their demons.'")

    inquirer
    .prompt
    ([
        {
            name: "introductionToLibrary5",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.introductionToLibrary5 === "") {

            introductionToLibrary6(GS)
        }

        else if (answers.introductionToLibrary5 !== "") {

            introductionToLibrary5(GS)
        }
    })
}

function introductionToLibrary6 (GS) {

    consoleClear(GS)

    console.log("")
    console.log("'Eventually the accolyte was able to break the barrier with great effort,")
    console.log("but enough time had been brought for the survivors to regroup.  A large and ")
    console.log("disastrous battle occured within these walls, but eventually the acolyte was")
    console.log("defeated and punished.'  The librarian glances at a small, old, bejewelled")
    console.log("statue of a court jester, which is displayed in a small glass box by the ")
    console.log("central bookcases.")
    console.log("")
    console.log("The acolytes soul was banished into that statue, to spend the rest of ")
    console.log("eternity powerless, watching as the institution it almost destroyed slowly  ")
    console.log("forgets it even existed.'")

    inquirer
    .prompt
    ([
        {
            name: "introductionToLibrary6",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.introductionToLibrary6 === "") {

            introductionToLibrary7(GS)
        }

        else if (answers.introductionToLibrary6 !== "") {

            introductionToLibrary6(GS)
        }
    })
}

function introductionToLibrary7 (GS) {

    consoleClear(GS)

    console.log("")
    console.log("You stare, fixated by the statue.  As you stare, you feel a strange sense ")
    console.log("of emptiness, and longing.  Suddenly, you are overwhelmed by the feeling as")
    console.log("if someone is screaming inches from your face with their hands around your")
    console.log("neck, squeezing the life out of you with the force of eternity. You are ")
    console.log("startled, and quickly look away. The librarian smiles sardonically.")
    console.log("")
    console.log("'Yes, I wouldn't bother spending time examining it if I were you. The weak")
    console.log("often find that that can be quite *challenging*.'")
    console.log("You look down at the floor and then to the librarian, who is still smiling,")
    console.log("as if seeing accolytes recoil at the statue is the best part of the job.")

    inquirer
    .prompt
    ([
        {
            name: "introductionToLibrary7",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.introductionToLibrary7 === "") {

            introductionToLibrary8(GS)
        }

        else if (answers.introductionToLibrary7 !== "") {

            introductionToLibrary7(GS)
        }
    })
}

function introductionToLibrary8 (GS) {

    consoleClear(GS)

    console.log("")
    console.log("'Suffice to say, accolyte' the librarian sneers, 'that there are powers ")
    console.log("within the library that are beyond you.  Do not be curious, do not ask to")
    console.log("take out books, do not pester me.  Perhaps, *if* you prove yourself not")
    console.log("to be as pathetic as the rest of the Academy's present day \"acolytes\", ")
    console.log("then I will let you see some of the books.  Until then, you may satisfy")
    console.log("me by leaving this buidling and its contents well alone.'")
    console.log("")
    console.log("")
    console.log("")
    console.log("")

    inquirer
    .prompt
    ([
        {
            name: "introductionToLibrary8",
            message: "You cannot use the library yet. Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.introductionToLibrary8 === "") {

            GS.time ++    // the tutorial took some time
            GS.playerHasAccessedLibrary = true // stops this tutorial from happening twice

            libraryMainMenu(GS)
        }

        else if (answers.introductionToLibrary8 !== "") {

            introductionToLibrary8(GS)
        }
    })
}
  
function moveBeingTaught1 (GS, demon, move)  {  // when player teaches a demon a move

    consoleClear(GS)

    console.log("")
    console.log("You pick up the book from the desk and leave the library.  As you are leaving")
    console.log("the Librarian grunts angrily and shouts after you -")
    console.log("")
    console.log("'Be careful with that book, accolyte!'")
    console.log("")
    console.log("You pull open the great barrier door with the tome tucked under your shoulder,")
    console.log("and fumble, almost dropping the book.")
    console.log("")
    console.log("'If that book is not in the library mailbox before sunrise you shall never step")
    console.log("foot in here again!' the Librarian barks as you heave the door shut.")

    inquirer
    .prompt
    ([
        {
            name: "moveBeingTaught1",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.moveBeingTaught1 === "") {

            moveBeingTaught2(GS, demon, move)
        }

        else if (answers.moveBeingTaught1 !== "") {

            moveBeingTaught1(GS, demon, move)
        }
    })
}

function moveBeingTaught2 (GS, demon, move)  {

    consoleClear(GS)

    console.log("")
    console.log("You make your way back to your chambers and through the small dank passageway")
    console.log(`to your summoning shrine, placing ${move.tomeName} on the altar plinth.` )
    console.log(`You summon your ${demonName(demon)} and inform it of its task.  It is displeased.`)
    console.log("")
    console.log("Reading from the book, you go about the arduos task of teaching the Demon")
    console.log(`${move.name}, using binding spells and other incantations to ensure the `)
    console.log("creatures subservience.")
    console.log("")
    console.log("It is a great effort, and you feel drained of energy, and your Demon is")
    console.log(`seething (as usual).  But the deed is done and you dismiss ${demonName(demon)}`)

    inquirer
    .prompt
    ([
        {
            name: "moveBeingTaught2",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.moveBeingTaught2 === "") {

            moveBeingTaught3(GS, demon, move)
        }

        else if (answers.moveBeingTaught2 !== "") {

            moveBeingTaught2(GS, demon, move)
        }
    })
}

function moveBeingTaught3 (GS, demon, move)  {

    consoleClear(GS)

    console.log("")
    console.log(`Your energy spent, you close ${move.tomeName} and stand for a moment, enjoying` )
    console.log(`the eerie peace of your shrine now that your ${demonName(demon)} has been` )
    console.log(`desummoned, and the constant, chaotic racket of void wind and dark magic has `)
    console.log("ceased.  You collect yourself and hurriedly head back to the library to drop")
    console.log("off the book in the library mailbox, hopefully sparing yourself the indignity")
    console.log(`of another pitiful, sanctimonious lecture from the volume's keeper.`)
    console.log("")
    console.log("You walk back to your quarters and collapse into your armchair.")
    console.log("")
    console.log(``)

    inquirer
    .prompt
    ([
        {
            name: "moveBeingTaught3",
            message: "Enter to continue..."
        }
    ])
    .then (answers => {

        if (answers.moveBeingTaught3 === "") {

            moveTaughtContinue(GS, demon, move)
        }

        else if (answers.moveBeingTaught3 !== "") {

            moveBeingTaught3(GS, demon, move)
        }
    })
}



















//////////// Data Zone 

let playerHasAccessedLibrary = true // if false, will display library tutorial first. 
let libraryAccessEnabled = true   // if the player can use the library
let day = 1
let time = 1
let displayAccessError = "none"
let playerName = "hard drive bastard"
let enemyName = "Evil Bastard"
let enemyIntroMessage = "none"
let enemyDefeatMessage = "none"
let pWI = []   // player Demon inventory
let items = []
let enemy = {}   // enemy Demon inventory
let soulEnergy = 10000
let enemyBonusSoulEnergy = 0


//// Move repository (probs import this later for tidiness)

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
        canLearn: [ "Void Walker", "Fetid Shadow", "Noble Spirit"]
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



//// Library Inventory

let libraryInventory = [MOVES.fireball, MOVES.enshroud, MOVES.divineHammer]




// Demon INVENTORIES


if ((debugMode) && (debugModeChangesInventory)) { // Sets Demon inventory.  Debug mode allows different default inventory to be set.
    pWI = [
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
        },
        {},
        {
            id: iDGenerator(iDListArray),
            nickname: "none",
            active: false,
            type: light,
            genus: "Ghost",
            species: "Noble Spirit",
            maxHP: 456,
            hP: 0,
            level: 1,
            xp: 0,
            str: 20,
            agi: 40,
            def: 32,
            pow: 70,
            movePP: [1,23,4,2],
            knownMoves: [
                MOVES.tackle,
                {},
                {},
                {}
            ]
        },
        {},
        {},
        {}
    ]
} else {   // Normal (empty) inventory
    pWI = [
        {},
        {},
        {},
        {},
        {},
        {}
    ]
    
}




if ((debugMode) && (debugModeChangesEnemyInventory)) { // If change enemy inv debug mode on:

    

    enemy = {
        enemyBonusSoulEnergy: enemyBonusSoulEnergy,
        enemyName : enemyName,
        enemyIntroMessage : enemyIntroMessage,
        enemyDefeatMessage : enemyDefeatMessage,
        eWI: [
            {  // Demon 1
                id: iDGenerator(iDListArray),
                nickname: "fuckheads",
                active: true,
                type: abyss,
                genus: "Void",
                species: "Void Walker",
                maxHP: 456,
                hP: 456,
                level: 12,
                xp: 4564,
                str: 34,
                agi: 54,
                def: 32,
                pow: 23,
                movePP: [1,3,4,2],
                knownMoves: [
                     MOVES.tackle,
                     MOVES.fireball,
                    {},
                    {}
                ],
                introMessage: "brawler intromessage placeholder"
            },
            {},
            {
                id: iDGenerator(iDListArray),
                nickname: "none",
                active: false,
                type: scourge,
                genus: "Fetid",
                species: "Fetid Shadow",
                maxHP: 456,
                hP: 0,
                level: 22,
                xp: 12034,
                str: 20,
                agi: 40,
                def: 32,
                pow: 70,
                movePP: [1,23,4,2],
                knownMoves: [
                     MOVES.tackle,
                    {},
                    {},
                    {}
                ],
                introMessage: "patrician intromessage placeholder"
            },
            {},
            {},
            {}
        ]
        
    }



} else {   // Normal (empty) inventory
    enemy = {
        enemyBonusSoulEnergy: 0,
        enemyName : "none",
        enemyIntroMessage: "none",
        enemyDefeatMessage: "none",
        eWI : [
            {},
            {},
            {},
            {},
            {},
            {}
        ]
        
    }

}




////
////
////


let gameState = {pWI, items, enemy, playerName, soulEnergy, day, time, displayAccessError,
     playerHasAccessedLibrary, libraryAccessEnabled, libraryInventory}    // Creates gamestate object (becomes GS in arguments).  Contains all modifiable data that the game must keep track of.


////
////
////
















/////////// LAUNCHES THE WHOLE THING

launcher(gameState)

//////////// !!!!!!!!!!!!!!!!!!!!!!!!!!!



/// TODO NEXT

/*


*/




/* Notes:

Having if (userinput !== NaN) seems to fuck some stuff up so keep an eye on that.

Current ID system will break on game load.  Find a way to fix this when its not 3 am.

Add actual AI to enemyTurnLogic

Restore Demon stats after ending a battle for every evantuallity including running away






*/




/* 
Story points:

Reason the player is only allowed to see three books at a time is because they are just an accolyte and accolytes are not allowed to view all books
therefore player must only take from recent returns pile.  

Every five sotry missions, the player could be called for a meeting by their master.  The master is dismissive and patronising until the player becomes
too powerful.  Towards the end of the story, the player kills the master, and the headteacher, and several of the students. 

The player has a nemesis!! Who they fight 3 or 4 times throughout the story.  The penultimate battle is a battle with the nemesis with incredibly strong demons.

The final battle is the player's demons becoming too powerful for the player. The player has to fight the demons but gets absolutely destroyed. 

Mortal shards instead of pokeballs

If player loses battle, one of the demons will be sent to some kind of purgatory and the player will have to pay soul energy to revive it (as punishment for fucking up)

Father is strict and selfish and mother is distant

The player could have to fight the library door at some point.

player has to fight to summon the acolyte from the stone statue

At some point in the game the player kills the librarian in order to gain unfetered access to the library.  After this, all books cost more in soul energy but player can access all of them.

*/



/*
DEFINITE TODOs

Implement dreams / nightmares

Implement ecolutions and evolution messages

player has a power level which dictates how many demons you can control and the chance of catching demons at a particular level

players power level dictates which rituals they can perform at the shrine


*/



/*
STRETCH GOALS

Implement weather system to keep things fresh after player seeing main menu 100000 times

Could make a tutorial that story wise preceeds attending the institution. (Instead of an actual battle it could just be a series of console.log fakes to make it easier!)

Possibly implement a feature where the further on in the story you go the harder it is to sleep, making the player tend to sleep in more and more

Make it so that later on in the story the library door opens easier as it gets used to your soul.


*/
