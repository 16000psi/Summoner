from .summoner import Summoner


class Player(Summoner):
    def __init__(self, name, demon_inventory, wealth):
        super().__init__(name, demon_inventory)
        self.wealth = wealth

        self.quests = []

    def begin_quest(self, quest):
        self.quests.append(quest)
        quest.increment_progress(1)


player = Player("EXAMPLE_PLAYERNAME", [], 200)
