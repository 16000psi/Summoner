from .summoner import Summoner
from .quest import Quest

class Player(Summoner):
    def __init__(self, name, demon_inventory):
        super().__init__(name, demon_inventory)

        self.quests = []

    def begin_quest(self, quest):
        self.quests.append(quest)
        quest.increment_progress(1)



        
ep = Player("example", [])
eq = Quest("example q", "quex")

ep.begin_quest(eq)

for quest in ep.quests:
    print(quest)

eq.increment_progress(5)


for quest in ep.quests:
    print(quest)

print(eq.make_progress_check(5,5))
print(eq.make_progress_check(3,6))
print(eq.make_progress_check(2,4))
