import random

class MenuHandler:
    stack = []
    stack_size = 0

    @staticmethod
    def stack_add(func):
        MenuHandler.stack.append(func)
        MenuHandler.stack_size += 1

    @staticmethod
    def stack_remove():
        MenuHandler.stack.pop()
        MenuHandler.stack_size -= 1

    @staticmethod
    def stack_execute(*args):
        MenuHandler.stack[len(MenuHandler.stack) -1](*args)


def jokefunc(arg):
    def subjoke():
        input(arg)

    return subjoke

MenuHandler.stack_add(jokefunc("bleep"))
MenuHandler.stack_add(jokefunc("bleep"))
MenuHandler.stack_execute()
MenuHandler.stack_execute()

import random
print(random.uniform(-0.2, 0.2))
