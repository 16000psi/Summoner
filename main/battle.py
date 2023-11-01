from .engine import Engine
from .scene import Scene
from .decision import Decision


class Battle:
    def __init__(
            self,
            summoner,
            challenge_text,
            preferred_key,
            battle_intro_text,
            battle_lost_text,
            battle_won_text
        ):

        self.summoner = summoner
        self.challenge_text = challenge_text
        self.preferred_key = preferred_key
        self.battle_intro_text = battle_intro_text
        self.battle_lost_text = battle_lost_text
        self.battle_won_text = battle_won_text
        self.lost_action = None
        self.won_action = None

    def define_lost_action(self, lost_action):
        self.lost_action = lost_action

    def define_won_action(self, won_action):
        self.won_action = won_action

    def fight(self):

        for_display = [self.battle_intro_text]
        options = []

        win_name = "Win the battle"
        win_description = "Win the battle"
        win_preferred_key = "w"
        win_action = self.win

        loss_name = "Lose the battle"
        loss_description = "Lose the battle"
        loss_preferred_key = "l"
        loss_action = self.lose

        options.append(Decision(win_name, win_description,
                                win_preferred_key, win_action))
        options.append(Decision(loss_name, loss_description,
                                loss_preferred_key, loss_action))

        Engine.remove_scene()
        Engine.add_scene(Scene(for_display, options))

    def activate(self):
        self.fight()

    def win(self):

        for_display = [self.battle_won_text]
        options = []

        continue_name = "continue"
        continue_description = "continue"
        continue_preferred_key = ""
        continue_action = self.won_action

        options.append(Decision(continue_name, continue_description,
                                continue_preferred_key, continue_action))

        Engine.remove_scene()
        Engine.add_scene(Scene(for_display, options))

    def lose(self):

        for_display = [self.battle_won_text]
        options = []

        continue_name = "continue"
        continue_description = "continue"
        continue_preferred_key = ""
        continue_action = self.lost_action

        options.append(Decision(continue_name, continue_description,
                                continue_preferred_key, continue_action))

        Engine.remove_scene()
        Engine.add_scene(Scene(for_display, options))
