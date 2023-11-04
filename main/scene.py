from enum import Enum


class SceneMode(Enum):
    """
    Different constants which are attached to scenes and used
    to tell SceneRealiser which method of realisation to use.
    Different modes will require the information in the scene
    to be displayed differently, calling different display methods.
    """
    MENU = 1
    LINEAR = 2
    AREA = 3
    CONTINUE = 4
    PROTOTYPE = 5


class Scene:
    """
    Scene is created by decision processors and pushed onto the
    stack, before being called by the engine as an argument
    in SceneRealiser.realise(). Scenes contain the infromation
    that needs to be displayed to the user as well as the decisions
    which the user can pick.
    """

    def __init__(
        self,
        for_display_list,
        decisions_list,
        mode=SceneMode.PROTOTYPE,
    ):
        self.for_display_list = for_display_list
        self.decisions_list = decisions_list
        self.mode = mode
