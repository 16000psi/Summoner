from .engine import Engine 
from .decision import Decision
from .scene import Scene

class Area:
    def __init__(self, title, visit_text, not_accessible_text, inside_text, preferred_key):
        self.title = title
        self.visit_text = visit_text
        self.not_accessible_text = not_accessible_text
        self.inside_text = inside_text
        self.preferred_key = preferred_key
        self.appearance_conditions = []
        self.entrance_conditions = []
        self.links_to = []
        self.available_battles = []

    def define_connections(self, area_list):
        self.links_to = area_list

    def define_available_battles(self, battle_list):
        self.available_battles = battle_list

    def define_appearance_conditions(self, condition_list):
        self.appearance_conditions = condition_list

    def define_entrance_conditions(self, condition_list):
        self.entrance_conditions = condition_list

    def evaluate_appearance_conditions(self):
        for condition in self.appearance_conditions:
            if not condition():
                return False
        return True
    
    def evaluate_entrance_conditions(self):
        print(self.entrance_conditions)
        for condition in self.entrance_conditions:
            print(f"condition is evaluated {condition()}")
            if not condition():
                return False
        return True


    def generate_entrance_decision(self):

        name = self.title
        choice_description = self.visit_text
        preferred_key = self.preferred_key
        action = self.process

        return Decision(name, choice_description, preferred_key, action)

    def generate_entrance_not_accessible_decision(self):

        name = self.title 
        choice_description = self.visit_text
        preferred_key = self.preferred_key
        action = self.process_not_accessible

        return Decision(name, choice_description, preferred_key, action)

    def process(self):

        for_display = [self.visit_text]
        options = []

        #  Sort Areas
        for area in self.links_to:
            
            if area.evaluate_appearance_conditions() and not area.evaluate_entrance_conditions():
                options.append(area.generate_entrance_not_accessible_decision())

            elif  area.evaluate_appearance_conditions() and area.evaluate_entrance_conditions():
                options.append(area.generate_entrance_decision())

        #  Sort Activities
        for battle in self.available_battles:

            name = battle.summoner
            choice_description = battle.challenge_text
            preferred_key = battle.preferred_key
            action = battle.fight
            
            options.append(Decision(name, choice_description, preferred_key, action))

        Engine.remove_scene()
        Engine.add_scene(Scene(for_display, options))
    
    def process_not_accessible(self):

        for_display = [self.not_accessible_text]
        options = []

        name = "continue"
        choice_description = "continue"
        preferred_key = ""
        action = Engine.remove_scene

        options.append(Decision(name, choice_description, preferred_key, action))

        Engine.add_scene(Scene(for_display, options))




