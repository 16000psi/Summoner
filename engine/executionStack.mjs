import inquirer from "inquirer"

import { bigString } from "./../wordstest.mjs"

import { display } from "./display.mjs"

export const stack = {

    /* This is the core of the program, where the various menu and battle functions are called and executed.  It is a stack with the 
    type of functions you would expect - remove, add, etc.  It calls functions from the top of the stack to the currentExecute key, where 
    they are executed (this is to give the function full access to the rest of the contents of the stack using .this).  Battles are stored 
    seperately in currentBattle, and mutli page menus are added to their own array (this is so that the correct page of a menu can be recalled
    when exiting another menu, and so that the pages do not all have to be stored in the stack, only the current one, with the bonus that since
    the other pages of the menu are being stored in parralel, the menu can be navigated as normal without effecting the rest of the stack.  
    Basically, multi page menus swap out the currently executed function, rather than adding / removing them from the stack.) */

    multiPageMenuHolder: [],

    storage: {},

    currentBattle: null,

    size: 0,

    currentExecute: function () {},

    add (item) {

        // adds a function to the top of the stack!

        let length = Object.keys(this.storage).length
    
        this.storage = {...this.storage, [length + 1]: item}
    
        this.size ++
    
        
    },

    multiPageAdd (item) {

        // adds a new multipage menu function to the stack. Like a normal add, but also adds all the pages to this.multiPageMenuHolder, so that the
        // pages can be accessed in parralel to the stack without messing around with loads of adding / removing / splicing items in the stack. 

        this.multiPageMenuHolder.push({
            
            position: this.multiPageMenuHolder.length,
            pages: item,
            currentPage: 0 

        }) 


        this.add(this.multiPageMenuHolder[this.multiPageMenuHolder.length - 1].pages[this.multiPageMenuHolder[this.multiPageMenuHolder.length - 1].currentPage])
            
    },
    
    remove () {
        
        // removes the top function from the stack
    
        if (Object.keys(this.storage).length === 0) {
    
            return
        }
    
        delete this.storage[this.size]
    
        this.size --
    
    
    },

    multiPageRemove () {

        // is called when a page from a multi page menu is being removed from the stack. (Like a normal remove 
        // but also removes the multi page menu entry from the stack multipagemenu array.)
        
        this.remove()


        if (this.multiPageMenuHolder.length === 0) {
    
            return
        }
    
        this.multiPageMenuHolder.pop()

    
  
    
    
    },
    
    execute (...args) {

        // Pulls the function on the stack to the currentExecute key, so that the function itself can access the entire stack object and its methods
        // using this.currentExecute.
    
        if (this.size > 0) {
    
            this.currentExecute = this.storage[this.size]
    
            this.currentExecute(...args)
    
            this.currentExecute = function () {}
        }
    },

    remAddEx (item) {

        // This just removes, adds and executes functions in one line of code.  Useful in linear sequences like battles. 

        this.remove()
        this.add(item)
        this.execute()
    },

    changePage(direction) {

        // used to change the page when viewing multi page menus

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

        // initiates a new battle. The battle object is added to the stacks's currentBattle key, and then all
        // the methods on the battle can be executed on the stack (as they are pulled to currentExecute) and accessed 
        // through .this.currentBattle.function()

        this.currentBattle = battle
        this.add(battle.startBattle)

    }
    
    
}
