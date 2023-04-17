export const display = {

    setLines : [
        "---------Replace these lines with border display. Length of each line is 80.----",
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
        "--------------------------------------------------------------------------------",
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
        "--------------------------------------------------------------------------------",
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
        "--------------------------------------------------------------------------------",
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
        "--------------------------------------------------------------------------------",
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
        "--------------------------------------------------------------------------------",
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
        "--------------------------------------------------------------------------------",
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
        "--------------------------------------------------------------------------------",
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
        "--------------------------------------------------------------------------------",
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
        "--------------------------------------------------------------------------------",
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
        "--------------------------------------------------------------------------------"
    ],

    emptyLine : "~                           ~º~                            ~",

    continue (arrText60x16) {  // processes text for longer prose continue sections.

        /* This function takes an array of strings (representing a page of lines of text) and modifies the strings so that they are all neatly arranged
        on the display, and importantly leave the side 10 characters on each side (the ascii graphics border) untouched. */

        // takes an array, each entry in the array being an array of up to 16 strings, each of up to 60 length.

        let newDisplay = [...this.setLines]

        for (let i = 3; i < arrText60x16.length + 3; i ++) {

        
            let lineForInsertion = arrText60x16[i - 3]

            if (typeof lineForInsertion === "undefined") {  // if nothing add empty line

                lineForInsertion = ""
            }

            lineForInsertion = lineForInsertion.replace(/^\s+/, "")  // remove leading

            lineForInsertion = lineForInsertion.replace(/\s+$/, "")  // remove trailing

            let length = lineForInsertion.length

            let lineArr = lineForInsertion.split('')

            if (length < 60) {   // add spaces either side until length 60

                while (lineArr.length < 60) {

                    lineArr.unshift(" ")

                    if (lineArr.length < 60) {

                        lineArr.push(" ")
                    }

                }
            }

            lineForInsertion = lineArr.join('')


            // replace set lines with display line

            let arr = newDisplay[i].split('')

            arr.splice(10,60, lineForInsertion) 

            newDisplay[i] = arr.join('')


        }

        console.clear()

        for (let i in newDisplay) {

            console.log(newDisplay[i])
        } 
    },

    multiItem (arrNestedItemInfo, title = "PLACEHOLDER") {

        let arr = JSON.parse(JSON.stringify(arrNestedItemInfo)) // deep copy array kinda.  Say goodby to method, or something apparently.

        // let arr = structuredClone(arrNestedItemInfo) another option 


        let finalArr = []

        let textArr = []

        for (let i in arr) {

            textArr.push(arr[i][1])
        } 

        let secondItemMaxLength = 0

        for (let i in textArr){

            if (textArr[i][1].length > secondItemMaxLength) {
                secondItemMaxLength = textArr[i][1].length
            }

        }

        let firstItemMaxPossible = 60 - secondItemMaxLength

        for (let i in textArr) {  // sorts first and second items out

            if (textArr[i][0].length > firstItemMaxPossible) {

                let subArr = textArr[i][0].split('')

                textArr[i][0] = subArr.slice(0, (firstItemMaxPossible - 4)).join('') + "... "

            }

            let spaceToFillItem1 = firstItemMaxPossible - textArr[i][0].length

            for (let j = 0; j < spaceToFillItem1; j ++) {

                if (textArr[i][0].length % 3 === 2 && j > 1 && j < spaceToFillItem1 - 1 ) {

                    textArr[i][0] += "-"

                }

                else {

                    textArr[i][0] += " "
                }
            }


            while (textArr[i][1].length < secondItemMaxLength) {

                textArr[i][1] += " "
            }

        }



        let fourthItemMaxLength = 0

        for (let i in textArr){

            if (textArr[i][3].length > fourthItemMaxLength) {
                fourthItemMaxLength = textArr[i][3].length
            }
        }

        let thirdItemMaxPossible = 60 - fourthItemMaxLength

        for (let i in textArr) {  // sorts third and fourth items out

            if (textArr[i][2].length > thirdItemMaxPossible) {

                let subArr = textArr[i][2].split('')

                textArr[i][2] = subArr.slice(0, (thirdItemMaxPossible - 4)).join('') + "... "

            }

            let spaceToFillItem3 = (thirdItemMaxPossible - textArr[i][2].length) + (fourthItemMaxLength - textArr[i][3].length)

            for (let j = 0; j < spaceToFillItem3; j ++) {

                textArr[i][2] += " "
            }


        }

        for (let i in arr) {  // makes final array to be processed into the display

            finalArr.push(textArr[i][0] + textArr[i][1])
            finalArr.push(textArr[i][2] + textArr[i][3])

            if (i < arr.length - 1) {

                finalArr.push(this.emptyLine)
            }
        }



        let newDisplay = [...this.setLines]


        let titleLine = this.emptyLine

        let titleLength = title.length

        if (titleLength % 2 === 1) {

            title += " "

            titleLength++
        }

        titleLine = titleLine.split(' ')

        titleLine.splice(((60 / 2) - (titleLength / 2)) - 1, titleLength, title + "  ")

        titleLine = titleLine.join(' ')

        let arrTitleLine = newDisplay[2].split('')

        arrTitleLine.splice(10,60, titleLine) 

        newDisplay[2] = arrTitleLine.join('')


        for (let i = 4; i < finalArr.length + 4; i ++) {

        
            let lineForInsertion = finalArr[i - 4]

            if (typeof lineForInsertion === "undefined") {  // if nothing add empty line

                lineForInsertion = this.emptyLine
            }

            let arr = newDisplay[i].split('')

            arr.splice(10,60, lineForInsertion) 

            newDisplay[i] = arr.join('')


        }

        console.clear()

        for (let i in newDisplay) {

            console.log(newDisplay[i])
        } 




        

    }
}

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
        ["tome of doom", "lvl10", "win game with sheer fury and prowess, fearlessly WINNING the game", "nothing can learn this"]
    ],
]


//display.multiItem(data)
