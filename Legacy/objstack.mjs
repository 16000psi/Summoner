import inquirer from "inquirer"

import { bigString } from "../wordstest.mjs"

import { display } from "../engine/display.mjs"

const stack = {

    multiPageMenuHolder: [],

    storage: {},

    currentBattle: null,

    size: 0,

    currentExecute: function () {},

    add (item) {

        let length = Object.keys(this.storage).length
    
        this.storage = {...this.storage, [length + 1]: item}
    
        this.size ++
    
        
    },

    multiPageAdd (item) {

        this.multiPageMenuHolder.push({
            
            position: this.multiPageMenuHolder.length,
            pages: item,
            currentPage: 0 

        }) 


        this.add(this.multiPageMenuHolder[this.multiPageMenuHolder.length - 1].pages[this.multiPageMenuHolder[this.multiPageMenuHolder.length - 1].currentPage])
            
    },
    
    remove () {
    
        if (Object.keys(this.storage).length === 0) {
    
            return
        }
    
        delete this.storage[this.size]
    
        this.size --
    
    
    },

    multiPageRemove () {
        
        this.remove()


        if (this.multiPageMenuHolder.length === 0) {
    
            return
        }
    
        this.multiPageMenuHolder.pop()

    
  
    
    
    },
    
    execute (...args) {
    
        if (this.size > 0) {
    
            this.currentExecute = this.storage[this.size]
    
            this.currentExecute(...args)
    
            this.currentExecute = function () {}
        }
    },

    remAddEx (item) {

        this.remove()
        this.add(item)
        this.execute()
    },

    changePage(direction) {

        let currentMultiMenu = this.multiPageMenuHolder[this.multiPageMenuHolder.length - 1]

        
        this.remove()
        
        if (direction === "next") {
            
            currentMultiMenu.currentPage ++
            
            
            
            this.add(currentMultiMenu.pages[currentMultiMenu.currentPage])
        }
        
        else if (direction === "previous") {
            
            currentMultiMenu.currentPage --
            
            this.add(currentMultiMenu.pages[currentMultiMenu.currentPage])
            
        }
        
        this.execute()
    },

    newBattle (battle) {

        this.currentBattle = battle
        this.add(battle.startBattle)

    }
    
    
}


function textProcess (str) {


    // This takes strings and processes them for display.  It iterates over the string and analyses it character by character.

    // When it detects (sBRK) or (dBRK) at the current character + 5, it replaces them with spaces to create either single or 
    // double line breaks.

    // When it detects words that cross over lines, it add spaces before the words so that they start after the line break

    // It then converts the string into an array with each entry representing each line.

    // Finally it converts that shallow array into a deep array with pages represented as entries and lines as subentries

    // Importantly, it depends on a linelength variable  and page lines variable which are currently external

    let lineLength = 60  
    let pageLines = 16   


    for (let i = 0; i < str.length; i ++) {
        
        let subStrBreak = (str.slice(0, i + 6))  // string used to check for breaks

        let subStrUnmodified = subStrBreak   // saves original version to be replaced in the main string

        if (/\(sBRK\)/.test(subStrBreak) === true || /\(dBRK\)/.test(subStrBreak) === true) { // break checker

            let breakIndex = (subStrBreak.match(/\(.BRK\)/)).index

            let spacesToAdd = (lineLength - (breakIndex % (lineLength))) 

            let spaceArray = []

            if (subStrBreak.match(/\(.BRK\)/)[0] === "(dBRK)") {  // if double break, add a line of whitespace

                spacesToAdd += lineLength
            }

            for (let j = 0; j < spacesToAdd; j ++) {
                spaceArray.push(' ')
            }


            subStrBreak = subStrBreak.replace(/\(.BRK\)/, spaceArray.join(''))

            str = str.replace(subStrUnmodified, subStrBreak)

        } 

        if ((i + 1)% lineLength === 0 && i > 1) {                              // word over line checker

            let lineEndChar = str[i]
            let lineBeginChar = str[i + 1]

            if (/\S/.test(lineEndChar) === true && /\S/.test(lineBeginChar)) {  // if line ends with letter and the next line beggins with one

                let whileLoop = true
                let spacesToAdd = 0

                while (whileLoop && spacesToAdd < lineLength) {  // tracks back and finds the last space

                    if (str[i - spacesToAdd] === " ") [

                        whileLoop = false
                    ]

                    else {

                        spacesToAdd ++
                    }


                    if (spacesToAdd === lineLength) {  // if the word is longer than a line, cancels to prevent infinite loop

                        spacesToAdd = 0
                        whileLoop = false
                    }


                }

                let spaceArray = []

                for (let j = 0; j < spacesToAdd; j ++) {

                    spaceArray.push(" ")


                }


                let arr = str.split('')

                arr.splice((i + 1) - spacesToAdd, 0, spaceArray.join(''))  // add the spaces in

                str = arr.join('')

            }


        }

        

        
    }

    // create the array


    let regex = new RegExp ( `\.{1,${lineLength}}`, "g")  

    let arr = str.match(regex)


    // divide the array into a deep array with pages

    let result = [[]]

    let arrTarget = 0

    for (let i in arr) {

        
        if (i % pageLines === 0 && i > 1) {
            
            result.push([])
            arrTarget ++
        }
        
        result[arrTarget].push(arr[i])
        

    }

    return result
}

function arbitraryContinueGenerator (str) {

    let arr = textProcess(str)

    for (let i = arr.length - 1; i >= 0; i --) {

        stack.add(continueConstructor(arr[i], "Enter to continue..."))

    }
}

function continueConstructor (forDisplayTxt, message) {



    return function () {

        display.continue(forDisplayTxt)



        inquirer
        .prompt
        ([
            {
                name: "continueEnter",
                message: message
            }
        ])

        .then (answers => {

            if (answers.continueEnter === "") {

                this.remove()
                this.execute()

                return
            }
            else{

                this.execute()

                return
            }
        })

    }
}

function arbitraryitemSelectGenerator (arr, destination, title) {


    let pagesArr = []
    let page = -1

    let limit = 5

    for (let i = 0; i < arr.length; i ++) {

        if (i % limit === 0) {
            page ++

            pagesArr.push([])
        }

        pagesArr[page].push(arr[i])

    }

    let functionArr = []

    for (let i = 0; i < pagesArr.length; i ++) {

        functionArr.push(itemSelectConstructor(pagesArr[i], destination, title, pagesArr.length, (i + 1)))

    }

    stack.multiPageAdd(functionArr)

}

function itemSelectConstructor (itemArr, destination, title, totalPages, currentPage) {

    function MenuInvoker() { // here so that you dont have to edit it for all variations


        display.multiItem(itemArr, title)
    }

    if (totalPages === 1) {    // if only one page total

        return function () {

            MenuInvoker()
    
            let message = `Enter 1-${itemArr.length} to select, X to exit.`
    
    
    
    
    
            inquirer
            .prompt
            ([
                {
                    name: "itemSelect",
                    message: message
                }
            ])
    
            .then (answers => {
    
                if (parseInt(answers.itemSelect) > 0 && parseInt(answers.itemSelect) <= itemArr.length) {
    
                    this.multiPageRemove()
                    this.add(destination)
    
                    this.execute(itemArr[parseInt(answers.itemSelect) - 1])
    
                    return
                    
                }
                else if (answers.itemSelect.toUpperCase() === "X") {
    
                    this.multiPageRemove()
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

    else if (totalPages > 1 && currentPage < totalPages && currentPage === 1) {  // if first page

        return function () {

            MenuInvoker()
    
            let message = `Enter 1-${itemArr.length} to select, N for next page and X to exit.`
    
    
    
    
    
            inquirer
            .prompt
            ([
                {
                    name: "itemSelect",
                    message: message
                }
            ])
    
            .then (answers => {
    
                if (parseInt(answers.itemSelect) > 0 && parseInt(answers.itemSelect) <= itemArr.length) {
    
                    this.multiPageRemove()
                    this.add(destination)
    
                    this.execute(itemArr[parseInt(answers.itemSelect) - 1])
    
                    return
                    
                }
                else if (answers.itemSelect.toUpperCase() === "X") {
    
                    this.multiPageRemove()
                    this.execute()
    
                    return
                    
                }
                else if (answers.itemSelect.toUpperCase() === "N") {
    
                    this.changePage("next")
    
                    return
                    
                }
    
                else {
    
                    this.execute()
    
                    return
                }
            })
    
        }

    }

    else if (totalPages > 1 && currentPage < totalPages && currentPage > 1) { // if middle pages

        return function () {

            MenuInvoker()
    
            let message = `Enter 1-${itemArr.length} to select, N for next page, P for previous page and X to exit.`
    
    
    
    
    
            inquirer
            .prompt
            ([
                {
                    name: "itemSelect",
                    message: message
                }
            ])
    
            .then (answers => {
    
                if (parseInt(answers.itemSelect) > 0 && parseInt(answers.itemSelect) <= itemArr.length) {
    
                    this.multiPageRemove()
                    this.add(destination)
    
                    this.execute(itemArr[parseInt(answers.itemSelect) - 1])
    
                    return
                    
                }
                else if (answers.itemSelect.toUpperCase() === "X") {
    
                    this.multiPageRemove()
                    this.execute()
    
                    return
                    
                }
                else if (answers.itemSelect.toUpperCase() === "N") {
    
                    this.changePage("next")
    
                    return
                    
                }
                else if (answers.itemSelect.toUpperCase() === "P") {
    
                    this.changePage("previous")
    
                    return
                    
                }
    
                else {
    
                    this.execute()
    
                    return
                }
            })
    
        }


    }

    else if (totalPages > 1 && currentPage === totalPages) { // if last page

        return function () {

            MenuInvoker()
    
            let message = `Enter 1-${itemArr.length} to select, P for previous page and X to exit.`
    
    
    
    
    
            inquirer
            .prompt
            ([
                {
                    name: "itemSelect",
                    message: message
                }
            ])
    
            .then (answers => {
    
                if (parseInt(answers.itemSelect) > 0 && parseInt(answers.itemSelect) <= itemArr.length) {
    
                    this.multiPageRemove()
                    this.add(destination)
    
                    this.execute(itemArr[parseInt(answers.itemSelect) - 1])
    
                    return
                    
                }
                else if (answers.itemSelect.toUpperCase() === "X") {
    
                    this.multiPageRemove()
                    this.execute()
    
                    return
                    
                }

                else if (answers.itemSelect.toUpperCase() === "P") {
    
                    this.changePage("previous")
    
                    return
                    
                }
    
                else {
    
                    this.execute()
    
                    return
                }
            })
    
        }


    }


    
}

function multiDestinationMenuGenerator (itemArr) {


}





function exampleDestination(letter) {

    console.log("")
    console.log("")
    console.log("you selected letter " + letter)
    console.log("")
    console.log("")

    return


}

// stack.add(EM1)
// stack.add(EM1)
// stack.add(EM1)
// stack.add(continueConstructor("im thedisplay", "im themessage"))

// let continueString = "abcdefghijklmnopqrstuvwxyz0123456789"


// arbitraryContinueGenerator2(continueString)

const bigArr = ["a","b","c","d"/*,"e","f","g","h","i","j","k","l","n","m"*/]

let data = [
    [
        {},
        ["stupid book", "lvl100", "fireball", "2 things can learn this"]
    ],
    [
        {},
        ["nice book", "lvl5", "enshroud", "1 things can learn this"]
    ],
    [
        {},
        ["a truly amazing book, one of the best.  in fact, i'd say it's the best book, possibly ever?", "lvl10", "shit move", "2 things can learn this"]
    ],
    [
        {},
        ["lol", "lvl30", "firebag", "nothing can learn"]
    ],
    [
        {},
        ["tome of doom", "lvl10", "farts", "nothing can learn this"]
    ],
    [
        {},
        ["beep", "lvl10", "boop", "5 can learn this"]
    ],
    [
        {},
        ["tome of doom", "lvl10", "win game with sheer fury and prowess, fearlessly WINNING the game", "nothing can learn this"]
    ],
    [
        {},
        ["yooo", "lvl10", "win game with sheer fury and prowess, fearlessly WINNING the game", "nothing can learn this"]
    ],
    [
        {},
        ["tome of doom", "lvl10", "win game with sheer fury and prowess, fearlessly WINNING the game", "nothing can learn this"]
    ],
    [
        {},
        ["tome of doom", "lvl10", "win game with sheer fury and prowess, fearlessly WINNING the game", "nothing can learn this"]
    ],
    [
        {},
        ["tome of doom", "lvl10", "win game with sheer fury and prowess, fearlessly WINNING the game", "nothing can learn this"]
    ],
    [
        {},
        ["tome of doom", "lvl10", "win game with sheer fury and prowess, fearlessly WINNING the game", "nothing can learn this"]
    ],
    [
        {},
        ["tome of doom", "lvl10", "win game with sheer fury and prowess, fearlessly WINNING the game", "nothing can learn this"]
    ],
    [
        {},
        ["tome of doom", "lvl10", "win game with sheer fury and prowess, fearlessly WINNING the game", "nothing can learn this"]
    ],
    [
        {},
        ["tome of doom", "lvl10", "win game with sheer fury and prowess, fearlessly WINNING the game", "nothing can learn this"]
    ],
    [
        {},
        ["tome of doom", "lvl10", "win game with sheer fury and prowess, fearlessly WINNING the game", "nothing can learn this"]
    ],
    [
        {},
        ["tome of doom", "lvl10", "win game with sheer fury and prowess, fearlessly WINNING the game", "nothing can learn this"]
    ],
    [
        {},
        ["tome of doom", "lvl10", "win game with sheer fury and prowess, fearlessly WINNING the game", "nothing can learn this"]
    ],

]

let multiDestinationArray = ([[exampleDestination, "E to go to the toilet", "E"], [exampleDestination, "G to go to the store", "G"], [exampleDestination, "B to go to your friends parrty", "B"]])


// arbitraryContinueGenerator(bigString)
// arbitraryitemSelectGenerator(data, exampleDestination, "MATITLE")

//multiDestinationMenuGenerator(multiDestinationArray)
// stack.execute()


export {stack}