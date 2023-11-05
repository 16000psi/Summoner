class Decision:
    """
    Decisions are presented to the user as parts of scenes. Players
    choose() a decision which will activate the scene's action function.
    This action function will generate a new scene with it's own set
    of decisions.
    """

    def __init__(
        self,
        name,
        choice_description,
        preferred_key,
        action,
        *args
    ):
        # Name of the decision
        self.name = name
        # A description of the choice e.g. eat a pie
        self.choice_description = choice_description
        # The preferred key which will the user will use to activate decision,
        self.preferred_key = preferred_key
        # The function to be called when the user chooses the decision
        self.action = action
        # Any arguments that need to be passed to the action
        self.args = args

    def choose(self):
        """
        This is called when a decision is chosen by the player. This is
        intended to point to a function which generates a new scene for the
        stack, for instance Area.Process.
        """
        self.action(*self.args)
        print(self.args)
