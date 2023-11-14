from .areas import *
from .battles import *
from .quests import *
from main.player import Player

area_courtyard.define_available_battles([example_battle])
area_cave.define_appearance_conditions(
    [lambda: example_quest.make_progress_check(10, 20)])
area_cave.define_entrance_conditions(
    [lambda: example_quest.make_progress_check(15, 20)])
example_battle.define_lost_action(area_courtyard.process)
example_battle.define_won_action(area_courtyard.process)
