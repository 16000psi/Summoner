from .engine import Engine
from .decision import Decision
from .scene import Scene


class Area:
    """
    Represents the state of being in an area. Players are taken to areas via
    Decisions, and this class determines the Scene that is pushed to the
    top of the stack and rendered.  Areas link to other area and battles,
    and can be visited via choosing to enter an area via a Decision.  Areas
    have appearance and entrance condition properties, which are conditions
    that are needed to pass for the area to be visible and visitable by the
    player respectively.
    """

    def __init__(
        self,
        title,
        visit_text,
        not_accessible_text,
        inside_text,
        preferred_key
    ):
        # The name of the area
        self.title = title
        # The text that shows when visiting is a decision e.g. 'visit area1'
        self.visit_text = visit_text
        # For if a player tries to enter an area whilst unable
        self.not_accessible_text = not_accessible_text
        # A description of the area displayed when in the area
        self.inside_text = inside_text
        # The preferred key to select the area in Decisions
        self.preferred_key = preferred_key
        # Conditions that must be passed to appear in Decisions
        self.appearance_conditions = []
        # Conditions that must be passed to be enterable
        self.entrance_conditions = []
        # Areas that are visitable from this area
        self.links_to = []
        # Battles that are accessible from this area
        self.available_battles = []

    def define_connections(self, area_list):
        """
        Define the areas that this area links to in the form of a list of
        area objects.
        """
        self.links_to = area_list

    def define_available_battles(self, battle_list):
        """
        Define the battles that are accessible from this area in the form
        of a list of battle objects.
        """
        self.available_battles = battle_list

    def define_appearance_conditions(self, condition_list):
        """
        When this area is present in another area's links_to list, defines
        the conditions that would need to pass in order for this area's
        representative Decision object to be presented to the user as part
        of the Area's Scene object.
        """
        self.appearance_conditions = condition_list

    def define_entrance_conditions(self, condition_list):
        """
        When this area is present in another area's links_to list, defines
        the conditions that would need to pass in order for this area to be
        enterable.
        """
        self.entrance_conditions = condition_list

    def evaluate_appearance_conditions(self):
        """
        Used to see if this Areas appearance conditions are all met and the
        area's visit Decision can appear in other Area Scenes.
        """
        for condition in self.appearance_conditions:
            if not condition():
                return False
        return True

    def evaluate_entrance_conditions(self):
        """
        Used to see if this Areas entrance conditions are all met and the
        area's visit Decision will allow the user to enter, rather than
        displaying an action unsuccessful scene.
        """
        print(self.entrance_conditions)
        for condition in self.entrance_conditions:
            print(f"condition is evaluated {condition()}")
            if not condition():
                return False
        return True

    def generate_entrance_decision(self):
        """
        Called as part of Scene generation for Areas which contain this
        instance of Area in their links to list. Generates a Decision object
        which if chosen will allow what area to be processed.
        """

        name = self.title
        choice_description = self.visit_text
        preferred_key = self.preferred_key
        action = self.process

        return Decision(name, choice_description, preferred_key, action)

    def generate_entrance_not_accessible_decision(self):
        """
        Called as part of Scene generation for Areas which contain this
        instance of Area in their links to list but which contain conditions
        in their entrance_conditions which are evaluated as false. Generates
        a Decision object which contains an procss_not_acessible action.
        """

        name = self.title
        choice_description = self.visit_text
        preferred_key = self.preferred_key
        action = self.process_not_accessible

        return Decision(name, choice_description, preferred_key, action)

    def process(self):
        """
        This is called from the action property of Decision objects
        representing accessible areas.  It generates the scene and includes
        decisions representing the available Battles and connected Areas.
        """

        for_display = [self.visit_text]
        options = []

        #  Sort Areas
        for area in self.links_to:

            if (
                area.evaluate_appearance_conditions()
                and not area.evaluate_entrance_conditions()
            ):
                options.append(
                    area.generate_entrance_not_accessible_decision())

            elif (
                area.evaluate_appearance_conditions()
                and area.evaluate_entrance_conditions()
            ):
                options.append(area.generate_entrance_decision())

        #  Sort Activities
        for battle in self.available_battles:

            name = battle.summoner
            choice_description = battle.challenge_text
            preferred_key = battle.preferred_key
            action = battle.fight

            options.append(
                Decision(name, choice_description, preferred_key, action))

        Engine.remove_scene()
        Engine.add_scene(Scene(for_display, options))

    def process_not_accessible(self):
        """
        This is called from the action property of Decision objects
        representing places which the player can see but does not
        yet have access to.  It basically adds a scene with a message
        which removes itself upon continuing.
        """

        for_display = [self.not_accessible_text]
        options = []

        name = "continue"
        choice_description = "continue"
        preferred_key = ""
        action = Engine.remove_scene

        options.append(
            Decision(name, choice_description, preferred_key, action))

        Engine.add_scene(Scene(for_display, options))
