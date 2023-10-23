from .engine import Engine 
from .decision import Decision
from .scene import Scene

class Area:
    def __init__(self, title, visit_text, inside_text, preferred_key):
        self.title = title
        self.visit_text = visit_text
        self.inside_text = inside_text
        self.preferred_key = preferred_key
        self.links_to = []
        self.available_battles = []

    def define_connections(self, area_list):
        self.links_to = area_list

    def define_available_battles(self, battle_list):
        self.available_battles = battle_list

    def process(self):

        for_display = [self.visit_text]
        options = []

        #  Sort Areas
        for area in self.links_to:

            name = area.title
            choice_description = area.visit_text
            preferred_key = area.preferred_key
            action = area.process
            
            options.append(Decision(name, choice_description, preferred_key, action))

        #  Sort Activities
        for battle in self.available_battles:

            name = battle.summoner
            choice_description = battle.challenge_text
            preferred_key = battle.preferred_key
            action = battle.fight
            
            options.append(Decision(name, choice_description, preferred_key, action))

        Engine.remove_scene()
        Engine.add_scene(Scene(for_display, options))

    def activate(self):
        self.process()
