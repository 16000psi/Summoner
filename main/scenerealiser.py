from main.scene import SceneMode
from main.display import Display
from main.data.border import border

from main.player import player


class SceneRealiser:
    @classmethod
    def realise(cls, scene):
        """
        This is called on the engine and used to process a scene
        (a an object containing the information and decisions to
        display to the player). Depending on the scene mode,
        a different method is called to display the scene.
        """

        if scene.mode == SceneMode.PROTOTYPE:
            cls.process_prototype(scene)
        elif scene.mode == SceneMode.AREA:
            cls.process_area(scene)

    @classmethod
    def process_options(cls, decisions_list):

        decisions_and_chosen_keys = cls.get_keys_for_decisions(
            decisions_list)

        valid_options = []

        options_text_list = []
        for_first_line = "empty decisions line"
        for_second_line = "empty decisions line"
        for i, decision in decisions_and_chosen_keys.items():
            options_text_list.append(
                f"{i}: {decision.choice_description}.")
            valid_options.append(str(i))

        options_text = '  '.join(options_text_list)

        if len(options_text) > Display.line_length:
            for_first_line = options_text[:Display.line_length]
            for_second_line = options_text[
                Display.line_length:
                Display.line_length * 2
            ]
        else:
            for_first_line = options_text

        print(Display.cut_line_into_background_border(
            for_first_line, border[21]))
        print(Display.cut_line_into_background_border(
            for_second_line, border[22]))

        player_selection = input("Select a key and hit enter:")

        if player_selection in valid_options:
            decisions_and_chosen_keys[player_selection].choose()

        else:
            pass
            # Restart the cycle!!!!!!

    @classmethod
    def get_keys_for_decisions(cls, decisions_list):
        fallback_characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        result = {}
        for decision in decisions_list:
            if decision.preferred_key.upper() in result:
                for character in fallback_characters:
                    if character not in result:
                        result[character] = decision
                        break
            # TODO - raise error somehow here if all fallback characters cycled through
            else:
                result[decision.preferred_key.upper()] = decision
        return result

    @classmethod
    def process_prototype(cls, scene):
        """
        Prints for diplay list and options in the most generic way,
        not calling any display methods, for testing / prototyping.
        """

        print(scene.for_display_list)

        for i, decision in enumerate(scene.decisions_list):
            print(f"press {i} to {decision.choice_description}")

        choice = input("Select something \n")

        try:
            choice = int(choice)
        except ValueError:
            return

        if choice < 0 or choice > len(scene.decisions_list)-1:
            return

        else:
            scene.decisions_list[choice].choose()

    @classmethod
    def process_area(cls, scene):
        """
        """

        print(Display.cut_line_into_background_border(
            "TOP LINE TITLE", border[0]))
        print(Display.cut_line_into_background_border(
            "Line 2 empty", border[1]))

        date_name_money_line = Display.evenly_space_nargs_strings_in_line(
            "EXAMPLE DATE",
            player.name,
            '£' + str(player.wealth),
        )
        print(Display.cut_line_into_background_border(
            date_name_money_line, border[2]))
        for i in range(3, 21):
            if i == 0:
                print(Display.cut_line_into_background_border(
                    "TOP LINE TITLE", border[i]))
            elif i == 1:
                print(Display.cut_line_into_background_border(
                    "Line 2 empty", border[i]))
            elif i == 5:
                print(Display.cut_line_into_background_border(
                    scene.for_display_list[0], border[i]))
            elif i == 20:
                print(Display.cut_line_into_background_border(
                    "display / options dividing line", border[i]))

            else:
                print(border[i])

        cls.process_options(scene.decisions_list)
