class Quest:
    """
    This object represents a quest. Quests represent storylines in the game,
    and different areas / battles can be locked behind a certain level of
    progress for a particular quest.  Quest objects are added to player
    object active quest lists for easy saving / access.  Each quest object
    represent a single storyline.
    """

    def __init__(self, name, slug):
        # The title of the quest
        self.name = name
        # The shortened title of the quest
        self.slug = slug
        # The progress level of the quest, representing the players progress
        self.progress_level = 0

    def increment_progress(self, ammount):
        """
        Used to change the player's progress at a quest.
        """
        self.progress_level += ammount

    def make_progress_check(self, minimum_level, maximum_level):
        """
        Checks if the players quest progress level matches the level
        requirements. This can be called e.g. as part of an Area's
        appearance_conditions list."""
        if (
            self.progress_level >= minimum_level
            and self.progress_level <= maximum_level
        ):
            return True
        else:
            return False

    def __str__(self):
        return f"({self.slug}) {self.name}: {self.progress_level}"
