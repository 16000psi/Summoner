
# Engine could receive a list of possible options, and a list of possible destination functions

# Destination functions could be as so:
# Area.process(), LearnMove(Move), AddMenuLevel(MenuPage), RemoveMenuPage(),
# ChangeSubmenuMenuPage(MenuPage), UseAttack(Move), continue()

# Then the input handler lives in the engine, it asks for the users input and 
# ensures that the input conforms to what we want (in range, valid, etc). It then makes the decided manipulations to the stack based on the function itself.

# There will have to be some part of the code that knows to e.g. add to the stack, remove from the stack, execute next on the stack contextually, because it just seems really dumb if all our destination functions have to include that. Or, all functions could do one of three things: add to the stack, remove and add to the stack, or just remove from the stack

# Or alternatively, there could be a system where every game loop, things that are needed to be diplayed to the user are pushed to some kind of buffer, and then the game works out how many of what types of functions to add to the stack.  This seems like it would be really complicated to set up, but it would make programming the rest of the game a lot easier, because aall we'd have to worry about would be passing information and destinations out of functions to the engine, and then the rest would be handled automatically. 

# We could also do a mix of both, where there is an output_stream destination to pass to, where the automatic continues and readouts would be passed to, and then a Menu optioin which deals with menus and such. There would also be a linear mode for going through linear areas. The game would have to know which mode it was in and deal with it accordingly. 

# One thing to notice is that all menus in the game will have an entry point, a point where game data is changed,and an exit point. In between these points the user is simply browsing menus and it does not matter how many times a particular action is repeated, the game data will not change

# I think the game needs to be designed so that every time game data is changed, it represents a door which can only be crossed in one direction. That means that if a player enters a series of menus and goes say 5 levels deep to perform a data modifying action, the menu must then either exit completely or go back down at most 4 levels deep.  This means basically that game modifying actions should never exist on the stack except for as the function that is currently being executed. 

"""
def example():
    calculations_on_game_data()
    add_to_display(items)
    give_options(options)
"""

# With this example function above, the game data calculations occur at the top.  The game data calculations create output which is then passed to add display items, and also generates options.  The engine could then take the output, and based on the format of the output, generate functions for the stack (for example, one page of text that the user continues through, and then a menu page). It then adds the options to the last page for the stack, and the user then selects an action and the process repeats.

# With this the key element is that the results of the game data calculations are what determine what the output and options will be. This also means that the handler which receives all of the output and opttions will have to smartly generate the resultant functions using closure and push them onto the stack.  Those functions themselves will contain the stack operations (remove, add) so that no game data can be modified during the execution of those functions. I should come up for some nomenclature for these different types of functions so that they can be distinguished. 

"""
Architect functions: These are the functions which operate on the game data and then call the factory functions based on the results
    - Conditional Logic
Factory Functions: These are the constructors which use closure to generate the functions which are added onto the stack 
    - Closure
Product functions: These are the functions generated by the constructor, which contain the information to be displayed and allow the user to pick options
    - Awareness of and control over the stack
Engine functions: These are the utility functions which contain the game loop and extract the info and options from the products
    - Game Loop
Display functions: These functions are called by the engine to generate the display based off the output and options
    - String manipulation 
"""

# All this raises the question of how the code will actually be structured.  I think the engine will simply have to be accessible and modifiable from all products. 

# IDEA - have a dreams system with nightmares and ~ battles ~ where the player fights as themselves and can lose / can win etc with bits of story.

# Question - if there can be an arbitrary amount of sidequests, how does the system keep track of what areas / battles / items to render?


