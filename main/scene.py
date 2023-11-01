from enum import Enum


class SceneMode(Enum):
    MENU = 1
    LINEAR = 2
    AREA = 3
    CONTINUE = 4


class Scene:

    def __init__(self, for_display_list, decisions_list):
        self.for_display_list = for_display_list
        self.decisions_list = decisions_list
