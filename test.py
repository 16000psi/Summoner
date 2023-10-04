import random

class Engine:
    def __init__(self):
        self.stack = []
        self.stack_size = 0

    def stack_add(self, func):
        self.stack.append(func)
        self.stack_size += 1

    def stack_remove(self):
        self.stack.pop()
        self.stack_size -= 1


    def stack_execute(self, *args):
        self.stack[len(self.stack) -1](*args)

def jokefunc(arg):
    def subjoke():
        input(arg)

    return subjoke

engine = Engine()
engine.stack_add(jokefunc("bleep"))
engine.stack_execute()

import random
print(random.uniform(-0.2, 0.2))