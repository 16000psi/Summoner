from .scene import SceneMode


class SceneRealiser:
    @staticmethod
    def realise(scene):
        """
        This is called on the engine and used to process a scene
        (a an object containing the information and decisions to
        display to the player). Depending on the scene mode,
        a different method is called to display the scene.
        """

        if scene.mode == SceneMode.PROTOTYPE:
            SceneRealiser.process_prototype(scene)

    @staticmethod
    def process_prototype(scene):
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
